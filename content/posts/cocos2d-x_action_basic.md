+++
thumbnail = ""
tags = ["cocos2d-x"]
date = "2018-09-02"
title = "Cocos2d-xのActionまとめ 基本編"
categories = ["engineering"]

draft=true

+++

Cocos2d-xでアニメーションを行うのによく用いるActionクラスをまとめました。

ソースコードはこちらから
https://github.com/foresta/ActionSample/blob/master/Classes/TestScene.cpp

基本編と応用編とイージング編に分けてまとめていきます。

## 環境

* OS X High Sierra
* Cocos2d-x 3.17

## アクションまとめ

#### Actionの基本

`Node::runAction(Action* action)`を用いてアクションを実行します。

ActionにはByとToが存在することが多いです。\
Moveの例で説明すると、MoveByが今のNodeの位置からどれだけ移動するかで、MoveToはどこに向かって移動するかになります。
相対的な指定と、絶対的な指定ができるイメージです。

状況に応じて使い分けましょう。

### Move

```cpp
void TestScene::move()
{
    // iconを(x: 50, y: 0)分だけ、1秒間かけて移動
    this->icon->runAction(MoveBy::create(1.f, Vec2(50.f, 0)));
}
```

{{< figure src="/images/posts/cocos2d-x_action_basic/move.gif" >}}

### Rotate 

```cpp

void TestScene::rotate()
{
    // iconを1秒かけて一回転
    this->icon->runAction(RotateBy::create(1.f, 360.f));
}

```

{{< figure src="/images/posts/cocos2d-x_action_basic/rotate.gif" >}}

### Scale

```cpp

void TestScene::scale()
{
    // iconを1秒かけて、2倍の大きさにする
    this->icon->runAction(ScaleBy::create(1.f, 2.f));
}

```

{{< figure src="/images/posts/cocos2d-x_action_basic/scale.gif" >}}


### Skew
```cpp

void TestScene::skew()
{
    // iconを1秒かけて、x方向に30だけ歪ませる
    this->icon->runAction(SkewBy::create(1.f, 30.f,0.f));
}

```

{{< figure src="/images/posts/cocos2d-x_action_basic/skew.gif" >}}

### Resize

```cpp
void TestScene::resize()
{
    // iconを1秒かけて、(x: 100, y: 50) だけ多くリサイズする
    this->icon->runAction(ResizeBy::create(1.f, Size(100,50)));
}
```

{{< figure src="/images/posts/cocos2d-x_action_basic/resize.gif" >}}

### Jump

```cpp
void TestScene::jump()
{
    // その場で5回、30の高さでジャンプさせる
    Vec2 position { Vec2::ZERO };
    float jumpHeight { 30.f };
    int count { 5 };
    this->icon->runAction(JumpBy::create(1.f, position, jumpHeight, count));
}
```


{{< figure src="/images/posts/cocos2d-x_action_basic/jump.gif" >}}

### Bezier

```cpp
void TestScene::bezier()
{
    // ベジエ曲線に乗っ取ってアニメーションさせる
    ccBezierConfig config {};
    config.endPosition = Vec2(50,0);     // 移動終了ポイント
    config.controlPoint_1 = Vec2::ZERO;  // ベジエ曲線のアンカー1 
    config.controlPoint_2 = Vec2(25,50); // ベジエ曲線のアンカー2
    
    this->icon->runAction(BezierBy::create(1.f, config));
}

```
{{< figure src="/images/posts/cocos2d-x_action_basic/bezier.gif" >}}

### Blink 

```cpp
void TestScene::blink()
{
    // 2秒間で5回点滅させる
    this->icon->runAction(Blink::create(2.f, 5));
}
```
{{< figure src="/images/posts/cocos2d-x_action_basic/blink.gif" >}}

### Fade 

```cpp
void TestScene::fade() 
{
    // 不透明度を0にしたのちに、2秒かかけて表示する(フェードイン)
    this->icon->setOpacity(0.f);
    this->icon->runAction(FadeTo::create(2.f, 255));

    // 以下のコードも同じ動きをする
    // this->icon->runAction(FadeIn::create(2.f)); 
}
```
{{< figure src="/images/posts/cocos2d-x_action_basic/fade.gif" >}}

### Tint

```cpp
void TestScene::tint()
{
    // 1秒間かけてiconを赤くする
    this->icon->runAction(TintTo::create(1.f, Color3B::RED));
}
```
{{< figure src="/images/posts/cocos2d-x_action_basic/tint.gif" >}}

## まとめ

今回紹介したメソッドは `cocos/2d/ActionInterval.cpp` に全て記載されているので、引数などに困ったら参照してみてください。

https://github.com/cocos2d/cocos2d-x/blob/v3/cocos/2d/CCActionInterval.cpp
