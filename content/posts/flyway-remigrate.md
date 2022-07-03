+++
title="flyway で一度適用した migrate をやりなおす"
date="2022-07-03T17:53:06+09:00"
categories = ["engineering"]
tags = ["flyway"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

DBのマイグレーションツールに flyway を使ってますが、一度 migrate したバージョンをやり直す方法についてメモです。

## migrate のやりなおし

flyway は DB のマイグレーションツールで、いくつか flyway でコマンドが用意されてます。

- {{< exlink href="https://flywaydb.org/" >}}


代表的なものとしては、

- migrate
- info 
- baseline
- repair

あたりになります。

一度適応したバージョンを戻したいという場合には、上記のコマンドでは対応できません。

一応 flyway の {{< exlink text="Teams edition" href="https://flywaydb.org/download/teams?ref=try-teams-edition" >}} という有料プランを利用すれば、`flyway undo` コマンドが利用できますが、無料プランには存在しません。

無料プランでもとに戻したい場合には、flyway_schema_history テーブルというマイグレーションのバージョンを管理するテーブルを直接削除する必要があります。

例えば、以下のような flyway_schema_history だったとします。
```
> SELECT * FROM flyway_schema_history

+----------------+---------+---------------------------+
| installed_rank | version | description               |
+----------------+---------+---------------------------+
|              1 | 1.0.1   | Schema version 1.0.1      |
|              2 | 1.0.2   | create tables             |
|              3 | 1.0.3   | miss migration            |
+----------------+---------+---------------------------+
```

1.0.3 の migration があやまって適用してしまったものの場合には、この 1.0.3 のレコードを削除すると再度 1.0.3 のマイグレーションから flyway を適用することができます。


```
> DELETE FROM flyway_schema_history where installed_rank = 3;
> SELECT * FROM flyway_schema_history

+----------------+---------+---------------------------+
| installed_rank | version | description               |
+----------------+---------+---------------------------+
|              1 | 1.0.1   | Schema version 1.0.1      |
|              2 | 1.0.2   | create tables             |
+----------------+---------+---------------------------+
```

この状態で、再度 `flyway info` などを実行すれば 1.0.3 の状態が、Pending になっていることが確認でき `flyway migrate` を実行すれば 1.0.3 を migrate しなおすことができます。

再実行後は以下のような flyway_schema_history になっているかと思います。

```
> SELECT * FROM flyway_schema_history

+----------------+---------+---------------------------+
| installed_rank | version | description               |
+----------------+---------+---------------------------+
|              1 | 1.0.1   | Schema version 1.0.1      |
|              2 | 1.0.2   | create tables             |
|              3 | 1.0.3   | correct migration         |
+----------------+---------+---------------------------+
```

## まとめ

今回は、flyway で 一度適用した migration をやり直す方法についてまとめました。

履歴テーブルを直接編集するので、思わぬ挙動になる可能性もあるので慎重にやるべきかなと思いますし、もし間違ってても新しいバージョンを作って修正すれば良いのあまり使う機会はないかもですが、いざという時のために知っておいてもよさそうです。

