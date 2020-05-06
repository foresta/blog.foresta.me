+++
title="Amazon Web Services 基礎からのネットワーク&サーバー構築 を読んだ"
date="2020-05-06T12:27:43+09:00"
categories = ["engineering"]
tags = ["aws", "book", "vpc", "network"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、AWSのネットワーク周りを学ぼうとして以下の本を読んだので感想などを書いていきます。

<a href="https://www.amazon.co.jp/dp/B084QQ7TCF/ref=as_li_ss_il?ie=UTF8&linkCode=li2&tag=foresta04-22&linkId=a867aa381c69cdbbd5dd09552111e2f3&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B084QQ7TCF&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B084QQ7TCF" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/2W5p5Om" text="Amazon Web Services 基礎からのネットワーク＆サーバー構築  改訂3版" >}}

## 目次

* CHAPTER 1 システム構築をインフラから始めるには
* CHAPTER 2 ネットワークを構築する
* CHAPTER 3 サーバーを構築する
* CHAPTER 4 Web サーバーソフトをインストールする
* CHAPTER 5 HTTP の動きを確認する
* CHAPTER 6 プライベートサブネットを構築する
* CHAPTER 7 NAT を構築する
* CHAPTER 8 DB を用いたブログシステムの構築
* CHAPTER 9 TCP / IP による通信の仕組みを理解する
* Appendix A パケットキャプチャで通信をのぞいてみる
* Appendix B ネットワークの管理・運用とトラブルシューティング

## できるようになること

この本を一通りやると、Web サーバーと、DB サーバーからなる簡単なアプリケーションのネットワークを構築できるようになります。(本書の例では WordPress をインストールして動かすところまでを行います)

具体的には、VPCを作成してその中にパブリックサブネットとプライベートサブネットを作成しました。
パブリックサブネットの中に EC2 インスタンスを立てて、インターネットからアクセスできるように、Internet Gateway を設定したり、Web サーバーとして動くように Apache をインストールしました。

プライベートサブネット側には、DB Server として EC2 を構築して、EC2 内からインターネットへ接続できるように、NAT ゲートウェイを構築しました。
このプライベートサブネット内の、DB Server には、踏み台サーバーを通して ssh ログインを行いました。

## 感想など

この本を読む前は、EC2 とか S3 とかはなんとなく使えるけど、一からネットワークを構築しようとするとなにからさっぱり手をつけて良いのかわからない、といった状態でしたが、読んだ後はなんとなくネットワークのことがわかって構築できそうなところまで学ぶことができました。

この本ではアプリケーションを動かすのに必要なネットワークの構築方法が丁寧なスクリーンショット付きで解説されていて、とくに迷うことなく一通り構築できたのはとても良かったです。

また、AWSの使い方だけではなく、ルーティングの仕組みや、HTTPの仕組み、TCP / IP の仕組みなどについても詳しく説明されていてまさにアプリケーション開発者がインフラ構築する際の第一歩として良い本だと感じました。

CloudFormation などを使ったインフラのコード化に関しては簡単な紹介にとどまっていたので、次のステップとしてそこに挑戦するのが良さそうだと思ってます。

AWSでネットワーク周りの構築ができるようになりたいと思っていた自分にはぴったりの書籍でした。


