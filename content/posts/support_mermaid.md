+++
date = "2019-06-02"
title = "図形の描画にmermaidを導入した"

categories = ["engineering"]
tags = ["mermaid", "blog"]

draft=true
+++



{{< mermaid >}}
graph TD;
    A-->B;
{{< /mermaid >}}



{{< mermaid >}}
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
{{< /mermaid >}}

