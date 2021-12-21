+++
title="Apache Lucene の Index の仕組みを探る"
date="2021-12-22T00:29:33+09:00"
categories = ["engineering"]
tags = ["lucene", "information-retrieval", "情報検索"]
thumbnail = ""
+++

この記事は、{{< exlink href="https://qiita.com/advent-calendar/2021/stanby" text="株式会社スタンバイアドベントカレンダー" >}}の 22 日目の記事です。

昨日は、{{< exlink href="https://qiita.com/jsoizo" text="@jsoizo" >}} さんの{{< exlink href="https://jsoizo.hatenablog.com/entry/2021/12/21/000000" text="Scala + GraalVM AOTコンパイル + AWS Lambdaでwebアプリを動かしたい" >}} でした。

## はじめに 

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今年の 9 月に転職をして求人検索エンジンを開発している 株式会社スタンバイに入社しました。

検索エンジンを開発している会社に入社したので、OSS の検索エンジンである Lucene について理解を深めるため、Lucene を簡単に動かしてみて実際にどのように検索エンジンが動いているのか見ていきます。

## Lucene について

Lucene は、OSS の検索エンジンのライブラリです。
検索エンジンのサーバーである Solr や、Elasticsearch 内で使用されています。

- {{< exlink href="https://lucene.apache.org/" >}}


以降の本文中で、
{{< exlink href="https://github.com/apache/lucene" >}}
からソースコードを一部引用しながら Lucene がどのように Index を行っているかを探っていきます。

## まずは使ってみる

Lucene 公式の Lucene in 5 minutes を Scala でやってみます。

{{< exlink href="https://www.lucenetutorial.com/lucene-in-5-minutes.html" >}}

バージョンは 8.10.1 を使用していきます。

まずは、build.sbt から。

```sbt
name := "LuceneSample"

version := "0.1"

scalaVersion := "3.1.0"

val luceneVersion = "8.10.1"

libraryDependencies += "org.apache.lucene" % "lucene-core" % luceneVersion
libraryDependencies += "org.apache.lucene" % "lucene-analyzers-common" % luceneVersion
libraryDependencies += "org.apache.lucene" % "lucene-queryparser" % luceneVersion
```

今回のデモでは、`lucene-core` 、`lucene-analyzers-common`、`lucene-queryparser` を使用します。

main の処理を以下に記載します。

```scala
object Main extends App {
  val books = Seq(
    Book("Lucene in Action", "193398817"),
    Book("Lucene for Dummies", "55320055Z"),
    Book("Instant Lucene .NET", "1782165940"),
    Book("Managing Gigabytes Lucene", "55063554A"),
  )

  val analyzer = StandardAnalyzer()
  val index = MMapDirectory(Files.createTempDirectory("lucene-sample").toAbsolutePath)

  indexer(analyzer, index, books)
  search(analyzer, index, "lucene")
}
```

Book という、本のタイトルと、ISBN を持ったデータを index し、その後本のタイトルを `lucene` というワードで検索しています。

公式サイトのチュートリアルでは、RAMDirectory を使用していましたが、こちら Deprecated になっており、MMapDirectory を使うことを推奨していたため変更しています。


まず index する処理を見ていきます。以下が Book を index する処理です。

```scala
def indexer(analyzer: StandardAnalyzer, index: MMapDirectory, books: Seq[Book]): Unit = {
  def createDoc(book: Book): Document = {
    val doc = Document()
    doc.add(TextField("title", book.title, Field.Store.YES))
    doc.add(StringField("isbn", book.isbn, Field.Store.YES))
    doc
  }

  val config = IndexWriterConfig(analyzer)
  val w = IndexWriter(index, config)
  for (book <- books) w.addDocument(createDoc(book))
  w.close()
}
```
Book から Index するための Document クラスを作成し、IndexWriter の addDocument メソッドに渡します。
TextField と、StringField を使用してますが、TextField の方は Tokenize され、StringField は Tokenize されない Field とのことです。
今回の ISBN や、他にも ID など Tokenize する必要がない場合は、StringField を使うと良さそうです。


次に、検索する個所は以下のような形です。

```scala
def search(analyzer: StandardAnalyzer, index: MMapDirectory, queryString: String): Unit = {
  val analyzer = StandardAnalyzer()
  val q = QueryParser("title", analyzer).parse(queryString)
  val hitsPerPage = 10
  val reader = DirectoryReader.open(index)
  val searcher = IndexSearcher(reader)
  val docs = searcher.search(q, hitsPerPage)

  val hits = docs.scoreDocs

  for (hit <- hits) {
    val docId = hit.doc
    val d = searcher.doc(docId)
    println(s"Hit: ${d.get("isbn")}\t${d.get("title")}")
  }
}
```

これで動かすと以下のように、`lucene` という文字が入っている本の情報のみ Hit します。

```
Hit: 193398817  Lucene in Action
Hit: 55320055Z  Lucene for Dummies
Hit: 1782165940 Instant Lucene .NET
```

## Index の流れについてソースコードを追う

Lucene を使ってみてなんとなく流れが掴めてきたので、データを Index する処理に注目してコードを追っていきます。

これ以降は、Apache Lucene ver 8.10.1 のソースコードを引用して説明していきます。

{{< exlink href="https://github.com/apache/lucene" >}}


データを Index する処理では、転置インデックスの作成とドキュメント自体の保存が行われています。

Index処理の開始は、`IndexWriter` クラスになります。

大雑把に見ると以下のように処理が進んでいきます。

```
IndexWriter.updateDocuments
↓
DocumentWriter.updateDocuments
↓
DocumentsWriterPerThread.updateDocuments
↓
DefaultIndexingChain.processDocument (DocConsumer)
↓
DefaultIndexingChain.processField (DocConsumer)
```

DefaultIndexingChain クラスの、processField の中では、色々やられていますが、特にドキュメントの保存と、転置インデックスの作成に注目します。

### ドキュメントの保存

processField の中でドキュメントの保存の部分を抜粋します。

##### lucene/core/src/java/org/apache/lucene/index/DefaultIndexingChain.java
```java
  private int processField(int docID, IndexableField field, long fieldGen, int fieldCount) throws IOException {
    String fieldName = field.name();
    IndexableFieldType fieldType = field.fieldType();

    // ..

    // Add stored fields:
    if (fieldType.stored()) {
      if (fp == null) {
        fp = getOrAddField(fieldName, fieldType, false);
      }
      if (fieldType.stored()) {
        // ...
    
        try {
          // ドキュメントのフィールドを保存
          storedFieldsConsumer.writeField(fp.fieldInfo, field);
        } catch (Throwable th) {
          onAbortingException(th);
          throw th;
        }
      }
    }

    // ...
    
    return fieldCount;
  }
```

上記の `storedFieldConsumer.writerField(...)` で保存をしています。

この呼び出しから最終的に、ByteBuffersDataOutput.java クラスで buffer にデータが書かれます。

##### lucene/core/src/java/org/apache/lucene/store/ByteBuffersDataOutput.java
```java
  public void writeString(String v) {
    try {
      final int MAX_CHARS_PER_WINDOW = 1024;
      if (v.length() <= MAX_CHARS_PER_WINDOW) {
        final BytesRef utf8 = new BytesRef(v);
        writeVInt(utf8.length);
        writeBytes(utf8.bytes, utf8.offset, utf8.length);
      } else {
        writeVInt(UnicodeUtil.calcUTF16toUTF8Length(v, 0, v.length()));
        final byte [] buf = new byte [UnicodeUtil.MAX_UTF8_BYTES_PER_CHAR * MAX_CHARS_PER_WINDOW];
        UTF16toUTF8(v, 0, v.length(), buf, (len) -> {
          writeBytes(buf, 0, len);
        });
      }
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }    
  }
```

下記の部分のように、長さと実際のデータのバイト列が続けて格納されます。

```lucene/core/src/java/org/apache/lucene/store/ByteBuffersDataOutput.java
writeVInt(utf8.length);
writeBytes(utf8.bytes, utf8.offset, utf8.length);
```

以下の2つのドキュメントを書き込んだ状態の buffer は

```scala
Book("Lucene in Action", "193398817"),
Book("Lucene for Dummies", "55320055Z"),
```

以下の表のような列になっており、

```
[0, 16, 76, 117, 99, 101, 110, 101, 32, 105, 110, 32, 65, 99, 116, 105, 111, 110, 8, 9, 49, 57, 51, 51, 57, 56, 56, 49, 55, 0, 18, 76, 117, 99, 101, 110, 101, 32, 102, 111, 114, 32, 68, 117, 109, 109, 105, 101, 115, 8, 9, 53, 53, 51, 50, 48, 48, 53, 53, 90, 0, 0, ....]
```

これらは下記の表のように先頭から、Document 内の Field の番号, データ長, utf8 byte列のデータという並びになっています。

| number << 3 | length | data | 文字列 |
| --- | --- | --- | --- |
| 0 | 16 | 76, 117, 99, 101, 110, 101, 32, 105, 110, 32, 65, 99, 116, 105, 111, 110 | "Lucene in Action" |
| 8 | 9 | 49, 57, 51, 51, 57, 56, 56, 49, 55 | "193398817"
| 0 | 18 | 76, 117, 99, 101, 110, 101, 32, 102, 111, 114, 32, 68, 117, 109, 109, 105, 101, 115 | "Lucene for Dummies"
| 8 | 9 | 53, 53, 51, 50, 48, 48, 53, 53, 90 | "55320055Z"


## 転置インデックスの作成

DefaultIndexingChain クラスの processField メソッドを再びみていきます。

転置インデックスを作成している箇所を抜粋して記載します。

##### lucene/core/src/java/org/apache/lucene/index/DefaultIndexingChain.java
```java
  private int processField(int docID, IndexableField field, long fieldGen, int fieldCount) throws IOException {
    // ...
  
    // Invert indexed fields:
    if (fieldType.indexOptions() != IndexOptions.NONE) {
      fp = getOrAddField(fieldName, fieldType, true);
      boolean first = fp.fieldGen != fieldGen;
      // 転置インデックスを作成
      fp.invert(docID, field, first);

      if (first) {
        fields[fieldCount++] = fp;
        fp.fieldGen = fieldGen;
      }
    } else {
      verifyUnIndexedFieldType(fieldName, fieldType);
    }

    // ...
  }
```

DefaultIndexChain.PerField クラスの、invert クラスでメインの処理が行われています。
注目する場所のみ抜き出した下記に記載します。

##### lucene/core/src/java/org/apache/lucene/index/DefaultIndexingChain.java
```java
    public void invert(int docID, IndexableField field, boolean first) throws IOException {
      // ...

      try (TokenStream stream = tokenStream = field.tokenStream(analyzer, tokenStream)) {
        // ...

        // フィールドを Analyzer で Tokenize する
        while (stream.incrementToken()) {
          // ...
          try {
            // インデックスを追加
            termsHashPerField.add(invertState.termAttribute.getBytesRef(), docID);
          } catch (Throwable th) {
            // ...
          }
        }
        // ...
      } finally {
        if (!succeededInProcessingField && infoStream.isEnabled("DW")) {
          infoStream.message("DW", "An exception was thrown while processing field " + fieldInfo.name);
        }
      }
      // ...
    }
```

このメソッドでやられていることは、主に下記の二つです。

- Analyzer で Tokenize する
- Tokenize された term をそれぞれ Index する

Tokenize する Analyzer は、Main クラスで渡したものが使用されます。今回は、`StandardAnalyzer` クラスを使用しています。

Indexは、`TermsHashPerField` クラス (実際のサブクラスは、`FreqProxTermsWriterPerField`) を経由して最終的には、 `BytesRefHash` クラス の `add` メソッドで行われています。

add メソッドで処理が行われていますが以下の 3 つのフィールドを見ると大まかな、Index の構築がわかります。

- ids
- bytesStart
- pool.buffer

Debug 実行して、変数の中身をのぞいてみた結果、以下のようなデータになっていました。

```
ids = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, -1, -1, 0, 7, 2, 1, -1, -1, 4, 6, -1, 5, -1, -1, -1, -1, -1, 3, -1, -1]
bytesStart = [0, 17, 30, 62, 76, 109, 127, 157, 176, 0]
pool.buffers = [6, 108, 117, 99, 101, 110, 101, 1, 3, 0, 0, 16, 0, 0, 2, 0, 16, 2, 105, 110, 0, 0, 0, 0, 16, 2, 0, 0, 0, 16, 6, 97, 99, 116, 105, 111, 110, 0, 0, 0, 0, 16, 4, 0, 0, 0, 16, 9, 49, 57, 51, 51, 57, 56, 56, 49, 55, 0, 0, 0, 0, 16, 3, 102, 111, 114, 0, 0, 0, 0, 16, 2, 0, 0, 0, 16, 7, 100, 117, 109, 109, 105, 101, 115, 0, 0, 0, 0, 16, 4, 0, 0, 0, 16, 9, 53, 53, 51, 50, 48, +32,668 more]
```

pool.buffers を整理すると以下のようなデータ列になっています。

| start byte | term | length | data | doc_id and freq | position |
| --- | --- | --- | --- | --- | --- |
|  0| Lucene | 6 | 108, 117, 99, 101, 110, 101 | 1, 3, 0, 0, 16 | 0, 0, 2, 0, 16 |
| 17| in | 2 | 105, 110 | 0, 0, 0, 0, 16 | 2, 0, 0, 0, 16 |
| 30| Action | 6 | 97, 99, 116, 105, 111, 110 | 0, 0, 0, 0, 16 | 4, 0, 0, 0, 16 |
| 47| (isbn) | 9 | 49, 57, 51, 51, 57, 56, 56, 49, 55 | 0, 0, 0, 0, 16 |
| 62| for | 3 | 102, 111, 114 | 0, 0, 0, 0, 16 | 2, 0, 0, 0, 16 |
| 76| Dummies | 7 | 100, 117, 109, 109, 105, 101, 115 | 0, 0, 0, 0, 16 | 4, 0, 0, 0, 16 |
| 94| (isbn) | 9 | 53, 53, 51, 50, 48, 48, 53, 53, 90 | 0, 0, 0, 0, 16 |
|109| Instant | 7 | 105, 110, 115, 116, 97, 110, 116 | 0, 0, 0, 0, 16 | 0, 0, 0, 0, 16 |
|127| NET | 3 | 110, 101, 116 | 0, 0, 0, 0, 16 | 4, 0, 0, 0, 16 |
|141| (isbn) | 10 | 49, 55, 56, 50, 49, 54, 53, 57, 52, 48 | 0, 0, 0, 0, 16 |
|157| Managing | 8 | 109, 97, 110, 97, 103, 105, 110, 103 | 0, 0, 0, 0, 16 | 0, 0, 0, 0, 16 |
|176| GigaBytes | 9 | 103, 105, 103, 97, 98, 121, 116, 101, 115 | 0, 0, 0, 0, 16 | 2, 0, 0, 0, 16 |
|196| (isbn) | 9 | 53, 53, 48, 54, 51, 53, 53, 52, 65 | 0, 0, 0, 0, 16 |

同じ表にまとめてしまいましたが、(isbn) と記載している行は StringField のデータなので、後ろ 2 列のデータは、TextField とは異なっているかと思います。


参考にさせていただいた、{{< exlink text="こちらのサイト" href="https://www.m3tech.blog/entry/lucene-mem-invert" >}} にも記載がありましたが、ids => bytesStart => pool.buffers と辿ることで、転置インデックスにアクセスできるようになっています。

例えば、"action" と検索された時には、"action" 文字列をハッシュすると 16 が得られ、それを元に ids を参照すると、termID 2 が得られます。
そしてこの termID で、bytesStart を参照すると、30 という数値が得られ、pool.buffers の 30 byte 目からデータを見れば良いということがわかるという形です。

## まとめ

今回は、検索エンジンである Lucene を実際に動かしつつ、ソースコードを追うことで検索エンジンの動きを探ってみました。
特に、文書をインデックスする際にどのような動きになっているか、どのようにデータが保持されているのかを深掘りしました。

まだまだ追いきれてないところも多いですが、なんとなくどのような処理を行なっているのか大雑把に把握できたのがよかったです。
検索する際の処理なども気になるので引き続き深掘りしてみようと思います。

## 参考にしたサイト

下記のサイトがコードや動作の理解をする上で非常に参考になりました。

- {{< exlink href="https://www.m3tech.blog/entry/lucene-mem-invert" >}}
- {{< exlink href="https://www.m3tech.blog/entry/2020/11/24/160916" >}}

## さいごに

明日の記事は、{{< exlink href="https://qiita.com/jun910" text="@jun910" >}} さんの、「日々の業務をする上で役立った・よく使うGASのtips」になります。お楽しみに。


