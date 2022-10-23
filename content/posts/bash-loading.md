+++
title="Shell Script でプログレスバーを実装する"
date="2022-10-23T01:26:34+09:00"
categories = ["engineering"]
tags = ["bash", "shellscript"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

時間のかかる処理などを自動化して実行するために Bash を使うことがよくあるのですが、ログなどに進捗を出しておかないとあとどのくらいで終わりそうかがわからずに計画がたてられないといったことがあると思います。

既存の公開されているスクリプト (特に Install Script など) はインストールの進捗がプログレスバーなどで表現されていると思います。

今回はそれをどうやって実現しているのか、調査して実装したので内容についてメモします。

## 成果物

さきに、今回作った成果物です。progress_bar 関数に、現在の進捗と全体の処理数渡したらいい感じにプログレスバー出してくれるように実装しました。

{{< exlink href="https://gist.github.com/foresta/1c2fd61c93faf08c17a0b423a2640b94" >}}

```bash
#!/bin/bash

progress_bar() {
    current=$1
    total=$2
    
    progress=$(($current * 100 / ${total}))
    
    bar="$(yes '#' | head -n ${progress} | tr -d '\n')"
    if [ -z "$bar" ]; then
        bar='_'
    fi

    printf "\r[%-100s] (%d/%d)" ${bar} ${current} ${total}
}

echo "[Start]"
total=100
for i in $(seq 1 ${total}); do
    progress_bar $i $total

    sleep 0.05
done

echo ""
```

実行すると以下のような結果になります。それっぽい結果になったのではないかと思います。

{{< figure src="/images/posts/bash-loading/progress-bar.gif" >}}

## どうやって実現したのか？

プログレスバーの実装でパッと考えると以下の部分が肝になるのかなと思います。

- 同じ行を更新する方法
- 進捗のバーをどのように表現するのか？

### 同じ行の更新する方法

プログレスバーを実現にあたり、`printf` を用いていますが普通に複数回実行するだけでは、文字列が結合されて表示されてしまうと思います。

これはキャリッジリターン `\r` を使用することで行全体を更新するような表示をすることができます。
キャリッジリターンは、カーソルを先頭に移動する制御文字でこれを用いるとカーソルを戻して上書きするような挙動をすることができます。

```bash
#!/bin/bash

printf "HogeHoge"
printf "FugaFuga"
printf "PiyoPiyo"
```

上記を実行すると以下のようになりますが、

```
HogeHogeFugaFugaPiyoPiyo
```


```bash
#!/bin/bash

printf "\rHogeHoge"
printf "\rFugaFuga"
printf "\rPiyoPiyo"
```

こちらを実行すると以下のように上書きされるため最後の行のみが表示されます。

```
PiyoPiyo
```

プログレスバーの実装でも、以下のように先頭に `\r` を置くことで上書きしています。

```bash
printf "\r[%-100s] (%d/%d)" ${bar} ${current} ${total}
```

### 進捗のバーをどのように表現するのか？

プログレスバーを表示するところは以下のようなロジックになっています。

```bash
    progress=$(($current * 100 / ${total}))
    
    bar="$(yes '#' | head -n ${progress} | tr -d '\n')"
    if [ -z "$bar" ]; then
        bar='_'
    fi

    printf "\r[%-100s] (%d/%d)" ${bar} ${current} ${total}
```

やっていることは以下のとおりです。

- 進捗 (百分率) を計算
- プログレスバーとしての `###` を進捗の分だけ表示
- 左詰めでプログレスバーを表示

進捗の計算は良いとして、プログレスバーの部分の表示は少し見慣れないコマンドになっているかと思います。

```bash
bar="$(yes '#' | head -n ${progress} | tr -d '\n')"
```

`yes` コマンドは、標準入力に特定の文字をひたすら送り続けるコマンドで、主に `apt install` などのインタラクティブなプロンプトに対して自動で `y` を送り続けることでスクリプト自動化下する際に使うコマンドです。

引数を渡すと、その文字をひたすら送り続けます。

yes コマンドで、`#` をひたすら生成して、head コマンドで進捗分先頭から取得して、最後に改行を消して進捗のバーを表現してます。

最後に表示する部分ですが、`%-100s` という形で100文字で左詰めにしてます。負の値で左詰めで正の値で右詰めになります。

```bash
printf "\r[%-100s] (%d/%d)" ${bar} ${current} ${total}
```

## まとめ

今回は、ShellScript でプログレスバーを表示する方法についてまとめました。
ShellScript は簡単にかけて雑に書くことが多いのですが、プログレスバーを実装してみたり、他には Usage をちゃんと書いたりしておくと後々運用しやすくなったり便利なので、ひと手間かけておくと良いことがあるなというのが最近の学びです。