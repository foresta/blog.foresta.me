+++
title="データマネジメント系の勉強会に参加してきた"
date="2023-11-19T16:37:44+09:00"
categories = ["engineering"]
tags = ["data", "data-management", "data-engineering"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

データエンジニアとしてデータ基盤などの開発等を行っていく上で、データマネジメント系の話題が気になっていたのと社内の Slack などでおすすめされていたこともあり、データマネジメント系の勉強会にいくつか参加してみたのでその感想などを書きます。

## 参加した勉強会

こちらの勉強会に参加しました。

- {{< exlink href="https://blog.trocco.io/event/domain-driven_data-management_1" text="ドメイン駆動データマネジメント #1 データマネジメントのはじめ方">}}
  - {{< exlink href="https://twitter.com/search?q=%23DDDM&src=typed_query&f=live" text="X ハッシュタグ" >}}
- {{< exlink href="https://timeedev.connpass.com/event/299088/" text="データマネジメントチームのマネジメントの方が難しかった話" >}}
  - {{< exlink href="https://twitter.com/hashtag/%E3%83%87%E3%83%BC%E3%82%BF%E3%82%88%E3%82%8A%E3%82%82%E4%BA%BA%E3%81%AE%E3%83%9E%E3%83%8D%E3%82%B8%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E6%96%B9%E3%81%8C%E9%9B%A3%E3%81%97%E3%81%84?src=hashtag_click&f=live" text="X ハッシュタグ">}}

どちらもデータマネジメントとその周りの組織周りの話についての話が聞けました。

## 学びなど

どちらの勉強会でも共通していたこととしては以下の２点のように感じました。

- データマネジメントは領域が広い
- データマネジメントと組織の話は切り離せない

### データマネジメントは領域が広い

DMBOK を見てもデータマネジメントがカバーする領域はとても広いなと思います。

そのため、データマネジメントの何から始めるかという点がとても重要そうに感じました。

会の中で出ていたのは以下のような点でした。

- DMBOK ピラミッドにしたがってPhase 1 からやる
- 効果が出そうなところからやる

やることが多いからこそ、まずどこからやるのかという優先順位付けが非常に重要だと感じました。

### データマネジメントと組織の話は切り離せない

データにふれるという観点でいうと、ほぼ全ての人がデータには何らかの関わりをするということを考えると、別部署の人たちとうまく協力することが非常に重要に感じました。
組織的にデータやデータ組織に対する信頼を勝ち取るといった戦略も重要だという視点は、ソフトウェアエンジニアと比べるとかなり広いんじゃないかなと思います。

優先度の話にも繋がりますが、まずは成果がでるところをしっかりとやってデータチームの信頼を得るみたいな話はとても納得感がありました。

また、データマネジメントの成果がなかなか定量的に測りにくく目標設定がむずかしいみたいな話も盛り上がっていた印象でした。

SLA を設けて他の部署の方とデータについての期待値を揃えるみたいな話もありましたが、Software の Observability のような Data Observability といった概念もありこのあたりもキャッチアップしてどのようにデータマネジメントしていくか学んでいきたいと思います。


## まとめ

今回は、データマネジメントについての勉強会に参加してきた感想を書きました。

勉強会自体久しぶりなのと、データ関連の勉強始めてだったのでとても楽しかったです。
とりあえず、DMBOK読もうという気になりました。
