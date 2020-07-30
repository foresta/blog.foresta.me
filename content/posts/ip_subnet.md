+++
title="IPアドレスとサブネット"
date="2020-04-26T22:04:48+09:00"
categories = ["engineering"]
tags = ["ip", "network", "tcp"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、AWSのネットワーク周りの設定をしているなかで、IPアドレスやサブネット周りで再確認することが多かったのでメモしておきます。

## プライベートIPアドレス

インターネットで使用されない、プライベートアドレスがあります。AWSのVPC内でもこれらのプライベースIPを使用します。

プライベートIPアドレスで使用できるのは以下の範囲です。

* 10.0.0.0 ~ 10.255.255.255
* 172.16.0.0 ~ 172.31.255.255
* 192.168.0.0 ~ 192.168.255.255

## IP アドレスの範囲

IPアドレスは、192.168.0.0 ~ 192.168.255.255 などの範囲で表すことができて、VPCなどを構築する際には必要な分の範囲を確保しておきます。

例えば、上記の例では65536個のIPアドレスを確保していることになります。

上記の例で、`192.168` 部分の 16bit を ネットワーク部、`0.0 ~ 255.255` の部分はホスト部と呼ばれます。

192.168.1.0 ~ 192.168.1.255 の範囲の場合は、`192.168.1` 部分がネットワーク部、`0 ~ 255` の部分がホスト部になります。

## CIDR表記

前述の、192.168.0.0 ~ 192.168.255.255 の場合、以下のように表記することができます。

```
192.168.0.0/16
```

スラッシュ以降の、`/16` は、ネットワーク部の bit 数を表していて、`192.168` 部分がネットワーク部という意味となります。

## サブネットマスク表記

前述の、 `192.168.0.0 ~ 192.168.255.255` の範囲を以下のように表記することができます。 

```
192.168.0.0/255.255.0.0
```

スラッシュ以降の部分画、サブネットマスクでネットワーク部のマスクとなっています。

## まとめ

今回は、IPアドレスとサブネットマスク、IPアドレスの範囲の表記法を簡単にまとめました。
基本的な部分ですが意外と忘れてたりしたのでこの機会に再確認できてよかったです。


