+++
categories = ["engineering"]
date = "2019-05-05"
title = "iOSアプリエンジニアがFlutterを触ってみた"
thumbnail = ""
tags = ["flutter", "dart"]
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。
普段はiOSアプリエンジニアとしてSwiftを書いています。

今回は、Flutterを軽く触って遊んでみたのでそのことについて書いていこうと思います。

## Flutterとは

https://flutter.dev

Googleによって開発されたモバイルアプリ向けのフレームワークです。AndroidやiOSなどクロスプラットフォームにビルドできることが特徴です。

## なぜ興味をもったのか

普段iOSネイティブアプリを開発しているので、あまりクロスプラットフォーム環境を触る機会はあまりないです。
とはいえ、Androidアプリ開発にも興味があります。
Java or KotlinでのAndroidのネイティブ開発にも興味はあるのですが、Googleが出しているクロスプラットフォーム環境ということでAndroidアプリの開発のためにFlutterを触ってみようと思いました。

## 軽く触ってみた

とりあえず、公式の{{< exlink href="https://flutter.dev/docs/get-started/install" text="Get started">}} の通りに進めていきます。 

### まずはインストール

公式サイトのinstallの通りに進めていきます。

自分の環境OSXなので、以下のリンクの通りセットアップしました。
https://flutter.dev/docs/get-started/install/macos

エディタはAndroid Studioを使用しました。

途中で`$ flutter doctor` コマンドを入力したら、`brew link` で結構失敗して詰まったりしました。
なのでまだ、iOS環境ではビルドを試せてないです。
{{< tweet user="kz_morita" id="1122686202379816961" >}}

### 公式チュートリアルを実行してみる

以下のチュートリアルを写経して動かしてみました。

https://flutter.dev/docs/get-started/codelab

アプリのエントリポイントはmain()関数です。

```dart
void main() => runApp(MyApp());
```

基本的に全てのUIはWidgetで、Widgetクラスを継承しています。
`Text` や、`ListView` などもWidgetクラスを継承しています。

Widgetは大きく分けて、`StatelessWidget` と、`StatefulWidget` に分かれ、その名の通り状態を保つViewは `StatefulWidget` を継承し、 `createState()` メソッドをオーバーライドします。

createStateでは、`State` クラスを継承したクラスを返却します。このStateクラス内に状態を保ったViewを記述していきます。\
Stateクラスの `Widget build(BuildContext context)` クラスをオーバーライドし実装する必要があります。

```dart
class RandomWords extends StatefulWidget {
  @override
  RandomWordsState createState() => RandomWordsState();
}

ass RandomWordsState extends State<RandomWords> {
  // 状態を管理するプロパティ
  final _suggestions = <WordPair>[];
  final _saved = Set<WordPair>();
  final _biggerFont = const TextStyle(fontSize: 18.0);

  @override
  Widget build(BuildContext context) {
    // Widgetを作成してreturnする
    return Scaffold(
      appBar: AppBar(
        title: Text('Startup Name Generator'),
        actions: <Widget>[
          IconButton(icon: Icon(Icons.list), onPressed: _pushSaved),
        ],
      ),
      body: _buildSuggestions(),
    );
  }
```

## iOSエンジニアからみたFlutter

普段のiOS開発では、Swiftを用いてますが、このFlutterはDartを用いて書かれます。\
Swiftはモダンで強力な言語ですが、Dartも書きやすい言語だなというのがファーストインプレッションでした。

またiOS開発ではInterfaceBuilderを用いてレイアウトを実装しますが、Flutterの場合はコードベースでWidgetを並べていきレイアウトを実装していきます。ListViewやTableViewなどのレイアウトやマージンなど管理できるContainerもすべてはWidgetという扱いのため、個人的には非常にシンプルな作りだと思います。

## まとめ

簡単にチュートリアルを触ってみた感じですが、感触としては良さそうだなぁと思いました。
あとは、データ通信周りを実装できれば一通りのアプリケーションができそうなので、何か作ってみたいと思います。
