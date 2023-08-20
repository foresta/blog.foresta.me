+++
title="『オブザーバビリティ・エンジニアリング』を読んだ"
date="2023-07-16T22:21:37+09:00"
categories = ["engineering"]
tags = ["book"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、{{< exlink href="https://www.oreilly.co.jp/books/9784814400126/" text="『オブザーバビリティ・エンジニアリング』">}} を読んだので感想などを書いていきます。

## 本について

<a href="https://www.amazon.co.jp/%E3%82%AA%E3%83%96%E3%82%B6%E3%83%BC%E3%83%90%E3%83%93%E3%83%AA%E3%83%86%E3%82%A3%E3%83%BB%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%8B%E3%82%A2%E3%83%AA%E3%83%B3%E3%82%B0-Charity-Majors/dp/4814400128?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=YWI8SC1JTLD4&keywords=%E3%82%AA%E3%83%96%E3%82%B6%E3%83%BC%E3%83%90%E3%83%93%E3%83%AA%E3%83%86%E3%82%A3&qid=1689516374&sprefix=%E3%82%AA%E3%83%96%E3%82%B6%E3%83%BC%E3%83%90%E3%83%93%E3%83%AA%E3%83%86%E3%82%A3%2Caps%2C347&sr=8-1&linkCode=li2&tag=foresta04-22&linkId=16a531a00cbe062f66fc8e1675aef96a&language=ja_JP&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=4814400128&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=4814400128" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://www.oreilly.co.jp/books/9784814400126/" text="オブザーバビリティ・エンジニアリング">}}

<details>
<summary>オブザーバビリティ・エンジニアリング 目次</summary>

```
本書への賞賛
まえがき
序文

第Ⅰ部　オブザーバビリティへの道


1章　オブザーバビリティとは？
    1.1　オブザーバビリティの数学的定義
    1.2　オブザーバビリティのソフトウェアシステムへの適用
    1.3　ソフトウェアにおけるオブザーバビリティについての誤解
    1.4　なぜ今オブザーバビリティが重要なのか？
    1.5　メトリクスを用いたデバッグとオブザーバビリティの比較
    1.6　オブザーバビリティを用いたデバッギング
    1.7　オブザーバビリティは現代のシステムのためにある
    1.8　まとめ

2章　オブザーバビリティとモニタリングにおけるデバッグ方法の違い 
    2.1　モニタリングデータのデバッグへの活用方法
    2.2　オブザーバビリティがより良いデバッグを可能にする理由
    2.3　まとめ

3章　オブザーバビリティを用いないスケーリングからの教訓
    3.1　Parseの紹介
    3.2　Parseでのスケーリング
    3.3　現代のシステムへの進化
    3.4　現代的な実践に向けた進化
    3.5　Parseにおけるプラクティスの変革
    3.6　まとめ

4章　オブザーバビリティとDevOps、SRE、クラウドネイティブとの関連性
    4.1　クラウドネイティブ、DevOps、SREクイックリファレンス
    4.2　オブザーバビリティ：デバッグの昔と今
    4.3　オブザーバビリティがDevOpsとSREのプラクティスを強化する
    4.4　まとめ

第Ⅱ部　オブザーバビリティの基礎 

5章　構造化イベントはオブザーバビリティの構成要素である
    5.1　構造化イベントを使ってデバッグする
    5.2　構成要素としてのメトリクスの限界
    5.3　構成要素としての従来のログの限界
    5.4　デバッグに役立つイベントのプロパティ
    5.5　まとめ

6章　イベントをトレースにつなぐ
    6.1　分散トレースとその重要性
    6.2　トレースの構成要素
    6.3　トレースを地道に計装する
    6.4　トレーススパンへのカスタムフィールドの追加
    6.5　イベントをトレースにつなぐ 
    6.6　まとめ

7章　OpenTelemetryを使った計装
    7.1　入門計装
    7.2　オープンな計装標準 
    7.3　コードベースの例を用いた計装
    7.4　まとめ

8章　オブザーバビリティを実現するためのイベント解析
    8.1　既知の状態からのデバッグ
    8.2　第一原理からのデバッグ
    8.3　AIOpsの誤解を招く約束 
    8.4　まとめ

9章　オブザーバビリティとモニタリングの関係
    9.1　モニタリングが適した場所
    9.2　オブザーバビリティが適した場所
    9.3　考察: システム vsソフトウェア
    9.4　組織的なニーズを把握する
    9.5　まとめ

第Ⅲ部　チームのためのオブザーバビリティ 

10章　オブザーバビリティへの取り組みをチームへ適用する
    10.1　コミュニティグループに参加する
    10.2　最大の問題点から始める
    10.3　作るより買う
    10.4　計装を繰り返し完成させる
    10.5　既存の努力を活用する機会を探す
    10.6　最後のひと押しに備える
    10.7　まとめ

11章　オブザーバビリティ駆動開発
    11.1　テスト駆動開発
    11.2　開発サイクルにおけるオブザーバビリティ
    11.3　デバッグする場所を決定する
    11.4　マイクロサービス時代のデバッグ
    11.5　計装でオブザーバビリティを駆動する
    11.6　オブザーバビリティをシフトレフトする
    11.7　オブザーバビリティを活用してソフトウェアデリバリーを高速化する 
    11.8　まとめ

12章　サービスレベル目標の信頼性向上への活用
    12.1　従来のモニタリング手法では危険なアラート疲れが発生する
    12.2　しきい値アラートは既知の未知のみに対応している
    12.3　ユーザー体験が道しるべ
    12.4　サービスレベル目標とはなにか？
    12.5　まとめ

13章　SLOベースのアラートへの対応とデバッグ
    13.1　エラーバジェットが枯渇するまえにアラートを出す
    13.2　時間をスライディングウィンドウとして捉える
    13.3　バーン予想アラート作成のための予測
    13.4　オブザーバビリティデータ vs時系列データ: どちらをSLOに使用するか
    13.5　まとめ

14章　オブザーバビリティとソフトウェアサプライチェーン
    14.1　なぜSlackにはオブザーバビリティが必要なのか 
    14.2　計装：共有クライアントライブラリとディメンション
    14.3　ケーススタディ：サプライチェーンの運用
    14.4　まとめ

第Ⅳ部　大規模なオブザーバビリティ 

15章　投資収益性: 作るか、それとも買うか
    15.1　オブザーバビリティのROIをどう分析するか
    15.2　独自構築にかかる本当のコスト
    15.3　ソフトウェアを買うときの本当のコスト
    15.4　買うか作るかは二者択一ではない
    15.5　まとめ

16章　効率的なデータストア
    16.1　オブザーバビリティの機能要件
    16.2　事例: HoneycombのRetrieverの導入事例
    16.3　まとめ

17章　安価で十分な精度にするためのサンプリング戦略
    17.1　データ収集の精度を上げるためのサンプリング
    17.2　サンプリング手法の使い分け
    17.3　サンプリング戦略をコードに置き換える
    17.4　まとめ

18章　パイプラインによるテレメトリー管理
    18.1　テレメトリーパイプラインの属性
    18.2　テレメトリーパイプラインの管理：解剖学
    18.3　テレメトリーパイプラインの管理における課題
    18.4　事例: Slackでのテレメトリー管理
    18.5　オープンソースの代替
    18.6　テレメトリーパイプラインの管理：構築と購入の比較
    18.7　まとめ

第Ⅴ部　オブザーバビリティの文化を拡大する 

19章　オブザーバビリティのビジネス事例
    19.1　変革をもたらすためのリアクティブなアプローチ
    19.2　オブザーバビリティの投資対効果
    19.3　変化を導入するためのプロアクティブなアプローチ
    19.4　オブザーバビリティをプラクティスとして導入する
    19.5　適切なツールを使う
    19.6　オブザーバビリティが十分であることを確認する
    19.7　まとめ

20章　オブザーバビリティの利害関係者と協力者
    20.1　非エンジニアリング的なオブザーバビリティの必要性の認識
    20.2　オブザーバビリティの協力者を作る実践
    20.3　オブザーバビリティツールとビジネスインテリジェンスツールの使い分け
    20.4　オブザーバビリティとBIツールの併用による実践的な使い方
    20.5　まとめ

21章　オブザーバビリティ成熟度モデル
    21.1　成熟度モデルについてのノート
    21.2　オブザーバビリティに成熟度モデルが必要な理由
    21.3　オブザーバビリティ成熟度モデルについて
    21.4　OMMで参照されるケイパビリティ
    21.5　あなたの組織でオブザーバビリティ成熟度モデルを使う
    21.6　まとめ

22章　ここからどこへ
    22.1　オブザーバビリティ、当時と今
    22.2　追加の資料
    22.3　オブザーバビリティの行方についての予測

訳者あとがき
索引
```
</details>

## 感想とか


この本は、オブザーバビリティという概念について主に書かれています。

モニタリングとオブザーバビリティは似たような単語ですが、その違いが第一部にて明確に書かれています。

モニタリングはわかりやすいと思いますが、想定される値をメトリクスとして監視し閾値を超えた際にアラートを発砲するような仕組みのことです。
モニタリングはあらかじめ決めた指標を監視するため起こりうる事象をあらかじめ予測することになります。
そのため未知の事象については監視できず、未知の事象が発生したタイミングでポストモーテムを開催し、追加でメトリクスを追加し再発防止するという運用になるかと思います。


一方オブザーバビリティは、現在のマイクロサービスなどの分散システムが複雑なことを背景として、未知な事象についても探索的に調査できるように、ログをを出しておくという考え方だと理解しました。

モニタリングとオブザーバビリティは以下のように対比して書かれていました。

- アプローチ
  - モニタリングはリアクティブ
  - オブザーバビリティは積極的なアプローチ
- 最高のデバッガー
  - モニタリングでは昔からプロジェクトにいる人
  - オブザーバビリティは最も好奇心が高いエンジニア


続く第二部では、オブザーバビリティの実装についてはなされていました。

人が読む用の非構造化ログではなく、機械が読める構造化ログを処理イベントごとに構造化イベントとして残し、その構造化イベントをつなぎ合わせてトレースする手法について記載されていました。

OpenTelemetry という OSS 標準についての紹介などもあります。

トレースについては、
{{< exlink href="https://research.google/pubs/pub36356/" text="分散トレースについての論文" >}} なども紹介されていました。 

以降の第三部、第四部、第五部では、実際にオブザーバビリティを導入するにあたって必要な観点が紹介されていました。

オブザーバビリティツールを買うか作るかのような観点から、大量の構造化イベントログを残すコストを緩和するためのサンプリングの手法など書かれていて面白かったです。

特に後者は、最初オブザーバビリティで構造化イベントログを残すという話を聞いたときにログの量がやばそうだなと思ったのですがそのあたりについても言及されていました。サンプリングについては golang での実装例も載せられていて参考になるかと思います。

## まとめ

今回は、{{< exlink href="https://www.oreilly.co.jp/books/9784814400126/" text="『オブザーバビリティ・エンジニアリング』">}} を読んだので感想を書きました。

普段はバックエンドのエンジニアとして仕事をしていますが

- 大量のアラート
- 発火しても様子見するだけのアラート

が多い問題を何とかしようとしていろいろ書籍を漁ったなかで出会った本ですが、モニタリング周辺の知識も学べてよかったです。

個人的にはモニタリングは最低限のふるまいについて (API でいうLatency や Error 数など) のみにして、構造化イベントログを用いて探索的に調査できるようにするこのオブザーバビリティの考え方は取り入れていこうと思っています。

オブザーバビリティを実現するための構造化イベントログについても、現状のシステムに取り入れられないかなど検討したいと思いました。