+++
title="golang の html/template で JSON を整形する"
date="2023-08-27T21:36:45+09:00"
categories = ["engineering"]
tags = ["go", "golang", "html", "template"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

golang で html/template でHTMLを返すときに、JSON の整形をする方法についてのメモです。

## 結論

sprig というライブラリを使用すると、golang の HTML template 内で便利な関数を使えるようになります。

- {{< exlink href="https://github.com/Masterminds/sprig" >}}
- {{< exlink href="https://masterminds.github.io/sprig/" >}}

そのなかに、toPrettyJson という物があるので使用すると JSON をいい感じにフォーマットしてくれます。

```go
import (
    "html/template"
    "github.com/Masterminds/sprig/v3"
)

type Response struct {
    Body string `json:"body"`
}

func Handler(w http.Response, r *http.Request) {
    resp := Response { Body: "{\"hoge\": \"fuga\"}" }
    parameter := map[string]interface{}{"body": resp}

    temp, err := template.New("index.html").Funcs(sprig.FuncMap()).ParseFiles("index.html")
    if err != nil { /* ... */ }

    err = temp.Execute(w, parameter)
}
```

##### index.html
```html
<pre>
    <code>{{ toPrettyJson .body }}</code>
</pre>
```

## もうちょっと中身を見る

`sprig.FuncMap()` という関数から帰ってくる値を `html/template` の Funcs 関数にわたすと、template 側へ便利関数を渡すことができます。

FuncMap の中を見てみると以下のようになってます。

```go
func FuncMap() template.FuncMap {
    return HtmlFuncMap()
}
```

template.FuncMap 型を返しています。

更に追っていくと以下のような map が定義してあり、それを `template.FuncMap` 型に変換していることがわかります。

```go
var genericMap = map[string]interface{}{
    "hello": func() string { return "Hello!" },

    // ....
    "toPrettyJson":    toPrettyJson
    // ....
}
```

toPrettyJson の実態は以下のような関数で

```go
func toPrettyJson(v interface{}) string {
    output, _ := json.MarshalIndent(v, "", "  ")
    return string(output)
}
```

実態は、json.MarshalIndent をしているだけでした。

このような便利関数がいくつも登録しているので、golang で直接 HTML を生成して返すようなサーバーを書くときに役立ちそうです。

## まとめ

今回は golang で html/template 使用時に、JSON をフォーマットして表示する方法について書きました。
{{< exlink href="https://github.com/Masterminds/sprig" text="sprig">}} ライブラリは非常に便利そうです。
