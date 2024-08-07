+++
title="開発フェーズにおけるスピードと質について"
date="2024-03-31T11:24:00+09:00"
categories = ["engineering"]
tags = ["architecture", "quality", "speed"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

開発のフェーズに応じてスピードを大事にする、質を大事にするみたいな会話はよくあります。
プロトタイピングをつくっているフェーズにおいて質を犠牲にしてスピードを重視した結果、スピードが落ちるという経験を最近しました。

頭では質を高めるとスピードも上がるという点がわかっていたのですが、失敗を経験したので振り返ってみます。

## 質とスピードについて

結論は以下のスライドにすべて書いてあります。

- {{< exlink href="https://speakerdeck.com/twada/quality-and-speed-aws-dev-day-2023-tokyo-edition" text="質とスピード（AWS Dev Day 2023 Tokyo 特別編、質疑応答用資料付き） / Quality and Speed AWS Dev Day 2023 Tokyo Edition - Speaker Deck" >}}


内部品質とスピードはトレードオフではなく、相互に高めあう正のフィードバックループということです。

今回の開発では、BIツールを用いてダッシュボードをプロトタイプするということを行っていて、その最中に品質が落ちた結果スピードも落ちるということを経験しました。

具体的には以下のような問題がおきました。

- ペアプロを実施していて Pull Request のレビューを Skip した結果、情報共有不足で重複したデータモデルをつくってしまった
- データモデリングの設計が甘く、名前と実態が一致しないためにわかりづらいモデルができてしまった

## 質が落ちる原因

今回の件をうけ、品質が落ちる原因は以下にあると考えています。

- スピードを優先したつもりの手抜き
- 知識不足


### スピードを優先したつもりの手抜き

Pull Request レビューをスキップしたというのがこちらの問題かなと思います。
他にもテストを書かなかったり、場当たり的なパッチのような開発をしたりというのがこちらに当たるかと思います。

一見短期的に早く仕上がるように見えるのでこういった開発をしがちなのですが、実際にツケが回ってくるのは思っているよりも早いです。

今回はそれを身をもって実感しました。

私は特にこれをやってしまいがちなので気をつけたいです。
期日が明確にあるタスクなど終わらないのではというプレッシャーから逃れるためにこういった手抜きをしてしまいがちです。

一見スピードを優先しているように見えて、楽な開発を選んでいるだけなのではないかという点は問い続けていきたいと思います。


### 知識不足

データモデリングの設計が甘かったのは、知識不足が原因だと考えています。\
甘いと言いつつ、実際にモデリングした当初はこれがベストだと思っていました。しかし、実際にプロトタイプをつくっていく中でこのモデルだとうまくいかなかったり、わかりづらいという点が見えてきました。\
これは、手抜きをしたというよりは、プロジェクトの進行にともなってプロジェクトに関する知識 (技術的知識、ドメイン知識) が増えことによるものです。

基本的に、プロジェクトが進行するにつれて開発者の知識はどんどん増えていくためプロジェクトの後期でされた意思決定ほど精度が高くなります。\
そのため、アーキテクチャを考える時に意思決定をできるだけ遅らせるように設計するという点が非常に重要になってきます。\
また、知識がアップデートされたタイミングで既存のシステムもアップデートしていくという点が非常に重要だと再認識しました。(リファクタリングをしよう)

今回の件で、知識がプロジェクト進行により増えていき過去のシステムが古く違和感を持つようになることを身をもって経験しました。

## まとめ

質とスピードについて振り返った内容を書きました。

質とスピードはトレードオフではなく、実際に質が落ちるのは

- スピードを優先した "つもり" の手抜き
- 知識不足

によるものでした。


開発をするにあたっては以下を意識すると良さそうです。

- 設計の意思決定を遅らせられないか考える
- 常に現時点で考えられる最善の設計をする
- 知識の更新による違和感があれば、システム側も更新する
