+++
title="MySQL の index hints について"
date="2022-11-20T05:46:45+09:00"
categories = ["engineering"]
tags = ["msqyl", "index"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

MySQLのクエリチューニングの一環で、うまく index が聞かずにパフォーマンスが出なかったときに index hints 構文を使用したのでメモです。

## index hints 構文

通常のクエリであれば、MySQL のオプティマイザで適切な index が選択され利用されますが、インデックスを選択する方法についてクエリでオプティマイザに提供することができます。

{{< exlink href="https://dev.mysql.com/doc/refman/5.6/ja/index-hints.html" text="MySQL の公式サイト">}} によると、以下のような構文でオプティマイザにインデックスの情報を提供することができます。

```
tbl_name [[AS] alias] [index_hint_list]

index_hint_list:
    index_hint [, index_hint] ...

index_hint:
    USE {INDEX|KEY}
      [FOR {JOIN|ORDER BY|GROUP BY}] ([index_list])
  | IGNORE {INDEX|KEY}
      [FOR {JOIN|ORDER BY|GROUP BY}] (index_list)
  | FORCE {INDEX|KEY}
      [FOR {JOIN|ORDER BY|GROUP BY}] (index_list)

index_list:
    index_name [, index_name] ...
```


そもそも使おうとしたきっかけとしては、データ量の多いテーブルに対して SELECT を投げた時にクエリが遅く返ってこない問題が起きた時の調査でした。

調査の過程で explain で実行計画を見たときに、想定していたのと違う index が使用されていたため使用する index をオプティマイザに伝えることで改善しました。

インデックスを指定するためには、`USE INDEX` や、`FORCE INDEX` を利用します。

```sql
-- idx_category という index を指定
SELECT * FROM item USER INDEX (idx_category) WHERE category = "hoge"

-- PRIMARY key を 指定
SELECT * FROM item FORCE INDEX (PRIMARY) WHERE category = "hoge"
```

`USE INDEX` と `FORCE INDEX` の違いですが、`USE INDEX` は推奨するだけなのに対し、`FORCE INDEX` はフルスキャンが重いことを知らせたうえで、フルスキャンを回避するためにインデックスを使用するように強制します。

`USE INDEX` では、インデックススキャンよりテーブルフルスキャンのほうが早いとオプティマイザが判断すればインデックスを使用しませんが、`FORCE INDEX` は指定した index を使用してテーブル内の行を検索する方法がない場合以外はインデックスが利用されます。

利用したい index が明確に決まっているときは、FORCE INDEX を利用すると良いのかなと思います。

## まとめ

今回は、MySQL の index hints を使用してクエリの改善をしました。

普段から頻繁に使用するようなものではなさそうですが、クエリのチューニングをする際に頭の片隅はいっていると助かることがありそうなのでメモを残しておきます。
