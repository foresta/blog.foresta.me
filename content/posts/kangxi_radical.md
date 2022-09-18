+++
title="Unicode の康熙部首(こうきぶしゅ) と Scala で検出する方法"
date="2022-09-18T19:58:07+09:00"
categories = ["engineering"]
tags = ["charcode", "文字コード", "unicode"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、康熙部首 (こうきぶしゅ) という特殊な文字についてのメモです。

## 気になったきっかけ

きっかけとしては、特定の文字列の中であるキーワードが含まれているかというよくあるプログラムの中で意図しない挙動をした際のデバッグでした。

具体的には以下のようなプログラムです。

```scala
def containMonth(txt: String): Boolean = {
  txt.contains("月")
}

val input_1 = "6月"
val input_2 = "一⽉"


println(s"input_1 = ${containMonth(input_1)}")
println(s"input_2 = ${containMonth(input_2)}")
```

期待する結果は、２回 true が表示されることでしたが、結果は以下のようになります。

```
input_1 = true
input_2 = false
```

## 原因


これは、`input_2` に含まれる「つき」の漢字が通常の文字ではなく、康熙部首 と呼ばれる特殊な文字であったために起こりました。

一見ほぼ見分けがつかないですが、まったく別の unicode で異なる漢字だったために、判定の結果 false となります。

| 文字 | unicode |
| --- | --- |
| 月 | \u6708 |
| ⽉ | \u2f94 |

康熙部首 の一覧は以下のサイトに記載されています。一般的な漢字も多いので注意が必要そうです。

- {{< exlink href="https://www.utf8icons.com/subsets/kangxi-radicals" text="KangXi Radicals unicode subset" >}}

これらの文字の検出ですが、`U+2F00〜U+2FDF` の間に定義されているためそれらを検知できればよさそうです。

Scala でコードを書くと以下のようになるかと思います。

```scala
val input_1 = "6月"
val input_2 = "一⽉"

def containMonth(txt: String): Boolean = {
  txt.contains("月")
}


// codepoint が 康熙部首 の範囲内かをチェック
def isKangxiRadical(codepoint: Int): Boolean = {
  // 2F00 ~ 2FDF
  0x2f00 <= codepoint && codepoint <= 0x2fdf
}

// 文字列に康熙部首が含まれているかをチェック 
def containsKangxiRadical(txt: String): Boolean = {
  (0 to txt.length() - 1)
    .map(i => txt.codePointAt(i))
    .exists(isKangxiRadical)
}


println("[contains month]")
println(s"input_1 = ${containMonth(input_1)}")
println(s"input_2 = ${containMonth(input_2)}")

println("[contains kangxi radical]")
println(s"input_1 = ${containsKangxiRadical(input_1)}")
println(s"input_2 = ${containsKangxiRadical(input_2)}")
```

これを実行すると以下のように検出することができます。

```
[contains month]
input_1 = true
input_2 = false
[contains kangxi radical]
input_1 = false
input_2 = true
```

## まとめ

今回は、康熙部首について概要と Scala コードで検出についてまとめました。
普段はあまり気にしなくてもよい箇所ではありますが思わぬ落とし穴となるところだと思うのでメモとして残しておきます。


