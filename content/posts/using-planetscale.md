+++
title="serverless MySQL platform の PlanetScale を使ってみる"
date="2023-04-23T18:21:15+09:00"
categories = ["engineering"]
tags = ["mysql", "paas"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，個人開発をしようとしたときに，データベースのインフラ環境としてどれが良いか探していた中で見つけた {{< exlink href="https://planetscale.com/" text="PlanetScale" >}} という PaaS がよさそうだったので試してみたメモです．

## PlanetScale について

-   {{< exlink href="https://planetscale.com/" >}}

PlanetScale は，MySQL をホストしてくれる PaaS で，公式では `serverless MySQL platform` という風に謳われています．

料金プランは以下から確認できます．

-   {{< exlink href="https://planetscale.com/pricing" >}}

Hobby という無料プランがあり，これがちょっとした個人開発をする上でよさそうだなと思って今回は触ってみることにしました．

制限は以下のような感じ

```
5 GB storage
1 billion row reads/mo
10 million row writes/mo
1 production branch
1 development branch
Community support
```

storage や，read , write の制限に関してはちょっと使ってみるくらいだったら全然足りるかなと思います．

本格的に運用する場合には，plan の upgrade や移行先を考える必要がありそうです．

## 触ってみる

基本的な登録フローは簡単で画面に沿って進めます．

UI から，Database を作成することができます．
(Free のプランでは database は 1 つのみ作成できるようです)

{{< figure src="/images/posts/using-planetscale/new-databases.png" >}}

ダイアログに沿って Region や Database 名などの登録をすすめていくと，作成することができます．

作成したら Connect というボタンを押すと接続情報がでてくるのでそれを mysql-client などで実行すると接続することができます．

作成も簡単でよさげです．

## Branch 機能 と Safe migrations 機能について

他に気になる機能として Branch 機能というものがありました．

こちら，Free 版では production 1, development 1 の 2 ブランチを作成できるようです．

この branch はいわゆる git のブランチのようなものらしく production にすると可用性が高くなったり，ゼロダウンタイムのファイルオーバーが可能になったりするみたいです．

-   {{< exlink href="https://planetscale.com/docs/concepts/branching" text="Branching" >}}

また，Safe migrations という機能もあり，Production への意図しない Schema の変更を防ぐ機能があります．

-   {{< exlink href="https://planetscale.com/docs/concepts/safe-migrations" text="Safe migrations" >}}

ためしに，main という production にした DB に対して，DDL を適用してみました．
すると以下のように Error が帰ってきて，保護されていることが確認できます．

```
2023/04/23 19:05:07 Error 1105 (HY000): direct DDL is disabled
```

本番に反映するためには，`create deploy request` というボタンを UI から押すと，Github の Pull Request のようなものを作ることができ，レビューを通してから，deploy するといった運用フローを作成することができます．

これは複数人開発などをする際に，役に立ちそうですね．

## まとめ

今回は，MySQL の PaaS である，PlanetScale を触ってみました．
個人開発で試しにつくるなら結構お手軽で興味深い機能もついてたので候補としてよさそうだなと思います．
