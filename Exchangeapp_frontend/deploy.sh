#!/bin/bash

# 蓝鼠兑换前端部署脚本

echo "🚀 开始部署蓝鼠兑换前端应用..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm未安装，请先安装npm"
    exit 1
fi

echo "📦 安装依赖..."
npm install

echo "🔨 构建生产版本..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo "📁 生产文件已生成在 dist/ 目录"
    echo "🌐 可以使用以下命令预览："
    echo "   npm run preview"
    echo ""
    echo "📋 部署说明："
    echo "   1. 将 dist/ 目录上传到你的Web服务器"
    echo "   2. 配置服务器指向 dist/ 目录"
    echo "   3. 确保后端API地址配置正确"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
