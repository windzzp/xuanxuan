#!/bin/sh

version=xxd.$1
TIME=$(date "+%Y-%m-%d %H:%M:%S")

sed -i '' "s/BuildForXXD/Build at ${TIME}/g" util/sysrun.go

echo "build version:"$version

echo "build darwin ..."
folder=$version.mac
if [ ! -d $folder ]; then
    mkdir $folder
fi
xgo -out $folder/xxd --deps=https://gmplib.org/download/gmp/gmp-6.1.2.tar.bz2 -ldflags '-extldflags "-static"' --targets=darwin/amd64 .
mv $folder/xxd* $folder/xxd
cp -Ra config $folder
tar zcf $folder.tar.gz $folder
rm -rf $folder


folder=$version.linux.x64
if [ ! -d $folder ]; then
    mkdir $folder
fi
echo "build linux x64 ..."
xgo -out $folder/xxd --deps=https://gmplib.org/download/gmp/gmp-6.1.2.tar.bz2 -ldflags '-extldflags "-static"' --targets=linux/amd64 .
mv $folder/xxd* $folder/xxd
cp -Ra config $folder
tar zcf $folder.tar.gz $folder
rm -rf $folder


folder=$version.linux.ia32
if [ ! -d $folder ]; then
    mkdir $folder
fi
echo "build linux ia32 ..."
xgo -out $folder/xxd --deps=https://gmplib.org/download/gmp/gmp-6.1.2.tar.bz2 -ldflags '-extldflags "-static"' --targets=linux/386 .
mv $folder/xxd* $folder/xxd
cp -Ra config $folder
tar zcf $folder.tar.gz $folder
rm -rf $folder


folder=$version.win64
if [ ! -d $folder ]; then
    mkdir $folder
fi
echo "build win64 ..."
xgo -out $folder/xxd --deps=https://gmplib.org/download/gmp/gmp-6.1.2.tar.bz2 -ldflags '-extldflags "-static"' --targets=windows/amd64 .
mv $folder/xxd* $folder/xxd.exe
cp -Ra config $folder
zip -rq $folder.zip $folder
rm -rf $folder


folder=$version.win32
if [ ! -d $folder ]; then
    mkdir $folder
fi
echo "build win32 ..."
xgo -out $folder/xxd --deps=https://gmplib.org/download/gmp/gmp-6.1.2.tar.bz2 -ldflags '-extldflags "-static"' --targets=windows/386 .
mv $folder/xxd* $folder/xxd.exe
cp -ra config $folder
zip -rq $folder.zip $folder
rm -rf $folder

echo "build end "

