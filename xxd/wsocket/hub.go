/**
 * The hub file of websocket current module of xxd.
 *
 * @copyright   Copyright 2009-2017 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Archer Peng <pengjiangxiu@cnezsoft.com>
 * @package     wsocket
 * @link        http://www.zentao.net
 */
package wsocket

import "xxd/util"

// safely close channel, prevents closing the channel twice
// https://go101.org/article/channel-closing.html
func safeClose(ch chan []byte) (justClosed bool) {
    defer func() {
        if recover() != nil {
            util.Log("error", "Tried to close a closed chan")
            justClosed = false
        }
    }()
    close(ch)
    return true
}

// hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
    clients map[string]map[string]map[int64]*Client // Registered clients. map[ranzhiName][clientID]*Client

    // Inbound messages from the clients.
    multicast chan SendMsg
    broadcast chan SendMsg

    register   chan *ClientRegister // Register requests from the clients.
    unregister chan *Client         // Unregister requests from clients.
}

func newHub() *Hub {
    hub := &Hub{
        multicast:  make(chan SendMsg),
        broadcast:  make(chan SendMsg),
        register:   make(chan *ClientRegister),
        unregister: make(chan *Client),
        clients:    make(map[string]map[string]map[int64]*Client),
    }

    for ranzhiName := range util.Config.RanzhiServer {
		hub.clients[ranzhiName] =  map[string]map[int64]*Client{}
    	for _, plat := range util.Plats{
			hub.clients[ranzhiName][plat] = map[int64]*Client{}
		}
    }

    return hub
}

func (h *Hub) run() {
    for util.Run {
        select {
        case cRegister := <-h.register:

            // 根据传入的client对指定服务器的userid进行socket注册
            if _, ok := h.clients[cRegister.client.serverName][cRegister.device]; !ok {
                cRegister.retClient <- cRegister.client
                close(cRegister.client.send)
                continue
            }
            go util.DBUserLogin(cRegister.client.serverName, cRegister.client.userID)
            // 判断用户是否已经存在
            if client, ok := h.clients[cRegister.client.serverName][cRegister.device][cRegister.client.userID]; ok {
                //重复登录,返回旧的client
                client.repeatLogin = true
                cRegister.retClient <- client

                //用新的客户端覆盖旧的客户端
                h.clients[cRegister.client.serverName][cRegister.device][cRegister.client.userID] = cRegister.client
                continue
            }

            h.clients[cRegister.client.serverName][cRegister.device][cRegister.client.userID] = cRegister.client
            cRegister.retClient <- cRegister.client

        case client := <-h.unregister:

            if client.repeatLogin {
                close(client.send)
                continue
            }

            // 收到失败的socket就进行注销
            if _, ok := h.clients[client.serverName][client.device][client.userID]; ok {
                safeClose(client.send)
                delete(h.clients[client.serverName][client.device], client.userID)
                util.DBInsertOffline(client.serverName, client.userID)
            }

        case sendMsg := <-h.multicast:
            // 对指定的用户群发送消息
            for _, userID := range sendMsg.usersID {
				for _, plat := range util.Plats {
					client, ok := h.clients[sendMsg.serverName][plat][userID]
					if !ok {
						continue
					}

					select {
					case client.send <- sendMsg.message:
					default:
						close(client.send)
						delete(h.clients[client.serverName][plat], client.userID)
					}
				}
            }

        case sendMsg := <-h.broadcast:
            // 对所有的在线用户发送消息
			for _, plat := range util.Plats {
				for userID := range h.clients[sendMsg.serverName][plat] {
					client := h.clients[sendMsg.serverName][plat][userID]
					select {
					case client.send <- sendMsg.message:
					default:
						close(client.send)
						delete(h.clients[client.serverName][plat], client.userID)
					}

				}
			}
        } // run select
    } // run for
}
