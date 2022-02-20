+++
title="MySQL の Deadlock 解決のためのメモ"
date="2022-02-20T11:59:42+09:00"
categories = ["engineering"]
tags = ["mysql", "rds", "deadlock", "innodb"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は実際にであった MySQL の Deadlock と調査した内容を備忘録として残していきます。

## エラー内容の確認

以下のようなサーバーエラーが発生していました。

```
java.sql.SQLTransactionRollbackException: (conn=100000) Deadlock found when trying to get lock; try restarting transaction
```

Scala を用いているので java のエラーが出てますが、deadlock が起きていることがエラーログからわかりました。

## SHOW ENGINE INNODB STATUS を確認

次にどのクエリで deadlock が発生しているのを特定するために、MySQL の `SHOW ENGINE INNODB STATUS` を確認します。

詳しい見方としてはこちらの記事が大変参考になります。

- {{< exlink href="https://soudai.hatenablog.com/entry/2017/12/20/030013" text="なぜあなたは SHOW ENGINE INNODB STATUS を読まないのか">}}

MySQL サーバーに入り、以下のコマンドで `SHOW ENGINE INNODB STATUS` の結果を確認できます。

```
mysql > pager less -S
PAGER set to 'less -S'

mysql > SHOW ENGINE INNODB STATUS\G;
```

`pager less -S` を使うと読みやすい形式で表示されます。

実際に上記コマンドを実行すると以下のような表示がされます。
主に `LATEST DETECTED DEADLOCK` のセクションを見ます。

```
------------------------
LATEST DETECTED DEADLOCK
------------------------
2022-02-20 00:00:00 0x2b4104c19700
*** (1) TRANSACTION:
TRANSACTION 99999999999, ACTIVE 0 sec inserting
mysql tables in use 1, locked 1
LOCK WAIT 9 lock struct(s), heap size 9999, 9 row lock(s), undo log entries 1
MySQL thread id 99999, OS thread handle 9999999999999, query id 9999999 127.0.0.1 sample update
insert ignore into `orders` (`item_id`,`user_id`,`count`,`purchased_at`)  values ('189a5b46af9a', 2, 3, '2022-02-20 00:00:00') 

*** (1) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 99999 page no 99999 n bits 0 index PRIMARY of table `orders` trx id 9999999999 lock_mode X locks rec but not gap waiting
Record lock, heap no 9 PHYSICAL RECORD: n_fields 99; compact format; info bits 0
(省略)

*** (2) TRANSACTION:
TRANSACTION 99999999999, ACTIVE 0 sec inserting
mysql tables in use 1, locked 1
LOCK WAIT 31 lock struct(s), heap size 9999, 9 row lock(s), undo log entries 99
MySQL thread id 99999, OS thread handle 9999999999999, query id 99999999 127.0.0.1 sample update
insert ignore into `stocks` (`item_id`, `count`, 'created_at')  values ('189a5b46af9a', 2, '2022-02-20 00:00:00') 
*** (2) HOLDS THE LOCK(S):
RECORD LOCKS space id 99999 page no 99999 n bits 0 index PRIMARY of table `stocks` trx id 9999999999 lock_mode X locks rec but not gap
Record lock, heap no 9 PHYSICAL RECORD: n_fields 99; compact format; info bits 0
(省略...)

*** (2) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 99999 page no 999999 n bits 0 index PRIMARY of table `stocks` trx id 9999999999 lock_mode X locks rec but not gap waiting
Record lock, heap no 9 PHYSICAL RECORD: n_fields 99 ; compact format; info bits 0
(省略...)

*** WE ROLL BACK TRANSACTION (1)
```

数値やテーブル名などは全て仮の数値に置き換えてますが大まかに上記のようなログになります。

`*** (1) TRANSACTION:` と、`*** (2) TRANSACTION:` のセクションをみるとそれぞれどのクエリで deadlock が発生しているのかがわかります。

今回の例だと以下の部分のクエリで deadlock が発生しています。

```
Tx1:
insert ignore into `orders` (`item_id`,`user_id`,`count`,`purchased_at`)  values ('189a5b46af9a', 2, 3, '2022-02-20 00:00:00') 

Tx2:
insert ignore into `stocks` (`item_id`, `count`, 'created_at')  values ('189a5b46af9a', 2, '2022-02-20 00:00:00') 
```

あくまで例ですが、注文デーブルと在庫テーブルでデッドロックが起きていそうということとします。

また、どのような形式のロックを取得したかどうかについても記載されています。

```
Tx1:
*** (1) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 99999 page no 99999 n bits 0 index PRIMARY of table `orders` trx id 9999999999 lock_mode X locks rec but not gap waiting
Record lock, heap no 9 PHYSICAL RECORD: n_fields 99; compact format; info bits 0
(省略)

Tx2:
*** (2) HOLDS THE LOCK(S):
RECORD LOCKS space id 99999 page no 99999 n bits 0 index PRIMARY of table `stocks` trx id 9999999999 lock_mode X locks rec but not gap
Record lock, heap no 9 PHYSICAL RECORD: n_fields 99; compact format; info bits 0
(省略...)
```

`RECORD LOCKS` とあるので、行レベルの X (排他) ロックをとっていることがわかります。

また、末尾に `but not gap` とあるので gap ロックは発生していないこともわかります。

MySQL のロックの種類に関しては、{{< exlink href="https://dev.mysql.com/doc/refman/5.6/ja/innodb-record-level-locks.html" text="公式のドキュメント" >}} が参考になるので見てみてください。

## トランザクション分離レベルを確認

前節で、gap ロックは発生していないことがわかりましたが、MySQL のトランザクション分離レベルも確認しておきます。
(最初に確認しても良いかもしれません)

なぜかというと、トランザクション分離レベルによって取りうるロックが変わるためです。
具体的にいうと、`READ COMMITTED` の場合には gap ロックが発生しなくなります。

調べ方は以下の通りです。

```
mysql> SELECT @@GLOBAL.tx_isolation, @@tx_isolation;
+-----------------------+-----------------+
| @@GLOBAL.tx_isolation | @@tx_isolation  |
+-----------------------+-----------------+
| READ-COMMITTED        | READ-COMMITTED  |
+-----------------------+-----------------+
1 row in set (0.00 sec)

```

自分の環境では、READ-COMMITTED だったのでそもそも gap ロックなどは発生しない環境でした。

deadlock の調査の過程で、DELETE の空振りによる ネクストキーロックなども調査しようとしていたので、まず確認すると良さそうです。

## アプリケーションログを確認

大体 deadlock が発生するクエリなどは確認できたので、実際にどのようなリクエストや処理によってデッドロックが起きうるかを確認します。

`SHOW ENGINE INNODB STATUS` の結果から、在庫や、注文を INSERT する処理で deadlock が起きていることが想像できます。

これらの処理を実行するような API リクエストや、エラーが発生した付近のアプリケーションログやリクエストログなどを確認して大まかにどのようなケースで deadlock が発生しているかを特定します。

## コードの確認

大まかなケースが特定したらコードを確認します。

今回の説明用のケースでは、商品の購入とキャンセル時の処理で deadlock を起こしていそうなことがわかりました。

具体的なコードは以下のようなイメージです。それぞれの処理はトランザクションがはられている前提です。

(実際の商品購入処理は以下のようにはならないと思いますが、あくまで説明用のサンプルなのでご了承ください)

```scala
def order(item: Item) {
    // 在庫テーブルからdelete
    deleteStock(item.ID)

    // 注文テーブルに insert
    addOrder(item)
}

def cancel(item: Item) {
    // 注文テーブルから delete
    deleteOrder(item.ID)

    // 在庫テーブルに insert
    addStock(item)
}
```

この例だと上記の `order` と `cancel` が同時にリクエストされた場合に、deadlock が発生します。

| | Tx1 (order) | Tx2 (cancel) |
| --- | --- | --- |
| Tx1 開始 | begin | |
| Tx2 開始 | | begin |
| Tx1 が stock テーブルに Xロック | deleteStock | |
| Tx2 が order テーブルに Xロック| | deleteOrder |
| Tx1 が order テーブルにロック要求 (WAIT) | addOrder | | 
| Tx2 が stock テーブルにロック要求 (WAIT) | | addStock | 
| Deadlock !! | | | 

これを修正するためにはそれぞれのテーブルへの処理順を揃えてあげれば良いです。

```scala
// orders → stocks の順番に処理するように修正

def order(item: Item) {
    // 注文テーブルに insert
    addOrder(item)

    // 在庫テーブルからdelete
    deleteStock(item.ID)
}
def cancel(item: Item) {
    // ...
}
```

以下のような処理順に変更されます。

| | Tx1 (order) | Tx2 (cancel) |
| --- | --- | --- |
| Tx1 開始 | begin | |
| Tx2 開始 | | begin |
| Tx1 が order テーブルに Xロック | addOrder | |
| Tx2 が order テーブルにロック要求 (WAIT) | | deleteOrder |
| Tx1 が stock テーブルに Xロック | deleteStock | | 
| Tx1 終了 | commit | |
| Tx2 が order テーブルを Xロック) | | deleteOrder | 
| Tx2 が stock テーブルを Xロック| | addStock | 
| Tx2 終了 | | commit |

Tx2 が待たされますが deadlock は発生せず、Tx1 の処理が完了した後に正常に動作します。

今回の説明ではかなり単純な例ですが、deadlock が発生するのは 1 トランザクション内で 複数書き込みなどで ロックを取得する処理で、処理順などが固定されてないケースに発生しやすいのでもちろんどのような原因なのかを考察した上でですが処理順を揃えたりソートしたりするのが有効そうです。

## まとめ 

今回は、MySQL にて deadlock の発生から現象の確認をして修正するところまでの対応を備忘録として残しました。

deadlock は複雑なシステムほど起きやすく解決も難しいケースが多いので、この記事で紹介した `SHOW ENGINE INNODB MYSQL` の読み方や、アプリケーションログからどのような事象が起きているのかを正確に把握することが重要そうだなと実感しました。


