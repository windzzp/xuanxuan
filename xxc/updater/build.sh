#!/bin/sh

CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -o updater_mac main.go
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o updater_linux_x64 main.go
CGO_ENABLED=0 GOOS=linux GOARCH=386 go build -o updater_linux_i386 main.go
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o updater_win_x64.exe main.go
CGO_ENABLED=0 GOOS=windows GOARCH=386 go build -o updater_win_i386.exe main.go

echo "build end "

