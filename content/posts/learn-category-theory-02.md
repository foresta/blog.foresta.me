+++
title="圏論への入門 圏の例としての順序集合"
date="2023-02-05T22:06:53+09:00"
categories = ["engineering"]
tags = ["math", "category_theory"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

前回は、圏とはなにかについてまとめたので今回は、圏論について入門する第二弾の記事で圏の例を見ていきます。


前回はこちら
- [圏論への入門 圏論とは](/posts/learn-category-theory-01/)

## 順序集合

順序の概念がありときに、「$\leq$」で表される大小関係 ( `二項関係` という ) がある集合を順序集合という。

単純な例だと、数値は数値同士比較できる ( 二項関係がある ) ため、数値の集合は順序関係と言える。


順序集合には以下の3通りあるので説明していく

- 前順序集合
- 半順序集合
- 全順序集合

### 前順序集合 (preorder set)

以下の条件を満たすものが前順序集合である。

集合内の任意の要素 $a, b$ について

- $a \leq a$ (反射律)
- $a \leq b \ かつ \ b \leq c \ ならば、a \leq c$ (推移律)

### 半順序集合 (partialOrder set)

半順序集合は、前順序集合に加えて以下の条件を満たすものである。

- $a \leq b \ かつ \ b \leq a \ ならば、\ a = b$ (反対称律)

### 全順序集合 (totalOrder set)

全順序集合は、半順序集合の条件に加えて以下の条件を満たすものである。

- どんな $a, b$ の組み合わせにおいても、$a \leq b \ であるか、b \leq a $ であるかが成り立つ (全順序律)

### 具体例

順序集合といわれて一番はじめに思いつくのが、整数なのでそれで考えると、上記のいずれの条件も当たり前では？と思うのだが、そうではないパターンもどうやらあるらしい。

たとえば、以下のような集合を考える

$$
\lbrace \phi, \lbrace 1 \rbrace, \lbrace 2 \rbrace, \lbrace 3 \rbrace, \lbrace 1, 2 \rbrace, \lbrace 1,3 \rbrace, \lbrace 2,3 \rbrace, \lbrace 1,2,3 \rbrace \rbrace
$$

二項関係を、集合の包含関係とすると、

$$
\lbrace 1 \rbrace \leq \lbrace 1,2 \rbrace 
$$

書くことができる。


各条件を見ていくと、

> $a \leq a$ (反射律)

は、$\lbrace 1 \rbrace \leq \lbrace 1 \rbrace$


> $a \leq b \ かつ \ b \leq c \ ならば、a \leq c$ (推移律)

は $\lbrace 1 \rbrace \leq \lbrace 1,2 \rbrace \ かつ \ \lbrace 1,2 \rbrace \leq \lbrace 1,2,3 \rbrace \ ならば、\ \lbrace 1 \rbrace \leq \lbrace 1,2,3 \rbrace$


といえるため、前順序集合の条件は満たしている。

続けて、

> $a \leq b \ かつ \ b \leq a \ ならば、\ a = b$ (反対称律)
 
は、$\lbrace 1,2 \rbrace = \lbrace 1,2 \rbrace$ を考えればわかるため、半順序集合でもある。


最後に、

> どんな $a, b$ の組み合わせにおいても、$a \leq b \ であるか、b \leq a $ であるかが成り立つ (全順序律)

だが、$\lbrace 1,2 \rbrace と \lbrace 2,3 \rbrace$ を考えるとこれらの間には、包含関係がないため満たしていないため `全順序集合ではない` 。

参考: 
- {{< exlink href="https://ja.wikipedia.org/wiki/%E9%A0%86%E5%BA%8F%E9%9B%86%E5%90%88" >}}


## Rust の Ord と PartialOrd

`partalorder (半順序集合)` と聞いて最初に思い浮かんだのは、Rust の PartialOrd トレイトだった。

それぞれの Trait の定義を doc から参照して以下に記載します。

- {{< exlink href="https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html" text="std:cmp::PartialOrd">}}
```rust
pub trait PartialOrd<Rhs = Self>: PartialEq<Rhs>
where
    Rhs: ?Sized,
{
    fn partial_cmp(&self, other: &Rhs) -> Option<Ordering>;

    fn lt(&self, other: &Rhs) -> bool { ... }
    fn le(&self, other: &Rhs) -> bool { ... }
    fn gt(&self, other: &Rhs) -> bool { ... }
    fn ge(&self, other: &Rhs) -> bool { ... }
}
```

- {{< exlink href="https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html" text="std:cmp::PartialOrd">}}
```rust
pub trait Ord: Eq + PartialOrd<Self> {

    fn cmp(&self, other: &Self) -> Ordering;

    fn max(self, other: Self) -> Self
    where
        Self: Sized,
   { ... }
   fn min(self, other: Self) -> Self
   where
       Self: Sized,
   { ... }
   fn clamp(self, min: Self, max: Self) -> Self
   where
       Self: Sized + PartialOrd<Self>,
   { ... }
}
```

興味深いのが、`cmp` と `partial_cmp` メソッドで、`cmp` の返戻値が `Ordering` なのに対し、`partial_cmp` の返戻値は `Option［Ordering］` なっている。

これはまさに、以下の半順序集合と全順序集合の違いを型で表している。

> どんな $a, b$ の組み合わせにおいても、$a \leq b \ であるか、b \leq a $ であるかが成り立つ (全順序律)

ちなみに `PartialOrd` のドキュメントには、以下のように記載されていて要素通しが比較できないとき (`None` を返すとき) は、`a == b` が `false` なると記載されています。

> a == b if and only if partial_cmp(a, b) == Some(Equal).

## まとめ

今回は、圏の例として順序集合についてまとめました。

圏論はかなり抽象的な分野だと感じたので具体例をできるだけ考えつつ理解を進めていこうと思いますが、抽象的なものを抽象的なまま扱っていく思考力も身につけられそうな気がします。

Rust の `PartialOrd` の例でみましたが、実際のプログラミングの型などにも反映されているのを見ると興味深いですね。
