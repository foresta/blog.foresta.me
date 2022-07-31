+++
title="Terraform で for_each 使って loop 処理を書く"
date="2022-07-31T19:53:22+09:00"
categories = ["engineering"]
tags = ["terraform"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Terraform で AWS リソースなどを管理しているときに、同じリソースをまとめてつくるときに繰り返し処理に `for_each` などが使えそうだったのでまとめます。

## for_each でループする

たとえば、1 と 2 などのナンバリングされた ECS Service など作るときは以下のように変数を用意して for_each で参照することができます。

```tf
var {
  number = [1,2]
}

resource "aws_ecs_service" "ecs_service" {
  for_each = to_set(var.number)

  name = "ecs_service_${each.value}" # ecs_service_1, ecs_service_2
}
```

`each.value` で値にアクセスすることができます。

上記の例では、toset で set 型にしているので、`each.key` でも同じ値が取得できます。

同様に map 型でも以下のようにルー処理を書くことができます。

```tf
var {
  number_map = {
    "1" = "hoge"
    "2" = "fuga"
  }
}

resource "aws_ecs_service" "ecs_service" {
  for_each = var.number_map

  name = "ecs_service_${each.key}_${each.value}" # ecs_servce_1_hoge, ecs_service_2_fuga
}
```

map の場合は、`each.key` と `each.value` で map の key と value の値がそれぞれとれます。

## map 型の値を key で取得する

map の値を key から取得するには、lookup 関数を使います。

```tf
var {
  number = [1,2]
  number_map = {
    "1" = "hoge"
    "2" = "fuga"
  }
}

resource "aws_ecs_service" "ecs_service" {
  for_each = var.number

  name = "ecs_service_${each.value}_${lookup(var.number_map, each.value)}" # ecs_servce_1_hoge, ecs_service_2_fuga
}
```

lookup で第二引数に key の値を渡すと value の値を引くことができます。

## まとめ

terraform でループ処理を各方法についてまとめました。このあたりをつかえば似たようなリソースをコピペでつくるなどせずにうまく管理できそうなのでこういった機能は積極的に使っていきたいと思いました。

- {{< exlink href="https://www.terraform.io/language/meta-arguments/for_each" >}}


