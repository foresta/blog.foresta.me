+++
title="TypeScript の型がよくて、型の良さを再認識した話"
date="2020-07-12T13:42:55+09:00"
categories = ["engineering"]
tags = ["typescript"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

以前、[Swift の Enum と代数的データ型](/posts/swift_enum_and_adt) という記事で、Swift が Enum で代数的データ型を表現できて良いという内容の記事を書きました。

最近仕事で TypeScript を触ることが増えてきて、その型まわりがとても良い感じに思えたのでまとめてみます。

## 直和型

TypeScript では以下のように表現できます。

```typescript
// 文字列 と 数値 がとりうる
type A = number | string;

// 文字列、数値、あるいは null
type NullableA = A | null;
```

## 列挙型

TypeScript では、enum も用意されていますが、上記のような直和型で表現することがもできます。

```typescript
// enum の場合
enum Color {
  Red = 'Red',
  Blue = 'Blue',
  Green = 'Green',
}

// Union Type (直和型) の場合
type Color = 'Red' | 'Blue' | 'Green';
```

## 直積型

直積は通常の 構造体のようなもので表現されるものです。

```typescript
type A = {
  count: number;
  color: Color;
};
```

## 交差型

もうひとつ、TypeScript で交差型という概念があります。複数の型をひとつに連結したような方になります。

```typescript
type A = {
  count: number;
  color: Color;
};

type B = {
  text: string;
};

type C = A & B;

/**
以下と同じ型
type C = { 
    count: number;
    color: Color;
    text: string;
}
*/
```

共通のパラメータとかは、interface と継承ではなく、交差型を使って定義していくとよさそうです。

## 型が嬉しい使用例

例えば、いろいろなパラメータを付与してログを送りたいといった場合に、以下のように型定義をしっかりすることで、コンパイル時にパラメータ不足や間違いなどをチェックすることができます。

```typescript
// ------------------
// 型定義
// ------------------
// 直和型でログの種類を定義
type Log = PageALog | PageBLog;

// 列挙型 として、ログのタイプを定義
type LogType = 'PageA' | 'PageB';

// ページログの共通パラメータ
// ページのパス
type BaseParams = {
  path: string;
};

// 交差型で、共通パラメータを指定している
// type Hoge = BaseParams & { ... }


// PageA では itemId をおくる
type PageALog = BaseParams & {
  type: 'PageA';
  itemId: number;
};

// PageB では tag をおくる
type PageBLog = BaseParams & {
  type: 'PageB';
  tag: string;
};


// ------------------
// 使用側
// ------------------

function send(log: Log) {
  // ログ送信処理
}

send({ path: '/items', type: 'PageA', itemId: 1}); // OK
send({ path: '/tags', type: 'PageB', 'tag'}); // OK
send({ path: '/items', type: 'PageA'}) // itemId がないのでコンパイルエラー
send({ path: '/items', type: 'PageA', tag: 'tag name'}); // PageA では tag を必要としないのでコンパイルエラー
```

## まとめ

今回は TypeScript の型まわりが非常に使いやすかったのでまとめてみました。

上記の例のように、実際のプロダクトでもログ定義をしっかり行った結果、コンパイル時にチェックしてくれる安心感を得ることができて非常に良いと思います。
ログの種類が増えると、定義もメンテナンスも大変ですがそれ以上に、一部の不具合を事前に型で防ぐことができるのはとても良い仕組みだと思いました。

型をしっかり使用し、できるだけコンパイラが検知できるようにし、未然にバグを防ぐことができると最高ですね。
