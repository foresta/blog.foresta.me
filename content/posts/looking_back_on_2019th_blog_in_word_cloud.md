+++
title="word cloud で今年のブログを振り返る"
date="2019-12-28T11:13:58+09:00"
categories = ["engineering"]
tags = ["hugo", "blog", "word_cloud", "python", "mecab"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

12/23 日に行われた、[「エンジニアの成長を応援する忘年 LT 大会 2019」](https://engineers.connpass.com/event/158599/) というイベントに参加させていただき、そこで「ブログを書き続けた話」というタイトルで 2019 年のブログの執筆を振り返る LT を行いました。

<script async class="speakerdeck-embed" data-id="1fcf37e85c334e538ab4e12339152773" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

そのなかで以下のような、Word Cloud を用いてブログの内容を可視化してみたところ面白かったので、今日はその Word Cloud について書いていきます。

{{< figure src="/images/posts/looking_back_on_2019th_blog_in_word_cloud/wordcloud.png" >}}

## Word Cloud とは？

Word Cloud は上記の画像のように、単語の出現頻度を可視化するテキストマイニングの手法です。テキストマイニングといったら難しそうですが、ライブラリが用意されていて非常に簡単につくることができます。

ライブラリはこちら。
https://github.com/amueller/word_cloud

## 全体のながれ

作成の流れとしては以下のようになります。

- 可視化したい文章の準備
- 前処理 (不要文字の削除, Stop Word)
- 実行

説明の都合で上記順番で説明していますが、実際には、文章を準備 → 前処理 → 実行 → 前処理 → ... となんども前処理を調整しました。

それでは順を追って説明していきます。

### 可視化したい文章の準備

今回は 2019 年に書いた記事を抽出したかったので、以下のようにコマンドでテキストファイルにしました。

```bash
$ grep 2019 -rl ./content/posts/ | xargs cat > blog.txt
```

`grep` コマンドの "-l" オプションでパターンを含むファイル名だけを標準出力できるので、それを `cat` で ファイルの内容を標準出力に書いたのを、blog.txt というファイルにリダイレクトさせました。

### 前処理 (不要文字の削除、Stop Word)

#### 不要文字の削除

上記のコマンドで出力したファイルは、ブログ用のメタデータなどが入っています。
以下はその一例です。

```
+++
title="word cloud で今年のブログを振り返る"
date="2019-12-28T11:13:58+09:00"
categories = ["engineering"]
tags = ["hugo", "blog", "word_cloud", "python", "mecab"]
thumbnail = ""
+++

こんにちは、{{</* exlink href="https://twitter.com/kz_morita" text="@kz_morita" */>}}です。
```

上記の `+++` で囲まれた箇所は、Front Matter というブログ記事のメタデータなので、正規表現などを用いて除外します。

また、`{{` と `}}` 囲われた箇所は、shortcode という Hugo の記法になるため、こちらも除外しておきます。

#### Stop Word の追加

これで不要な記号などは除外することができたのですが、このまま実行すると以下のような結果になりました。

{{< figure src="/images/posts/looking_back_on_2019th_blog_in_word_cloud/before_preprocessing.png" >}}

ブログでよく使われる、 `ため`、 `でき`、`以下` などのワードや、`kz`、`morita` などの Twitter アカウント名などが Top に出てきてしまっています。これらのワードは解析したくないため、Stop Word に登録します。

最終的に以下のような Stop Word を設定しました。

```python
stop_words = [u'生成', u'用い', u'使用', u'良い', u'仕様', u'実装', u'開発', u'記事', u'取得',
			  u'事象', u'用意', u'作成', u'必要', u'書い', u'計算', u'実際', u'仕様', u'実行',
			  u'方法', u'定義', u'環境', u'表示', u'設定', u'説明', u'kz', u'morita', u'指定',
			  u'場合', u'簡単', u'まとめ', u'上記', u'あり', u'自分', u'もの', u'とき', u'なっ',
			  u'感じ', u'ファイル', u'今回', u'できる', u'いき', u'こちら', u'思い', u'以下', u'ため',
			  u'でき', u'なり', u'てる', u'いる', u'なる', u'れる', u'する', u'ある', u'こと', u'これ',
			  u'さん', u'して', u'くれる', u'やる', u'くださる', u'そう', u'せる', u'した',  u'思う',
			  u'それ', u'ここ', u'ちゃん', u'くん', u'', u'て',u'に',u'を',u'は',u'の', u'が',
			  u'と', u'た', u'し', u'で', u'ない', u'も', u'な', u'い', u'か', u'ので', u'よう', u'']
```

ここらへんは泥臭く、実行しては Stop Word を追加してという作業を繰り返し行いました。

### 実行

それでは、実行の前に必要なライブラリをインストールします。

#### word_cloud のインストール

```bash
$ git clone https://github.com/amueller/word_cloud
$ cd word_cloud
$ python setup.py install
```

#### Mecab のインストール

下記のサイトを参考にしながらインストールを行いました。\
https://qiita.com/paulxll/items/72a2bea9b1d1486ca751

```bash
$ brew install mecab
$ brew install mecab-ipadic
```

```bash
$ pip install mecab-python3
```

#### neologd のインストール

```bash
$ git clone --depth 1 git@github.com:neologd/mecab-ipadic-neologd.git
$ cd mecab-ipadic-neologd
$ ./bin/install-mecab-ipadic-neologd -n
```

### ソースコード

上記で準備ができたはずなので、ソースコードを説明していきます。\
簡単なスクリプトなので、以下に全ソースコードを記載します。

```python
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import MeCab as mc

def generate_wordcloud(text):
    font = "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"

    stop_words = [u'生成', u'用い', u'使用', u'良い', u'仕様', u'実装', u'開発', u'記事', u'取得', \
				  u'事象', u'用意', u'作成', u'必要', u'書い', u'計算', u'実際', u'仕様', u'実行', \
				  u'方法', u'定義', u'環境', u'表示', u'設定', u'説明', u'kz', u'morita', u'指定', \
				  u'場合', u'簡単', u'まとめ', u'上記', u'あり', u'自分', u'もの', u'とき', u'なっ',\
				  u'感じ', u'ファイル', u'今回', u'できる', u'いき', u'こちら', u'思い', u'以下', u'ため',\
				  u'でき', u'なり', u'てる', u'いる', u'なる', u'れる', u'する', u'ある', u'こと', u'これ', u'さん',\
				  u'して', u'くれる', u'やる', u'くださる', u'そう', u'せる', u'した',  u'思う',  \
				  u'それ', u'ここ', u'ちゃん', u'くん', u'', u'て',u'に',u'を',u'は',u'の', u'が', u'と', u'た', u'し', u'で', \
				  u'ない', u'も', u'な', u'い', u'か', u'ので', u'よう', u'']

    wordcloud = WordCloud(background_color="rgb(71,79,109)",font_path=font, width=900, height=500, \
    stopwords=set(stop_words)).generate(text)

    plt.figure(figsize=(15,12))
    plt.imshow(wordcloud)
    plt.axis("off")
    plt.show()

def morphological_analysis(text):
    t = mc.Tagger('/usr/local/lib/mecab/dic/mecab-ipadic-neologd')
    t.parse('')
    node = t.parseToNode(text)
    output = []
    while(node):
        if node.surface != "":
        	word_type = node.feature.split(",")[0]
        	if word_type in ["形容詞", "動詞","名詞", "副詞"]:
            	output.append(node.surface)
        node = node.next
        if node is None:
            break
    return output


text = ""
f = open('blog.txt', 'r')
for row in f:
	text += row

f.close()

wordlist = morphological_analysis(text)
generate_wordcloud(" ".join(wordlist)).decode('utf-8')
```

ソースコードの全体の流れとしては、

- テキストを読み込み
- 形態素解析を行い
- Word Cloud を作成

という形です。

テキストの読み込みは、以下のコードで行ってます。抽出したファイルを読み込んでいるだけです。

```python
text = ""
f = open('blog.txt', 'r')
for row in f:
    text += row

f.close()
```

形態素解析は、 `morphological_analysis(text)` で行っています。\

```python
def morphological_analysis(text):
    t = mc.Tagger('/usr/local/lib/mecab/dic/mecab-ipadic-neologd')
    t.parse('')
    node = t.parseToNode(text)
    output = []
    while(node):
        if node.surface != "":
        	word_type = node.feature.split(",")[0]
        	if word_type in ["形容詞", "動詞","名詞", "副詞"]:
            	output.append(node.surface)
        node = node.next
        if node is None:
            break
    return output
```

`mc.Tagger('/usr/local/lib/mecab/dic/mecab-ipadic-neologd')` の文字列はコンソールで以下を実行して取得したパスを入れます。

```bash
$ echo `mecab-config --dicdir`"/mecab-ipadic-neologd"
```

また、助詞や助動詞はとくにワードとして意味を持たないことが多いので形態素解析の対象からは外しています。(上記では、`形容詞`、`動詞`、`名詞`、 `副詞`を対象にしています。)

Word Cloud の作成は, `gnerate_wordcloud(text)` で行っています。

```python
def generate_wordcloud(text):
    font = "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"

    stop_words = [u'生成', u'用い', u'使用', u'良い', u'仕様', u'実装', u'開発', u'記事', u'取得', \
				  u'事象', u'用意', u'作成', u'必要', u'書い', u'計算', u'実際', u'仕様', u'実行', \
				  u'方法', u'定義', u'環境', u'表示', u'設定', u'説明', u'kz', u'morita', u'指定', \
				  u'場合', u'簡単', u'まとめ', u'上記', u'あり', u'自分', u'もの', u'とき', u'なっ',\
				  u'感じ', u'ファイル', u'今回', u'できる', u'いき', u'こちら', u'思い', u'以下', u'ため',\
				  u'でき', u'なり', u'てる', u'いる', u'なる', u'れる', u'する', u'ある', u'こと', u'これ', u'さん',\
				  u'して', u'くれる', u'やる', u'くださる', u'そう', u'せる', u'した',  u'思う',  \
				  u'それ', u'ここ', u'ちゃん', u'くん', u'', u'て',u'に',u'を',u'は',u'の', u'が', u'と', u'た', u'し', u'で', \
				  u'ない', u'も', u'な', u'い', u'か', u'ので', u'よう', u'']

    wordcloud = WordCloud(background_color="rgb(71,79,109)",font_path=font, width=900, height=500, \
    stopwords=set(stop_words)).generate(text)

    plt.figure(figsize=(15,12))
    plt.imshow(wordcloud)
    plt.axis("off")
    plt.show()

```

以下の行で、フォントや、Stop Word を指定して Word Cloud を生成します。

```python
wordcloud = WordCloud(background_color="rgb(71,79,109)", \
					  font_path=font,
					  width=900,
					  height=500,
					  stopwords=set(stop_words)).generate(text)
```

生成した結果を、 `matplotlib.pyplot` で描画して、Word Cloud の完成です。

## まとめ

今回、Word Cloud を作る方法を簡単に説明しました。\
Word Cloud を振り返って見てみると、`Hugo` や `ブログ` などのブログの執筆・開発に関する記事が一番多く書かれていそうなことがわかります。\
また、確率分布をやっていた時期もあったのですが、それが Word Cloud から読み取れたりしたのは面白かったです。

2020 年末にまた Word Cloud を作成することを楽しみに、来年も頑張ってブログを書いて行こうと思います。

### 参考にしたサイト

- https://github.com/amueller/word_cloud
- https://qiita.com/kenmatsu4/items/9b6ac74f831443d29074
- https://www.pynote.info/entry/python-wordcloud
