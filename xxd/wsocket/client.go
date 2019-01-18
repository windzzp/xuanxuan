/**
 * The client file of wsocket current module of xxd.
 *
 * @copyright   Copyright 2009-2017 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Archer Peng <pengjiangxiu@cnezsoft.com>
 * @package     wsocket
 * @link        http://www.zentao.net
 */
package wsocket

import (
    "net/http"
    "time"

    "github.com/gorilla/websocket"
    "xxd/api"
    "xxd/util"
)

const (
    // Time allowed to write a message to the peer.
    writeWait = 10 * time.Second

    // Time allowed to read the next pong message from the peer.
    pongWait = 20 * time.Second

    // Send pings to peer with this period. Must be less than pongWait.
    pingPeriod = (pongWait * 9) / 10

    // Maximum message size allowed from peer.
    maxMessageSize = 20480
)

var (
    newline = []byte{'\n'}
    space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  20480,
    WriteBufferSize: 20480,
}

// Client is a middleman between the websocket connection and the hub.
type Client struct {
    hub         *Hub
    conn        *websocket.Conn // The websocket connection.
    send        chan []byte     // Buffered channel of outbound messages.
    serverName  string          // User server
    userID      int64           // Send to user id
    repeatLogin bool
    cVer        string //client version
    lang        string
}

type ClientRegister struct {
    client    *Client
    retClient chan *Client
}

// send message struct
type SendMsg struct {
    serverName string // send ranzhi server name
    usersID    []int64
    message    []byte
}

//解析数据.
func dataProcessing(message []byte, client *Client) error {
    parseData, err := api.ApiParse(message, util.Token)
	parseData["client"] = client.conn.RemoteAddr()
    if err != nil {
        util.Log("error", "Receive client message error")
        return err
    }

    if util.IsTest && parseData.Test() {
        return testSwitchMethod(message, parseData, client)
    }

    return switchMethod(api.ApiUnparse(parseData, util.Token), parseData, client)
}

//根据不同的消息体选择对应的处理方法
func switchMethod(message []byte, parseData api.ParseData, client *Client) error {
    util.LogDetail("[switchMethod」API Module : " + parseData.Module() + ", Method : " + parseData.Method())
    switch parseData.Module() + "." + parseData.Method() {
    case "chat.login":
        if err := chatLogin(parseData, client); err != nil {
            return err
        }
        break

    case "chat.typing":
        chatTyping(parseData, client)
        break

    case "chat.logout":
        client.conn.Close()
        /*
        if err := chatLogout(parseData.UserID(), client); err != nil {
            return err
        }
        */
        break

    default:
        err := transitData(message, parseData.UserID(), client)
        if err != nil {
            util.Log("error", "Transit data error: %s", err)
        }
        break
    }

    return nil
}

func chatTyping(parseData api.ParseData, client *Client) error {

    params, _ := parseData["params"]
    ret := params.([]interface{})

    typingData := make(map[string]interface{})
    typingData["cgid"]   = ret[1]
    typingData["typing"] = ret[2]
    typingData["user"]   = parseData["userID"]

    typing := make(map[string]interface{})
    typing["module"] = "chat"
    typing["method"] = "typing"
    typing["result"] = "success"
    typing["data"]   = typingData

    x2cMessage := api.ApiUnparse(typing, util.Token)
    sendUsers := make([]int64, len(ret[0].([]interface{})))
    for i, v := range ret[0].([]interface{}) {
        sendUsers[i] = int64(v.(float64))
    }

    return X2cSend(client.serverName, sendUsers, x2cMessage, client)
}

//用户登录
func chatLogin(parseData api.ParseData, client *Client) error {
    client.serverName = parseData.ServerName()
    if client.serverName == "" {
        client.serverName = util.Config.DefaultServer
    }

    //判断最大在线用户数
    if util.Config.MaxOnlineUser > 0 {
        onlineUser := len(client.hub.clients[client.serverName])
        if int64(onlineUser) >= util.Config.MaxOnlineUser {
            client.send <- api.BlockLogin()
            return util.Errorf("Exceeded the maximum limit.")
        }
    }

    //当前用户语言
    client.lang = parseData.Lang()
    if _, ok := util.Languages[client.lang]; ok == false {
        util.Languages[client.lang] = client.lang
    }

    //map[int]map[string]interface{}
    retMessages, err := api.ChatLogin(parseData)
    if err != nil || retMessages[0]["userID"] == nil {
        // 登录失败返回错误信息
        client.send <- retMessages[0]["message"].([]byte)
        return util.Errorf("%s", "chat login error")
    }

    for key, _ := range retMessages {
        if key == 0 {
            client.userID = retMessages[0]["userID"].(int64)

        }
        client.send <- retMessages[key]["message"].([]byte)
    }

    // 生成并存储文件会员
    userFileSessionID, err := api.UserFileSessionID(client.serverName, client.userID, client.lang)
    if err != nil {
        util.Log("error", "Chat user create file session error: %s", err)
        //返回给客户端登录失败的错误信息
        return err
    }
    // 成功后返回userFileSessionID数据给客户端
    client.send <- userFileSessionID

    // 推送当前登录用户信息给其他在线用户
    // 因为是broadcast类型，所以不需要初始化userID
    client.hub.broadcast <- SendMsg{serverName: client.serverName, message: retMessages[0]["message"].([]byte)}

    cRegister := &ClientRegister{client: client, retClient: make(chan *Client)}
    defer close(cRegister.retClient)

    // 以上成功后把socket加入到管理
    client.hub.register <- cRegister
    if retClient := <-cRegister.retClient; retClient.repeatLogin {
        //客户端收到信息后需要关闭socket连接，否则连接不会断开
        retClient.send <- api.RepeatLogin()
        return nil
    }

    return nil
}

//会话退出
func chatLogout(userID int64, client *Client) error {
    if client.userID != userID {
        return util.Errorf("%s", "user id error.")
    }
    if client.repeatLogin {
        return nil
    }
    retMessages, err := api.ChatLogout(client.serverName, client.userID, client.lang)
    if err != nil {
        return err
    }

    for key, _ := range retMessages {
        X2cSend(client.serverName, retMessages[key]["users"].([]int64), retMessages[key]["message"].([]byte), client)
    }

    util.DelUid(client.serverName, util.Int642String(client.userID))
    return nil
}

//交换数据
func transitData(message []byte, userID int64, client *Client) error {
    if client.userID != userID {
        return util.Errorf("%s", "user id err")
    }

    retMessages, err := api.TransitData(message, client.serverName)

    if err != nil {
        // 与然之服务器交互失败后，生成error并返回到客户端
        errMsg, retErr := api.RetErrorMsg("0", "time out")
        if retErr != nil {
            return retErr
        }

        client.send <- errMsg
        return err
    }

    for key, _ := range retMessages {
        X2cSend(client.serverName, retMessages[key]["users"].([]int64), retMessages[key]["message"].([]byte), client)
    }

    return nil
}

//Send the message from XXD to XXC.
//If the user is empty, broadcast messages.
func X2cSend(serverName string, sendUsers []int64, message []byte, client *Client) error {
    if len(sendUsers) == 0 {
        client.hub.broadcast <- SendMsg{serverName: serverName, message: message}
        return nil
    }

    client.hub.multicast <- SendMsg{serverName: serverName, usersID: sendUsers, message: message}
    return nil
}

// readPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Client) readPump() {
    defer func() {
        c.hub.unregister <- c
        c.conn.Close()
        chatLogout(c.userID, c) // user logout
    }()
    c.conn.SetReadLimit(maxMessageSize)
    c.conn.SetReadDeadline(time.Now().Add(pongWait))
    c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

    util.LogDetail("[readPump」readPump pumps messages from the websocket connection to the hub.")
    for util.Run {
        _, message, err := c.conn.ReadMessage()
        if err != nil {
            if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
                util.Log("error", "Is unexpected close error: %v", err)
            }

            util.Log("error", "read pump error: %v", err)
            break
        }

        //返回user id 、登录响应的数据、ok
        if dataProcessing(message, c) != nil {
            util.Log("info", "Client ip: %s", c.conn.RemoteAddr())
            break
        }
    }
}

// writePump pumps messages from the hub to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) writePump() {
    ticker := time.NewTicker(pingPeriod)
    defer func() {
        ticker.Stop()
        c.conn.Close()
    }()
    util.LogDetail("[writePump」writePump pumps messages from the hub to the websocket connection.")
    for util.Run {
        select {
        case message, ok := <-c.send:
            c.conn.SetWriteDeadline(time.Now().Add(writeWait))
            if !ok {
                // The hub closed the channel.
                c.conn.WriteMessage(websocket.CloseMessage, []byte{})
                util.Log("error", "The hub closed the channel")
                return
            }
            if err := c.conn.WriteMessage(websocket.BinaryMessage, message); err != nil {
                go sendFail(message, c)
                util.Log("error", "write message error %s", err)
                return
            }

            n := len(c.send)
            for i := 0; i < n; i++ {
                if err := c.conn.WriteMessage(websocket.BinaryMessage, <-c.send); err != nil {
                        util.Log("error", "write message error %s", err)
                    return
                }
            }

        case <-ticker.C:
            c.conn.SetWriteDeadline(time.Now().Add(writeWait))
            if err := c.conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
                util.Log("error", "write ping message error: %s", err)
                return
            }
        }
    }
}

func sendFail(message []byte, c *Client) {
    parseData, err := api.ApiParse(message, util.Token)
    if err != nil {
        util.Log("error", "[sendFail] Receive client message error")
        return
    }

    if parseData.Module()+"."+parseData.Method() == "chat.message" {
        if data, ok := parseData["data"].([]interface{}); ok {
            for _, item := range data {
                dataMap := item.(map[string]interface{})
                if gid, ok := dataMap["gid"].(string); ok {
                    util.DBInsertSendfail(c.serverName, c.userID, gid)
                }
            }
        }
    }
}

// serveWs handles websocket requests from the peer.
func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
    // Delete origin header @see https://www.iphpt.com/detail/86/
    r.Header.Del("Origin")

    //将xxd版本信息通过header返回给客户端
    header := http.Header{"User-Agent": {"easysoft/xuan.im"}, "xxd-version": {util.Version}}

    conn, err := upgrader.Upgrade(w, r, header)
    if err != nil {
        util.Log("error", "[serveWs」Serve ws upgrader error: %s", err)
        return
    }

    client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256), repeatLogin: false, cVer: r.Header.Get("version")}
    util.LogDetail("[serveWs」Create web socket conn")

    util.Log("info", "[serveWs」Client ip: %s", conn.RemoteAddr())
    go client.writePump()
    client.readPump()
}
