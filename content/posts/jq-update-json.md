+++
title="jq を使った JSON の更新について"
date="2024-08-19T00:01:00+09:00"
categories = ["engineering"]
tags = ["jq", "json", "tips"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

またまた、jq を使う際の Tops についての記事です。

JSON の値を更新したり、追加したりする方法について書いていきます。

## 代入演算子と更新演算子

jq には、代入演算子 (`=`) と更新演算子 (`|=`) があります。

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
  "isActive": true
}
```

この JSON に対して、`name` を更新する場合、代入演算子を使うと以下のようになります。

```bash
$ cat sample.json | jq '.name = "Hoge"'
{
  "name": "Hoge",
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

更新演算子でも同様に更新できます。

```bash
$ cat sample.json | jq '.name |= "Hoge"'
{
  "name": "Hoge",
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

代入演算子と更新演算子の違いは、ほとんどなさそうなのですが違いが出る例が公式サイトに記載されていました。
興味がある方はみてみると楽しそうです。

- {{< exlink href="https://yujiorama.github.io/unofficial-translations/jq/l10n/jp/manual/" >}}

## 算術自己代入演算子

算術自己代入演算子には `+=`, `-=`, `*=`, `/=`, `%=` のようなものがあります。

以下は Age に 1 を加算する例です。

```bash
$ cat sample.json | jq '.age += 1'
{
  "name": "Alice",
  "age": 21,
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

このように普通のプログラミング言語のように計算をすることもできそうです。

## まとめ

今回は jq を用いて JSON の値を更新する方法について書きました。
最近 AWS CLI で AWS リソースを操作することが多いのですが jq を使うとコマンドラインで色々なことが実現できるので非常に便利でした。

