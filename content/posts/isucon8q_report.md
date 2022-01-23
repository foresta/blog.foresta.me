+++
date = "2018-09-16"
title = "isucon8予選に参加してきました"
thumbnail = ""
tags = ["isucon"]
categories = ["engineering"]

+++

9 / 15 の予選1日目の土曜日にチーム名「さばかんちゃーはんかれー」として参加して来ました。\
2年前のisucon6にも出場したのですが、今年は本選に参加するぞという意気込みで、5月くらいから過去問解いたり準備を進めていたと思います。


結果としては予選落ちとなってしまいましたが、
限られた時間内で、アプリケーションを高速化させるという非常にエキサイティングな時間を過ごすことができました。

楽しい問題とリッチなダッシュボード等すごく恵まれた環境下でできたなぁと、運営の方々には感謝しかないです。
運営の皆様ありがとうございました。

また、おなじチームで参戦してくださったお二方([@peto_tn](https://twitter.com/peto_tn), [@matsukaz](https://twitter.com/matsukaz)) ありがとうございました。\
そして、参加された皆様おつかれさまでしたー。

## ざっくりタイムライン

自分が観測できた範囲をざっくりと。
実際にはもうちょっとミドルウェアのチューニングとか行ってます。

| 時間 | やったこと |
|:----|:----|
| 10:00 | レギュレーション読み |
| 10:10 | 参考実装をGoに変えてベンチ.<br> たしか1000点ちょっとオーバーくらい. <br>ソースをgithub管理にしたり、アプリをぽちぽちして仕様把握 |
| 10:30 | profile系をガツガツ入れてく <br>ひたすらソースコードリーディング |
| 15:50 | getEventをリファクタしスコアが一気に3万点近くまで上がりみんな盛り上がる。わいわい |
| 16:20 | H2Oからapp1, app2をラウンドロピンで実装.DBサーバーの構成に変更 |
| 17:00 | ベンチがFailしはじめ原因調査 |
| 18:00 | ベンチがFailする問題をを完全に対処しきれず、原因が特定できないまま、appの実装を戻してFinish. |



一時は上位の順位争いに加われてわいわいした空気になってました。\
わいわい

{{< figure src="/images/posts/isucon8q_report/1st.png" title="わいわいしてた時のスクショ" >}}


## 自分やったこともうちょっと詳しく


### sheetsテーブルをコードで置き換える

sheetsテーブルは以下のようなデータ構造でした。

|id|rank|num|price|
|:----|:----|:----|:----|
|1|S|1|5000|
|2|S|2|5000|
|・・・|||
|50|S|50|5000|
|51|A|1|3000|
|52|A|2|3000|
|・・・|||

はじめ、sheetsテーブルにあるDBのレコードを全て



シートのデータは全て計算によって算出できるので以下のようなコードを書いてました。

```go
package main

type SheetMaster struct {
	ID    int64
	Rank  string
	Num   int64
	Price int64
}

func GetSheet(sheetID int64) *SheetMaster {
	return &SheetMaster{ID: sheetID, Rank: sheetIDToRank(sheetID), Num: sheetIDToNum(sheetID), Price: sheetIDToPrice(sheetID)}
}

func ValidateRank(rank string) bool {
	return rank == "S" || rank == "A" || rank == "B" || rank == "C"
}

func sheetIDToPrice(sheetID int64) int64 {
	return rankToPrice(sheetIDToRank(sheetID))
}

func sheetIDToNum(sheetID int64) int64 {

	rank := sheetIDToRank(sheetID)

	if rank == "S" {
		return sheetID
	}

	if rank == "A" {
		return sheetID - 50
	}

	if rank == "B" {
		return sheetID - 200
	}

	if rank == "C" {
		return sheetID - 500
	}

	return sheetID
}

func rankToPrice(rank string) int64 {

	if rank == "S" {
		return 5000
	}

	if rank == "A" {
		return 3000
	}

	if rank == "B" {
		return 1000
	}

	return 0
}

func sheetIDToRank(sheetID int64) string {
	if sheetID <= 50 {
		return "S"
	}

	if sheetID <= 200 {
		return "A"
	}

	if sheetID <= 500 {
		return "B"
	}

	return "C"
}
```

すごいベタ書きですが、これでDBアクセスを減らそうという作戦でした。

INNER JOINとかしている箇所に関しては全て対応しきれませんでした。
そのせいもあってか結果的にスコアへの影響は微々たるものでした。

### 席予約時の無駄なDBアクセスをなくす

レギュレーションに\

> 予約( POST /api/events/\d+/actions/reserve ) : 10点/1リクエスト
 
とあったのでここを改善しようともくろみ、席予約できるまでループしDBアクセスするところを改善しました。

具体的には、
以下のような処理になってたました。

```go
var sheet Sheet
var reservationID int64
for {
    if err := db.QueryRow("SELECT * FROM sheets WHERE id NOT IN (SELECT sheet_id FROM reservations WHERE event_id = ? AND canceled_at IS NULL FOR UPDATE) AND `rank` = ? ORDER BY RAND() LIMIT 1", event.ID, params.Rank).Scan(&sheet.ID, &sheet.Rank, &sheet.Num, &sheet.Price); err != nil {
    if err == sql.ErrNoRows 
        return resError(c, "sold_out", 409)
	}
    return err
    }

    // 以下reservationテーブルにINSERT成功したらbreak
}

```

これを先に空席を全て取得してシャッフルしたあと、INSERTしに行くように修正していきました。
以下のような感じ。

```go

// 空席を取得
rows, err := db.Query("SELECT id, num FROM sheets WHERE id NOT IN (SELECT sheet_id FROM reservations WHERE event_id = ? AND canceled_at IS NULL FOR UPDATE) AND `rank` = ?", event.ID, params.Rank)
if err != nil {
	if err == sql.ErrNoRows {
		return resError(c, "sold_out", 409)
	}
	return err
}
defer rows.Close()

// 構造体に保持
sheet_id_with_nums := make([]*SheetIDWithNum, 0)
i := 0
for rows.Next() {
    var sheet_id int
    var num int
    err := rows.Scan(&sheet_id, &num)
    if err != nil {
        return err
    }
    sheet_id_with_nums = append(sheet_id_with_nums, &SheetIDWithNum{ ID: sheet_id, Num: num })
    i++
}

// シャッフル
shuffle(sheet_id_with_nums)

for _, sheet := range sheet_id_with_nums {

    // 以下reservationテーブルにINSERT成功したらbreak
}
```

これもあまりスコアに対して大きなインパクトはありませんでした。

### その他

あとは、github管理する足回りのところやったりとか(手間取って反省)、細かい改善系とかやってました。

## 感想

### 反省とか

自分があまりスコアに貢献できなかったのが非常に悔やまれました。\
あまりインパクトがない場所に対しての改善をしていた感じがして、無駄なところに時間をかけ過ぎていた印象です。\
[pprof](https://golang.org/pkg/net/http/pprof/)でのパフォーマンス計測も試みたのですが、Gateway Error(502)が出てしまい計測できずに断念しました。

ベンチがfailし始めてからも、原因を特定できずあたふたしてた気がします。


よかった点としては、

* getEventをわりと早い段階で潰せて良かった
* 前もって用意したスクリプトにより、デプロイ / プロファイル等が多少楽になった。
* 上位争いを体験できた

3つ目は完全に、自分以外のお二人のおかげでした。実力不足が悔やまれます。


### まとめ的なやつ

最近はずっとクライアント側のコードを書いているせいかサーバーサイドのボトルネックの勘所みたいな点が欠けていたなと。精進が足りませんね。たくさんコード書くぞ。

結果は残念でしたが、非常に楽しかったです。\
リベンジを果たしすためぜひ来年も是非参加したいですね。

{{< tweet user="kz_morita" id="1041287231061671936" >}}

