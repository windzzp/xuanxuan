#!/bin/sh
rsrc -manifest updater.manifest -o updater.syso
CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -o ./bin/updater.mac main.go
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ./bin/updater.linux64 main.go
CGO_ENABLED=0 GOOS=linux GOARCH=386 go build -o ./bin/updater.linux32 main.go
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o ./bin/updater.win64.exe main.go
CGO_ENABLED=0 GOOS=windows GOARCH=386 go build -o ./bin/updater.win32.exe main.go

echo "build end "

