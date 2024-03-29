+++
title="b-Bit Minwise Hashing について"
date="2021-11-21T13:48:24+09:00"
categories = ["engineering"]
tags = ["minhash", "nlp"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

[前回](/posts/cos-simularity/) の記事で、MinHash について触れましたが、今回はその改良版である b-bit Minwise Hashing についてみていきます。

主に、{{< exlink href="https://arxiv.org/pdf/0910.3349.pdf" text="論文" >}} の内容を参考にみていきます。

## 解決したい課題

前回の MinHash の説明で以下のことに触れました。

- 集合同士の類似度を測る際に Jaccard 係数が利用できる
- Jaccard 係数は集合の和集合と積集合を求める必要があるので計算コストが高い
- 2つ集合で各要素を Hash した最小値が一致するかどうかを見ることで Jaccard 係数の推定量として使える

Hash関数は k 個使用し、各 Hash 関数の結果が、64bit だとすると、k * 64 bit のディスクスペースを使用します。

そこで Hash された値の bit 数を減らすとストレージスペースの節約や計算効率を大幅に向上させることができると考えられました。

## 手法

Hash 結果を b Bit のみ使用する手法なので、`b-Bit Minwise Hashing` と呼ばれます。

論文では、b = 1 や b = 2 といった小さい bit 数でも効果的であると記されています。


b の値を減らすと精度が下がっていくので、精度を維持するためにはハッシュ関数の数の k を増やして行く必要があります。

論文内では、類似性 (Jaccard係数の値) が小さすぎない場合 (0.5 など) では、k の値をあまり増やさなくても 精度が維持できることが証明されており、結果的に精度を維持しつつもストレージサイズを節約できるとのことです。
具体的に、b = 1, Jaccard係数が 0.5 の最も不利なケースの場合でも、推定分散が3倍になる。つまり、増やすべきハッシュ関数の数はせいぜい 3 倍程度におさまると書かれています。

これは、もともと `64 bit * k` のサイズだったものが、`1 bit * 3k` となるので、少なくとも `64/3 = 21.333` ほどストレージサイズは改善されます。 

推定分散が 3 倍ほどになる理由ですが、証明も論文に書いてあるのですが指揮が複雑で追い切れませんでした。


## まとめ

今回は、b-bit Minwise Hashing のコンセプトと効率について知るために論文を読んでみました。

具体的な証明の式が追いきれなかったのでじっくり読んでみたいと思います。
また、次回実際に実装してみようかなと思います。

### 参考

- {{< exlink href="https://arxiv.org/pdf/0910.3349.pdf" >}}
