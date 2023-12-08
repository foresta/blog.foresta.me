+++
title="Platform Engineering Meetup #6 に参加してきた"
date="2023-12-08T00:01:03+09:00"
categories = ["engineering"]
tags = ["event", "platform-engineering"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

最近気になっている Platform Engineering 周りの勉強会が開催されていたので参加してきました。

- {{< exlink href="https://platformengineering.connpass.com/event/299834/" >}}

## 各セッションについて

以下のようなセッションが行われました。
資料などとともに感想書いていきます。

### A Platform for Challengers: How we make tech decisions at Upsider	

こちらは、UPSIDER という法人カードサービスで行われている Platform Engineering の話でした。

個人的に気になったのは、{{< exlink href="https://www.crossplane.io/" text="crossplane" >}} という k8s アドオンです。
k8s まわりあまり触ってこなかったのですが、現在データ基盤の Platform Engineering やっていきたいと思い {{< exlink href="https://datadeveloperplatform.org/" text="Data Developer Platform">}} のサイトなどを読んだりしていた中で、`Control Plane`, `Development Plane`, `Data Activation Plane` というレイヤー構造の話が出てきました。

- {{< exlink href="https://datadeveloperplatform.org/architecture/" >}}

この辺りの概念があんまりわかってなかったのですが、この crossplane がまさに、control plane のフレームワークだなと思ってこのあたりはかなり参考になりました。

抽象的な概念学ぶために実際のツール触ってみるのよさそうなので触って勉強してみようと思いました。

{{< tweet 1732780986520457684 >}}
 


### Repro の開発組織体制の変遷そして Platform Engineering

{{< exlink href="https://speakerdeck.com/a_bicky/platform-engineering-meetup-number-6" text="資料 - Repro の開発組織体制の変遷そして Platform Engineering / Platform Engineering Meetup #6" >}}

こちらは、Repro というマーケティングオートメーションサービスの話でした。

まさに Platform Engineering という感じで、チーム構造の変遷ともに開発者の認知負荷が高まりそのために `Repro Core` というチームを組成し Platform Engineering を進めているという話でした。

印象に残ったのはやはり、Team Topoligy 関連の話でした。基盤チームとして他チームとどのように関わっていくかは非常に重要なトピックだと思うので、Team Topology 読まなきゃなと思います。

### リクルートにおける Platform Engineering / SRE の事例共有: 8年間の歩みと今後の展望

{{< exlink href="https://speakerdeck.com/recruitengineers/platformengineeringmeetup_suganuma" text="資料 - リクルートにおける Platform Engineering / SRE の事例共有">}}

こちらは、リクルートで作成されている Knile という Platform についてのお話でした。

この Platform については他の勉強会の資料も紹介されていたので貼っておきます。

- {{< exlink href="https://speakerdeck.com/recruitengineers/mlops-kato" text="リクルートのデータ活用を加速させるセルフサービス型 A/B テスト基盤の設計と実装 / MLOps_kato">}}
- {{< exlink href="https://speakerdeck.com/recruitengineers/cndt2021-kojisuganuma-eb8b8398-1a05-416a-bee4-af8be882af29" text="クラウドネイティブ×持続可能 セルフサービス型データ分析ジョブプラットフォーム設計プラクティス / cndt2021_kojisuganuma" >}}

第一印象としては、かなり高度な Platform を構築されていてすごいなということです。開発者が GitHub 上でデータアプリケーションの開発をほぼ回せる仕組みや、内部の開発者向けに SLO 公開されていたり、まさに `Platform as a Product` だと思いました。

自分の環境でも今まさに、データ基盤のPlatform 化できないかという構想があるため非常に参考になりそうなところが多く思います。

まずどこから着手始めたら良いのか、悩みそうですが着実に進めれたら良いなと思いました。


### ヤフーにおけるWebアプリケーション向けPaaS〜開発と運用の小史

{{< exlink href="https://speakerdeck.com/hhiroshell/how-to-put-platforms-on-track" text="資料 - 大規模Webアプリケーションプラットフォームを開発して軌道に乗るまでにやったこと / How to Put Platforms on Track" >}}

こちらは、ヤフーの内部で用意している PaaS をどのように開発して運用に載せるまでにいたったかという話がなされていました。

開発も大変ですが、実際に運用にのるまでの苦労などが語られていてよかったです。

開発ではユーザーインタビューやユーザーストーリーマッピングなどを実施したり、競合のプロダクト調査をしたり。
運用面では、ドキュメンテーションやサポート窓口、ハンズオンなどとまさにプロダクト開発といった内容でした。

AWS などのサービスがベータリリースされ、GA されるといった流れと同様のことをされていて大規模な組織でプラットフォームを開発していくことの大変さとその凄さを実感しました。

## まとめ

今回は Platform Engineering Meetup #6 に参加してきたまとめを書きました。

社内 Platform とはいえ本当にプロダクト開発そのものだなということが改めて実感できました。
また、Platform を通して別チームの人とどのように関わっていくか。そのあたりの知識については Team Topoligy という本を読まなければなと改めて感じました。

- {{< exlink href="https://www.amazon.co.jp/dp/4820729632" text="チームトポロジー 価値あるソフトウェアをすばやく届ける適応型組織設計">}}
