#!/bin/bash
set -e
# 先判断目录是否存在
if [ -d "prod" ]; then
    TIMESTAMP=$(date +%Y%m%d%H%M%S)
    mv prod "prod-$TIMESTAMP"
    echo "已备份: prod-$TIMESTAMP"
fi
# 替换生产环境
mkdir -p prod
tar -xzf dist.tar.gz -C prod
rm -f dist.tar.gz
echo "部署完成于 $(date)" >> deploy.log
