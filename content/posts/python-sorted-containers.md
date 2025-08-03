+++
title="Python の sortedcontainers について"
date="2025-08-03T23:17:24+09:00"
categories = ["engineering"]
tags = ["python"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Python の sorted container について、便利だったのでメモです。

## sortedcontainers

- {{< exlink href="https://grantjenks.com/docs/sortedcontainers/#" >}}


Python のソート済みコンテナのライブラリです。

調べた背景として、とあるリストの中で最小のデータを探したいという要件がありましたが、この処理がループの中で行われていて毎回

```python
min(list)
```

と書いていました。

この処理を高速化したく、プライオリティキュー的なものがないか探したところ、sortedcontainers が見つかりました。

上記の例だと、`SortedList` を用いて以下のように書くことができます。

```python
from sortedcontainers import SortedList
# ソート済みリストの初期化
sorted_list = SortedList()

# データの追加処理など（省略）

# 最小値のデータの取得
min_value = sorted_list[0]
```


ソート済みのためこのケースだと最小値を O(1) で取得できます。

また、データの追加も O(log n) で行えるため、ループの中で毎回 `min(list)` を呼ぶよりも高速化が期待できます。

## まとめ
sortedcontainers は Python のソート済みコンテナのライブラリで、データの追加や取得が高速に行えるため、特定の要件においてパフォーマンスを向上させることができます。
パフォーマンスチューニングの際に、特にリストの中で最小値 (もしくは最大値) を頻繁に取得するようなケースでは、非常に有用です。
