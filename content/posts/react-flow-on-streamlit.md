+++
title="Streamlit で react-flow を使用したい"
date="2024-01-21T20:27:16+09:00"
categories = ["engineering"]
tags = ["streamlit", "python", "react", "react-flow"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

{{< exlink href="https://reactflow.dev/" text="react-flow" >}} という Node ベースのグラフ UI を作成するためのライブラリがあるのですが、
Data の Lineage などを表示するのに便利そうだなと思いました。

Streamlit 上から、これを呼び出せたら便利だなーと思って調べていたのでメモです。

## Streamlit と React Flow を連携させる

Streamlit 上で React Flow を描画しようとした際に、Streamlit も Front 側 React だから、連携できるかなーと調べていたのですが、streamlit-react-flow という Wrapper を実装されている方がいて、利用できそうでした。

- {{< exlink href="https://github.com/rajagurunath/streamlit-react-flow" >}}

公式に書いてあるとおり、以下のような記述で streamlit 上に react flow の node を描画することができました。

```python
from streamlit_react_flow import react_flow
import streamlit as st

def main():
    st.title("React-Flow Test")

    st.subheader("Friends Graph")

    elements = [
        { "id": '1', "data": { "label": 'Guru'  }, "type":"input","style": { "background": '#ffcc50', "width": 100 },

            "position": { "x": 100, "y": 100 } },
        { "id": '2', "data": { "label": 'Achyuth' },"position": { "x": 300, "y": 100 }},
        { "id": 'e1-2', "source": '1', "target": '2', "animated": True },
    ]

    elements.extend([{"id":i+3,"data":{"label":name },"type":"output","position": { "x": 170*i, "y": 300+i }} for i,name in enumerate(["Aravind","Manoj","Velmurugan","sridhar"])])
    elements.extend([{"id":f"e{i}-{j}","source":i,"target":j} for i,j in [(1,3),(1,4),(1,5),(1,6)]])
    flowStyles = { "height": 500,"width":1100 }


    react_flow("friends",elements=elements,flow_styles=flowStyles)

if __name__ == '__main__':
    main()
```

`streamlit-react-flow` でできなさそうなこともありそうで、node の click などのイベントを Listen して、Python側の処理を呼ぶみたいなことはできなさそうなので、このあたりをやりたい場合は、fork するか streamlit のComponents API で実装していく必要がありそうです。

- {{< exlink href="https://docs.streamlit.io/library/components/components-api" >}}

## まとめ

今回は、Streamlit と React Flow の連携について書きました。
できなさそうなことも一部ありそうなのですが、自分で実装していけばある程度動きそうです。

Streamlit は便利なコンポーネントがたくさん用意されているのに加えて、React のライブラリの Wrapper を用意してあげることで動かせそうなのが汎用性高くていいなと思いました。
