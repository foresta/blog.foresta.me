+++
title="ブログをAWS の CodePipeline でデプロイする"
date="2021-07-23T02:03:31+09:00"
categories = ["engineering"]
tags = ["aws", "blog", "codepipeline", "codedeploy", "infra", "hugo"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

このブログは S3 + CloudFront の環境に移行してからはローカルで deploy スクリプトを叩く方式をとっていました。
今回 AWS の CodePipeline を用いてデプロイのフローを構築したので手順などをまとめます。

## 最終的な成果物

最終的には、以下のようなパイプラインを作成しました。

- GitHub からソースコードを取得
- ソースコードをビルド
- コードを S3 にデプロイ
- CloudFront の Cache を Invalidate

{{< figure src="/images/posts/blog-deploy-pipeline/pipeline.png" >}}

## CodePipeline とは

AWS の CodePipeline はパイプラインを作成しソースコードの変更があったときに、ビルドしたりテストしたりデプロイしたりといったフェーズを定義でき、そのフローを自動化することができる AWS のマネージドサービスになります。

このブログでも採用していますが、GitHub の master ブランチにマージ (push) された時に自動でソースコードを取得、ビルド、デプロイをするといったパイプラインが比較的簡単に作成できるのでとても便利です。

具体的な説明は公式サイトを確認してみてください。

{{< exlink href="https://aws.amazon.com/jp/codepipeline/" >}}

## Pipeline を CDK で構築する

今回は デプロイのフローを AWS 上に構築するために aws-cdk を用いました。

cdk は、AWS の各種リソースを ソースコードで記述することができるものです。
TypeScript などで記載できバージョン管理なども行えます。（IaC: Infrastructure as Code というやつです）

今回は cdk 自体の解説は行わず、すでに環境が整っている前提とさせてください。

それでは、早速 コードを書いていきます。

全体のディレクトリ構成は以下のようになっています。
```
.
├── README.md
├── bin
│   └── cdk-sample.ts
├── cdk.json
├── jest.config.js
├── lib
│   └── pipeline-stack.ts
├── package-lock.json
├── package.json
├── src
│   └── cache-invalidation-lambda
│       └── lambda_function.py
├── test/
└── tsconfig.json
```

この中で、`bin/cdk-sample.ts` が Entry のファイルで、pipeline の構築は、`lib/pipeline-stack.ts`、CDN の Invalidate は、`src/cache-invalidation-lambda/lambda_function.py` の中で行っています。

それぞれについて説明していきます。

### bin/cdk-sample.ts

このファイルは最初に呼ばれるファイルで、ここでは PipelineStack を new しているだけです。

pipeline 内で使用するデータは props で渡していきます。

```ts
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PipelineStack } from '../lib/pipeline-stack';

const pipelineProps = { /* ... */ };

const app = new cdk.App();
new PipelineStack(app, 'BlogDeployPipelineStack', pipelineProps);
```

### lib/pipeline-stack.ts

このファイルの中に、実際にパイプラインの構築をするコードを書いていきます。全体でそれなりの行数があるので個別に説明していきます

まずは、クラスの全体感と必要なライブラリについてです。目的のパイプラインを使用するのに以下のライブラリを使用しました。それぞれ `npm install` する必要があります。

```ts
import * as cdk from '@aws-cdk/core';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as ssm from '@aws-cdk/aws-ssm';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';

export interface PipelineProps extends cdk.StackProps [
    // ...
}

export class PipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: PipelineProps) {
        super(scope, id, props);

        // 実際のパイプライン構築処理
    }
}
```


次に、実際にパイプラインを作成するコードを記載します。

`codepipeline.Pipeline` クラスを new することでパイプラインが作成されます。

stages にパイプラインの各ステージに対応したアクションを書いていきます。

```ts
    // create pipeline
    new codepipeline.Pipeline(
      this,
      'BlogPipeline',
      {
        pipelineName: 'blog-deploy-pipeline',
        stages: [
          {
            stageName: 'Source',
            actions: [sourceAction],
          },
          {
            stageName: 'Build',
            actions: [buildAction],
          },
          {
            stageName: 'Deploy',
            actions: [deployAction],
          },
          {
            stageName: 'Invalidate',
            actions: [invalidateAction],
          },
        ]
      }
```

上記の通り、`Source`、`Build`、`Deploy`、`Invalidate` の4ステージからなるパイプラインになります。
順に説明していきます。

#### Source 

Source でやることは、GitHub から最新のソースコードを指定して取得することです。

`codepipeline_actions.GitHubSourceAction` を使用し、リポジトリ名、リポジトリのオーナー名、対象のブランチなどを指定します。

GitHub にアクセスするための Token は、GitHub上で取得しあらかじめ AWS のパラメータストアに保存して cdk のなかで取得するようにしました。

Token は、GitHub の `ログインアイコン > Settings > Developer settings > Personal access tokens` から発行することができます。


```ts
    // source
    const sourceOutput = new codepipeline.Artifact('SourceArtifact');
    const githubToken = ssm.StringParameter.valueForStringParameter(this, '/blog/github-oauth-token');

    const sourceAction = new codepipeline_actions.GitHubSourceAction ({
      actionName: 'GitHubSource',
      owner: props.repositoryOwner,
      repo: props.repositoryName,
      branch: branch,
      oauthToken: cdk.SecretValue.plainText(githubToken),
      trigger: codepipeline_actions.GitHubTrigger.POLL,
      output: sourceOutput,
    });
```

#### Build

Build では、Source ステージで取得したソースコードをビルドします。

codebuild を用いてプロジェクトをビルドします。詳細のビルドスクリプトに関しては ソースコード側のリポジトリに、`code-pipeline/buildspec.yml` という名前で保存しています。

ビルドした成果物 (Artifact) は、S3 に保存されるためアクセスするための iam Role も作成しておきます。

```ts
    // build
    new iam.Role(this, 'BlogDeployS3AccessRole', {
      roleName: 'blog-s3-access-for-build',
      assumedBy: new iam.AccountPrincipal(props.accountId),
      managedPolicies: [
        {
          managedPolicyArn: 'arn:aws:iam::aws:policy/AmazonS3FullAccess',
        }
      ]
    });

    const buildProject = new codebuild.PipelineProject(
      this,
      'BlogPipelineProject',
      {
        projectName: 'blog-build-project',
        environment: {
        },
        buildSpec: codebuild.BuildSpec.fromSourceFilename('code-pipeline/buildspec.yml')
      }
    );

    const buildArtifact = new codepipeline.Artifact('BuildArtifact');
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'blog-build',
      input: sourceOutput,
      outputs: [buildArtifact],
      project: buildProject,
    });
```

参考までに、buildspec.yml は以下のような感じです。

```yml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 14
    commands:
      - HUGO_VERSION=0.85.0
      - echo hugo version is ${HUGO_VERSION}
      - curl -Ls https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz -o /tmp/hugo.tar.gz
      - tar zxf /tmp/hugo.tar.gz -C /tmp
      - mv /tmp/hugo /usr/local/bin/hugo
      - rm -rf /tmp/hugo*
  build:
    commands:
      - npm ci 
      - npm run webpack
      - /usr/local/bin/hugo
artifacts:
  files:
    - '**/*'
  base-directory: 'public'
```

やっていることは単純で、以下のような感じです。

- Node.js 14 の環境を指定
- Hugo のインストール
- ライブラリのインストール (`npm ci`)
- Webpack ビルド
- Hugo ビルド

hugo コマンドで生成されるのは、public ディレクトリ以下なので、base-directory というプロパティに `public` と指定しています。

#### Deploy 

Deploy ステージでは、ビルドした成果物を S3 にアップロードしています。

`codepipeline_actions.S3DeployAction` クラスを使用しています。S3 のBucket はすでに作成済みの想定なため、`fromBucketName` メソッドを利用し参照しています。

input プロパティに、先ほどビルドした結果の、buildArtifact を渡します。

```ts
    const bucket = s3.Bucket.fromBucketName(this, 'blog-deploy-bucket', props.deployS3BucketName);
    const deployAction = new codepipeline_actions.S3DeployAction({
      actionName: 'blog-s3-deploy',
      bucket: bucket, 
      input: buildArtifact,
    });
```

#### Invalidate

Invalidate ステージでは、CloudFront の Invalidate を行っています。

Invalidate の処理自体は、Lambda から行うようにしました。

やっていることとしては、以下の3つです。

- lambda の実行Roleを作成
- lambda function の生成
- deploy action の生成

```ts
    const lambdaExecutionRole = new iam.Role(
      this,
      'CDNInvalidationLambdaExecutionRole',
      {
        roleName: 'cdn-invalidation-lambda-execution-role',
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
          new iam.ManagedPolicy(this, `TaskRolePolicy`, {
            managedPolicyName: 'lambda-cloudfront-create-invalidation-policy' ,
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['cloudfront:CreateInvalidation', 'cloudfront:GetInvalidation'],
                resources: [
                  `arn:aws:cloudfront::${props.accountId}:distribution/${props.cfDistributionId}`,
                ],
              })
            ]
          }) 
        ]
      }
    ); 

    const invalidationLambda = new lambda.Function(this, 'CDNInvalidationLambdaFunction', {
      functionName: 'cache-invalidation-lambda',
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.AssetCode.fromAsset('src/cache-invalidation-lambda'),
      handler: 'lambda_function.lambda_handler',
      role: lambdaExecutionRole,
      timeout: cdk.Duration.minutes(15),
    });


    const invalidateAction = new codepipeline_actions.LambdaInvokeAction({
      actionName: 'invalidate-lambda',
      lambda: invalidationLambda,
      userParameters: {
        PipelineName: pipelineName,
        DistributionId: props.cfDistributionId
      }
    });
```

lambda の実行Roleを作成では、lambda そもそもの実行権限や CloudFront にアクセスするための権限を与えています。

lambda function の生成では、`lambda.Function` クラスを用いて、lambda を生成しています。
ここでは、lambda 関数名、実行環境（今回は、python 3.8）、ソースコードのパスと実行するハンドラ関数名、タイムアウトなどを指定しました。
CloudFront の Invalidate が完了するまではある程度時間がかかるので、タイムアウトは伸ばしておいた方が良いでしょう。

deploy action の生成では、作成した lambda を指定して `codepipeline_actions.LambdaInvokeAction` を生成します。

後ほど紹介しますが、lambda 上で CloudFront の Invaidate を行う際に必要な、パイプライン名と、CloudFrontの DistributionId を Lambda にパラメータとして渡しています。

### src/cache-invalidation-lambda/lambda_function.py

この lambda function で CloudFront の Invalidation を作成します。

処理の流れは以下のようなイメージです。

- lambda が起動される
- パイプライン名、CloudFront DistributionId を event から取得
- CloudFront のキャッシュ削除 (Invalidation の作成)
- CodePipeline に処理が継続していることを伝えつつ結果を送信 (継続トークン)
- CodePipeline がLambda を自動で再実行
- （継続トークンにより再実行で呼ばれた判定ができる）
- CloudFrontのステータスを確認
- キャッシュ削除未完了なら、再び継続トークンを CodePipeline に伝える
- キャッシュ削除完了していたら、CodePipeline へ完了を通知する

ポイントは、CodePipeline に対して継続トークンを含んで結果を通知するとしばらくして Lambda が再実行される点だと思います。
これを利用し、CloudFront のキャッシュ削除が終了しているかどうかを監視することが可能になっています。

```python
import boto3
import json
import logging
import time

logger = logging.getLogger()
logger.setLevel(logging.INFO)

codepipeline = boto3.client('codepipeline')
cloudfront = boto3.client('cloudfront')

def create_invalidation(distribution_id): 
    logger.info('Creating invalidation')
    res = cloudfront.create_invalidation(
        DistributionId=distribution_id,
        InvalidationBatch={
        'Paths': {
            'Quantity': 1,
            'Items': ['/*'],
        },
        'CallerReference': str(time.time())
        }
    )

    invalidation_id = res['Invalidation']['Id']
    logger.info('Created invalidation: InvalidationId is %s', invalidation_id)
    return invalidation_id


def monitor_invalidation_state(distribution_id, invalidation_id):
    res = cloudfront.get_invalidation(
        DistributionId=distribution_id,
        Id=invalidation_id
    )

    return res['Invalidation']['Status']


def finish_job_success(job_id):
    logger.info('Putting job success')
    codepipeline.put_job_success_result(jobId=job_id)


def finish_job_failure(job_id, err):
    logger.error('Putting job failed')
    message = 'Exception: ' + str(err)
    codepipeline.put_job_failure_result(
        jobId=job_id,
        failureDetails={
            'type': 'JobFailed',
            'message': message
        }
    )


def continue_job_later(job_id, invalidation_id):
    continuation_token = json.dumps({'InvalidationId':invalidation_id})
    logger.info('Putting job continuation')

    codepipeline.put_job_success_result(
        jobId=job_id,
        continuationToken=continuation_token
    )


def get_user_params(job_data):
    try:
        user_parameters = job_data['actionConfiguration']['configuration']['UserParameters']
        decoded_parameters = json.loads(user_parameters)
            
    except Exception as e:
        raise Exception('UserParameters could not be decoded as JSON')
    
    return decoded_parameters


def lambda_handler(event, context):
    try:
        job_id = event['CodePipeline.job']['id']
        job_data = event['CodePipeline.job']['data']

        user_params = get_user_params(job_data)

        pipeline_name = user_params['PipelineName']
        distribution_id = user_params['DistributionId']

        if 'continuationToken' in  job_data:
            # 再実行されたときの処理
            continuation_token = json.loads(job_data['continuationToken'])
            invalidation_id = continuation_token['InvalidationId']
            logger.info('InvalidationId is %s', invalidation_id)
            status = monitor_invalidation_state(distribution_id, invalidation_id)
            logger.info("Invalidation status is %s", status)

            if not status == 'Completed':
                continue_job_later(job_id, invalidation_id)
            else:
                finish_job_success(job_id)

        else:
            # invalidation を作成して，後ほどこのlambdaを再実行
            invalidation_id = create_invalidation(distribution_id)
            continue_job_later(job_id, invalidation_id)

    except Exception as err:
        logger.error("Exception occurred: %s", err)
        finish_job_failure(job_id, err)

    logger.info('Complete.')
    return "Complete."
```

コード自体は、下記のサイトをかなり参考にさせていただきました。解説も詳しいのでぜひ参考にしてみてください。

{{< exlink href="https://dev.classmethod.jp/articles/cloudfront-invalidation-using-codepipeline-custom-action/" >}}

## まとめ

今回は、ブログのデプロイを CodePipeline を用いてデプロイする方法についてまとめました。aws-cdk を用いて構築しましたが、実際にコードを書いて構築できるのは個人的には楽だなと思います。（設定ファイルを書くよりも）

個人のプロダクトだとつい後回しにしてしまいがちな、CI/CD 周りですがあらかじめ整えておくと非常にスムーズに開発ができるので必要な作業だなと改めて実感しました。
