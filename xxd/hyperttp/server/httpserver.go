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

type retCInfo struct {
    // server version
    Version string `json:"version"`

    // encrypt key
    Token string `json:"token"`

    // multiSite or singleSite
    SiteType string `json:"siteType"`

    UploadFileSize int64 `json:"uploadFileSize"`

    ChatPort  int  `json:"chatPort"`
    TestModel bool `json:"testModel"`
}

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
        util.Log("error", "InitHttp error SSL certificate creation failed!")
        return
    }

    err = api.StartXXD()
    if err != nil {
        util.Exit("InitHttp error Backend server login error")
    }

    mux := http.NewServeMux()

    mux.HandleFunc(download, fileDownload)
    mux.HandleFunc(upload, fileUpload)
    mux.HandleFunc(sInfo, serverInfo)

    addr := util.Config.Ip + ":" + util.Config.CommonPort

    var https = "Off"
    var protocol = "http"
    if util.Config.IsHttps == "1" {
        https = "On"
        protocol = "https"
    }

    util.Println("[Info] XXC connection address: ", protocol, "://", util.Config.Ip)
    util.Println("[Info] Https enabled ", https)
    util.Println("[Info] Listen IP: ", util.Config.Ip)
    util.Println("[Info] Chat port: ", util.Config.ChatPort)
    util.Println("[Info] Common port: ", util.Config.CommonPort)

    util.Log("info", "Https enabled %s", https)
    util.Log("info", "Listen IP:  %s", util.Config.Ip)
    util.Log("info", "Chat port: %s", util.Config.ChatPort)
    util.Log("info", "Common port: %s", util.Config.CommonPort)

    if util.Config.IsHttps != "1" {
        if err := http.ListenAndServe(addr, mux); err != nil {
            util.Log("error", "Warning: http server listen error: %s", err)
            util.Exit("Warning: http server listen error")
        }
    }else{
        if err := http.ListenAndServeTLS(addr, crt, key, mux); err != nil {
            util.Log("error", "Warning: https server listen error: %s", err)
            util.Exit("Warning: https server listen error")
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
    util.Log("error", "File download file sessionid %s", session)
    if err!=nil {
        fmt.Fprintln(w, "Warning: Get file sessionid error")
        return
    }

    if reqSid != string(util.GetMD5( session  + reqFileName )) {
        w.WriteHeader(http.StatusUnauthorized)
        return
    }

    fileTime, err := util.String2Int64(reqFileTime)
    if err != nil {
        util.Log("error", "Warning: file download,time undefined: %s", err)
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
        util.Log("error", "Form file error: %s", err)
        fmt.Fprintln(w, "Form file error")
        return
    }
    defer file.Close()

    nowTime := util.GetUnixTime()
    savePath := util.Config.UploadPath + serverName + "/" + util.GetYmdPath(nowTime)
    if err := util.Mkdir(savePath); err != nil {
        util.Log("error", "File upload mkdir error: %s", err)
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
        util.Log("error", "Get file size error")
        w.WriteHeader(http.StatusInternalServerError)
        fmt.Fprintln(w, "Get file size error")
        return
    }

    if fileSize > util.Config.UploadFileSize {
        util.Log("error", "File is too large")
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

    //util.Println(x2rJson)
    fileID, err := api.UploadFileInfo(serverName, []byte(x2rJson))
    if err != nil {
        util.Log("error", "Upload file info error: %s", err)
        w.WriteHeader(http.StatusInternalServerError)
        fmt.Fprintln(w, "Upload file info error")
        return
    }
    if fileID == "" {
        fileID = fmt.Sprintf("%d", rand.Intn(999999) + 1)
    }

    // new file name = md5(old filename + fileID + nowTime)
    saveFile := savePath + util.GetMD5(fileName+fileID+nowTimeStr)
    //util.Println(saveFile)
    f, err := os.OpenFile(saveFile, os.O_WRONLY|os.O_CREATE, 0644)
    if err != nil {
        util.Log("error", "Open file error: %s", err)
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
        fmt.Fprintln(w, "Not supported request which is not with 'POST' method, a post request required.")
        return
    }

    r.ParseForm()

    ok, err := api.VerifyLogin([]byte(r.Form["data"][0]))
    if err != nil {
        util.Log("error", "Verify authentication credentials error: ", err)
        w.WriteHeader(http.StatusInternalServerError)
        fmt.Fprintln(w, "Verify authentication credentials error: " + err.Error())
        return
    }

    if !ok {
        w.WriteHeader(http.StatusUnauthorized)
        fmt.Fprintln(w, "Authorize to backend server error.")
        return
    }

    chatPort, err := util.String2Int(util.Config.ChatPort)
    if err != nil {
        util.Log("error", "Convert chat port to number error: %s", err)
        fmt.Fprintln(w, "Chat port \"" + util.Config.ChatPort + "\" is incorrect.")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    info := retCInfo{
        Version:        util.Version,
        Token:          string(util.Token),
        SiteType:       util.Config.SiteType,
        UploadFileSize: util.Config.UploadFileSize,
        ChatPort:       chatPort,
        TestModel:      util.IsTest}

    jsonData, err := json.Marshal(info)
    if err != nil {
        util.Log("error", "Json marshal error: %s", err)
        fmt.Fprintln(w, "Json marshal error: " + err.Error())
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    fmt.Fprintln(w, string(jsonData))
}
