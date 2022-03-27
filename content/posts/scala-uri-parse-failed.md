+++
title="scala-uri で角括弧を含む文字列が Parse Failed する件の調査ログ"
date="2022-03-27T19:10:09+09:00"
categories = ["engineering"]
tags = ["scala", "uri", "url"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、{{< exlink href="https://github.com/lemonlabsuk/scala-uri" text="scala-uri" >}} を使っていて、以下のような角括弧を含むURLがパースできなかったので調査したログになります。

```
https://example.com/hoge/fuga[1].png
```
## 発生した環境と事象

対象のライブラリは以下になります。

- https://github.com/lemonlabsuk/scala-uri

使用していたバージョンは、3.6.0 になります。

起きていた事象は以下のようなものになります。

```scala
import io.lemonlabs.uri.Url

// ↓ Parse Error Occured
val result = Url.parse("https://example.com/hoge/fuga[1].png")
```

角括弧が含まれる URL がパースできないといったものになります。

## 先に結論

scala-uri のバージョンを 4.0.1 にアップデートすると解決されます。

scala-uri の 4.x.x 系で Scala3 対応が入っていますが、引き続き Scala 2.13, 2.12 へのサポートも残っているためこれらのバージョンであれば問題なくアップデートすることができそうです。

## 詳細な調査手順

まずは、URL の仕様についてしらべました。

まず前提として、角括弧を使ったURLはブラウザ上では正しく表示することができます。

また角括弧ですが、{{< exlink href="https://www.ietf.org/rfc/rfc3986.txt" text="RFC 3986" >}} にて予約語に追加されていそうでこの辺りが怪しそうだな当たりをつけました。

次に、scala-uri の実際に parse 処理を見ていきます。

以下のように処理が進んでいきます。

```scala
// 呼び出し側
Url.parse("https://example.com/hoge/fuga[1].png")

// package io.lemonlabs.uri
// https://github.com/lemonlabsuk/scala-uri/blob/3.6.0/shared/src/main/scala/io/lemonlabs/uri/Uri.scala#L593-L600
object Url {
  // ...
  def parse(s: CharSequence)(implicit config: UriConfig = UriConfig.default): Url =
    parseTry(s).get

  def parseOption(s: CharSequence)(implicit config: UriConfig = UriConfig.default): Option[Url] =
    parseTry(s).toOption

  def parseTry(s: CharSequence)(implicit config: UriConfig = UriConfig.default): Try[Url] =
    UrlParser.parseUrl(s.toString)

  // ...
}
```

Url.parse を呼ぶと、中で `UrlParser.parseUrl` が呼ばれていることがわかります。この辺りを見ると、`parse` は例外が発生して、`parseOption` は Option 型を返している様子がわかります。

次に、UrlParser.parseUrl あたりを見ていきます。

```scala
// package io.lemonlabs.uri.parsing
// https://github.com/lemonlabsuk/scala-uri/blob/3.6.0/shared/src/main/scala/io/lemonlabs/uri/parsing/UrlParser.scala#L420-L421
class UrlParser(val input: String)(implicit conf: UriConfig = UriConfig.default) extends UriParser {
  // ...

  def parseUrl(): Try[Url] =
    mapParseError((_url <* Parser.end).parseAll(input), "URL")

  // ...
```

cats-parse の記法で `<*` がわかりにくいところので追加で説明すると、`_url` というParser と `Parser.end` という Parser の二つを順に実行して左側 (つまり `_url`) の結果のみを取得するといったものになります。

`Parser.end` の中身は、URLのパースの終了時の offset と、与えられた文字列長が一致するか (つまり文字列の最後までパースしているか)をチェックしています。

続いて、`_url` のパーサーの定義を見ていきます。

```scala
// https://github.com/lemonlabsuk/scala-uri/blob/3.6.0/shared/src/main/scala/io/lemonlabs/uri/parsing/UrlParser.scala#L256-L257
class UrlParser(val input: String)(implicit conf: UriConfig = UriConfig.default) extends UriParser {
  // ...

  def _url: Parser0[Url] =
    _abs_url.backtrack | _protocol_rel_url.backtrack | _url_without_authority.backtrack | _rel_url

  // ...
}
```

`|` は `cats-parse` で or 条件のような定義がされています。そのため左から順にパースを試していくことになります。
今回対象とするのは、`_abs_url` なのでその処理をさらに見ます。


```scala
// https://github.com/lemonlabsuk/scala-uri/blob/3.6.0/shared/src/main/scala/io/lemonlabs/uri/parsing/UrlParser.scala#L179-L187
class UrlParser(val input: String)(implicit conf: UriConfig = UriConfig.default) extends UriParser {
  // ...

  def _abs_url: Parser[AbsoluteUrl] =
    for {
      scheme <- _scheme
      _ <- Parser.string("://")
      authority <- _authority
      path_for_authority <- _path_for_authority
      maybe_query_string <- _maybe_query_string
      maybeFragment <- _fragment.?
    } yield extractAbsoluteUrl(scheme, authority, path_for_authority, maybe_query_string, maybeFragment)

  // ...

```

上記でURLを先頭からパースする処理が確認されます。
順に、scheme をパースし、`://` の文字をパースし、`_authority` をパースしと続いていきます。

authority は、{{< exlink href="https://datatracker.ietf.org/doc/html/rfc3986" text="RFC 3986">}} で以下のように説明されています。

```
   The following are two example URIs and their component parts:

         foo://example.com:8042/over/there?name=ferret#nose
         \_/   \______________/\_________/ \_________/ \__/
          |           |            |            |        |
       scheme     authority       path        query   fragment
          |   _____________________|__
         / \ /                        \
         urn:example:animal:ferret:nose
```

ホスト部とポートなどのことを指しています。

今回は、URLのパスに角括弧が含まれているケースなので `_authority` の後の、`_path_for_authority` を見ます。

```scala
// https://github.com/lemonlabsuk/scala-uri/blob/3.6.0/shared/src/main/scala/io/lemonlabs/uri/parsing/UrlParser.scala#L130-L139
class UrlParser(val input: String)(implicit conf: UriConfig = UriConfig.default) extends UriParser {
  // ...

  /** A sequence of path parts that MUST start with a slash
    *
    * If a URI contains an authority component, then the path component must either be empty
    * or begin with a slash ("/") character.
    */
  def _path_for_authority: Parser0[AbsoluteOrEmptyPath] =
    char('/') *> until0(charIn("#?[]") | Parser.end).map { path =>
      extractAbsOrEmptyPath(path.split("/", -1).toList)
    } |
      (charIn("#?").peek | Parser.end).as(EmptyPath)

  // ...
}
```

すると、以下の部分で角括弧の記載が出てきました。

```scala
char('/') *> until0(charIn("#?[]") | Parser.end)
```
`#`, `?`, `角括弧`が含まれているか、文字列の終了までパースを進めています。
ここで角括弧がパスの終了と判定されているようでした。

角括弧は IPv6 用に予約された区切り文字ですが、authority 部にしか使用されなさそうで、path 部では考慮する必要はなさそうだなぁと思っていたのですが、上記のコードが 4.0.6 のリリースで修正されていました。

該当の PR は↓です。

- https://github.com/lemonlabsuk/scala-uri/commit/f1702e93206e2eb065f7754ffa5fdc929c2f81f6

と言うわけで実装側でパーセントエンコーディングするなどのワークアラウンドを考えていましたが、ライブラリを 4.0.1 以上にあげると解決できそうでした。

## まとめ

今回は、scala-uri のParse 処理を追っていって、特定の URL がパースできない問題を回避するまでの調査過程などをログとして残しました。

余談ですが、scala-uri の内部では、{{< exlink href="https://github.com/typelevel/cats-parse" text="cats-parse" >}} が使われています。内部まで見ていくとパーサコンビネータで綺麗に書かれていてかなり勉強になりました。 OSS のコードを読んでいくのは学びが多いなと改めて実感しました。
