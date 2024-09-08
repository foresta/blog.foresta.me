+++
title="jq で正規表現を利用した置換"
date="2024-09-08T15:27:24+09:00"
categories = ["engineering"]
tags = [""]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

jq で正規表現を使う方法について書いていきます。


## jq での正規表現


今回も以下のような JSON を対象にします。

```JSON
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
  "isActive": true
}
```

jq には以下のような正規表現を使える関数が用意されています。


- test
- match
- capture
- scan
- split
- sub
- gsub

たとえば、正規表現にマッチするかどうか見たい場合は以下のように `test` 関数をつかうことができます。
```
$ cat sample.json | jq '.phoneNumbers[].number | test("^\\d{3}-\\d{4}$")'
true
```

置換をしたい場合は jq の関数に、`sub` と `gsub` が用意されていてこれで正規表現を用いることができます。

たとえば、streent の最後の `St` を削除するような置換の例は以下のようにかけます。

```bash
$ cat sample.json | jq '.address.street | sub("(?<a>\\d+ \\w+) St"; "\(.a)")'
"123 Main"
```

そのまま代入したければ以下のようにかけます。

```
$ cat sample.json | jq '.address.street |= sub("(?<a>\\d+ \\w+) St"; "\(.a)")'
{
  "name": "Alice",
  "age": 20,
  "address": {

    "street": "123 Main",
    "city": "Wonderland"
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "555-1234"
    }
  ],
  "isActive": true
}
```

この辺は以前書いた、[JSONの更新についての記事](/posts/jq-update-json/) を参考にしてみてください。

## まとめ

今回は、jq で正規表現を使う方法と、置換する方法についてまとめました。

JSON の加工は一通りのことができそうなのでやはり jq は便利です。
