+++
title = "SwiftLintを導入とそのきっかけについて"
thumbnail = "/posts/introduction_of_swiftlint/thumbnail.png"
tags = ["swift", "swiftlint", "xcode"]
categories = ["engineering"]
date = "2019-04-11"
+++


こんにちは、[kz\_morita](https://twitter.com/kz_morita)です。\
普段はiOSエンジニアとしてSwiftを書いていて、もう少しでSwift歴が半年になります。
それ以前は、C# でサーバーサイド書いていたり、C++/Cocos2d-xでゲーム開発をしていたりしました。

この記事では、プロジェクトに最近導入したSwiftLintについて、導入の背景や方法などを書き記していきます。\
導入してみた所感としてコードの書き方やスタイルがAuto Formatによって自動で整うため、開発効率は確実にあがるだろうなと感じています。今後の開発が楽しみです。

もしあなたがSwiftLintの導入を考えているのであれば、この記事がきっとお役に立てるのではないでしょうか。

## Pull Requestのレビューを楽にしたい

現在参加しているチームの開発スタイルは基本的に git-flow に乗っ取っています。そのため機能開発は `feature` ブランチで行い、Pull Requestを投げてレビューが通った後にそれを `develop` ブランチへマージします。\
レビューはコードの品質を担保したり、他人のコードを読む良い機会になったりするので必要なことだとは思うのですが、そのレビュー工数は決して小さくはないと思います。そのコードが解決しようとしている問題を把握し、コードが適切なのかどうか。もっと良い書き方はないかなど考慮すべき点はたくさんあります。

そのためレビューを少しでも楽にしたいという思いをずっと持っていました。レビューを普段からしている方であれば同じような思いをしている方も多いのではないでしょうか。

## 足がかりとしてのLint

Pull Requestのレビューの役割のひとつに `コードの品質を保つ` ということがあると思います。
コードの品質には、インデント崩れや命名、バグになりそうな怪しいコードやパフォーマンスがボトルネックになりそうなコードなどが様々なチェックすべき項目あげられるでしょう。

この中でも、インデント崩れや推奨しないシンタックスなどの本質でない部分にレビュー工数を割くことはあまり有意義ではないでしょう。\
Lintはこれらのチェックを自動化してくれるツールとして非常に有用だと感じています。

Pull Requestのレビューの工数を下げる方法は他にもあるかとは思いますが、今回はその足がかりとしてLintを導入することにしました。

## CocoaPodsでさくっとインストール

今回はSwiftLintを導入していきます。

リポジトリは {{< exlink href="https://github.com/realm/SwiftLint" text="こちら">}} です。

この記事では、CocoaPodsをすでに使用しているという前提で話を進めます。

インストール自体はすごく簡単で、他のPodsと同様Podfileに記述して `pod install` で完了です。

Podfile以下を追記して、

```
pod 'SwiftLint'
```

以下のコマンドで完了です。

```
$ pod install
```

試しに実行してみるには、swiftlintというコマンドを打てばOKです。

```
$ Pods/SwiftLint/swiftlint   # Lintをかける
```

その他にも以下のようなコマンドが用意されています。

```
$ Pods/SwiftLint/swiftlint autocorrect # 自動で修正する

$ Pods/SwiftLint/swiftlint autocorrect --format # フォーマットを含めて自動で修正する
```

## run scriptに記述してビルド時にLintを走らせる

上記までの設定で一応Lintをかけることはできるようになったのですが、ビルド時に自動でLintが走ってautocorrectも走るような設定をここではしていきます。

XCodeではビルド時に実行するスクリプトを書くことができます。下の図の赤枠の部分です。


{{< figure src="/images/posts/introduction_of_swiftlint/runscript.png" >}}

ここに下記のようなスクリプトを書くことで、ビルド時にLintと自動フォーマットをかけることができます。

```bash
if which ./Pods/SwiftLint/swiftlint > /dev/null; then
    ./Pods/SwiftLint/swiftlint autocorrect --format
    ./Pods/SwiftLint/swiftlint
else
    echo "warning: SwiftLint not installed, download from https://github.com/realm/SwiftLint"
fi
```

簡単に説明すると、念の為swiftlintコマンドが存在するかどうかをチェックして、あった場合に、`swiftlint autocorrect --format` でフォーマットをかけたのち、 `swiftlint` コマンドでLintをかけています。

#### 補足

Run Scriptの項目がない場合は以下の図のようにして追加することもできます。

{{< figure src="/images/posts/introduction_of_swiftlint/add-runscript.png" >}}


## Lintの設定にこだわる

とくに設定しなくてもデフォルトのルールでLintをかけることができるのですが、独自のRuleを指定することもできます。

参考
: {{< exlink href="https://qiita.com/kagemiku/items/80e6d905dc0059c342b3" text="SwiftLintのRules全まとめ" >}}

独自のRuleを設定する場合は、プロジェクトのディレクトリの直下に `.swiftlint.yml` を置くとその設定が反映されます。

参考までに一部のRuleを紹介します。

```yaml
disabled_rules:
- trailing_whitespace # 空白の改行を許可するため除外

# ライブラリを対象から外す
excluded:
- Pods/
- Podfile
- Podfile.lock


# force cast, force try は暫定的にwarningへ
force_cast: warning
force_try: warning

# 変数名に関する制約. 基本的に3文字以上とするが、いくつか例外として除外している
identifier_name:
  allowed_symbols: "_"
  min_length:
    error: 3
    warning: 3
  excluded:
    - id
    - i
    - j
    - n
```

ここらへんは各プロジェクトに応じてカスタマイズしていくのが良いでしょう。


## 設定は継続的にメンテナンスしていく

設定した独自のRuleですがこちらは継続的に更新していくのが良いかと思います。

例えば、今回のRule設定では、`force cast` (`as!` でキャストするやつ) を `error` でなく `warning` にしています。本来であればforce castは使わない方が良いのですがすでにプロジェクト内で結構使われていたりするために暫定的にwarningにしていて、今後warningを修正したのちにerrorに戻すような運用ができれば良いと考えています。


現在のプロジェクトの状況に応じて臨機応変にRuleを変えていくことが重要だと考えています。


## まとめ

今回の記事では、SwiftLintを導入しようと思った経緯とその導入方法について簡単に紹介しました。\
こういったLintなどを駆使してできるだけ自動化して開発しやすい環境を作っていきたいと感じました。

この記事が現在SwiftLintの導入に悩んでいる方や、まさに導入中の方などにとって参考になったのであれば幸いです。


