+++
title="Rust における module について"
date="2021-01-23T12:35:42+09:00"
categories = ["engineering"]
tags = ["rust"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，Rust における module についてまとめます．

## ファイル内でモジュールを定義

Rust では，`mod` キーワードで module を定義することが出来ます． 

```rust
mod greet {
    pub fn hello() {
        println!("Hello world");
    }
}

fn main() {
    greet::hello();
}
```

モジュール内で定義した，関数などをモジュール外から呼び出すと場合には，`pub` キーワードが必要になります．

```rust
mod greet {
    pub fn hello() {
        println!("Hello world");
    }

    fn private_hello() {
        println!("Private Hello world ");
    }
}

fn main() {
    greet::hello();
    greet::private_hello(); // Compile Error
}
```

上記のコードは以下のようなエラーが表示されます．

```
error[E0603]: function `private_hello` is private
  --> src/main.rs:13:12
   |
13 |     greet::private_hello();
   |            ^^^^^^^^^^^^^ private function
   |
note: the function `private_hello` is defined here
  --> src/main.rs:6:5
   |
6  |     fn private_hello() {
   |     ^^^^^^^^^^^^^^^^^^

error: aborting due to previous error

For more information about this error, try `rustc --explain E0603`.
error: could not compile `rust-sandbox`.

To learn more, run the command again with --verbose.

```

余談ですが，Rust のコンパイルメッセージは非常にわかりやすいので，書いていてエラー内容でググるという行為をあまりしなくなったような気がしていてとても良いです．


モジュールのネストも行うことが出来ます．

```rust
mod greet {
    pub fn hello() {
        println!("Hello world");
    }

    pub mod mod_a {
        pub fn hello() {
            println!("Hello world from A");
        }
    }

    pub mod mod_b {
        pub fn hello() {
            println!("Hello world from B");
        }
    }
}

fn main() {
    greet::hello();
    greet::mod_a::hello();
    greet::mod_b::hello();
}
```

内側の `mod` にも `pub` をつけないとその外側からアクセスできないので注意が必要です．


## ファイル分割

モジュールの定義をファイル分割するにはいくつかの方法があります．

１つめの方法としては，module名.rs というファイルを作成して，main.rs (または，lib.rs) でそのファイル名を モジュール定義する方法です．

以下のようにファイルを分割します.

```
./src/
├── greet.rs
└── main.rs
```

##### main.rs
```rust
mod greet; // greet.rs を module として読み込み

fn main() {
    greet::hello();
    greet::mod_a::hello();
    greet::mod_b::hello();
}
```

##### greet.rs
```rust
pub fn hello() {
    println!("Hello world");
}

pub mod mod_a {
    pub fn hello() {
        println!("Hello world from A");
    }
}

pub mod mod_b {
    pub fn hello() {
        println!("Hello world from B");
    }
}
```

この方法だと，ファイル単位でモジュールを分割するため，ファイルの構造はフラットになります．


２つめの方法としてディレクトリを切る方法です．

`greet.rs` というファイルと `greet` ディレクトリの下に，サブモジュールを入れる形です．

```
./src/
├── greet
│   ├── mod_a.rs
│   └── mod_b.rs
├── greet.rs
└── main.rs
```

##### main.rs
```rust
mod greet;

fn main() {
    greet::hello();
    greet::mod_a::hello();
    greet::mod_b::hello();
}
```

##### greet.rs
```rust
pub mod mod_a; // greet/mod_a.rs を外部に公開
pub mod mod_b; // greet/mod_b.rs を外部に公開

pub fn hello() {
    println!("Hello world");
}
```


##### greet/mod_a.rs

```rust
pub fn hello() {
    println!("Hello world from A");
}
```

##### greet/mod_b.rs
```
pub fn hello() {
    println!("Hello world from B");
}
```

もう一つの方法としては，`greet.rs` の代わりに `mod.rs` というファイルを，`greet` ディレクトリの下にいれる方法があります．

```
./src/
├── greet
│   ├── mod.rs
│   ├── mod_a.rs
│   └── mod_b.rs
└── main.rs
```

この方法でもディレクトリを分割できる模様です．

個人的には，一番最後の方法が一番キレイにディレクトリ構造をわけられそうなので採用しています．


## まとめ

Rust におけるモジュールと，ファイル分割について簡単にまとめました．

公式サイトやこちらの記事が大変参考になったので参照してみてください．

- {{< exlink href="https://doc.rust-jp.rs/rust-by-example-ja/mod/split.html" >}}
- {{< exlink href="https://keens.github.io/blog/2018/12/08/rustnomoju_runotsukaikata_2018_editionhan/" >}}

