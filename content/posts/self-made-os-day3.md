+++
title = "自作OS3日目 Docker上でOSをビルドする"
thumbnail = ""
tags = ["アセンブラ", "c", "Docker", "Dockerfile", "Makefile", "os", "os自作"]
categories = ["engineering"]
date = "2019-10-27"
+++

こんにちは。[@kz_morita](https://twitter.com/kz_morita) です。

最近は `30 日でできる！OS 自作入門` の本をのんびりとすすめています。情報がやや古いですが OS の仕組みについて自作しながら学べる素晴らしい本だと思います。

<a href="https://www.amazon.co.jp/30%E6%97%A5%E3%81%A7%E3%81%A7%E3%81%8D%E3%82%8B-OS%E8%87%AA%E4%BD%9C%E5%85%A5%E9%96%80-%E5%B7%9D%E5%90%88-%E7%A7%80%E5%AE%9F/dp/4839919844/ref=as_li_ss_il?_encoding=UTF8&qid=1572143788&sr=8-1&linkCode=li2&tag=foresta04-22&linkId=4f25f022b6a248de30a140c32d2be01b&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=4839919844&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=4839919844" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/3699qQW" text="30日でできる! OS自作入門" >}}

ちなみに新しめの本だた、最近以下の本も発売されたみたいなので、こちらの本で入門されるのも良いかもしれません。\
(自分も購入だけして積んであります)

<a href="https://www.amazon.co.jp/dp/429710847X/ref=as_li_ss_il?ie=UTF8&linkCode=li2&tag=foresta04-22&linkId=08b79b320005646840f0c94465dd0615&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=429710847X&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=429710847X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/2PxfY6n" text="作って理解するOS x86系コンピュータを動かす理論と実装" >}}

今回はこの 30 日 OS 自作本の 3 日目で開発環境周りでつまづいたのでそのことについてまとめます。

## 背景

上記の本(緑の方)は基本的に、Windows 上での開発なのですが、自分は macOS 上で開発を行っていました。\
macOS 上（Linux 上）での開発環境の構築などは先人の方々がたくさん Web 情に資料を残してくださっているおかげでわりとすんなり環境構築ができました。

以下のブログや、github が非常に参考になったのでおすすめです。

- [「30 日でできる！ OS 自作入門」を Mac 向けに環境構築する](https://qiita.com/tatsumack/items/491e47c1a7f0d48fc762)
- https://github.com/tatsumack/30nichideosjisaku

本ブログでも環境構築の内容を上記のブログ、リポジトリを参考にしながら書いているのでよかったら参考にしてみてください。

[「30 日でできる！OS 自作入門」の準備](/posts/prepare_making_os_in_30days/)

1, 2 日目は、スムーズにうまく行くのですが、3 日目に C 言語を導入する時に C 言語のコンパイル（リンカ）周りでつまづきました。

- [30 日でできる！OS 自作入門（３日目）Ubuntu16.04/NASM](https://qiita.com/pollenjp/items/8fcb9573cdf2dc6e2668)

上記の方の記事やリポジトリはすごく参考になったのですが、hrb ファイルを作成する際に gcc の `-T` オプションをつかってリンカスクリプトを書くことで OS をビルドしていました。\
この手順通り進めていこうと思ったのですが、macOS で標準で入っている C コンパイラである clang には `-T` オプションがない模様です。

{{< tweet 1186474692829278209 >}}

ここで選択肢としては、別の方法で hrb ファイルを生成するか、macOS に gcc をインストールするかでした。
別の方法はちょっと自分の知識では調査に時間がかかりそうだったので厳しかったし、macOS に gcc をインストールするのは iOS 開発なども行っている関係上 C 言語周りのツールチェインをあまりいじりたくないという状態でした。

どうしようか悩んでましたが、こういうときこそ Docker の出番ではなかろうかと思い、今回は Docker 上で OS をビルドすることにしました。

{{< tweet 1186508399657140225 >}}

## Docker 上で OS をビルドする

最初に OS をビルドするために構築した Dockerfile を載せておきます。

https://github.com/foresta/self-made-os/blob/master/haribOS/Dockerfile

```dockerfile
FROM alpine:3.10

MAINTAINER kz_morita

ENV IMAGE_NAME=haribote-os

RUN apk update && \
    apk --no-cache add \
        build-base \
        nasm \
        mtools

WORKDIR /haribos

CMD ["/bin/ash"]
```

イメージはサイズを小さくしたかったこともあり alpine linux を使用しました。

上記 Dockerfile でやっていることとしては、特別なことをしているわけではなく、必要なアプリケーションをインストールしている感じです。

gcc はデフォルトで入っているものを利用すれば良いため以下のものをインストールします。

- build-base
- nasm
- mtools

OS のビルドには GNU Make を利用しているので Makefile も簡単に説明します。

Makefile 全体はこちら\
{{< exlink href="https://github.com/foresta/self-made-os/blob/master/haribOS/Makefile" >}}

`make build` で OS をビルドして、`make run` で qemu (というエミュレータ)を用いて実行し、 `make` 単体で build & run を行うように設定しました。

Docker を使ってビルドするために、 `build-with-docker` というタスクを用意しました。

```makefile
.PHONY: build-with-docker
build-with-docker:
	docker build -t haribos .
	docker run -v `pwd`:/haribos haribos make img
```

docker build して、イメージを作ったあとに コンテナを起動し、 `make img` コマンドを実行することでビルドを行っています。\
`-v` オプションでカレントディレクトリをマウントし、Docker 化する前に実行されていた、`make img` タスクを実行することで alpine linux 上で OS をビルドしています。

あとは以下のように `make build-with-docker` を実行するタスクを用意すればうまく動きました。

```makefile
.DEFAULT_GOAL: all
.PHONY: all
all:
	make build-with-docker
	make run

build:
	make build-with-docker
```

## まとめ

30 日でできる！OS 自作入門の OS を Docker 上でビルドする方法について簡単にまとめました。\
この本は、情報が古かったり、そもそも対象とする OS が違ったりしてビルド環境でつまづくことが多いですが、こういう時に Docker をすごく簡単にビルド環境をつくれてとても便利だと思いました。

環境でつまづいくようなケースにでくわすとげんなりしますが、環境による不具合を修正して動くようにするといったプロセスは様々な知識の宝庫だとこの OS 自作入門本を始めてから痛感しています。

まだ 3 日目でペースも遅いし、さっそく 4 日目の内容でつまづいてたりしますが、なんとか 30 日目を終えて OS を完成させたいと思います。\
自作 OS 楽しい！
