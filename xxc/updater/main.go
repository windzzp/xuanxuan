package main

import (
	"flag"
	"time"
	"runtime"
	"os"
	"fmt"
	"os/exec"
	"updater/util"
)

func main() {
	src := flag.String("src", "", "Source directory path.")
	app := flag.String("app", "", "Destination directory path")
	run := flag.String("run", "", "Open the application?")
	flag.Parse()
	fmt.Println("READY")
	if *src != "" && *app != ""{
		time.Sleep(time.Second * 10)

		if runtime.GOOS == "darwin" {
			os.RemoveAll(*app)
		}

		if err := util.Copy(*src, *app); err != nil {
			fmt.Println(err)
            os.Exit(0)
		}
	}

	if *run != "" {
		Open(*run)
	}

	fmt.Println("Finished.")
}

func Open(uri string) error {
	switch runtime.GOOS {
	case "windows":
		cmd := exec.Command("rundll32.exe", "url.dll,FileProtocolHandler", uri)
		return cmd.Start()
	case "darwin":
		cmd := exec.Command("open", uri)
		return cmd.Start()
	default:
		cmd := exec.Command("base", "-c", "xdg-open" + uri)
		return cmd.Start()
	}
}
