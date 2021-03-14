+++
title="Rust で bit 全探索"
date="2021-03-14T14:01:33+09:00"
categories = ["engineering"]
tags = ["rust", "atcoder", "competitive-programming", "algorithm"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

最近また，競技プログラミングをちゃんとやろうと思い，まずは全探索からということで bit 全探索の問題を解いたりしていました．

- {{< exlink href="https://atcoder.jp/contests/abc128/tasks/abc128_c" text="C - Switches" >}}

今回は，Rust  で bit 全探索する方法についてまとめます．

## bit 全探索とは

bit 全探索は，全探索の一つで組み合わせを列挙するような用途に使用できます．

例えば { A, B, C, D } の文字列の部分集合を全探索するようなケースを考えます．

これは，二進数で，0000 ~ 1111 までの数値を考え，各桁のbit を { A, B, C, D } と対応付けると すべてのパターンを探索できるといった考え方です．

すなわち，{ A, B, C, D } からなるすべての部分集合を求めるには，0 ~ 31 (0 <= i < (1<<4)) まで数え上げれば良いことになります．

```
0000 => {}
0001 => { A }
0010 => { B }
0011 => { A, B }
0100 => { C }
0101 => { A, C }
...
..
.
1111 => { A, B, C, D }
```

## Rustでbit全探索の実装

以下に実装例を載せます．

```rust
fn main() {

    let list = vec!["A", "B", "C", "D"];
    let n = list.len() as i32;

    for bit in 0..(1 << n) {
        let sub_list = (0..n)
            .filter(|x| (bit & (1 << x)) != 0)
            .map(|x| list[x as usize]);

        // 表示
        sub_list.for_each(|x| {
            print!("{} ", x);
        });
        println!("");
    }
}
```

まず，以下の部分で 0 ~ 31 までのループを実装しています．
```rust
fn main() {

    // 0 ~ 1<<4 までのループ
    for bit in 0..(1 << n) {
    }
}
```

次に以下の箇所で，bit 列のどのbit が 1 にっているか (0 じゃないか) を確認しています．
filter と map を使って以下のようにスッキリかけます．

```rust
   let sub_list = (0..n)
       .filter(|x| (bit & (1 << x)) != 0)
       .map(|x| list[x as usize]);
```

これを実行すると以下のような結果が得られ，全探索出来てそうなことがわかります．

```
A
B
A B
C
A C
B C
A B C
D
A D
B D
A B D
C D
A C D
B C D
A B C D
```

## まとめ

今回は，Rust でbit全探索の実装方法をまとめました．
考え方はシンプルですが，しらないと思いつかない or 自力で頑張って実装してしましそうなのでこういうパターンを覚えて速く問題が解けるように精進していきます．


### 参考

- {{< exlink href="https://qiita.com/drken/items/7c6ff2aa4d8fce1c9361#6-bit-%E5%85%A8%E6%8E%A2%E7%B4%A2" >}}
