+++
title="Miro で Planning Poker をする"
date="2022-10-30T22:12:43+09:00"
categories = ["engineering"]
tags = ["scrum", "plannig-poker", "miro"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

スクラム開発をしていて、Miro を使って Planning Poker をしたのが面白かったのでメモです。

## Planning Poker とは

Planning Poker は、チーム開発をしているときにストーリーポイントをチームで見積もるために行うアクティビティです。

ポーカーのように、ストーリーポイントが書かれたカードを裏向きで場に出し同時に表にしてその後妥当なポイントを話し合って決めるといった手法になるかと思います。
詳しい説明などは、下記のサイトなどを参考にしてみてください

- {{< exlink href="https://www.mof-mof.co.jp/blog/column/agile-estimation-planning-poker" >}}
- {{< exlink href="https://asana.com/ja/resources/planning-poker" >}}


## Miro で Planning Poker をする

オンラインで、チームのコラボレーションに用いられる Miro ですが、こちらにも Planning Poker の Plugin があり使えました。

Miro アカウントはすでにある前提で話を進めます。

{{< exlink href="https://miro.com/marketplace/planning-poker/" >}} にアクセスすると、Planning Poker の Plugin が見れます。

{{< figure src="/images/posts/planning-poker-in-miro/miro-marketplace.png" >}}

Connect ボタンを押して、Miro のアカウントと接続すると使用できるようになります。


{{< figure src="/images/posts/planning-poker-in-miro/miro-planning-poker-menu.png" >}}

Miroのメニューに Planning Poker が表示されるようになるので、それを押すと以下のような Poker の数字が表示されます。

{{< figure src="/images/posts/planning-poker-in-miro/planning-poker-cards.png" >}}

自分の思うポイントを選択して、Miro のボードにドラッグ&*ドロップします。
すると以下のように、カードが裏向きで表示され、自分メニューには選択したポイントが表示されます。


{{< figure src="/images/posts/planning-poker-in-miro/planning-poker-selected.png" >}}


この状態で変更したいときは、`Swap` ボタンを押すと再度選択できるようになります。
`Reveal all` ボタンを押すと全員分のカードをめくることができます。 `Clear all` ボタンで全員のカードを削除することができます。

このプラグインを使えば、対面でカードを使って Planning Poker しているような体験を Miro 上ですることができます。

実際に何度か使ってみましたが、普通に使いやすかったです。

一点、Miro で Planning Poker を開いた際にたまにエラー表示になってしまいますが、一度メニューを閉じて再度 Planning Poker を選択し直すとうまく表示されると思うのでお試しください。


## まとめ

今回は、Miro を用いて Planning Poker を行う方法についてまとめました。
基本的にリモートワークになることにより、チーム内のコラボレーションに工夫が必要になった方も多いと思いますが、Miro はさまざまな機能がありチーム内でコミュニケーションをとるのに非常に有用なツールだなぁと思います。

アップデートも頻繁に入っており、いろいろな機能追加がされていて開発が頻繁にされているところも安心感があります。

Planning Poker もとても使いやすかったのでおすすめです。
