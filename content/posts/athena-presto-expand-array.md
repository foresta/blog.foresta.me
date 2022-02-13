+++
title="Athena (Presto) で配列を行に展開する CROSS JOIN UNNEST"
date="2022-02-13T13:12:33+09:00"
categories = ["engineering"]
tags = ["athena", "presto", "sql", "array"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Presto で 配列として入っているデータを行に展開する方法をまとめます。

## 対象のデータ

以下のようなデータを

| type | values |
| --- | --- |
| A | { 1,2,3 } |
| B | { 2,4,6 } |
| C | { 1,3,5} |

以下のように行に展開したいときに、使用するクエリをまとめていきます。

| type | values |
| --- | --- |
| A | 1 |
| A | 2 |
| A | 3 |
| B | 2 |
| B | 4 |
| B | 6 |
| C | 1 |
| C | 3 |
| C | 5 |

## CROSS JOIN と UNNEST


以下のようなクエリで上記のように展開することができます。


```sql
WITH
-- データ準備
dataset AS (
    SELECT *
    FROM (
        VALUES
            ('A', ARRAY [1,2,3]),
            ('B', ARRAY [2,4,6]),
            ('C', ARRAY [1,3,5]),
    ) as t(id, list)
)
-- 展開するクエリ
SELECT
    id, value
FROM dataset
CROSS JOIN UNNEST(list) AS t(value)
```

配列になっている `list` を `UNNEST` して、`CROSS JOIN` で全結合しています。

以下のようなイメージになると思います。
```
A と [1,2,3] の CROSS JOIN
B と [2,4,6] の CROSS JOIN
C と [1,3,5] の CROSS JOIN
```

CROSS JOIN は、テーブル同士を全結合するもの (全ての組み合わせパターンで結合) なので、期待する動作が得られます。

## まとめ

今回は、Presto で、CROSS JOIN UNNEST を用いて、配列で入っているデータを行に展開する方法について書きました。
地味に使用する頻度が高いので CROSS JOIN UNNEST 使うんだったなーくらいは覚えておこうと思います。
