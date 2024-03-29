+++
title="トランザクションの ACID 特性について"
date="2023-09-10T21:52:37+09:00"
categories = ["engineering"]
tags = ["acid", "transaction", "database"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

トランザクションの ACID 特性についてまとめます。

## ACID 特性とは

以下の頭文字を取ったトランザクションの安全性を保証する特性のことです。

- **A**tomicity (原子性)
- **C**onsistency (一貫性)
- **I**solation (分離性)
- **D**urability (永続性)

一つずつ説明していきます。

### Atomicity

トランザクションが原子 (Atomic) のようにそれ以上分割できない単位になっていることを指します。
トランザクションは、開始されたら `commit` され正常に終了するか、`rollback` され中断、破棄されるかのどちらかのみとします。

トランザクションが実行前か実行が完了している状態のどちらかのみのため、アプリケーションは失敗したらリトライすればよくシンプルになります。

SQL でいう、`BEGIN` ~ `COMMIT`, `BEGIN` ~ `ROLLBACK` は Atomic な単位を宣言するために使われる構文ということになります。

### Consistency

データが満たすべき制約や整合性が、トランザクションの実行中でも満たされているような性質です。
制約や整合性は、定義されたスキーマ通りのデータであったり、外部キーなどの制約、論理的な制約などになります。

一貫性は、データベースが保証できるものではなく、トランザクションを開始するアプリケーションが保証するものになります。

### Isolation

並行して実行されている別のトランザクションとお互いが分離されているような性質です。

分離性にはいろいろなレベルがあり、一番強いレベルの分離性を持つのが、直列化可能性 (Serializability) とよばれるものです。
これは、トランザクションを直列に実行した場合と同じ結果となるように振る舞うような分離レベルになります。

他にも `スナップショット分離` や、`Read Committed` などの Serializability よりも弱い分離レベルがいくつかあります。
（別でまとめようと思います）

### Durability

トランザクションがコミットされたら、データが失われずに永続化される性質です。

データベースが分散しているかどうかで若干意味が変わります。単一のDBの場合はディスクに書かれたこと（リカバリ用の write-ahead ログなども含む）が、分散されているストレージの場合は、一定数のノードにレプリケーションされているといった形です。

## ACID 特性を満たさないものについて

ACID 特性を満たさないシステムを `BASE` と呼ぶそうです。

BASE は以下の頭文字です。

- **B**asically **A**vailable (基本的に利用可能)
- **S**oft state (厳密ではない状態遷移)
- **E**ventual consistency (結果整合性)

明確な定義というよりは、ACID ではないものを指すための用語のようです。

## まとめ

今回は トランザクションの ACID 特性についてまとめました。
概念としては知っていましたが、復習としてまとめることでよく理解できました。
