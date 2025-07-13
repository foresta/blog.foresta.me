+++
title="Oeilly Radar 2025-07"
date="2025-07-13T18:40:05+09:00"
categories = ["engineering"]
tags = ["oreilly", "radar"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

{{< exlink href="https://www.oreilly.com/radar/radar-trends-to-watch-july-2025/" text="Radar Trends to Watch: July 2025" >}} の中で気になったところをメモします。


## Magenta RT

{{< exlink href="https://magenta.withgoogle.com/magenta-realtime" >}}

Google が出したリアルタイム音楽生成のAIモデル。

demo 動画を見ると、Input の Music を与えて、そこに「disco dunc」 というプロンプトを与えて、パラメータをいじるとリアルタイムで、ファンクなカッティングギターが音楽に自然に合成されていました。
かなり遊べそう。

Colab のデモもありそうです。

- {{< exlink href="https://colab.research.google.com/github/magenta/magenta-realtime/blob/main/notebooks/Magenta_RT_Demo.ipynb" >}}

## Data Engineering と Rust

{{< exlink href="https://thenewstack.io/rust-eats-pythons-javas-lunch-in-data-engineering/" >}}

Data Engineering の領域で、Python や Java に代わって Rust が使われているという記事。

Rustがデータエンジニアリング分野で単なる「新しい選択肢」ではなく、**パフォーマンス、コスト効率、信頼性**において従来の言語を大きく上回る**ゲームチェンジャー**であることを示しています。Singular社の実例が示すように、17倍のパフォーマンス向上と70%のコスト削減という具体的な数値は、データエンジニアにとって無視できない現実となっているそうです。

記事のなかで、{{< exlink href="https://www.singular.net/" text="Singular" >}} という広告データなどの ELT tool が紹介されていてこれが Rust で作られているそう。

## Expert Generalists

{{< exlink href="https://martinfowler.com/articles/expert-generalist.html" >}}

Martin Fawler 氏が現代のソフトウェア開発者に必要な、幅広い知識と深い専門性を組み合わせた人材の重要性についてかかれています。

従来の採用では、Java、Python、AWS認定などの特定ツールで人材を評価していましたが、真に価値ある開発者の特徴は、ツールに依存しない普遍的なスキルにあると指摘。Expert Generalistは、従来の深い専門性に加えて「学習能力の専門性」を持つ人材として定義され、新しい分野を迅速に学習し、本質的なパターンを見抜く能力を備えています。


その特徴として、新しい技術への探究心を持つ「好奇心」、他の専門家との協働を重視する「協調性」、技術的好奇心を顧客価値に結び付ける「顧客志向」、プラットフォーム更新で陳腐化しないパターンや原則に焦点を当てる「基礎知識の重視」などが挙げられています。

特に大規模言語モデル（LLM）の時代においては、基礎的な理解があることで、AIからより洞察的な質問ができ、生成された提案を批判的に評価し、適切なアーキテクチャパターンに適応できる能力を持ちます。Expert Generalistは現代の複雑なソフトウェア開発環境において不可欠な人材タイプであり、組織はこの能力を第一級のスキルとして認識し、評価・育成する仕組みを構築する必要があると結論付けています。



また、この記事の中で、Kent Beck 氏の {{< exlink href="https://tidyfirst.substack.com/p/paint-drip-people" text="Paint Drip People" >}} というモデルについても言及されていました。

Kent Beck氏の「Paint Drip People」は、従来のT型スキルモデルの限界を指摘し、新しい人材像を提案する概念です。T型モデルでは一つの深い専門性と幅広い知識を想定していますが、実際の優秀な人材は複数分野で専門性を持ち、興味は時間と共に変化します。Keith Adams氏を例に、VMwareのカーネル開発からFacebookのHHVM開発、Slackのアーキテクトまで多様な分野を渡り歩く姿を紹介。新しい「Paint Drip」モデルでは、筆が横に動く好奇心による探求から、時々絵の具が蓄積してしずくが垂れる専門分野の発生、そのしずくの深さは予測不可能という比喩で、現代の技術者の非線形的なキャリア発展パターンを表現しています。


