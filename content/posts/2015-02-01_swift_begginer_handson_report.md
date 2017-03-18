+++
date = "2015-02-01"
title = "Swift初心者向け勉強会に行ってきました"

categories = ["Engineering"]
tags = ["swift", "勉強会"]

+++

株式会社LIGさんの [いいオフィス](https://iioffice.liginc.co.jp/)で行われた
「超・超・超初心者向けSwiftを始めてみよう勉強会 Vol3」
に参加してきました。

http://swiftstarter.connpass.com/event/11105/

形式は説明を受ける→ハンズオンでコード書くという勉強会でした。

全くSwiftに触ったことのない自分でも非常にわかりやすかったです。


# 内容まとめ

## 第一回のおさらい

第一回は出席してなかったので、おさらいがあって助かりました。

### Variable Type

以下のように変数、定数は宣言する。Swiftは型推論できるので型名は省略可。

```swift
// 変数宣言
var foo: Int = 100
var bar = 100
foo = foo + 20 // => 120

// 定数宣言
let num = 100
// num = num + 20 => Error!
```

### View

UIKit.frameworkのViewオブジェクト。これらのViewを組み合わせてアプリを組み上げていく。

```
UIView, UIImageView, UITextView, UITextField, UILabel, UIButton ...
```

### Function

以下の用に定義する。戻り値の型を->の後に記述するのは新鮮。

```swift
func sum(var a: Int, var b: Int) -> Int {
    // 処理
    return a + b
}
```

## ViewControllerについて

ViewControllerとはその名の通りViewを管理するもので、
受け取ったデータをもとに、図形や文字などの操作を行う。

基本的な使い方は以下のような感じ。

```swift
import UIKit

class ViewControlle: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.

        // 背景色指定
        self.view.backgroundColor = .whiteColor()

        // ビューの生成（青色の正方形つくって表示）
        view1 = UIView(frame: CGRectMake(100, 100, 100, 100))
        view1.backgroundColor = .blueColor()
        self.view.addSubview(view1)
    }

    // メモリが危なくなったときに呼ばれる
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
```

UIViewControllerのviewに対して、viewを追加していき描画するイメージ。
１つのViewControllerで１つの画面を構成していく。

## Gesture Eventについて

ユーザの操作（指の動き）に対応する操作を実装するためのもの。
以下のような種類がある

```
Tap, Pan, Pinch, Rotate, Swipe, LogPress
```

以下のようにジェスチャーをViewに追加して実装する

```swift
class ViewControlle: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        var selector = Selector("tapGesture:")
        var tapRecognizer = UITapGestureRecognizer(target: self, action: elector)
                                                         
        // ビューの生成（青い正方形にタップイベント追加）
        view1 = UIView(frame: CGRectMake(100, 100, 100, 100))
        view1.backgroundColor = .blueColor()
        view1.addGestureRecognizer(tapRecognizer)
        self.view.addSubview(view1)
    }

    func tapGesture(gesture: UITapGestureRecognizer){
        // タップされた時の処理
    }
```

## Closureについて

以下のように宣言する。
括弧の後のinが忘れそうなので注意

```swift
var closure = (a: Int, b: Int) -> Int { in
    return a + b
}

closure(1, 10) // => 11
```

# 感想

初めての言語で戸惑う部分も多かったですが、課題の難易度もちょうど良い感じでスムーズにSwiftを学び始めることができたかなと思います。
色々勉強してiOSアプリつくってみようと思いました。

そして懇親会いきたかった……。

あと、個人的にはですがreveal.jsをつかったスライドがかっこよかったです。
