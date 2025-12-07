#!/bin/bash
set -e
# 执行备份
TIMESTAMP=$(date +%Y%m%d%H%M%S)
mv prod "prod-$TIMESTAMP"
# 替换生产环境
tar -xzf dist.tar.gz prod
echo "部署完成于 $(date)" >> deploy.log
