+++
title="TypeScript の Type Guard について"
date="2020-10-04T22:08:13+09:00"
categories = ["engineering"]
tags = ["typescript"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，TypeScript の Type Guard について簡単にまとめます．

## Type Guard について

例えば，ある API にリクエストを投げてその結果を取得するようなユースケースを想定します．

以下のような型定義が考えられると思います．

```ts
type APIError = {
  // ...
}

type Data = {
  // ...
}

type SuccessResponse = {
  data: Data;
}

type FailureResponse = {
  error: APIError;
}

type Response = SuccessResponse | FailureResponse;
```

この場合，たとえば 成功時のデータを取得する場合は，以下のようにキャストする必要があります．

```ts
const response: Response = api.request();

if (response as SuccessResponse) {
  const data = (response as SuccessResponse).data;
}
```

Type Guard を使用すると，型チェックと，方の推論が自動で行われてシンプルに記述することが出来ます．

具体的には，以下のように Response の型を拡張します．

```ts
type SuccessResponse = {
  isSuccess: true;
  data: Data;
}

type FailureResponse = {
  isSuccess: false;
  error: APIError;
}
```

そして以下のようなチェックの関数を用意します．

```ts
function isSucess(
  response: SuccessResponse | FailureResponse
): response is SuccessResponse {
    return (response as SuccessResponse).isSuccess === true;
}
```

これらを利用すると以下のように，利用することが出来ます．

```ts
const response: Response = api.request();

if (isSuccess(response)) {
  // SuccessResponse と推論される
  const data = response.data;
} else {
  // FailureResponse と推論される
  console.log(response.error);
}
```

## まとめ

今回は，Type Guard についてまとめてみました．

Type Guard もそうですが，TypeScript 触っているとなかなか書き心地が良くて気持ち良いですね．

#### 参考

- https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards 
