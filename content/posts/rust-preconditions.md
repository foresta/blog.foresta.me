+++
title="Rust で事前条件を表明するために panic する方法"
date="2023-05-28T13:35:14+09:00"
categories = ["engineering"]
tags = ["rust", "panic", "assert"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Rust で事前条件をどのように表明するのが良さそうかを調べてまとめました。

## 前提

Rust には、エラーハンドリングなどをするために `Result` 型などがありますが、回復不能なエラーを意味する panic があります。
panic は起きると異常終了するものです。

今回は、事前条件を満たさない場合には、panic させるようなコードを考えます。

## コード例

n x n の正方行列を扱う型を考えます。

```rust
// n x n の正方行列を扱うための型
pub struct SquareMatrix<T> {
    arr: Vec<Vec<T>>,
    n: usize,
}

impl<T> SquareMatrix<T> {
    pub fn new(arr: Vec<Vec<T>>) -> Self {

        // 事前条件: n x n の二次元配列であること
        let row_count = arr.len();
        for row in &arr {
            let column_count = row.len();
            if column_count != row_count {
                panic!("Arguments not n x n arr");
            }
        }

        SquareMatrix { arr, n: row_count }
    }
}
```
二次元配列の `row_count` と `column_count` が一致しない場合は生成できないように panic するといったコードです。


## Rust で panic する方法

事前条件を満たさない場合に、panic する方法としていくつかあります。

### panic!

上記のコード例で使用したマクロです。引数に与えられた情報を表示しつつ panic します。

### assert 系

こちらはテストコードなどでおなじみの assert 系で、以下のようなものです。

- `assert!()`
- `assert_eq!()`

上記のコード例は if 文 の結果により `panic!` が呼ばれているので `assert!()` で書き直すことができます。

```
for row in &arr {
    let column_count = row.len();
    assert_eq!(column_count, row_count, "Arguments not n x n arr");
}
```

今回のコード例では事前条件の表明なので、`panic!` より `assert` を使用する方が適切だと思います。


### Option, Result の検査

コード例とは別ですが、`Option` が `Some` であること、`Result` が `Ok` を期待する際に panic させる方法もいくつかあります。

- `Option::unwrap()`, `Result::unwrap()`
- `Option::expect()`, `Result::exepct()`
- `panic!()` + `Option::unwrap_or_else()`, `Result::unwrap_or_else()`

それぞれ簡単に紹介します。

#### unwrap

unwrap は Option, Result 型を外して、None, Err のときに panic させます。

```rust
let x: Option<i32> = None;
x.unwrap(); // => panic
```

#### expect

expect も同様ですが、引数に文字列を与えられ情報を付与することができます。

```rust
let x: Option<i32> = None;
let y: Option<i32> = Some(1);
x.expect("x is None"); // panic with "x is None"
x.expect(&format!("x is None, y = {}", y)); // panic with "x is None, y = Some(1)"
```

#### unwrap_or_else + panic!

最後に、`unwrap_or_else` と `panic!` を組み合わせた例です。

```rust
let x: Option<i32> = None;
let y: Option<i32> = Some(1);
x.unwrap_or_else(|| panic!("x is None, y = {}", y)); // panic with "x is None, y = Some(1)"
```

使い所としては、`expect()` + `format!()` によって panic を起こそうとするときに `format!` による文字整形のコストが気になったときです。
`expect()` の引数は、`&str` なので、`format!()` が評価された値が `expect()` メソッドに渡されます。

つまり、panic を起こさないケースにおいても、毎回 `format!()` が実行されます。
`unwrap_or_else()` はクロージャを渡しているため毎回 `format!()` のコストがかかる心配はありません。

## まとめ

今回は、Rust で事前条件を表明するために panic を指せるいくつかの方法についてまとめました。
事前条件を適切に表明することで、データの不整合を許さずに適切に panic させる設計は重要だと個人的に考えているためうまく使い分けようと思います。



### 参考

以下のページが非常に参考になりました。

- {{< exlink href="https://zenn.dev/qnighy/articles/3781c02dfbfd75" >}}
- {{< exlink href="https://qnighy.hatenablog.com/entry/2018/02/18/223000" >}}
- {{< exlink href="https://blog.cardina1.red/2019/12/19/dont-fear-the-panic/" >}}
- {{< exlink href="https://qiita.com/garkimasera/items/f39d2900f20c90d13259" >}}

