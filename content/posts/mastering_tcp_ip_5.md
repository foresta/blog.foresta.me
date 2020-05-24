+++
title="マスタリング TCP / IP 入門編 5章"
date="2020-05-24T20:52:03+09:00"
categories = ["engineering"]
tags = ["tcp", "ip", "netrowk", "book"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，マスタリング TCP / IP の5章を読んだので，内容を軽くまとめます．

## 目次

5章はIPに関連する技術の紹介でした．

具体的には，以下の内容でした．

- DNS
- ARP
- ICMP
- DHCP
- NAT

一つずつ簡単にまとめます．

## DNS

DNS (Domain Name System) は，ドメイン名からIPアドレスをひくためのシステムです．
昔は， hosts ファイルを一元管理してたけど，ホスト数が増えてきて管理が大変になってきたので，DNSが生まれました．

DNSは木構造になっていて，ルートまでたどれば，すべてのドメインにアクセスできる分散データベースのようなものです．

木をたどる必要があるので，DNSネームサーバーは，IPアドレスとドメインの対応表 (Aレコード) と, 上位や下位のネームサーバーのIPアドレスレコード (NS レコード)をもちます．

## ARP

ARP (Address Resolution Protocol) は, IP アドレス から MAC アドレスを知るためのプロトコルです．

IPネットワークの通信で，宛先のホストが同一データリンク内などにない場合には，次のホップのルーターのMAC アドレスは ARP で調べることになります．
IPv6 では，ICMPv6 の近隣探索メッセージが利用されるため，ARP は IPv4 のみのプロトコルとなります．

ARPによりデータリンク内では MAC アドレスがわかるので，インターネットで通信するときはIPアドレスのみを意識すればよくなります．

### ARPのアルゴリズム

同一データリンク内にある2つのノード間のやり取りと仮定すると，

1. 送信元が送信先IPアドレスとをもとに，ARP要求パケットをデータリンク内にブロードキャストする．
2. ブロードキャストなので，すべてのノードにARP要求パケットがとどく
3. 自分のIPアドレスとARP要求パケットのIPアドレスとを比較して，一致していれば自分のMACアドレスを含めたARP応答パケットを送信元に返す

ホストA -> ルーター -> ホストB みたいな通信をする場合は，

1. ホストAの宛先IPアドレスはホストB
2. ホストAのルーティングテーブルより，ルーターのIPアドレスを取得
3. ルーターのIPアドレスから，ARPによりルーターのMACアドレスを取得
4. ルーターへパケットを送信
5. ルーターは宛先IPアドレスとルーティングテーブルより，ホストBが同一データリンク内にいることがわかる
6. ARPにより，ホストBのMACアドレスをしる
7. ホストBへ送信する

### RARP (Reverse Address Resolution Protocol)

RARPは ARP を逆引きするためのプロトコルです. (MACアドレス -> IP アドレス)

プリンターなどの機器をネットワークに接続したい場合に, 通常はIPアドレスを入力するインターフェースがあったりするが，プリンタなどにはない場合がある．
DHCP (Dynamic Host Configuration Protocol) などで，自動で割り当てることもできるが，手動で割り当てたいようなケースでは，この RARP が用いられます．

RARPサーバーを用意し，機器のMACアドレスとIPアドレスを予め設定しておくと，プリンタなどの機器の電源がはいると，自動で，RARPサーバーに自らのMACアドレスを渡して IPアドレスを聞き，そのIPアドレスを使うように自身を設定することができます．

### Proxy ARP

ARPパケットは通常，ルーターで遮断されるので同一データリンク内でしか使用できないが，Proxy ARP を使うと，隣のセグメントに転送することができます．これにより一つのセグメント内のように振るまうことができます．

現在は，複数セグメントをルーターで接続するときは，それぞれのセグメントにサブネットを定義しルーティングテーブルで経路制御するので，Proxy する必要はあまりないが，サブネットマスクを設定できないような古い機器等の場合に Proxy ARP は用いられたりします．

## ICMP

ICMP (Internet Control Message Protocol) は IPの通信に異常が発生したときなどに用いることができるプロトコルです．以下のようなタイプが定義されています．

| タイプ | 内容 |
| --- | --- |
| 0 | Echo Reply |
| 3 | Destination Unreachable |
| 4 | Source Quench |
| 5 | Redirect |
| 8 | Echo Request |
| 9 | Router Advertisement |
| 10 | Router Solicitation |
| 11 | Time Exceeded |
| 17 | Address Mask Request |
| 18 | Address Mask Reply |

以下にそれぞれのタイプの説明をします．

### タイプ 3: 到達不能メッセージ

ICMP Destination Unreachable Message

パケットが配送できなかった理由をコードで送ります．コードは以下の通りです．

- 0: Network Unreachable
- 1: Host Unreachable
- 2: Protocol Unreachable
- 3: Port Unreachable
- 4: Fragmentation Needed and Don't Fragment was Set
- 5: Source Route Failed
- 6: Destination Network Unknown
- 7: Destination Host Unknown
- 8: Source Host Isolated
- 9: Communication with Destination Network is Administratively Prohibited
- 10: Communication with Destination Host is Administratively Prohibited
- 11: Destination Network Unreachable for Type of Service
- 12: Destination Host Unreachable for Type of Service

MTU探索で分割処理が必要なときに到達不能なときは，4番のコードが送られる．

### タイプ5: リダイレクトメッセージ

ICMP Redirect Message

送信するときに，途中のルーターが送信元のホストよりより良い経路情報 (ホップ数が少ない) を持っているときに，送信元に経路を伝えるために用います．
(トラブルのもとなので，動作しないように設定されている場合もある)

### タイプ11: 時間超過メッセージ

ICMP Time Exceeded Message

IPパケットのTTL (Time To Live) というフィールドがあり，ルーターを一つ通過するたびに一つ減っていきます．（ホップごと）
0 になると，ICMP Time Exceeded Message の コード0 が送られる (コード1 は分割したパケットの再構築処理のタイムアウト)

TTL自体は，経路制御に問題があって経路がループしたときなどに永遠にネットワークにパケットが流れないようにするために必要です．

ちなみに traceroute コマンドは，IPパケットのTTLを 1 から 1つずつ増やして，Time Exceeded Messageによって IP アドレスを取得しているらしい.

### タイプ 0, 8: エコーメッセージ

ICMP Echo Request Message, ICMP Echo Reply Message

ping などに用いられるタイプです．

相手先ホストに，ICMP Echo Request Message (タイプ 8) を送信して，相手先から ICMP Echo Reply Message (タイプ 0) を返します．


### タイプ4: 始点抑制メッセージ

ICMP Source Quench Message

ふくそうを緩和する目的で用いられます．

低速の回線などに送出している側のルーターのキューの残りがゼロになり，送出不能になったときに ICMP Source Quench Message を IPパケットの送信元に送ります．
これを受け取った送信元のホストが受け取ると，IPパケットの送信間隔をあけて輻輳を緩和させようとします．

(これは不公平な通信を引き起こす恐れがあるため，ほとんど利用されない)

### タイプ 9, 10: ルーター探索メッセージ

- ICMP Router Soliciation (type 10)
- ICMP Router Advertisement (type 9)

自分が繋がっているネットワークのルーターを見つけたいときに利用します.
送信された ICMP Router Solication を ルーターが受け取ると，ルータが ICMP Advertisement (type 9) を返します．

### タイプ 17, 18: アドレスマスクメッセージ

- ICMP Address Mask Request (type 17)
- ICMP Address Mask Reply (type 18)

サブネットマスクを調べたいホストやルーターがある場合に利用されます．
調べたいホストやルーターに向けて ICMP Address Mask Request を送り, ICMP Address Mask Reply でサブネットマスクの値を知ることができます．

## DHCP

DHCP (Dynamic Host Configuration Protocol)は，自動でIPアドレスを割り当てるためのプロトコルです．

IPアドレスを管理者が設定するのは大変なので，ネットワークに接続しただけで，TCP / IP による通信ができるようになる `プラグ & プレイ` を可能にするための技術です．

DHCPの仕組みは，

- まず，DHCPサーバーをネットワーク内に立ち上げる (ルーターがDHCPサーバーになることもある)
- その後，DHCPサーバーに，割り当てる IPアドレス / サブネットマスク / デフォルトルートを設定する．
- ネットワークに接続したクライアントが，`DHCP発見パケット` をDHCPサーバーに送る (IPアドレスは，255.255.255.255 のブロードキャスト)
- DHCPサーバーがクライアントに，使用して良いネットワークの設定を `DHCP提供パケット` で通知する．
- クライアントは，上で通知されたネットワークの設定を使用した旨を，`DHCP要求パケット` を，DHCPサーバーに通知する．
- DHCPサーバーは許可することを `DHCP確認応答パケット` で通知する．

DHCP発見 / 提供パケット，DHCP要求 / 確認応答パケット の 2 段階でやり取りするのは複数DHCPサーバーが設定されていても正常に動くようにするためです．

DHCPサーバーは一つだと，その一つで障害が起こると通信ができなくなってしまうので複数DHCPサーバーを置くことが推奨されますが，そのときにIPアドレスが重複されないように以下の確認を行います．

#### DHCPサーバー
IPアドレスを配布する前に，ICMPエコー要求パケットを送信し，返事がこないことを確認する．

#### DHCPクライアント
DHCPサーバーから配布されたIPアドレスに対して，ARP 要求パケットを送信し，応答が来ないことを確認する．

## NAT

NAT (Network Address Translator) は，ネットワークの内側のホストにグローバルIPアドレスを割り当てなくても，インターネットと通信できるようにするための技術です．
これは IPv4 アドレスの枯渇問題の解消になります．

NAPT (Network Address Port Translator) は，ポートも用いて変換が行われます．

TCPやUDPの通信の識別には，`宛先IPアドレス`, `送信元IPアドレス`, `宛先ポート番号`, `送信元ポート番号`, `プロトコル番号` の5つで識別するが，
IPアドレスの変換だけだと，複数の NAT 内のホストが同じ宛先に送信するときに同一の通信とみなされてしまう恐れがあります．

なので送信元ポートを個別にわりあてることで回避します．


##### 変換テーブル
```
送信元A: 10.0.0.10:1025 => 202.244.174.37:1025
宛先: 163.221.120.9:80 => 163.221.120.9:80

送信元B: 10.0.0.11:1025 => 202.244.174.37:1026
宛先: 163.221.120.9:80 => 163.221.120.9:80
```

上記の変換テーブルでは，送信元Aと送信元AとBを区別するためにポートを用いてます.
変換テーブルは，TCPの SYN パケットのが流れたときにテーブルが作られ，FINパケットが流れて，その確認応答がされたあとでテーブルから削除されます．


### NAT-PT

NAT-PT (NAT Protocol Translation) を用いると IPv4 と IPv6 のIPアドレス（とポート）の変換が行えます．
DNSと連携して，IPヘッダを付け替える DNS-ALG 方式が期待されている．

## まとめ

今回は，IPを用いた通信をささえる周辺の技術についてまとめました．この通信の裏側にはいろいろなしくみがあってそれに支えられているんだと思うと，とても興味深かったです．
ネットワーク周りはあまり意識しないですが，学んでいくと面白いなと感じました．
