+++
title="ブログをさくらVPSからS3+CloudFrontに移行した"
date="2021-04-18T17:13:10+09:00"
categories = ["engineering"]
tags = ["blog", "aws", "s3", "cloudfront", "lambda"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，さくらVPSでホスティングしていたこのブログを S3 + CloudFront でホスティングするように移行したのでやったことをメモしておきます．


## やったこと

- S3 にバケットを作成
- CloudFront でキャッシュ設定
- CloudFront で エラーの 404 を返すように設定
- Lambda@Edge でDefault Rootの設定
- ACMでSSL証明書を作成し，CloudFront に設定
- お名前.com で cloudfront の URL を設定

### S3 にバケットを作成

ブログ用の backet を作成しました．後の工程で CloudFront 以外からのアクセスは許可しない設定にしますがここではパブリック・アクセスをすべて許可する設定にします．

{{< figure src="/images/posts/migrate_blog_to_aws/s3_access.png" >}}

バケットを作成したら ローカルで hugo でビルドして後デプロイして動作確認をします．

```bash
# build
$ hugo

# deploy
$ s3 sync --delete ./public s3://BUCKET_NAME
```

以下のようなURLにアクセスしてページが表示されることを確認します．

`https://s3-ap-northeast-1.amazonaws.com/BUCKET_NAME/index.html`


### CloudFront でキャッシュ設定

S3 にデプロイが確認できたら，CloudFrontの設定をします．

基本的には以下の記事の `CloudFront で公開` のセクションのとおりに行いました．

{{< exlink href="https://dev.classmethod.jp/articles/cloudfront-s3-customdomain/" >}}

※この段階では独自ドメインの章はやってません．


また，前述しましたが，S3を公開設定にしているので CloudFront 側でS3のバケットへのアクセスを制限するために以下のように `Restrict Bucket Access` を `Yes` に設定をします．

{{< figure src="/images/posts/migrate_blog_to_aws/cloudfront-restrict-bucket-access.png" >}}

最終的には，以下のようなアクセスポリシーになります．

`{DISTRIBUTION_ID}` や `{BUCKET_NAME}` は適宜読み替えてください．
```json
{
    "Version": "2012-10-17",
    "Id": "Policy11111111111111",
    "Statement": [
        {
            "Sid": "1",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity {DISTRIBUTION_ID}"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::{BUCKET_NAME}/*"
        }
    ]
}
```



ここまで行うと，以下のようなURLにアクセスでアクセスできるようになります．

`https://xxxxxxxxxxxxxx.cloudfront.net/index.html`

x の部分は，CloudFrontのDistributionを作成した際に自動で振られるものになります．

また，先程まではできていた，S3 の公開URLでアクセスできないようになっているはずです．

### CloudFront で エラーの 404 を返すように設定

この時点で記事は見ることが出来ますが，ホスティングをS3にしたので，存在しないURLにアクセスされると，S3 の 403 画面が表示されてしまいます．

これを回避するためにカスタムの 404.html を用意してそちらにルーティングするような設定を CloudFront で行いました．

Distribution のページから，`Error Pages` タブを開いて，`Create Custom Error Response` ボタンを押して以下のような設定を行います．

{{< figure src="/images/posts/migrate_blog_to_aws/cloudfront-error-page.png" >}}


404.html 自体は，hugo の `/layouts` ディレクトリの直下に作成し，hugo コマンドでビルドすることで public ディレクトリ下に生成できます．

### Lambda@Edge でDefault Rootの設定

もう一つ問題がありました．

それは，`https://blog.foresta.me/posts/read-soft-skills-ch-1/` のようなURLが 404 になってしまうことです．

web サーバーなどを使っていれば，上記のURLは自動で `https://blog.foresta.me/posts/read-soft-skills-ch-1/index.html` などにアクセスするようになりますが，S3 と CloudFront のままでは，このような処理は行なえません．

そのため，Lambda@Edge を用いて変換する処理を書きました．

変換は以下のように，
- スラッシュ終わりだったら，`index.html` を付ける
- 拡張子おわりだったら，なにもしない
- 上記以外で文字列で終わってたら `/index.html` をつける

|before|after|
| ----- | ----- |
| `/posts/hoge/` | `/posts/hoge/index.html` |
| `/posts/hoge` | `/posts/hoge/index.html` |
| `/posts/hoge.html` | `/posts/hoge/hoge.html` |


このあたりは以下の記事が参考になりました．

{{< exlink href="https://oji-cloud.net/2021/01/06/post-5915/" >}}

コードは最終的に以下のようになりました．

```javascript
'use strict';
const { URL } = require('url');

exports.handler = (event, context, callback) => {
    
    // Extract the request from the CloudFront event that is sent to Lambda@Edge 
    var request = event.Records[0].cf.request;

    // Extract the URI from the request
    var olduri = request.uri;

    var newuri = olduri
    // Not Exists file extensions and last char is not '/''
    if (newuri.split('.').length == 1 && newuri.slice(-1) != '/') {
        newuri += '/';
    }
    // Match any '/' that occurs at the end of a URI. Replace it with a default index
    newuri = newuri.replace(/\/$/, '\/index.html');

    // Log the URI as received by CloudFront and the new URI to be used to fetch from origin
    console.log("Old URI: " + olduri);
    console.log("New URI: " + newuri);
    
    // Replace the received URI with the URI that includes the index page
    request.uri = newuri;
    
    // Return to CloudFront
    return callback(null, request);

};
```

Lambda@Edge を使う際の注意点としては以下の点がありますので気をつけてください

- 2021-04現在，東京リージョンにはないので `バージニア北部 (a-east-1)` などを指定する
- Node.js のバージョンは，12.x までしか対応されてない


### ACMでSSL証明書を作成し，CloudFront に設定

上記までで，ブログページとしての機能は一通り実装できたので，ドメインを移行していく処理を行います．

まずは，AWSの ACM で SSL 証明書を作成します．

`証明書の作成`，`CloudFront` の設定変更までは下記のサイトの通りに行いました．

{{< exlink href="https://dev.classmethod.jp/articles/cloudfront-s3-customdomain/" >}}


### お名前.com で cloudfront の URL を設定

最後に `blog.foresta.me` を さくらVPSから AWS に向ける設定を行いました．

Route53 を使う方法もありますが，自分の場合は お名前.com の DNSレコード設定から，いままで Aレコードで設定していたものを，CNAMEレコードに修正し，cloudfront のドメイン URL を指定するように変更しました．

しばらく待つと，無事反映されたことが確認できました．


## まとめ

今回はブログの移行を行う際にやったことを備忘録としてメモしました．

Lambda@Edge など触ったことがなかった技術などもたくさん調べながら行ったのでいかに参考にしたサイトを貼っておきますので，是非参考にしてみてください．

### 参考

- {{< exlink href="https://aimstogeek.hatenablog.com/entry/2018/07/23/135032" text="【AWS CloudFront + S3】「404 NotFound」を表示させる方法" >}}
- {{< exlink href="https://aws.amazon.com/jp/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/" text="Implementing Default Directory Indexes in Amazon S3-backed Amazon CloudFront Origins Using Lambda@Edge" >}}
- {{< exlink href="https://oji-cloud.net/2021/01/06/post-5915/" text="Lambda@EdgeによるCloudFront+S3 のDefault Object設定">}}
- {{< exlink href="https://www.aruse.net/entry/2018/10/07/234826" text="Amazon S3+お名前.comで独自ドメインのサイトを無料でHTTPS化する方法" >}}
- {{< exlink href="https://dev.classmethod.jp/articles/tsnote-cloudfront-s3-notexistobject-403-001/" text="オリジンを S3 とした CloudFront に対して、存在しないオブジェクトへアクセスした際の HTTP ステータスコードが 403 Forbidden になったときの対処方法" >}}
- {{< exlink href="https://dev.classmethod.jp/articles/cloudfront-s3-customdomain/" text="CloudFront+S3に独自ドメインと証明書を添えて" >}}
- {{< exlink href="https://zoo200.net/cloudfront-ssl-original-domain/" text="CloudFrontでお名前.comの独自ドメインおよびSSL証明書を使用する" >}}
- {{< exlink href="https://blog.mmmcorp.co.jp/blog/2020/04/03/url_normalization_of_s3_website_with_lambda_at_edge/" text="静的ウェブサイトホスティングにおけるURL正規化のリダイレクトの実施" >}}
