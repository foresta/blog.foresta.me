+++
title="Git で空コミットを作成する"
date="2024-09-16T12:05:29+09:00"
categories = ["engineering"]
tags = ["git", "github", "dagster"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Git で空コミットを作成する方法について調べたのでメモします。

## 空コミットを作る方法

Git ではファイル差分がなければ基本的には commit を作成できませんが、 `--allow-empty` オプションを追加すると差分がなくてもコミットを作成することができます。

```bash
$ git commit --allow-empty -m "Commit Message"
```


## 空コミットの使い所

なぜ空コミットをしたかったのかというと、Dagster の Branch Deployment 機能を用いて開発環境を作成したかったためです。

現在、Dagster という Data Pipeline の Orchestration ツールを使用しています。Dagster には Branch Deployment という機能があるのですが、実際のワークフローに加え特定の GitHub のブランチをデプロイして、ワークフローを動かせる仕組みとなっています。

私の環境では、Snowflake 上で本番と開発のスキーマを分けていて、Dagster の Branch Deployment 機能を用いて、開発用ブランチのワークフローを Snowflake の開発環境に向けて実行するということを行っています。

Dagster の Branch Deployment 機能は、GitHub の Pull Request を見てデプロイが実行されます。

そうなると開発フローとしては、

- 実装を行う
- 開発用ブランチに修正を merge する
- Dagster の Branch Deployment 機能でデプロイされる
- 開発用のワークフローを回して、Snowflake の開発用スキーマ上に反映


となります。
このときに、本番環境、つまり main ブランチの内容を定期的に、開発用ブランチにも反映したいのですが、main を開発用ブランチにマージしたタイミングで差分がなくなってしまうと Pull Request が自動で閉じられてしまいます。

Dagster の Branch Deployment を使用するには Pull Request が必要なため、そうなると毎回作り直さなければなりません。
この手間を解消する方法として、空コミットを作成しました。

前置きが長くなりました。

GitHub の Pull Request では、ファイルの差分がなくてもコミットの差分があればそれは差分として認識されます。
つまり、空のコミットを作っておけば差分があると認識され、Pull Request が閉じられることがなくなります。


## まとめ

今回は、Git 上で空コミットを作る方法についてまとめました。

Pull Request 閉じたくないときなどに使える場面はいくつかありそうなうなので覚えておくと良さそうです。
