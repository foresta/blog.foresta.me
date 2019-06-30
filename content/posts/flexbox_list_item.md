+++
title = "Flexboxで良い感じのリストアイテムを作成する"
thumbnail = ""
tags = ["css", "flexbox", "scss"]
categories = ["engineering"]
date = "2019-06-30"
+++

こんにちは、[kz_morita](https://twitter.com/kz_morita)です。\
普段は iOS エンジニアとして Swift を書いたり、Vue.js / Nuxt.js あたりで Web フロントを書いたりしているエンジニアです。

今回は、CSS の Flexbox を使って以下のような良く見る感じのリストを作ってみます。

{{< figure src="/images/posts/flexbox_list_item/list.png" >}}

## 先に結論

以下のように書くことで実現できました。

<script async src="//jsfiddle.net/kz_morita/drzvjgho/embed/html,css,result/"></script>

以下順番に説明をしていきます。\
なおスタイルは SCSS で書いています。

## HTML を用意する

まず以下のような HTML を用意します。

```html
<ul>
  <li>
    <img
      src="https://picsum.photos/80/80"
      class="thumbnail"
      width="80"
      height="80"
    />
    <span class="text">テキスト1</span>
  </li>
  <li>
    <img
      src="https://picsum.photos/80/80"
      class="thumbnail"
      width="80"
      height="80"
    />
    <span class="text"
      >テキスト2/テキスト2/テキスト2/テキスト2/テキスト2/テキスト2</span
    >
  </li>
  <li>
    <img
      src="https://picsum.photos/80/80"
      class="thumbnail"
      width="80"
      height="80"
    />
    <span class="text"
      >テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/テキスト3/</span
    >
  </li>
</ul>
```

表示するともちろん以下のように何も修飾されていない HTML が表示されます。

{{< figure src="/images/posts/flexbox_list_item/step1.png" >}}

ここから CSS を当てていきます。

## flexbox を適応させる

```scss
ul {
  padding: 0;

  li {
    display: flex;
    justify-content: flex-start;
    list-style: none;
    margin-bottom: 8px;

    .thumbnail {
    }

    .text {
    }
  }
}
```

まず、横に並べたい `.thumbnail` クラスと `.text` クラスの親要素の `li` に対して、 `display: flex;` を指定してあげます。このことにより子要素を横並びに並べることができます。

`justify-content: flex-start` は横並びの要素の並び方を指定するものです。\
flex-start で左詰めになるように指定しています。

詳しくはこちらのサイトが非常に参考になりました。\
https://www.webcreatorbox.com/tech/css-flexbox-cheat-sheet

ここまでで以下のような表示になるはずです。

{{< figure src="/images/posts/flexbox_list_item/step2.png">}}

## grow, shrink, basis の指定

上記のスクショでは、画像がテキストに押しつぶされてしまっています。\

この問題を解決するために以下のような記述を追加します。

```scss
ul {
  li {
    .thumbnail {
      flex: 0 0 80px;
    }

    .text {
      flex: 1 1 auto;
    }
  }
}
```

結果は以下の通りです。画像が潰されなくなっているかと思います。

{{< figure src="/images/posts/flexbox_list_item/step3.png">}}

この画像が潰れる現象は以下の 3 つのプロパティに関連があります。

- flex-grow
- flex-shrink
- flex-basis

#### flex-grow

指定した要素が他の要素に対してどのくらい伸びるかを指定します。
0 が初期値で、0 を指定すると伸びなくなります。

```scss
.text {
  flex-grow: 1;
}
```

#### flex-shrink

指定した要素が他の要素に比べてどのくらい縮むかを指定します。1 が初期値で 0 を指定すると縮まなくなります。

今回は thumbnail クラスにこの flex-fhrink の指定がなかったため、初期値の 1 が反映されて縮むようになってしまっていました。

```scss
.thumbnail {
  flex-shrink: 0;
}
```

#### flex-basis

指定した要素のベースとなる幅を指定します。デフォルト値は auto になります。

```scss
.thumbnail {
  flex-basis: 80px;
}
```

### 一括指定

flex-grow, flex-shrink, flex-basis は一括で指定することができます。

`flex: {flex-grow} {flex-shrink} {flex-basis}` という文法で一括指定が可能です。

上記の CSS では、3 つ一気に指定をしていました。

```scss
.thumbnail {
  flex: 0 0 80px;
}

.text {
  flex: 1 1 auto;
}
```

## 微調整

padding と background-color を調整します。

```scss
ul {
  li {
    background-color: #eee;

    .text {
      padding: 5px 10px;
    }
  }
}
```

以下のようになります。当初の目標に近づいてきました。

{{< figure src="/images/posts/flexbox_list_item/step4.png" >}}

## テキストを縦方向に中央揃え

テキストを中央揃えにしたい場合は、以下のように記述します。

```scss
.thumbnail {
  align-self: start;
}

.text {
  align-self: center;
}
```

{{< figure src="/images/posts/flexbox_list_item/step5.png" >}}

#### align-self

align-self プロパティで子要素の垂直方向にどのようにそろえるかと言った指定ができます。
start が上揃え、center が中央揃えです。

## テキストを少し上にずらす

テキストの位置を若干上下にずらしたいなどの場合は、以下のように margin をいれてあげれば大丈夫です。

```scss
.text {
  margin-bottom: 20px;
}
```

{{< figure src="/images/posts/flexbox_list_item/step6.png" >}}

無事それっぽく表示することができました。

## まとめ

flexbox を使ってよく見る感じのリストを作ってみました。\
CSS は意外と奥が深かったり色々な表現が可能だったりするので、その都度調べてまとめていこうと思います。

ちなみに、今回仮画像に使用している https://picsum.photos というサイトがすごく便利なのでおすすめです。

### 参考サイト

https://www.webcreatorbox.com/tech/css-flexbox-cheat-sheet
