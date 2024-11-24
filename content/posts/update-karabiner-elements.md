+++
title="Karabiner-Elements のアップデートで動作しなくなった時の確認項目"
date="2024-11-24T20:30:57+09:00"
categories = ["engineering"]
tags = ["karabiner-elements", "mac"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

先日、Karabiner-Elements のアップデートを行ったところ動作しなくなりました。最終的に確認して動作するようになった項目をメモしておきます。


## 確認項目

私がアップデートした際はログイン項目のチェックが外れていたことが原因でした。

### ログイン項目

システム環境設定 > 一般 > ログイン項目 にある バックグラウンドでの実行を許可の項目にチェックが入っているか確認します。

{{< figure src="/images/posts/update-karabiner-elements/login-items.png" >}}

### プライバシーとセキュリティ

システム環境設定 > プライバシーとセキュリティ の中の各項目で Karabiner-Elements に許可がなされているかを確認します。


#### フルディスクアクセス

{{< figure src="/images/posts/update-karabiner-elements/full-disk-access.png" >}}


#### 入力監視

{{< figure src="/images/posts/update-karabiner-elements/input-monitoring.png" >}}


## まとめ

今回は Karabiner-Elements のアップデート時に動作しなくなった際の確認項目をメモしました。ログイン項目のチェックが外れていたり、プライバシーとセキュリティの設定がされていないことが原因であることが多いので、まずはこれらの項目を確認すると良いかと思います。

動かなくなった時30分ほど原因調査に時間を取られてしまったので、この記事が他の方の参考になれば幸いです。
