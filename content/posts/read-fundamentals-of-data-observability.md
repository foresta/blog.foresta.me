+++
title="『Fundamentals of Data Observability』を読んだ"
date="2024-02-04T20:21:23+09:00"
categories = ["engineering"]
tags = ["data-engineering", "data-observability", "observability", "data-pipeline", "data-quality"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、O'Reilly から洋書で発売されている、『Fundamentals of Data Observability』を読んだのでメモです。


## 書籍について

こちらの本は、2023年の8月に出版されている書籍で、今のところ翻訳された書籍はなさそうです。

- {{< exlink href="https://learning.oreilly.com/library/view/fundamentals-of-data/9781098133283/" >}}


目次は以下のような感じです。

```
Preface

I. Introducing Data Observability
  1. Introducing Data Observability
  2. Components Of Data Observability
  3. Roles Of Data Observability In A Data Organization

II. Implementing Data Observability
  4. Generate Data Observations
  5. Automate The Generation Of Data Observations
  6. Implementing Expectations

III. Data Observability In Action
  7. Integrating Data Observability In Your Data Stack
  8. Making Opaque Systems Translucent

Afterword: Future Observations
```

Data Observability の紹介 => 実装について => 実践といった形の構成です。

この書籍では、別の本である {{< exlink href="https://www.oreilly.co.jp/books/9784814400126/" text="『オブザーバビリティ・エンジニアリング』" >}} も参照されているので合わせて読むと良さそうです。

## 感想など

この本は、自分が昨年の 10 月からデータエンジニアにジョブチェンジした際に読もうとしていた本です。もともと Software Engineering の文脈での Observability には興味があり、Data Observability という概念も面白そうだなと思い読みました。


この本では Data Observability とはなんなのかという話から始まり、なぜ Data Observability を実装すべきなのかということが語られています。

データドリブンな意思決定の重要性は色々なところで語られています。\
その意思決定の基礎となるデータとそれを生成するプロセスについて、透明化されていて説明可能であり信頼できるものでなければ誤った意思決定をまねきかねません。
意思決定のもととなったデータを説明可能にするという点で、Data Observability が重要だという話はとても納得しました。


またこの本では、Data Observability を実現するために、何を計装するべきなのか？どうやって実現するのかといったことについても語られていてよかったです。

What としては、Lineage や、Schema、データ処理アプリケーションのバージョン情報やソースコードのローケーションなど様々な Conext を付与したデータを観測可能にすべきという話があります。

How として、自前で実装したアプリケーションにどのように Data Observability を実現するのかという点もそうですが、ブラックボックスで触れないシステムに対して観測可能にするための Tips なども記載されていてこちらはかなり実用的に感じました。
私の感覚としては、Data Engineering まわりは様々なツール群が大量にありそれをどのように組み合わせて使うケースが多いように思います。そのようなブラックボックスが多い状況下に置いてどのように Observability を確保していくのかといった方針は学びがありました。

この本を読んで、実際に自分が触っているシステム群でどのように Data Observability を実現するかを考えるための知識が手に入ったような気がします。

## まとめ

今回は、Fundamentals of Data Observability という本を読んだ感想を書きました。

Data Observability という概念についての本はそもそもあまりないのですが、とても学びがありました。

個人的には洋書だったので読むのが大変だったのですが、DeepL を使いまくってなんとか読み切れました。よかったです。
この調子で Fundamentals of Data Engineering の方も読んでいこうと思います。
