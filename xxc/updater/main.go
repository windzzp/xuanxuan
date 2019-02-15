package main

import (
	"fmt"
	"flag"
	"os"
	"path/filepath"
	"strings"
	"io"
	"runtime"
	"os/exec"
	"time"
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

		if err := CopyDir(*src, *app); err != nil {
			fmt.Println(err.Error())
		}
	}

	if *run != "" {
		Open(*run)
	}

	fmt.Println("Finished.")
}

/**
 * 拷贝文件夹,同时拷贝文件夹中的文件
 */
func CopyDir(src string, dest string) error {
	//检测目录正确性
	if srcInfo, err := os.Stat(src); err != nil {
		fmt.Println(err.Error())
		return err
	} else {
		if !srcInfo.IsDir() {
			return fmt.Errorf("源路径不是一个正确的目录")
		}
	}

	if err := os.MkdirAll(dest, os.ModePerm); err != nil{
		return fmt.Errorf("目标目录创建失败")
	}

	if destInfo, err := os.Stat(dest); err != nil {
		return fmt.Errorf("目标目录不是一个正确的路径")
	} else {
		if !destInfo.IsDir() {
			return fmt.Errorf("目标目录不匹配")
		}
	}

	err := filepath.Walk(src, func(path string, f os.FileInfo, err error) error {
		if f == nil {
			return err
		}
		if !f.IsDir() {
			path := strings.Replace(path, "\\", "/", -1)
			destNewPath := strings.Replace(path, src, dest, -1)
			copyFile(path, destNewPath)
		}
		return nil
	})
	if err != nil {
		fmt.Printf(err.Error())
	}
	return err
}

//生成目录并拷贝文件
func copyFile(src, dest string) (w int64, err error) {
	srcFile, err := os.Open(src)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer srcFile.Close()

	//分割path目录
	destSplitPathDirs := strings.Split(dest, "/")

	//检测时候存在目录
	destSplitPath := ""
	for index, dir := range destSplitPathDirs {
		if index < len(destSplitPathDirs)-1 {
			destSplitPath = destSplitPath + dir + "/"
			b, _ := pathExists(destSplitPath)
			if b == false {
				err := os.MkdirAll(destSplitPath, os.ModePerm)
				if err != nil {
					fmt.Println(err)
				}
			}
		}
	}

	dstFile, err := os.Create(dest)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer dstFile.Close()

	return io.Copy(dstFile, srcFile)
}

//检测文件夹路径时候存在
func pathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}

func Open(uri string) error {
	run, ok := commands[runtime.GOOS]
	if !ok {
		return fmt.Errorf("don't know how to open things on %s platform", runtime.GOOS)
	}

	cmd := exec.Command(run, uri)
	return cmd.Start()
}