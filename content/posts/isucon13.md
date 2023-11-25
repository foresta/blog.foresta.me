+++
title="ISUCON 13 に参加してきました"
date="2023-11-26T00:07:50+09:00"
categories = ["engineering"]
tags = ["isucon"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

{{< exlink href="" text="ISUCON 13" >}} に出場してきたので参加レポートです。

今回の問題は、ISUPipe という動画配信サイトが題材でした。

ちなみに ↓ が紹介動画なのですがむちゃくちゃクオリティの高いので、ぜひ見てください。

{{< youtube OOyInZbM85k >}}

毎年のことですが、控えめに言ってとても楽しかったです。

## 最終スコア

追試がどうだったかまだ確認できていないですが最終のスコアは 28581 点でした。

{{< figure src="/images/posts/isucon13/last-score.png" >}}

fail していないことを願います。

## やったこととか

やったことをなんとなく時系列で書いていきます。

### 事前準備

ISUCON には何回か出場しているので秘伝のタレ化した Makefile や、スクリプト系が入った GitHub リポジトリの準備をしました。

今回は Slack のハドルを繋ぎっぱなしにして話しながらオンラインでやりました。

ハドルの音質なのかネットの問題なのかわからないですが、若干聞こえづらかったりして、おわったあと次はオフラインでやりたいね的な話もしたりしました。

### 開始直後

開始直後の初動としては以下のようなことをやりました。

- サーバーへの接続確認
- 初回ベンチ確認
- 設定ファイル、ソースコードを GitHub に Push
- hosts の設定など
- アプリケーションの動作確認
- アプリケーションの確認

このあたりは ISUCON に何回かでてるので割りといつも通りな感じです。

### プロファイリング

初動がなんとなく落ち着いたあたりで、次はプロファイリング系の設定をしました。

今回 NewRelic 使ってみようということで、いれてみたり Kataribe, pt-query-digest, pprof などのツールをつかってプロファイルを取ったりです。

上記と同時に今回は CDN 周りが結構肝になりそうだなということでそちらの設定周りを見たりもしました。

### 修正内容

まずは、DB に index を貼っていく作業をしました。

DB の index で大体スコアが、6000 ~ 7000 位になっていました。

その次は N + 1 の解消行っていきました

livestream statistics や、user statistics や、fillLivestreamResponse などです。

ちなみに、livestream statistics や、user statistics 系の ranking のクエリが N + 1 で重かったのでクエリ一発で取れるようにしました。

```sql
select ranking from (
    select
        livestream_id,
        score,
        RANK() OVER (ORDER BY score DESC, livestream_id DESC) as ranking
    from (
    select 
        ls.id as livestream_id,
        count(r.id) + ifnull(sum(lc.tip), 0) as score
    from livestreams ls
    left join reactions r
        on ls.id = r.livestream_id
    left join livecomments lc
        on ls.id = lc.livestream_id
    group by ls.id
    order by score desc
    ) as a
) as b
where livestream_id = ?
```

↑ のような感じです。user の方も同じような感じでいけました。


このクエリの解消と同時並行で、複数台対応も進めていました。

今回は全部で 3 台あったのですが、DNS と APP と DB をどのように分割するかという観点でした。
まず初めに、APP + DNS と DB を分けました。

```
1: DNS + APP
2: DB
3: --
```

つぎに、subdomain のリクエストを 3 台目に向けることをしました。

```
1: DNS + APP
2: DB
3: APP (subdomain)
```

このタイミングで最初、ベンチマークが fail していて、原因を探っていたのですが DNS のサーバーと、ユーザー登録の API の両方で isudns のデータベースを参照する必要があったので、PowerDNS の conf で 2台目の MySQL を見るようにしました。

このあたりでスコアが、15000 点位です。

このあたりまで対応終えたところで結構時間が経ってしまっていて残り時間が少なかったです。

このタイミングでまだ、N+1 が若干のこっていたのでそのあたりの解消と DNS のサブドメインの分割の仕方を調整しました。

N+1 の方は、comment の POST のところで、ngword の対応するところが N+1 だったのでそこを直したりしました。

また、サブドメインの方は 1 台目の 3 台目の分割方法を変えて、`pipe` だけ 1台目で動かしてその他は 3 台目に向けるみたいな分割をしました。
このあたりの対応が終わり、最終スコアあたりの 28000 点あたりがでました。

残り時間も少なかったので、ログなどを消したり最後の調整をして終了の時間になりました。

## 反省点など

対応自体は順調にできていたかと思いましたが、単純に時間が足りなかったです。

N+1も全て解消できなかったですし、DNS の水責め問題にも手が回りませんでした。
このあたりは普段の精進がたりなかったなと反省です。

特に優勝したチームのインタービューで DNS サーバー 1 時間くらいで書き上げたと聞いて、これ今の自分には無理だなぁと率直に思ってしまいました。

## まとめ

今回は ISUCON 13 に参加してやった内容などをまとめました。

毎回自分の無力さを感じるイベントですが、毎回楽しい問題と運営が本当にありがたいなと思います。

一緒に戦ってくれたお二方、運営された方、参加された方、その他関わられた方ありがとうございました。
今年もとても楽しかったです。
