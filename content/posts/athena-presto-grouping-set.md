+++
title="Athena (Presto) で GROUPING SETS を使用する"
date="2022-01-30T00:59:22+09:00"
categories = ["engineering"]
tags = ["athena", "presto", "sql", "group"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Athena でデータを分析する際に、GROUPING SETS を用いてスッキリとクエリがかけたのでまとめます。

- {{< exlink href="https://prestodb.io/docs/current/sql/select.html#group-by-clause" text="Presto 0.268 Documentation" >}}

## 対象のデータとやりたい集計

今回は以下のような生徒の成績データ (5段階評価) のようなものを仮定します。

| 生徒 | 国語 | 数学 | 社会 | 理科 | 英語 |
| --- | --- | --- | --- | --- | --- |
| A | 5 | 3 | 4 | 2 | 2 |
| B | 2 | 1 | 3 | 2 | 4 |
| C | 2 | 4 | 2 | 4 | 3 |
| D | 4 | 4 | 3 | 1 | 3 |
| E | 3 | 2 | 5 | 1 | 5 |

このデータから以下のように各教科の各成績人数を集計したいものとします。

国語は、1 が 0 人、2 が 2 人、3 が 1 人、4 が 1 人、5 が 1 人 といった具合です。

| 成績 | 国語 | 数学 | 社会 | 理科 | 英語 |
| --- | --- | --- | --- | --- | --- |
|    1 |    0 |    1 |    0 |    2 |    0 |
|    2 |    2 |    1 |    1 |    2 |    1 |
|    3 |    1 |    1 |    2 |    0 |    2 |
|    4 |    1 |    2 |    1 |    1 |    1 |
|    5 |    1 |    0 |    1 |    0 |    1 |

## GROUPING SETS を用いて各教科ごとに集計

GROUPING SETS を用いると、複数のフィールドでそれぞれ グルーピングすることができます。

```sql
SELECT
    "国語",
    "数学",
    "社会",
    "理科",
    "英語",
    count(*) as cnt
FROM score
GROUP BY
    GROUPING SETS (
        ("国語"),
        ("数学"),
        ("社会"),
        ("理科"),
        ("英語")
    )
```

これを集計すると以下のような表になります。

| 国語 | 数学 | 社会 | 理科 | 英語 | cnt |
| --- | --- | --- | --- | --- | --- |
| 2 | null | null | null | null | 2
| 3 | null | null | null | null | 1 
| 4 | null | null | null | null | 1
| 5 | null | null | null | null | 5
| null | 1 | null | null | null | 1
| null | 2 | null | null | null | 1
| null | 3 | null | null | null | 1
| null | 4 | null | null | null | 2
| null | null | 2 | null | null | 1
| null | null | 3 | null | null | 2
| null | null | 4 | null | null | 1
| null | null | 5 | null | null | 1
| null | null | null | 1 | null | 2
| null | null | null | 2 | null | 2
| null | null | null | null | 2 | 1
| null | null | null | null | 3 | 2
| null | null | null | null | 4 | 1
| null | null | null | null | 5 | 1

全てのフィールドそれぞれで、group by をしたような結果になります。

あとはこのテーブルを、集計してまとめます。まとめる単位は、成績の 1 ~ 5 ごとの値で良いので国語 + 数学 + 社会 + 理科 + 英語 の各フィールドの値を足試合わせた値にします。該当する科目以外は null になっているのでそれを 0 として扱えば成績の点数ごとの集計になります。

```sql
with
grouping_table as (
    SELECT
        "国語", "数学", "社会", "理科", "英語",
        count(*) as cnt
    FROM score
    GROUP BY
        GROUPING SETS (
            ("国語"), ("数学"), ("社会"), ("理科"), ("英語")
        )
)
SELECT
    COALESCE("国語", 0)  + COALESCE("数学", 0) + COALESCE("社会", 0) + COALESCE("理科", 0) + COALESCE("英語", 0) as score,
    SUM(CASE WHEN "国語" is not null THEN cnt ELSE 0 END) as "国語人数",
    SUM(CASE WHEN "数学" is not null THEN cnt ELSE 0 END) as "数学人数",
    SUM(CASE WHEN "社会" is not null THEN cnt ELSE 0 END) as "社会人数",
    SUM(CASE WHEN "理科" is not null THEN cnt ELSE 0 END) as "理科人数",
    SUM(CASE WHEN "英語" is not null THEN cnt ELSE 0 END) as "英語人数",
FROM grouping_table
GROUP BY 
    COALESCE("国語", 0)  + COALESCE("数学", 0) + COALESCE("社会", 0) + COALESCE("理科", 0) + COALESCE("英語", 0)
```

わかりにくいですが、以下が 1 ~ 5 までのスコアと等価になります。
```
    COALESCE("国語", 0)  + COALESCE("数学", 0) + COALESCE("社会", 0) + COALESCE("理科", 0) + COALESCE("英語", 0)
```

そしてスコアごとに GORUP BY します。

例えば、スコア 2 を集計するときは以下の行が対象になります。

| 国語 | 数学 | 社会 | 理科 | 英語 | cnt |
| --- | --- | --- | --- | --- | --- |
| 2 | null | null | null | null | 2
| null | 2 | null | null | null | 1
| null | null | 2 | null | null | 1
| null | null | null | 2 | null | 2
| null | null | null | null | 2 | 1

これを以下のように SUM で 1行に潰しています。

```sql
SELECT 
    SUM(CASE WHEN "国語" is not null THEN cnt ELSE 0 END) as "国語人数",
    SUM(CASE WHEN "数学" is not null THEN cnt ELSE 0 END) as "数学人数",
    SUM(CASE WHEN "社会" is not null THEN cnt ELSE 0 END) as "社会人数",
    SUM(CASE WHEN "理科" is not null THEN cnt ELSE 0 END) as "理科人数",
    SUM(CASE WHEN "英語" is not null THEN cnt ELSE 0 END) as "英語人数",
FROM
    ...
```

| 国語 | 数学 | 社会 | 理科 | 英語 |
| --- | --- | --- | --- | --- |
| 2 | 1 | 1 | 2 | 1 |

GROUPING SETS を使わない場合は、スコア 1 のとき、2 のとき、 ... と各スコアごとにまとめて UNION ALL で行を繋げることになるかと思います。

自分が扱っていた、1000 万件以上あるテーブルでは、UNION ALL は Timeout になったり、`Query exhausted resources at this scale factor` エラーになったりしていて実行できなかったのですが、上記の GROUPING SETS では、20 秒ほどで結果が表示されました。

## まとめ

今回は、Athena Presto で GROUPING SETS を用いて複数列を同時に GROUP BY する方法を具体例を交えてまとめました。

特に大きなテーブルを分析する場合などは、UNION ALL などを多用するとメモリが足りなくなったりするため効率の良いクエリをかくことが求められますが、そんな時に今回紹介した GROUPING SETS が役に立つケースもありそうです。
