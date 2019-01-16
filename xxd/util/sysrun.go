/**
 * The sysrun file of util current module of xxd.
 *
 * @copyright   Copyright 2009-2017 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Archer Peng <pengjiangxiu@cnezsoft.com>
 * @package     util
 * @link        http://www.zentao.net
 */
package util

import (
    "flag"
    "os"
    "runtime"
    "database/sql"
    "bufio"
)

const Version = "v2.4.0"

var Run bool = true
var IsTest bool = false
var Token []byte
var DBConn *sql.DB
var Languages map[string]string

func init() {
    dir, _ := os.Getwd()
    isTest := flag.Bool("test", false, "server test model")
    flag.Parse()
    IsTest = *isTest

    DBConn = InitDB()

    // xxd 启动时根据时间生成token
    timeStr := Int642String(GetUnixTime())
    Token = []byte(GetMD5(timeStr))
    Languages = make(map[string]string)
    if IsTest {
        Printf("Server test model is %t \n", IsTest)
    }


    Printf("[Info] XXD %s is running \n", Version)
    Printf("[Info] XXD runs the directory %s \n", dir)
    Printf("[Info] XXD token is %s \n", string(Token))
    Printf("[Info] System: %s-%s \n", runtime.GOOS, runtime.GOARCH)
    Printf("---------------------------------------- \n")

    Log("info", "XXD %s is running", Version)
    Log("info", "XXD runs the directory %s", dir)
    Log("info", "XXD token is %s", string(Token))
    Log("info", "ProgramName:%s, System:%s-%s", GetProgramName(), runtime.GOOS, runtime.GOARCH)
    Log("info", "---------------------------------------- \n")

    // 设置 cpu 使用
    runtime.GOMAXPROCS(runtime.NumCPU())
}

func GetNumGoroutine() int {
    return runtime.NumGoroutine()
}

func Exit(v... interface{}) {
    Println(v...)

    Println("Press ESC button or Ctrl-C to exit this program")
    for {
        consoleReader := bufio.NewReaderSize(os.Stdin, 1)
        input, _ := consoleReader.ReadByte()
        ascii := input

        // ESC = 27 and Ctrl-C = 3
        if ascii == 27 || ascii == 3 {
            DBConn.Close()
            os.Exit(1)
            os.Exit(0)
        }
    }
    return
}
