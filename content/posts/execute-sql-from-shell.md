+++
title="ShellScript から MySQL コマンドを実行する"
date="2023-02-26T17:46:53+09:00"
categories = ["engineering"]
tags = ["mysql", "shellscript", "linux"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

mysql で SQL を実行する場合、mysql-client から実行するケースが殆んどだと思いますが、ShellScript から実行できるようにしておくと色々と自動化できたり、何かと便利なので方法についてまとめます。

## 環境
ローカルで以下のような環境を作って試しました。

#### docker-compose.yml
```yml
version: "3.9"

services:
  mysql:
    image: mysql:8.0.28
    container_name: mysql-container
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: sample
    volumes:
      - ./my.cnf:/etc/mysql/conf.d/my.cnf
```

#### my.cnf
```cnf
[mysqld]
character_set_server = utf8mb4
collation_server = utf8mb4_ja_0900_as_cs

[mysql]
default-character-set = utf8mb4

[client]
default-character-set = utf8mb4
```

以下のように接続できます。

```bash
$ mysql -h 127.0.0.1 -P 3306 -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8Server version: 8.0.28 MySQL Community Server - GPL

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> status;
--------------
mysql  Ver 8.0.32-0ubuntu0.20.04.2 for Linux on x86_64 ((Ubuntu))
Connection id:          8
Current database:
Current user:           root@172.19.0.1
SSL:                    Cipher in use is TLS_AES_256_GCM_SHA384
Current pager:          stdout
Using outfile:          ''
Using delimiter:        ;
Server version:         8.0.28 MySQL Community Server - GPL
Protocol version:       10
Connection:             127.0.0.1 via TCP/IP
Server characterset:    utf8mb4
Db     characterset:    utf8mb4
Client characterset:    utf8mb4
Conn.  characterset:    utf8mb4
TCP port:               3306
Binary data as:         Hexadecimal
Uptime:                 8 min 49 sec

Threads: 2  Questions: 5  Slow queries: 0  Opens: 117  Flush tables: 3  Open tables: 36  Queries per second avg: 0.009
--------------

mysql>
```

## mysql コマンドに SQL を渡して実行する

`-e` オプションでSQL文を渡すと外部から実行できます。

```bash
$ mysql -h 127.0.0.1 -P 3306 -u root -p -e "SELECT NOW()";
Enter password:

+---------------------+
| NOW()               |
+---------------------+
| 2023-02-26 09:05:28 |
+---------------------+
```

また、標準入力からSQL文を実行することもできます。

適当なSQLファイルを作って
```bash
## ファイルを準備
$ cat ./now.sql
SELECT NOW();
```

標準入力に食わせると実行できます。

```bash
## パイプで標準入力
$ cat ./now.sql | mysql -h 127.0.0.1 -P 3306 -u root -p
Enter password:
NOW()
2023-02-26 09:07:55

## リダイレクトで標準入力
$ mysql -h 127.0.0.1 -P 3306 -u root -p < ./now.sql
Enter password:
NOW()
2023-02-26 09:07:55
```

ちなみに余談ですが、mysql のコマンドで表示を整えるオプションがあるので紹介します。

### `--table`, `-t`

テーブルフォーマットで出力します。

```bash
$ mysql -t -h 127.0.0.1 -P 3306 -u root -p -e "SELECT NOW();"
+---------------------+
| NOW()               |
+---------------------+
| 2023-02-26 09:11:50 |
+---------------------+
```

### `--verbose`, `-v`, `-vv`, `-vvv`

より詳細な情報を出します。面白いのは、v を重ねるとより詳細な情報が見れます。
v １つ (`-v`) だと実行したクエリ情報も表示されます。

```bash
--------------
SELECT NOW()
--------------

NOW()
2023-02-26 09:12:35
```

v 2 つ (`-vv`) だと `1 row in set` という箇所と、`Bye` という文言が追加されています。

```bash
--------------
SELECT NOW()
--------------

NOW()
2023-02-26 09:13:03
1 row in set

Bye
```

v 3 つ (`-vvv`) だと、テーブルフォーマットになった上で実行時間などが表示されます。

```bash
--------------
SELECT NOW()
--------------

+---------------------+
| NOW()               |
+---------------------+
| 2023-02-26 09:13:30 |
+---------------------+
1 row in set (0.00 sec)

Bye
```

## まとめ

今回は、ｍysql-client に対して外から SQL を渡して実行する方法についてメモしました。

`mysql` コマンドで対話形式で SQL を打つ方式の他に、上記のように標準入力などからSQLを実行することができます。
これらを使うと、shell で一括でデータを更新したり、定期的に SQL を実行したりなどが簡単にできるので運用などで必要な場合に役立ちそうです。
