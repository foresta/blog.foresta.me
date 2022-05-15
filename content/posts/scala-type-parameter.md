+++
title="Scala の 型パラメータによる抽象化"
date="2022-05-15T22:24:39+09:00"
categories = ["engineering"]
tags = ["scala"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala を書いていて、以下の記事をみてかなり勉強になったのでメモです。

- https://gist.github.com/takungsk/3760513

## 型パラメータを用いた関数を抽象化

最初にやりたかったこととしては、Slick を用いて自動生成あれたデータベース行に該当する Row クラスごとに共通の処理を行うことでした。

やりたかったことは、BulkUppsert で以下のようなコードです。

```scala
def bulkUpsert[ROW](rows: Seq[ROW]): SimpleDBIO[Int] = {
    val statement = generateSql(rows) // row の型によって sql 文の構築をする
    generateAction(statement, rows) // DBIO Action の生成
}
```

row の型によって処理を変えるためにどうしたらよいかを考えていた際に、上記の記事にあたりました。

上記の記事を参考にした結果以下のようなコードで実現することができそうでした。

```scala
Trait TableBulkUpsert[ROW] {
    def generateSql(rows: Seq[ROW]): String
    def generateAction(sqlStatement: String, rows: Seq[ROW]): SimpleDBIO[Int]
}

object TableBulkUpsert {
    implicit object UserTableBulkUpsert extends TableBulkUpsert[User] {
        def generateSql(rows: Seq[User]): String = { /* */ }
        def generateAction(sqlStatement: String, rows: Seq[User]): SimpleDBIO[Int] = { /* */ }
    }

    implicit object ItemTableBulkUpsert extends TableBulkUpsert[Item] {
        def generateSql(rows: Seq[Item]): String = { /* */ }
        def generateAction(sqlStatement: String, rows: Seq[Item]): SimpleDBIO[Int] = { /* */ }
    }
}

def bulkUpsert[ROW](rows: Seq[ROW])(implicit upserter: TableBulkUpsert[ROW]): SimpleDBIO[Int] = {
    val statement = upserter.generateSql(rows)
    upserter.generateAction(statement, rows)
}
```

`TableBulkUpsert` という trait を定義して、`implicit object` で、その trait を特殊化したようなイメージです。
(C++ のテンプレートの特殊化のようなイメージで理解しました)

```scala
Trait TableBulkUpsert[ROW] {
    def generateSql(rows: Seq[ROW]): String
    def generateAction(sqlStatement: String, rows: Seq[ROW]): SimpleDBIO[Int]
}

object TableBulkUpsert {
    // 型パラメータの ROW を User で特殊化
    implicit object UserTableBulkUpsert extends TableBulkUpsert[User] {
        def generateSql(rows: Seq[User]): String = { /* */ }
        def generateAction(sqlStatement: String, rows: Seq[User]): SimpleDBIO[Int] = { /* */ }
    }
}
```

以下の部分で、implict パラメータとすることで引数の `ROW` の型によって `upserter` が自動で選択されます。

```scala
def bulkUpsert[ROW](rows: Seq[ROW])(implicit upserter: TableBulkUpsert[ROW]): SimpleDBIO[Int] = {
}
```

とてもよいのが、implicit object として定義されていない ROW の型が渡されたときにちゃんとコンパイルエラーになることです。
コンパイル時にそのチェックができるのは素晴らしいなと思います。

## まとめ

今回は違う型に対して別々の処理を行う際に型パラメータを用いてどのように関数を抽象化していったらよいかをまとめました。
冒頭で紹介した下記の記事を参考にしてうまく抽象化することができたかなと思います。

- https://gist.github.com/takungsk/3760513

Scala は型周りがかなりしっかりしていて、難しいですがうまく使えばきれいなコードがかけるなと再認識しました。
