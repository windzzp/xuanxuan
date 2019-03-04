package util

import (
	"os"
	"log"
	"io"
	"time"
)

var Log *log.Logger

func init() {
	errFile, err := os.OpenFile("updater_" + time.Now().Format("20060102") + ".log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalln("打开日志文件失败：", err)
	}
	Log = log.New(io.MultiWriter(os.Stderr, errFile), "", log.Ldate|log.Ltime|log.Lshortfile)
}