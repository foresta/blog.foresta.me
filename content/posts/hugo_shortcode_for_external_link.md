+++
title = "Hugoで外部リンクを開くためのshortcodeを作った話"
thumbnail = ""
tags = ["hugo", "html"]
categories = ["engineering"]
date = "2019-02-06"
+++

Hugoでマークダウンで記事を書くときに、リンクを外部リンクで開きたかったのでそれ専用のshortcodeを作りました。

モチベーションとしてはマークダウンでも外部リンクは開きたいけど、markdownの中にaタグを記入するのはイケてないし、{{< exlink href="https://yoru9zine.hatenablog.com/entry/2017/03/17/230729<Paste>" text="こちらの記事" >}} に書かれている `rel="noopener noreferrer"` の指定などを自動で入れてくれるものを作ろうと言った感じです。


## 完成品

{{< exlink href="https://github.com/foresta/blog.foresta.me/blob/master/layouts/shortcodes/exlink.html" text="実際のコード" >}}

Hugoでshortcodeは以下の順番で探されます。

1. `/layouts/shortcodes/<SHORTCODE>.html`
2. `/themes/<THEME>/layouts/shortcodes/<SHORTCODE>.html`

参考: {{< exlink "https://gohugo.io/templates/shortcode-templates/#shortcode-template-lookup-order" >}}

そのため、今回は `/layouts/shortcodes/` 以下にexlink.htmlという名前で作りました。

#### /layouts/shortcods/exlink.html
```
{{ if .IsNamedParams }}
<a href="{{ .Get "href" }}" target="_blank" rel="noopener noreferrer">{{ if .Get "text"}}{{ .Get "text" }}{{ else }}{{ .Get "href"}}{{ end }}</a>
{{ else }}
<a href="{{ .Get 0 }}" target="_blank" rel="noopener noreferrer">{{ .Get 0 }}</a>
{{ end }}
```

### 使用例

#### 名前付き引数なし
```
① {{</* exlink "https://google.com" */>}}
```
```html
<a href="https://google.com" target="_blank" rel="noopener noreferrer">https://google.com</a>
```

#### hrefのみ指定
```
② {{</* exlink href="https://google.com" */>}}
```
```html
<a href="https://google.com" target="_blank" rel="noopener noreferrer">https://google.com</a>
```

#### hrefとtext指定
```
② {{</* exlink href="https://google.com" text="Google" */>}}
```
```html
<a href="https://google.com" target="_blank" rel="noopener noreferrer">Google</a>
```

### 簡単に解説

まず、 `{{ if .IsNamedParams }}` で名前つきの引数があるかどうかを確認しています。今回の例でいうと、`href`や`text`がそれに当たります。

名前付きの引数がある場合は、`.Get` メソッドでその値を取得します。
今回は `text`が入力されていない場合は、そのままhrefに設定されたURLをaタグのテキストとして表示するようにしています。
コードでいうと以下の部分です。
```
<a href="{{ .Get "href" }}" target="_blank" rel="noopener noreferrer">{{ if .Get "text"}}{{ .Get "text" }}{{ else }}{{ .Get "href"}}{{ end }}</a>
```

そして名前つきの引数がない場合、つまり`{{</* exlink "https://google.com" */>}}` のように直接文字列でURLが渡されている場合は、その最初の要素を`{{ .Get 0 }}` で取得して、hrefとaタグのテキストとして表示しています。

```
<a href="https://google.com" target="_blank" rel="noopener noreferrer">https://google.com</a>
```

## まとめ

意外と簡単にshortcodeつくれたので便利でした。どんどん作ってより快適にブログをかけるようにしていきたいですね。


余談ですが、ブログのなかでショートコードをエスケープするやり方がわからず苦戦していましたが、以下のようにかくとエスケープできるようです。

```
{{</*/* コード */*/>}}
```
