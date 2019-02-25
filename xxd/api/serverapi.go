/**
 * The serverapi file of api current module of xxd.
 *
 * @copyright   Copyright 2009-2017 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Archer Peng <pengjiangxiu@cnezsoft.com>
 * @package     api
 * @link        http://www.zentao.net
 */
package api

import (
    "encoding/json"
    "xxd/hyperttp"
    "xxd/util"
)

// 需要重新构思，多然之时，不能因为一个登陆失败就导致所有的不能登录。
// 是否考虑可以自动重连。
// 需要考虑登录成功后，然之服务器掉线的处理方式
func StartXXD() error {
    if util.IsTest {
        return nil
    }

    startXXD := []byte(`{"module":"chat","method":"serverStart"}`)
    if len(util.Config.RanzhiServer) == 0 {
        util.Exit("No backend server available in the configuration file.")
    }

    for serverName, serverInfo := range util.Config.RanzhiServer {
        message, err := aesEncrypt(startXXD, serverInfo.RanzhiToken)
        if err != nil {
            util.Log("error", "[StartXXD] json data AES encrypt error %s for server name %s", err, serverName)
            return err
        }

        _, err = hyperttp.RequestInfo(serverInfo.RanzhiAddr, message)
        if err != nil {
            util.Log("error", "[StartXXD] Failed to connect to server [%s], error info: [%s]", serverName, err)
            return err
        }

        util.Println("[D] Backend server name: ", serverName)
        util.Println("[D] Backend server address: ", serverInfo.RanzhiAddr)
        util.Println("[D] Backend server token: ", string(serverInfo.RanzhiToken))
    }
    return nil
}

// 喧喧客户端第一次登录认证
func VerifyLogin(body []byte) (bool, string, error) {
    parseData := make(ParseData)
    if err := json.Unmarshal(body, &parseData); err != nil {
        util.Log("error", "[VerifyLogin] json data unmarshal error:", err)
        return false, "", err
    }

    ranzhiServer, ok := RanzhiServer(parseData.ServerName())
    if !ok {
        return false, "", util.Errorf("[VerifyLogin] backend server [%s] cannot found. ", parseData.ServerName())
    }

    r2xMessage, err := hyperttp.RequestInfo(ranzhiServer.RanzhiAddr, ApiUnparse(parseData, ranzhiServer.RanzhiToken))
    if err != nil {
        return false, "", err
    }

    //解密数据
    jsonData, err := aesDecrypt(r2xMessage, ranzhiServer.RanzhiToken)
    util.LogDetail("[VerifyLogin] request json data : " + string(jsonData))
    if err != nil {
        util.Log("error", "[VerifyLogin] request json data decrypt error:", err)
        return false, "", err
    }

    retMessage, err := ProcessResponse(jsonData)
    if err != nil {
        return false, "", err
    }

    parseData, err = ApiParse(retMessage[0]["message"].([]byte), util.Token)
    if err != nil {
        return false, "", err
    }
	//(parseData["data"].(interface{})).(string)
    return parseData.Result() == "success", "", nil
}

// 喧喧客户端上传文件时，与然之服务器进行数据交互
func UploadFileInfo(serverName string, jsonData []byte) (string, error) {
    ranzhiServer, ok := RanzhiServer(serverName)
    if !ok {
        return "", util.Errorf("[UploadFileInfo] backend server name %s cannot found", serverName)
    }

    message, err := aesEncrypt(jsonData, ranzhiServer.RanzhiToken)
    if err != nil {
        util.Log("error", "[UploadFileInfo] json data AES encrypt error: %s", err)
        return "", err
    }

    r2xMessage, err := hyperttp.RequestInfo(ranzhiServer.RanzhiAddr, message)
    if err != nil {
        return "", err
    }

    parseData, err := ApiParse(r2xMessage, ranzhiServer.RanzhiToken)
    if err != nil {
        return "", err
    }

    // 然之服务器返回存储文件的id
    return parseData.FileID(), nil
}

//文件id
func (pd ParseData) FileID() string {
    data, ok := pd["data"]
    if !ok {
        return ""
    }

    return (data.(interface{})).(string)
}
