@echo off
chcp 65001 >nul
echo 🚀 启动蓝鼠兑换前端应用...

echo 📦 检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
)

echo 🌐 启动开发服务器...
echo 前端地址: http://localhost:5173
echo 后端API: http://localhost:3000/api
echo.
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev

pause
