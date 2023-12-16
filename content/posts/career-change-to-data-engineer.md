+++
title="データエンジニアに入門して読んだ本とこれから読みたい本"
date="2023-12-16T23:10:51+09:00"
categories = ["engineering"]
tags = ["books", "book", "data-engineering"]
thumbnail = ""
+++


この記事は、{{< exlink href="https://qiita.com/advent-calendar/2023/alumni" text="検索エンジンプロダクトを一緒に開発してた同窓会 Advent Calendar 2023" >}} の 17日目の記事です。

---

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今年の 10 月に転職をし、Data Engineer という職で働き始めました。
いままでの転職でも別ジャンルのエンジニアリングをやることになるケースが多かったのですが、今回もマイナーチェンジという感じです。

もうすぐ 3ヶ月たちそうということで、どんな本を読んだかやどんな本に興味あるかなどをまとめてみようと思います。

こんなおすすめの本もあるよなどあったらぜひ教えてください。

## なる前に読んだ本

有給期間とかに遊びほうけながら読んだ本です。

(もうちょい頑張って読めばよかった)

###  {{< exlink href="https://www.oreilly.co.jp/books/9784873118703/" text="データ指向アプリケーションデザイン" >}}

<a href="https://www.amazon.co.jp/dp/4873118700?&linkCode=li2&tag=foresta04-22&linkId=884bba74894310b7a0c05532ca0cea6f&language=ja_JP&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=4873118700&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=4873118700" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

データを中心に、アプリケーションとそれに関わるさまざまなトピックについて扱われている本です。

660 ページほどあり厚い本ですが、データとアプリケーションについてかなり広いトピックを知ることができるのでおすすめの本です。
実際に転職してからも、社内で話題に上がっていたり輪読会が開かれている気配などを感じていて読んでおいてよかったなーと思いました。

読んだ感想はこちら。

- [『データ指向アプリケーションデザイン』を読んだ](https://blog.foresta.me/posts/read-designing-data-intensive-applications/)

## なってから読んだ本

仕事しつつ読み切った本たちです。

### {{< exlink href="https://www.amazon.co.jp/dp/B087R6P8NZ" text="データマネジメントが 30 分でわかる本" >}}

<a href="https://www.amazon.co.jp/dp/B085W4YSZJ?&linkCode=li2&tag=foresta04-22&linkId=0a39722db3297ca653e674b10827833f&language=ja_JP&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B085W4YSZJ&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B085W4YSZJ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

こちらはデータマネジメントについてちゃんと理解しておきたいという時に最初の一冊として読みました。

後述する DMBOK という本を読む前の一歩として読みました。

内容としては、Data Management の全体雑をざっくりとつかむことができて非常に役立ちました。
とりあえずの第一歩目に読む本としてよかったなと思います。

読んだ感想はこちら。

- [『データマネジメントが30分でわかる本』を読んだ](https://blog.foresta.me/posts/read-data-management-in-30-minutes/)


### {{< exlink href="https://techbookfest.org/product/8rNStKqP8PX5L1fsE5dwt6?productVariantID=4AmWQntJXDs8JDmTYbkAJH" text="Snowflakeの歩き方 Snowflake で始めるデータ基盤ガイド" >}}

- {{< exlink href="https://techbookfest.org/product/8rNStKqP8PX5L1fsE5dwt6?productVariantID=4AmWQntJXDs8JDmTYbkAJH" text="技術書典サイト">}}

仕事で Snowflake を触ることになりそうだったので、転職前に買ったら実は同僚の方が書いていたという本。

実務で触りながら読みました。

Snowflake 完全に初心者の人が、Snowflake の外観をつかむのに非常に役立ちました。
また、Snowflake の周辺のツールなどにも触れられているのがよかったです。
データエンジニアリング周りにはたくさんのツールがあってそれぞれ役割がありますが、実現したい目的が若干オーバーラップしていたりして、最初ツール何がどの目的のものかよくわからん、みたいになってました。
こういったデータエンジニアリングの周辺で扱われているツール群が紹介されているのは非常によかったです。

### {{< exlink href="https://www.shoeisha.co.jp/book/detail/9784798179797" text=データ指向プログラミング" >}}

<a href="https://www.amazon.co.jp/dp/B0BWR57K64?&linkCode=li2&tag=foresta04-22&linkId=a8bee1bb97cdad8cb06a607cbe33b103&language=ja_JP&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0BWR57K64&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B0BWR57K64" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

こちらは社内で話題になっていて、楽しそうだったので読みました。

Data Oriented Programming について書かれている本で、データを中心に考えプログラミングするための原則などがまとめられている本です。


{{< exlink href="https://blog.klipse.tech/dop/2022/06/22/principles-of-dop.html" text="著者のブログ" >}} でも見ることができるので、こちらをみて面白そうだと感じる方は楽しめる本だと思います。

読んだ感想はこちら

- [『データ指向プログラミング』を読んだ](https://blog.foresta.me/posts/read-data-oriented-programming/)


## これから読む本

いわゆる積読です。読みかけの本もあります。
多いので頑張って読みたい本リストです。

読みかけのたくさん本あるのよくないなーと思いつつ、あまり深く考えないようにしてます。

### {{< exlink href="https://www.amazon.co.jp/dp/4296100491" text="データマネジメント知識体系ガイド 第二版" >}}

<a href="https://www.amazon.co.jp/dp/4296100491?&linkCode=li2&tag=foresta04-22&linkId=ec71a35d5197a86f5a56a6baba6ffcd7&language=ja_JP&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=4296100491&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=4296100491" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

いわゆる DMBOK というやつです。

少し読み進めていて、2 章までとデータ品質についての 13 章だけ読みました。

DAMAホイール図など、いろいろな勉強会やスライドで多く引用されていてまさにバイブルのようなものだと思います。

分量多いのでなかなか先は長いですが、ちまちま読み進めて行こうと思ってます。

### {{< exlink href="https://gihyo.jp/book/2021/978-4-297-12445-8" text="実践的データ基盤への処方箋" >}}

<a href="https://www.amazon.co.jp/dp/B09MSX9MQV?&linkCode=li2&tag=foresta04-22&linkId=b196ee24c0f8c196ea22bbc30fc27aff&language=ja_JP&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09MSX9MQV&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B09MSX9MQV" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

こちらも有名な本だと思います。

3 分の 1 くらい読み進めています。

今読んだところまでの感想になりますが、詳細の技術というよりはデータ基盤はどのようにあるべきかどのように基盤を組織で作っていくのかといった大方針について語られている本だと思います。
最後まで読み切って感想書きたいなと思います。

### {{< exlink href="https://pub.jmam.co.jp/book/b593881.html" text="チームトポロジー 価値あるソフトウェアをすばやく届ける適応型組織設計" >}}

<a href="https://www.amazon.co.jp/dp/B09MS8BML8?&linkCode=li2&tag=foresta04-22&linkId=39a74c735a87b39d84990292ad157783&language=ja_JP&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09MS8BML8&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B09MS8BML8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

こちらは、データ基盤について考えている上で気になって読みはじめました。

最近データ基盤にも Platform Engineering の考えを取り入れて Platform as a Product として構築するということについて考えることがあり、Platform Engineering の勉強会などに参加するなどしてキャッチアップしたりしていました。

↓参加レポート
- [Platform Engineering Meetup #6 に参加してきた](https://blog.foresta.me/posts/participate-platform-engineering-meetup-6/)


上記の勉強会などで紹介されていたのがこの本です。

Platform として組織の他のチームとどう関わっていくのか？という点をこの本を読んで何か得られればなと思ってます。

### {{< exlink href="https://www.oreilly.com/library/view/fundamentals-of-data/9781098133283/" text="Fundamentals of Data Observability" >}}

<a href="https://www.amazon.co.jp/dp/B0CFNZ3PHM?&linkCode=li2&tag=foresta04-22&linkId=d2a22534e40adb0ada7ffd2597e9deeb&language=ja_JP&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0CFNZ3PHM&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B0CFNZ3PHM" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

こちら洋書になるので、むちゃくちゃ読むスピードがゆっくりです。

Data Observability をデータ基盤に対してどう構築していくのかという点について、仕事で扱うことがあるので読もうと心に決めた本です。

翻訳ツール使いつつ少しずつ読み進めてます。
（洋書から逃げるなと自分に強く言い聞かせながら。。。）


内容については、Data Observability についての概要とそれをどのように実装するのか、データの問題をどのように検出するかといった話題について書かれていると思います。
頑張って読み進めます。

### {{< exlink href="https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/" text="Fundamentals of Data Engineering" >}}

<a href="https://www.amazon.co.jp/dp/B0B4VH4T37?&linkCode=li2&tag=foresta04-22&linkId=4b45a870753b3e7399fb1534f8d95f47&language=ja_JP&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0B4VH4T37&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B0B4VH4T37" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

こちらは、上記と同じシリーズの本かなと思います。

こちらの本の方が、 Data Engineering という幅広いトピックについて書かれているかと思います。こちらも頑張って読みたい。

## さいごに

今回は、データエンジニアリングに入門したときに読んだ本やこれから読みたいと思っている本を紹介してみました。

積読がたくさんあってよくないなーと思いつつ、まぁ気にせず読み続けるかーくらいの感じで最近はキャッチアップしています。
積読解消できるようにがんばります。

この記事が同じように、キャッチアップしようとしている方などの参考になれば嬉しいです。


皆さんのおすすめの本もありましたら、ぜひ {{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}} まで教えてください。
