+++
title="Rustの所有権について"
date="2020-02-16T12:18:41+09:00"
categories = ["engineering"]
tags = ["rust", "ownership"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は Rust の所有権について自分の理解をまとめていきます。

## 所有権とは

Rust では、値の所有者はただ１つの変数になります。例えば以下のようなコードでは変数 `x` が `Foo` 型の値 の所有権を得ていることになります。

```rust
#[derive(Debug)]
struct Foo {
    x: i32,
}

fn main() {

    let x = Foo { x: 1 };

    println!("Hello, world! {:?}", x);
}
```

この `x` を、他の変数 `y` に代入してみます。

```rust
#[derive(Debug)]
struct Foo {
    x: i32,
}

fn main() {

    let x = Foo { x: 1 };
    let _y = x;

    println!("Hello, world! {:?}", x);
}
```

上記をビルドしてみると以下のようなコンパイルエラーになります。

```
error[E0382]: borrow of moved value: `x`
  --> src/main.rs:11:36
   |
8  |     let x = Foo { x: 1 };
   |         - move occurs because `x` has type `Foo`, which does not implement the `Copy` trait
9  |     let _y = x;
   |              - value moved here
10 |
11 |     println!("Hello, world! {:?}", x);
   |                                    ^ value borrowed here after move<Paste>
```

所有権が移動された、x の値を `println!` マクロで `借用` しようとしてエラーになっている旨がエラーメッセージから読み取れます。

以下の行で、値 `Foo { x: 1 }` の所有権が、`x` から `_y` へうつっているため、`x` は値が初期化されていない状態になります。

```rust
	let _y = x;
```

これを回避するために、`Copy Trait` と `借用` という概念があります。

## Copy Trait

ところで、前回の例はコンパイルエラーになりましたが、以下のコードはコンパイルが通り正しく実行されます。

```rust
fn main() {

    let x: i32 = 1;
    let _y = x;

    println!("Hello, world! {:?}", x);
}
```

これは、i32 型が Copy Trait を実装しているためです。Copy Trait を実装された型の値が代入されるときにはコピーする動作になります。所有権を写す方は `ムーブセマンティクス` とよばれ、値を複製する方は`コピーセマンティクス` とよばれます。

なので、以下のように Foo 型に Copy Trait を実装すると正常に実行することができます。

```rust
#[derive(Debug)]
struct Foo {
    x: i32,
}

impl Copy for Foo {}

impl Clone for Foo {
    fn clone(&self) -> Foo {
        *self
    }
}

fn main() {

    let x = Foo { x: 1 };
    let _y = x; // 値がコピーされる

    println!("Hello, world! {:?}", x); // 所有権を失ってないのでアクセスできる
}
```

## 借用

コピートレイトの他に、借用という仕組みがあります。
以下のコードは借用を使ったもので、コンパイルが通り正常に実行されます。

```rust
#[derive(Debug)]
struct Foo {
    x: i32,
}

fn main() {

    let x = Foo { x: 1 };
    let y = &x; // x の値を y が借りて利用する (借用)

    println!("Hello, world! x: {:?} y: {:?}", x, y);
}
```

以下の部分で、x の値の参照を y に渡しています。

```rust
    let y = &x; // x の値を y が借りて利用する (借用)
```

このようにすることで、x は所有権を失わないまま、y に値を貸し出すことができます。

上記の方法だと、y は immutable な参照なので、値を変更することはできません。

```rust
    y.x += 2;
```

上記のコードは以下のようなコンパイルエラーが出ます。

```
error[E0594]: cannot assign to `y.x` which is behind a `&` reference
--> src/main.rs:11:5
   |
9  |     let y = &x;
   |             -- help: consider changing this to be a mutable reference: `&mut x`
10 |
11 |     y.x += 2;
   |     ^^^^^^^^ `y` is a `&` reference, so the data it refers to cannot be written
```

mutable な参照にするためには以下のようにします。

```rust
#[derive(Debug)]
struct Foo {
    x: i32,
}

fn main() {

    let mut x = Foo { x: 1 };
    let y = &mut x;

    y.x += 2;

    println!("Hello, world! y: {:?}", y);
}
```

x を mutable な変数にして、そこから mutable な参照を `let y = &mut x;` という形で取得します。

ちなみに、以下のように `println!` マクロに、 x を渡すとコンパイルエラーが出ます。

```rust
    println!("Hello, world! x: {:?}, y: {:?}", x, y);
```

```
error[E0502]: cannot borrow `x` as immutable because it is also borrowed as mutable
  --> src/main.rs:13:48
   |
9  |     let y = &mut x;
   |             ------ mutable borrow occurs here
...
13 |     println!("Hello, world! x: {:?}, y: {:?}", x, y);
   |                                                ^  - mutable borrow later used here
   |                                                |
   |                                                immutable borrow occurs here
```

`println!` マクロが x を借用しようとしてエラーになっています。
mutable な参照である y を通して x の値は変更しうるのですが、変更しうる値をさらに借用させると借用した側 (println! マクロ) 内で、x の値を参照する際に値ががどうなっているかが保証できないためコンパイルエラーになります。

この規則は、以下のような借用規則として定められています。
（上記の例は、2 番目の規則に違反しています。）

#### 借用規則

- 参照(借用)のライフタイムが値のスコープよりも短いこと
- 値が共有されている間は値の変更を許さない

1 番目の規則を破るために以下のようなコードを書けば良いです。

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
    }

    println!("Hello, world! y: {:?}", y);
}
```

```
error[E0597]: `x` does not live long enough
  --> src/main.rs:12:13
   |
12 |         y = &mut x;
   |             ^^^^^^ borrowed value does not live long enough
13 |     }
   |     - `x` dropped here while still borrowed
14 |
15 |     println!("Hello, world! y: {:?}", y);
   |                                       - borrow later used here
```

x の変数のライフタイムが内側のブロックなのに対して、借用の y のライフタイムが main 関数の内側となり、参照のライフタイムの方が長くなります。
ライフタイムの短い値を参照するということは、初期化されていなかったり、破棄された後の値を参照してしまうおそれがあるということなので、これを防ぐのが 1 番目の借用規則になります。

このように借用規則を Rust コンパイラの借用チェッカが検査することによって、メモリの安全性をコンパイラが保証することができます。

## まとめ

今回は、Rust の所有権と、借用、コピートレイトまわりを簡単にまとめました。
Rust のメモリ安全性をコンパイラが保証してくれるという思想は、個人的にすばらしいなと思いました。
