+++
title="圏論への入門 圏論とは"
date="2023-01-29T19:59:09+09:00"
categories = ["engineering"]
tags = ["math", "category_theory"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

前から気になっていた圏論について、{{< exlink href="https://gihyo.jp/book/2019/978-4-297-10723-9" text="『圏論の道案内』" >}} という本を読み始めました。

普段 Scala を書くエンジニアとしてモナドなどよく耳にしますが、それがどういう概念に基づく言葉なのか理解したいと思ったのがきっかけです。

学んだことなどをメモがてら書いていきます。

## 圏論について

圏論は、圏とよばれる矢印からなるシステムについての学問という理解です。

圏 (Category) は、対象 (object) と 射 (arrow) からなります。

定義としては、次の通りの理解です。

```
対象と射からなるシステムで射が合成でき、
結合律と単位律を満たすのであれば圏と呼ぶことができる
```

以下で説明していきます。

### 圏の構成要素

対象 A, B と A から B への射 を f とすると以下のように表記することができます。

$$
B \xleftarrow f A
$$

A のことを、射f の `域 (domain)` といい、B のことを、射f の `余域 (codomain)` といい以下のように表記できます。

$$
A = dom(f),  B = cod(f)
$$

### 射の合成

圏の定義として、射 $f, g$ で $cod(f) = dom(g)$ であれば、$dom(f)$ から $cod(g)$ の射が一意に存在します。

{{< figure src="/images/posts/learn-category-theory-01/category-synthesis.png" >}}

上記の図の通り $ B = cod(f) = dom(g)$ となっている場合に A から C に向かう射である、$g \circ f$ が存在するということです。
この $g \circ f$ を $f, g$ の `合成 (composition)` と呼びます。

### 結合律

射 $f,g,h$ に置いて、$cod(f) = dom(g)$ かつ $cod(g) = dom(h)$ であるならば、

$$
h \circ (g \circ f) = (h \circ g) \circ f 
$$

{{< figure src="/images/posts/learn-category-theory-01/category-associative-law.png" >}}

こちらはざっくりいうと交換法則のようなもので、射の合成の順番を入れ替えても問題ないということです。

$g \circ f$ と $h$ の合成 (図の下の方) と、$f$ と $h \circ g$ の合成 (図の上の方) が等しく $h \circ g \circ f$ となります。


### 単位律

どんな対象A に対しても `恒等射 (identity)` と呼ばれる 射 $1_A$ がただひとつ存在し、$cod(f) = A$ , $dom(g) = A$ とする、f, g に対して次が成り立つ。

$$
1_A \circ f = f \ \ および \ \  g \circ 1_A = g
$$

{{< figure src="/images/posts/learn-category-theory-01/category-unit-law.png" >}}


どういうことかというと、AからA自身への射で他の射と合成しても、合成相手の射と等しくなるような射です。

掛け算でいう 1 のように、何とかけても値が変わらないようなものになります。


## まとめ

今回は、圏論について入門し始めた最初の一歩として学んだことをメモしました。

学び始めた感想としては、非常に抽象的な対象について考える必要があるため難しいなと感じました。抽象的なものを抽象的なまま扱っていく数学だなと感じたのでこのあたりの考え方になれるまで時間がかかりそうです。

ただ、抽象的だからこそいろんな分野での考え方に使える気がして面白いので引き続き学びたいと思います。
