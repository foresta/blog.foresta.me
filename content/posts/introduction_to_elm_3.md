+++
title = "Elmに入門してみた その3"
thumbnail = ""
tags = ["elm"]
categories = ["engineering"]
date = "2018-10-14"

+++

Elmに入門してみたのでそのメモです。\
今回は、The Elm Architectureについて簡単にまとめます。

[その1はこちら](/posts/introduction_to_elm) \
[その2はこちら](/posts/introduction_to_elm_2)

## The Elm Architecture

Elmは言語が特定のアーキテクチャ推奨しているという珍しい一面があります。

そのアーキテクチャですが大きく分けて以下の三つの部品からなります.

* Model -- アプリケーションの状態を管理する
* Update -- 状態を更新するためのロジック
* View -- HTMLで状態を表示するためのロジック

ソースコードをみるとわかりやすいと思いますので、今回はgithubで公開されている簡単なサンプルを取り上げて見ていきます。

The Elm Architectureについてのサンプル実装はこちらです。\
https://github.com/evancz/elm-architecture-tutorial/

このサンプルの中からボタンをクリックのものを今回は見ていきます。\
+ボタンと-ボタンが表示され、それぞれ押されるたびにModelの数値がincrement/decrementされるというものです。\

実際の動きはこんな感じ。

{{< figure src="/images/posts/introduction_to_elm_3/counter.gif" >}}


短いのでソースコード全文を載せます。

```elm
import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)


main =
  Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias Model = Int

init : Model
init =
  0


-- UPDATE

type Msg = Increment | Decrement

update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1


-- VIEW

view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (String.fromInt model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]
```

The Elm Architectureでは、アプリケーションを大きく分けてModel, Update, Viewというセクションに分けていきます。

これらMain, Model, Update, Viewに分けてそれぞれ見ていきます。

### Main

Mainの記述は以下のようになっています。

```elm
main =
  Browser.sandbox { init = init, update = update, view = view }
```

Browser.sandboxは、elm/browserパッケージに定義されているのでドキュメントを見ていきます。\
(https://package.elm-lang.org/packages/elm/browser/latest/Browser#sandbox)

```elm
sandbox :
    { init : model
    , view : model -> Html msg
    , update : msg -> model -> model
    }
    -> Program () model msg
```

sandboxは外界とは通信できないシンプルなプログラムを作成します。
Browser.sandboxはRecordを受け取り、Programを返します。
Recordは以下のような構造です。

```elm
{
    init : model
    view : model -> Html msg
    update : msg -> model -> model
}
```

initはModelを渡し、\
viewはModelを引数にHtml msgを返す関数を渡し、\
updateには、msgとmodelを引数に新しいmodelを返す関数を渡します。

Browser.sandboxで返されるProgramですが、

定義は以下のようになっています。 \
(https://package.elm-lang.org/packages/elm/core/latest/Platform#Program)

```elm
type Program flags model msg
```


### Model

Modelについての記述は以下のようになっています。

```elm
type alias Model = Int

init : Model
init =
  0
```

このサンプルでは、シンプルな数値をModelとして扱うため、`type alias`を使用しています。\
initはModelの初期状態を返す関数です。
`Browser.sandbox` に引数として渡されます。


### Update

Updateについての記述は以下のようになっています。

```elm
-- UPDATE

type Msg = Increment | Decrement

update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1
```

まずはじめにMsgを定義します。このMsgイベントが発火されたタイミングでモデルをどのように更新するかがUpdateの責務です。

updateはMsgと古いModelを受け取り、新しい更新済みのModelを返します。

今回の例だと、Incrementメッセージが来た時はModelの値に1を足し、Decrementメッセージが来た時は1を引いています。

### View

Viewについての記述は以下のようになっています。

```elm
-- VIEW

view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (String.fromInt model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]
```

viewはModelを受け取り、Html Msgを返します。\
上記の例のようにHTMLのマークアップをElmのシンタックスでかけるのもElmの良いところだと思っていて、Elmで閉じているため、Elm言語の恩恵を受けることができます。(Runntime Errorの少ない事や、副作用が無い事)

このHTMLでは、buttonを二つ用意していて、onClick関数でIncrement、Decrementメッセージを送るように定義しています。\
onClick関数自体は、以下のようにHtml.Eventsパッケージで提供されています。

```elm
import Html.Events exposing (onClick)
```

ドキュメントはこちら \
https://package.elm-lang.org/packages/elm/html/latest/Html-Events

---


このように、Model, Update, Viewをセクションに分けて行く方法をElmでは推奨しています。
MVCなどをやっていると、Model, Update, Viewを別ファイルに分けたくなるかもしれませんが、Elmでは推奨されていません。\
Elmでファイルを分割するタイミングについては、ある特定のCustom Typeについての関数が増えて来たタイミングでそれらをパッケージ化すると良いと書かれています。\
詳しい話はこちらを参照ください。(https://guide.elm-lang.org/webapps/structure.html)

## まとめ

The Elm Architectureの概要を把握するために、簡単なアプリのソースコードについて簡単に見ました。

この例はサンプルレベルなのですが、なんとなくThe Elm Architectureの概念を知ることはできたのではないでしょうか？

実用的なアプリケーションを作るとなると、HTTP通信したり、Elmの外の世界とやりとりする必要が出て来るかと思います。\
もちろんElmにもそのような仕組みは用意されています。

その辺りについては、また次回とかに書いていこうと思います。\
(一緒にまとめようと思ったが体力が尽きた)


最後に、Elm楽しいので引き続きまったり触っていこうと思いますー。


## 参考にしたサイト

* https://elm-lang.org/docs
* https://guide.elm-lang.org/

