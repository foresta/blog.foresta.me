+++
title="Rust で深さ優先探索"
date="2021-02-07T12:29:04+09:00"
categories = ["engineering"]
tags = ["rust", "algorithm", "dfs"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

LeetCode で遊んでいて Rust で木構造の実装をしたのでまとめておきます．

ちなみに，ソースコードこちらに雑に上げてます．

{{< exlink href="https://github.com/foresta/rust-tree">}}


## データ構造

以下のようなデータ構造で木構造を表現します．

```rust
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: String,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}
```

よくある木構造だと enum で表現して Box を使うものをよく見ると思いますが LeetCode で前提となっていた `Rc<RefCell<TreeNode>>` 形式で今回は考えます．

木構造自体は以下のようなものを作ります．

```rust
fn create_tree_node() -> Rc<RefCell<TreeNode>> {
    //
    //        A
    //    B       C
    //  D   E       F
    // G H   I     J K
    //

    let mut a = TreeNode::new("A");
    let mut b = TreeNode::new("B");
    let mut c = TreeNode::new("C");
    let mut d = TreeNode::new("D");
    let mut e = TreeNode::new("E");
    let mut f = TreeNode::new("F");
    let g = TreeNode::new("G");
    let h = TreeNode::new("H");
    let i = TreeNode::new("I");
    let j = TreeNode::new("J");
    let k = TreeNode::new("K");

    d.left = Some(Rc::new(RefCell::new(g)));
    d.right = Some(Rc::new(RefCell::new(h)));
    e.right = Some(Rc::new(RefCell::new(i)));
    f.left = Some(Rc::new(RefCell::new(j)));
    f.right = Some(Rc::new(RefCell::new(k)));

    b.left = Some(Rc::new(RefCell::new(d)));
    b.right = Some(Rc::new(RefCell::new(e)));
    c.right = Some(Rc::new(RefCell::new(f)));

    a.left = Some(Rc::new(RefCell::new(b)));
    a.right = Some(Rc::new(RefCell::new(c)));

    Rc::new(RefCell::new(a))
}
```

## DFS 

深さ優先探索するので，以下の順番で走査します．

A → B → D → G → H → E → I → C → F → J → K

これを実現するには，再帰的な関数を用意すればシンプルに実装できます．

```rust
fn dfs(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<String> {
    _dfs_traverse(root)
}

fn _dfs_traverse(node: Option<Rc<RefCell<TreeNode>>>) -> Vec<String> {
    match node {
        None => vec![],
        Some(no) => {
            let n = no.borrow().to_owned();
            let mut current = vec![n.val];
            let mut left_children = _dfs_traverse(n.left);
            let mut right_children = _dfs_traverse(n.right);
            current.append(&mut left_children);
            current.append(&mut right_children);
            current
        }
    }
}
```

以下の場所で，`Current Node Value + Left Children Values + Right Children Values` という順番で走査していて，子要素の走査は，再帰的に行っています．

```rust
let mut current = vec![n.val];
let mut left_children = _dfs_traverse(n.left);
let mut right_children = _dfs_traverse(n.right);
current.append(&mut left_children);
current.append(&mut right_children);
current
```

呼び出し側は以下のような感じです．

```rust
fn main() {
    println!("dfs: {:?}", dfs(Some(create_tree_node())));
}
```

実行すると以下のようになります．

```
dfs: ["A", "B", "D", "G", "H", "E", "I", "C", "F", "J", "K"]
```

## まとめ

DFSのアルゴリズム自体はそこまで難しくないのですが，Rustで木構造を表現してそれを扱うのに苦労しました．
特に，`Rc` と `RefCell` 周りの理解がちょっと足りていないと感じました．

`Rc` は Reference Counter の仕組みをもつ スマートポインタだと思うので，今回のような `Binary Tree` では，`Box` で事足りるのかなぁと思いました．

RefCell は，ちょっとよくわかってないですが，借用ルールを逃れるためにもとの値の参照を得られるもというイメージです．ちょっとこのあたりはもう少し調査したいと思いました．

