package util

import (
	"os"
	"log"
	"io"
	"time"
	"fmt"
)

var logHandle *log.Logger

func init() {
	logFile, err := os.OpenFile("updater_" + time.Now().Format("20060102") + ".log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalln("打开日志文件失败：", err)
	}
	logHandle = log.New(io.MultiWriter(os.Stderr, logFile), "", log.Ldate|log.Ltime)
}

func Log() *log.Logger {
	return logHandle
}

func Println(v ...interface{}) {
	fmt.Println(v...)
}