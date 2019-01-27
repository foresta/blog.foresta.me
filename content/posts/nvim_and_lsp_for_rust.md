+++
title = "neovimとLSPでRust開発環境をつくったら最高だった話"
thumbnail = ""
tags = ["vim", "nvim", "lsp", "rust"]
categories = ["engineering"]
date = "2019-01-27"
+++

## 背景

Rustの開発環境をつくろうとしてたら、いつのまにかvimからnvimに移行して、LSPで補完ができるようにしていました。
完全に「ヤクの毛刈り」ですが、ある程度動くようになって結構かきやすくなったので設定周りを紹介します。

## 成果物

先に成果物を。

### コード補完

{{< figure src="/images/posts/nvim_and_lsp_for_rust/result.gif" >}}

### フォーマット

{{< figure src="/images/posts/nvim_and_lsp_for_rust/format.gif" >}}

## 手順

### インストール系

Rustはインストールされているものとして話を進めます。

neovimのインストール

```
$ brew install neovim
```

pipでneovimをインストール

```
$ pip install neovim
$ pip3 install neovim
```

rustのLSPサーバーや補完用のものをインストール

```
$ rustup update
$ rustup component add rls-preview --toolchain nightly
$ rustup component add rust-analysis --toolchain nightly
$ rustup component add rust-src --toolchain nightly
```

### 設定ファイル

設定ファイルは以下のディレクトリ配下にいれています。

```
$HOME/.config/nvim/
├── colors
│   └── iceberg.vim
├── dein.toml
├── dein_lazy.toml
├── init.vim
├── plugins
│   ├── LanguageClient-neovim.rc.vim
│   ├── NERDTree.rc.vim
│   ├── deoplete.rc.vim
│   ├── fzf.rc.vim
│   ├── neosnippet.rc.vim
│   ├── rust.rc.vim
│   └── vim-fugitive.rc.vim
└── syntax
    └── html.vim
```

init.vimにnvim初期化用のスクリプトをいれています。
今回に関係するところでいうとまず、init.vimのプラグイン周りは以下のようになっています。
パッケージマネージャはdeinを用いています。

プラグイン周りの設定は以下のような感じ

#### init.vim
```init.vim
" ===========
" Plugins
" ===========

augroup PluginInstall
    autocmd!
    autocmd VimEnter * if dein#check_install() | call dein#install() | endif
augroup END
command! -nargs=0 PluginUpdate call dein#update()

let s:dein_dir = expand('$DATA/dein')

if &runtimepath !~# '/dein.vim'
    let s:dein_repo_dir = s:dein_dir . '/repos/github.com/Shougo.dein.vim'

    if !isdirectory(s:dein_repo_dir)
        execute printf('!git clone %s %s', 'https://github.com/Shougo/dein.vim', s:dein_repo_dir)
    endif

    execute 'set runtimepath^=' . s:dein_repo_dir
endif

let g:dein#install_pax_processed = 48

let s:toml_file = '~/.config/nvim/dein.toml'
let s:toml_lazy_file = '~/.config/nvim/dein_lazy.toml'
if dein#load_state(s:dein_dir)
    call dein#begin(s:dein_dir)

    call dein#load_toml(s:toml_file, {'lazy': 0})
    call dein#load_toml(s:toml_lazy_file, {'lazy': 1})

    call dein#end()
    call dein#save_state()
endif

filetype plugin indent on
```

dein.tomlは以下のような感じ、LSPに関係しそうなところのみ抜き出してますが最低限このくらいで大丈夫なはずです。

#### dein.toml
```dein.toml

[[plugins]]
repo = 'Shougo/context_filetype.vim'

[[plugins]]
repo = 'Shougo/neosnippet.vim'
on_event = 'InsertCharPre'
on_ft = 'snippet'
depends = 'context_filetype.vim'
hook_add = '''
source ~/.config/nvim/plugins/neosnippet.rc.vim
'''

[[plugins]]
repo = 'Shougo/neosnippet-snippets'

[[plugins]]
repo = 'Shougo/deoplete.nvim'
depends = 'context_filetype.vim'
on_event = "InsertEnter"
hook_add = '''
source ~/.config/nvim/plugins/deoplete.rc.vim
'''

[[plugins]]
repo = 'autozimu/LanguageClient-neovim'
rev = 'next'
build = 'bash install.sh'
hook_add = '''
source ~/.config/nvim/plugins/LanguageClient-neovim.rc.vim
'''

[[plugins]]
repo = 'rust-lang/rust.vim'
on_ft = 'rust'
hook_add = '''
source ~/.config/nvim/plugins/rust.rc.vim
'''

```

#### rust.rc.vim
```rust.rc.vim
let g:rustfmt_autosave = 1
```

#### deoplete.rc.vim
```deoplete.rc.vim
" options
let g:deoplete#enable_at_startup = 1
let g:deoplete#auto_complete_delay = 0
let g:deoplete#auto_complete_start_length = 1
let g:deoplete#enable_camel_case = 0
let g:deoplete#enable_ignore_case = 0
let g:deoplete#enable_refresh_always = 0
let g:deoplete#enable_smart_case = 1
let g:deoplete#file#enable_buffer_path = 1
let g:deoplete#max_list = 10000

```

#### neosnippet.rc.vim
```neosnippet.rc.vim
let g:neosnippet#snippets_directory = '~/.config/nvim/snippets'
let g:neosnippet#enable_snipmate_compatibility = 1

imap <C-k> <Plug>(neosnippet_expand_or_jump)
smap <C-k> <Plug>(neosnippet_expand_or_jump)
xmap <C-k> <Plug>(neosnippet_expand_target)
if has('conceal')
    set conceallevel=2 concealcursor=niv
endif

```

#### LanguageClient-neovim.rc.vim

以下のように設定しています。


* `Space + lh` でドキュメント
* `Space + ld` で定義ジャンプ
* `Space + lr` でリネーム
* `Space + lf` でフォーマット

```LanguageClient-neovim.rc.vim
set hidden

" settings for languages
let g:LanguageClient_serverCommands = {
            \ 'cpp': ['clangd'],
            \ 'rust': ['rustup', 'run', 'nightly', 'rls'],
            \ }

augroup LanguageClient_config
    autocmd!
    autocmd User LanguageClientStarted setlocal signcolumn=yes
    autocmd User LanguageClientStopped setlocal signcolumn=auto
augroup END

let g:LanguageClient_autoStart = 1
nnoremap <silent> <Space>lh :call LanguageClient_textDocument_hover()<CR>
nnoremap <silent> <Space>ld :call LanguageClient_textDocument_definition()<CR>
nnoremap <silent> <Space>lr :call LanguageClient_textDocument_rename()<CR>
nnoremap <silent> <Space>lf :call LanguageClient_textDocument_formatting()<CR>

```

## まとめ

とりあえず、neovimでRustの補完・定義ジャンプ・ドキュメント参照・リネーム・フォーマットができるようになりました。これで開発がはかどるはずです。

今回は設定ファイルなどをただ列挙しているだけなので、もしわからないこと等あればお気軽に聞いていただければと思います。([@kz_morita](https://twitter.com/kz_morita))

## 参考サイト

http://wheson-prog.hatenablog.jp/entry/2018/06/05/141730
https://muunyblue.github.io/48dd34fa4a5fc8e0045aba1952e1818e.html
