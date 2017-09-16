+++
date = "2017-07-21T08:21:52+09:00"
title = "iOSの通信をキャプチャする"
draft = true

categories = ["enginner"]
tags = ["osx", "wireshark", "ios"]
+++

iOSの通信をキャプチャする手順をまとめます。

* 端末のUUIDを調べる
* dumpファイルを作成する
* dumpファイルをWireSharkで開く


* dumpファイルをWireSharkで開く

rvictl -s UUID
tcpdump -i rvi0 -w dump_file_name

rvictl -x UUID

できたdumpファイルをWireSharkで開く
