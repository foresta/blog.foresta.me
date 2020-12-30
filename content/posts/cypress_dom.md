+++
title="CypressにおけるDOM要素の特定のベストプラクティス"
date="2020-12-30T20:44:45+09:00"
categories = ["engineering"]
tags = ["e2e", "cypress", "dom", "html", "babel"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Cypress を用いた E2E テストの DOM の特定方法についてまとめます。

## セレクターによる DOM の特定

通常、DOM を特定するのは、ID や Class やHTML要素を指定して行います。

JS では以下のような感じです。

```javascript
// ID 指定
var dom1 = document.querySelector('#id');

// クラス指定
var dom2 = document.querySelector('.hoge');

// 要素指定
var dom3 = document.querySelector('ul > li');
```

Cypress でDOM を特定するためにも同じような方法が用いられ、以下のように要素の取得をすることができます。

```javascript
cy.get("#id")
cy.find(".class")
```

しかし、DOM に ID や、class が振られていなくて要素の特定が難しいケースがあります。とくに、CSS in JS などで css 用に class を振っていない場合もあるかと思います。

実際に開発しているサービスでは、emotion というライブラリを用いていて、結果としてDOMの特定が難しいという問題がありました。 

また、クラスや要素で DOM を特定する方法は、DOM の構成が変わったりする場合に、E2E テストが変更に弱くなってしまったりします。

## テスト用の data 属性をつける

Cypress の公式 ドキュメントによると、テスト用の data 属性をつける方法が推奨されています。

{{< exlink text="Best Practices | Cypress Documentation" href="https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements" >}}

具体的には、以下のようにDOMに対して 属性をつけます。

```html
  <ul data-test="item-list">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
```

Cypress側では、以下のように要素を特定します。

```javascript
cy.get("[data-test='item-list']")
```

自分の環境では、以下のように Custom Command を用意しました。

```javascript
// cypress/support/commands.js
Cypress.Commands.add("getBySelector", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
})

// --------------------
// cypress/integration/hoge_spec.js
cy.getBySelector("item-list");
```

## Test環境以外で data 属性を削除

上記で、つけた `data-test` 属性は、Test用のもので、Production のコードからは削除されているのが理想です。

{{< exlink text="babel-plugin-react-remove-properties" href="https://www.npmjs.com/package/babel-plugin-react-remove-properties" >}} というプラグインを利用すると bebel のトランスパイル時に特定の attribute を削除することができます。

以下のような config でビルド時に削除することができます。

#### babel.config.js
```javascript
module.exports = (api) => {
  // ...
  // ..
  // .
  const config = {
    presets: [
        // ...
    ],
    plugins: [
        // ...
    ],
  }

  if (precess.env.NODE_ENV !== 'e2e') {
    // E2E テスト以外の環境では、data-test という attribute は削除
    config.plugins.push(["react-remove-properties", {"properties": ["data-test"]}])
  }

  return config;
} 
```

上記では、e2e の環境かどうかで判定してますが、production ビルドだったら削除するといった判定でも良いかと思います。

## まとめ

Cypress で DOM を特定するベストプラクティスについてまとめました。

E2E テストは、だんだんメンテナンスされなくなってきてしまうことが多いと思っているので、できるだけ管理しやすいよう維持することが重要だと考えてます。

品質を担保して安全にデリバリーできるような環境をつくっていけるようにしていきたいですね。

