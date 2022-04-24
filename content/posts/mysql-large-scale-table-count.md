+++
title="MySQL の information_schema を使用して大きなテーブルの行数を調べる"
date="2022-04-24T18:55:29+09:00"
categories = ["engineering"]
tags = ["mysql"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、MySQL で行数の大きいテーブルの行数を知りたい場合の Tips をまとめます。

## count は巨大なテーブルには厳しい

通常、MySQL でテーブルの行数をいらべるには、`count` を使えばよいです。

```sql
SELECt count(*) FROM table_name
```

ただし、テーブルの行数が多い場合には上記のクエリは基本的には返ってきません。

業務で 1億レコード近いデータを扱うのですが、そういったテーブルでは `count` を用いた合計件数の取得は厳しいです。

## information_schema を見る

そこで、information_schema テーブルを見る方法があります。

具体的には以下のようなクエリでテーブルの行数を調べることができます。

```sql
SELECT TABLE_SCHEMA, TABLE_NAME, TABLE_ROWS 
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'target_db';
```

information_schema の中の `TABLES` テーブルに、各種テーブルの情報が入っています。

その中の、TABLE_ROWS テーブルに概算の行数が入っているのでそれが参考になります。

ただし、公式サイトに以下のような記載があるとおり、

> ・TABLE_ROWS
>
> The number of rows. Some storage engines, such as MyISAM, store the exact count. For other storage engines, such as InnoDB, this value is an approximation, and may vary from the actual value by as much as 40% to 50%. In such cases, use SELECT COUNT(*) to obtain an accurate count.
>
> TABLE_ROWS is NULL for INFORMATION_SCHEMA tables.
>
> For InnoDB tables, the row count is only a rough estimate used in SQL optimization. (This is also true if the InnoDB table is partitioned.)

InnoDB では、概算値となり、最大で 40 ~ 50 % 程異なる場合もあるそうです。本当に正確な値が知りたい際には `SELECT COUNT(*)` を使用する必要があります。


## まとめ

今回は information_schema の TABLES を見て、テーブルの行数の概算を見る方法をまとめました。正確な行数を知りたい場合には使えませんが概算値として見る場合にはこの方法が役に立ちそうです。


参考:

- {{< exlink href="https://dev.mysql.com/doc/refman/8.0/en/information-schema-tables-table.html" >}} 

