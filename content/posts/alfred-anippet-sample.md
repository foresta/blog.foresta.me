+++
title="Alfred に登録している Snippet を紹介してみる"
date="2023-07-17T00:10:00+09:00"
categories = ["engineering"]
tags = ["alfred", "作業効率化"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

普段作業効率化のため、Launcher アプリとして {{< exlink href="https://www.alfredapp.com/" text="Alfred" >}} を使用しています。Alfred には Snippet 機能がありそこにいろいろなものを登録していて便利だったので一部紹介してみます。

以下のような format で紹介してみます。

```bash
# snippet のタイトル
# 説明
$ {実際に実行するコマンド}
```

## git 系

過去の [こちらの記事](/posts/git_useful_command_collection/) でも紹介している git コマンドを登録していて定期的にお掃除したりしています。

お掃除系はこんな感じ
```
# git remove merged
# マージ済みブランチの削除
$ git branch --merged | egrep -v "\*|master|develop" | xargs git branch -D

# git plune
# リモートで消されたブランチをローカルに反映
$ git remote prune origin

# git git remove origin removed branch
# 削除されたリモートブランチとおなじローカルブランチを削除
$ git branch --format "%(refname:short) %(upstream:track)" | grep "\[gone\]" | awk '{print $1}' | xargs -IXXX git branch -D XXX
```

他にも以下のようなものも登録しています。意外と使います。

```bash
# copy branch
# 現在のブランチ名を clipboard にコピー
$ git rev-parse --abbrev-ref HEAD | pbcopy

# diff main
# 現在のブランチとmain ブランチとの diff をとる
$ git diff master `git rev-parse --abbrev-ref HEAD`
```

## Curl 系

こちらは開発している API などに検証用のリクエストを投げるときなどに使用してます。
以下のようなフォーマットで登録していて、ローカル、検証環境、ステージング環境、本番環境ごとに各種 API の Endpoint を Snippet に登録しています。
(以下は仮ですがこんなイメージで登録してます。)

```bash
# [LOCAL][ItemAPI]POST_/items
# Local 環境のItemAPI に POST リクエストを投げる
curl -X POST -H "Content-Type: application/json"-d \
'{
  "item_name": "HogeHoge",
  "item_type": "FugaFuga"
}' \
http://localhost:8080/items 

# [PROD][ItemAPI]POST_/items
# Local 環境のItemAPI に GET リクエストを投げる
curl http://item-api.example.com/items/1111
```

これが結構便利で、いろんな環境でいろんな API に対してすっと動作確認できるようにしてます。
タイトルに環境名や API名を入れるのがコツでいれることで、Alfred 上で Fuzzy find できるようになります。

ただこのあたりの機能であれば、Postman などつかうのもよさそうです。

## SQL 系

こちらは調査や分析などで頻繁にたたくものなどを snippet に登録してます。
以下は Athena の例ですがいつもなんども書いているようなクエリを Snippet に登録してます。

```sql
-- [Athena] all_item
-- 全Item情報のSQL. Re:dash で書くのでそれ用の変数の書き方とかも書いたりしてます
-- dt カラムでパーティション切られてたりする想定
with
item as (
    SELECT item_id, category_id, name
    FROM items
    WHERE
        Date("dt") = date '{{ date }}'
),
item_category as (
    SELECT item_category_id, category_name
    FROM item_categories
    WHERE
        Date("dt") = date '{{ date }}'
)
SELECT *
FROM item
INNER JOIN item_category
    ON item_category.item_category_id = item.category_id
```

上記は item と item_category は常に一緒に見る項目で毎回 join するのを書いたりするのが面倒なときに Snippet に登録しているみたいなユースケースです。
日付パーティションとかあると地味にクエリ書くのが大変なので楽しようとしてます。

## まとめ

今回は、Alfred の Snippet に登録しているものを一部紹介しました。

登録してて便利なものがあったら是非おしえてください。
