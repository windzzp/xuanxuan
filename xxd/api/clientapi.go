/**
 * The clientapi file of api current module of xxd.
 *
 * @copyright   Copyright 2009-2017 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Archer Peng <pengjiangxiu@cnezsoft.com>
 * @package     api
 * @link        http://www.zentao.net
 */
package api

import (
    "xxd/hyperttp"
    "xxd/util"
)

var newline = []byte{'\n'}

// 从客户端发来的登录请求，通过该函数转发到后台服务器进行登录验证
func ChatLogin(clientData ParseData) (map[int]map[string]interface{}, error) {
    ranzhiServer, ok := RanzhiServer(clientData.ServerName())
    if !ok {
        return nil, util.Errorf("「ChatLogin」 cannot found xxb server name %s", clientData.ServerName())
    }

    // 到http服务器请求，返回加密的结果，可能包含多个数组, type []byte
    retMessage, err := hyperttp.RequestInfo(ranzhiServer.RanzhiAddr, ApiUnparse(clientData, ranzhiServer.RanzhiToken))
    if err != nil {
        util.Log("error", "「ChatLogin」 hyperttp request info error: %s", err)
        return nil, err
    }

    //解密数据
    jsonData, err := aesDecrypt(retMessage, ranzhiServer.RanzhiToken)
    util.LogDetail("「ChatLogin」request json data : " + string(jsonData))
    if err != nil {
        util.Log("error", "「ChatLogin」request json data decrypt error: %s", err)
        return nil, err
    }
    return ProcessResponse(jsonData)
}

//客户端退出
func ChatLogout(serverName string, userID int64, lang string) (map[int]map[string]interface{}, error) {
    ranzhiServer, ok := RanzhiServer(serverName)
    if !ok {
        return nil, util.Errorf("「ChatLogout」 cannot found xxb server name %s", serverName)
    }

    request := []byte(`{"module":"chat","method":"logout","lang":"` + lang + `","userID":` + util.Int642String(userID) + `}`)
    message, err := aesEncrypt(request, ranzhiServer.RanzhiToken)
    if err != nil {
        util.Errorf("「ChatLogout」 AES encrypt error: %s", err)
        return nil, err
    }

    // 到http服务器请求user get list数据
    r2xMessage, err := hyperttp.RequestInfo(ranzhiServer.RanzhiAddr, message)
    if err != nil {
        util.Log("error", "「ChatLogout」 hyperttp request info error: %s", err)
        return nil, err
    }

    //解密数据
    jsonData, err := aesDecrypt(r2xMessage, ranzhiServer.RanzhiToken)
    util.LogDetail("「ChatLogout」json data : " + string(jsonData))
    if err != nil {
        util.Log("error", "「ChatLogout」 request json data decrypt error: %s", err)
        return nil, err
    }

    return ProcessResponse(jsonData)

}

//重新登录
func RepeatLogin() []byte {
    repeatLogin := []byte(`{"module":"chat","method":"kickoff","message":"当前账号已在其他地方登录，如果不是本人操作，请及时修改密码"}`)
    //repeatLogin := []byte(`{"module":"chat","method:"kickoff","message":"This account logined in another place."}`)

    util.LogDetail("「RepeatLogin」json data : " + string(repeatLogin))
    message, err := aesEncrypt(repeatLogin, util.Token)
    if err != nil {
        util.Log("error", "「RepeatLogin」 json data AES encrypt error: %s", err)
        return nil
    }

    return message
}

//禁止登录
func BlockLogin() []byte {
    blockLogin := []byte(`{"module":"chat","method":"blockLogin","message":"Online users exceed system limits."}`)

    util.LogDetail("「BlockLogin」json data : " + string(blockLogin))
    message, err := aesEncrypt(blockLogin, util.Token)
    if err != nil {
        util.Log("error", "「BlockLogin」 json data AES encrypt error: %s", err)
        return nil
    }

    return message
}

//测试登录
func TestLogin() []byte {
    loginData := []byte(`{"result":"success","data":{"id":12,"account":"demo8","realname":"\u6210\u7a0b\u7a0b","avatar":"","role":"hr","dept":0,"status":"online","admin":"no","gender":"f","email":"ccc@demo.com","mobile":"","site":"","phone":""},"sid":"18025976a786ec78194e491e7b790731","module":"chat","method":"login"}`)

    message, err := aesEncrypt(loginData, util.Token)
    if err != nil {
        util.Log("error", "「TestLogin」 json data AES encrypt error: %s", err)
        return nil
    }

    return message
}

// 除登录和退出的数据中转.
func TransitData(clientData []byte, serverName string) (map[int]map[string]interface{}, error) {
    ranzhiServer, ok := RanzhiServer(serverName)
    if !ok {
        return nil, util.Errorf("%s", "TransitData not found xxb server name")
    }

    util.LogDetail("「TransitData」Server : " + serverName)
    //交换token
    message, err := SwapToken(clientData, util.Token, ranzhiServer.RanzhiToken)
    if err != nil {
        util.Log("error", "「TransitData」Transit data swap token error: %s", err)
        return nil, err
    }

    // xxb to xxd message
    r2xMessage, err := hyperttp.RequestInfo(ranzhiServer.RanzhiAddr, message)
    if err != nil {
        util.Log("error", "「TransitData」 hyperttp request info error: %s", err)
        return nil, err
    }

    //解密数据
    jsonData, err := aesDecrypt(r2xMessage, ranzhiServer.RanzhiToken)
    util.LogDetail("「TransitData」request json data : " + string(jsonData))
    if err != nil {
        util.Log("error", "「TransitData」 request json data decrypt error: %s", err)
        return nil, err
    }

    return ProcessResponse(jsonData)
}

//获取用户列表
func UserGetlist(serverName string, userID int64, lang string) ([]byte, error) {
    ranzhiServer, ok := RanzhiServer(serverName)
    if !ok {
        return nil, util.Errorf("%s", "UserGetList not found xxb server name")
    }

    // 固定的json格式
    request := []byte(`{"module":"chat","method":"userGetList", "lang":"` + lang + `", "params":[""],"userID":` + util.Int642String(userID) + `}`)

    util.LogDetail("「UserGetlist」json data : " + string(request))
    message, err := aesEncrypt(request, ranzhiServer.RanzhiToken)
    if err != nil {
        util.Log("error", "「UserGetlist」json data AES encrypt error: %s", err)
        return nil, err
    }

    // 到http服务器请求user get list数据
    retMessage, err := hyperttp.RequestInfo(ranzhiServer.RanzhiAddr, message)
    if err != nil {
        util.Log("error", "「UserGetlist」 hyperttp request info error: %s", err)
        return nil, err
    }

    //由于http服务器和客户端的token不一致，所以需要进行交换
    retData, err := SwapToken(retMessage, ranzhiServer.RanzhiToken, util.Token)
    if err != nil {
        util.Log("error", "「UserGetlist」request data swap token error: %s", err)
        return nil, err
    }

    return retData, nil
}

//用户文件SessionID 作用于文件下载 为适配web版客户端
func UserFileSessionID(serverName string, userID int64, lang string) ([]byte, error) {
    sessionID := util.GetMD5(serverName + util.Int642String(userID) + util.Int642String(util.GetUnixTime()))
    sessionData := []byte(`{"module":"chat","method":"SessionID", "lang":"` + lang + `", "sessionID":"` + sessionID + `"}`)

    //将sessionID 存入公共空间
    util.CreateUid(serverName, userID, sessionID)
    util.LogDetail("「UserFileSessionID」json data : " + string(sessionData))
    sessionData, err := aesEncrypt(sessionData, util.Token)
    if err != nil {
        util.Log("error", "「UserFileSessionID」 Session data AES encrypt error: %s", err)
        return nil, err
    }

    return sessionData, nil
}

func ReportAndGetNotify(server string, lang string) (map[int64][]byte, error) {
    ranzhiServer, ok := RanzhiServer(server)
    if !ok {
        return nil, util.Errorf("「CheckUserChange」cannot found xxb server name %s", server)
    }
    //get offline data and sendfail message id from SQLite.
    offline, _  := util.DBSelectOffline(server)
    sendFail, _ := util.DBSelectSendfail(server)

    //create json map for xxb
    trunk  := make(map[string]interface{})
    params := make(map[string]interface{})

    params["offline"]  = offline
    params["sendfail"] = sendFail

    trunk["module"] = "chat"
    trunk["method"] = "notify"
    trunk["lang"]   = lang
    trunk["params"] = params

    //send message to xxb and get notify data
    retMessage, err := hyperttp.RequestInfo(ranzhiServer.RanzhiAddr, ApiUnparse(trunk, ranzhiServer.RanzhiToken))
    if err != nil {
        util.Log("error", "「ReportAndGetNotify」 hyperttp request info error: %s", err)
        return nil, err
    }

    decodeData, _ := ApiParse(retMessage, ranzhiServer.RanzhiToken)
    if decodeData.Result() != "success" {
        return nil, err
    }

    messageList := make(map[int64][]byte)
    switch decodeData["data"].(type) {
        case map[string]interface{} :
            data := decodeData["data"].(map[string]interface{})
            for userID, messages := range data {
                if messages != nil && messages != "" {
                    userNotify := make(map[string]interface{})
                    userNotify["module"] = "chat"
                    userNotify["method"] = "notify"
                    userNotify["data"]   = messages
                    uid, _ := util.String2Int64(userID)
                    messageList[uid] = ApiUnparse(userNotify, util.Token)
                }
            }
    }

    go util.DBDeleteOffline(server, offline)
    go util.DBDeleteSendfail(server, sendFail)
    return messageList, nil
}

func CheckUserChange(serverName string, lang string) ([]byte, error) {
    ranzhiServer, ok := RanzhiServer(serverName)
    if !ok {
        return nil, util.Errorf("「CheckUserChange」cannot found xxb server name %s", serverName)
    }

    // 固定的json格式
    request := []byte(`{"module":"chat","method":"checkUserChange","lang":"`+ lang +`","params":[""]}`)

    util.LogDetail("「CheckUserChange」json data : " + string(request))
    message, err := aesEncrypt(request, ranzhiServer.RanzhiToken)
    if err != nil {
        util.Log("error", "「CheckUserChange」json data AES encrypt error: %s", err)
        return nil, err
    }

    // 到http服务器请求user get list数据
    retMessage, err := hyperttp.RequestInfo(ranzhiServer.RanzhiAddr, message)
    if err != nil {
        util.Log("error", "「CheckUserChange」 hyperttp request info error: %s", err)
        return nil, err
    }

    decodeData, _ := ApiParse(retMessage, ranzhiServer.RanzhiToken)
    if decodeData.Result() != "success" {
        util.Log("error", "「CheckUserChange」 request info status: %s", decodeData.Result())
        return nil, err
    }

    if decodeData["data"] == "no" {
        return nil, nil
    }

    return UserGetlist(serverName, 0, lang)
}

// 与客户端间的错误通知
func RetErrorMsg(errCode, errMsg string) ([]byte, error) {
    errApi := `{"module":"chat","method":"error","code":` + errCode + `,"message":"` + errMsg + `"}`
    message, err := aesEncrypt([]byte(errApi), util.Token)
    if err != nil {
        util.Log("error", "「RetErrorMsg」 json data AES encrypt error: %s", err)
        return nil, err
    }

    return message, nil
}

// 获取然之服务器名称
func RanzhiServer(serverName string) (util.RanzhiServer, bool) {
    if serverName == "" {
        info, ok := util.Config.RanzhiServer[util.Config.DefaultServer]
        return info, ok
    }

    info, ok := util.Config.RanzhiServer[serverName]
    return info, ok
}

//服务器名称
func (pd ParseData) ServerName() string {
    params, ok := pd["params"]
    if !ok {
        return ""
    }

    // api中server name在数组固定位置为0
    ret := params.([]interface{})
    return ret[0].(string)
}

//账号
func (pd ParseData) Account() string {
    params, ok := pd["params"]
    if !ok {
        return ""
    }

    // api中account在数组固定位置为1
    ret := params.([]interface{})
    return ret[1].(string)
}

//密码
func (pd ParseData) Password() string {
    params, ok := pd["params"]
    if !ok {
        return ""
    }

    // api中password在数组固定位置为2
    ret := params.([]interface{})
    return ret[2].(string)
}

//状态
func (pd ParseData) Status() string {
    params, ok := pd["params"]
    if !ok {
        return ""
    }

    // api中status在数组固定位置为3
    ret := params.([]interface{})
    return ret[3].(string)
}
