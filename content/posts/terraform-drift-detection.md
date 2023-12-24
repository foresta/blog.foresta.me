+++
title="GitHub Actions で Terraform の Drift を検知する"
date="2023-12-24T12:03:49+09:00"
categories = ["engineering"]
tags = ["terraform", "github-actions"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、GitHub Actions で Terraform の Drift を検知する仕組みを構築したのでやったことを書いてみます。

構築した中でいくつか Tips があったのでそこを中心に書きます。
なお以下の内容は本記事で触れませんのであらかじめご了承ください。

- GitHub Actions から Snowflake に対して Terraform Plan を実行する方法
- GitHub Actions から Slack 通知するための Slack 側の設定


また、今回は利用しておらず構築してから存在に気づいたのですが、`tfaction` という action で drift-detection をサポートしているみたいなのでこちらを採用してもよいかもしれません。

- {{< exlink href="https://suzuki-shunsuke.github.io/tfaction/docs/feature/drift-detection/" >}}


## モチベーション

私は業務で Snowflake を使用していますが、構築に Terraform を利用しています。
Snowflake を運用している中で、意図せず DB や Schema が変わってしまうという出来事がありあわよくば事故になるようなことが発生しました。

ポストモーテムで Snowflake が常に意図した状態であることを保証したいねという話になり、Drift を検知する仕組みを今回構築しました。

## 方針

Drift の検知は定期的に実行したいので、手軽にスケジュール実行できる基盤として GitHub Actions を選びました。

そして、GitHub の main ブランチ上で Terraform Plan コマンドを実行し、diff があれば Slack に通知するという仕組みで構築しました。

{{< figure src="/images/posts/terraform-drift-detection/architecture.png" >}}

## 成果物

先に成果物です。

必要な環境変数などは省略しているので、このままでは動かないです。適宜補完してください。

```yml
name: Terraform Diff Check Workflow
on:
  schedule: 
    # 毎時 plan を実行する
    - cron: '0 * * * *' 
  workflow_dispatch:

env:
  SLACK_POST_TEXT_LIMIT: 2950
  EXIST_DIFF_EXITCODE: 2

jobs:
  diff_check:
    name: terraform-diff-check
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_wrapper: false

      - name: Terraform Init
        id: init
        run: terraform init

      - name: Terraform Validate
        id: validate
        run: terraform validate -no-color

      - name: Terraform Plan
        id: plan
        run: |
          set +e
          terraform plan -detailed-exitcode -out=./plan.tfplan
          echo "plan_exitcode=$?" >> ${GITHUB_OUTPUT}

      - name: No diff
        if: ${{ steps.plan.outputs.plan_exitcode != env.EXIST_DIFF_EXITCODE }}
        run: echo "No diff"

      - name: Save Terraform Show
        if: ${{ steps.plan.outputs.plan_exitcode == env.EXIST_DIFF_EXITCODE }}
        run: |
          terraform show -no-color ./plan.tfplan >> diff_results.txt

      - name: Output Results
        id: check-diff-results
        if: ${{ steps.plan.outputs.plan_exitcode == env.EXIST_DIFF_EXITCODE }}
        run: |
          EOF=$(dd if=/dev/urandom bs=15 count=1 status=none | base64)
          {
            echo "RESULTS<<${EOF}"
            echo "\`\`\`"
            sed -e '$a\' ./diff_results.txt | head -c ${{ env.SLACK_POST_TEXT_LIMIT }}
            echo "\`\`\`"
            echo "${EOF}"
          } >> "${GITHUB_OUTPUT}"

      - name: Notify Slack
        uses: slackapi/slack-github-action@v1.24.0
        if: ${{ steps.plan.outputs.plan_exitcode == env.EXIST_DIFF_EXITCODE }}
        with:
          payload: |
            {
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "plain_text",
                    "text": "Detected terraform diff!!"
                  }
                },
                {
                  "type": "context",
                  "elements": [
                    {
                      "type": "mrkdwn",
                      "text": "limit 3000 chars. View in <https://github.com/${{ github.repository }}/commit/${{ github.sha }}/checks|Actions>"
                    }
                  ]
                }
              ],
              "attachments": [
                {
                  "blocks": [
                    {
                      "type": "section",
                      "text": {
                        "type": "mrkdwn",
                        "text": ${{ toJSON(steps.check-diff-results.outputs.RESULTS) }}
                      }
                    }
                  ] }
              ]
            }
        env:
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

毎時 Terraform Plan を実行し、diff があれば Slack へ Diff 内容とともに通知してくれます。

## Tipsの説明

つまづいたところメインで上記の yml ベースで説明していきます。

### Terraform plan で diff を検出したい

#### -detailed-exitcode オプション

diff を検出するために以下のコマンドを利用しました。

```bash
$ terraform plan -detailed-exitcode -out=./plan.tfplan
```

terraform plan に `-detailed-exitcode` フラグをつけると以下のような終了コードになります。

- 0 = 実行成功 かつ no changes
- 1 = 実行エラー 
- 2 = 実行成功 かつ diff あり

{{< exlink href="https://developer.hashicorp.com/terraform/cli/commands/plan#detailed-exitcode" >}}

exitcode = 0 以外はエラーと見なされるので、この終了コードを利用して検出すれば良さそうです。

#### terraform_wrapper を false にする

ここで注意点があり、setup-terraform の step で、terraform_wrapper というフラグを `false` に設定する必要があります。
この設定を行わないと、すべて exitcode = 0 となりうまく検出することができません。

```
  - name: Setup Terraform
    uses: hashicorp/setup-terraform@v2
    with:
      terraform_wrapper: false
```

↓関連する GitHub Issue
- {{< exlink href="https://github.com/hashicorp/setup-terraform/issues/152" >}}

#### exitcode の保持と条件分岐

以下のように、`failure()` 関数を使用してエラー検知をしてもよかったのですが、
```
  if: ${{ failure() }}
```
diff がある ( = exitcode == 2 ) の時だけ Slack 通知したかったので、今回は終了コードを `$GITHUB_OUTPUT` として保持することにしました。
`$GITHUB_OUTPUT` に保持することで、他の step から変数を参照することができます。

保持するためには、以下を満たす必要があります。

- exitcode == 2 で step が終了しないようにする
- 直前で実行された command の終了コードを取得する

1 つめですが、GitHub Actions の shell はデフォルトで、bash の `set -e` が指定されていて実行エラーがあるとそこで処理が止まってしまいます。これを回避するために、`set +e` とする必要があります。

2 つめは bash の `$?` で直前に実行されたコマンドの終了コードが取得できます。

合わせると以下のようになります。

```yml
  - name: Terraform Plan
    id: plan
    run: |
      set +e
      terraform plan -detailed-exitcode -out=./plan.tfplan
      echo "plan_exitcode=$?" >> ${GITHUB_OUTPUT}
```

これで別の step から以下のように、終了コードがアクセスできるようになります。

```
${{ steps.plan.outputs.plan_exitcode }}
```

### diff 結果を保持して、Slack に投稿したい

今回、検知した diff を Slack 上でみれたら便利だなと思いその仕組みも考えました。

方針としては以下です。

- plan 結果を tfplan ファイルに書き出す。
- show コマンドを利用して、可読性の高い形にする
- Slack 上でみやすい形に整形して、変数に格納する
- Slack 通知の Step で参照する

#### plan 結果をファイルに書き出す

1 つめですが、`terraform plan` コマンドに、`-out` というオプションがあり、plan 結果を file に出力できるためこちらの機能を利用しました。

(↓再掲)
```yml
  - name: Terraform Plan
    id: plan
    run: |
      set +e
      terraform plan -detailed-exitcode -out=./plan.tfplan
      echo "plan_exitcode=$?" >> ${GITHUB_OUTPUT}
```

#### terraform show コマンド

次に、2 つめですが以下のように `terraform plan` の終了コードを確認しつつ `terraform show` コマンドで diff 結果を出力しそのままファイルに書き出しました。

```yml
env:
  EXIST_DIFF_EXITCODE: 2

# ...
# 省略
# ...

  - name: Save Terraform Show
    if: ${{ steps.plan.outputs.plan_exitcode == env.EXIST_DIFF_EXITCODE }}
    run: |
      terraform show -no-color ./plan.tfplan >> diff_results.txt    
```

ファイルに書き出したのは、GitHub Actions の 同一 job 内であれば生成したファイルが別 step でも閲覧できるためです。

#### diff の整形

次に、Slack 上でみやすい形に整形します。

diff の結果を code block として、Slack に通知したかったため、バッククオーテーション 3 つで囲みました。

先に、step を載せます。

```yml
env:
  SLACK_POST_TEXT_LIMIT: 2950

# ...
# 省略
# ...

      - name: Output Results
        id: check-diff-results
        if: ${{ steps.plan.outputs.plan_exitcode == env.EXIST_DIFF_EXITCODE }}
        run: |
          EOF=$(dd if=/dev/urandom bs=15 count=1 status=none | base64)
          {
            echo "RESULTS<<${EOF}"
            echo "\`\`\`"
            sed -e '$a\' ./diff_results.txt | head -c ${{ env.SLACK_POST_TEXT_LIMIT }}
            echo "\`\`\`"
            echo "${EOF}"
          } >> "${GITHUB_OUTPUT}"      
```

#### $GITHUB_OUTPUT に複数行のテキストを格納する

ここが若干はまったポイントです。$GITHUB_OUTPUT に diff 結果を格納したいのですが、改行を含むテキストの場合 `{name}={value} >> ${GITHUB_OUTPUT}` という記法が使えません。

そのためヒアドキュメントを使用する必要があります。下記のようなフォーマットで覚えておくとよいかと思います。

```yml
EOF=$(dd if=/dev/urandom bs=15 count=1 status=none | base64)
{
    echo "RESULTS<<${EOF}"
    echo "改行を含むテキスト"
    echo "${EOF}"
} >> "${GITHUB_OUTPUT}"      
```

ランダムな文字をヒアドキュメントの開始と終了をランダムな文字列にしています。

#### SLACK 用のテキスト整形

また、後述しますが、SLACK に投稿するテキストは 3000 文字という制約があるため、途中で切り捨ててます。

```yml
echo "\`\`\`"
sed -e '$a\' ./diff_results.txt | head -c ${{ env.SLACK_POST_TEXT_LIMIT }}
echo "\`\`\`"
```

1 行目と3 行目は slack 上での見た目を code block にするためのバッククオーテーションです。 (エスケープが必要)

2 行目の `sed` はファイルの末尾に改行を追加するためのイディオムです。

#### Slack に通知する

最後に Slack への通知部分です。

Slack への通知は、以下の actions を利用しています。

- {{< exlink href="https://github.com/marketplace/actions/slack-send" text="slack-send" >}}

payload を渡せるので それを利用します。

先に全体を下記に載せます。

```yml
  - name: Notify Slack
    uses: slackapi/slack-github-action@v1.24.0
    if: ${{ steps.plan.outputs.plan_exitcode == env.EXIST_DIFF_EXITCODE }}
    with:
      payload: |
        {
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "plain_text",
                "text": "Detected terraform diff!!"
              }
            },
            {
              "type": "context",
              "elements": [
                {
                  "type": "mrkdwn",
                  "text": "limit 3000 chars. View in <https://github.com/${{ github.repository }}/commit/${{ github.sha }}/checks|Actions>"
                }
              ]
            }
          ],
          "attachments": [
            {
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": ${{ toJSON(steps.check-diff-results.outputs.RESULTS) }}
                  }
                }
              ] }
          ]
        }            
    env:
      SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

payload のところが複雑に見えるので解説します。

こちらの payload の部分は、Slack の Block Kit という仕組みの記法になります。

- {{< exlink href="https://api.slack.com/block-kit" text="Block Kit" >}}

複雑に見えますが、公式が {{< exlink href="https://app.slack.com/block-kit-builder/" text="Block Kit Builder" >}} というツールを用意してくれていて、ここでインタラクティブに試すことができます。

1点だけこの中で Tips があり、それは diff 結果を `attachments` というブロック内に定義することです。

通常の `blocks` だと、長文でも折りたたまれないので diff が長い場合に Slack が見辛くなります。`attachments` にすることで自動で折りたたまれていい感じになりました。

> Any content displayed within attachments may be wrapped, truncated, or hidden behind a "show more" style option by Slack clients. This isn't the case with the top-level blocks field.
>
> --- {{< exlink href="https://api.slack.com/reference/surfaces/formatting#when-to-use-attachments" text="公式" >}} より引用


## まとめ

今回は、Terraform の Drift を検知するために、GitHub Actions を用いて毎時チェックする仕組みを構築しました。

GitHub Actions 便利なのでこういったタスクがサクッと作れるのはかなりよかったです。

一部、`$GITHUB_OUTPUT` まわりや、Slack 通知まわりでハマることがあったのでこの記事に残しておこうと思います。


