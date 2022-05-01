+++
title="Scala で Duck Typing を使ってコードを共通化する"
date="2022-05-01T19:27:21+09:00"
categories = ["engineering"]
tags = ["scala"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Scala で Duck Typing 用いて重複したコードを共通化していく方法についてまとめます。

## 解決したかった問題

Scala と Slick を使ったアプリケーションを開発していて、以下のように別テーブルから同じキーをもとに DB から並列で取得したいという要件がありました。

名前などは適当ですが NormalItem, OrderItem, StockItem という itemId をもつテーブルがいくつかあるようなイメージです。

```scala

// Tables.xxxx は自動生成されたクラス
val normalItemTable = TableQuery[Tables.NormalItem]
val orderItemTable  = TableQuery[Tables.OrderItem]
val stockItemTable  = TableQuery[Tables.StockItem]

def selectNormalItemByItemIds(itemIds: Seq[Int]) = {
  db.run(normalItemTable.filter(_.itemId inSetBind itemIds).result)
}

def selectOrderItemByItemIds(itemIds: Seq[Int]) = {
  db.run(orderItemTable.filter(_.itemId inSetBind itemIds).result)  
}

def selectStockItemByItemIds(itemIds: Seq[Int]) = {
  db.run(stockItemTable.filter(_.itemId inSetBind itemIds).result)
}
```

こういったときに、ほとんど同じ処理なのにおおもとのテーブルが違うために別メソッドになってしまうのは微妙です。

一応各種テーブルは、AbstractTable を継承しているため、共通化できそうですが、itemId を持っているという共通のインターフェースは定義されていないため、上記のメソッドを共通化するのは難しいです。

## Duck Typing を使う

Duck Typing を使えば、itemId を持つテーブルクラスというもので共通化できそうです。

```scala
// Tables.xxxx は自動生成されたクラス
val normalItemTable = TableQuery[Tables.NormalItem]
val orderItemTable  = TableQuery[Tables.OrderItem]
val stockItemTable  = TableQuery[Tables.StockItem]

// itemId を持つ型を定義 (duck typing)
type SelectableByItemIds = { val itemId: Rep[Int] }
// itemId を持つ型 かつ AbstractTable のサブクラスという型を制約
def selectByItemIds[T <: SelectableByItemIds with AbstractTable[_]](
    itemIds: Seq[Int], 
    table: TableQuery[T]
) = {
  db.run(table.filter(_.itemId inSetBind itemIds).result)
}

selectByItemIds(itemIds, normalItemTable)
selectByItemIds(itemIds, orderItemTable)
selectByItemIds(itemIds, stockItemTable)
```

重要ような部分は以下の部分です。

```
type SelectableByItemIds = { val itemId: Rep[Int] }
def selectByItemIds[T <: SelectableByItemIds with AbstractTable[_]](
    itemIds: Seq[Int], 
    table: TableQuery[T]
) = { /* ... */ }
```

以下のように、型パラメータの T の upper bound に、itemId を持つ型というのを定義できます。

つまり itemId を持つ型という定義が可能になります。
```
def method[T <: { val itemId: Rep[Int]}]() = {}
```
upper bound は型の上限の制約をかけていて、itemId を持つクラスのみという制約になります。

その前の例で、type で 型名を指定しているのは、複数の型の複合型として定義するためです。
複合型は、with で定義しているのですが、以下のように直接書くと compile エラーになったため別名を定義しました。

```scala
// ↓はエラーになる
def selectByItemIds[T <: { val itemId: Rep[Int] } with AbstractTable[_]](
    itemIds: Seq[Int], 
    table: TableQuery[T]
) = { /* ... */ }
```

## まとめ

今回は、Scala で Duck Typing をしてコードを共通化する方法についてまとめました。
静的に型を定義できてかつ Duck Typing で柔軟に扱えるのはかなりコード書きやすいなと感じました。

型をうまく定義すると、共通化もできてコードもきれいになると思うのでこのあたりの機能はどんどん活用していきたいと思います。


