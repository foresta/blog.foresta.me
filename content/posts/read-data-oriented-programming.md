+++
title="『データ指向プログラミング』を読んだ"
date="2023-10-29T12:04:47+09:00"
categories = ["engineering"]
tags = ["book", "dop", "data"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，{{< exlink href="https://www.shoeisha.co.jp/book/detail/9784798179797" text="『データ指向プログラミング』">}} という本を読んだのでその感想などを書いていきます．

## 本について

<a href="https://www.amazon.co.jp/%E3%83%87%E3%83%BC%E3%82%BF%E6%8C%87%E5%90%91%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0-Yehonathan-Sharvit/dp/4798179795?crid=3US6TQESUWR2L&keywords=%E3%83%87%E3%83%BC%E3%82%BF%E6%8C%87%E5%90%91%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0&qid=1698550670&sprefix=%E3%83%87%E3%83%BC%E3%82%BF%E6%8C%87%E5%90%91%2Caps%2C179&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=li3&tag=foresta04-22&linkId=ec9dd6d947e2f39adb52678a4088b558&language=ja_JP&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=4798179795&Format=_SL250_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li3&o=9&a=4798179795" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/3tP3UDE" text="データ指向プログラミング" >}}

```
【目次】
Part1　柔軟性
　　第1章　オブジェクト指向プログラミングの複雑さ― 気まぐれな起業家
　　第2章　コードとデータの分離― まったく新しい世界
　　第3章　基本的なデータ操作― 瞑想とプログラミング
　　第4章　状態管理― タイムトラベル
　　第5章　基本的な並行性制御― 家庭内での対立
　　第6章　単体テスト― コーヒーショップでプログラミング
Part2　スケーラビリティ
　　第7章　基本的なデータ検証― おごそかな贈り物
　　第8章　高度な並行性制御― さようなら、デッドロック
　　第9章　永続的なデータ構造― 巨人の肩の上に立つ
　　第10章　データベースの操作― 雲は雲
　　第11章　Webサービス― 忠実な配達人
Part3　保守性
　　第12章　高度なデータ検証― 手作りの贈り物
　　第13章　ポリモーフィズム― 田舎で動物とたわむれる
　　第14章　高度なデータ操作― 考え抜かれたものは明確に表現される
　　第15章　デバッグ― 博物館でイノベーション
付録A　データ指向プログラミングの原則
付録B　静的型付け言語での汎用的なデータアクセス
付録C　データ指向プログラミング:プログラミングパラダイムの一環をなす
付録D　Lodash リファレンス
```

## 内容と 4 つの原則について

本書は，DOP (Data Oriented Programming) について語られている本でした．

DOP の基本的な概念などは，この本の著者のブログでも書かれています．

-   {{< exlink href="https://blog.klipse.tech/dop/2022/06/22/principles-of-dop.html" >}}

4 つの原則として，以下が挙げられています．

-   コード (振る舞い) をデータから切り離す
-   データを汎用的なデータ構造で表す
-   データをイミュータブルとして扱う
-   データスキーマをデータ表現から切り離す

それぞれに焦点をあてて感想を書いていきます．

### コード (振る舞い) をデータから切り離す

こちらはデータとふるまいを分けるという原則です．
OOP ではデータをカプセル化して外部に公開せずに，振る舞いとセットでクラスとしてまとめるということを行うと思いますが，DOP ではデータを第一と考え，データとそれに対する振る舞いに分離します．

そのため，書籍では振る舞いを表す関数はすべて static メソッドで表すといった具合に書かれています．

書籍で書かれているようなコード例だと以下のような感じです．

#### OOP like

```scala
val person = new Person(lastName = "Tanaka", firstName = "Taro")
person.fullName() // => Tanaka Taro
```

#### DOP like

```
val personData = Map("lastName" -> "Tanaka", "firstName" -> "Taro")
fullName(personData) // => Tanaka Taro
```

DOP のメリットとしては，fullName 関数は，Person データじゃなくても，firstName と lastName を持つデータであれば再利用できるという点が挙げられていました．

また，OOP like なコードで本の著者 `Author` みたいなクラスを作成するとし，その `Author` の fullName を計算したい時処理が重複しますがその解決策としては，以下の２つになるかなと思います．

-   User のような抽象的なクラスを設計し，Author が継承する
-   フルネームを計算するようなコンポーネントを作成し，委譲する

最近の OOP だと，継承による共通化はあまり推奨されていない認識です．後者の委譲する方に関しては振る舞いがデータ (Person や Author) から切り離されていると捉えることができます．

そのため後者は，DOP の原則の 1 つめのエッセンスを兼ねているといえそうです．

余談ですが以下の YouTube 動画がデータと振る舞いを分離するという点について，データと振る舞いの分離をそれぞれの抽象度の階層がことなることで設計が破綻するという例をだしながら説明されていて，とても良かったです．

{{< youtube YuMBCWbXtuw >}}

### データを汎用的なデータ構造で表す

こちらは，データを Person クラスのように定義するのではなく，Map 型のような汎用的なデータ型で表すという原則です．

こちらはデータをモデリングする際に，それぞれ定義しないとコード上の表現力が下がる気がしてあまり理解できなかったのですが，原則 4 とセットだと理解が捗りました．(データの表現力，モデリングについては原則 4 で話します)

汎用的なデータ構造であらわすということを，スキーマオンリードとしてデータを扱うということだと捉えるとスッキリ理解できました．

スキーマオンリードとスキーマオンライトの概念は，データベースの文脈で語られることが多く，スキーマオンライト書き込むときにデータスキーマが規定されているもので RDB などはこちらにあたります．スキーマオンリードは読むときにデータスキーマが決まるようなもので NoSQL などの Document 型の DB などになります．

データ検証を，データを使うタイミング (Read するタイミング) で行うため，データ自体は汎用的な Map などのデータ構造で取り扱うというのがこちらの原則という認識です．

### データをイミュータブルとして扱う

こちらの原則はデータをイミュータブルとして扱うという原則で，最近のプログラミングの流れとしては自然なものに見えます．
たとえば，Rust が変数をデフォルトで immutable なものとし，変更したいときに `mut` キーワードを付けるような設計などが例となります．

データが immutable なので，データは基本的に複製されるような挙動になります．

ここで心配なのが，データのコピーが非効率的じゃないかという点になります．

本書では，永続データ構造を用いてそのコピーを最小限にするように提案されています．

永続データ構造とは，データが immutable なので．データをシェアできるという考え方です.

データが更新されたときに，不変な共通データはシェアし

以下のような例がわかりやすいかも知れません．

```js
// データを定義
val data = { "user": {"firstName": "Taro", "lastName": "Tanaka" }, "books":{ /* ... */ } }
// 内部状態例
// { "user#1": { "firstName": "Taro", "lastName": "Tanaka" }}
// { "books#1": [ /* ... */ ] }

// user を取得
// user#1 の参照を得る
val user = data.user


// user の firstName を "Bob" に更新する疑似コード
val data2 = update(data, "user.firstName", "Bob")
// 内部状態例 (books は変更してないので同じデータをシェア)
// { "user#2": { "fistname": "Bob". "lastName": "Tanaka" } }
// { "books#1": [ /* ... */] }


// 以下は user#1 を参照しているので普遍
user.fistName // => Taro
data.user.firstName // => Taro

// user#2 を参照しているので新しいデータ
data2.user.firstName // => Bob
```

永続データ構造は，各言語によってライブラリなどが提供されていることがあるため基本的にはそちらを使うことになりそうです．

JavaScript でいうと {{< exlink href="https://immutable-js.com/" text="Immutable.js" >}} など．

### データスキーマをデータ表現から切り離す

こちらは，実データとデータのスキーマを切り離すという原則です．

具体的に JSONSchema のようなものを利用してデータモデリングはそちらで行うように提案されていました．

原則 2 の際にデータの表現力が落ちるのではという話がありましたが，モデリングは JSONSchema のようなもので行うというものでした．
データを使用する際に，データがスキーマに沿っているかというバリデーションも JSONSchema を使用するといった内容が書かれています．

たとえば API サーバーの開発をしているとして，リクエストされた JSON が仕様を満たしているかどうかというチェックをするというユースケースを考えます．

既存の静的型付け言語では JSON => データ型 へのシリアライズに失敗することによってスキーマのバリデーションを行うと思いますが，DOP では JSONShema のバリデーションを記述してバリデーションするようなイメージです．

DOP ではバリデーションを実施するのがプログラマーの責任に委ねられることになります．型による自動的なチェックの恩恵は受けられないのが，データを汎用的なデータ型で扱いスキーマを切り離す際のデメリットです．

## DOP とはなんなのか？

書籍を読み終え DOP について考えたときな率直な感想としては，Unix コマンドのような設計スタイルかなと思いました．

データを汎用データ型で扱い関数によってデータを変換していくさまは，文字列とファイルという共通インターフェースを持ち振る舞いをパイプでつなげていく Unix コマンドのように感じました．

小さく，シンプルな関数をつなげてデータを加工していくようなコーディングスタイルが DOP には合うのかなと思ってます．

また，スキーマオンリードというデータベースの概念を取り入れているようにも感じました．プログラムがデータ型を強く規定するのではなく，データがまずありそれに対してバリデーションと振る舞いを attach していくさまは NoSQL データベースを扱っているときのような思考パターンだな感じます．

そのため，動的型を持つ言語のほうが扱いやすいケースが多いかもしれません．
静的型付け言語でデータを汎用的なデータ構造で表すということは，`Map<String, Any>` のような型でデータを表現するということで，それはつまり取得時にキャストが必要になるということになります．

とはいえ，静的型付け言語の JSON parse ライブラリでよくあるような，`getAsString` のようなインターフェースを用意することで静的型付け言語でも DOP は可能であると記述はありました．

## さいごに

今回は，DOP (Data Oriented Programming) についての書籍を読みました．

最近自分が書いていたプログラミングパラダイムとは異なる考え方でとても新鮮でした．まだコードを実際にかけていないため DOP の原則に従って実際のコードを書いてみてどのような感じなのか試してみたいと思います．