/**
 * The log file of util current module of xxd.
 *
 * @copyright   Copyright 2009-2017 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Memory <lvtoa@cnezsoft.com>
 * @package     util
 * @link        http://www.zentao.net
 */
package util

import (
    "os"
    "io/ioutil"
    "strconv"
)

//生成唯一ID 作用于文件在websocket和http不同协议中识别用户
func CreateUid(serverName string, userID int64, key string) error {

    url := Config.LogPath + serverName + "/"

    if err := Mkdir(url); err != nil {
        Log("error", "Create public uid for the websocket and HTTP protocols, mkdir error %s", err)
        return err
    }

    fileName := url + Int642String(userID)

    fout,err := os.Create(fileName)
    defer fout.Close()
    if err != nil {
        Log("error", "Create file error %s %s",fileName,err)
        return err
    }

    Log("info", "Session filename: %s ", fileName)
    fout.WriteString(key)
    Log("info", "Session created : %s ", key)
    return nil
}

//获取用户唯一ID
func GetUid(serverName string, userID string) (string,error) {
    url := Config.LogPath + serverName + "/" + userID

    _, err := os.Stat(url)
    if err != nil && os.IsNotExist(err) {
        userIDint, _ := strconv.ParseInt(userID, 10, 64)
        CreateUid(serverName, userIDint, GetMD5(serverName + userID))
    }

    file, err := os.Open(url)
    if err != nil {
        Log("error", "Cannot open file %s %s",url,err)
        return "",err
    }
    data, err := ioutil.ReadAll(file)
    if err != nil {
        Log("error", "Cannot read file %s %s",url,err)
        return "",err
    }
    return string(data),nil
}

//删除用户唯一ID
func DelUid(serverName string, userID string) error {
    url := Config.LogPath + serverName + "/" + userID
    err := Rm(url)
    if err != nil {
        Log("error", "Cannot delete file %s %s",url,err)
        return err
    }
    return nil
}
