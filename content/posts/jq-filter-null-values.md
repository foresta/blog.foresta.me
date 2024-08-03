+++
title="jq で値が null のカラムを除外する"
date="2024-08-03T17:57:40+09:00"
categories = ["engineering"]
tags = ["jq", "tips"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は jq を使っていて、Json の null が入っているカラムを削除したいときの Tips をメモしておきます。

## 値が null のフィールドを削除する

以下のようにすると、null のフィールドを削除できます。

```
$ cat sample.json | jq 'to_entries | map(select(.value != null)) | from entries'
```

以下解説です。


まず今回の対象の json は以下のようなものです。

```json
{
  "name": "Alice",
  "age": null,
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
  "preferences": null

}
```

これが上記のコマンドを使用すると以下のようになります。

```json
{
  "name": "Alice",
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

preferences と age カラムが消えていることがわかります。

コマンド一つずつ見ていくと、まず to_entries をすると、key, value ごとにデータを変換することができます。

```bash
$ cat sample.json | jq to_entries
[
  {
    "key": "name",
    "value": "Alice"
  },
  {
    "key": "age",
    "value": null
  },
  {
    "key": "address",
    "value": {
      "street": "123 Main St",
      "city": "Wonderland"
    }
  },
  {
    "key": "phoneNumbers",
    "value": [
      {
        "type": "home",
        "number": "555-1234"
      }
    ]
  },
  {
    "key": "isActive",
    "value": true
  },
  {
    "key": "preferences",
    "value": null
  }
]
```

配列の形になったので、`map` と `select` を用いてフィルターします。
select 関数を配列に適用するために map で実行するイメージです。

```bash
$ cat sample.json | jq 'to_entries | map(select(.value != null))'
[
  {
    "key": "name",
    "value": "Alice"
  },
  {
    "key": "address",
    "value": {
      "street": "123 Main St",
      "city": "Wonderland"
    }

  },

  {
    "key": "phoneNumbers",
    "value": [
      {
        "type": "home",

        "number": "555-1234"
      }
    ]
  },
  {
    "key": "isActive",
    "value": true
  }
]
```

最後にこれを元の形状にもどすために、from_entries を用いてフィルターします。

```bash
$ cat sample.json | jq 'to_entries | map(select(.value != null)) | from entries'
{
  "name": "Alice",
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

## まとめ

jq コマンドの tips を今回はまとめました。jq コマンドかなりできることが多く、便利なため基本的にインストールして使っています。
他にも関数や便利なオプションなどあるので一度目を通すと面白いと思います。

- {{< exlink href="https://jqlang.github.io/jq/" >}}
