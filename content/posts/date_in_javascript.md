+++
title="JavaScript の日付について"
date="2020-07-19T22:59:08+09:00"
categories = ["engineering"]
tags = ["javascript", "date"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

最近 Web フロントの実装をすることが多いのですが，JavaScript の日付についてちょっと躓いたことがあったのでまとめます．


## JavaScript の日付型

JavaScript では，Dateクラスを用います．

{{< exlink href="https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date" text="MDN web docs - Date" >}}


`Data` の生成は以下のように行います．

```javascript
const date1 = new Date('2020-01-02T03:45:00Z');
const date2 = new Date(2020, 1, 2, 3, 45);
```

一見すると，両方とも `2020年 1月2日 3時45分` を指しているようですが，実は異なります．

date1 は `2020年 1月2日 3時45分` ですが，data2 は `2020年 2月2日 3時45分` を指します．

JavaScript の Date では，月 (month) は 0 ~ 11 の数値で指定します．


この仕様に気づかなくて，月が1ヶ月ずれるという不具合がありました．

ちなみに，上記の date1, date2 に対して `Date.prototype.getMonth()` メソッドを呼ぶと結果は以下のようになります．

```javascript
const date1 = new Date('2020-01-02T03:45:00Z');
date1.getMonth(); // 0 (1月)

const date2 = new Date(2020, 1, 2, 3, 45);
date2.getMonth(); // 1 (2月)
```

おそらく，月を，`Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec` のように表すときに，配列のindex のような扱いをするために便利だったのだと推測できますが，日本のような年月の表示形式だととても混乱する仕様になっているかと思いますので，注意が必要です．


## まとめ

JavaScript のDate型における月の扱いについて簡単にまとめました．
多分 FrontEnd の開発を日頃から行っている人にとっては割とよく知れた問題なのかなとは思いますが，久しぶりに触ったら一瞬戸惑ってしまいました．




