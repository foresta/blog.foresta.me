+++
title="2020年の開発振り返り"
date="2020-12-02T18:33:50+09:00"
categories = ["engineering"]
tags = ["ブログ", "blog", "other"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

2020年も気がつけばのこりあとわずか．ということで今年触った技術とかやったことについて振り返ってみます．

記憶と Tweet をたよりに思い出せる限り書いていこうと思います．

## 1月 ~ 3月

大まかに，アセンブリとかRust に入門したりしてました．
業務では，Kotlin とか gradle 周りがメインだったようです．

### アセンブリに触れてみる

この月は，「プログラムはなぜ動くのか？」という本を読んでいました．

[プログラムはなぜ動くのか？を読んだ](/posts/book_why_the_program_workds/)

そこから派生して，アセンブリ言語についていろいろと調べてました．

その結果として，簡単な C言語のプログラムからアセンブリされたコードを眺めるということをしてました．

[アセンブリコードを眺めてみる](/posts/view_assembly_code/)

### HHKB Hibrid Type-S

原価バーいって触ってきたりしてました．結局買ってません．
{{< tweet 1216731297692864513 >}}


### Rust 入門

{{< tweet 1222498444972965888 >}}

所有権とか，ライフタイムとかと戦っていました．

- [Rustの所有権について](/posts/rust_ownership/)
- [Rustのライフタイムについて](/posts/rust_lifetime/)

あとは，actix-web とかフレームワークをさわったりしてました．

[Rustのactix-web を触ってみる](/posts/actix-web-sample/)

### 業務

業務では，新規プロジェクトが始まって，Kotlin の開発環境とか，gradle とかと戦っていました．
新しいプロジェクトが，Front が，React + TypeScript で，サーバーサイドが Kotlin という構成だったのでそのあたりのキャッチアップが多かったです．

{{< tweet 1235178526812164097 >}}

- [Kotlin のマルチプロジェクトの設定について](/posts/kotlin-multi-project/)
- [Kotlin の Gradle プロジェクトをコンテナ化する](/posts/gradle_in_docker/)


## 4月 ~ 6月

4月に Thinkpad を購入してそのセットアップを行っていたりしました．また業務で新しいことにチャレンジできる機会だったので，いろいろなことをキャッチアップしていたと思います．

AWS や，React + TypeScript などです．

### Thinkpad 購入

Thinkpad P43s を購入したので，ubuntu のセットアップとかを多くしてました．

- [Ubuntu のセットアップメモ](/posts/setup_ubuntu_log/)

Rust のゲームエンジンである amethyst を ubuntu で動かそうとして色々苦労してました．

{{< tweet 1249734057207816192 >}}
{{< tweet 1249737432867594241 >}}


ガジェット系だと，仕事用の Macbook Pro と，Thinkpad の両方を給電できるモバイルバッテリーを購入して，外とかで電源を気にせず作業できるようになって最高でした．

[Macbook pro, Thinkpad P43s の給電用にモバイルバッテリーを購入した](/posts/supply_power_from_mobile_battery/)

### 業務

新規プロジェクトの，ドメインモデリングとか設計周りとかやってました．あとは，AWS のネットワーク周りがよくわからず本読んだり，ソフトウェアテストの本を読んでみたりしてました．

#### AWS 

{{< tweet 1254067670833442822 >}}

#### ソフトウェアテスト

{{< tweet 1274628221133156353 >}}

## 7月 ~ 9月

振り返ってみたらすごく色々やっていた期間でした．

### iOS アプリ開発

お手伝いで，作っていた iOS アプリの開発が結構忙しかった記憶があります．

特に，新たなチャレンジとして Firebase + Signin with Apple みたいな実装をしたのが面白かったです．

[Firebase で Sign In With Apple を実装する](/posts/signin_with_apple_in_firebase/)



### 開発雑記

書こうとして，結局続かなかったですが毎日 note を書くということをしてました．
再開したいけど，結構重かったからやるとしても多分気が向いたら書くくらいだと思います．

{{< exlink href="https://note.com/kz_morita/m/m5e6694304d6d" text="ソフトウェアエンジニア開発雑記">}}


### ISUCON

毎年恒例 ISUCON に参加しました．去年と同じとても頼もしいメンバーと挑んだのですが，あえなく予選落ちでした．

悔しかったですが，毎年とても楽しみにしてるイベントなので，来年もあったら参加しようと思ってます．


{{< tweet 1280776382771892224 >}}

{{< tweet 1304790731429564416 >}}

### 読んだ本

振り返ると結構重めな本読んでて，頑張ったなぁとしみじみ思いました．

#### 詳解システムパフォーマンス

- [詳解システム・パフォーマンスを読み終えたので感想とか](/posts/book_system_performance/)

#### マスタリング TCP / IP

- [マスタリングTCP/IP 入門編 第1 ~ 4章](/posts/mastering_tcp_ip_1_4/)
- [マスタリングTCP/IP 入門編 第5章](/posts/mastering_tcp_ip_5/)
- [マスタリングTCP/IP 入門編 第6章](/posts/mastering_tcp_ip_6/)
- [マスタリングTCP/IP 入門編 第7 ~ 9章](/posts/mastering_tcp_ip_7_9/)



### 業務

認証周り をすごく頑張ってました．サブドメイン間でうまく協調して認証システムを動かすみたいなことをやってました．Express と Passport をつかって，ソーシャルログインを実装したり，サブドメイン間の Cookie の設計をしたり．

やることがおおくて結構ハードな期間でした．

関連するブログはこのあたり．

- [Passport を使ってソーシャルログイン機能を実装する](/posts/social_auth_with_passport/)
- [CORS Policy 違反と，Preflight request (OPTIONS) について](/posts/http_preflight_request/)

## 10月 ~ 12月

この期間には，開発していたサービスがローンチがありました．あとは以前から興味があった情報検索について学び直してます．

### 情報検索

こちらの本を読んでます．

<a href="https://www.amazon.co.jp/%E6%83%85%E5%A0%B1%E6%A4%9C%E7%B4%A2%E3%81%AE%E5%9F%BA%E7%A4%8E-Christopher-D-Manning/dp/4320123220/ref=as_li_ss_il?ie=UTF8&linkCode=li2&tag=foresta04-22&linkId=854fde2a64fce695bb04070cd1fe6241&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=4320123220&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=4320123220" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/3qjV4qZ" text="情報検索の基礎">}}


読んだ進捗はこちら．

- [情報検索の概要について](/posts/information_retrieval_about/)
- [情報検索と転置インデックス](/posts/information_retrieval_index/)
- [検索システムと辞書・用語](/posts/information_retrieval_terms/)


こっちの本も，買ってあるので読んでいこうと思います．（かなりヘビーそうだけど，とても興味ある分野なので頑張りたい）


<a href="https://www.amazon.co.jp/%E6%83%85%E5%A0%B1%E6%A4%9C%E7%B4%A2-%E6%A4%9C%E7%B4%A2%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%B3%E3%81%AE%E5%AE%9F%E8%A3%85%E3%81%A8%E8%A9%95%E4%BE%A1-%E6%A2%85%E6%BE%A4-%E5%85%8B%E4%B9%8B/dp/4627817614/ref=as_li_ss_il?_encoding=UTF8&pd_rd_i=4627817614&pd_rd_r=f08b3612-0124-4381-b9f8-ca820d8bab6f&pd_rd_w=r9U85&pd_rd_wg=eOBjZ&pf_rd_p=4b55d259-ebf0-4306-905a-7762d1b93740&pf_rd_r=Z1D2HS5JQZ2RCNDPB7MA&psc=1&refRID=Z1D2HS5JQZ2RCNDPB7MA&linkCode=li2&tag=foresta04-22&linkId=645b7e76ea00e52b1cf3cee4a9f6afa4&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=4627817614&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=4627817614" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/3my655P" text="情報検索 :検索エンジンの実装と評価" >}}
    
### 業務

新規サービスのリリースなどがありかなりバタバタした期間です．無事ローンチできて，現在は改善を重ねている最中なのでひと安心しています．

リリース後の改善として，E2E テストを導入したりしてます．Cypress かなり良さそうな感触です．

blog としては，セキュリティ周りの話とか，react-facebook-login の話とかもありました．

- [Cypress の E2E Test を導入した話](/posts/cypress-e2e-test/)
- [セキュリティ関連の HTTP Header まとめ](/posts/http-header-for-security/)
- [react-facebook-login の モバイルWeb 対応について](/posts/react-facebook-login-mobile/)


## まとめ

振り返ってみると，一年を通してかなりいろんな技術に触れられたかなぁと思います．

新規開発に携わることが出来たので，サービス開発に必要なことは一通り軽くでも触れたかなぁと思います．良い経験が出来ました．

プライベートでも結構本とか読めたんじゃないかなぁと思います．

一方で，いろいろな技術が中途半端だった感が否めません．例えば Rust 入門してましたがまだ入門の域を出ていないのが正直な感想です．

来年も，引き続きいろいろなことに触りたいですが，何か一つもっと深堀りするような取り組みをしていきたいと思います．




