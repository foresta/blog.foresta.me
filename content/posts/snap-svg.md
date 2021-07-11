+++
title="Snap.svg で手軽にSVGを描画する"
date="2021-07-11T23:07:59+09:00"
categories = ["engineering"]
tags = ["svg", "javascript", "snap-svg", "snap"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，SVG を JavaScript から簡単に扱える，{{< exlink href="http://snapsvg.io/" text="Snap.svg" >}} について紹介します．

## Snap.svg とは

Snap.svg は，adobe が オープンソースで提供している，SVG ライブラリで，JavaScript から手軽に SVG の操作ができます．

- http://snapsvg.io/

### Snap.svg の使い方

まずは，SVGを描画するために，空の `<svg>` タグを用意します．

```html
<svg id="svg">
</svg>
```

これで，HTML側は準備OKです．
次に，JavaScript側から該当の svg に対して四角を書いてみます．

```js
const s = Snap('#svg');

// 左上 (10, 10) の座標に，(40, 40) の大きさの四角を描画
s.rect(10, 10, 40, 40);
```

上記のように，`Snap('#svg')` とすると，id が `svg` の svg タグを取得し，準備をします．

四角形などを描画をするのは簡単で，`s.rect` を呼び出せばそれだけで描画されます．


他にも便利な機能として，描画した svg の Element を簡単に Drag & Drop できるようにすることができます．
以下のように，`drag()` メソッドを呼び出すだけです．

```
s.rect(10, 10, 40, 40);
s.drag();
```

すべては把握できていないですが，このような便利な関数などが多く用意されています．

今回はこれらを組み合わせることで比較的少ないコードで以下のツールのような動きを作ることが出来ました．

{{< figure src="/images/posts/snap-svg/svg-sample.gif" >}}

CSS なども別途書いていますが，ざっくりと JavaScript のコードを載せてみます．

```js
  const s = Snap('#svg');

  let draggedContents = null;
  let totalDragging = 0;
  const dragStarted = function(x, y, e) {
    // タッチ座標に小さな四角を描画
    const rect = s.rect(e.layerX, e.layerY, 1, 1);

    // 色などの指定
    rect.attr({ stroke: '#f00', strokeWidth: 2, fill: '#f00', "fill-opacity": 0.5 });

    // 配置した四角もドラッグできるようにする
    rect.drag();

    draggedContents = rect;
  };

  const dragging = function(dx, dy, x, y, e) {
    if (draggedContents == null) {
      return;
    }

    // 座標の負の方向にドラッグされたときは，始点を変更する
    let rectX = dx < 0 ? dx : 0;
    let rectY = dy < 0 ? dy : 0;
    draggedContents.transform("t" + [ rectX, rectY ]);
    
    // ドラッグ中に四角の大きさを変更
    let a_dx = Math.abs(dx);
    let a_dy = Math.abs(dy);
    draggedContents.attr({ width: a_dx, height: a_dy });

    // どれくらい動いたか保持
    totalDragging += a_dx;
    totalDragging += a_dy;
  };

  const dragEnded = function(e) {
    if (draggedContents == null) { return; }

    if (totalDragging < 5) {
      // 全然ドラッグされてないときは，50x50 の四角を描画
      draggedContents.attr({ width: 50, height: 50 });
    }

    draggedContents = null;
    totalDragging = 0;
  }

  // svg 全体をドラッグできるようにする
  s.drag(dragging, dragStarted, dragEnded);
});
```

それぞれの関数の使い方などは，{{< exlink href="http://snapsvg.io/docs/" text="公式ドキュメント" >}} を参照してみてください．

また，やりたい動作をどのように実現するか迷ったときは下記のサイトたくさんの Sample があるので参考にしてみてください．

- http://svg.dabbles.info/


## まとめ

今回は，Snap.svg について簡単に紹介しました．

図形の描画は，Retina ディスプレイなどの登場により，vector画像である SVG で行うケースが増えてきたと思います．

そのままだと少し扱いづらい面もありますが，このようなライブラリをつかえばある程度楽に操作できるので，必要な方は導入を検討してみるのも良さそうです．

