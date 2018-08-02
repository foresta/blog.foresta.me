+++
date = "2018-06-02T12:21:54+09:00"
title = "Goならわかるシステムプログラミング"
categories = ["memo"]
tags = ["go"]
thumbnail = ""
draft=true
+++

# Goならわかるシステムプログラミング

ファイルディスクリプタ
: OSが用意する、ファイルを扱うための抽象(数値). `fd_unix.go` ではsyscall.Write(fd.Sysfd int, []byte)と呼ばれている. fdは0がstdin, 1がstdout, 2がstderr. `fmt.Println();` した時は,このファイルディスクリプタに1が指定されている. ファイルの他, ソケットなどもあつかえる.

io.Writer
: ファイルディスクリプタを用いてファイル操作をするためのインターフェース

疑問

```
var buffer bytes.Buffer

io.WriteString(buffer, "test io.WriteString") // -> コンパイルエラー
io.WriteString(&buffer, "test io.WriteString") // -> コンパイル通る
```
