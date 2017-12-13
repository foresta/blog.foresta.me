+++
date = "2017-12-02T11:37:32+09:00"
title = "Elixirで線形回帰してみた"
draft = true

+++

この記事は[Elixir Advent Calendar 2017](https://qiita.com/advent-calendar/2017/elixir)の17日目の記事です。


最近始めたElixirで何かOutputしたいということで線形回帰のアルゴリズムを実装してみました。

リポジトリはこちら https://github.com/foresta/ex_lenear_regression.git

Elixirでも機械学習できないこともない（かもしれない）ことを書いていこうかなと思います。

## 背景

最近の私の興味があるものとしてEilxirと機械学習があります。

Elixirはサンプルアプリや簡単なツールを制作した程度、機械学習はcourseraのコースを一通りやり本を数冊読んだ程度です。

今回はその両方の学習と、どうせ機会学習アルゴリズム実装するなら書きごごちの良いElixirで書いてみたいと思い実装してみました。

## 線形回帰とは

データを元に線形モデルを作成しその線形モデルを用いて未知のデータを予測するものです。

図1はデータの次元が2次元の場合の線形回帰の概念を示し、×印が与えられたデータ、直線が学習した結果の線形モデルを表しています。


{{< figure src="/images/posts/lenear_regression_with_elixir/sample_plot.png" title="図1 線形回帰のサンプルグラフ" >}}


詳しくはこちらのサイトを参照してください。

* https://qiita.com/ynakayama/items/5732f0631c860d4b5d8b
* http://gihyo.jp/dev/serial/01/machine-learning/0008

## 学習データ

今回学習には以下のリポジトリにあるデータセットを使用しました。

https://github.com/scikit-learn/scikit-learn

実際に使用したのは以下の二つのデータです。

```
sklearn/datasets/data/linnerud_exercise.csv
sklearn/datasets/data/linnerud_physiological.csv
```

// TODO::学習データを軽く説明



## 実装

線形回帰を実装するにあたり以下の数式を実装していきます。

### 仮説関数

線形モデルを表す関数です。


$$
h\_{\theta}(x) = \theta\_{0}x\_{0} + \theta\_{1}x\_{1} + \cdots + \theta\_{n}x\_{n} = \theta^{T}x
$$

コスト関数

$$
J(\theta) = \frac{1}{2m}\sum\_{i=1}^{m}(h\_{\theta}(x^{(i)}) - y^{(i)})^{2}
$$

最急降下

$$
\theta = 
$$

## 結果

データを用いて

## まとめ

Elixirで線形回帰のアルゴリズムを





