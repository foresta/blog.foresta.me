+++
title="ISUCON10 に参加してきた話"
date="2020-09-12T21:48:58+09:00"
categories = ["engineering"]
tags = ["isucon", "isucon10"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

9/12 日に行われた ISUCON 10 に参加して，惨敗したので記録を残しておこうと思います．

悔しい結果に終わってしまいましたが，とても楽しかったです！

## 今回の題材

今回の課題アプリケーション は ISUUMO でした.
> ISUUMO は ISUCON 社が提供する「イスに似合う不動産を検索できる」総合情報サイトです。
>
> リモートワークの普及によって、自宅のイスが生産性に直結することがわかった。 その調査結果を受けて、よりよい座環境を求め郊外に住むことを考えるユーザーが増加。 また、注目度が増したことで bot からもアクセスが急増し、機会損失が発生している。 結果として ISUUMO にアクセスが集中し、負荷に耐えられないことが目立ってきた。
> 
> 社長「なんか最近遅いみたいだから、いいかんじに早くしといてくれる？ 21 時にバーンと新しい CM 打つしさ！」

とのことでした．毎回課題が面白くてすごいなぁと思います.

https://gist.github.com/progfay/25edb2a9ede4ca478cb3e2422f1f12f6


また，今回のアプリケーションの特徴としては，next で静的サイトを generate して nginx でホスティングされていて，参加者は API側をチューニングするというものでした．

実装言語は，去年と同様 golang で参加しました．ちなみに初期実装に Rust もあったのは驚きました．(あとで読んでおこう)

## やったこととか

時系列順にやったことをざっくりと記録していきます．\
時系列うろ覚えなので正確ではないかもです．

### 事前準備

Deployや，profile を取るための スクリプト類をチームメンバーの方が整備してくれて，それを持って臨みました．
ISUCONに，出場したのは 4回目くらいでそれまでにスクリプト化した秘伝のタレ的なやつがいくつかあったので ISUCON もどんどんカスタマイズして使ってました．


最終的には，以下のようなコマンドでアプリのデプロイが完了していてとても便利でした．
```
$ make && make prod deploy
```

### 12:00 ~ 

まずは，色々と足回りを整える作業をしていました．

- レギュ−レーションの読み込み
- ssh の設定
- nginx で bot を弾く設定
- src を git で管理
- etc 系 (nginxや，mysqlの設定ファイル) の git 管理
- Makefile を整備 (環境情報を整備したり)
- pprof の仕込み
- アプリケーションの動作確認
- ソースコードの概要把握
- profile (pt_query_digest, kataribe) の準備

### 14:30 ~

一通り足回りが整ってきたのでアプリケーションの修正を始めました．

- Json エンコーダの書き換え
- slow ログを見ながら，DBにインデックスを貼る
- アプリケーションの微修正

このときの 17:00 頃の時点で，スコアが，713 とかでした．

### 17:00 ~

このあたりから，水面下で実装していた，なぞって検索の N+1 を解消するコードが動き出しました．
なぞって検索は，MySQL側で Polygon の内側判定をするのではなく，アプリケーション側の go で実装を行うことで，DB へのクエリを 1 回にしました．

また，このあたりのタイミングで MySQL と App を別サーバーに分離しました．

結果としてスコアが，大体 1200 くらいまで上がりました．

この時点ではギリギリ 25 位 圏内だったので，これはもうちょっとだということでわいわいしてました.

### 18:00 ~

これ以降はなぞって検索のクエリを高速化するのと，getLowPricedChair, getLowPricedEstate を高速化するのに別れて最後までチューニングをしていました．

結論からいうと，これらの修正は間に合わず，最終 ベンチマークが Fail する状態で終えてしまいました．
とても悔やまれます．


## getLowPricedChair と getLowPricedEstate について

getLowPricedchair() と，getLowPricedEstate() は アプリのTOPページでよばれていて，呼び出し回数が多く，また中で実行されていたクエリが以下のようなもので， index を貼っても index フルスキャンが．発生していました．

```
SELECT * FROM chair WHERE stock > 0 ORDER BY price ASC, id ASC LIMIT 20
```

高速化のアイデアとしては，Low Priced な，データのみをインメモリキャッシュしようと思いました．
今回のアプリケーションの特性上，書き込みがとてもすくなかったインメモリキャッシュを使えば高速化できそうだなと思った次第です．

インメモリキャッシュは，{{< exlink href="https://slack-redir.net/link?url=https%3A%2F%2Fgist.github.com%2Fcatatsuy%2Fe627aaf118fbe001f2e7c665fda48146" text="こちら" >}} を参考にさせていただきつつ実装しました．

```go
var cache = NewCache()

type lowPricedCache struct {
	sync.RWMutex
	chairs  []Chair
	estates []Estate
}
func NewCache() *lowPricedCache {
	c := make([]Chair, Limit)
	e := make([]Estate, Limit)
	ca := &lowPricedCache{
		chairs:  c,
		estates: e,
	}
	return ca
}
func (c *lowPricedCache) SetChairs(chairs []Chair) {
	c.Lock()
	c.chairs = chairs
	c.Unlock()
}
func (c *lowPricedCache) GetChairs() []Chair {
	c.RLock()
	chairs := c.chairs
	c.RUnlock()
	return chairs
}
```

そして，buyChair で，在庫 (stock) の更新するタイミングと，postChair で 椅子を追加するタイミングで，キャッシュを 新しくDBから取得し直してリフレッシュするといった作戦で実装を進めました．


が，どうしてもベンチでレスポンスエラーになってしまい，最後まで実装を反映することが出来ませんでした．

ソースコード自体は，以下のような形で実装していました．

```go
func buyChair(c echo.Context) error {

    tx, err := db.Beginx() // ここでトランザクション開始 

    //
    // 椅子購入の更新処理
    // ...
    // ..
    // 

    // キャッシュを更新するために，データ取得
	lowPricedChairs := make([]Chair, Limit)
	cacheQuery := `SELECT * FROM chair WHERE stock > 0 ORDER BY price ASC, id ASC LIMIT ?`
	rows, err := tx.Queryx(cacheQuery, Limit)
	if err != nil {
		c.Logger().Errorf("failed to cached chair: %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}
	chair := Chair{}
	for rows.Next() {
		err := rows.StructScan(&chair)
		if err != nil {
			continue
		}
		lowPricedChairs = append(lowPricedChairs, chair) // 問題の処理
	}
	c.Echo().Logger.Infof("lowPricedChair \"%v\"", lowPricedChairs)

    // Rollback ように，以前の状態の情報も取得
	beforeCache := cache.GetChairs()

	setLowPricesChairs(lowPricedChairs)
	err = tx.Commit()
	if err != nil {

        // Commit に失敗したら，キャッシュをロールバック
		setLowPricesChairs(beforeCache)
		c.Echo().Logger.Errorf("transaction commit error : %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}
	return c.NoContent(http.StatusOK)
```

問題は以下の部分で，make で 領域を確保しているのにもかかわらず，append でさらに領域を追加してしまうという凡みすでした．

```go
	lowPricedChairs := make([]Chair, Limit)
    // ...
	for rows.Next() {
		err := rows.StructScan(&chair)
		if err != nil {
			continue
		}
		lowPricedChairs = append(lowPricedChairs, chair) // 問題の処理
	}
```

ただしくは，以下のような感じです．

```go
	lowPricedChairs := make([]Chair, Limit)
    index := 0
	for rows.Next() {
		err := rows.StructScan(&chair)
		if err != nil {
			continue
		}
		lowPricedChairs[index]  = chair
        index = index + 1
	}
```

競技には，間に合わなかったのですが競技後ローカルでためしてみたところ，うまく動いてそうに見えました．

ベンチマークを回してみないことにはなんとも言えなかったのですが，これは結構スコアあげることができたんじゃないかなーと個人的には思っていてとても悔やまれます．


## 反省とか

今回，個人的にかなりくやまれたのが，ローカルで動かせる環境を作らなかったことでした．

競技終了後に，ローカル環境を構築して手元で cache の中身をログに吐きながら確かめたところ，割とすぐに原因を特定できました．

これはかなり痛かったなぁと思います．

ローカル環境自体は，Docker で mysql たてて，アプリケーションを実行して，最初に `POST /initialize` をたたけば DB のセットアップもされるので結構楽に出来ました．
あとは，ローカルに向かって curl や Postman などで API たたきながら動作確認ができました．

## 感想

悔しい結果に終わってしまいましたが，今回もとても楽しかったです．純粋にもっと実装力がほしい．．．となりました．

途中で，ポータルなどが 502 ではいれなかったり，3台目のサーバーにログインできなかったりとトラブルはありましたが，どちらも運営の方が迅速に対応してくださっていたのがとても印象的でした．ありがとうございましたっ！
ポータルをしてくださっている様は，まるで一緒に ISUCON を行っているかのようで臨場感がすごかったです．

さいごに，一緒に戦ってくれた {{< exlink href="https://twitter.com/peto_tn" text="@peto-tn" >}} さん，{{< exlink href="https://twitter.com/matsukaz" text="@matsukaz" >}} さん お疲れ様でした，そしてありがとうございました！\
また，インフラを作成してくださったり，トラブルの解決を行ってくださった運営の方々ほんとうにお疲れ様でした！そして本当にありがとうございました！楽しかったです！

参加された皆様もお疲れ様でした！！

