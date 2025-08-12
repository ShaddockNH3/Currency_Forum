@echo off
chcp 65001 >nul
echo 🚀 开始部署蓝鼠兑换前端应用...

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js未安装，请先安装Node.js
    pause
    exit /b 1
)

REM 检查npm是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm未安装，请先安装npm
    pause
    exit /b 1
)

echo 📦 安装依赖...
call npm install

if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo 🔨 构建生产版本...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ 构建成功！
    echo 📁 生产文件已生成在 dist/ 目录
    echo 🌐 可以使用以下命令预览：
    echo    npm run preview
    echo.
    echo 📋 部署说明：
    echo    1. 将 dist/ 目录上传到你的Web服务器
    echo    2. 配置服务器指向 dist/ 目录
    echo    3. 确保后端API地址配置正确
) else (
    echo ❌ 构建失败，请检查错误信息
)

pause
