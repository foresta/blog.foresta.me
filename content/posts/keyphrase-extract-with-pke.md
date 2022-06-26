+++
title="pke を使ってキーフレーズの抽出をする"
date="2022-06-26T13:53:49+09:00"
categories = ["engineering"]
tags = ["nlp"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，pke を用いて キーフレーズ抽出をためしてみたのでそのまとめです．

## pke とは

pke は，python keyphrase extraction の略で，python で書かれたキーフレーズ抽出のための OSS です．

- {{< exlink href="https://github.com/boudinfl/pke/" >}}

## 準備

### pke の install

まずは pke をインストールします．

```
$ pip install git+https://github.com/boudinfl/pke.git
```

### nltk の install

nltk は Natural Language ToolKit の略で，自然言語処理を行う際のテキスト処理プラットフォームで，Tokenize や，Stemming，タグ付けなどさまざまなライブラリが提供されてます．

pke の中で使用されているためインストールします．

```
$ pip install nltk
```

自分の場合はすでに入っていたのでこの作業は省略しました．

次に，stopword を download します．

```
$ python -m nltk.downloader stopwords
```

### spaCy と GiNZA の install 

spaCy をインストールします．こちらも pip でいれます．

```
$ pip install -U spacy
```

- {{< exlink href="https://spacy.io/usage">}}

一緒に GiNZA もインストールします．

GiNZA は日本語の自然言語処理ライブラリです．

```
$ pip install -U ginza ja_ginza_electra
```

- {{< exlink href="https://megagonlabs.github.io/ginza/" >}}


ここまででひととおりセットアップ完了なのですが，色々バージョンが噛み合わずに以下のようにバージョンしていしてインストールをしたりしました．

```
$ pip install spacy==3.2.4
```

## キーフレーズ抽出をしてみる

以下のようなコードを書いて，キーワード抽出をしてみました．

```python
import pke
import ginza
import nltk
from spacy.lang import ja


pke.base.stopwords['ja_ginza_electra'] = 'japanese'
# ↓は以前のバージョンの書き方でうまく動かない
# pke.base.ISO_to_language['ja_ginza']

stopwords = list(ja.STOP_WORDS)
nltk.corpus.stopwords.words_org = nltk.corpus.stopwords.words
nltk.corpus.stopwords.words = lambda lang : stopwords if lang == 'japanese' else nltk.corpus.stopwords.words_olg(lang)


# Wikipedia カエルより引用
# https://ja.wikipedia.org/wiki/%E3%82%AB%E3%82%A8%E3%83%AB 
text = ("カエル（蛙、英語: Frog）は、両生綱無尾目（むびもく、Anura）に分類される構成種の総称。古称としてかわず（旧かな表記では「かはづ」）などがある。英名は一般にはfrogであるが，ヒキガエルのような外観のものをtoadと呼ぶことが多い。"
"成体の頭は三角形で、目は上に飛び出している。一見すると頭部には種による差異がないようにも思えるが、実際には天敵対策のために毒液を流し込む鋭い棘を発達させた種や、大きめの獲物を飲み込めるように大きく裂けた顎を持つ種など、種ごとの違いが大きい。中には頭部をヘルメットのように活用して巣穴に蓋をする種もいる。極わずかの例外を除き、上顎にしか歯が生えていない。が歯が無い種類でも、牙状の突起を進化させたものが少なくない[3]。獲物を飲み込む際には、目玉を引っ込めて強制的に喉の奥へ押し込む。"
"胴体は丸っこく、尻尾は幼体にしか存在しない。ほとんどの種で肋骨がない。"
"後肢が特に発達しており、後肢でジャンプすることで、敵から逃げたり、エサを捕まえたりする。後肢の指の間に水掻きが発達するものが多く、これを使ってよく泳ぐ。"
"前肢は人間の腕に似た形状をしている。ジャンプからの着地の際に身体への衝撃を和らげるのが主な役目である。餌となる小動物に飛びついて両肢で押さえつけたり、冬眠などのために土砂を掘ったり、汚れ落としのために片肢で顔を拭いたりする動作も可能である。アオガエル科やアマガエル科などの樹上生活をする種の多くでは指先に吸盤が発達し、その補助で細い枝などに掴まることができる。人間や猿のように物を片肢ないし両肢で掴み取ることはできない。"
"幼生は四肢がなく、ひれのついた尾をもつ。成体とは違う姿をしていて、俗に「オタマジャクシ（お玉杓子）」と呼ばれる（食器のお玉杓子に似た形状から）。オタマジャクシはえら呼吸を行い、尾を使って泳ぐため、淡水中でないと生きることができない。オタマジャクシは変態することで、尾をもたず肺呼吸する、四肢をもった幼体（仔ガエル）となる。"
)

extractor = pke.unsupervised.TopicRank()

# normalization=None を指定しないと，デフォルトの Stemming 処理が走りそれが日本語未対応のためエラーになる
extractor.load_document(input=text, language = 'ja', normalization=None)

extractor.candidate_selection(pos={'NOUN', 'PROPN', 'ADJ', 'NUM'})
extractor.candidate_weighting()

keyphrases = extractor.get_n_best(n = 10)

print(keyphrases)
```

上記のコードは，↓のブログ記事を参考にさせていただきました．感謝．

- {{< exlink href="https://www.ogis-ri.co.jp/otc/hiroba/technical/similar-document-search/part5.html" >}}

これを実行すると以下のような結果が得られます．

```
[('オタマジャクシ', 0.09133539857693608), ('frog', 0.07307311988801227), ('お玉杓子', 0.06452504908762074), ('ヒキガエル', 0.047070567570176323), ('えら 呼吸', 0.046232276993040215), ('toad', 0.04064873626466183), ('大きい', 0.039516540477561084), ('大きく', 0.0394969335354852), ('かはづ', 0.038680269064926893), ('ヘルメット', 0.038285418839298965)]
```

カエルに関するキーワードが得られました．

## まとめ

今回は，pke を用いて，wikipedia の文章からキーワードの抽出してみました．

今回はとりあえずライブラリを用いて動かしてみただけなので，

- 内部の処理内容
- 精度を上げるためのパラメータなどのチューニング方法

などについては踏み込みませんでした．

ちゃんと使うのであれば，もう少し中身でやっていることと，今回インストールしたライブラリ達がどのような役割になっているかなどもう少しちゃんと知る必要がありそうです．

ただ，試してみるだけであれば非常に簡単にできたので改めて python の nlp まわりの成熟度はすごいなと思いました．
