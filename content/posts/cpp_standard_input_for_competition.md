+++
title = "競技プログラミングのためのC++標準入力"
thumbnail = ""
tags = ["c++"]
categories = ["engineering"]
date = "2019-10-20"
+++

こんにちは、[@kz_morita](https://twitter.com/kz_morita)です。\
今回は競技プログラミング用に c++ での標準入力の受け取り方を簡単にまとめます。

## cin で入力を受け取る

c++で標準入力を受け取るには基本的に、 `std::cin` というものを使用します。

```cpp
#include <iostream>

using namespace std;

int main() {
    int N;
    cin >> N;

    cout << N << endl;
}
```

これで標準入力を N という変数で管理することができます。

## 複数の入力の場合

以下のような形式で２つの数値が入力として与えられるケースを考えます。

```
A B
```

この場合には、以下のようなコードで受け取ることが可能です。

```cpp
int A, B;
cin >> A >> B;
```

また、AtCoder などでよくあるのが、以下のような形式の入力です。

```
N
d1 d2 ... dN
```

この場合は以下のようにして受け取ることが可能です。

```cpp
#include <iostream>
using namespace std;

int main() {
    int N;
    cin >> N;
    int arr[N];
    for(int i { 0 }; i < N; ++i){
        cin >> arr[i];
    }
}
```

`std::vector` を用いたい場合は以下のようにすれば良いです・

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
    int N = 0;
	cin >> N;

    int d = 0;
	vector<int> D(N);
	for (int i { 0 }; i < N; ++i) {
		cin >> d;
		D.push_back(d);
	}
}
```

int 型 N 個分の vector D を用意して、ループの中で `push_back` を用いて vector に追加していく形です。

## まとめ

C++で標準入力を扱う一例について簡単に紹介しました。
C++で競技プログラミングを始めようとしているかたのお役にたてれば幸いです。
