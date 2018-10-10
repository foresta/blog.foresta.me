+++
title = "Elmに入門してみた その3"
thumbnail = ""
tags = ["elm"]
categories = ["engineering"]
date = "2018-09-30"

draft = true

+++

Elmに入門してみたのでそのメモです。\
今回は、Elm ArchitectureとElmと外界とのやりとりについてまとめます。

[その1はこちら](/posts/introduction_to_elm) \
[その2はこちら](/posts/introdu tion_to_elm_2)

## The Elm Architecture

Elmは言語が特定のアーキテクチャ推奨しているという珍しい一面があります。

そのアーキテクチャですが大きく分けて以下の三つの部品からなります.

* Model -- アプリケーションの状態を管理する
* Update -- 状態を更新するためのロジック
* View -- HTMLで状態を表示するためのロジック

Elm Architectureについてのサンプル実装はこちらにあります。\
https://github.com/evancz/elm-architecture-tutorial/

このサンプルからボタンをクリックのものを見ていきます。\
短いのでいかにソースコード全文を載せます。

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

Main, Model, Update, Viewに分けてそれぞれ見ていきます。

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
Recordは以下のような構造です.

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

定義は以下のようになっています. \
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

### Update

### View

このように、Model, Update, Viewをセクションに分けて行く方法をElmでは推奨しています。
MVCなどをやっていると、Model, Update, Viewを別ファイルに分けたくなるかもしれませんが、Elmでは推奨されていません。
Elmでファイルを分割するタイミングについては、ある特定のCustom Typeについての関数が増えて来たタイミングでそれらをパッケージ化すると良いと書かれています。\
詳しい話はこちらを参照ください。(https://guide.elm-lang.org/webapps/structure.html)

## Cmd/Sub


## Flags/Port



