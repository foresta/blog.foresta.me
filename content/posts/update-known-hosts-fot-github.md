+++
title="GitHub の SSH Host キーの置き換えに伴う対応メモ"
date="2023-04-02T19:33:38+09:00"
categories = ["engineering"]
tags = ["github", "ssh"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，3/24 に GitHub により RSA SSH ホストキーが更新された際の対応をメモしておきます．

## GitHub による対応について

詳しくは，GitHub 公式から blog がだされています．

-   {{< exlink href="https://github.blog/2023-03-23-we-updated-our-rsa-ssh-host-key/" >}}

GitHub 上のセキュリティ観点から，RSA SSH Host キーが更新されたために，GitHub にアクセスしている Client 側で作業をする必要があるとのことでした．

結果として，以下のようなエラーが出るようになっています．

(↓ は github の公式ブログから引用しています．)

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@ WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED! @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the RSA key sent by the remote host is
SHA256:uNiVztksCsDhcc0u9e8BujQXVUpKZIDTMczCvj3tD2s.
Please contact your system administrator.
Add correct host key in ~/.ssh/known_hosts to get rid of this message.
Host key for github.com has changed and you have requested strict checking.
Host key verification failed.
```

## やったことメモ

公式によるブログにて対応内容が書かれてます．

結論からいうと以下のコマンドを実行すればよさそうでした．

```bash
$ ssh-keygen -R github.com
$ curl -L https://api.github.com/meta | jq -r '.ssh_keys | .[]' | sed -e 's/^/github.com /' >> ~/.ssh/known_hosts
```

対応内容的には，known_hosts から github.com に関する部分を削除すればよさそうです．

1 つめの以下のコマンドは，known_hosts をバックアップを取った後に，github.com に関する部分を削除してくれるコマンドになります．

```bash
$ ssh-keygen -R github.com
```

これを実行すると，`~/.ssh` 以下に，`known_hosts.old` というファイル名でバックアップがとられ github.com に関する記述が，`known_hosts` から削除されます．

直接編集しても良いですが，この方法が安全そうです．

2 つめのコマンドは，github.com から ssh_key の情報を API で取ってきて，それを known_hosts に書き込む内容です．

## 対応後も warning がでた場合

上記の対応をしたあとも自分の環境だと warning が出ました．

```
Warning: the ECDSA host key for 'github.com' differs from the key for the IP address '20.27.177.113'
Offending key for IP in /home/username/.ssh/known_hosts:6
Matching host key in /home/username/.ssh/known_hosts:7
Are you sure you want to continue connecting (yes/no)?
```

おそらく，他に github.com に関する known_hosts の設定があったのですが，ファイルを見ただけだとどれがそれに値するかがわかりませんでした．

そのため，known_hosts ファイルを一度削除 (別名にして backup) して known_hosts がない状態にして再度 git コマンドを実行しました．
すると，known_hosts ファイルが自動で作成されて以降正常に動くようになりました．

自分の環境だと，ssh 接続しているのが github くらいだったので削除してしまいました．

## まとめ

今回は，github の ssh host key の更新に伴って実際に対応した内容をメモしました．

`ssh-keygen -R` コマンドなどこの機会に調べてためになりました．
