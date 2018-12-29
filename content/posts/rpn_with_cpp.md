+++
title = "C++で逆ポーランド記法を実装する"
thumbnail = ""
tags = ["c++", "algorithm"]
categories = ["engineering"]
date = "2018-12-29"
+++

## 背景

make 10 (4つの数字と四則演算を用いて10をつくるゲーム。切符とかでよく遊ぶやつ) を解くプログラムを作ろうとして、その1要素としてC++で逆ポーランド記法を計算するプログラムを書いてみたら楽しかったのでメモしておきます。

## 逆ポーランド記法とは?

四則演算を計算する際の記法で、例えば
`1 + 2`ならば、`12+`の用に書きます。\
コンピュータで計算式を解析するのに向いている記法で、演算子を後置するようなイメージです。 \

具体的な `123+4++` のような例をつかって計算順序のイメージをみてみます。

左から順番に文字を処理していき以下のような順序で演算していきます。
```
1
12
123
123+ // (23+ -> 5)
15
154 
154+ // (54+ -> 9)
19
19+  // (19+ -> 10)
10
```

詳しい説明はこちらのサイトがすごくわかりやすいので、ぜひ参照してみてください。\
https://qiita.com/yumura_s/items/ddb0d143fb0e9a082891

## 環境

環境は以下の通りです。

```
OS X(High Sierra)

$ g++ -v
Configured with: --prefix=/Applications/Xcode.app/Contents/Developer/usr --with-gxx-include-dir=/usr/include/c++/4.2.1
Apple LLVM version 10.0.0 (clang-1000.11.45.5)
Target: x86_64-apple-darwin17.7.0
Thread model: posix
InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
```

また、c++14の記法を一部使っています。

今回はユニットテスト用にgoogleTestを使用することにしました。
https://github.com/google/googletest

Google Testに関しては参考になったサイトを載せておくのでそちらを参照していただければと思います。

* [Google Test ことはじめ](https://techblog.kayac.com/google-test)
* [GoogleTestでC++のコードをテストする](https://qiita.com/tjun/items/8047bf50930e6de36bdc)
* [GoogleTest + CMakeでC++の実践的なユニットテスト環境を構築する](https://qiita.com/imasaaki/items/c56639c86627a8a950de)


## 実装

今回実装した成果物はこちら \
https://github.com/foresta/rpn

実装は以下の手順で進めました。

* Google Testの準備
* 文字をパース
* 文字列を文字に分解する
* 文字を数値に変換
* 文字をオペレータに変換
* stackを用いて逆ポーランド記法の実装

注意として、`using namespace std;` をしているため、基本的に `std::` は省略しています。

### Google Testの準備

上記の参考サイトを参照していい感じに設定をします。
自分はリポジトリ内にGoogle Testのバイナリを含めてしまいましたが、どこに配置しても大丈夫かと思います。

ディレクトリの構成は以下のような感じにしています。

```
.
├── bin // -- ビルド成果物
│   ├── main
│   ├── main.o
│   └── rpn.o
├── googletest // -- テストライブラリ
│   ├── include/
│   ├── libgmock.a
│   ├── libgmock_main.a
│   ├── libgtest.a
│   └── libgtest_main.a
├── run.sh // -- ビルド&実行スクリプト
├── src // -- ソースコード
│   ├── main.cpp
│   ├── rpn.cpp
│   └── rpn.h
├── test
│   └── rpn_test.cpp // -- テストコード
└── test.sh // -- テスト実行スクリプト

```

### 文字をパースする

一文字を受け取ってそれが、オペレータなのかオペランドなのか不正な文字なのかをパースする関数を実装します。

#### テスト

テストは以下のような感じ。
```cpp
TEST(rpn_test, func_parse) {
    ASSERT_EQ(rpn::parse('/'), rpn::ParseResult::Operator);
    ASSERT_EQ(rpn::parse('*'), rpn::ParseResult::Operator);
    ASSERT_EQ(rpn::parse('+'), rpn::ParseResult::Operator);
    ASSERT_EQ(rpn::parse('-'), rpn::ParseResult::Operator);
    ASSERT_EQ(rpn::parse('0'), rpn::ParseResult::Operand);
    ASSERT_EQ(rpn::parse('3'), rpn::ParseResult::Operand);
    ASSERT_EQ(rpn::parse('9'), rpn::ParseResult::Operand);
    ASSERT_EQ(rpn::parse('a'), rpn::ParseResult::Invalid);
}
```

#### 実装

ParseResultというenum を定義して文字がどれなのかを判別するようにしています。
数値の判別には、isdigit関数が使えるのでそれを利用しました。

```cpp
// パース結果
enum class ParseResult {
    Operator = 0,
    Operand,
    Invalid
};

ParseResult parse(const char& c) {
    if (isdigit(static_cast<unsigned char>(c))) {
        return ParseResult::Operand;
    }

    if (c == '+' || c == '-' || c == '*' || c == '/') {
        return ParseResult::Operator;
    }

    return ParseResult::Invalid;
}

```

### 文字列を文字に分解する

入力された文字列を一文字ずつ解析するために、分解する関数を用意しました。

#### テスト

```cpp
TEST(rpn_test, func_stringsToChars) {
    vector<char> result = {'h','e','l','l','o'};
    ASSERT_EQ(result, rpn::stringToChars("hello"));
}
```

#### 実装

文字列をvector<char> で返します。

```cpp
vector<char> stringToChars(const string& s) {
    vector<char> result(s.begin(), s.end());
    return result;
}
```

### 文字を数値に変換

文字を数値として扱うため、変換します。
#### テスト
```cpp
TEST(rpn_test, func_charToInt) {
    ASSERT_EQ(rpn::charToInt('1'), 1);
    ASSERT_EQ(rpn::charToInt('9'), 9);
    ASSERT_THROW(rpn::charToInt('a'), invalid_argument);
}
```

#### 実装

```cpp
int charToInt(const char& c) {
    if (!isdigit(static_cast<unsigned char>(c))) {
        throw invalid_argument("argument should be number character");
    }
    return c - '0';
}
```

`c - '0'`というのは、0~9までのASCIIコードが連番なのを利用したイディオムです。\
例えば `'4' - '0'` はASCIIコードが連番であるために、'0', '1', '2', '3', '4' とならんでおりその差を取ると、数値の4になるという具合です。



### 文字をオペレータに変換

文字列からstd::functionを返します。

#### テスト

テストでは、帰ってきた関数で実際に計算した結果が期待した数値かどうかをみています。

```cpp
TEST(rpn_test, func_charToOperator) {

    ASSERT_EQ(rpn::charToOperator('+')(1,2), 3);
    ASSERT_EQ(rpn::charToOperator('-')(7,3), 4);
    ASSERT_EQ(rpn::charToOperator('*')(4,3), 12);
    ASSERT_EQ(rpn::charToOperator('/')(8, 2), 4);
    // divide by zero return 0
    ASSERT_EQ(rpn::charToOperator('/')(3, 0), 0);
    ASSERT_THROW(rpn::charToOperator('a'), invalid_argument);
}

```


#### 実装

各演算子文字に対応する関数を返します。
今回は0 除算は0を返すように実装しました。(例外を出した方が良いかもですが。) \
また、除算において小数や分数を扱うことはせず、整数のみを対象にしています。

```cpp
 function<int(int, int)> charToOperator(const char& c) {
    switch (c) {
        case '+':
            return [](int a, int b){ return a + b; };
        case '-':
            return [](int a, int b){ return a - b; };
        case '*':
            return [](int a, int b){ return a * b; };
        case '/':
            return [](int a, int b){ if (b == 0) return 0; return a/ b; };
        default:
            throw invalid_argument("operator should be +-*/");
    }
}
```


### stackを用いて逆ポーランド記法を実装

#### テスト

期待する動作をテストコードで列挙します。最終的に計算しきれないような場合は `invalid_argument` をthrowするようにしています。

```cpp
TEST(rpn_test, func_rpn) {
    ASSERT_EQ(rpn::rpn("1234+++"), 10);
    ASSERT_EQ(rpn::rpn("83+5-9+"), 15);
    ASSERT_EQ(rpn::rpn("893/*4+"), 28);
    ASSERT_THROW(rpn::rpn("8888+"), invalid_argument);   // 演算子がたりない
    ASSERT_THROW(rpn::rpn("88++88+"), invalid_argument); // 左から二つ目の+ で数字がたりない
    ASSERT_THROW(rpn::rpn("abcdefg"), invalid_argument); // そもそも文字が不正
}
```


#### 実装

いままでに実装してきた部品を組み合わせて逆ポーランド記法を実装します。

```cpp
int rpn(const string& s) {
    stack<int> operands;

    for (const char c : stringToChars(s)) {
        ParseResult parseResult = parse(c);
        switch (parseResult) {
            case ParseResult::Operator:
                {
                    if (operands.size() < 2) {
                        throw invalid_argument("Invalid RPN syntax.(operator should be required two operands)");
                    }

                    auto op2 = operands.top();
                    operands.pop();

                    auto op1 = operands.top();
                    operands.pop();

                    int result = charToOperator(c)(op1, op2);
                    operands.push(result);

                    break;
                }
            case ParseResult::Operand:
                {
                    operands.push(charToInt(c));
                    break;
                }
            case ParseResult::Invalid:
                {
                    throw invalid_argument("Invalid character exists.");
                }
        }
    }

    if (operands.size() != 1) {
        throw invalid_argument("Invalid RPN syntax.(RPN result is one operand)");
    }

    return operands.top();
}
```

ちょっと長いので個別にみていきます。

まず、直前の数値を取り出す必要があるので、LIFO(後入れ先出し)のデータ構造であるstackを用いると良さそうです。

stackはc++のstdライブラリに用意されているのでそれを使います。

```cpp
stack<int> operands;
```

つぎに、入力文字列を一文字ずつ解析していきます。

```cpp
for (const char c : stringToChars(s)) {
    ParseResult parseResult = parse(c);

    // ...

}
```

そして、結果に応じて処理を振り分けていきます。

まず、演算子の場合はスタックから数値を二つ取り出します。
もし仮に二つない場合は、逆ポーランド記法のSyntaxが間違っていますので例外を throw するようにしています。\
取得した二つの数値を、文字に対応する関数 (charToOperatorの戻り値) の引数として与え、計算を行います。最後に、結果をスタックに保持します。

```cpp
case ParseResult::Operator:
{
    if (operands.size() < 2) {
        throw invalid_argument("Invalid RPN syntax.(operator should be required two operands)");
    }

    auto op2 = operands.top();
    operands.pop();

    auto op1 = operands.top();
    operands.pop();

    int result = charToOperator(c)(op1, op2);
    operands.push(result);

    break;
}
```

次に数値の場合ですが、数値は純粋にスタックに積みます。

```cpp
case ParseResult::Operand:
{
    operands.push(charToInt(c));
    break;
}
```

不正な文字であった場合は例外をthrowします。

```cpp
case ParseResult::Invalid:
{
    throw invalid_argument("Invalid character exists.");
}
```

上記の処理を入力された文字だけループして行います。

最後に逆ポーランド記法の結果は単一の数値になるはずなのでスタックの要素数が1出ない場合はエラーとして例外をthrowします。

```cpp
if (operands.size() != 1) {
    throw invalid_argument("Invalid RPN syntax.(RPN result is one operand)");
}
```

このようにして計算された結果はスタックに残っているのでその要素を返して、rpn関数の役目は終わりです。

```cpp
return operands.top();
```

## 実装していないところ

make 10では、分数を扱う必要があります。
たとえば、`1469` などのケースで、
`(9/6 + 1) * 4` のような回答があります。

$$
(\frac{9}{6} + 1) \times 4 = \frac{5}{2} \times 4 = 10
$$

現状のケースだと、`9 / 6 = 0` と計算してしまうため、10を作ることができません。

## 感想

逆ポーランド記法などは割とよく知られた問題ですが、ちゃんとプログラムとして書くと意外とつまづいたりすることもあって面白かったです。 \
また今回はテスト駆動開発を意識でやってみましたがテストが通った瞬間の気持ち良さがあり楽しかったです。\
こういうちょっと遊びだけど、頭使う系のプログラムもたまには良いものだなーと思いました。
