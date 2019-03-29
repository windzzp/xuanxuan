/**
 * The httpserver file of hyperttp current module of xxd.
 *
 * @copyright   Copyright 2009-2017 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Archer Peng <pengjiangxiu@cnezsoft.com>
 * @package     server
 * @link        http://www.zentao.net
 */
package server

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "xxd/api"
    "xxd/util"
    "math/rand"
)


// route
const (
    download = "/download"
    upload   = "/upload"
    sInfo    = "/serverInfo"
)

// 获取文件大小的接口
type Size interface {
    Size() int64
}

// 获取文件信息的接口
type Stat interface {
    Stat() (os.FileInfo, error)
}

// 启动 http server
func InitHttp() {
    crt, key, err := CreateSignedCertKey()
    if err != nil {
        util.Log("error", "[InitHttp] SSL certificate creation failed!")
        return
    }

    err = api.StartXXD()
    if err != nil {
        util.Exit("[InitHttp] Backend server login error.")
    }

    mux := http.NewServeMux()

    mux.HandleFunc(download, fileDownload)
    mux.HandleFunc(upload, fileUpload)
    mux.HandleFunc(sInfo, serverInfo)

    addr := util.Config.Ip + ":" + util.Config.CommonPort

    var https = "Off"
    if util.Config.IsHttps == "1" {
        https = "On"
    }

    util.Println("[I] Https enabled ", https)
    util.Println("[I] Listen IP: ", util.Config.Ip)
    util.Println("[I] Chat port: ", util.Config.ChatPort)
    util.Println("[I] Common port: ", util.Config.CommonPort)
    util.Println("")

    util.Log("info", "Https enabled %s", https)
    util.Log("info", "Listen IP:  %s", util.Config.Ip)
    util.Log("info", "Chat port: %s", util.Config.ChatPort)
    util.Log("info", "Common port: %s", util.Config.CommonPort)
    util.Log("info", "")

    if util.Config.IsHttps != "1" {
        if err := http.ListenAndServe(addr, mux); err != nil {
            util.Log("error", "[InitHttp] http server listen error: %s", err)
            util.Exit("[InitHttp] http server listen error")
        }
    }else{
        if err := http.ListenAndServeTLS(addr, crt, key, mux); err != nil {
            util.Log("error", "[InitHttp] https server listen error: %s", err)
            util.Exit("[InitHttp] https server listen error")
        }
    }

    util.Println("---------------------------------------- \n",)
    util.Println("Visit http://xuan.im to get more help, or join official QQ group 367833155. \n",)
    util.Println("Press Ctrl+C to stop the server. \n",)
}

//文件下载
func fileDownload(w http.ResponseWriter, r *http.Request) {
    if r.Method != "GET" {
        fmt.Fprintln(w, "Not supported request")
        return
    }

    r.ParseForm()
    reqFileName := r.Form["fileName"][0]
    reqFileTime := r.Form["time"][0]
    reqFileID := r.Form["id"][0]

    serverName := r.Form["ServerName"][0]
    if serverName == "" {
        serverName = util.Config.DefaultServer
    }

    //新增加验证方式
    reqSid := r.Form["sid"][0]
    reqGid := r.Form["gid"][0]
    session,err :=util.GetUid(serverName, reqGid)
    util.LogDetail("[fileDownload] File downloaded sessionid is " + session)
    if err!=nil {
        util.Log("error", "[fileDownload] File downloaded sessionid is %s", session)
        fmt.Fprintln(w, "[fileDownload] Get file sessionid error")
        return
    }

    if reqSid != string(util.GetMD5( session  + reqFileName )) {
        w.WriteHeader(http.StatusUnauthorized)
        return
    }

    fileTime, err := util.String2Int64(reqFileTime)
    util.LogDetail("[fileDownload] File downloaded fileTime is " + reqFileTime)
    if err != nil {
        util.Log("error", "[fileDownload] File download, time undefined: %s", err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    // new file name = md5(old filename + fileID + fileTime)
    fileName := util.Config.UploadPath + serverName + "/" + util.GetYmdPath(fileTime) + util.GetMD5(reqFileName+reqFileID+reqFileTime)
    //util.Println(fileName)
    if util.IsNotExist(fileName) || util.IsDir(fileName) {
        w.WriteHeader(http.StatusNotFound)
        return
    }

    //fileExtension := util.FileExtension(reqFileName)
    //util.Println("fileExtension", fileExtension)
    //if fileExtension != ".jpg" && fileExtension != ".png" && fileExtension != ".jpeg" && fileExtension != ".gif" {
    //}

    w.Header().Add("Content-Type", "application/octet-stream")
    w.Header().Add("content-disposition", "attachment; filename=\""+ util.FileBaseName(reqFileName) +"\"")

    http.ServeFile(w, r, fileName)
}

//文件上传
func fileUpload(w http.ResponseWriter, r *http.Request) {
    w.Header().Add("Access-Control-Allow-Origin", "*")
    w.Header().Add("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE")
    w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-FILENAME, ServerName")
    w.Header().Add("Access-Control-Allow-Credentials", "true")

    if r.Method != "POST" {
        util.LogDetail("[fileUpload] Not supported request")
        fmt.Fprintln(w, "Not supported request")
        return
    }

    //util.Println(r.Header)
    serverName := r.Header.Get("ServerName")
    if serverName == "" {
        serverName = util.Config.DefaultServer
    }

    authorization := r.Header.Get("Authorization")
    if authorization != string(util.Token) {
        w.WriteHeader(http.StatusUnauthorized)
        return
    }

    r.ParseMultipartForm(32 << 20)

    file, handler, err := r.FormFile("file")
    if err != nil {
        util.Log("error", "[fileUpload] Form file error: %s", err)
        fmt.Fprintln(w, "Form file error")
        return
    }
    defer file.Close()

    nowTime := util.GetUnixTime()
    savePath := util.Config.UploadPath + serverName + "/" + util.GetYmdPath(nowTime)
    if err := util.Mkdir(savePath); err != nil {
        util.Log("error", "[fileUpload] File upload mkdir error: %s", err)
        w.WriteHeader(http.StatusInternalServerError)
        fmt.Fprintln(w, "File upload mkdir error.")
        return
    }

    var fileSize int64 = 0
    if statInterface, ok := file.(Stat); ok {
        fileInfo, _ := statInterface.Stat()
        fileSize = fileInfo.Size()
    }

    if sizeInterface, ok := file.(Size); ok {
        fileSize = sizeInterface.Size()
    }

    if fileSize <= 0 {
        util.Log("error", "[fileUpload] Get file size error")
        w.WriteHeader(http.StatusInternalServerError)
        fmt.Fprintln(w, "Get file size error")
        return
    }

    if fileSize > util.Config.UploadFileSize {
        util.Log("error", "[fileUpload] File is too large")
        w.WriteHeader(http.StatusBadRequest)
        fmt.Fprintln(w, "File is too large")
        return
    }

    //util.Println(r.Form)
    fileName := util.FileBaseName(handler.Filename)
    nowTimeStr := util.Int642String(nowTime)
    gid := r.Form["gid"][0]
    userID := r.Form["userID"][0]

    x2rJson := `{"userID":` + userID + `,"module":"chat","method":"uploadFile","params":["` + fileName + `","` + savePath + `",` + util.Int642String(fileSize) + `,` + nowTimeStr + `,"` + gid + `"]}`

    util.LogDetail("[fileUpload] upload file json data" + x2rJson)
    fileID, err := api.UploadFileInfo(serverName, []byte(x2rJson))
    if err != nil {
        util.Log("error", "[fileUpload] Upload file info error: %s", err)
        w.WriteHeader(http.StatusInternalServerError)
        fmt.Fprintln(w, "Upload file info error")
        return
    }
    if fileID == "" {
        fileID = fmt.Sprintf("%d", rand.Intn(999999) + 1)
    }
    util.LogDetail("[fileUpload] upload file the fileID" + fileID)
    // new file name = md5(old filename + fileID + nowTime)
    saveFile := savePath + util.GetMD5(fileName+fileID+nowTimeStr)
    //util.Println(saveFile)
    f, err := os.OpenFile(saveFile, os.O_WRONLY|os.O_CREATE, 0644)
    if err != nil {
        util.Log("error", "[fileUpload] Open file error: %s", err)
        w.WriteHeader(http.StatusInternalServerError)
        fmt.Fprintln(w, "Open file error")
        return
    }
    defer f.Close()
    io.Copy(f, file)

    x2cJson := `{"result":"success","data":{"time":` + nowTimeStr + `,"id":` + fileID + `,"name":"` + fileName + `"}}`
    //fmt.Fprintln(w, handler.Header)
    //util.Println(x2cJson)
    fmt.Fprintln(w, x2cJson)
}

//服务配置信息
func serverInfo(w http.ResponseWriter, r *http.Request) {

    w.Header().Add("Access-Control-Allow-Origin", "*")
    w.Header().Add("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE")
    w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
    w.Header().Add("Access-Control-Allow-Credentials", "true")

    if r.Method != "POST" {
        fmt.Fprintln(w, "[serverInfo] 'POST' request only.")
        return
    }

    r.ParseForm()

    ok, message, err := api.VerifyLogin([]byte(r.Form["data"][0]))
    if err != nil {
        util.Log("error", "[serverInfo] Verify authentication credentials error: ", err)
        w.WriteHeader(http.StatusInternalServerError)
        fmt.Fprintln(w, "Verify authentication credentials error: " + err.Error())
        return
    }

    if !ok {
        w.WriteHeader(http.StatusUnauthorized)
        fmt.Fprintln(w, message)
        return
    }

    chatPort, err := util.String2Int(util.Config.ChatPort)
    if err != nil {
        util.Log("error", "[serverInfo] Convert chat port to number error: %s", err)
        fmt.Fprintln(w, "Chat port \"" + util.Config.ChatPort + "\" is incorrect.")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

	clientUpdate := make(map[string]interface{})
	if len(message) > 0 {
		download  := make(map[string]interface{})
		downloads := make(map[string]interface{})
		json.Unmarshal([]byte(message["downloads"].(string)), &downloads)
		download["win32"]   = downloads["win32zip"]
		download["win64"]   = downloads["win64zip"]
		download["linux32"] = downloads["linux32zip"]
		download["linux64"] = downloads["linux64zip"]
		download["mac64"]   = downloads["macOSzip"]
		clientUpdate["version"]   = message["version"]
		clientUpdate["readme"]    = message["readme"]
		clientUpdate["strategy"]  = message["strategy"]
		clientUpdate["downloads"] = download
	}

	info := make(map[string]interface{})
	info["version"] = util.Version
	info["token"] = string(util.Token)
	info["uploadFileSize"] =util.Config.UploadFileSize
	info["chatPort"] = chatPort
	info["clientUpdate"] = clientUpdate

    jsonData, err := json.Marshal(info)
    if err != nil {
        util.Log("error", "[serverInfo] Json marshal error: %s", err)
        fmt.Fprintln(w, "Json marshal error: " + err.Error())
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    fmt.Fprintln(w, string(jsonData))
}
