+++
title="Elastic4s の SearchIterator で ElasticSearch から大量のデータを取得する"
date="2023-03-12T15:52:45+09:00"
categories = ["engineering"]
tags = ["elasticsearch", "es", "elastic4s", "scala"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala で ElasticSearch から大量の件数のデータを取得する必要があり実装をしました。
ライブラリは Elastic4s を使用しています。

- {{< exlink href="https://github.com/sksamuel/elastic4s">}}

要求として、1万件以上の数の多いデータを ElasticSearch から取得する必要があったのですが、デフォルトでは 1万件ずつしか取得できません。
軽く調べたところアプリケーション側で繰り返し取得するか、ElasticSearch の {{< exlink href="https://www.elastic.co/guide/en/elasticsearch/reference/current/scroll-api.html" text="Scroll API" >}} を使用する必要がありそうでした。

Elastic4s に ScrollAPI への繰り返しリクエストを Wrap してくれる `SearchIterator` があったのでそれを利用してみました。

## SearchIterator を使った取得

以下のような SearchIterator を使用したコードで1万件以上のデータを取得することができました。

```scala
import com.sksamuel.elastic4s._
import com.sksamuel.elastic4s.ElasticDsl._
import com.sksamuel.elastic4s.circe._
import com.sksamuel.elastic4s.http.JavaClient
import scala.util.{Failure, Success, Using}

// ...
// ..
// .

// ElasticSearch の Client を生成
private def buildClient: ElasticClient = ElasticClient(JavaClient(ElasticProperties(s"https://$host")))

// ElasticSearch から取得した結果から読み込むための case class
case class FetchItemIdResult(itemId: String)
object FetchItemIdResult {
    implicit val hitReader: HitReader[FetchItemIdResult] = hitReaderWithCirce[FetchItemIdResult]
}

// itemCategory から itemId を種痘する
override def fetchItemIds(itemCategory: ItemCategory): IO[Error, Seq[ItemId]] = {
  ZIO.fromEither {
    val response = Using(buildClient) { client =>
      implicit val timeout = 180.seconds
      SearchIterator
        .iterate[FetchItemIdResult](
          client,
          search(index)
            .bool(
              must(
                termQuery("itemCategory", itemCategory.value)
              )
            )
            .sourceInclude("itemId")
            .sortBy(fieldSort("itemid"))
            .from(0)
            .size(10000)
            .scroll("1m")
          )
          .toList
   }
   
   response match {
     case Failure(exception) => Left(RepositoryError(exception))
     case Success(res: List[FetchItemIdResult]) =>
       Right(res.map(_.itemId).map(ItemId))
     }
   }
}
```

上記の例は、サンプルコードですが、Item という何らかの商品があり、それを ItemCategory で取得してきて、ItemId を取得するといったコードになります。

SearchIterator クラスの iterate メソッドは以下のような実装になっています。

```scala
  def iterate[T](client: ElasticClient, searchReq: SearchRequest)(implicit
                                                                      reader: HitReader[T],
                                                                      timeout: Duration): Iterator[T] = 
    hits(client, searchReq).map(_.to[T])
```

第一引数に、ElasticSearch の Client を、第二引数に検索リクエストを受け取ります。implicit として、`HitReader` と timeout 時間である `Duration` 型が必要です。

```scala
  implicit val timeout = 180.seconds
```

implicit で受け取っている変数はそれぞれ以下のように宣言しています。

```scala
// ElasticSearch から取得した結果から読み込むための case class
case class FetchItemIdResult(itemId: String)
object FetchItemIdResult {
    implicit val hitReader: HitReader[FetchItemIdResult] = hitReaderWithCirce[FetchItemIdResult]
}
```

hitReader は、ElasticSearch で hit したドキュメントのレスポンスの Json から case class へと変換する処理になります。Json ライブラリの ここでは Elastic4s のライブラリで用意されている Circe を利用した hitReader を使用しています。

iterate メソッドの中で呼ばれている、hits メソッドをみると内部で、ElasticSearch から返される scrollId がある場合はそれを使用して実行していることがわかります。

- {{< exlink href="https://github.com/sksamuel/elastic4s/blob/3454148330eb86ee918c4ffd34b66f44f430f4cc/elastic4s-core/src/main/scala/com/sksamuel/elastic4s/requests/searches/SearchIterator.scala#L25-L60" text="https://github.com/sksamuel/elastic4s/elastic4s-core/src/main/scala/com/sksamuel/elastic4s/requests/searches/SearchIterator.scala">}}

↓上記 GitHub から引用します。
```scala
def fetchNext(): Iterator[SearchHit] = {

  // we're either advancing a scroll id or issuing the first query w/ the keep alive set
  val f = scrollId match {
    case Some(id) => client.execute(searchScroll(id, searchreq.keepAlive.get))
    case None     => client.execute(searchreq)
  }

  val resp = Await.result(f, timeout)

  // in a search scroll we must always use the last returned scrollId
  val response = resp match {
    case RequestSuccess(_, _, _, result) => result
    case failure: RequestFailure         => sys.error(failure.toString)
  }

  scrollId = response.scrollId
  response.hits.hits.iterator
}
```

検索リクエストは以下のように送っています。

```scala
search(index)
  .bool(
    must(
      termQuery("itemCategory", itemCategory.value)
      .value)
    )
  )
  .sourceInclude("itemId")
  .sortBy(fieldSort("itemid"))
  .from(0)
  .size(10000)
  .scroll("1m")
)
```

色々条件やらを指定していますが、`scroll("1m")` と keepAlive を設定しつつ呼ぶことで、Scroll リクエストとしています。

このようにすると、10000 件を超えるデータでも、SearchIterator が内部で逐次 ScrollAPI を利用してデータを取得してくれるため取得することができました。


## まとめ

今回は、Elastic4s を使って Scala で ElasticSearch から 10000件以上の大量のデータを fetch する方法についてまとめました。
ElasticSearch のクエリの形式を知っていれば、Elastic4s は DSL があり直感的にかけるのでとても便利です。

さらに、今回あつかった `SearchIterator` のような便利な Wrapper も用意されているため非常に楽に実装することができました。
