+++
title="Regex の replaceAllIn で出るIllegal group reference エラーについて"
date="2023-06-18T17:36:49+09:00"
categories = ["engineering"]
tags = ["scala", "java", "regex"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala (Java) で正規表現クラスを使っている際に遭遇したエラーについてまとめます。

## Illegal group reference エラーについて

Scala で以下のような正規表現を使用するコードを書いていました。

```scala
import scala.util.matching.Regex

val regex = "【(.*)】".r
val replacer = (m: Regex.Match) => "(" + m.group(1) +")"
regex.replaceAllIn("hogehoge【fuga】", replacer) // hogehoge(fuga)
```

`【】` を`()` に変換するといったようなコードです。

上記は正常に動くのですが、以下のようなテキストは正常に動きません。

```scala
regex.replaceAllIn("hoge【$abcde】", replacer)
```

上記は、以下のような Illegal group reference エラーが出ます。

```
java.lang.IllegalArgumentException: Illegal group reference
    at java.base/java.util.regex.Matcher.appendExpandedReplacement(Matcher.java:1067)
    at java.base/java.util.regex.Matcher.appendReplacement(Matcher.java:907)
    at scala.util.matching.Regex$Replacement.replace(Regex.scala:898)
    at scala.util.matching.Regex$Replacement.replace$(Regex.scala:898)
    at scala.util.matching.Regex$MatchIterator$$anon$4.replace(Regex.scala:876)
    at scala.util.matching.Regex.$anonfun$replaceAllIn$1(Regex.scala:512)
    ...
```

## エラーの原因


`"【(.*)】".r` という正規表現で `【】` の中身の文字列をキャプチャするのですが、その中に、`$` 記号がある場合にそれを正規表現の置換対象とみなしてしまうようです。

どういうことかというと、`hoge【$abcde】` というテキストだと、【】の中の `$abcde` というテキストが、マッチしますがその中の `$a` という部分が後方参照で置換する対象だと解釈してしまいます。
しかし `$a` というのは、参照できないため `Illegal group reference` エラーになります。


同様に以下のようなケースで意図しない挙動をします。

```scala
regex.replaceAllIn("money【$10,000】", replacer) // => money($10,0000,000)
regex.replaceAllIn("money【$20,000】", replacer) // => java.lang.IndexOutOfBoundsException: No group 2
```

1 つめは、`$1` というのがたまたまうまく後方参照できてしまっているため、`$10,000` が `$1` と `0,000` で解釈され、$1 で後方参照される値が、`$10,000` なので、`money($10,0000,000)` となります。

２つ目は、`$2` というのが後方参照とみなされますが、キャプチャしているものが 1 つしかないため、`IndexOutOfBoundsException` が発生します。


## 対応方法

文字列から `$` をエスケープしてから正規表現による置換を行えばよいです。

```scala
val targetText = "money【$abcde】"
val preEscaped = targetText.replace("$", "\\$")
val replaced = regex.replaceAllIn(preEscaped, replacer)
val result = replaced.replace("\\$", "$")
println(result) // => money($abcde)
```


## まとめ

今回は、Scala (Java) の Regex クラスをの `replaceAllIn` メソッドで `$` が含まれるテキストを置換する際に出るエラーとその理由、対策方法についてまとめました。

きっとまた後々ハマることになりそうなのでメモとして残しておきます。
