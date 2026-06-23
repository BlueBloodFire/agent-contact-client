#!/bin/bash
# 构建 React 前端并复制到后端 nginx/html 目录
# 在 ai-agent-contact-client/ 目录下执行：bash deploy.sh

set -e

echo ">>> 构建 React 前端..."
npm run build

echo ">>> 清空旧的 nginx/html..."
rm -rf ../ai-agent-contact/docs/dev-ops/nginx/html/*

echo ">>> 复制构建产物..."
cp -r dist/* ../ai-agent-contact/docs/dev-ops/nginx/html/

echo ">>> 完成！重启 nginx 容器使其生效："
echo "    docker-compose -f ../ai-agent-contact/docs/dev-ops/docker-compose-app.yml restart nginx"
