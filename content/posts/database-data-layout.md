+++
title="データベースのデータレイアウトについて"
date="2021-08-15T23:47:19+09:00"
categories = ["engineering"]
tags = ["database", "db"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。
今回は、データベース内のデータの保持の仕方として、行指向、列指向、ワイドカラムストアについてまとめます。

## データレイアウトとは

DBMS 内で一連のデータどのようなまとまりで保持するかについてです。

以下の3つに分類できます。

- 行指向データレイアウト
- 列指向データレイアウト
- ワイドカラムストア

### 行指向データレイアウト

データを行・レコード単位で格納します。
ID, Name, Email, Type を持つようなデータの場合以下のような単位でデータが格納されます。

```
- User1: 1, "Hoge", "hoge@example.com", "ADMIN"
- User2: 2, "Fuga", "fuga@example.com", "NORMAL"
- User3: 3, "Piyo", "piyo@example.com", "NORMAL"
```


通常のWebサービスのユーザーテーブルのようにデータの1行ごとにアクセスするようなワークロードの場合、一緒に扱うデータがより近く保存されるため効率が良くなります。（空間的局所性）
しかし、大量のデータから特定の列だけ抜き出して分析するようなワークロードの場合一度全ての列のデータをディスクから取得したのちにフィルタするため多少効率が悪くなります。

MySQL などが該当します。

### 列指向データレイアウト

データを列・垂直方向の単位で格納します。
ID, Name, Email を持つようなデータの場合以下のような単位でデータが格納されます。

```
- ID: 1, 2, 3
- Name: "Hoge", "Fuga", "Piyo"""
- Email: "hoge@example.com", "fuga@example.com", "piyo@example.com"
- Type: "ADMIN", "NORMAL", "NORMAL"
```

こちらは例えば `Type = ADMIN` のユーザー数を数えるなどといった多くのレコードに対して集計をするようなワークロードの場合に向いています。
Type がまとまってストレージに配置されるので空間的局所性が改善されます。

また、Type のようなデータの場合、同じデータが並ぶケースが多くなりますが(特にソートされていれば)、その場合ディスク上の圧縮効率が高くなるという点もあります。

行指向の場合とは反対に、1 ユーザーの全てのフィールドを参照するようなワークロードには向きません。

Amazon Redhift などが該当します。

### ワイドカラムストア 

行キーに対して、複数の列ファミリを持つといった構造になります。

以下のようなデータを考えます。
ユーザーごとにプロフィール情報と、ソーシャルアカウント情報のリストを持つようなデータです。

| id | profile | | social_account | |
| --- | --- | --- | --- | --- |
| id | username | email | url | type |
| 1 | "Hoge" | "hoge@example.com" | "https://twitter.com/-----" | "TWITTER" |
|  |  | | "https://facebook.com/-----" | "FACEBOOK" |
| 2 | "Fuga" | "fuga@example.com" | "https://twitter.com/-----" | "TWITTER" |
| 3 | "Piyo" | "piyo@example.com" | "https://twitter.com/-----" | "TWITTER" |

id が 行キーとなり、profile と social_account それぞれの 列ファミリを持つような構造になります。

これは以下のような列ファミリごとにデータが保存されます。
列ファミリ内は行指向のデータレイアウトになります。


#### profile 列ファミリ

| id | username | email |
| --- | --- | --- |
| 1 | "Hoge" | "hoge@example.com" |
| 2 | "Fuga" | "fuga@example.com" |
| 3 | "Piyo" | "piyo@example.com" |

#### social_account 列ファミリ

| id | url | type |
| --- | --- | --- |
| 1 | "https://twitter.com/-----" | "TWITTER" |
| 1 | "https://facebook.com/-----" | "FACEBOOK" |
| 2 | "https://twitter.com/-----" | "TWITTER" |
| 3 | "https://twitter.com/-----" | "TWITTER" |


基本は列指向なので、profile と social_account を列ごとに保持しますが、多次元のデータを扱っていて、その内容自体は行指向のデータレイアウトで保持しています。

## まとめ

今回はデータベース内のデータレイアウトについてまとめました。
行指向、列指向、ワイドカラムストアとそれぞれのDBごとに向き不向きがあるので、把握した上で適切な選定を行えるようにしていく必要がありそうです。

