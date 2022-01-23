+++
title="ISUCON11 に参加してきました"
date="2021-08-21T19:41:48+09:00"
categories = ["engineering"]
tags = ["isucon", "isucon11"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

8/21 にオンラインで行われた ISUCON 11 に参加してきました。

惜しくも予選敗退となってしまいましたが、とても楽しかったので、記憶が新しい内にやったことなどを記録しておきます。


## 今回の題材

今回の題材は、ISUCONDITION でした。

今回は予選の問題動画が作成されていたので、まずは下記をご覧いただければと思います。

{{< youtube P-iJ01-riTw>}}

題材としては、椅子から色々なデータが送られてきて、椅子の状態が確認できたりグラフで確認できたりといった内容でした。

題材が発表された時から、POSTリクエストが多くデータ量が増えてくのがボトルネックかもしれないーみたいな話をチームメンバーとした記憶があります。

## やったこととか

時系列でやったことを記録していきます。

### 事前準備

ISUCON には、昔から参加していて秘伝のタレ的な make ファイルがあったので、それを今回は流用しました。

以下のコマンドでデプロイできたりします。

```
$ make && make prod deploy
```

また、個人的な準備としては直前に ISUCON 10 の予選の予習をしたりしました。

### 10:00 ~ 

最初の初動は、以下のようなことをやりました。

- デプロイ系スクリプトの修正
- ソースコードやnginx や mysql の設定ファイルを git 管理
- profiling の準備
    - pt-query-digest
    - kataribe

上記のことが終わって、サービスをなんとなく把握したところで、細い改修性を行いました。

- 外部 URL のjia service url をDBからグローバル変数に変更
- DB に index をはる

DB に Index を貼ったあたりでスコアが伸び、20000 点くらいなりました。

### 12:00 ~

重いところを見当をつけて、少しずつ修正していきました。

#### 画像ファイルの扱い

isu テーブルに、画像ファイルがバイナリで保存されていたため、不要なところでは、select から除外するようにしました。

ほとんどのAPIで画像データは使われてなかったのでこれで結構スコアが伸びました

あとは、画像ファイルをファイルに保存しそれをロードするような修正を行いました。


#### isu_condition の bulk insert

isu_condition の登録処理が、9割のリクエストを破棄する実装になっていたので、ここを早くするのも効果的だろうということで、for 文での insert を bulk insert に変更しました。

この変更あたりで、40000 点ほどになっていたと記憶してます。

### 14:00 ~

この辺りはずっと 40000 点台でなかなか伸び悩んでました。

以下のような施策を行いました

- Index の再見直し
- 最新のisu_condition の キャッシュ
- getIsuList の N+1 の解消

下二つは、実装の複雑さから一旦後回しにしたのであまりスコアが伸びずに苦しい時間帯でした。

### 16:00 ~

この時点で、isu_condition 周りの負荷がかなり大きそうなことがわかっていたので APP サーバーと DB サーバーで2台構成だったのを、3台目を、isu_condition テーブル専用のサーバーとしました。

また、以下のようなクエリでcondition が多い椅子に関しては、3000 レコードぐらいあることがわかったので、できるだけ取得するのを減らすような実装を行いました。

```sql
SELECT * FROM isu_condition WHERE jia_isu_uuid = ? ORDER BY `timestamp` DESC 
```

一番効いたのは、以下の部分で LIMIT 句を追加して limit 分だけしか取らないような変更でした。
正確には、conditionLevel が 3つとも指定されている時のみ LIMIT 句を追加する実装を行いました。

```golang
    if startTime.IsZero() {
        err = db2.Select(&conditions,
            "SELECT * FROM `isu_condition` WHERE `jia_isu_uuid` = ?"+
                "	AND `timestamp` < ?"+
                "	ORDER BY `timestamp` DESC LIMIT ?", // ← ここを追加
            jiaIsuUUID, endTime, limit,
        )
    } else {
        err = db2.Select(&conditions,
            "SELECT * FROM `isu_condition` WHERE `jia_isu_uuid` = ?"+
                "	AND `timestamp` < ?"+
                "	AND ? <= `timestamp`"+
                "	ORDER BY `timestamp` DESC LIMIT ?", // ← ここを追加
            jiaIsuUUID, endTime, startTime, limit,
        )
    }
```

この修正が、18:20 ころであと少ししかないというところでした。最後に下記のdropProbability を下げてみようということになりました。

```golang
func postIsuCondition(c echo.Context) error {
	// TODO: 一定割合リクエストを落としてしのぐようにしたが、本来は全量さばけるようにすべき
	dropProbability := 0.9
```

これまでの修正がかなり効いたのか、0.8 → 0.7 → 0.6 ..... とどんどんと下げていくたびにスコアが上がる状況でここはかなりテンションが上がりました。

最終的に 14 万点 までスコアが伸びました。

### 感想とか

今回も非常に楽しいISUCONでした。

スコアがかなり伸びただけに結果は悔やまれるものとなりました。

{{< tweet user="kz_morita" id="1429310439226101760" >}}

また、思った修正を実装しきれなかったことが心残りではありましたが、チームメンバーの方の修正でスコアがグングン伸びていく様は非常にエキサイティングでした。
ほとんどチームメンバーの方のひらめきや実装力によるものなので、自分ももうちょっと貢献できたらよかったなと思います。


今年も一緒に戦ってくれた {{< exlink href="https://twitter.com/peto_tn" text="@peto-tn" >}} さん， {{< exlink href="https://twitter.com/matsukaz" text="@matsukaz" >}} さん お疲れ様でした，そしてありがとうございました！

また，インフラやポータルサイトを用意してくださったり，色々と大変な準備を行ってくださった運営の方々ほんとうにお疲れ様でした！そして本当にありがとうございました！楽しかったです！

参加された皆様もお疲れ様でした！！


--- 
ちなみに、

一番びっくりしたのが、ISUCON の 公式テーマソングができたことです。かなりカッコ良い曲で好きです！

{{< youtube W7TM1p40yQU >}}
