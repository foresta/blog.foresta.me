+++
title="Rust の文字列の逆順を求める際の計算量について"
date="2023-05-22T00:00:38+09:00"
categories = []
tags = ["rust"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Rust のコードを書いていて、計算量が気になったので調べてみました。

対象のコードは以下のようなものです。

```rust
// 文字列を逆順にする
let text: String = "hogehoge".to_string();
let reverse: String = text.chars().rev().collect();
```

## コードを読みとく 
まず、ぱっとこの処理を見たときに逆順に並び替えるだけなので、`O(n)` くらいで計算できそうと思ったのですが、計算量についてドキュメントが見つけられなかったので調べてみます。

実行している処理について見ていきます。

まず、String の chars() メソッドですが、これは String 型 の文字列を byte 列にして iterator として保持します。

{{< exlink href="https://doc.rust-lang.org/src/core/str/mod.rs.html#789" >}}
```rust
    #[stable(feature = "rust1", since = "1.0.0")]
    #[inline]
    pub fn chars(&self) -> Chars<'_> {
        Chars { iter: self.as_bytes().iter() }
    }
```

次に `rev()` ですがこちらは、Iterator を逆順で取得できるようにした Rev 型に変換します。

Chars
{{< exlink href="https://doc.rust-lang.org/src/core/iter/traits/iterator.rs.html#3230-3239">}}
```rust
    #[inline]
    #[doc(alias = "reverse")]
    #[stable(feature = "rust1", since = "1.0.0")]
    #[rustc_do_not_const_check]
    fn rev(self) -> Rev<Self>
    where
        Self: Sized + DoubleEndedIterator,
    {
        Rev::new(self)
    }
```

逆順に取れるようにする仕組みは、`next()` メソッドが override されており内部で`next_back()` が呼ばれるようになっています。

{{< exlink href="https://doc.rust-lang.org/src/core/iter/adapters/rev.rs.html#31-34">}}
```rust
    #[inline]
    fn next(&mut self) -> Option<<I as Iterator>::Item> {
        self.iter.next_back()
    }
```

最後に、`Rev` 型の `collect()` メソッドが呼ばれています。
`Rev` 型は、`Iterator` トレイトを実装しているため、Iterator トレイトに実装されている `collect()` メソッドが呼べます。

{{< exlink href="https://doc.rust-lang.org/src/core/iter/traits/iterator.rs.html#1882-1892">}}
```rust
    #[inline]
    #[stable(feature = "rust1", since = "1.0.0")]
    #[must_use = "if you really need to exhaust the iterator, consider `.for_each(drop)` instead"]
    #[cfg_attr(not(test), rustc_diagnostic_item = "iterator_collect_fn")]
    #[rustc_do_not_const_check]
    fn collect<B: FromIterator<Self::Item>>(self) -> B
    where
        Self: Sized,
    {
        FromIterator::from_iter(self)
    }
```

今回は、String型変換しようとしていますが、String 型にも FromIterator トレイトが実装されているため、呼ぶことができます。

{{< exlink href="https://doc.rust-lang.org/src/alloc/string.rs.html#2020-2028">}}
```rust
#[cfg(not(no_global_oom_handling))]
#[stable(feature = "rust1", since = "1.0.0")]
impl FromIterator<char> for String {
    fn from_iter<I: IntoIterator<Item = char>>(iter: I) -> String {
        let mut buf = String::new();
        buf.extend(iter);
        buf
    }
}
```
この中で、String 型の `extend` メソッドが呼ばれています。

ここで `Rev` 型の Iterator トレイトの実装を見ると、`Rev` が wrap している Iterator の Item をみていることになります。

```rust
#[stable(feature = "rust1", since = "1.0.0")]
impl<I> Iterator for Rev<I>
where
    I: DoubleEndedIterator,
{
    type Item = <I as Iterator>::Item;
    // ...
    // ..
}
```

今回は、`Chars` 型だったのですが、`Chars` 型の Item は以下の通り `char` です。

{{< exlink href="https://doc.rust-lang.org/src/core/str/iter.rs.html#36-38">}}
```rust
#[stable(feature = "rust1", since = "1.0.0")]
impl<'a> Iterator for Chars<'a> {
    type Item = char;

```

そのため、今回の、`extend` メソッドは、以下の通りです。

{{< exlink href="https://doc.rust-lang.org/src/alloc/string.rs.html#2079-2098">}}
```rust
#[cfg(not(no_global_oom_handling))]
#[stable(feature = "rust1", since = "1.0.0")]
impl Extend<char> for String {
    fn extend<I: IntoIterator<Item = char>>(&mut self, iter: I) {
        let iterator = iter.into_iter();
        let (lower_bound, _) = iterator.size_hint();
        self.reserve(lower_bound);
        iterator.for_each(move |c| self.push(c));
    }

    #[inline]
    fn extend_one(&mut self, c: char) {
        self.push(c);
    }

    #[inline]
    fn extend_reserve(&mut self, additional: usize) {
        self.reserve(additional);
    }
}
```

`for_each` で iterator を回しているのでこの時点で、O(n) は確定です。

`for_each` メソッドを見ると `fold` メソッドを読んでることがわかります。

{{< exlink href="https://doc.rust-lang.org/src/core/iter/traits/iterator.rs.html#842-853">}}
```rust
    #[inline]
    #[stable(feature = "iterator_for_each", since = "1.21.0")]
    #[rustc_do_not_const_check]
    fn for_each<F>(self, f: F)
    where
        Self: Sized,
        F: FnMut(Self::Item),
    {
        #[inline]
        fn call<T>(mut f: impl FnMut(T)) -> impl FnMut((), T) {
            move |(), item| f(item)
        }

        self.fold((), call(f));
    }
```

`fold` メソッド内では、iterator の `next()` メソッドを呼ぶことで順次処理をしました。
{{< exlink href="https://doc.rust-lang.org/src/core/iter/traits/iterator.rs.html#842-853">}}
```rust
   #[doc(alias = "inject", alias = "foldl")]
    #[inline]
    #[stable(feature = "rust1", since = "1.0.0")]
    #[rustc_do_not_const_check]
    fn fold<B, F>(mut self, init: B, mut f: F) -> B
    where
        Self: Sized,
        F: FnMut(B, Self::Item) -> B,
    {
        let mut accum = init;
        while let Some(x) = self.next() {
            accum = f(accum, x);
        }
        accum
    }
```

ここまでで、`collect()` を読んだときに、`next()` メソッドが呼ばれるところまで追えました。


ところで、この iterator は、`Rev` 型であり、`next()` は `next_back()` メソッドを読んでいるのでした。

{{< exlink href="https://doc.rust-lang.org/src/core/iter/adapters/rev.rs.html#24-29" >}}
```rust
    #[inline]
    fn next(&mut self) -> Option<<I as Iterator>::Item> {
        self.iter.next_back()
    }
```

self.iter は `Chars` 型なので、next_back() メソッドを見にいきます。

{{< exlink href="https://doc.rust-lang.org/src/core/str/iter.rs.html#78-86">}}
```rust
#[stable(feature = "rust1", since = "1.0.0")]
impl<'a> DoubleEndedIterator for Chars<'a> {
    #[inline]
    fn next_back(&mut self) -> Option<char> {
        // SAFETY: `str` invariant says `self.iter` is a valid UTF-8 string and
        // the resulting `ch` is a valid Unicode Scalar Value.
        unsafe { next_code_point_reverse(&mut self.iter).map(|ch| char::from_u32_unchecked(ch)) }
    }
}
```

内部で呼ばれている、`next_code_point_reverse` メソッドを見に行きます。

{{< exlink href="https://github.com/rust-lang/rust/blob/77f4f828a2f19854fcbcdf69babe7d0ac1c92852/library/core/src/str/validations.rs#L79-L113">}}

すると内部で、以下のように byte列に対して next_back() メソッドが定数回呼ばれています。
```rust
*bytes.next_back()
```

DoubleEndedIterator は後ろからも辿れるような Iterator なので、おそらくこの処理は `O(1)` で実行できているはずです。

(上記がコード読みきれず確証まで至ってないですが、Iterator を最初からなめていくことはないと思われます。そのための `DoubleEndedIterator` な気がするので)


というわけで、まとめると、`collect()` メソッドが呼ばれるタイミングで、O(n) で、それ以降の処理は、O(1) で実行できていそうなため、今回の調べたかった内容は O(n) で実行されていることがわかりました。

## まとめ

今回は、Rust のコードを読み解きつつ計算量について考えてみました。
コードを読み解くとかなり参考になる部分も多く、特にいろんな Collection まわりの Trait の関係性がわかってくるので良かったです。
