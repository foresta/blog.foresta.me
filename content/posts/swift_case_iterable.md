+++
categories = ["engineering"]
date = "2019-05-25"
title = "SwiftでEnumの全要素を配列で取得する"
thumbnail = ""
tags = ["swift"]
+++

こんにちは、[kz\_morita](https://twitter.com/kz_morita)です。\

最近になって、Swift のEnumの全要素を配列で取得できる便利な protocol である `CaseIterable` について知ったのでそのことについて書きます。

Enumの全列挙子を配列として使用したいといった場合には、このCaseIterableを使うと簡単に実現できるためおすすめです。

ドキュメントはこちら \
{{< exlink href="https://developer.apple.com/documentation/swift/caseiterable" text="CaseIterable" >}}

## CaseIterableで全列挙

SwiftにはEnumがあり以下のように列挙することができます。

```swift
enum Color {
    case red
    case blue
    case green
    case white
}
```

ここで、上記で定義したenumのColorの全パターンを取得したいとします。自分はCaseIterableを知る前は以下のように記述していました。

```swift
enum Color {
    case red
    case blue
    case green
    case white

    // 全ケースを自分で定義
    static var allCases: [Color] = [.red, .blue, .green, .white]
}

Color.allCases.map { /* do something. */ }
```

これがCaseIterableを使用すると以下のように記載することができます。

```swift
enum Color: CaseIterable {
    case red
    case blue
    case green
    case white
}

// 自分で定義しなくても、allCasesが使用できる
Color.allCases.map { /* do something. */ }
```

自分で定義する必要がないため、allCasesへの追記もれなどが起こらなくなってかなり便利になりました。


## CaseIterableはSwift4.2から

CaseIterableはSwift4.2で実装されているため、それ以降のバージョンで使用可能です。 proposalはこちら {{< exlink href="https://github.com/apple/swift-evolution/blob/master/proposals/0194-derived-collection-of-enum-cases.md" text="Derived Collection of Enum Cases" >}}

CaseIterableが発表されたのは、WWDC18のセッション {{< exlink href="https://developer.apple.com/videos/play/wwdc2018/401" text="What’s New in Swift">}} のなかの模様です。

## まとめ

Swift4.2で導入されたCaseIterableについて今更ながら紹介しました。\
基本的に便利になるため積極的に使っていくと良いかと思います。

現在はSwift5も出ているのでそちらの機能も随時キャッチアップしていこうと思います。

