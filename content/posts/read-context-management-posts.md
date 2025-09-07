+++
title="Context Management について記事の紹介"
date="2025-09-07T23:24:23+09:00"
categories = ["engineering"]
tags = ["llm", "context_management"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Context Management について以下の二つの記事が紹介されていたので内容を紹介します。


## Context Management

- {{< exlink href="https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html" text="How Long Contexts Fail" >}} 


How Long Contexts Fail では、コンテキストがいくら長くなっても良い応答につながるとは限らないという話です。

長文コンテキストに潜む失敗パターン（Context Fails）が4つ紹介されています。

Context Poisoning（文脈汚染）
: 幻覚や誤情報が文脈に入り込み、繰り返し参照されることで応答全体が歪む。例として、Geminiが「ポケモンゲーム」の状態を誤認し続けるケースが紹介されている。 

Context Distraction（文脈による気 distracted）
: 文脈が過度に長くなると、モデルが学習内容よりも蓄積された履歴に偏り、新規の推論力が低下。Geminiでは約100kトークンを超えると反復行動が増加した。Databricksの研究では、Llama 3.1 405Bでも約32kから精度低下が見られた。 

Context Confusion（文脈の混乱）
: 不要な情報やツール説明を大量に含めると、モデルが最適な応答を選べなくなる。ツールが多すぎると混乱し、たとえばGeoEngineベンチマークで46ツール提示時に失敗、19ツールに絞ると成功した例も。 

Context Clash（文脈の衝突）
: 新旧の情報やツール間で矛盾が生じると、LLMの応答品質が著しく低下。マルチターン形式で情報が分割される際に、早期の誤った応答が文脈に残り、最終的な出力にも悪影響を与えることが報告されている（精度が−39 %ほど低下） 


- {{< exlink href="https://www.dbreunig.com/2025/06/26/how-to-fix-your-context.html" text="How to Fix Your Context" >}}

Hot to Fix Your Context の方では、上記の問題を解決するための方法が紹介されています。
コンテキスト管理の６方式としていかが紹介されています。


RAG（Retrieval-Augmented Generation）
: 必要に応じて関連情報のみを文脈に追加し、有効な応答を導出するスタイル。文脈を「雑多な引き出し」にしないための代表的アプローチ。 

Tool Loadout（ツールの絞り込み）
: タスクに応じて必要最小限のツール定義だけを文脈に含める。研究では、30以上のツールを含めると精度が低下し、19以下に絞ると改善するケースが確認されている。動的選定によって性能が44 %改善、速度・消費電力も大幅削減（18 〜 77 %）できた例も。 

Context Quarantine（文脈の隔離）
: 文脈を分離し、サブスレッド（subagent）ごとに必要な情報のみを保持・処理する方式。Anthropicのマルチエージェント設計では、情報の分離と並列処理により効率が向上。 

Context Pruning（文脈の剪定）
: 文脈に蓄積された不要情報を削除。Provenceというツールを使えば高速かつ正確に剪定可能。構造化データで管理することで、重要な指示や目標を保持しつつ無駄を整理できる。 

Context Summarization（文脈の要約）
: 長文文脈を短くまとめることで、モデルが新たな推論に集中しやすくする。context distractionに対処するための古典的手法で、高効率化にもつながる。 

Context Offloading（文脈の外部保存）
: 文脈外にメモや思考ログ（scratchpad）を置き、必要に応じて参照するスタイル。Anthropicでは「think」ツールとして実装し、特定タスクで最大54 %性能向上を確認。


## さいごに

これらの記事を読み、Context をただ詰め込めば良いというわけではないということを認識しました。データエンジニアリング Gabage in Garbage out がまさに当てはまるなと感じます。

Context Management という名前の通り、適切に意識して管理することが重要だなと感じました。



