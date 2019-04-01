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
    "os"
    "runtime"
    "database/sql"
    "bufio"
    "path/filepath"
)

const Version = "v2.5.1"
const Build = "BuildForXXD"

var Run bool = true
var Token []byte
var DBConn *sql.DB
var Languages map[string]string
var Plats = []string{"desktop", "mobile"}

func init() {
    dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))
    DBConn = InitDB()

    // xxd 启动时根据时间生成token
    timeStr := Int642String(GetUnixTime())
    Token = []byte(GetMD5(timeStr))
    Languages = make(map[string]string)
    if IsTest {
        Printf("Server test model is %t \n", IsTest)
    }

    Printf("[I] XXD %s %s is running \n", Version, Build)
    Printf("[I] XXD runs the directory %s \n", dir)
    Printf("[I] System: %s-%s \n", runtime.GOOS, runtime.GOARCH)
    Printf("---------------------------------------- \n")

    Log("info", "XXD %s %s is running", Version, Build)
    Log("info", "XXD runs the directory %s", dir)
    Log("info", "ProgramName:%s, System:%s-%s", GetProgramName(), runtime.GOOS, runtime.GOARCH)

    LogDetail("[Config] IP：" + Config.Ip)
    LogDetail("[Config] ChatPort：" + Config.ChatPort)
    LogDetail("[Config] CommonPort：" + Config.CommonPort)
    LogDetail("[Config] IsHttps：" + Config.IsHttps)
    LogDetail("[Config] Debug：" + string(Config.Debug))
    LogDetail("[Config] UploadPath：" + Config.UploadPath)
    LogDetail("[Config] UploadFileSize：" + string(Config.UploadFileSize))
    LogDetail("[Config] LogPath：" + Config.LogPath)
    LogDetail("[Config] CrtPath：" + Config.CrtPath)
    LogDetail("[Config] MaxOnlineUser：" + string(Config.MaxOnlineUser))

    LogDetail("")

    // 设置 cpu 使用
    runtime.GOMAXPROCS(runtime.NumCPU())
}

func GetNumGoroutine() int {
    return runtime.NumGoroutine()
}

func Exit(v... interface{}) {
    Println(v...)

    Println("Press Ctrl+C to exit this program")
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
