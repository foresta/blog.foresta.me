+++
title="Jira のアクションを使って作業時間を計測する"
date="2023-05-20T15:23:52+09:00"
categories = ["engineering"]
tags = ["jira"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、普段使っている Jira で作業時間を算出するために、Jira のアクションを使って計測してみたので、方法についてまとめます。

## Jira で作業時間を計測する

### 下準備

まず準備として、Jira に以下の 3 つのカスタムフィールドを追加します。

- 着手時刻: datetime
- 完了時刻: datetime
- リードタイム(分): number

{{< figure src="/images/posts/jira-trigger-lead-time/add-custom-field.png" >}}

次にカスタムフィールドの ID を知るために、上記のフィールドが入ったチケットを実際に作成します。

{{< figure src="/images/posts/jira-trigger-lead-time/sample-ticket.png" >}}

作成したら右上のメニューから、`XMLのエクスポート` を選択します。

{{< figure src="/images/posts/jira-trigger-lead-time/xml-export-menu.png" >}}

すると以下のようなXMLが表示できます。

{{< figure src="/images/posts/jira-trigger-lead-time/exported-xml.png" >}}

後ほど使うので、着手時間フィールドのIDを控えておきます。
今回のケースだと、`customfield_10034` となります。

ここまで準備できたら OK で、実際に Jira のアクションを作成していきます。

### アクション作成

アクションですが基本的に、トリガー (いつ) と条件 (どれを) とアクション (なにする)をセットで作っていきます。


今回は 3 つアクションを作ります。

- 着手時刻記録用
- 完了時刻記録用
- リードタイム算出用

#### 着手時刻記録用

以下のような情報で作ります。

##### トリガー

{{< figure src="/images/posts/jira-trigger-lead-time/start-trigger.png" >}}

課題のトランジション時を選択して、ソースステータスに、`オープン` ターゲットステータスに `DOING` を選択します。
要は課題が着手開始されたときのステータスの遷移時に発火するように設定します。

##### 条件

{{< figure src="/images/posts/jira-trigger-lead-time/start-filter.png" >}}

今回は、対象のプロジェクトだけに適用するようなトリガーにしたいため、上記のような条件を設定しました。

##### アクション

{{< figure src="/images/posts/jira-trigger-lead-time/start-action.png" >}}

上記のように、着手時刻のフィールドに対してトリガーが発火された時刻を入力するように設定します。

`{{now}}` の部分は Jira の smart value と呼ばれる書き方で色々な記載ができます。

公式に色々と書き方が紹介されています。
- {{< exlink href="https://support.atlassian.com/cloud-automation/docs/examples-of-using-smart-values-with-text-strings/" >}}


最後に名前をつけてアクションを有効化します。

{{< figure src="/images/posts/jira-trigger-lead-time/start-on.png" >}}

#### 完了時刻記録用

次に、完了時刻記録用のアクションを作ります。
こちらは基本的に、着手時刻記録用と同じ為スクショだけ貼っておきます。


{{< figure src="/images/posts/jira-trigger-lead-time/done-trigger.png" >}}
{{< figure src="/images/posts/jira-trigger-lead-time/done-filter.png" >}}
{{< figure src="/images/posts/jira-trigger-lead-time/done-action.png" >}}

#### リードタイム算出用

最後にチケットにかかった時間を算出するアクションを作成します。

トリガーは、完了時刻記録用と同じタイミングで条件は他のものと同じもので設定するため割愛します。

アクションのところには以下のように設定します。

{{< figure src="/images/posts/jira-trigger-lead-time/calc-readtime-action.png" >}}

```
{{issue.customfield_10034.diff(now).minutes}}
```

上記の customfield_10034 は、カスタムフィールドを作成したときに最初に確認した `着手時刻` フィールドの ID になります。

これを公開して、実際にテストしてみます。

まずは、ステータスを `OPEN` から `DOING` に変更してみます。


{{< figure src="/images/posts/jira-trigger-lead-time/action-on-open-to-doing.png" >}}

少し待ってページをリロードすると着手時間のところに現在時刻が書かれました。

次は、ここから完了にしてみます。

{{< figure src="/images/posts/jira-trigger-lead-time/action-on-doing-to-done.png" >}}

無事正常に動きました!

完了時刻と、リードタイムの 2分という数値がちゃんと表示できています。

これでチケットのステータスを変えるだけで、自動で作業時間が記録されるようになりました。


ちなみに、アクションが失敗していた際などのデバッグや実行ログを見るためには `自動化 > 監査ログ` という項目を見ればよいです。
こちらで実行ログが表示され、失敗された場合にもこちらに表示されエラーメッセージが読めます。


{{< figure src="/images/posts/jira-trigger-lead-time/action-log.png" >}}

## まとめ

今回は、Jiraチケットの作業時間を自動で計算するアクションの作り方についてまとめました。

作ったモチベーション自体は、お問い合わせ対応によって開発の時間がとれないなどといったチーム内の問題からなるものです。
結構簡単に作れたので、まずは状況を可視化するという手段によさそうだと思います。
