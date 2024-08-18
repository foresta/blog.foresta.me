+++
title="jq で文字列の大文字・小文字の変換をする"
date="2024-08-18T23:18:57+09:00"
categories = ["engineering"]
tags = ["jq"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

[前回](/posts/jq-filter-null-values/) に引き続き jq の Tips です。

今回は、jq を使って大文字小文字を変換する方法を紹介します。

## 大文字・小文字の変換

jq で大文字・小文字の変換をするには、`ascii_upcase` と `ascii_downcase` を使います。

以下のような JSON データを例にして考えます。

```json
{
  "name": "Alice",
  "age": 20,
  "address": {
    "street": "123 Main St",
    "city": "Wonderland"
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "555-1234"
    }
  ],
  "isActive": true,
}
```

大文字の `name` カラムを抽出するためには以下のようにします。 

```bash
$ cat sample.json | jq '.name | ascii_upcase'
```

小文字の場合は以下です。

```bash
$ cat sample.json | jq '.name | ascii_downcase'
```

## おまけ。その他の文字列処理

jq には他にも文字列処理に便利な関数があります。

```bash
$ cat sample.json | jq '.name'
"Alice"

# 指定した文字で始まるかどうかをチェック
$ cat sample.json | jq '.name | startswigh("A")'
true
$ cat sample.json | jq '.name | startswigh("B")'
false

# 指定した文字でおわるかどうかをチェック
$ cat sample.json | jq '.name | endswith("e")'
true
$ cat sample.json | jq '.name | endswith("i")'
false

# 文字列を先頭、末尾から除外
$ cat sample.json | jq '.name | rtrimstr("e")'
"Alic"
$ cat sample.json | jq '.name | ltrimstr("A")'
"lice"
```

## まとめ

今回は、jq の Tips として、文字列周りの処理について紹介しました。jq を知っているとちょっとしたスクリプトを書くのが非常にラクになるので覚えておいて損はなさそうです。
