+++
title="Github Projects でタスク管理をしてCLI でタスク登録できるようにする"
date="2023-11-19T21:24:54+09:00"
categories = ["engineering"]
tags = ["todo", "github"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

タスク管理ツールに何を使用するか。永遠の課題ですが今回 GitHub Projects で管理してみようと思いいろいろ試してみたのでメモします。

## Github Projects でタスク管理

GitHub Projects は、プロジェクト管理に使えるものですが個人のタスクを管理するために使えないかと思い試してみています。

{{< figure src="/images/posts/todo-at-github-projects/todo-projects.png">}}

上記のようにタスクを管理できます。

内部的には、Issus を作りそれを Projects に紐付けることで管理ができるという感じです。
ボード形式の他にもガントチャートなどもつくれるようで、GitHub Projects を作る際にいくつかのテンプレートから選択することができます。

## CLI からタスクを追加したい

これでしばらく運用してみようと思いますが、CLI からサクッとタスクを追加したいなと思い、Shell script を書きましたがいくつかハマりどころがあったのでメモしておきます。

最終的に以下のような感じでタスクを追加できるようになりました。

```bash
$ ./todo.sh add 本を読む
```

Shell script で使用しているツールとして以下をインストールしました。

- gh (GitHub CLI)
- jq

### subcommand を扱う

`todo.sh add {TITLE}` で追加できるようにしたいため subcommand を扱える必要があります。

以下のように、case 文で雑に扱いました。

```bash
SUB_COMMAND="$1"
shift

function list() { /**/ }
function add() { /**/ }
function usage() { /**/ }

case ${SUB_COMMAND} in
    ls)
        list
        ;;
    add)
        add $1
        ;;
    *)
        usage
        ;;
esac
```

### タスク追加処理

タスクの追加処理は、以下のような順に処理を行います。

- Issue を作成しつつ Project に紐付ける
- 作成された Project Item の Status フィールドを TODO の値に書き換える

コードで言うと以下のようなステップが必要でした。(もう少し簡略化できるかもです。)

```bash
function add() {
    TITLE=$1

    # Issue 作成
    ISSUE_URL=$(gh issue create --repo ${REPO} --project ${TODO_PROJECT} --title ${TITLE} --body "")
    echo "issue: ${ISSUE_URL} created."

    # ItemId を取得
    ITEM_ID=$(get_item_id_from_issue_url ${ISSUE_URL})

    # Project Id を取得
    PROJECT_ID=$(get_project_id)

    # `TODO` の ID を取得
    TODO_OPTION_ID=$(get_todo_status_id) 

    # Status フィールドの ID を取得する
    FIELD_ID=$(get_field_id "Status")

    # Item の編集. Status を TODO に変更する
    gh project item-edit --id ${ITEM_ID} --field-id ${FIELD_ID} --single-select-option-id ${TODO_OPTION_ID} --project-id ${PROJECT_ID}
}
```

まずは、Issue の作成ですが、こちらは `gh` コマンドを使用して作成します。

```bash
    ISSUE_URL=$(gh issue create --repo ${REPO} --project ${TODO_PROJECT} --title ${TITLE} --body "")
```

引数に、`--repo` (Repository), `--project` (Github Projects 名), `--title`,`--body` (Issue の Title と Body) を渡します。
結果として、ISSUE の URL が返ってくるのでそれを変数に入れます。

変数 `${TODO_PROJECT}` ですが、こちらProject名で指定できるみたいで、今回であれば以下のような感じになってます。

```bash
TODO_PROJECT="やることリスト"
```

次に、Project に紐づけた Issue の ItemId を取得します。Project の 1 Item ごとに ID が振られるのですが、後ほど Status を `Todo` に更新する際にこの ItemId が必要です。

```bash
    ITEM_ID=$(get_item_id_from_issue_url ${ISSUE_URL})j
```

上記のように書いてますが、`get_item_id_from_issue_url` は以下のような実装になってます。

```bash
# Project 名から、Project の number を取得する
function get_project_number() {
    gh project list | grep ${TODO_PROJECT} | awk '{print $1}'
}

# Project の Item List を Json 形式で取得する
function list_json() {
    gh project item-list $(get_project_number) --owner ${OWNER} --format json
}

# Item List から特定の Issue URL の ItemId を取得する
function get_item_id_from_issue_url() {
    ISSUE_URL=$1
    list_json | jq -r '.items[] | select(.content.url == "'${ISSUE_URL}'") | .id'
}
```

このあたりはかなり力技ですが、gh コマンドで取得できる結果を jq でゴリっとフィルタリングして目的の値を取得してます。

次に、ProjectId の取得ですが、こちらも Project名を元に、ProjectId を取得し後続の Item 編集で使います。

```bash
function get_project_id() {
    gh project list | grep ${TODO_PROJECT} | awk '{print $4}'
}
```

その次は、GitHub Project 独自で必要なものになりますが、Status (Todo or Ready or In Progress or Done) を更新するために以下の２つを取得します。

- 更新したい Status Field ID
- Todo Option の ID

GitHub Project では、Item の更新に通常の値を更新する方法と、選択肢の中の一つを更新する方法があります。

今回は、Status という選択式のものを更新する必要があるため、以下のようになります。

```bash
    # Status フィールドの ID を取得する
    FIELD_ID=$(get_field_id "Status")

    # `TODO` の ID を取得
    TODO_OPTION_ID=$(get_todo_status_id) 

    # Item の編集. Status を TODO に変更する
    gh project item-edit --id ${ITEM_ID} --field-id ${FIELD_ID} --single-select-option-id ${TODO_OPTION_ID} --project-id ${PROJECT_ID}
```

`--field-id` と、`--single-select-option-id` が更新対象とその値を示すオプションであり、選択肢は予め GitHub 上に登録したものを使うためその ID を指定する必要があります。
(通常の更新の場合は `--field-id` と `--text` という組み合わせで使います。)


まず、Status フィールドのIDですが以下のように取得しています。

```bash
function get_field_id() {
    OWNER=foresta # GitHub Projects の Owner であるユーザー名
    FIELD_NAME=$1
    gh project field-list $(get_project_number) --owner ${OWNER} | grep ${FIELD_NAME} | awk '{print $3}'
}
```

field-list を取得する gh コマンドがあるためそれを取得した後、指定されたフィールド名で grep しています。

つぎに、あらかじめ登録された (Project 開始時のテンプレート選択すると自動で作成される) Option の中から `Todo` の選択肢の ID を取得するコードは以下のようになります。

```bash
function get_todo_status_id() {
gh api graphql -f query='
  query{
  node(id: "'$(get_project_id)'") {
    ... on ProjectV2 {
      fields(first: 20) {
        nodes {
          ... on ProjectV2Field {
            id
            name
          }
          ... on ProjectV2IterationField {
            id
            name
            configuration {
              iterations {
                startDate
                id
              }
            }
          }
          ... on ProjectV2SingleSelectField {
            id
            name
            options {
              id
              name
            }

          }
        }
      }
    }

  }
}' | jq -r '.data.node.fields.nodes[] | select(.name == "Status") | .options[] | select(.name == "Todo") | .id'
}
```

ここだけ、既存の gh コマンドで取得できなかったため、GraphQL の API を叩いて、登録済みの SelectField を取得しその後 jq で `Todo` をフィルタリングしてます。
この処理は別に API を叩かなくても ID を GitHub Projects のWebページ上から探し出して、変数として持っておくのでも良いです。

自分は無駄なこだわりで API を叩くようにしています。

ここまで実装して、実際に CLI からタスクを登録できるようになります。かなり試行錯誤した結果なのでもう少しスッキリかけるかもしれません。

## まとめ

今回は、 GitHub Projects でタスク管理をして、CLI から TODO を追加できるようなスクリプトを実装してみました。

スクリプトの実装は完全に趣味でやったのですが、Shell script で雑に書くの結構楽しくてよくやってしまいます。
GitHub の API で、`--single-select-option-id` まわり若干わかりにくいのでもし同じようなことしたい場合は参考にしてみてください。


