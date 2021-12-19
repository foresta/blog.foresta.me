+++
title="Amazon Athena でデータの統計量を表示する SQL を書く"
date="2021-12-19T11:47:47+09:00"
categories = ["engineering"]
tags = ["presto", "athena", "sql", "aws"]
thumbnail = ""
+++

こんにちは，{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

データを見る際にデータの傾向を把握するための統計量をだすことはよくあり，pandas などであれば，DataFrame の `describe` メソッド を呼び出せば以下のようなデータを確認することができます．

```
count: 要素数
unique: ユニークな要素数
top: 最頻値（mode）
freq: 最頻値の出現回数
mean: 平均
std: 標準偏差
min: 最小値
max: 最大値
50%: 中央値（median）
25%, 75%: 1/4分位数、3/4分位数
```

以上のような統計量を，Amazon の Athena (Presto) で表示する方法についてまとめます．

## Presto で統計量をだす

Amazon Athena では，Presto という，オープンソースの分散型SQLエンジンがしようされているため，Athena で分析などを行う際は基本的に Presto のドキュメントをみていくことになります．

{{< exlink href="https://prestodb.io/docs/current/" text="Presto Documentation" >}}


データとしては，以下のようなユーザーテーブルを想定します．

##### users 
| user_id | name | age | gender |
| --- | --- | --- | --- |
| 1 | Taro | 24 | Male |
| 2 | Hanako | 30 | Female |
| 3 | Bob | 35 | Male |
| 4 | Alice | 15 | Female |
| 5 | Taro | 34 | Male |

### count: 要素数

要素数をだすためには，count を使用します．

```sql
SELECT count(*) FROM users
```

### unique: ユニークな要素数

ユニークな要素数を返すには，count の中にユニークにしたいキーをいれたSQL を実行します．

```sql
SELECT count(distinct name) FROM users;
```

### top: 最頻値（mode）, freq: 最頻値の出現回数

再頻値は，もっとも多く出現する数を取得します．
Presto には，最貧値もっとも多く出現する `gender` とその数を以下で取得できます．

```sql
SELECT  
    gender,
    count(*) as  cnt
FROM users 
GROUP BY gender
ORDER BY count(*) DESC
LIMIT 1
```

### mean: 平均

Presto で 年齢 (age) 平均を求める場合は，以下のような SQL で実現できます．

```sql
SELECT avg(age)
FROM users
```

ちなみに Presto には，幾何平均 (掛け合わせて，n乗根をとる平均)にもあり，それは以下で求められます．

```sql
SELECT geometric_mean(age)
FROM users
```

### std: 標準偏差

年齢の標準偏差を求めたいときには，以下を用います．

```sql
SELECT stddev(age)
FROM users;
```

### min: 最小値, max: 最大値

最小値，最大値は `min()` `max()` を用いて実現できます．

```sql
SELECT min(age)
FROM users;
```


```sql
SELECT max(age)
FROM users;
```


### 50%: 中央値（median）

Presto には，中央値を取得する関数はありませんが，パーセンタイル値をとる関数があるのでそれを利用します．

```sql
SELECT approx_percentile(age, 0.5)
FROM users;
```

0.5 を指定すると，0.5 パーセンタイル値，つまり中央値を意味します．

### 25%, 75%: 1/4分位数、3/4分位数

中央値と同様に，パーセンタイル値に，0.25 や， 0.75 を渡すことで実現できます．

```sql
SELECT approx_percentile(age, 0.25) FROM users;
SELECT approx_percentile(age, 0.75) FROM users;
```

## まとめ

今回は，Athena で用いられている，Presto で基本的なデータの統計量を取得する方法についてまとめました．

最頻値だけは，Presto の関数を使って求められなかったので mode 関数の導入が期待されます．

{{< exlink href="https://github.com/prestodb/presto/issues/12648" text="Add support for mode(x) or approx_mode(x) in aggregate functions #12648" >}}
