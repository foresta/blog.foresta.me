+++
title="O'Reilly Radar 2025-08"
date="2025-09-07T23:02:59+09:00"
categories = ["engineering"]
tags = ["oreilly", "radar"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

{{< exlink href="https://www.oreilly.com/radar/radar-trends-to-watch-august-2025/" text="Radar Trends to Watch: August 2025">}} の中で気になったトピックを紹介します。


## Qwen3-Coder

> Qwen3-Coder は 480B のパラメータを持つエキスパート混合モデルで、35B のアクティブパラメータを持つ。Qwenはまた、Gemini CLIから派生したエージェントコーディングツールであるQwen Codeもリリースした。

とのことです。

Qwen3-Coder 自体は、 Alibaba の Qwen チームが開発した、コーディング特化の OSS 型 LLM らしいです。

実際に Qwen3-Coder 自体はつかったことがないのですが、以下で詳細について紹介されていました。

- {{< exlink href="https://qwenlm.github.io/blog/qwen3-coder/" >}}


## Context Management

Context Management について以下の二つの記事が紹介されていました。


- {{< exlink href="https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html" text="How Long Contexts Fail" >}} 
- {{< exlink href="https://www.dbreunig.com/2025/06/26/how-to-fix-your-context.html" text="How to Fix Your Context" >}}

内容興味深かったので別でまとめます。

## Playwright MCP

LLM からブラウザをみて操作するのを自動化するための MCP サーバーです。

- {{< exlink href="https://github.com/microsoft/playwright-mcp" >}}


## A2A プロトコル

Google が Agent2Agent (A2A) プロトコルを Linux Foundation に寄贈したという話です。

- {{< exlink href="https://thenewstack.io/google-donates-the-agent2agent-protocol-to-the-linux-foundation/" text="Google Donates the Agent2Agent Protocol to the Linux Foundation">}}
- {{< exlink href="https://github.com/a2aproject/A2A" >}}

## LLM と抽象化

マーチンファウラー氏が LLM と抽象化について書いています。

- {{< exlink href="https://martinfowler.com/articles/2025-nature-abstraction.html" text="LLM bring new nature of abstraction">}}

この記事によると、LLM がもたらすのは単なる高い抽象化ではなく「非決定的な抽象化」という点が異なると記されています。
従来のプログラミングでは、同じコード（関数）を何度実行しても、同じバグや出力が再現されます。それに対して、LLM によるプログラミング—プロンプトベースの開発—では、同じ命令を与えても毎回異なる出力が得られる可能性があります。これが「非決定性」です。
Fowler 氏はこうした非決定的振る舞いを「抽象化の水平方向への進化」として強調しています。

## まとめ

O'Reilly Radar 2025-08 で気になったトピックを紹介しました。
この記事時点ではすでに 9 月になってしまっていますが、8 月の内容を振り返りました。
