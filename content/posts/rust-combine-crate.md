+++
title="Rust のパーサコンビネータの combine を使ってみる"
date="2022-08-07T22:10:51+09:00"
categories = ["engineering"]
tags = ["rust", "combine"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は Rust のパーサコンビネータである {{< exlink href="https://github.com/Marwes/combine" text="combine" >}} を使ってみたのでメモを残していきます。

## combine の使い方

Carto.toml に以下のように記載し使用します。

```toml
[dependencies]
combine = "4.5.2"
```

公式にあるサンプルコードを以下に記載しつつ内容を見ていきます。

- {{< exlink href="https://github.com/Marwes/combine" >}}

```rs
extern crate combine;
use combine::{many1, Parser, sep_by};
use combine::parser::char::{letter, space};

// Construct a parser that parses *many* (and at least *1) *letter*s
let word = many1(letter());

// Construct a parser that parses many *word*s where each word is *separated by* a (white)*space*
let mut parser = sep_by(word, space())
    // Combine can collect into any type implementing `Default + Extend` so we need to assist rustc
    // by telling it that `sep_by` should collect into a `Vec` and `many1` should collect to a `String`
    .map(|mut words: Vec<String>| words.pop());
let result = parser.parse("Pick up that word!");
// `parse` returns `Result` where `Ok` contains a tuple of the parsers output and any remaining input.
assert_eq!(result, Ok((Some("word".to_string()), "!")));
```

基本的には、`combine::parser::char` 以下に文字に関するパーサーがあり、`combine::parser::byte` 以下に バイト用が用意されています。

上の例では、以下のようなコンビネータが使用されています。

- many1
- sep_by
- char::letter
- char::space


many1 は 1つ以上の読み進めるコンビネータで、上記の例では

```rs
let word = many1(letter());
```

とされているため任意の文字を1つ以上読むコンビネータになっています。

ちなみに `many` というコンビネータもあるがこちらは `0 以上` 読み進めるコンビネータで, `many1(letter())` としたとき文字列がなければ、エラーになるが `many(letter())` とするとこちらはエラーにはなりません。 

続いて以下のように parser が定義されています。

```rs
let mut parser = sep_by(word, space())
    .map(|mut words: Vec<String>| words.pop());
```

sep_by は、第二引数でわたされたコンビネータで区切り、第一引数のコンビネータを適用した値を返します。

そのため以下のような文字列を parse すると
```rs
let result = parser.parse("Pick up that word!");
```

`space()` によりスペースで区切って、`Pick`, `up`, `that`, `word!` という配列になりそれぞれを、`word` コンビネータで解析します。
parser の定義では、`words.pop()` とされていることから、最後の `word!` が対象となるため以下のような結果となります。

```rs
// word が解析でき、残りの文字列が "!" である
assert_eq!(result, Ok((Some("word".to_string()), "!")));
```

## まとめ

今回は rust の パーサコンビネータである combine について基本的な使い方といくつかのコンビネータを公式のサンプルコードを用いて紹介しました。

さらに詳しい内容については、下記の記事が非常に参考になったので本格的に使う前に一読しておくと理解が深まりそうです。

- {{< exlink href="https://qnighy.hatenablog.com/entry/2017/02/19/220338">}}
