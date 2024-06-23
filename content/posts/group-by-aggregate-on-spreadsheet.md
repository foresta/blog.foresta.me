+++
title="スプレッドシートで Group By のような集計を行う"
date="2024-06-23T22:49:39+09:00"
categories = ["engineering"]
tags = ["spreadsheet"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

スプレッドシート上でサクッと集計したいケースに使えるちょっとした Tips を紹介します。

## 対象のテーブル

以下のような従業員と、部署と売上のカラムを持つようなテーブルを考えます。

| employee_id | employee_name | department | sales |
|-------------|---------------|------------|-------|
| 1           | Alice         | Sales      | 5000  |
| 2           | Bob           | Sales      | 3000  |
| 3           | Charlie       | Marketing  | 2000  |
| 4           | David         | Sales      | 4000  |
| 5           | Eve           | Marketing  | 3500  |
| 6           | Frank         | IT         | 2800  |
| 7           | Grace         | IT         | 3200  |
| 8           | Henry         | Marketing  | 1500  |


{{< figure src="/images/posts/group-by-aggregate-on-spreadsheet/table.png" >}}

## UNIQUE と SUMIF で集計する

まずは集計するキーを `UNIQUE` 関数で生成します。

- {{< exlink href="https://support.google.com/docs/answer/10522653?hl=ja" text="UNIQUE 関数 - Google ドキュメント エディタ ヘルプ">}}

{{< figure src="/images/posts/group-by-aggregate-on-spreadsheet/unique.png" >}}

UNIQUE にC列の department の範囲を指定すると以下のように重複が排除されたリストが生成できます。

{{< figure src="/images/posts/group-by-aggregate-on-spreadsheet/unique-results.png" >}}

このリストができたら、あとはそのキーによって、`SUMIF` を使い集計します。


- {{< exlink href="https://support.google.com/docs/answer/3093583?hl=ja" text="SUMIF - Google ドキュメント エディタ ヘルプ">}}

```
=SUMIF(条件範囲, 条件, [合計範囲])
```

{{< figure src="/images/posts/group-by-aggregate-on-spreadsheet/sumif.png" >}}

以下のように売上を sum したデータが取得できます。

{{< figure src="/images/posts/group-by-aggregate-on-spreadsheet/sumif-results.png" >}}

## 複数の集計軸

Group By のキーとなる集計軸が複数になったときも同様に集計できます。

まず、UNIQUE にわたす範囲を 2 列にするとその２列で UNIQUE な値を生成できます。

```
=UNIQUE(B2:C9)
```

{{< figure src="/images/posts/group-by-aggregate-on-spreadsheet/multi-unique-results.png" >}}

複数条件で SUM するためには、`SUMIFS` 関数を使います。

- {{< exlink href="https://support.google.com/docs/answer/3238496?hl=ja" text="SUMIFS 関数 - Google ドキュメント エディタ ヘルプ" >}}

```
SUMIFS(合計範囲, 条件範囲1, 条件1, [条件範囲2, 条件2, ...])
```

{{< figure src="/images/posts/group-by-aggregate-on-spreadsheet/sumifs-results.png" >}}

## まとめ

今回は、スプレッドシートで Group By 集計したいときに活用できる、UNIQUE 関数と SUMIF, SUMIFS 関数について紹介しました。
このあたりがサクッとできると何かと便利です。スプレッドシート芸を身につけると時短などできるためおすすめです。
