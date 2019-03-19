+++
categories = ["mathematics"]
date = "2019-03-19"
title = "ポアソン分布"
thumbnail = ""
tags = ["statistics"]
+++

## はじめに

今回は、ポアソン分布について紹介していきたいと思います。


## ポアソン分布とは

一定期間内に、平均して $\lambda$ 回ランダムに発生する事象があるとします。この事象が同じ期間内に $k$ 回起きる確率が従う分布のことを `ポアソン分布` と呼びます。

その確率関数は以下のようになります。

$$
P(k) = \frac{\lambda^k e^{-\lambda}}{k!}
$$

この分布は「馬に蹴られて死ぬ確率」というのを求めるときに初めて利用された分布らしいです。

### 確率分布であることの確認

これが確率分布であることを確かめてみます。

これはつまり、
$$
\sum\_k \frac{\lambda^k}{k!} e^{-\lambda} = 1 
$$

となることを確かめればOKです。

以下の式

$$
\sum\_k \frac{\lambda^k}{k!} = 1 + \lambda + \frac{1}{2!} \lambda^2 + \frac{1}{3!} \lambda^3 + \cdots
$$ 

は、$e^{\lambda}$ のマクローリン展開と等価なため、

$$
e^{\lambda} e^{-\lambda} = 1 
$$

となり、確率分布であることがわかりました。

### 二項分布との関係

ポアソン分布の確率関数と二項分布には深く関係があり、二項分布の一種の極限としてポアソン分布があるということが知られています。
つまりポアソン分布の確率関数の式は、二項分布から求めることができます。

二項分布の試行回数を $n$、$X = 1$ がでる回数を $\lambda$ 回とします。この $\lambda$ を固定したまま、$n → \infty$ の極限を考えます。\
これはつまり、無限回の試行回数である一定の $\lambda$ 回事象が発生することを考えています。\
そのため、$p = \frac{\lambda}{n}→ 0$ となります。

この極限において、各 $k$ で

$$
{}\_n C\_k \ p^k (1-p)^{n-k} → \frac{\lambda^k}{k!} e^{-\lambda}
$$

となることが知られており、これを `ポアソンの小数の法則` と呼びます。

#### ポアソンの小数の法則の証明

それではポアソンの小数の法則を証明してみます。
$p = \frac{\lambda}{n}$ なので、これを二項分布の確率関数で表すと、

$$
Bi(n, \frac{\lambda}{n}) = {}\_n C\_k \ (\frac{\lambda}{n})^k (1-\frac{\lambda}{n})^{n-k}
$$

となります。

$n \to \infty$ を考えると、

$$
\lim\_{n \to \infty} {}\_n C\_k \ (\frac{\lambda}{n})^k (1-\frac{\lambda}{n})^{n-k}
$$

$$
 = \lim\_{n \to \infty} \frac{n!}{k! (n-k)!} \ (\frac{\lambda}{n})^k (1-\frac{\lambda}{n})^{n-k}
$$
$$
 = \lim\_{n \to \infty} \frac{\lambda^k}{k!} \frac{n!}{n^k (n-k)!} (1-\frac{\lambda}{n})^{n-k}
$$
$$
 = \lim\_{n \to \infty} \frac{\lambda^k}{k!} \frac{n!}{n^k (n-k)!} (1-\frac{\lambda}{n})^n (1-\frac{\lambda}{n})^{-k} 
$$

ここで、$\lim\_{n \to \infty} (1 - \frac{\lambda}{n})^n = e^{-\lambda}$ 、 $\lim\_{n \to \infty} (1 - \frac{\lambda}{n})^{-k} = 1$ 、 $\lim\_{n \to \infty} \frac{n!}{ (n-k)! n^k} = 1$ となることを用いると、

$$
\lim\_{n \to \infty} Bi(n, \frac{\lambda}{n}) = \frac{\lambda^k}{k!} e^{-\lambda}
$$

となります。

### モーメント母関数

ポアソン分布のモーメント母関数を求めてみます。

$$
M\_X (t) = E(e^{tX})
$$
$$
E(X) = \sum\_x x\ f(x)
$$

より、ポアソン分布のモーメント母関数は、

$$
M\_X (t) = \sum\_x e^{tx} \cdot \frac{\lambda^x}{x!} e^{-\lambda}
$$
$$
 = e^{-\lambda} \sum\_x \frac{ (e^t \lambda)^x}{x!}
$$

ここで、マクローリン展開
$$
e^x = \sum\_k \frac{x^k}{k!} 
$$
を利用すると、

$$
M\_X (t) = e^{-\lambda} e^{e^t \lambda} = e^{ \lambda(e^t - 1)}
$$

これから、

$$
M\_X' (t) = \lambda e^t e^{ \lambda(e^t - 1)}
$$

$$
M\_X (0) = \lambda
$$

$$
M\_X'' (t) = \lambda e^t \cdot \lambda e^t e^{ \lambda(e^t - 1)} + \lambda e^t e^{ \lambda(e^t - 1)} = \lambda e^t (1 + \lambda e^t) \ e^{\lambda (e^t - 1)}
$$

$$
M\_X'' (0) = \lambda \ (1 + \lambda) 
$$

となります。

### 期待値

上記のモーメント母関数から期待値を算出すると以下のようになります。

$$
E(X) = M\_X' (0) = \lambda
$$

### 分散

期待値と同様にモーメント母関数から算出すると以下のようになります。

$$
V(X) = E(X^2) - E(X) ^2 \ \ \ \ \ \ \ 
$$
$$
\ \ \ \ \  = M\_X'' (0) - M\_X' (0) ^2
$$
$$
 \ \ \ \ \  = \lambda\ (1 + \lambda) - \lambda^2 = \lambda
$$

## まとめ

今回は期待値と分散が同じ $\lambda$ なのが特徴的なポアソン分布を紹介し、その二項分布との関係を示しました。
そしてモーメント母関数から期待値と分散を導出をしてみました。

