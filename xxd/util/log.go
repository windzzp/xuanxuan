/**
 * The log file of util current module of xxd.
 *
 * @copyright   Copyright 2009-2017 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Archer Peng <pengjiangxiu@cnezsoft.com>
 * @package     util
 * @link        http://www.zentao.net
 */
package util

import (
    "fmt"
    "log"
    "os"
    "path/filepath"
    "sync"
)

type logger log.Logger

const saveLogTime int64 = 60 * 60 * 24 * 7

var mu sync.RWMutex
var fd *os.File
var logHandle *log.Logger

func init() {
    if err := newLog(); err != nil {
        fmt.Printf("create log error %s\n", err)
    }
}

func newLog() error {
    mu.Lock()
    defer mu.Unlock()

    if err := Mkdir(Config.LogPath); err != nil {
        fmt.Printf("mkdir error %s\n", err)
        return err
    }

    if fd != nil {
        fd.Close()
    }

    fileName := fmt.Sprintf("%s_%s.log", Config.LogPath+GetProgramName(), GetYmd())
    fd, err := os.OpenFile(fileName, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)
    if err != nil {
        fmt.Printf("create file error %s\n", err)
        return err
    }

    logHandle = log.New(fd, "", log.Ltime|log.Lshortfile)

    return nil
}

func LogInfo() *log.Logger {
    logHandle.SetPrefix("[info] ")
    return logHandle
}

func LogError() *log.Logger {
    logHandle.SetPrefix("[error] ")
    return logHandle
}

//输出到日志,换行
func (l *logger) Println(v ...interface{}) {
    if Config.DebugLevel == 1 {
        Println(v...)
    }

    if Config.DebugLevel > 0 {
        mu.RLock()
        defer mu.RUnlock()

        logHandle.Println(v...)
    }
}

//输出到日志，格式化
func (l *logger) Printf(format string, v ...interface{}) {
    if Config.DebugLevel == 1 {
        Printf(format, v...)
    }

    if Config.DebugLevel > 0 {
        mu.RLock()
        defer mu.RUnlock()

        logHandle.Printf(format, v...)
    }
}

//字符串被包装成了 error 类型
func Errorf(format string, v ...interface{}) error {
    LogError().Printf(format, v...)
    return fmt.Errorf(format, v...)
}

func Println(v ...interface{}) {
    fmt.Println(v...)
}

func Printf(format string, v ...interface{}) {
    fmt.Printf(format, v...)
}

// 给定时任务调用的函数，管理日常记录的日志
func CheckLog() {
    fileName := fmt.Sprintf("%s_%s.log", Config.LogPath+GetProgramName(), GetYmd())
    if IsNotExist(fileName) {
        if err := newLog(); err != nil {
            fmt.Printf("create log error %s\n", err)
        }
    }

    if err := filepath.Walk(Config.LogPath, walkFunc); err != nil {
        LogError().Printf("filePath %s walk error: %s\n", Config.LogPath, err)
    }
}

func walkFunc(path string, info os.FileInfo, err error) error {
    if err != nil {
        return err
    }

    if info.IsDir() {
        return nil
    }

    if GetUnixTime()-info.ModTime().Unix() > saveLogTime {
        err := Rm(path)
        if err != nil {
            LogError().Printf("remove file [%s] error: %s\n", info.Name(), err)
            return err
        }
    }

    return nil
}