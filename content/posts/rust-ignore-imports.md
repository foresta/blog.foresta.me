+++
title="Rust で不要な warning を抑制する allow attribute"
date="2022-09-11T22:36:30+09:00"
categories = ["engineering"]
tags = ["rust"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。


Rust でコードを書いているときに 不要な warning が出てきているのを抑制する方法についてメモします。

## allow attribute を使って warning を抑制する

コードを書いている最中に TDD ライクにテストコードから書くことがありますが、その際にテスト対象のメソッドは使用されていないため以下のような warning が表示されます。


combine を使った parser を書いてて以下のようなコードを書いていたとして、

```rs
fn whitespaces<Input>() -> impl Parser<Input, Output = String>
where
    Input: Stream<Token = char>,
    Input::Error: ParseError<Input::Token, Input::Range, Input::Position>,
{
    many::<String, _, _>(space().or(newline()))
}
```

以下のような warning が出るイメージです。

```
src/css.rs|73 col 4 warning| function `whitespaces` is never used
```

本当に呼ばれていないコードであれば整理する必要がありますが、開発中で必要なためこのような warning はできるだけでないようにしたいです。

以下のよう `allow attribute` をつけることで抑制することができます。

```rs
#[allow(dead_code)]
fn whitespaces<Input>() -> impl Parser<Input, Output = String>
where
    Input: Stream<Token = char>,
    Input::Error: ParseError<Input::Token, Input::Range, Input::Position>,
{
    many::<String, _, _>(space().or(newline()))
}
```



default では Rust には以下のような Lints ルールが設定されています。

- dead_code
- unused_imports
- unused_variables
- while_true

すべての Lints ルールは以下のサイトにリストアップされているため参照してください。

- {{< exlink href="https://doc.rust-lang.org/rustc/lints/listing/warn-by-default.html" >}}

## まとめ

今回は、Lint による warning の抑制として、allow attribute を紹介しました。また Rust でデフォルトで聞いている Lints ルールについても記載しました。
不要になったタイミングで外さないと適切に Lint が聞かないですが開発の初期段階など必要に応じてつけていくのがよさそうです。

