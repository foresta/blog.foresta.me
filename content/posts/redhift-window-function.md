+++
title="Redshift 分析のための Window 関数まとめ"
date="2021-06-06T08:00:00+09:00"
categories = ["engineering"]
tags = ["redshift", "postgresql", "sql", "analysis", "window_function"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Redshift に溜まったユーザーの行動ログを分析しようとして Window 関数について調べてました．
Window関数をある程度理解するとかなり分析の幅が増えるので，今回はWindow関数について学んだことをまとめます．

## PostgreSQL と Amazon Redshift について

Window関数の前に，Redshift と PostgreSQL の関係性について述べておきます．

{{< exlink href="https://docs.aws.amazon.com/ja_jp/redshift/latest/dg/c_redshift-and-postgres-sql.html" text="Amazon Redshift の 公式サイト" >}} に書いてありますが，Redshift は PostgreSQL に基づいています．

基本的には共通しているところが多いですが，Amazon Redshift のほうがより分析ように特化しておりデータセットが巨大な場合や，SQLが複雑な場合に向いているようです．

ただし，頻繁に更新されたり，同時に複数SQLが実行されるような環境には向いていないようです．

## Window 関数の書式

それでは早速 Window 関数の書き方について見ていきます．

Window 関数は主に SELECT 句 などで使用でき以下のような書式になります．

```
Window関数 OVER (
    PARTITION BY パーティション 
    ORDER BY 並び順 
    ROWS Windowフレーム
)
```

具体的な例を上げます．


```sql
SELECT
    user_id,
    action,
    datetime,
    -- 各ユーザーごとに取った行動の新しい順で2番めの値を取得
    NTH_VALUE(action, 2) 
    OVER (
        PARTITION BY user_id 
        ORDER BY datetime DESC 
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    )
-- ユーザーの行動ログ
FROM user_logs
```


上記の例を用いながら `Window関数`, `パーティション`，`並び順`，`Windowフレーム` の順に見ていきます．


## Window 関数

Window 関数は，Windowという区切られた区間についての処理を行う関数になります．

```sql
NTH_VALUE(action, 2) -- <- ココ
OVER (
    PARTITION BY user_id 
    ORDER BY datetime DESC 
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
```

上記の例で言うところの，`NTH_VALUE(action, 2)` という箇所が Window 関数になります．

Windowに対して使用する関数には大きく分けて2種類あり，Window関数としてしか使用できないものと，Group BY などでもしようできる集約関数があります．


##### Window 関数のみ

| 関数 | 説明 |
| ----- | ----- |
| CUME_DIST | パーティション 内の累積分布を計算．Windowフレームは指定できない
| FIRST_VALUE | Windowフレーム の最初の行の値を返します
| LAST_VALUE | Windowフレーム の最後の行の値を返します
| LAG | パーティション内の現在行より，<br>指定されたオフセットだけ前の行の値を返します．<br>Windowフレームは指定できない
| LEAD | パーティション内の現在行より，<br>指定されたオフセットだけ後ろの行の値を返します．<br>Windowフレームは指定できない
| NTH_VALUE | Windowの指定された行の値を返します
| ROW_NUMBER | パーティション内の行番号
| RANK | 並び順に基づいて，ランク付けをします

##### 集約関数

| 関数 | 説明 |
| ----- | ----- |
| AVG | 平均
| COUNT | 個数
| MAX | 最大値
| MIN | 最小値
| SUM | 総和

すべての関数は {{< exlink href="https://docs.aws.amazon.com/ja_jp/redshift/latest/dg/c_Window_functions.html" text="公式サイト" >}} を参照してください．

また，Window関数の種類によっては，パーティション，並び順，Windowフレームを省略できたり，はたまた必須であったりするので使用する際には上記の公式サイトをみて確認してみてください．

## パーティション

パーティションは，どのような区間でデータを分けるかを指定します．概念としては GROUP BY と似ていますが，GROUP BY が区間を 1行に集約するのに対し，パーティションは集約されません．

```sql
NTH_VALUE(action, 2) 
OVER (
    PARTITION BY user_id -- <- ココ
    ORDER BY datetime DESC 
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
```

上記の例のように，`PARTITION BY` に続いて区間をわけるキーとなるフィールドを指定します．ここでは，ユーザーごとの区間にログを分けている指定になります．

## 並び順

並び順は，パーティション内の区間のデータをどのように並び替えるかを指定します．

```sql
NTH_VALUE(action, 2) 
OVER (
    PARTITION BY user_id 
    ORDER BY datetime DESC  -- <- ココ
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
```

通常の ORDER BY 句と同じような指定方法になります．この例では，ユーザーごとに行動ログを区間分けしその中で新しいモノ順に区間内をならべています．

## Windowフレーム

Window フレームは順序付けされたパーティション内に対してさらに絞り込むことが出来ます．

書式としては，以下のようになります．

```
ROWS BETWEEN {開始行の指定} AND {終了行の指定}
```

開始行の指定は以下を指定できます．

|指定|説明|
| ----- | ----- |
| UNBOUNDED PRECEDING | パーティション内の先頭の行 |
| CURRENT ROW | 現在の行 |
| {N} PRECEDING | 現在行より，{N}行前 |


終了行は以下のように指定できます．

|指定|説明|
| ----- | ----- |
| UNBOUNDED FOLLOWING | パーティション内の最後の行 |
| CURRENT ROW | 現在の行 |
| {N} FOLLOWING | 現在行より，{N}行後 |


```sql
NTH_VALUE(action, 2) 
OVER (
    PARTITION BY user_id 
    ORDER BY datetime DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING -- <- ココ
)
```

上記の例だと，パーティション内のすべての行を指定しています．


## まとめ

Redshift (PostgreSQL) の Window 関数について今回はまとめました．
Window関数が使いこなせるようになると，一気に分析のしやすさがぐんと上がるのでユーザーの行動ログなどそういった分析をする際には，チェックしておくとよいかと思います．

