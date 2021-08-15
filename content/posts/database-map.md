+++
title="さまざまなデータベースの分類について"
date="2021-08-15T15:24:30+09:00"
categories = ["engineering"]
tags = ["database", "db"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、データベースについてざっくりとどんなものがあってどのように分類されているのかをまとめます。

## データベースの分類方法

データベースには、調べた限りだといくつかの分類方法があります。
しかしそれらは完璧に分類できるわけではなくDBMS (Database Management System) によっては A という 要素 と B というを兼ね備えたものといった具合に境目が曖昧なものも存在します。

いくつかの分類を紹介します。

### リレーショナル, NoSQL, NewSQL

最初の分類は、以下の３つによる分類です。

- リレーショナル DB (RDB)
- NoSQL
- NewSQL

#### RDB

RDBは、一番広く普及されているデータベースです。
データは行と列で構成されたテーブルとして表されます。
テーブル同士の関係 (リレーション) に対して、SQL を用いて操作をおこなうのが特徴です。

RDB は、Schema on Write なので、書き込む際に特定のスキーマのみを受け付けることからデータが対象のスキーマを満たしていることが保証されます。

また、RDB には ACID 特性 (Atomicity: 原子性, Consistency: 一貫性, Isolation: 独立性, Durability: 耐久性) があります。

Atomicity により、トランザクションは必ず完全な実行か実行されないかのいずれかになります。Consistency によりデータはデータベーススキーマに従うことが保証されます。Isolation により同時に発生したトランザクションは独立して実行されます。Durability によりシステムの予期せぬ障害でも異常の発生前の状態まで復旧できます。

RDBでは、上記の ACID 特性をもったトランザクションをサポートしているため、書き込みを分散させる (水平スケーリング) させることは難しいです。

代表的な DBMS に以下のようなものがあります。
- MySQL
  - MariaDB
  - Amazon Aurora
- Oracle
- SQL Server
- PostgreSQL
  - Amazon Redshift
- IBM DB2

#### NoSQL

NoSQL (Not only SQL) は、RDBのような表形式で関連を扱うデータモデルではなく、主に単一のキーと値、もしくは JSON ドキュメントとして保存されるものです。

リレーションをモデル化しないため、SQL を使用しませんが、SQLライクなクエリ言語をサポートする場合があるため Not only SQL (SQLだけでない) と呼ばれます。
NoSQL は基本的に、Schema on Read なので、データが特定のスキーマだけを保証することはないです。
また、RDB である JOINなどの結合操作も行いません。

RDB とは違い、トランザクションをサポートしないものが多いため、書き込みに対しても水平にスケールできるため特に大量のデータを書き込むようなワークロードには向いてるのかなと思います。

RDB に分類されない DBMS は大方こちらに分類されることになるかと思います。
DynamoDB, Bigtable, Redis, MongoDB などがあります。

#### NewSQL

SQL のインターフェースを持ち、ACID 特性のあるトランザクションをサポートしながら水平にスケールできパフォーマンスが高いものの略称です。
RDB と NoSQL の良いところを併せ持つように設計された DBMS です。

以下の製品が NewSQL と言われています。

- Google Cloud Spanner
- Microsoft CosmosDB
- CockroachDB
- NuoDB
- VoltDB


### データ型での分類

以下のようなデータ型による分類があります。
テーブルは RDB でそれ以外は NoSQL になります。

- テーブル
    - 主に、RDB で用いられるデータ型。列と行による表形式の構造
    - MySQL / PostgreSQL / SQL Server / PostgreSQL
- ワイドカラムストア
    - NoSQL で用いられるデータ型。テーブルと似ているが行キーを元に多次元のカラムを取得する
    - Bigtable / Apache Cassandra / HBase 
- KVS (Key Value Store)
    - 辞書型のような Key / Value からなるデータ構造
    - Redis / Memcached / Riak
- ドキュメント
    - 主にJSON 形式でデータを保持する
    - MongoDB / CouchDB / RethinkDB / Espresso  
- グラフ
    - ネットワーク上のデータを表すためのデータ型 (ソーシャルグラフなど) 
    - Neo4j などがある

### ワークロードによる分類

DBMS がどのようなワークロードを想定しているかどうかによって分類ができます。

ワークロードしては以下の通りです。

- OLTP (OnLine Transaction Processing)
- OLAP (OnLine Analytic Processing)
- HTAP (Hybrid Transaction / Analytical Processing)

#### OLTP

通常の Webサービスなどの用途はこちらに当たります。1 リクエストあたりで扱うレコード量は少なく負荷も少ないですが、大量のリクエストがくる想定なのが OLTP のワークロードです。
通常は、インデックスを用いて要求されるキーに対応するデータを取得します。
ディスクからデータを探す際のシークがボトルネックになりやすいです。

こちらは、MySQL や PostgreSQL など一般的な DBMS が該当します。

#### OLAP

主に分析をするようとのワークロードです。分析用のためリクエストの数自体は少ないものの、1 リクエストで扱うデータ量が非常に多いため、ディスクの帯域がボトルネックになりやすいです。
こちらは、データレイアウトでいうと、列指向ストレージが広く使われます。

Amazon Redshift などは、行指向のデータベースで OLAP 用途を想定されています。

#### HTAP

こちら、OLTPのワークロードと、OLAP のワークロードをどちらもサポートすることを想定されたものになります。

SQL Server や、IBM Db2 などが両方サポートされているようです。

## まとめ

今回は、DBMS をどのように分類できるかという点に着目してまとめました。

分類をまとめましたが、それぞれ綺麗に分類できるものではないです。
例えば、MySQL ver5.7 以上では、JSON 型をサポートしていることからドキュメントDBとしての側面も持っていることになります。

細かな分類はあまり意味がないかもしれませんが、それぞれの DBMS がどのような課題を解決しようとして生まれたものなのか。そして何が得意で何が不得意かを知ると実際の技術選定にも役に立つと思うのでこれらについて深掘っていくのが良さそうだと思いました。

