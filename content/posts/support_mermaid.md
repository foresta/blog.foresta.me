+++
date = "2019-06-02"
title = "図形の描画にmermaidを導入した"

categories = ["engineering"]
tags = ["mermaid", "blog"]
+++


こんにちは、[kz\_morita](https://twitter.com/kz_morita)です。\

ブログに図形を描画する機能を実装したいなぁと思ったので、色々調べた結果 [mermaid](https://mermaidjs.github.io/) というツールが良さそうだったので Hugoに導入してみました。

以下のような図形が割と簡単にかけるので非常におすすめです。

{{< mermaid >}}
graph LR;
    A-->B;
{{< /mermaid >}}

公式サイト
: https://mermaidjs.github.io

Hugoを使っていて、図形を描画してみたいといった方は参考にしていただけるかと思います。

## npmでインストール、そしてshortcode作成

インストールは以下のコマンドでサクッと行いました。

```bash
$ npm i mermaid
```

自分はwebpackとbabelでjsをビルドしているので、導入にあたっては以下のサイトを参考にしました。
https://github.com/mermaidjs/mermaid-webpack-demo

そして、entry.jsに以下のように mermaidの初期化の処理を書きます。

```js
import mermaid from "mermaid"

mermaid.initialize({startOnLoad:true})
```

以上で導入は終わりです。サクッと簡単ですね！


そして、Hugoで簡単に図形を書くために以下のようなshortcodeを作成しました。

##### mermaid.html
```html
<div class="diagrams">
<div class="mermaid" align="{{ if .Get "align" }}{{ .Get "align" }}{{ else }}center{{ end }}" >{{ safeHTML .Inner  }}</div>
</div>
```

冒頭で紹介したグラフであれば、以下のように記述することができます。
```
{{</* mermaid */>}}
graph LR;
    A-->B;
{{</* /mermaid */>}}
```

## 様々な図形がかける

結構色々な図形がかけるみたいなので、いくつか抜粋して紹介します。

### フローチャート 

```
{{</* mermaid */>}}
graph TD;
    処理A-->処理B; 
    処理B-->if{分岐};
    if-->処理C;
    if-->処理D;
    処理C-->処理E;
    処理D-->処理E;
{{</* /mermaid */>}}
```

{{< mermaid >}}
graph TD;
    処理A-->処理B; 
    処理B-->if{分岐};
    if-->処理C;
    if-->処理D;
    処理C-->処理E;
    処理D-->処理E;
{{< /mermaid >}}

### シーケンス図

```
{{</* mermaid */>}}
sequenceDiagram
    participant クラスA
    participant クラスB
    クラスA->>クラスC: call()
    loop Loop 
        クラスC->クラスC: call self 
    end
    Note right of クラスC: ノートも<br/>書けるみたい
    クラスC->>クラスA: method1()
    クラスC->>クラスB: method2()
    クラスB-->>クラスC: callback
{{</* /mermaid */>}}

```

{{< mermaid >}}
sequenceDiagram
    participant クラスA
    participant クラスB
    クラスA->>クラスC: call()
    loop Loop 
        クラスC->クラスC: call self 
    end
    Note right of クラスC: ノートも<br/>書けるみたい
    クラスC->>クラスA: method1()
    クラスC->>クラスB: method2()
    クラスB-->>クラスC: callback
{{< /mermaid >}}

### クラス図

```
{{</* mermaid */>}}
classDiagram
   動物 <|-- 犬
   動物 <|-- 猫

   車 *-- タイヤ
   人 o-- カバン
{{</* /mermaid */>}}
```

```
{{< mermaid >}}
classDiagram
   動物 <|-- 犬
   動物 <|-- 猫

   車 *-- タイヤ
   人 o-- カバン
{{< /mermaid >}}
```

## まとめ

mermaidを導入して割と簡単に図形をブログに描画することができました。
シーケンス図と、クラス図の上下の余白とかちょっと気になりますが一旦よしとします。

Hugoを使っていて、図形を描画してみたいといった方はぜひ試してみてください。
