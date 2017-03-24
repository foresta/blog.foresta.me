+++
date = "2017-02-10"
title = "UDPについてまとめてみた"

categories = ["engineering"]
tags = ["udp", "ネットワーク"]
+++

WebRTCにも使われているプロトコルであるUDPについてまとめてみました。


# UDPとは

UDP（User Datagram Protocol）とは、TCPと同じトランスポート層のプロトコルです。

RFC768によって策定されています。UDPの特徴として以下のようなものがあげられます。

コネクションレスなデータ通信
データの信頼性、順序などを保証しない
高いスループット（伝送速度）
マルチキャスト、ブロードキャスト
コネクションレスとは、通信相手との接続を確立しないということです。
送信側が送りたいデータを一方的に受信側に送るため、接続を確立せずに通信が行えます。
こういった特徴があるため、データの信頼性、順序性などは保証されませんが、高速な送信を実現できます。
また、TCPは接続を確立するため、ユニキャスト（１対１）しか行えませんが、UDPはコネクションレスのため、マルチキャスト、ブロードキャストに対応可能です。
その他に、TCPでは複雑な制御をするためにTCPヘッダを送りたいデータに付属させる必要があります。TCPヘッダのサイズは通常20 Byteほどです。UDPにもヘッダは必要なのですが8 Byteと少量のため、小規模なデータの送信などはUDPの方が効率よく行えます。

# 使用されているサービス

UDPプロトコルは以下のような技術に使用されています。

* DNS
* DHCP
* VoIP
* 動画ストリーミング

DNSはIPアドレスとドメインを対応づけるプロトコルです。
DHCPはLAN内のパソコンなどにIPアドレスを動的に割り当てるプロトコルです。
VoIPはIPネットワーク上で音声データを通信する技術です。

ブロードキャストを行う必要があったり、信頼性よりもリアルタイム性が重要視される場面ではUDPが選択されることが多いです。

# データグラム

TCPではデータの通信の単位をパケットと呼びますがUDPでは「データグラム」といいます。
実際にネットワーク上を流れているデータは以下のようなものとなります。

{{< figure src="/images/posts/learn_about_udp/udp_datagram.png" title="UDPデータグラム" >}}

UDPデータグラムの表
上の表の送信元ポート、送信先ポート、データグラム長、チェックサムまでがUDPヘッダとなり、
ペイロードが実際に送信したいデータになります。

0~15bitまでは16bitが送信元のポート番号を表します。
16~31bitまでは16bitが送信先のポート番号を表します。
32~47bitまではデータグラム長を表します。データグラム長は、UDPヘッダとUDPペイロードの合計値です。
48~64bitまではチェックサムを表します。チェックサムは、データ（ペイロード）の整合性の検査用データとなります。
それ以降がペイロードです。

UDPデータグラムのサイズですが、これはIPパケットのサイズに依存します。
IPパケットは65535 Byteの容量となり、IPヘッダが20 Byteのため、UDPデータグラムで使用可能な容量は65535 – 20 = 63315となります。そしてUDPヘッダが8Byteのため、UDPペイロードの容量は最大で65507 Byteということになります。

よってデータグラム長に入る値は8 ~ 65515ということになります。

# まとめ

* UDPはコネクションレスの通信方法
* 信頼性を犠牲にして高スループットな通信を実現
* ヘッダサイズが小さく、オーバーヘッドが少ない（複雑な制御を行わないため）