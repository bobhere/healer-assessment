#!/bin/bash

cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "首次运行，正在安装依赖..."
  npm install --no-progress
fi

echo "启动本地预览服务（按 Ctrl+C 退出）"
npm run preview
