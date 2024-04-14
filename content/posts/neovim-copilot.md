+++
title="Neovim で Copilot を使用する"
date="2024-04-14T21:58:17+09:00"
categories = ["engineering"]
tags = ["neovim", "vim", "copilot"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

GitHub の Copilot とても便利なので、neovim でも利用してみました。
とても簡単に設定できたのでおすすめです。

## Copilot について

- {{< exlink href="https://docs.github.com/ja/copilot" text="GitHub Copilot">}} はAI によるコーディングアシスタントで、かなり精度の良いコード補完が特徴です。

個人向けのプランも有り、１ヶ月あたり 10 ドル (2024年4月14日時点で、1500円ほど) で導入することができます。

詳細は以下を参照してみてください
- {{< exlink href="https://docs.github.com/ja/copilot/copilot-individual/about-github-copilot-individual" >}}


## Setup

それでは Copilot の neovim への導入ですが公式が、copilot.vim というプラグインを用意してくれているのでそれを利用します。

- {{< exlink href="https://github.com/github/copilot.vim" >}}

自分は Package Manager に Dein を使用していて、init.vim に以下のように書いています。

```vim
let s:toml_file = '~/.config/nvim/dein.toml'
let s:toml_lazy_file = '~/.config/nvim/dein_lazy.toml'
if dein#load_state(s:dein_dir)
    call dein#begin(s:dein_dir)

    call dein#load_toml(s:toml_file, {'lazy': 0})
    call dein#load_toml(s:toml_lazy_file, {'lazy': 1})

    call dein#end()
    call dein#save_state()
endif
```

そのため、インストール自体は、dein.toml に書くだけです。

```toml
[[plugins]]
repo = 'github/copilot.vim'
```

neovim を再起動して、インストールされたことが確認できたら `:Copilot setup` コマンドを実行すると使用できるようになります。

とても簡単でした。

## まとめ

今回は、GitHub Copilot を neovim に導入して使用してみました。
コード以外でもこういったブログを書くときもいい感じに補完してくれて便利さを感じます。

導入してみて、vim ユーザー向けにも Plugin などを用意してくれていて手厚くて助かるなーと思いました。
セットアップ簡単なので vim ユーザーにも Copilot はよさそうです。
