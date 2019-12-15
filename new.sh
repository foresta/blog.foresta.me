#!/bin/bash

# deploy.shが置いてあるディレクトリへ移動
DIR=$(cd $(dirname $0);pwd)
cd $DIR

hugo new posts/$1.md --editor nvim
