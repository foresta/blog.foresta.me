+++
date = "2017-04-01T10:34:48+09:00"
title = "ElixirConf2017の参加メモ"
draft = true
categories = ["engineering"]
tags = ["elixir", "勉強会"]

thumbnail = "memo/elixir_conf_report/thumbnail.png"
+++

[ElixirConf](http://www.elixirconf.jp/)の参加中にとったメモです。

# セッション

## Keynote Jose Valim

* Concurrency
* Functional Programming
* Explicit instead of implicit state
* Trasfomation instead of mutation

sevel Languages in Seven Weeks

Erlang 

* Concurrency
* Actor

Productivity
    Tooling
Extensibility
    Polymorphism & meta-pro
Compatibility

Meta-programming
flexible Macros

how to combine
    Liip-macros
    Natual syntax

Macros are lexical
compile-time only

elements
data (types)
Modules
Processes

mutable
state      behaviour
dictionary.store("key","value")

Time             Time    Time

Data -> state
Modules -> Behaviour
Processes -> Time

in elixir
Map.put(map, "key", "value")

Behaviour(Map.put/3)

Processess
1プロセル1データ
run code is behaviour sequentially
introduce concurrency

Time = changes
change -> message-passing

いつプロセスを作るか
状態管理したい時
並列化
例外処理のhandling and isolating
isolting failures handling
for distributed communication

Active Resarch Project

GenStage & Flow
UTF-8 Atoms (マルチバイトアトム)
GenHTTP(low level)
Type System (for elixir) static type systems
    dyalizer
        more restricted than daylizer
Data Streams & Property testing

## Keynote voluntas

## Phoenix で作るスケーラブルなリアルタイムゲームサーバー
モバイルゲームサーバーの特徴
イベントによってリクエストが増える
データ更新が至る所で発生
専用クライアントがいる
    データ構造を返すだけ

リアルタイム通信
クライアント一台がhostになる
サーバーがロジックを理解するhostになる

サーバードリブン

elixir & phoenix

突発的なリクエストへの対応

想定以上のリクエストに対して落ちずにレスポンスを返し切って欲しい
erlangの軽量プロセスはこれが強い

双方向な通信
PhoenixのChannel

WebSocket

モバイルネットワーク
クライアントの切断の取り扱い
ネットワークなのかタスクキルなのか

cowboyのシンプルな通信のハンドリング

ソケット接続したままで

ErlangVMのhot code deploy便利に見える

サーバ構成
初期
クライアントー＞APIサーバがwebsocketのエンドポイント返すー＞フロントサーバー
    Pubsub(RabbitMQ)

Channelはトピック名ごとに

APIサーバーフロー
api-generator
定義ファイルー＞elixirー＞elixir
                    　ー＞c#
socketのフロー
cowboy_websocket
EctoがDB Connection pool管理するDB側に負荷がいかない！

hot code loading

Logicを分離（rpc）
erlang rpc
gen_rpc Erlan/OTP >= 19.1

OTPが新しい解決策

## Elixir から始める関数型言語

http://tuvistavie.com/slides/elixir-fp-intro/#/

関数型
データ変換
再帰関数

メリット
シンプル
コンテキストの理解が少なくて良い
並列化しやすい

大きなデータでmutationする場合は向いてない
行列演算とかは向いてない？

パターンマッチ
    マッチするかチェック。
    変数の束縛

    Match Context

Recursion

スタック



高階関数

これのおかげであんまり再帰書かない
reduceとか、fold

map
filter
reduce

Immutableなデータ構造
    時間軸のモデリング


Agentがstate持つ
    GenServerのwrap

spawn
send
receive
monitor
link

stateはspawnしたプロセルのGenServerのloop処理を再帰で呼ぶ時の引数

```
def loop(some_int) do
    receive do
        `{ :add, value } ->
        loop(some_int + value)
    end
end
```


## Rediscovery of OTP

リアルタイム性

同時接続数

Elixir

同時接続数
並行性
メンテナンス性
耐障害

SLA
Erlang 99.9999999%

処理時間90ms
scale out可能にする
shared dataを安全かつ効率的に

erlangとdynamoDB相性が良い

トラックナンバー1

Elixir

OTPが大事プロセス同士のリンクが大事
OTPのプロセス設計

## Elixir はリアルタイムWeb に強いというのは本当か？

https://speakerdeck.com/mururu/elixirkariarutaimuwebniqiang-i-toiufalsehaben-dang-ka

リアルタイムウェブ
Node.js Socket.IO

BEAM ErlangVM

軽量プロセス
N:Mスレッドモデル
グリーンスレッド
OSのプロセスに割りあてる

minimum 309word
message passing
shared nothing

プロセス単位でGC
    停止時間が短い
プリエンティブなスケジューリング
VMがプロセスがずっとOSのプロセスに張り付かない

プロセスがOSのプロセスを占有しない。

TCPコネクションの一つ一つにプロセスを割りあてる。
    →1プロセスあたりが軽量なので、大量のコネクションを保持できる

Phoenix Channel
plugable なトランスポート
PubSubバックエンド

Phoenix.Socket
    クライアントからの受け口
    
Phoenix.Channel
    トピックごとのPubSub

message passingの部分がボトルネックになりやすい



## Rubyist |> (^o^) |> Alchemist 〜Elixirの採用からサービス稼動までの記録〜

https://www.slideshare.net/ohr486/elixirconfjapan2017sessionohr486

http://otiai10.hatenablog.com/entry/2016/02/03/154953

関数型言語
すごいH本が良い？

テストフレームワーク
meck
mock 

バージョン管理
asdf

Erlang/OTP

https://www.amazon.co.jp/dp/4781911609/ref=cm_sw_r_cp_ep_dp_Qo13ybJRCEGNG

## ニコニコを支えるErlang/Elixir 〜 大規模運用して初めて見えたアレやコレ

コンテンツ配信システム
dwango media cluster

レシピ
データフローを抽象化したグラフ構造

DMC:レシピを実行する
登録、変更、削除

レシピ定義からいろいろと全自動生成

タスクグラフ

グランドデザイン

# LT

 「Why did we decide to start using Elixir?」 by ma2ge
    手段・手数を増やす



 「Surge」 - Amazon DynamoDB for Elixir」 by hirocaster
 「Elixir client from OpenAPI(Swagger) definition」 by niku_name
 「初心者のElixir(仮) 」 by ovrmrv

GenStage/Flow Joseさんの動画見る
concurrency


 「社内ツールをElixirで作った話」 by isyumi_net
    MVCの２階建

 「ElixirでHubotを倒す」 by ne_sachirou
    http://shotat.hateblo.jp/entry/2016/10/16/005608

 「APIサーバーとしてのCowboy」 by hayabusa333
    

OpenAPI


 https://rabbit-shocker.org/ja/

 「 LT特別枠(15分): Erlang and Elixir Factory SF Bay 2017 参加報告」 by jj1bdx

http://rabbit-shocker.org/ja/


#keynote voluntas

Erlang/OTP

俺の考えた最強のプロトコル
ビルドツール rebar3
supervisorは悪
プロセスリーク
プロセスキューがボトルネック

1プロセスで10msg/sいかない
https://gist.github.com/voluntas/81ab2fe15372c9c67f3e0b12b3f534fa


