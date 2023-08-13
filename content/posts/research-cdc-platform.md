+++
title="CDC (Change Data Capture) について調べた"
date="2023-08-13T22:59:10+09:00"
categories = ["engineering"]
tags = ["cdc", "infra", "data"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

CDC (Change Data Capture) といわれる技術について調べたのでメモです。

## CDC について

CDC: Change Data Caputure は Database などのデータの変更を追跡して、他のシステムやサービスに対して通知したりデータを流したりする仕組みの総称です。

たとえば、RDB の変更されたデータを Stream キュー などに流して後続の処理を実行するといった使い方ができます。
データベース以降の処理をイベント駆動のアーキテクチャにすることができるため、Stream 処理パイプラインなどとの親和性が高いように思います。

また、データのレプリケーションなども用途の一つにはいるかと思います。

たとえば、AWS の RDS から別のデータソースにリアルタイムでデータをレプリケーションしたいといったケースにも使用できそうです。


### 参考
- {{< exlink href="https://www.redhat.com/ja/topics/integration/what-is-change-data-capture" text="変更データキャプチャとは" >}}
- {{< exlink href="https://www.integrate.io/jp/blog/what-is-change-data-capture-ja/" text="Change Data Capture とは?" >}}


## 実現するための技術

CDC を実現するための技術としていくつかあります。

### {{< exlink href="https://debezium.io/" text="debezium">}}
{{< exlink href="https://debezium.io/" text="debezium">}} は、Java 性の OSS の CDC を実現するための技術です。

基本的に、Kafka というストリーム処理プラットフォームのコネクター (Kafka Connect) として実装されているため、DB から Kafka Stream のキューに流すといったユースケースでは使えそうです。

また、以下の記事で紹介されているように Embedded といわれる仕組みを使うと任意の Java コードを埋め込めるため、たとえば Amazon Kinesis にデータを流すなどある程度自由な事ができそうです。

{{< exlink href="https://debezium.io/blog/2018/08/30/streaming-mysql-data-changes-into-kinesis/" >}}


### {{< exlink href="https://docs.aws.amazon.com/ja_jp/dms/latest/userguide/Welcome.html" text="AWS DMS" >}}

{{< exlink href="https://docs.aws.amazon.com/ja_jp/dms/latest/userguide/Welcome.html" text="AWS DMS" >}} は AWS のマネージドのデータレプリケーションのためのサービスです。

いくつかある動作モードのうちの一つとして、変更データキャプチャ (CDC) も実現できます。

データソースとなるストレージと、データの移行先となるストレージがともに AWS のサービス上であれば非常に親和性が高いかと思います。

構成として、`Source Endpoint` 、`Target Endpoint` とよばれる２つの Endpoint を設定したあとに、Replication Instance と呼ばれる EC2 インスタンスをたててその上でレプリケーション用の処理が動くイメージです。



ちなみに、debezium と AWS DMS の比較として以下の記事がとても参考になりました。

- {{< exlink href="https://medium.com/capital-one-tech/the-journey-from-batch-to-real-time-with-change-data-capture-c598e56146be" >}}

### その他 iPaas 系

その他のマネージド系サービスとして、データ処理パイプラインのプラットフォームがいくつかあったのでリンクだけ貼っておきます。

- {{< exlink href="https://airbyte.com/" text="Airbyte">}}
- {{< exlink href="https://www.fivetran.com/" text="fivetran" >}}

これらのプラットフォームのうちの１機能として、CDC が利用できそうです。

## CDC による分散トランザクションについて

余談ですが、Outbox パターンというメッセージングシステムを行う上でのトランザクション制御に関する設計パターンも CDC を用いて設計できることが、Debezium のブログで触れられていました。

マイクロサービス化に伴い、データソースも分散するケースも多いかと思います。例えば、ユーザー情報を扱う User API と、商品情報を扱う Item API といった具合です。それぞれのマイクロサービスにそれぞれデータストアを持っているとするとこれらことなるサービス間のトランザクション制御は難しくなるのですが、CDCを用いて、Outbox パターンを実現できそうです。

あまり詳しくしらべきれてないので以下のあたりの参考になりそうな記事を貼っておきます。

- {{< exlink href="https://qiita.com/yoshii0110/items/cc88f3cad776ead9838c" >}}
- {{< exlink href="https://techblog.zozo.com/entry/implementation-of-cqrs-using-outbox-and-cdc-with-dynamodb" >}}
- {{< exlink href="https://engineering.mercari.com/blog/entry/20211221-transactional-outbox/" >}}
- {{< exlink href="https://debezium.io/blog/2020/02/10/event-sourcing-vs-cdc/ ">}}
- {{< exlink href="https://debezium.io/blog/2019/02/19/reliable-microservices-data-exchange-with-the-outbox-pattern/" >}}

## まとめ

今回は、CDCについて調査した内容をまとめました。
CDCは、マイクロサービスなどの分散アプリケーションやストリームパイプラインを作成するといった際に親和性の高い技術なので、分散アプリケーションの複雑さに立ち向かうための武器として知っておきたいと思いました。
