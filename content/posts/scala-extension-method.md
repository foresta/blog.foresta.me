+++
title="Scala で既存の型を拡張する"
date="2022-07-17T22:16:20+09:00"
categories = ["engineering"]
tags = ["scala", "implicit"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Scala で implicit class を用いて既存の型を拡張する方法について書きます。

Scala3 で新しく、 `extension` も追加されたので見ていきます。

## Scala 2 の場合

Scala 2 の場合、implicit class を用いて拡張することができます。

以下サンプルコードです。

架空の Item クラスと、ItemDto クラスの変換を考えて適当なバリデーション済みのリストを返したいみたいなケースです。
```scala
case class ItemDto(val name: String)
case class Item(val name: String)

object Converter {
  implicit class DtoList(dtos: Seq[ItemDto]) {
    def toValidModel(): Seq[Item] = {
      dtos.filterNot(dto => dto.name.contains("invalid"))
          .map(dto => Item(dto.name))
    }  
  }
}

val dtoList = Seq(ItemDto("Hoge"), ItemDto("Fuga invalid"), ItemDto("Piyo"))
// Seq[ItemDto] 型に toValidModel メソッドが生えてる
println(dtoList.toValidModel())
```

下記のように定義することで、Seq (ItemDto) 型に `toValidModel()` のメソッドを拡張することができます。

```scala
  implicit class DtoList(dtos: Seq[ItemDto]) {
    def toValidModel(): Seq[Item] = {
      dtos.filterNot(dto => dto.name.contains("invalid"))
          .map(dto => Item(dto.name))
    }  
  }
```

## Scala 3 の場合


Scala 3 で新しく、`extension` キーワードが追加され上記と同じ処理を以下のように書くことができるようになりました。

```scala
case class ItemDto(val name: String)
case class Item(val name: String)

// Scala3 で導入された extension 構文
extension (dtos: Seq[ItemDto])
    def toValidModel(): Seq[Item] = {
      dtos.filterNot(dto => dto.name.contains("invalid"))
          .map(dto => Item(dto.name))
    }  

val dtoList = Seq(ItemDto("Hoge"), ItemDto("Fuga invalid"), ItemDto("Piyo"))
println(dtoList.toValidModel())
```

Scala2 の implicit で定義するのに比べて非常にシンプルに書けるようになっていますね。

## まとめ

Scala で既存の型にメソッドを生やすような拡張をする方法についてまとめました。

型の拡張はやりすぎると何が何だかよくわからなくなりがちですが、用法容量を守って使えば非常に強力な機能です。
ほかの言語でも似たような機能があったため Scala でもあるか調べたところ簡単に記述することができ、特に Scala3 だと完結にかけて便利そうだなと思いました。
