+++
title="『入門 監視』を読んだ"
date="2023-05-07T12:29:51+09:00"
categories = ["engineering"]
tags = ["read", "monitoring"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，O'Reilly から発売されている{{< exlink href="https://www.oreilly.co.jp/books/9784873118642/" text="『入門 監視』">}}という本を読んだのでそのまとめです．

{{< exlink href="https://www.oreilly.co.jp/books/9784873118642/" >}}

目次としては以下のようなものになります．

```
はじめに

第Ⅰ部 監視の原則
1章 監視のアンチパターン
2章　監視のデザインパターン
3章　アラート、オンコール、インシデント管理
4章　統計入門

第Ⅱ部　監視戦略
5章　ビジネスを監視する
6章　フロントエンド監視
7章　アプリケーション監視
8章　サーバ監視
9章　ネットワーク監視
10章　セキュリティ監視
11章　監視アセスメントの実行

付録A　手順書の例：Demo.App
付録B　可用性表
付録C　実践.監視SaaS

訳者あとがき
索引
```

## 読んだモチベーション

日頃から，システムを運用しているため，システムやアプリケーションの監視も行っています．

監視をするなかで，以下のような課題感があります．

-   アラートの量が多く対応すべきものが見えにくい
-   出たアラートは自動でチケット化しているが，対応可否を判断するための作業に一定時間がかかる
-   システムの一時的な不調により出るエラーだが対応が不要なものが多い

アラートの数が多いとそれだけで，システムの重要な兆候を見逃す可能性もありできるだけ減らしたい．

一方で，数が少ないとはいえエラーがでているため誰も気づけない状態は避けたいため，アラートを減らせていないという状況にあります．

これらの課題をうまく取り扱い，システムをより監視しやすくしたいというモチベーションで本を読みました．

## 読んだ感想

読んだ感想としては，監視というものについて体系的にどう考えるべきかという話からすぐに取り組めそうなプラクティスまであったのが個人的にはとても良かったです．

たとえば，アラートを

-   いますぐに対応すべきアラート
-   参考情報としてのアラート

の２つに分けるという話があったのですが，これは自分の課題であったアラートが多すぎるというものの解決策として取り入れたいと思いました．

普段 Alert を Slack に通知しているのですが，参考情報としてのアラートについては Slack に通知せずに Ticket 化するだけというのがよさそうかなと思います．

Slack に流すのは本当に緊急度の高いものだけにし，Slack にながれたら基本対応するといった流れにしてみようかなと思いました．

あとは，monitor の作り方でも参考になったものいくつかありました．

たとえば運用している API の Latency の監視について，一瞬だけ Spike するものの問題ないケースなどでアラートがなってしまっています．参考情報としての Alert としてはそれでもよさそうですが，対応が必要なものかどうかといわれるとそうではない気がします．

移動平均などで，latency のグラフを平滑化することで本当に latency が悪化した際にのみ緊急性の高い Alert とするなどの対応はよさそうだと思いました．

## まとめ

今回は，{{< exlink href="https://www.oreilly.co.jp/books/9784873118642/" text="『入門 監視』">}}という本を読んだ感想をまとめました．
割とすぐに使えそうなプラクティスも多数あったので，システムの監視に課題を感じている人は読むとなんらかの知見を得られるんじゃないかと思いました．