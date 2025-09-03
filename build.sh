#!/bin/bash

# Floppy Bird 游戏构建脚本
echo "🚀 开始构建 Floppy Bird 游戏..."

# 检查依赖
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 Node.js"
    exit 1
fi

# 清理旧的构建文件
echo "🧹 清理旧的构建文件..."
rm -rf dist

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功！"
    echo "📁 构建文件位置: $(pwd)/dist"
    
    # 显示构建后的文件结构
    echo "📋 构建文件列表:"
    find dist -type f | head -20
    
    # 检查关键文件
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html 已生成"
    else
        echo "❌ index.html 未找到"
    fi
    
    if [ -d "dist/assets" ]; then
        echo "✅ assets 目录已生成"
        echo "   - 图片文件数量: $(find dist/assets -name "*.png" -o -name "*.jpg" -o -name "*.gif" | wc -l)"
    else
        echo "❌ assets 目录未找到"
    fi
    
    if [ -d "dist/js" ]; then
        echo "✅ js 目录已生成"
        echo "   - JS文件数量: $(find dist/js -name "*.js" | wc -l)"
    else
        echo "❌ js 目录未找到"
    fi
    
    if [ -d "dist/css" ]; then
        echo "✅ css 目录已生成"
        echo "   - CSS文件数量: $(find dist/css -name "*.css" | wc -l)"
    else
        echo "❌ css 目录未找到"
    fi
    
    echo ""
    echo "🎯 部署说明:"
    echo "1. 将 dist 目录的内容复制到你的 web 服务器"
    echo "2. 确保 nginx.conf 中的 root 路径指向正确的 dist 目录"
    echo "3. 重启 nginx 服务"
    echo ""
    echo "🌐 本地测试: npm run preview"
    
else
    echo "❌ 构建失败！"
    exit 1
fi
