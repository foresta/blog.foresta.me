+++
title="Snowflake の EXCLUDE と GROUP BY ALL について"
date="2024-07-07T22:19:10+09:00"
categories = []
tags = []
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

日頃 Snowflake を使用してますが、その中で`GROUP BY ALL` と `EXCLUDE` の機能が便利だったので紹介します。

## サンプルとなるテーブル

以下のようなオーダーテーブルのデータをサンプルとして使用します。

| order_id | customer_id | order_date | product_id | quantity | price |
|----------|-------------|------------|------------|----------|-------|
| 1        | 101         | 2024-01-01 | 501        | 2        | 10.00 |
| 2        | 102         | 2024-01-02 | 502        | 1        | 20.00 |
| 3        | 101         | 2024-01-03 | 501        | 1        | 10.00 |
| 4        | 103         | 2024-01-04 | 503        | 3        | 15.00 |
| 5        | 104         | 2024-01-05 | 504        | 5        | 25.00 |
| 6        | 101         | 2024-01-06 | 501        | 4        | 10.00 |

SQLでいうと以下のようなテーブルです。

```sql
SELECT * FROM (
    VALUES 
    (1, 101, '2024-01-01', 501, 2, 10.00),
    (2, 102, '2024-01-02', 502, 1, 20.00),
    (3, 101, '2024-01-03', 501, 1, 10.00),
    (4, 103, '2024-01-04', 503, 3, 15.00),
    (5, 104, '2024-01-05', 504, 5, 25.00),
    (6, 101, '2024-01-06', 501, 4, 10.00)
) AS sales(order_id, customer_id, order_date, product_id, quantity, price);
```

## GROUP BY ALL

GROUP BY ALL 機能を使うと以下のような形で集計クエリを書くことができます。
以下は、customer_id と product_id で集計するものです。

```sql
WITH
source_table AS (
    SELECT * FROM (
        VALUES
          (1, 101, '2024-01-01', 501, 2, 10.00),
          (2, 102, '2024-01-02', 502, 1, 20.00),
          (3, 101, '2024-01-03', 501, 1, 10.00),
          (4, 103, '2024-01-04', 503, 3, 15.00),
          (5, 104, '2024-01-05', 504, 5, 25.00),
          (6, 101, '2024-01-06', 501, 4, 10.00)
    ) AS sales(order_id, customer_id, order_date, product_id, quantity, price)
)
SELECT
     customer_id,
     product_id,
     sum(quantity),
     avg(price)
FROM source_table
GROUP BY ALL
```

ALL を指定すると、sum や avg などの集計クエリ以外を GROUP BY の集計のキーにすることができます。

ためしに以下のように書くとすべてのカラムが集計のキーとなります。

```sql
WITH
source_table AS (
    SELECT * FROM (
        VALUES
          (1, 101, '2024-01-01', 501, 2, 10.00),
          (2, 102, '2024-01-02', 502, 1, 20.00),
          (3, 101, '2024-01-03', 501, 1, 10.00),
          (4, 103, '2024-01-04', 503, 3, 15.00),
          (5, 104, '2024-01-05', 504, 5, 25.00),
          (6, 101, '2024-01-06', 501, 4, 10.00)
    ) AS sales(order_id, customer_id, order_date, product_id, quantity, price)
)
SELECT
    *
FROM source_table
GROUP BY ALL
```

## EXCLUDE

`EXCLUDE` を使うと、`*` で指定したフィールドから特定のものを除外することができます。

```sql
WITH
source_table AS (
    SELECT * FROM (
        VALUES
          (1, 101, '2024-01-01', 501, 2, 10.00),
          (2, 102, '2024-01-02', 502, 1, 20.00),
          (3, 101, '2024-01-03', 501, 1, 10.00),
          (4, 103, '2024-01-04', 503, 3, 15.00),
          (5, 104, '2024-01-05', 504, 5, 25.00),
          (6, 101, '2024-01-06', 501, 4, 10.00)
    ) AS sales(order_id, customer_id, order_date, product_id, quantity, price)
)
SELECT
    * EXCLUDE (order_id, order_date, product_id)
FROM source_table
```

| customer_id | quantity | price |
|-------------|----------|-------|
| 101         | 2        | 10.00 |
| 102         | 1        | 20.00 |
| 101         | 1        | 10.00 |
| 103         | 3        | 15.00 |
| 104         | 5        | 25.00 |
| 101         | 4        | 10.00 |


これを GROUP BY ALL といっしょに利用すると、以下のような集計クエリを書くことができます。

```sql
WITH
source_table AS (
    SELECT * FROM (
        VALUES
          (1, 101, '2024-01-01', 501, 2, 10.00),
          (2, 102, '2024-01-02', 502, 1, 20.00),
          (3, 101, '2024-01-03', 501, 1, 10.00),
          (4, 103, '2024-01-04', 503, 3, 15.00),
          (5, 104, '2024-01-05', 504, 5, 25.00),
          (6, 101, '2024-01-06', 501, 4, 10.00)
    ) AS sales(order_id, customer_id, order_date, product_id, quantity, price)
)
SELECT
    * EXCLUDE (order_id, order_date, product_id, quantity, price)
    , SUM(quantity)
    , AVG(price)
FROM source_table
GROUP BY ALL
```

普通の使い方ではあまり使われなさそうな構文ですが、これらを使うと、dbt のマクロ機能を用いてある程度集計クエリが共通のマクロにまとめたりといったことに使えるのではないかと思っています。

## まとめ

今回は、Snowflake の GROUP BY ALL と、EXCLUDE の構文について簡単に紹介しました。
Snowflake 使ってて最近まで存在に気づかなかった構文なのですが、利用してみると便利なので使っていこうと思います。
ただし、通常のユースケースでは集計キーや取得するカラムを明示的に列挙したほうが可読性が高まると考えているので、マクロ化などそういった場面に使う機会は絞って使っていこうと思います。

### 参考
- {{< exlink href="https://docs.snowflake.com/ja/sql-reference/constructs/group-by" >}}
- {{< exlink href="https://docs.snowflake.com/ja/sql-reference/sql/select" >}}
