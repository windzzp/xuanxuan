/**
 * The server file of wsocket current module of xxd.
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
    "xxd/api"
    "xxd/hyperttp/server"
    "xxd/util"
)

const webSocket = "/ws"

func InitWs() {
    hub := newHub()
    go hub.run()

    // 初始化路由
    http.HandleFunc(webSocket, func(w http.ResponseWriter, r *http.Request) {
        serveWs(hub, w, r)
    })

    addr := util.Config.Ip + ":" + util.Config.ChatPort
    util.Log("info", "WebSocket start, listen addr: %s %s", addr, webSocket)

    go cronReport(hub)

    // 创建服务器
    if util.Config.IsHttps != "1" {
        err := http.ListenAndServe(addr, nil)
        if err != nil {
            util.Log("error", "webSocket server listen err: %s", err)
            util.Exit("WebSocket server listen err")
        }
    } else {
        crt, key, error := server.CreateSignedCertKey()
        if error != nil {
            util.Log("error", "WSS SSL config err: %s", error)
            util.Exit("WSS SSL create file err")
        }

        err := http.ListenAndServeTLS(addr, crt, key, nil)
        if err != nil {
            util.Log("error", "WSS webSocket server listen err: %s", err)
            util.Exit("WSS webSocket server listen err")
        }
    }
}

//Report offline user id and send fail message id
//Get notify send to client
func cronReport(hub *Hub) {
    go func() {
        reportTicker := time.NewTicker(60 * time.Second)
        changeTicker := time.NewTicker(60 * time.Second)

        defer func() {
            reportTicker.Stop()
            changeTicker.Stop()
        }()

        for util.Run {
            select {
            case <-reportTicker.C:
                for language := range util.Languages {
                    for server := range util.Config.RanzhiServer {
                        messages, err := api.ReportAndGetNotify(server, language)
                        if messages != nil && err == nil {
                            for userID, message := range messages {
                                if client, ok := hub.clients[server][userID]; ok {
                                    client.send <- message
                                }
                            }
                        }
                    }
                }

            case <-changeTicker.C:
                for language := range util.Languages {
                    for server := range util.Config.RanzhiServer {
                        getList, err := api.CheckUserChange(server, language)
                        if getList != nil && err == nil {
                            for _, client := range hub.clients[server] {
                                client.send <- getList;
                            }
                        }
                    }
                }
            }
        }
    }()
}
