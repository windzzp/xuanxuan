/**
 * The config file of util current module of xxd.
 *
 * @copyright   Copyright 2009-2017 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Archer Peng <pengjiangxiu@cnezsoft.com>
 * @package     util
 * @link        http://www.zentao.net
 */
package util

import (
    "github.com/Unknwon/goconfig"
    "strings"
    "os"
)

type RanzhiServer struct {
    RanzhiAddr  string
    RanzhiToken []byte
}

type ConfigIni struct {
    Ip         string
    ChatPort   string
    CommonPort string
    IsHttps    string

    UploadPath     string
    UploadFileSize int64

    MaxOnlineUser int64
    Debug int64

    // multiSite or singleSite
    SiteType      string
    DefaultServer string
    RanzhiServer  map[string]RanzhiServer

    LogPath string
    CrtPath string
}

const configPath = "config/xxd.conf"

var Config = ConfigIni{SiteType: "singleSite", RanzhiServer: make(map[string]RanzhiServer)}

func init() {
    dir, _ := os.Getwd()
    data, err := goconfig.LoadConfigFile(dir + "/" + configPath)
    if err != nil {
        Config.Ip = "0.0.0.0"
        Config.ChatPort = "11444"
        Config.CommonPort = "11443"
        Config.IsHttps = "0"
        Config.Debug = 0

        Config.UploadPath = "tmpfile"
        Config.UploadFileSize = 32 * MB

        Config.SiteType = "singleSite"
        Config.DefaultServer = "xuanxuan"
        Config.RanzhiServer["xuanxuan"] = RanzhiServer{"serverInfo", []byte("serverInfo")}

        Config.LogPath = dir + "/log/"
        Config.CrtPath = dir + "/certificate/"
        Config.MaxOnlineUser = 0

        Log("error", "「config」 %s can't be loaded. Use default conf!", configPath)
        return
    }

    getIP(data)
    getChatPort(data)
    getCommonPort(data)
    getIsHttps(data)
    getDebug(data)
    getUploadPath(data)
    getRanzhi(data)
    getLogPath(data)
    getCrtPath(data)
    getUploadFileSize(data)
    getMaxOnlineUser(data)

    fixConfigFile(data)
}

func fixConfigFile(config *goconfig.ConfigFile) error {
    section := config.GetKeyList("certificate")
    if len(section) > 0 {
        Println("The configuration file has been updated to the latest.")
        Println("The old configuration file is backed up for you as xxd.conf.old")
    }
    return nil
}

//获取配置文件IP
func getIP(config *goconfig.ConfigFile) (err error) {
    ip, err := config.GetValue("server", "ip")
    if err != nil {
        Exit("「config」 get server chat port error %s", err)
    }
	Config.Ip = removeComment(ip)
	return
}

//会话端口
func getChatPort(config *goconfig.ConfigFile) (err error) {
    chatPort, err := config.GetValue("server", "chatPort")
    if err != nil {
        Exit("「config」 get server chat port error,", err)
    }
	Config.ChatPort = removeComment(chatPort)
    return
}

//服务端口
func getCommonPort(config *goconfig.ConfigFile) (err error) {
    commonPort, err := config.GetValue("server", "commonPort")
    if err != nil {
        Exit("「config」 get server upload port error,", err)
    }
	Config.CommonPort = removeComment(commonPort)
    return
}

//判断是否启用https
func getIsHttps(config *goconfig.ConfigFile) (err error) {
    https, err := config.GetValue("server", "https")
    if err != nil {
        https, err := config.GetValue("server", "isHttps")
        LogDetail("「config」 get isHttps value" + https)
        if err != nil {
            Exit("「config」 get server https error,", err)
        }
        Config.IsHttps = https
    } else {
        https = removeComment(https)
        if https == "on"{
            Config.IsHttps = "1"
        } else {
            Config.IsHttps = "0"
        }
    }
    return
}

//调试级别
func getDebug(config *goconfig.ConfigFile) (err error) {
	debug, err := config.GetValue("server", "debug")
	if err != nil {
        Config.Debug = 0
        return nil
	}
	debugString := removeComment(debug)
	debugInt, _ := String2Int64(debugString)
	if DebugCli > 0 {
        debugInt = DebugCli
    }
	Config.Debug = debugInt
	return
}

//获取上传目录
func getUploadPath(config *goconfig.ConfigFile) (err error) {
    uploadPath, err := config.GetValue("server", "uploadPath")
    if err != nil {
        Exit("「config」 get server upload path error,", err)
    }
    Config.UploadPath = removeComment(uploadPath)
    return
}

//获取上传大小
func getUploadFileSize(config *goconfig.ConfigFile) error {

    Config.UploadFileSize = 32 * MB
    var fileSize int64 = 0

    uploadFileSize, err := config.GetValue("server", "uploadFileSize")
    if err != nil {
        Log("error", "「config」 get server upload file size error:%v, default size 32MB.", err)
        return err
    }
    uploadFileSize = removeComment(uploadFileSize)

    switch size, suffix := sizeSuffix(uploadFileSize); suffix {
    case "K":
        if fileSize, err = String2Int64(size); err == nil {
            Config.UploadFileSize = fileSize * KB
        }

    case "M":
        if fileSize, err = String2Int64(size); err == nil {
            Config.UploadFileSize = fileSize * MB
        }

    case "G":
        if fileSize, err = String2Int64(size); err == nil {
            Config.UploadFileSize = fileSize * GB
        }

    default:
        if fileSize, err = String2Int64(size); err == nil {
            Config.UploadFileSize = fileSize
        } else {
           Log("error", "「config」 get server upload file size error, default size 32MB.")
        }
    }

    if err != nil {
       Log("error", "「config」 upload file size parse error:", err)
    }

    return err
}

//同时在线人数
func getMaxOnlineUser(config *goconfig.ConfigFile) error {
    Config.MaxOnlineUser = 0
    onlineUser, err := config.GetValue("server", "maxOnlineUser")
    if err != nil {
        Log("error", "「config」 get server maxUser error:%v, default size 0.", err)
        return err
    }
    onlineUser = removeComment(onlineUser)
    maxOnlineUser, _ := String2Int64(onlineUser)
    Config.MaxOnlineUser = maxOnlineUser

    return nil
}

//获取服务器列表,conf中[backend]段不能改名.
func getRanzhi(config *goconfig.ConfigFile) {
    var section = "backend"
    var keyList []string
    keyList = config.GetKeyList(section)

    //兼容2.1.0之前的版本
    if len(keyList) == 0 {
        section = "ranzhi"
        keyList = config.GetKeyList(section)
    }

    Config.DefaultServer = ""
    if len(keyList) > 1 {
        Config.SiteType = "multiSite"
    }

    for index, ranzhiName := range keyList {
        ranzhiServer, err := config.GetValue(section, ranzhiName)
        if err != nil {
            Exit("「config」 get backend server error,", err)
        }

        serverInfo := strings.Split(ranzhiServer, ",")
        //逗号前面是地址，后面是token，token长度固定为32
        if len(serverInfo) < 2 || len(serverInfo[1]) != 32 {
            LogDetail("serverInfo" + ranzhiServer + "，the token len is " + string(len(serverInfo[1])))
            Exit("「config」 backend server config error")
        }

        if serverInfo[1] == "88888888888888888888888888888888" && Config.Debug == 0 {
			Exit("「config」 The key cannot be set to 88888888888888888888888888888888")
		}

		if (len(serverInfo) >= 3 && serverInfo[2] == "default") || index == 0 {
			Config.DefaultServer = ranzhiName
        }

        Config.RanzhiServer[ranzhiName] = RanzhiServer{serverInfo[0], []byte(serverInfo[1])}
    }
}

//获取日志路径
func getLogPath(config *goconfig.ConfigFile) (err error) {
    logPath, err := config.GetValue("server", "logPath")
    if err != nil {
        Config.LogPath, err = config.GetValue("log", "logPath")
        if err != nil {
            Exit("「config」 get server log path error,", err)
        }
    } else {
        Config.LogPath = removeComment(logPath)
    }
    return
}

//获取证书路径
func getCrtPath(config *goconfig.ConfigFile) (err error) {
    crtPath, err := config.GetValue("server", "certPath")
    if err != nil {
        Config.CrtPath, err = config.GetValue("certificate", "crtPath")
        if err != nil {
            Exit("「config」 get certificate crt path error,", err)
        }
    } else {
        crtPath = removeComment(crtPath)
        Config.CrtPath = crtPath
    }
    return
}

func sizeSuffix(uploadFileSize string) (string, string) {
    if strings.HasSuffix(uploadFileSize, "K") {
        return strings.TrimSuffix(uploadFileSize, "K"), "K"
    }

    if strings.HasSuffix(uploadFileSize, "M") {
        return strings.TrimSuffix(uploadFileSize, "M"), "M"
    }

    if strings.HasSuffix(uploadFileSize, "G") {
        return strings.TrimSuffix(uploadFileSize, "G"), "G"
    }

    return uploadFileSize, ""
}

func removeComment(value string) (string) {
	if strings.Index(value, "#") > 0 {
		valid := strings.Split(value, "#")
		return strings.TrimSpace(valid[0])
	}
	return value
}