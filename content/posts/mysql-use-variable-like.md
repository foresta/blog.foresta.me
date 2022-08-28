+++
title="MySQL で LIKE 句に変数を使う"
date="2022-08-28T20:30:38+09:00"
categories = ["engineering"]
tags = ["mysql", "like", "tips"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

MySQL で変数を活用することができますが、LIKE に指定するときにちょっと工夫が必要だったのでメモです。

## LIKE 句に変数を使う


mysql では、SET 構文を使って変数を定義できます。

```sql
SET @WORD = 'test';
```

以下のような LIKE 句に、変数を使用したいケースですがよくあるプログラミング言語のように文字列の中での変数展開などが MySQL では行われなさそうなため工夫が必要です。

```sql
SET @WORD = 'test';

SELECT *
FROM users
WHERE profile LIKE '%@WORD%';
```

上記はユーザーのプロフィール文から特定の文字列を含むユーザーを抽出するというようなサンプルのクエリになります。

以下の部分で、変数展開などが行われないためクォートのなかに変数を書く方式では期待した結果は得られません。

```sql
WHERE profile LIKE '%@WORD%'; -- 変数展開されないので意図した結果にならない
```

LIKE 句で使うためには、CONCAT で変数をつなぐ必要があります。

```sql
SET @WORD = 'test';

SELECT *
FROM users
WHERE profile LIKE CONCAT('%', @WORD, '%');
```

## まとめ

今回は、MySQL のちょっとした Tips として、変数を LIKE 句で使う方法をまとめました。

普段の業務では、Presto (Athena) や MySQL など異なる種類の SQL を書くこともありこのようなちょっとした構文の書き方度忘れすることが多いので忘れ手もよいようにメモしておきます。
