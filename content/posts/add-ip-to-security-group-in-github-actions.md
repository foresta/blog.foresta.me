+++
title="Github Actions から AWS の Security Group に Public IPを追加する"
date="2020-11-23T00:31:09+09:00"
categories = ["engineering"]
tags = ["github", "github-actions", "aws", "security-group", "e2e", "e2e-test", "test"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

E2E Test を Github Actions で実行する際に，VPN 内にある API Server にアクセスする必要があったのですが，Security Group に Github Actions の Public IP を追加する方法でうまく動かすことが出来たので今回はそのことについてまとめます．


## 背景とか

Web Client 側の E2E テストを実施するにあたり，API Server に接続する必要があったのですが，開発環境の API Server は VPN 内からのみアクセスできるようになっていました．

そのため，Github Actions から API Server にアクセスすることが出来ず E2E テストが失敗していました．

E2E Test 時のみ アクセスすることができるように，Security Group に Github Actions の Public IP を追加する対応をしました．

##  実現方法

以下のような yaml で Security Group に Github Actions の Public IPを追加することができました.

```yaml
name: E2E Test with Cypress (Node.js 13.x) 

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  e2e:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [13.x]
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - name: Install AWS CLI
      run: |
        # Install AWS CLI
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        aws --version
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1
          role-to-assume: ${{ secrets.IAM_ROLE }}
          role-duration-seconds: 1800
          role-skip-session-tagging: true

    - name: Add IP Address
      env:
          SECURITY_GROUP_ID: ${{ secrets.SECURITY_GROUP_ID }}   
      run: |
        # Public IP (Github Actions)
        IP_ADDRESS=`curl ifconfig.io`

        # Add IP Address to Security Group Ingress
        aws ec2 authorize-security-group-ingress --group-id ${SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr "$IP_ADDRESS"/32

    - name: E2E Test
      uses: cypress-io/github-action@v2
      with:
          build: npm run build:e2e
          start: npm run start:e2e
          wait-on: 'http://localhost:3000'
          wait-on-timeout: 120
          record: true
      env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - name: Remove IP Address
      env:
          SECURITY_GROUP_ID: ${{ secrets.SECURITY_GROUP_ID }}   
      if: ${{ always() }}
      run: |
        # Public IP (Github Actions)
        IP_ADDRESS=`curl ifconfig.io`

        # Remove IP Address 
        aws ec2 revoke-security-group-ingress --group-id ${SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr "$IP_ADDRESS"/32
```

各ステップごとに簡単に説明します．

### AWS CLI の準備

Security Group に IP アドレスを追加するために AWS CLI を使用するため，その準備をします．

```yml
    - name: Install AWS CLI
      run: |
        # Install AWS CLI
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        aws --version
 
```

### AWS の Credential の設定

AWS の Credential の設定を行います．AWSの公式の， {{< exlink href="https://github.com/marketplace/actions/configure-aws-credentials-action-for-github-actions" text="aws-actions/configure-aws-credentials@1" >}} を使用しました．

```yml
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1
          role-to-assume: ${{ secrets.IAM_ROLE }}
          role-duration-seconds: 1800
          role-skip-session-tagging: true
```

今回は，AssumeRole も必要だったので，その設定も行っています．IAM Role もGithub の Secrets に設定しています．

### IP Address の追加

AWS CLI で Security Group に Github Actions の Public IPを指定します．

```yml
      env:
          SECURITY_GROUP_ID: ${{ secrets.SECURITY_GROUP_ID }}   
      run: |
        # Public IP (Github Actions)
        IP_ADDRESS=`curl ifconfig.io`

        # Add IP Address to Security Group Ingress
        aws ec2 authorize-security-group-ingress --group-id ${SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr "$IP_ADDRESS"/32        
```

Public IPは，以下のように取得することが出来ます．

```bash
$ curl ifconfig.io
```

security group に IP を追加するのには，AWS CLI の athorize-security-group-ingress を使用します．

ドキュメントは {{< exlink href="https://docs.aws.amazon.com/cli/latest/reference/ec2/authorize-security-group-ingress.html" text="こちら" >}}


### IP Address の削除

追加時と同様に，AWS CLIを用いて IPを削除します．

```yml
    - name: Remove IP Address
      env:
          SECURITY_GROUP_ID: ${{ secrets.SECURITY_GROUP_ID }}   
      if: ${{ always() }}
      run: |
        # Public IP (Github Actions)
        IP_ADDRESS=`curl ifconfig.io`

        # Remove IP Address 
        aws ec2 revoke-security-group-ingress --group-id ${SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr "$IP_ADDRESS"/32        
```

securty group から IPアドレスを削除するには，AWS CLI の revoke-security-group-ingress を使用します．

ドキュメントは {{< exlink href="https://docs.aws.amazon.com/ja_jp/cli/latest/reference/ec2/revoke-security-group-ingress.html" text="こちら">}}

削除時に注意が必要な点としては，例えばE2E Test が失敗したときに，そこで Github Actions の実行が終了してしまうと，一時的にあけた IP が開きっぱなしになってしまいます．

github actions では， `if: ${{ always() }}` を指定することで，失敗時も常に実行するように指定することが出来ます．

詳しくは，{{< exlink href="https://docs.github.com/ja/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#%E3%82%B8%E3%83%A7%E3%83%96%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9%E3%81%AE%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E9%96%A2%E6%95%B0" text="ジョブステータスのチェック関数" >}} を参照してみてください．

## まとめ

今回は，Github Actions 上で一時的に IP を Security Group に追加する方法についてまとめました．

Cypress の E2E テストを導入する際にもっともつまづいたのがここでしたが，なんとか無事テストが実行できるように設定をすることが出来ました．
CIまわりの設定は，面倒なことも多いですが意外とたのしい作業だと思いました．

