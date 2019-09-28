+++
title = "「30日でできる！OS自作入門」の準備"
thumbnail = ""
tags = ["os", "qemu", "macOS"]
categories = ["engineering"]
date = "2019-09-28"
+++

こんにちは、[@kz_morita](https://twitter.com/kz_morita)です。

最近[「30 日でできる! OS 自作入門」](https://book.mynavi.jp/ec/products/detail/id=22078) という本を購入して始めました。タイトルのとおり OS を自作していく本なのですが、Windows 環境向けに書かれています。

今回はこの本に取り組む準備として、macOS 向けに OS を自作するための環境を作っていきます。

## 環境

```
$ sw_vers
ProductName:	Mac OS X
ProductVersion:	10.15
BuildVersion:	19A558d<Paste>
```

## macOS 用の環境を整備する

さて、macOS 用の環境を作っていくのですが、すでに環境を作られている方がいます。

以下のリポジトリにある通りに環境構築をしていきます。

https://github.com/tatsumack/30nichideosjisaku

#### リポジトリのクローン

```
$ git clone https://github.com/tatsumack/30nichideosjisaku
```

#### qemu のインストール

OS を動かす環境として、 `qemu` というエミュレータを使用します。

上記の手順では、 Homebrew を用いて qemu をインストールしているのですが自分の環境だと、Homebrew でインストールした qemu はバージョンが 4.1.1 でした。

4.1.1 だと、動作しなかったため (ずっと読み込み中になってしまってました)今回は、3.1.1 をソースコードからビルドして入れます。

ソースコードは以下からダウンロードします。
https://www.qemu.org/download/#source

または、以下のように wget でも良いでしょう。

```
wget https://download.qemu.org/qemu-3.1.1.tar.xz
```

ダウンロードしたら、以下のようにインストールすれば OK です。

```
tar xvJf qemu-3.1.1.tar.xz
cd qemu-3.1.1
./configure
make
make install
```

以下のようにバージョン情報が出力されればインストールは完了しています。

```
$ qemu-system-i386 -version
QEMU emulator version 3.1.1
Copyright (c) 2003-2018 Fabrice Bellard and the QEMU Project developers
```

インストールが終了したら動作確認をしてみます。
先ほど clone したリポジトリに移動して `make run` を叩いてみます。

```
$ cd 30nichideosjisaku/01_day/helloos0/
$ make run
```

以下のような Window が表示されれば成功です。

{{< figure src="/images/posts/prepare_making_os_in_30days/emulator.png" >}}

## まとめ

今回は、qemu をインストールし、「30 日でできる! OS 自作入門」の準備をしました。\
macOS 用の環境構築で詰まっている方の助けになれれば幸いです。
