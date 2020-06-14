+++
title="Rust で 逆ポーランド記法の実装をしてみた．"
date="2020-06-14T23:17:13+09:00"
categories = ["engineering"]
tags = ["rust", "rpn", "crate"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

以前，C++ で[逆ポーランド記法を実装した](/posts/rpn_with_cpp/) のですが, 今回はそれの Rust 版を実装してみました．

また，今回は Crate として公開してみました．

- Github: https://github.com/foresta/single-digit-rpn
- Crate: https://crates.io/crates/single-digit-rpn

single-digit-rpn というパッケージで公開していて，その名の通り，ひと桁の 逆ポーランド記法を計算するものになります．

## 全体像

今回は，逆ポーランド記法を以下の手順を踏んで実装しました．

- 文字列をTokenに変換
- Token を AST に変換
- AST を評価して計算


また，src/ ディレクトリは以下のようになっています．

```
.
├── ast.rs
├── lib.rs
├── operator.rs
├── parser.rs
└── tokenizer.rs
```

## Tokenize

まずは，文字列をToken 列に変換します．
コードは以下のような感じです．

##### tokenizer.rs
```rust
pub fn tokenize(expr: &str) -> Result<Vec<Token>, TokenError> {
    expr.chars()
        .filter(|c| !c.is_whitespace())
        .map(|e| match e {
            '+' => Ok(Token::Operator(Operator::Add)),
            '-' => Ok(Token::Operator(Operator::Sub)),
            '*' => Ok(Token::Operator(Operator::Mul)),
            '/' => Ok(Token::Operator(Operator::Div)),
            n => match n.to_string().parse::<f64>() {
                Ok(val) => Ok(Token::Operand(val)),
                Err(_) => Err(TokenError::InvalidChar(n)),
            },
        })
        .into_iter()
        .collect()
}
```

入力文字列を，char の配列にして，ホワイトスペースを取り除いた後，文字をチェックしていきます．各文字をそれぞれのオペレータと，オペランド（数値）にマッピングし，マッピングできない文字列が現れたらエラーを還しています．
計算に使うオペレータは以下のように定義しました．

##### operator.rs
```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum Operator {
    Add,
    Sub,
    Mul,
    Div,
}
```

## Parse

次に，Token列を AST にパースします．

##### parser.rs
```rust
/// Parses a Token sequence nto an AST
pub fn parse(tokens: Vec<Token>) -> Result<Ast, ParseError> {
    let mut stack: Vec<Ast> = Vec::new();
    for token in tokens {
        match token {
            Token::Operator(op) => {
                if stack.len() < 2 {
                    return Err(ParseError::MissingOperand);
                }
                let rhs = stack.pop().unwrap();
                let lhs = stack.pop().unwrap();
                let ast = Ast::Op {
                    op: op,
                    lhs: Box::new(lhs),
                    rhs: Box::new(rhs),
                };
                stack.push(ast);
            }
            Token::Operand(n) => stack.push(Ast::Num(n)),
        }
    }

    if stack.len() != 1 {
        return Err(ParseError::RemainingOperand);
    }
    return Ok(stack.pop().unwrap());
}
```

やっていることは，単純で Token を一つずつ見ていき，オペランドであれば `Ast::Num` としてスタックに push し，オペレータであればスタックから 2つ Ast を取り出し `Ast::Op` を構築して，スタックに push します．

Ast::Op は以下のような定義になっていて，左辺と右辺とオペレータを持っている構造になります．

##### ast.rs
```rust
#[derive(Debug, Clone, PartialEq)]
pub enum Ast {
    Num(f64),
    Op {
        op: Operator,
        lhs: Box<Ast>,
        rhs: Box<Ast>,
    },
}
```

左辺と右辺には，Astを取れるので再帰的な木構造になっています． enum で木構造を表現するのは常套手段のようです．（たしかにシンプルでわかりやすい）

parse の結果として，ルートが一つの Ast が生成されます． (ルートが2つ以上あったり，`Ast::Op` が 左辺と右辺を取れない場合には ParseError としています．)

## Evaluate

最後に Ast を評価します．

##### ast.rs
```rust
impl Ast {
    /// Evaluate RPN Ast
    pub fn evaluate(&self) -> f64 {
        match self {
            Ast::Num(n) => *n,
            Ast::Op { op, lhs, rhs } => op.exec(lhs.evaluate(), rhs.evaluate()),
        }
    }
}
```

評価は簡単で，`Ast::Num` であればそのまま数値を返して， `Ast::Op` であれば，Operator の演算を実行します．

```rust
Ast::Op { op, lhs, rhs } => op.exec(lhs.evaluate(), rhs.evaluate()),
```

上記の部分で， `op.exec` の引数の `lhs` (左辺), `rhs` (右辺) の値を evaluate 関数で評価してから渡しているのでここで再帰的に，木が走査されて評価されていきます．

`op.exec` は単純で，各 Enum の値を四則演算にマッピングしているだけになります．

##### operator.rs
```rust
impl Operator {
    /// Arithmetically executes the operator
    pub fn exec(&self, x: f64, y: f64) -> f64 {
        match self {
            Operator::Add => x + y,
            Operator::Sub => x - y,
            Operator::Mul => x * y,
            Operator::Div => x / y,
        }
    }
}

```

## まとめ

今回は，逆ポーランド記法を Rust でも実装して，creates.io にアップロードしてみました．
逆ポーランド記法自体はシンプルな実装ですが，コードを書いてテストを書いて，ドキュメントを書いて，パッケージを creates.io にアップロードするという一連の流れを通して行ってみて，色々と学ぶことが多かったです．

Travis CI も何気に初めて使ったような気がします．
公開することを意識して書くと, 他アプリケーションから使いやすい API にするにはどうしたらよいかなど色々と考えることが多く勉強になりました．


あとは，以前書いた C++ よりも，Rust のほうが表現力が高くで書きやすいと個人的には感じました．Test や，crates.io へのアップロードなど周辺の環境が整っているのも開発しやすさに影響しているのかなと思います．

他にも色々作りたいものはあるので，引き続き Rust で色々書いて行きたいと思います．
