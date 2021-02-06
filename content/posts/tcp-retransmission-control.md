+++
title="TCP の再送制御のRFCについて"
date="2021-02-05T23:44:07+09:00"
categories = ["engineering"]
tags = ["TCP", "TCP/IP", "再送制御"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

ラムダノートの Vol.1, No.1 をみて TCP の再送制御を見てとてもおもしろかったので，将来の自分用にRFCのリンクをまとめておきます．

{{< exlink href="https://www.lambdanote.com/products/nmonthly-vol-1-no-1-2019" text="n月刊ラムダノート Vol.1, No.1(2019)" >}}

## TCP の再送制御の課題

トランスポート層のTCPのミッションは，通信相手にパケットを届けることだが，インターネットの経路にてパケットが失われてしまうことが多々あり，そのパケットの喪失を検出する必要があります．
パケットの無事に届いたことを確認するためには，パケットの受信者からの確認応答を受け取ることで実現できるので，一定時間経っても確認応答が帰ってこないパケットを喪失したとみなすことができ，再送することができます．

この「一定時間」を `再送タイムアウト時間` といい, いかに効率の良い再送タイムアウト時間を設定するかというのが，TCPの再送制御の課題なのかなと思います．

再送タイムアウト時間が短ければ，パケットの喪失を見逃す機会は減りますが，不要な再送が増えネットワーク上に無駄なパケットが大量に流れてしまうことになります．逆に再送タイムアウトがながければパケットの喪失を検知出来ない可能性があります．

書籍の中で，RFCがいくつか紹介されていたので，ざっと目を通しつつまとめておきます．

## RFC

#### RFC 7323 - TCP Extensions for High Performance
- {{< exlink href="https://tools.ietf.org/html/rfc7323" text="RFC 7323" >}}
- {{< exlink href="https://tex2e.github.io/rfc-translater/html/rfc7323.html" text="RFC 7323 (日本語訳版)">}}

`3. TCP TImestamps Option` の内容が書籍内でも記載されていました．

TCP ヘッダの拡張オプションのタイムスタンプオプションを利用して，RTT (ラウンドトリップタイム) つまりパケットを送信してから確認応答が帰ってくるまでの時間を計測する内容についてです．

#### RFC 6298 - Computing TCP's Retransmission Timer
- {{< exlink href="https://tools.ietf.org/html/rfc6298" text="RFC 6298" >}}
- {{< exlink href="https://tex2e.github.io/rfc-translater/html/rfc6298.html" text="RFC 6298 (日本語訳版)">}}

計測した，RTT値から再送タイムアウト値を計算する方法について書かれています．

#### RFC 2001 - TCP Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery Algorithms
- {{< exlink href="https://tools.ietf.org/html/rfc2001" text="RFC 2001" >}}
- {{< exlink href="http://pentan.info/doc/rfc/j2001.html" text="RFC 2001 (日本語訳版)" >}}

`3. Fast Retransmit` の内容が書籍で引用されていました．

> 送信者側のTCPは、duplicate ACKがセグメントの消失で発生したのか、また
は、ちょうど受信者側でセグメントの並べ替えをしている途中で発生した
のかわからないので、少ないいくつかの duplicate ACKを受け取るまで待つ。
もしちょうど並べ替え途中のセグメントがあるなら、`並べ替えられたセグメ
ントが処理される前にはせいぜい１つか２つ`の、duplicate ACKしか存在しない
だろう、そしてそれから(並べ替えられたセグメントに対し)新たなACKが
生成されるだろうと思われる。`もし、３つ以上のduplicate ACK が続けて返っ
てきたら、それは、セグメントが失われたことを強く示している。`TCPは
そのとき、再送タイマーが切れるのを待たずに失われたと思われるセグメ
ントの再送を実行する。

3パケット以上順番が変わるのであれば，それはパケットが失われたとみなしている旨が書かれています．

#### RFC 4653 - Improving the Robustness of TCP to Non-Congestion Events

- {{< exlink href="https://tools.ietf.org/html/rfc4653" text="RFC 4653" >}}
- {{< exlink href="https://tex2e.github.io/rfc-translater/html/rfc4653.html" text="RFC 4653 (日本語訳版)">}}

書籍では簡単に紹介されていただけですが，TCP NCR という動的に重複確認応答の数を変更できるアルゴリズムが提案されているそうです．

#### RFC 2883 - An Extension to the Selective Acknowledgement (SACK) Option for TCP
- {{< exlink href="https://tools.ietf.org/html/rfc2883" text="RFC 2883" >}}
- {{< exlink href="https://tex2e.github.io/rfc-translater/html/rfc2883.html" text="RFC 2883 (日本語訳版)">}}

SACK という選択確認応答オプションを利用して，パケットの重複受信を送信側に伝える方法について記載されています．

#### RFC 3522 - The Eifel Detection Algorithm for TCP
- {{< exlink href="https://tools.ietf.org/html/rfc3522" text="RFC 3522" >}}
- {{< exlink href="https://tex2e.github.io/rfc-translater/html/rfc3522.html" text="RFC 3522 (日本語訳版)">}}

タイムスタンプオプションを用いた重複受信の検出手法である，Eifel Detection アルゴリズムについて書かれています．

#### RFC 5682 - Forward RTO-Recovery (F-RTO): An Algorithm for Detecting Spurious Retransmission Timeouts with TCP
- {{< exlink href="https://tools.ietf.org/html/rfc5682" text="RFC 5682" >}}
- {{< exlink href="https://tex2e.github.io/rfc-translater/html/rfc5682.html" text="RFC 5682 (日本語訳版)">}}

F-RTO アルゴリズムという，SACKオプションやタイムスタンプに依存せずに，再送の誤りを検出する手法が書かれています．

## まとめ

今回は，TCPの再送制御について主に，RFCのページをまとめました．
全部は読みきれてないで，どこかのタイミングで読んでみようと思いました．

主には書籍を読んだだけですが，再送制御だけでもかなり奥深そうで色々と歴史を感じ楽しかったので引き続き調べてみたいと思います．
