#! /bin/bash

echo STEP-1: 打包
webpack --optimize-minimize

echo STEP-2: 导出代码到指定目录
mkdir -p mydir
cp -R dist img mydir/

echo STEP-3: 导出 html 文件

(cd views; find . -name "*.html") |
    while read fullname
    do
        path=$(dirname $fullname)
        mkdir -p mydir/views/$path
        cp views/$fullname mydir/views/$fullname
    done
