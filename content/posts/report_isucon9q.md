+++
date = "2019-09-08"
title = "isucon9は 最終スコア 8,860 で予選敗退でした"
thumbnail = ""
tags = ["isucon"]
categories = ["engineering"]
+++

ISUCON9 に `さばかんちゃーはんかれー` として参加してきて、予選敗退してきたので記憶が薄れないうちにブログにまとめてみます。

## 日程など

二日目の 9 / 8 に予選を行いました。一緒に参加したメンバーは、{{< exlink href="https://twitter.com/matsukaz" text="@matsukaz" >}}, {{< exlink href="https://twitter.com/peto_tn" text="@peto_tn" >}}です。

去年受けた時は結構何回か集まって予習を入念に行いましたが、今回は事前に集まる機会がなく当日集合して色々作戦を練ったりしながら進めました。

## やったことなど

### 9:30 ~

現地について、コンビニでリポD とレッドブルーとご飯を購入してお借りしたオフィスに向かいます。到着したらウィダーを飲みつつレギュレーションに再度目を通したり、開始後の初動をどうするかなどを話したりしました。

### 10:00 ~

こちらのissueのやり方がすごく良さそうだなーと思ったので、アプリを触って全体像を把握したりしました。

https://github.com/catatsuy/isucon7-qualifier/issues/1 

具体的にやったこととしては以下のような感じです。

* アプリを触ってサービスの理解
* API, ページのパスを一覧で書き出す
* DBのスキーマ一覧をissue仁書く
* ソースコードリーディング

みていく中で気になった点としては、以下のような感じです。

* カテゴリデータがマスタデータである（キャッシュできそう）
* 商品のDescriptionがやたら長い
* QRCodeのpng のバイナリがDBに保存されている
* 重そうなクエリ
* `/users/transactions.json` の N+1
* 静的ファイルを `http.FileServer` で配信してる ( nginx で配信すれば良さそう )

他の二人には、インフラ周りのprofileの準備や、デプロイスクリプトなどの整備をおこなってもらいました。


### 11:00 ~

items の description が データが大きい割には使っているところが少ないのでできるだけ取得しないようにする作業をひたすら行いました。
細かくですが、ちょっとずつスコアが上がっていったように思います。
`SELECT * FROM items` として取得している箇所をひたすら撲滅していきました。

### 14:00 ~

`/users/transactions.json` の N+1 クエリを撲滅する作業を行いました。SQL力が足りずにここで結構時間を食ってしまったように思います。
このN+1 でもスコアが少しずつ上がっていきました。\
N+1対策の JOIN しまくりのクエリは、インデックスが全然聞いてなかったので、Indexも貼ったりもしました。


### 16:00 ~

`transaction_evidence` テーブルにも description が書かれていたのでこちらもできるだけ取得しないように修正していきました。
細かい改善でしたが、少しずつ着実にスコアが伸びていったと思います。

{{< exlink href="https://twitter.com/matsukaz" text="@matsukaz" >}} 氏の カテゴリデータをキャッシュする実装を終えたこのあたりで、スコアが 8000 近くまでいってました。\
この時は希望に満ち溢れていました。

ここまで、サーバー1台構成で作業していましたが終了間際に、DBを他のサーバーに載せ替えようと決断し、他のお二方にそのインフラ・ミドルウェア周りの作業をお任せしました。
結論からいうと DBサーバーの分割は、いろんなトラブルがあり終了時間もかなりギリギリになってきたため諦める決断をしました。

このインフラ周りの作業を行ってもらっている間、自分はパスワードハッシュを処理を変えたりしていました。
パスワードハッシュ周りはISUCONで毎回ボトルネックになってるから今回もそうなのだろうなーという割と安易な予想で、Bcrypt のコストを最低の4 に変えたりしました。
ここでもスコアがちょっと伸びた気がします。

--- 

最終的なスコアとして、 `8800` 点前後でした。

本線通過チームの最低ラインが 10000 点ごえだったので、あと一歩のところだったのかなーと思います。惜しかった！

## 振り返り

簡単に今回のISUCONを振り返ってみます。

### よかったこと

- {{< exlink href="https://twitter.com/peto_tn" text="@peto_tn" >}} 氏が用意してくれたデプロイスクリプトが非常に使いやすくてデプロイがとても楽だった
- 最初にアプリケーションの全体把握や、レギュレーション読みなどをしっかり行ったおかげでそのあとの作業がスムーズだった

### 反省点
- `/users/transactions.json` のDB接続は結構早くなったものの、外部API呼び出しのところを最適化できなかった
- 3台のサーバーの使い方をもうちょっと早いタイミングで意思決定をするべきだった
- DBサーバーが共存してたせいなのか、CPU負荷が結構あって campaign を設定できなかった

## さいごに

スコアが結構上がってただけに非常に悔しい結果となりましたが、去年同様とても楽しめました。
一緒に戦ってくださったお二方 ( {{< exlink href="https://twitter.com/matsukaz" text="@matsukaz" >}}, {{< exlink href="https://twitter.com/peto_tn" text="@peto_tn" >}}) 、そして運営の皆様方ありがとうございました！そしてお疲れ様でしたー。

来年またリベンジします!
