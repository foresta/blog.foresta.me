+++
title="トランザクション分離レベル"
date="2023-09-24T21:30:19+09:00"
categories = ["engineering"]
tags = ["database", "transaction"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

トランザクション分離レベルについてまとめます。

## 分離レベルについて

[以前の記事](/posts/acid-properties/) で ACID 特性についてまとめましたが、トランザクション分離レベルは分離性についての概念です。

以下のような種類があります。

- 直列化可能 (Serializable)
- スナップショット分離 (Repeatable Read)
- Read Committed 
- Read Uncommitted 

上から順に分離レベルが高いものになっています。分離レベルの高さとパフォーマンスはトレードオフの関係にあります。

また、分離レベルにより以下の問題が発生したりしなかったりします。

- Dirty Read
- Non-Repeatable Read
- Phantom Read

### 直列化可能 (Serializable)

直列化可能は、複数のトランザクションが並行で実行されたときでも直列で実行したときと同様の振る舞いになることを保証する分離レベルです。
一番制約が厳しいものですが、パフォーマンスは劣化します。

MySQL の公式には以下のように記載されています。

- {{< exlink href="https://dev.mysql.com/doc/refman/8.0/ja/glossary.html#glos_serializable" >}}
> これは、SQL 標準で指定されるデフォルト分離レベルです。 実際には、この強度が必要になることはほとんどないため、InnoDB のデフォルトの分離レベルは次に厳しい REPEATABLE READ です。

### スナップショット分離 (Repeatable Read)

Phantom Read は起きるが Non-Repeatable Read と Dirty Read は起きないという分離レベルです。
Nonrepeatable Read (Fuzzy Read) が起きないように、複数バージョンのスナップショットを並行で管理するような仕組みが実装されていて、MVCC (multi-version concurrency control: マルチバージョンへ移行制御) と呼ばれる手法が用いられています。

InnoDB のデフォルトの分離レベルです。

### Read Committed 

Read Committed は、Dirty Read は起きないが、Non-Repeatable Read, Phantom Read は発生するといった分離レベルです。
この分離レベルでは、コミットしていない変更が他のトランザクションから見えないことを保証します。(Dirty Read が発生しないことを保証)

データベースが古い状態と新しい状態を２つ保持することで、トランザクションが更新中は他のトランザクションからは古い状態を見るようにするように実装されているらしいです。

### Read Uncommitted 

トランザクションの制約が最も少ない分離レベルです。
Dirty Read, Non-Repeatable Read, Phantom Read すべて発生する可能性があります。

不整合が起きる可能性があるため、慎重に扱う必要がありそうです。

たとえば Read しか無い DB などでは使用しても良いのかもしれません。

## まとめ

今回は、トランザクション分離レベルについて簡単にまとめました。

それぞれの分離レベルがなにを保証しているのか適切に理解して運用することが重要そうです。
扱う Database の Middleware によって定義なども少しずつ違いそうなので要注意だなと思います。
