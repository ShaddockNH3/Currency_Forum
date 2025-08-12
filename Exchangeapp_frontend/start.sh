#!/bin/bash

# 蓝鼠兑换前端启动脚本

echo "🚀 启动蓝鼠兑换前端应用..."

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
fi

echo "🌐 启动开发服务器..."
echo "前端地址: http://localhost:5173"
echo "后端API: http://localhost:3000/api"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev
