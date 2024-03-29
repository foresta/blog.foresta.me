+++
title="圏論への入門 関手とは"
date="2023-02-26T23:09:39+09:00"
categories = ["engineering"]
tags = ["math", "category_theory"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

圏論について入門する記事の5回目です。

これまでの記事はこちら

-   [圏論への入門 圏論とは](/posts/learn-category-theory-01)
-   [圏論への入門 圏の例としての順序集合](/posts/learn-category-theory-02)
-   [圏論への入門 集合圏 Set](/posts/learn-category-theory-03)
-   [圏論への入門 モノイドとモノイドの圏](/posts/learn-category-theory-04)


## 関手とは

[前回の記事](/posts/learn-category-theory-04) でモノイドの圏について考えましたが、今回はより抽象化した関手について考えます。

関手は圏と圏の間の対応をあわらす、いわば圏を対象としたときの射のようなものです。

定義は以下の通り

圏C と 圏D において、以下の条件を満たす $F$ を関手 (functor) と呼ぶ。

- $C\ の射 \ f: X \to Y \ を \ D \ の射 \ F(f): F(X) \to F(Y)$ に対応させる
- $F (f \circ g) = F(f) \circ F(g)$
- $F(1_X) = 1_{F(x)}$


### 具体例で考える

前回のモノイド準同型の例で、具体例を考えると以下のようなことです。

↓の２つの圏 (モノイド) を考えます。

$圏\ C = (\mathbb{R}, +, 0)$
: 実数の集合を対象とし、+ (加算)を射とするモノイド。単位元は 0

$圏\ D = (\mathbb{R}_{>0}, *, 1)$
: 正の実数を対象とし、* (乗算) を者とするモノイド。単位元は 1

$F(x) = 2^x$ が関手になるのですが、定義を具体例で再確認します。

> $C\ の射 \ f: X \to Y \ を \ D \ の射 \ F(f): F(X) \to F(Y)$ に対応させる


C の射を $f(x) = x+2$ とすると、$f: X \to Y$ は、例えば 3 という数値を 5 に移すような射と考えられます ($f: 3 \to 5$)。

$F(f(x)) = 2^{x+2} = 2^{x} * 2^2$ なので、$F(f): F(X) \to F(Y)$ は、$F(f): F(3) \to F(5)$となります。

これは、値を代入すればわかり、
$F(f(3)) = F(3 + 2) = 2^{3+2} = 2^5 = F(5)$ となり、F(f) が、F(3) を F(5) に移す射として対応しています。


> $F (f \circ g) = F(f) \circ F(g)$

$f(x) = x + 2$、$g(x) = x + 3$ とすると、
$F(f) = 2^{x + 2}$, $F(g) = 2^{x+3}$

$f \circ g \ = x + 5$ なので、

$F(f \circ g) = 2^{x + 2 + 3} = 2^{x} * 2^{2} * 2^{3} = F(f) \circ F(g)$


> $F(1_X) = 1_{F(x)}$

最後に、
$F(1_C) = F(0) = 2^0 = 1 = 1_{F(C)} $

となります。

## まとめ

今回は、関手についてまとめました。

前回の、モノイド準同型を抽象化して定義しただけですが、具体例を考えると確かにモノイド準同型が関手になっていそうなことがわかりました。


このあたりから、実際のプログラムのソースコードを交えてみると理解が深まりそうだと思うため、次回はそのあたりを見ていこうと思います。
