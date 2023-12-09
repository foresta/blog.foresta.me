+++
title="Dagster University で Dagster に入門してみた"
date="2023-12-09T16:52:02+09:00"
categories = ["engineering"]
tags = ["dagster", "data-engineering"]
thumbnail = ""
+++

この記事は、{{< exlink href="https://qiita.com/advent-calendar/2023/datatech-jp" text="datatech-jp Advent Calendar 2023" >}} 10日目の記事です。

--- 
こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今年の 10 月に データエンジニアにコンバートして、最近は dbt や Snowflake 周りをさわっています。
今携わっているシステムに dagster を導入してみるというプロジェクトがあるため自分も触ってみようと思い今回は、Dagster の基礎が学べる {{< exlink href="https://courses.dagster.io/courses/dagster-essentials" text="Dagster University" >}} で入門してみました。

かなり良いチュートリアルだなと思うため、概念を知りたい方やとりあえず入門してみたい方におすすめです。

## Dagster について

- {{< exlink href="https://dagster.io/" >}}

Dagster は Asset ベースの Data Orchestration ツールになります。

Asset を Python コードで定義することで、データの Lineage を見ることができたり 定期実行する Job や、イベントをトリガーとした Job の実行などを管理できるツールです。

さまざまなDB や dbt などとも連携できます。

以下の画像ような Asset Lineage や Job の実行ステータスなどを見ることができます。

{{< figure src="/images/posts/dagster-university/dagster-assets-lineage.png" caption="Dagster University で実際に作成した画面" >}}


## Dagster Univerity とは

- {{< exlink href="https://courses.dagster.io/courses/dagster-essentials" >}}

Dagster University は、Dagster 公式で用意されている Learning 用のコンテンツです。チュートリアル的に手を動かして学べるのと、各章の最後に Quiz があり理解度チェックをすることができます。

基礎的な概念から実際に手を動かすパートなどあり、Dagster を使うとどんなことができるかのイメージが付きます。

実際に取り組むためにはメールアドレスの登録が必要です。

## 学べる内容について

以下のようなカリキュラムになっています。

```
- Lesson 1: Introduction
- Lesson 2: Prerequisites & setup
- Lesson 3: Software-defined Assets 
- Lesson 4: Asset dependencies
- Lesson 5: Definitions and code locations
- Lesson 6: Resources
- Lesson 7: Schedules
- Lesson 8: Partitions and backfills
- Lesson 9: Sensors
- Capstone
- Extra credit: Metadata
```

前半の章では、Data Engineering とはなにかといった Overview から始まり、Dagster が担う Data Orchestrator とは何なのかといったことが学べます。
Dagster は、Asset ベースのオーケストレーションツールで、Workflow を実行する処理のフローではなく、データの Lineage のようなもので表します。

そして、Dagster プロジェクトの始め方が書かれていて実際にプロジェクトを構築します。

続く章で実際に、Dagster を構築しながら以下のような概念について知ることができます。

Asset
: 管理したいデータ。DBのテーブルなど。

Resources
: Asset を生成するためのツール的なもの。DBへのコネクションや、APIリクエスト、DBT の CLI リソースなど。

Job
: 特定の Job。Asset 全体のスライスというように表現されているのがイメージしやすい

Definitions
: Dagster で管理したいものをまとめて定義するもの。Asset や Job や 後述の Schedules など全部定義する。

Code Location
: コードをチームやPython 環境などで分離する際の単位。1 Code Location につき 1 Definitions。

Schedules
: Cron 式によるスケジューリングと実行したい Job からなるもの

Sensors
: イベント駆動で実行するための設定と Job。S3 にファイルが置かれたら実行するみたいなやつ。


一通り終えると、以下のようなことができるようになります。

- Dagster で Asset を管理し、lineage などを見ることができる
- Dagster の UI の使い方がわかる
- Asset や Resource などの生成方法がわかる
- Schedule, Sensors による Job 実行の方法がわかる
- Asset の Partition の概念がわかる
- Dagster 上における Metadata の設定と見方がわかる

## まとめ

今回は、Dagster University について書きました。

Asset ベースの Data Orchestration ツールの Dagster に触ってみたい、とりあえずどんなものか学んでみたいという方には非常におすすめかなと思います。

また、すべての Lesson を完了すると以下のような証明書をもらえるのも地味にうれしいポイントです。
{{< figure src="/images/posts/dagster-university/dagster-essentials-certificate.png" width=400 >}}

今回取り上げた Data Orchestration を含め、さまざまな Data Tool をどのように連携させ、{{< exlink href="https://datadeveloperplatform.org/" text="Data Developer Platform" >}} の構築などに関心があるため様々なツールを触っていきたいなと思いました。
