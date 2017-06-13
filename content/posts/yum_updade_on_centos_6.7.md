+++
date = "2017-06-13T20:27:45+09:00"
title = "CentOS6系のyum updateでつまづいたのでメモ"

categories = ["engineering"]
tags = ["centos", "linux", "さくらvps"]
+++

# 背景

let's encryptの証明書更新用に仕込んだcronがエラーを吐いているようで、
原因を調査したところyum install系で更新ができないエラー。
yum updateすればなおるかなーと思ったがそもそもyum updateも404返ってきてうまくいかない。
どうやら、yumのリポジトリのミラーが古いバージョンのままになったようでした。

# 環境

* さくらVPS
* CentOS 6.7

# 解決方法
以下のサイトが非常に参考になったので、その通り下記の対応をしたら無事に解決した。
よかったよかった。

[\[tips\]\[Linux\]旧バージョンCentOSでyum更新できなくなった時](http://luozengbin.github.io/blog/2015-08-29-%5Btips%5D%5Blinux%5D%E6%97%A7%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3centos%E3%81%A7yum%E6%9B%B4%E6%96%B0%E3%81%A7%E3%81%8D%E3%81%AA%E3%81%8F%E3%81%AA%E3%81%A3%E3%81%9F%E6%99%82.html)

```
$ su -
$ cd /etc/yum.repos.d

$ cp -p CentOS-Base.repo CentOS-Base.repo_yymmdd
$ sed -i -e "s|mirror\.centos\.org/centos/\$releasever|vault\.centos\.org/6.7|g" /etc/yum.repos.d/CentOS-Base.repo
$ sed -i -e "s|#baseurl=|baseurl=|g" CentOS-Base.repo
$ sed -i -e "s|mirrorlist=|#mirrorlist=|g" CentOS-Base.repo

$ cp -p CentOS-SCL.repo CentOS-SCL.repo_yymmdd
$ sed -i -e "s|mirror\.centos\.org/centos/\$releasever|vault\.centos\.org/6.7|g" /etc/yum.repos.d/CentOS-SCL.repo
$ sed -i -e "s|#baseurl=|baseurl=|g" CentOS-SCL.repo
$ sed -i -e "s|mirrorlist=|#mirrorlist=|g" CentOS-SCL.repo

$ sudo yum clean all
$ sudo yum update
```

レポジトリのミラーが変わることとかあるんだなーと思ったのと、これはCentOS7にあげるべきなんじゃないかと思ったので、暇があったらやろうかなと思います。多分。

あとsedちゃんと使えないので、一回ちゃんと勉強しなきゃなぁと痛感しました。
