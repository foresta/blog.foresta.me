+++
title="Rustのライフタイムについて"
date="2020-02-23T18:45:51+09:00"
categories = ["engineering"]
tags = ["rust", "lifetime"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は Rust のライフタイムについてまとめます。

## 所有権規則とライフタイム

[前回の記事](/posts/rust_ownership) でも紹介したように、以下のコードはコンパイルエラーになります。

```rust
#[derive(Debug)]
struct Foo {
    x: i32,
}

fn main() {

    let y: &mut Foo;

    {
        let mut x = Foo { x: 1 };
        y = &mut x;

        // x のライフタイムここまで
    }

    println!("Hello, world! y: {:?}", y);

    // y のライフタイムここまで
}
```

y のライフタイムが main 関数のスコープ内なのに対して、x のライフタイムが内側のブロック内のため、値が参照よりライフタイムが短いためコンパイルエラーとなります。

## ライフタイムの指定

次に以下のような MyInt という構造体を考えます。

```rust
struct MyInt {
    value: i64
}

impl MyInt {
    fn min(&self, n: &i64) -> &i64 {
        if n > &self.value { &self.value } else { n }
    }
}
```

上記の min 関数では、MyInt の値と引数の小さい方の数値の参照を返します。

これを以下のように実行すると 1 が返ってくることを期待しますが、これはコンパイルエラーとなります。

```rust
fn main() {
    let my_int = MyInt { value: 3 };
    let n = 1;
    println!("min: {:?}", my_int.min(&n));
}
```

```
error[E0623]: lifetime mismatch
  --> src/main.rs:11:13
   |
7  |     fn min(&self, n: &i64) -> &i64 {
   |                      ----     ----
   |                      |
   |                      this parameter and the return type are declared with different lifetimes...
...
11 |             n
   |             ^ ...but data from `n` is returned here
```

エラーメッセージによると、MyInt の value と min 引数の値のライフタイムが異なるということになります。
min 関数は ライフタイム指定子が省略されており、省略せずに書くと以下のようになります。

```rust
impl MyInt {
    fn min<'a, 'b>(&'a self, n: &'b i64) -> &'a i64 {
        if a > &self.value { &self.value } else { n }
    }
}
```

MyInt 自体のライフタイムが `'a` (self.value も同様)、引数 n のライフタイムが `'b` となり、min 関数の返り値の `self.value` と n のライフタイムが違うためにコンパイルエラーとなります。これを回避するためには明示的に同じライフタイムを指定することになります。

```rust
impl MyInt {
    fn min<'a>(&'a self, n: &'a i64) -> &'a i64 {
        if n > &self.value { &self.value } else { n }
    }
}
```

このようにすると、コンパイルが通り無事実行することができます。

```rust
min: 1
```

## static ライフタイム

特殊なライフタイムとして、プログラムの実行から終了時まで続くものとして、`static ライフタイム` があります。

以下のように、`'static` として明示することができます。

```rust
fn method<T: 'static>(_x: T) {
}
```

## まとめ

今回は、Rust のライフタイムについてまとめました。借用と合わせて Rust のメモリ安全性を担保する重要な概念なのでしっかり理解したいなと思いました。
