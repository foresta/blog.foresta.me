+++
date = "2015-01-29"
title = "coocs2d-xでの座標系について"

categories = ["engineering"]
tags = ["cocos2d-x"]

+++


cocos2d-xの座標系でつまずいたのでメモ。

タッチイベントを取得する際に,`getLocationInView`で判定していたらどうも思い通りの挙動にならない現象が起きてた。
具体的にはy座標が反転してしまうようだった。

結論からいうと、`getLocationInView`でなく、`getLocation`を用いれば左下からの座標で取得できた。

調べると、基本的にcocos2d-xで用いられているのは、OpenGL座標系で「左下」が原点らしい。

cocos2d-xのリファレンスをみると、座標系を取得するメソッドとして、`Touch`クラスの`getLocation`と`getLocationInView`がある。

（以下[リファレンス](http://www.cocos2d-x.org/reference/native-cpp/V3.0alpha0/d8/d2a/classcocos2d_1_1_touch.html#aa03f42060cbbba794ce0e1d107499258)から引用）

```
Point getLocation() const

  returns the current touch location in OpenGL coordinates.

Point getLocationInView() const

  returns the current touch location in screen coordinates.
```

なるほど。座標系の違いでメソッドが分かれているのか。

やっぱりリファレンスちゃんと見なきゃだめだなと思いました。
