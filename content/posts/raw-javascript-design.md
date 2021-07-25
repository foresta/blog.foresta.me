+++
title="生 JavaScript での設計とモジュールシステムなどの所感"
date="2021-07-25T21:02:40+09:00"
categories = ["engineering"]
tags = ["javascript", "design"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

最近は実際のプロジェクトなどだと、React などのライブラリを使うことが多くあまり生の JavaScript を使う機会は減ってきました。
久しぶりに、生の JavaScript を結構な量のコードを書いたので設計について思ったことを書いていきます。

## ファイルは分割したい

ある程度クライアント側でリッチな機能を実装しようとすると、JavaScriptのコード量は増えてくると思います。
自分が最近関わっているプロジェクトとして、svg を JS から操作して GUI ツールのような機能を実装するものがありました。

コード量が多くなってくると当然、コードをどういった単位でモジュール化するかといった点が気になってきますが、その前にファイル分割はどうしても欲しいなと思います。

となってくるとモジュールバンドルのシステムは欲しいところです。

下記のように、HTML側で複数のJavaScript を読み込むことも考えられますが JavaScript 上で依存関係が見えにくくなるので厳しいです。

```html
<html>
  <head>
  </head>
  <body>
    <script src="/scripts/a.js"></script>
    <script src="/scripts/b.js"></script>
    <script src="/scripts/main.js"></script>
  </body>
</html>
```

そのため webpack などの仕組みは必須かと思います。

## モジュールの設計について

基本的には、`class` で設計するのが良いと思います。class は ES2015 の構文なので対応ブラウザが大丈夫な場合はそのまま使えますし、使えない場合も Babel などを用いてトランスパイルすれば問題なく使えます。
個人的には、TypeScript が型の設計をする上ではかなり使いやすいので好きです。

一方でプロジェクトによっては、ES2015 も TypeScript も使わないところもあるかもしれません。

その場合は、Object や Function していくのが良さそうかなと思ってます。

インスタンスを複数作ったりする必要のない場合は、下記のように JavaScript の Object で表現するのが良さそうです。

```javascript
const Hoge = {
    member1: "Hello",
    member2: "World",
    func: function(arg) {
        return `${this.member1} ${this.membner2}, ${arg}`;
    }
};

console.log(Hoge.func("taro")); // Hello World, taro
```

複数インスタンスを作りたいケースには、function で表現するのが良さそうです。

```javascript
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}

var mycar = new Car('Eagle', 'Talon TSi', 1993);
```

上記のコードは、{{< exlink href="https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/new" text="MDN" >}} のサイトから引用しました。

webpack などのモジュールバンドルシステムを使っていれば、`import, export` や、`require, module.exports` が使えると思うので、そのファイル外に公開したいクラスなどだけを export することである程度カプセル化も行えるかなと思います。


## 最後に

フロントエンド専業でやっていないと設計周りの話、特にモジュールやクラス設計などについては基礎力が必要だなと痛感します。

簡単なサービスや、他の人が設計した React を触るというケースなどではとりあえず React についてざっくりと理解していればコードはかける状態になると思うのですが、1 から構築する場合や複雑なアプリケーションを実装する際にどのように構築するかは自分には難しい問題です。
特に、JavaScript のモジュールシステムについての理解が曖昧だったなと今回の 生 JavaScript でコードを書く際に痛感しました。

下記のような、CJS (CommonJS) やESM (ES Modules) などについて、もう少し理解を深めたいと思います。
- {{< exlink href="https://postd.cc/the-state-of-javascript-modules/" >}}
- {{< exlink href="https://www.slideshare.net/teppeis/nodejs-esm-final-season" >}}


