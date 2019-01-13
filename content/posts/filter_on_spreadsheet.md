+++
title = "Google スプレッドシートで個別にフィルターする方法"
thumbnail = ""
tags = ["tips", "spreadsheet"]
categories = ["engineering"]
date = "2019-01-13"

+++

## 背景

Google スプレッドシートは普段業務などでよく使うかと思います。
私も、バグのチケット管理やタスク管理などで用いることがあります。\
スプレッドシートにはフィルター機能があるのですが、普通にフィルターをかけてしまうと全ユーザーのスプレッドシートがフィルタリングされてしまいます。

たとえば、タスク管理で自分のタスクだけ表示させておきたいといった場合に他の人もそのフィルターの影響を受けてしまします。

当然スプレッドシートには個別にフィルタリングできる機能が用意されているのですが、意外と知らない方が多かったのでその方法をまとめます。

## 方法

今回は以下のようなスプレッドシートを対象に考えます。

{{< figure src="/images/posts/filter_on_spreadsheet/spreadsheet.png" >}}

データ > フィルタ表示 > 新しいフィルタ表示を作成

{{< figure src="/images/posts/filter_on_spreadsheet/make_filter.png" >}}

すると以下のような黒色でフィルタ表示がされます。\
名前がつけられるので、なに用のフィルタか記載しておくとよいでしょう。
（今回は田中タスク確認用と入力しました）


{{< figure src="/images/posts/filter_on_spreadsheet/filtered.png" >}}

この状態で、田中さんのタスクだけ確認しようとしてみると以下のようになります。


{{< figure src="/images/posts/filter_on_spreadsheet/select_tanaka.png" >}}

{{< figure src="/images/posts/filter_on_spreadsheet/filtered_tanaka.png" >}}


このようにすると他のユーザーに影響を与えず好きにフィルタリングすることができます。

## まとめ

スプレッドシート便利なので、こういったフィルタなども駆使してどんどん業務効率化していきましょう！ &#x1f37b;
