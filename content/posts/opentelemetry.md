+++
title="OpenTelemetry の概要について"
date="2023-08-13T16:38:08+09:00"
categories = ["engineeing"]
tags = ["observability", "opentelemetry"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

[オブザーバビリティ・エンジニアリングを読んだ](/posts/read-observability-engineering/) の記事でも紹介されていた OpenTelemetry についてまとめます。

## OpenTelemetry について

OpenTelemetry については、{{< exlink href="https://opentelemetry.io/docs/what-is-opentelemetry/" text="opentelemetry.io" >}} というWebページで紹介されていました。


公式サイトによると OpenTelemetry はトレース、メトリクス、ログなど (テレメトリデータと呼ばれる) を作成し管理するために設計されたフレームワークやツールキットのことです。

OpenTelemetry には、

- すべてのコンポーネントについての仕様
- テレメトリデータの形式を定義する標準プロトコル
- 一般的なテレメトリデータ型の標準命名スキームを定義するセマンティック規則
- テレメトリデータの生成方法を定義する API
- 共通ライブラリとフレームワークの Instrumentation を実装するライブラリエコシステム
- コード変更を必要とせずにテレメトリデータを生成する自動計測コンポーネント
- 仕様、API、テレメトリ データのエクスポートを実装する各言語の SDK
- OpenTelemetry Collector、テレメトリ データを受信、処理、エクスポートするプロキシ
- OpenTelemetry Operator for Kubernetes などの他のさまざまなツール

などが含まれているようで、プロトコルや仕様などから、実際の SDK やライブラリなどまで含まれているようです。

とくに、データ収集のバックエンドではなく、テレメトリデータの生成、収集、管理、エクスポートに重点をおいていて、データをどのように保存するかや、どのように可視化するかみたいな点については OpenTelemetry の範囲外で別の商用のサービスなどに任せられているそうです。

具体例をいうと、DataDog などは、OpenTelemetry をサポートしているサービスの一つです。

- {{< exlink href="https://docs.datadoghq.com/ja/opentelemetry/" >}}

## Observability と OpenTelemetry については、


OpenTelemetry は Observability を実現するためのツールキットになります。

[前回の記事](/posts/read-observability-engineering/) でも触れましたが、Observability とはシステムの出力を調べることによって、システムの内部状態が理解できる能力のことになります。

具体的には、トレースや、メトリクス、ログなどのテレメトリデータを調べることによって、いまシステムに何が起きているのかがわかるというのが、Observability が高い状態と言えると思います。

逆に言うと、どのようにテレメトリデータを生成、収集、管理すればシステムの内部状態がわかるのかという点について標準化を目指しているのが OpenTelemetry と言えそうです。


## 分散トレースの仕組みについて

現在のシステムはマイクロサービス化されたものも多く、たとえばユーザーの 1 リクエストに対し、複数の Service の API が呼ばれ最終的に一つのレスポンスとするようなシステムは珍しくないと思います。

このように分散されたシステムにおいても、システムの内部状態がわかるようにトレーシングする仕組みがあります。

上記の例で、商品を購入するAPIが、認証API を呼び Cart のAPIを呼び、Order API を呼ぶみたいなケースを考えます。

分散トレースでやりたいこととしては、以下のような可視化をすることにより api の処理でなにが発生しているのかどの処理に時間がかかっているのかなどを知ることです。

{{< figure src="/images/posts/opentelemetry/tracing.png" >}}

上記の画像では、`/api` がよばれたら、まず `Auth API` がよばれ、次に `Cart API` が呼ばれ、その中で `Item API` がよばれ最終的に `Order API` が呼ばれるといったこと例示してます。

これらを実現するためにスパンという概念があります。

### スパン

スパンは上記の図でいうひとつの四角を表すデータになります。スパンには以下のような情報を含むことができます。

- Name
- Parent span ID (空の場合は、Root Span)
- 開始、終了 Timestamp
- Span Context
  - TraceID
  - SpanID
  - Trace Flag (Trace に関する情報を含むバイナリエンコード)
  - Trace State () 
- Attributes
  - Span に紐付けられる任意の Key-Value
- Span Events
  - Span に紐付けられる構造化されたログ
- Span Links
  - Span 同士を相互に紐付けるための方法
  - API としてレスポンスは返すけど非同期で別の処理をするみたいなケースに、それらを紐づけたりできる
- Span Status

その他にもてる情報など、詳しくは以下を参照ください。

- {{< exlink href="https://opentelemetry.io/docs/concepts/signals/traces/" text="Traces | OpenTelemetry">}}

先程の図のような階層構造を表現するために、Parent span ID を持つことができるようになっていて、Observability のバックエンドであるサービスがこの Parent Span ID などをみて、Visualize するような仕組みになっています。

## まとめ

今回は、OpenTelemetry について概要をまとめました。
Observability を実現するための標準化のためのツール群なので、DataDog などのTrace 機能があるバックエンドを使用する際にも OpenTelemetry について知っておくと理解が早くなりそうだと思いました。
