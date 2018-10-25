+++
title = "Elmに入門してみた その4"
thumbnail = ""
tags = ["elm"]
categories = ["engineering"]
date = "2018-09-30"

draft = true

+++

Elmに入門してみたのでそのメモです。
今回は、Elmとその外側とのやりとりについてまとめます。

[その1はこちら](/posts/introduction_to_elm) \
[その2はこちら](/posts/introduction_to_elm_2) \
[その3はこちら](/posts/introduction_to_elm_3) 

## Elmと副作用について

Elmは副作用のない関数のみでプログラムを構築することにより、Runntime Errorをできるだけ減らしていくような思想に基づいています。

そのため副作用が起きる可能性がある機能(乱数生成、時刻処理、HTTP通信など)を利用する場合は、Elmとの間に明確に境界を設けることでElm内を純粋な関数のみで保てるようなアーキテクチャで実装されています。

## Cmd/Sub

このアーキテクチャはCommand と Subscriptions という二つの仕組みにより成り立っています。



ここに超絶わかりやすい図を入れる。(もしくは公式から参照)


```
                 [Model]
                    ↓
view -> [Msg] -> update -> [Model] -> view 
                    ↓
                  [Cmd] 
```


## 参考にしたサイト

* https://elm-lang.org/docs
* https://guide.elm-lang.org/

