+++
title="Apache Solr の schema と fl パラメータについて"
date="2021-11-28T21:14:46+09:00"
categories = ["engineering"]
tags = ["solr", "search-engine"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Apache Solr を使った際に、`stored = false` で index したフィールドを確認する件で調査をしたのでまとめます。

## 前提となる schema

前提として、以下のような `schema.xml` とします。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<schema name="solr-sample" version="1.0">
  <fields>
    <field name="field-1" type="string" indexed="true" stored="true" docValues="false" />
    <field name="field-2" type="string" indexed="false" stored="true" docValues="false" />
    <field name="field-3" type="string" indexed="false" stored="false" docValues="true" />
    <field name="field-4" type="string" indexed="false" stored="false" docValues="true" useDocValuesAsStored="true" />
    <field name="field-5" type="string" indexed="false" stored="false" docValues="true" useDocValuesAsStored="false" />
  </fields>
  ...
  ..
</schema>
```

上記では、field-1 ~ field-5 までフィールドを指定しています。

## プロパティについて

ここでは、以下のプロパティに着目します。

- `indexed`
- `stored`
- `docValues`
- `useDocValuesAsStored`

{{< exlink href="https://solr.apache.org/guide/6_6/field-type-definitions-and-properties.html" text="公式のドキュメント" >}} を参考にするとそれぞれ以下のような意味になります。

| プロパティ | 説明 | 値 | Default |
| --- | --- | --- | --- |
| indexed | true であれば、このフィールドの値をクエリで検索できます。 | ture or false | true |
| stored | true であれば、このフィールドの値をクエリで取得できます。 | ture or false | true |
| docValues | true であれば、このフィールドの値は列指向の構造体で配置されます。 | ture or false | false |
| useDocValuesAsStored | docValues が true で、このプロパティも true であれば、fl パラメータのワイルドカード検索時も stored=true と同じようにデータが取得できます | ture or false | true |


今回問題になったのが、`field-5` のケースです。

```
<field name="field-5" type="string" indexed="false" stored="false" docValues="true" useDocValuesAsStored="false" />
```

`stored="false"` で、`useDocValuesAsStored="false"` なので、通常通り検索しても、field-5 は、検索結果のデータには含まれません。

field=1, field-2 は、`stured=true` なので、検索結果に含まれます。field-3, field-4 は、`stored="false"` ですが、`docValues="true"` かつ、`useDocValuesAsStored="true"` (デフォルト値) なので、検索結果に含まれます。

検索結果に含まれない field-5 ですが、このデータを確認するためには、fl パラメータを指定して検索する必要があります。

## fl パラメータ

fl パラメータ (Field List Parameter) を使用して検索をすると、指定されたパラメータに検索結果を制限することが出来ます。

field-5 の値は、fl パラメータが未指定やワイルドカードを使用すると表示することが出来ませんが、
フィールド名を完全一致で指定 (今回の例で言えば、`fl=field-5`) すると、field-5 の実際の値を確認することが出来ます。

## まとめ

今回は、Apache Solr の schema の プロパティと fl パラメータについてまとめました。

まだまだ、Solr は触り始めたばかりなので引き続き、調べたり使っていく中での疑問点はまとめていきたいと思います。
