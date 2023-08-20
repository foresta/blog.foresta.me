+++
title="DynamoDB のキャパシティユニットについて"
date="2023-08-20T10:54:11+09:00"
categories = ["engineering"]
tags = ["aws", "dynamodb", "infra"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

DynamoDB のキャパシティユニットについて調べたのでまとめます。

## DynamoDB のキャパシティユニットについて

DynamoDB の料金体系の一つとして、キャパシティユニットという単位での料金課金があります。

キャパシティユニットは以下のような基準で消費されます。

### Read

読み込みのキャパシティユニットは、読み込むDynamoDB のアイテム 4KB ごとに消費されます。

また、読み込みには以下の種類があり、それぞれ消費するユニットが違います。
(デフォルトは、結果整合性のある読み込みです。)

| 種類 | 消費ユニット |
| --- | --- |
| 強力な整合性のある読み込み | 1 |
| トランザクション読み込み | 2 |
| 結果整合性のある読み込み | 0.5 |


たとえば 1 Item のデータサイズが 6KB で、結果整合性のある読み込みをするとすると 1 Item を Read するのに 1 unit 消費します。

```
ceil(6KB / 4KB) * 0.5 = 2 * 0.5 = 1
```

トランザクション読み込みであれば、

```
ceil(6KB / 4KB) * 2 = 2 * 2 = 4
```

となります。

読み込みは、下記の方法があります。

- GetItem
- BatchGetItem
- Query
- Scan

トランザクションありは、下記です。

- TransactReadItems


BatchGetItem については注意が必要で、複数テーブルの合計のデータ量で消費 unit が決まるのではなく、一つ一つの Item サイズに応じて決まります。

公式の例を引用すると、6.5 KB と 1.5 KB の Item を結果整合性のある読み込みをするとした場合に、

```
ceil( (6.5 + 1.5) / 4.0) ) * 0.5 = ceil(8.0 / 4.0) * 0.5 
                                 = 2 * 0.5 
                                 = 1 unit
```

で 1 unit分というわけではなく、

```
(ceil(6.5KB / 4.0KB) + ceil(1.5KB / 4.0KB)) * 0.5 = (2 + 1) * 0.5 = 1.5 unit
```

となります。


### Write

書き込みのキャパシティユニットは、書き込むアイテムごとに 1 KB ごとに消費されます。
書き込みの種類は以下のとおりです。


| 種類 | 消費ユニット |
| --- | --- |
| 書き込み | 1 |
| トランザクション書き込み | 2 |

書き込みの処理は、下記になります。

- PutItems
- UpdateItem
- DeleteItem
- BatchWriteItem

トランザクションありは下記です。

- TransactWriteItems

書き込みの消費キャパシティユニットの計算も読み込み側と同一です。

たとえば、1 Item のデータサイズが 1.5 KB で通常の書き込みをすると 1 Item を Wirte するのに 2 unit 消費します。

```
ceil(1.5KB / 1 KB) * 1 = 2 * 1 = 2
```

## まとめ

今回は、DynamoDB のキャパシティユニットに仕組みについて調べたことを書きました。
キャパシティユニットという概念が間に挟まるので若干理解しづらいですが、キャパシティプランニングなどをする上で重要なので、この機会に調べられてよかったです。

### 参考

- {{< exlink href="https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/ProvisionedThroughput.html#ItemSizeCalculations.Reads" text="DynamoDB のプロビジョンされた容量テーブルの設定の管理" >}}
- {{< exlink href="https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/transaction-apis.html#transaction-apis-txgetitems" text="Amazon DynamoDB Transactions: 仕組み" >}}
- {{< exlink href="https://qiita.com/Takayuki_Nakano/items/b1b383391a930dac43c7" text="DynamoDB を適切な料金で利用したい - Qiita" >}}


