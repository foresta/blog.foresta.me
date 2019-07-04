+++
title = "Frontend開発でもneovimを使いたかったので環境構築をしてみた"
thumbnail = ""
tags = ["vim", "nvim", "lsp", "html", "css", "stylus", "nuxt", "vue.js"]
categories = ["engineering"]
date = "2019-07-04"
+++

こんにちは、[@kz_morita](https://twitter.com/kz_morita) です。

最近は、Nuxt.js でもっぱらフロントエンドエンジニアのようなことをしています。

Frontend を開発するにあたり、こちらも neovim で開発したいなぁと思ったため、いろいろと環境構築をしてみました。

## 前提と要件

開発に用いるのは以下のような技術です。

- Nuxt.js
- Vue.js
- Stylus
- Pug
- Node.js (Express)

要件としては、上記で、シンタックスハイライトされる、ある程度の保管が聞く、保存時に Lint を走らせることができればとりあえずは OK とします。

## 成果物

先に成果物を。

{{< figure src="/images/posts/nvim_for_frontend/neovim-vue.gif" >}}
補完や、シンタックスハイライト、保存時に Formatter もかかるようにしているので、満足しています。

## やったこと

### Neovim と LSP の環境を準備

こちらの記事で解説しているので参考にしてみてください。
本記事での説明は割愛させていただきます。

[neovim と LSP で Rust 開発環境をつくったら最高だった話](/posts/nvim_and_lsp_for_rust)

### dein で plugin をインストール

今回入れた plugin は以下の通りです。

- {{< exlink href="https://github.com/posva/vim-vue" >}}
- {{< exlink href="https://github.com/prettier/vim-prettier" >}}
- {{< exlink href="https://github.com/leafgarland/typescript-vim" >}}
- {{< exlink href="https://github.com/vim-syntastic/syntastic" >}}
- {{< exlink href="https://github.com/mtscout6/syntastic-local-eslint.vim" >}}
- {{< exlink href="https://github.com/digitaltoad/vim-pug" >}}
- {{< exlink href="https://github.com/dNitro/vim-pug-complete" >}}

dein.toml は以下のような感じになりました。

```toml
[[plugins]]
repo = 'posva/vim-vue'
hook_add = '''
source ~/.config/nvim/plugins/vim-vue.rc.vim
'''

[[plugins]]
repo = 'prettier/vim-prettier'
build = 'npm install'
on_ft = ['javascript', 'typescript', 'vue', 'css', 'scss', 'json', 'markdown']
hook_add = '''
source ~/.config/nvim/plugins/vim-prettier.rc.vim
'''


[[plugins]]
repo = 'leafgarland/typescript-vim'


[[plugins]]
repo = 'vim-syntastic/syntastic'
hook_add = '''
source ~/.config/nvim/plugins/syntastic.rc.vim
'''

[[plugins]]
repo = 'mtscout6/syntastic-local-eslint.vim'
hook_add = '''
source ~/.config/nvim/plugins/syntastic-local-eslint.rc.vim
'''

[[plugins]]
repo = 'digitaltoad/vim-pug'
on_ft = ['pug', 'vue']

[[plugins]]
repo = 'dNitro/vim-pug-complete'
hook_add = '''
source ~/.config/nvim/plugins/vim-pug-complete.rc.vim
'''

```

### LanguageServer のインストール

以下のコマンドで、vue 用の languege-server をインストールします。

```bash
$ npm install -g vue-language-server
```

### LanguageClient-neovim.rc.vim の設定

vue 用の LSP サーバーの `vls` の設定を追加します。

```
" settings for languages
let g:LanguageClient_serverCommands = {
            \ 'cpp': ['clangd'],
            \ 'rust': ['rustup', 'run', 'nightly', 'rls'],
            \ 'vue': ['vls'],
            \ }
```

### その他のプラグインの設定

他のプラグインの設定をドバーッと載せます。よければ参考にしてみてください。

##### syntastic.rc.vim

```
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0
let g:syntastic_javascript_checkers = ['eslint']
let g:syntastic_mode_map = {
      \ 'mode': 'active',
      \ 'active_filetypes': ['javascript'],
      \ 'passive_filetypes': []
      \ }

let g:syntastic_enable_signs = 1
let g:syntastic_error_symbol = '✗'
let g:syntastic_warning_symbol = '⚠'
<Paste>
```

##### vim-prettier.rc.vim

```
" @formatアノテーションを持ったファイルの自動フォーマットを無効にする
let g:prettier#autoformat = 0

" Prettierのパースエラーをquickfixに表示しない
let g:prettier#quickfix_enabled = 0

autocmd BufWritePre *.js,*.ts,*.vue,*.css,*.scss,*.json,*.md PrettierAsync
```

##### vim-pug-complete.rc.vim

```
let g:html5_event_handler_attributes_complete = 0 " Disable event-handler attributes
let g:html5_rdfa_attributes_complete = 0          " Disable RDFa attributes
let g:html5_microdata_attributes_complete = 0     " Disable microdata attributes
let g:html5_aria_attributes_complete = 0          " Disable WAI-ARIA attribute

```

##### vim-vue.rc.vim

```
autocmd FileType vue syntax sync fromstart
```

## まとめ

今回は、neovim で Nuxt.js 周りの開発を進める上で自分が行った設定をまとめました。

neovim のプラグイン周りを整備することで、フロントエンド開発も今の所そんなに困らずに進めることができています。

多分もっと快適にできる余地はあるとは思いますので、さらにいろいろカスタマイズしていけたら楽しいのではないかと思います。
