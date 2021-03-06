+++
title = "Cコンパイラを作成し始めた話"
thumbnail = ""
tags = ["c", "compiler"]
categories = ["engineering"]
date = "2019-06-09"
+++

こんにちは、[kz\_morita](https://twitter.com/kz_morita)です。\
普段はiOSエンジニアとしてSwiftを書いたり、最近ではNuxt.jsに入門しています。

昔から、低レイヤーの技術に興味があって最近Cコンパイラを作成し始めたのでその紹介をします。

まだ完成していないので軽く触りだけでも紹介して、楽しそうと思っていただけたら嬉しいです。

## 始めようと思ったきっかけ

iOSエンジニアとして、UIに近い箇所の実装を行う機会がとても多いのですが、個人的には低レイヤーの技術にもとても興味があります。

より低いレイヤーの技術を学ぶことが個人的には大事だと思っていて、それは色々な技術は低レイヤーな技術の上に積み重なるようにして存在していると思っているからです。\
また、自分の中では技術は円形に広がっていて、その中央の核にあるのが低レイヤーの技術で、表層にあるのがiOSでいうと、UIKitやその他のライブラリといった認識をしています。

異なる円周上に並んだ異なった技術も、根底にある技術は同じといったことがよくあり、その根底を知っていればいるほど新しい技術へのキャッチアップが早くなるのではないかと考えてます。


とはいえ、どこから手をつけたら良いのかよくわからずに何もできていなかったのですが、下記のコンパイラBookを見つけすごくわかりやすく書かれているためこれを機に初めて見ようと思いました。

[低レイヤを知りたい人のためのCコンパイラ作成入門](https://www.sigbus.info/compilerbook)


## やり方

基本的には上記の compilerbookの通りにちまちま初めてみました。

作成途中のリポジトリはこちら\
https://github.com/foresta/kzcc

現在はステップ10のreturn文をかけるところまで実装することができています。

[ステップ10return文](https://www.sigbus.info/compilerbook#%E3%82%B9%E3%83%86%E3%83%83%E3%83%9710return%E6%96%87)


## 学んだこと

そもそも、C言語をまともに書いたことがなかったので、C言語の書き方やMakefileの書き方、ファイル分割の勘所など非常に学ぶものがたくさんあります。

他にも、コンパイラを Tokenizer、Parser、CodeGeneratorに分けて実装するところや、
x_86のアセンブリの書き方、スタックマシンとして実装する方法みたいな色々なことを学べています。


## まとめ

コンパイラを作るのはすごくハードルが高そうですが、すごく楽しいですし CompilerBook がすごく丁寧に書かれているので興味はあるけどなかなか手をつけられないといった方にはおすすめなのかなぁと思いました。

最近なかなか時間が取れていないのですが、引き続き実装を進めてセルフコンパイルするところを目標に頑張りたいと思います。

