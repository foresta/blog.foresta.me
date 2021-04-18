#!/bin/bash

DIR=$(cd $(dirname $0);pwd)
cd $DIR

source ./.env

# build
npm run webpack
hugo

# deploy
echo "deploying to s3 buckets";
echo $S3_BUCKET;

aws s3 sync --delete ./public s3://$S3_BUCKET --profile $AWS_PROFILE

# invalidate cache
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*" --profile $AWS_PROFILE
