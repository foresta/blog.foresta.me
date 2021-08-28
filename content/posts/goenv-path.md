+++
title="goenv 2系で go install したディレクトリにパスを通す"
date="2021-08-28T19:43:34+09:00"
categories = ["engineering"]
tags = ["go", "goenv"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は goenv 2 系をインストールした際に、 1 系とパスが変わっていてので go install で インストールした場所へのパスを通す必要があって対応してのでメモです。

## goenv 1 系と、2 系の違い

1 系だと、GOPATH がホームディレクトリ直下の、`~/go` の下にありました。

```
- $HOME/go/bin
- $HOME/go/pkg
```

2 系だと、バージョンごとに bin や pkg ディレクトリが分かれるようになっていました。

```
- $HOME/go/1.17.0/bin
- $HOME/go/1.17.0/pkg
```

1.17.0 でインストールした (go get や、go install した) ものは、上記のようなディレクトリになります。

なのでそれらを CLI 上から使用するためには、バージョンごとに異なるディレクトリの、`/bin` に対してパスを通す必要があります。

## bashrc にパスを通すように記述する

以下のようなスクリプトを bashrc に書きました。

```bash
# goenv
if existsCmd goenv; then 
    eval "$(goenv init -)"
    versions=($(goenv versions --bare));
    for v in "${versions[@]}"; do
        GO_VERSION_PATH="$HOME/go/$v/bin"
        export PATH="$GO_VERSION_PATH:$PATH"
    done
fi
```

やっていることとしては、まず `goenv init` をしたの地に、`goenv versions` をしてインストールされているバージョンだけ、ループして `/bin` ディレクトリにパスを通してます。

通常の `goenv versions` だと以下のように、追加した情報も出るので `--bare` をつけて実行しています。

```bash
$ goenv versions 
  1.16.7
* 1.17.0 (set by $HOME/.goenv/version)
```

`--bare` をつけると以下のような感じです。

```bash
$ goenv versions --bare
1.16.7
1.17.0
```

ちなみに、`existsCmd` は以下のようなスクリプトで、コマンドの存在チェックをしています。

```bash
# command exists check
existsCmd () {
    type -a $1 > /dev/null 2>&1
}
```

これで、コンソールにログインしたタイミングでインストール済みの go のバージョンの `/bin` ディレクトリに対してパスを通すことができました。

## まとめ

goenv 2 系で、bin ディレクトリのパスを通す方法に対してまとめました。

久しぶりに go の環境構築して、goenv 周りも構築しましたがすっと構築できて楽でした。
goenv 2 使うときは若干違うところがあって若干つまづいたので、この記事が誰かのお役に立てれば幸いです。

