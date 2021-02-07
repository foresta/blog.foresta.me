+++
title="Rust で幅優先探索"
date="2021-02-07T13:37:22+09:00"
categories = ["engineering"]
tags = ["rust", "algorithm", "bfs"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

[前回の記事](/posts/rust-tree-dfs) で深さ優先探索を実装したので今回はその幅優先探索バージョンになります．

ちなみに，ソースコードこちらに雑に上げてます．

{{< exlink href="https://github.com/foresta/rust-tree">}}


## データ構造

前回と同じものですが再掲します．

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

## BFS (breadth-first search)

今回は幅優先探索なので，以下のようにアルファベット順で走査します．

```
    //
    //        A
    //    B       C
    //  D   E       F
    // G H   I     J K
    //

A → B → C → D → E → F → G → H → I → J → K
```

幅優先探索でも再帰的な関数で実現することができます．


```rust
fn bfs(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<String> {
    match root {
        Some(r) => _bfs_traverse(vec![r]),
        None => vec![],
    }
}

fn _bfs_traverse(node_list: Vec<Rc<RefCell<TreeNode>>>) -> Vec<String> {
    let next_list: Vec<Rc<RefCell<TreeNode>>> = node_list
        .iter()
        .flat_map(|x| x.borrow().children())
        .collect();

    let values = node_list
        .iter()
        .map(|x| x.borrow().to_owned().val)
        .collect();

    if next_list.is_empty() {
        values
    } else {
        let mut current = values;
        let mut children = _bfs_traverse(next_list);
        current.append(&mut children);
        current
    }
}
```

イメージとしては，木構造を横にスライスして，上から順に値を結果に格納していくイメージです．

```
        A         <- 1階層目 values = [A] next_list = [B, C]
    B       C     <- 2階層目 values = [B, C] next_list [D, E, F] 
  D   E       F   <- 3階層目 ...
 G H   I     J K  <- 4階層目 ..
``` 

ここで，TreeNode に対して子要素を Vec で取得するメソッドを追加しています．
```rust
impl TreeNode {
    pub fn children(&self) -> Vec<Rc<RefCell<TreeNode>>> {
        [self.left.as_ref(), self.right.as_ref()]
            .iter()
            .flat_map(|x| *x)
            .map(|x| Rc::clone(x))
            .collect()
    }
}
```

呼び出し側は以下のような感じです．

```rust
fn main() {
    println!("bfs: {:?}", bfs(Some(create_tree_node())));
}
```

実行すると以下のようになります．

```
bfs: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]
```


## まとめ

今回は幅優先探索についてまとめましたが，こういったベーシックなアルゴリズムを実装すると，Rust の借用などのルールについてちゃんと理解しないとなかなか苦労するなという感触が得られたのが面白かったです．

API Server を Rust で実装している分にはあまり借用規則などを意識しなくてもかけてしまうなと思います．

素振り的な感じで，こういったコーディングも定期的にやっていきたいともいます．（その点 LeetCode などよさそうだなぁと）
