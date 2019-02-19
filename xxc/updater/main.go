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

var commands = map[string]string{
	"windows": "start",
	"darwin":  "open",
	"linux":   "xdg-open",
}

func main() {
	src  := flag.String("src", "", "Source directory path.")
	app  := flag.String("app", "", "Destination directory path")
	run  := flag.String("run", "", "Open the application?")
	flag.Parse()

	if *src != "" && *app != ""{
		time.Sleep(time.Second * 2)

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
	run, ok := commands[runtime.GOOS]
	if !ok {
		return fmt.Errorf("don't know how to open things on %s platform", runtime.GOOS)
	}

	cmd := exec.Command(run, uri)
	return cmd.Start()
}
