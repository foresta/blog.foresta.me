+++
title="『プログラマー脳』を読んだ"
date="2024-04-28T23:18:55+09:00"
categories = ["engineering"]
tags = ["read", "book"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、{{< exlink href="https://www.shuwasystem.co.jp/book/9784798068534.html" text="『プログラマー脳』" >}} を読んだので感想を書きます。

## 書籍について

書籍名は、{{< exlink href="https://www.shuwasystem.co.jp/book/9784798068534.html" text="『プログラマー脳 ～優れたプログラマーになるための認知科学に基づくアプローチ』" >}} で秀和システムから出版されています。

以下のような内容となっています。

```
Part 1 コードをよりよく読むために

　Chapter 1 コーディング中の混乱を紐解く
　　1.1 コードにおけるさまざまな種類の混乱
　　1.2 コーディングに影響を与えるさまざまな認知プロセス
　　1.3 それぞれの認知プロセスが協調的に動作する仕組み
　　本章のまとめ

　Chapter 2 コードを速読する

　　2.1 コードの速読法
　　2.2 記憶のサイズ制限を克服する
　　2.3 読めるコードよりも見えるコードのほうが多い
　　本章のまとめ

　Chapter 3 プログラミング言語の文法を素早く習得する方法
　　3.1 文法を覚えるためのテクニック
　　3.2 フラッシュカードを使って文法を素早く覚える
　　3.3 物忘れを防ぐには
　　3.4 文法を長く記憶に留めるには
　　本章のまとめ

　Chapter 4 複雑なコードの読み方
　　4.1 複雑なコードを理解するのが難しい理由
　　4.2 認知的負荷を軽減するテクニック
　　4.3 ワーキングメモリに負荷がかかっているときに使える記憶補助ツール
　　本章のまとめ

Part 2 コードについて考える

　Chapter 5 コードの深い理解に到達する
　　5.1 「変数の役割」フレームワーク
　　5.2 役割とパラダイム
　　5.3 プログラムに関する知識を深める
　　5.4 文章を読むこととコードを読むことは似ている
　　5.5 コードを読む際にも適用可能な文書理解の戦略
　　本章のまとめ

　Chapter 6 プログラミングに関する問題をよりうまく解決するには
　　6.1 コードについて考えるためにモデルを利用する
　　6.2 メンタルモデル
　　6.3 想定マシン
　　6.4 想定マシンと言葉
　　6.5 想定マシンとスキーマ
　　本章のまとめ

　Chapter 7 誤認識：思考に潜むバグ

　　7.1 2つ目のプログラミング言語を学ぶのは、最初の言語を学ぶよりも、なぜ簡単なのか
　　7.2 誤認識：思考の中のバグ
　　本章のまとめ

Part 3 よりよいコードを書くために

　Chapter 8 よりよい命名を行う方法
　　8.1 なぜ名前が重要なのか
　　8.2 命名の認知科学的側面
　　8.3 どんな名前が理解しやすいのか
　　8.4 名前がバグに与える影響
　　8.5 よりよい名前を選ぶには
　　本章のまとめ

　Chapter 9 汚いコードとそれによる認知的負荷を避けるための2つのフレームワーク
　　9.1 臭いのあるコードは、なぜ認知的負荷が大きいのか
　　9.2 悪い名前が認知的負荷に与える影響
　　本章のまとめ

　Chapter 10 複雑な問題をより上手に解決するために
　　10.1 問題解決とは何か
　　10.2 プログラミングの問題を解決する際に長期記憶はどのような役割を果たすのか
　　10.3 自動化:潜在記憶の形成
　　10.4 コードとその説明から学ぶ
　　本章のまとめ

Part 4 コーディングにおける共同作業

　Chapter 11 コードを書くという行為
　　11.1 プログラミング中のさまざまな活動
　　11.2 中断されるプログラマー
　　本章のまとめ

　Chapter 12 より大きなシステムの設計と改善
　　12.1 コードベースの特性を調べる
　　12.2 特性と活動
　　本章のまとめ


　Chapter 13 新しい開発者のオンボーディング
　　13.1 オンボーディングプロセスにおける問題点
　　13.2 熟達者と初心者の違い
　　13.3 オンボーディングプロセスを改善するための活動
　　本章のまとめ

　　　本書を締めくくるにあたって
```

## 感想など

この本を読もうと思ったきっかけは、プログラミング時の脳と認知について、というありそうでなかった切り口で語られていそうなのがとても面白そうだったことです。

実際の内容としては、プログラムを読み書きする際に人間の脳はどうなっているのかという視点でプログラミングについて語られていました。特に珍しいなと思ったのはソースコードの読む方法について多く語られていた点です。
エンジニアとして働くうえで、過ごす時間の半分以上がソースコードリーディングの時間のように思いますが、コードの読み方について語られている本はこれまであまりなかったように感じます。
コードの読む時にどのような脳の働きになっているかという点から語られていたのがとてもよかったです。

個人的に印象深かったのが、プログラミングの構文などを覚えるためにフラッシュカードが効果的という話です。
いままで、特にプログラミングの構文を覚えようと思ったことはなく、ググればすぐでてくるから特に問題ないと思っていました。しかし、この本によるとググっている時間はコンテキストスイッチが発生しているため集中を阻害しているといいます。
これはかなり確かにと思いました。プログラミングしている中でノっているときは手が勝手に動くような感覚があるのですが、ググったりしまくっていると確かになかなか波にのることはできないし、確かに集中が阻害される要因だなと思いハッとしました。

他にもコードを書く上で重要な命名について脳と認知の側面から語られていたり、プログラミング初心者と熟練者の脳の働きの違いについて書かれていたりしたのがとても印象的でした。
プログラミングしているときの活動について分類したうえで、その認知的特性とどのように関係性があるのかという点が論じられていたり、オンボーディングをどのように実施したらよいのかという点に対してヒントが書かれていました。
かなり実践的で役立ちそうな内容だったため、オンボーディング時に取り入れてみたいと思いました。

## おわりに

今回は、書籍を読んだ感想を書きました。

脳の動きに注目してプログラミングと向き合うという中身でしたが、色々新鮮な気づきがありました。
プログラミングしはじめの方にとってソースコードの読み方など有用な部分が多いですし、熟練の方にとっても改めて視点を変えてプログラミングという行為を捉え直すことができるため面白い本だと思います。

とくにオンボーディングの話など実践できるように読み返したいなと思いました。
