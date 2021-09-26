+++
title="Scala入門 その1 基本型とリテラル"
date="2021-09-26T21:23:03+09:00"
categories = ["engineering"]
tags = ["scala"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala 入門したので、メモを残します。今回は、基本型とリテラルについて書きます。

手元の環境は、Scala 3.0.2 の REPL になります。

## 基本型とリテラル

Scalaの基本型は以下の通り

- Byte: 8 bit 符号付き整数
- Short 16 bit 符号付き整数
- Int: 32 bit 符号付き整数
- Long: 64 bit 符号付き整数
- Char: 16 bit 符号なし Unicode 文字
- String: Char のシーケンス
- Float: 32 bit IEEE 754 単精度浮動小数点
    - 符号: 1 bit
    - 指数部: 8 bit
    - 仮数部: 23 bit
- Double: 64 bit IEEE 764 倍精度浮動小数点
    - 符号: 1 bit
    - 指数部: 11 bit
    - 仮数部: 52 bit
- Boolean: true or false

### 整数リテラル

整数リテラルは、基本的には Int 型になります。

```scala
scala> val x = 5
val x: Int = 5
```

Long 型にしたい場合は、末尾に L もしくは l をつけます。


```scala
scala> val x = 5L
val x: Long = 5

scala> val x = 5l
val x: Long = 5
```

Byte 型や、Short 型にする場合は、変数に型を明示するようにします。

```scala
scala> val x: Byte = 10
val x: Byte = 10

scala> val x: Short = 100
val x: Short = 100
```

Int 型で表現できない大きさの数値を入力しようとするとエラーになります。

```scala
scala> val x = 2147483648
-- Error:
1 |val x = 2147483648
  |        ^^^^^^^^^^
  |        number too large

# L をつければ大丈夫
scala> val x = 2147483648L
val x: Long = 2147483648
```

区切りに、`_` が使用できます。

```scala
scala> val x = 1_000_000
val x: Int = 1000000

# _ はいくつでも大丈夫みたい
scala> val x = 1___000_000
val x: Int = 1000000
```

整数型の表現として、16進数もあります。(8進数や2進数などはなさそうです)

```scala
scala> val x = 0x100
val x: Int = 256

# Long も一緒
scala> val x = 0x100L
val x: Long = 256
```

### 浮動小数点リテラル

浮動小数点は、小数点や `e` などをつけると表せます。

```scala
scala> val x = 0.1234
val x: Double = 0.1234

scala> val x = 0.1234e2
val x: Double = 12.34
```

デフォルトでは、Double 型のようです。

2番目の `0.1234e2` 表記は、`0.1234 x 10 ^ 2` を表していて、指数部と仮数部を指定できる表記になります。

Float 型 (単精度) を表現するためには、`F` もしくは `f` を末尾につけます。

```scala
scala> val x = 0.1234f
val x: Float = 0.1234

scala> val x = 0.1234e2
val x: Float = 12.34
```

Double 型を明示的に指定したい場合は、末尾に、`d` もしくは `D` を指定すれば良い。

### 文字・文字列リテラル

文字を表すには `'` で囲います。文字や unicode のコードポイントが使用できます。

```scala
scala> val x = 'A'
val x: Char = A

scala> val x = '\u0041'
val x: Char = A
```

特殊文字は他の言語と同様以下のような感じ。

```scala
scala> val x = '\n'
val x: Char = 


scala> val x = '\t'
val x: Char = 
```

エスケープも同様バックスラッシュで行う。

```scala
scala> val x = '\\'
val x: Char = \
```

文字列は、ダブルクォート `"` で囲う。

```scala
scala> val x = "Hello"
val x: String = Hello
```

ダブルクォート3つで `"""` ヒアドキュメント (raw string) が表せる。

```scala
scala> val x = """
     | Hello
     |    World
     | """
val x: String = "
Hello
   World
"
```

冒頭のスペースを無視するためには、先頭にパイプ ( `|` ) を入れ、stripMargin メソッドを呼ぶ

```scala
scala> val x = """|Hello
     |       |World
     | """.stripMargin
val x: String = "Hello
World
"
```

### シンボルリテラル

任意の英数字を識別子として定義できます。

以前は、`'hoge` のような形でかけたみたいですが、Scala 3 では Error になるので、`Symbol("hoge")` といった形で書きます

```scala
scala> val = 'hoge

-- Error:
1 |val x = 'hoge
  |        ^
  |symbol literal 'hoge is no longer supported,
  |use a string literal "hoge" or an application Symbol("hoge") instead,
  |or enclose in braces '{hoge} if you want a quoted expression.
  |For now, you can also `import language.deprecated.symbolLiterals` to accept
  |the idiom, but this possibility might no longer be available in the future.

scala> val = Symbol("hoge")
val x: Symbol = Symbol(hoge)
```

## まとめ

今回は、Scala の基本型とリテラルについてまとめました。
ほとんど他の言語と同じような内容ですが、例えば整数リテラルの 2 進数や 8 進数がないなど、多少の違いがありそうです。

こういった基礎的なところはコードを書いてくうちに慣れると思いますが、一度さらっと見ておくと後々楽になりそうです。
