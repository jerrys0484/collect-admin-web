#!/bin/bash

set -e

cd collect-admin-web >> deploy.log

# 执行备份
TIMESTAMP=$(date +%Y%m%d%H%M%S)
mv prod "prod-$TIMESTAMP"
# 替换生产环境
mv dist prod

echo "部署完成于 $(date)" >> deploy.log
