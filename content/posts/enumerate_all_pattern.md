+++
title = "C++で順列を全パターンを列挙する"
thumbnail = ""
tags = ["c++", "atcoder", "競プロ"]
categories = ["engineering"]
date = "2019-11-17"
+++

こんにちは、[@kz_morita](https://twitter.com/kz_morita)です。\
最近はサーバーサイドエンジニアとして、久しぶりに DB の設計やサーバーの API を実装したりしています。直近 2,3 年はずっとスマホアプリのクライアント側のエンジニアをしていたのでとても新鮮な気分です。

また、プライベートでは競技プログラミングに取り組んでいます。
今回のその中で勉強になった順列を全列挙する方法について簡単に紹介します。C++ を用いてこんなにシンプルに実装できるとは思いませんでした。

## 順列とは

今回実現したいのは、`{ 0, 1, 2, 3, 4 }` のような列が与えられた時に以下のような全ての並び方を列挙することです。

```
0 1 2 3 4
0 1 2 3 4
0 1 2 4 3
0 1 3 2 4
0 1 3 4 2
0 1 4 2 3
0 1 4 3 2
0 2 1 3 4
...
..
.
4 3 2 1 0
```

与えられる列が、固定であれば純粋に要素分ループすればよいのですが、(上記の例だと 5 重ループすればよい)\
可変長の列に対して順列をもとめるとなるとループの階層自体が可変なためその方式では実装することができません。

## next_permutation で全列挙する

C++に用意されている `next_permutation` を用いると簡潔に全列挙をすることができます。

以下にサンプルコードを記載します。

```c++
#include <iostream>
#include <vector>

using namespace std;

void printVector(const vector<int>& vec) {
    for (int value : vec) {
        cout << value << " ";
    }
    cout << endl;
}

int main() {
    vector<int> nums { 0, 1, 2, 3, 4 };
    do {
        printVector(nums);
    } while (next_permutation(nums.begin(), nums.end()));

    return 0;
}
```

注目して欲しいのが、以下の箇所です。

```c++
    do {
        printVector(nums);
    } while (next_permutation(nums.begin(), nums.end()));

```

next_permutation を Call することにより、nums 自信が並び替えられた状態になります。\
この並び替えられた nums を `printVector` でコンソールに表示するように実装してみると以下のように期待していた結果が得られます。

```
0 1 2 3 4
0 1 2 4 3
0 1 3 2 4
0 1 3 4 2
0 1 4 2 3
0 1 4 3 2
0 2 1 3 4
...
..
.
4 3 2 1 0
```

また、 `{ 0, 1, 2, 3, 4 }` のような 0~4 の数値列を作りたい場合には、以下のように実装することができます。

```c++
    vector<int> nums(5);
    iota(nums.begin(), nums.end(), 0);
```

上記を使って書き直すと以下のようなサンプルコードになります。

```c++
#include <iostream>
#include <vector>
#include <numeric>

using namespace std;


void printVector(const vector<int>& vec) {
    for (int value : vec) {
        cout << value << " ";
    }
    cout << endl;
}


int main() {

    vector<int> nums(5);
    iota(nums.begin(), nums.end(), 0);

    do {
        printVector(nums);
    } while (next_permutation(nums.begin(), nums.end()));


    return 0;
}
```

上記のコードをつかえば、任意の N 個の組み合わせを列挙することが可能になります。

## まとめ

順列の全列挙をしたい場合に、`next_permutation` を使用すると、とても簡潔に実装することができました。

以下にリファレンスや、`next_permutation` 自体の実装例などもあるので、参考にしてみると良いかと思いました。
https://cpprefjp.github.io/reference/algorithm/next_permutation.html
