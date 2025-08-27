# Floppy Bird - N Platform集成版

这是一个集成了N Platform OAuth认证的Floppy Bird游戏。

## 功能特性

- 🎮 经典Floppy Bird游戏玩法
- 🔐 N Platform OAuth登录集成
- 💰 用户余额显示
- 🎯 友好的提示框系统
- 📱 响应式设计
- 🚀 支持开发和生产环境

## 开发模式

### 安装依赖
```bash
yarn install
```

### 启动开发服务器
```bash
yarn dev
```

访问：`http://localhost:3000`

### 开发模式
添加 `?dev=true` 参数跳过登录：
`http://localhost:3000?dev=true`

## 生产部署

### 1. 打包
```bash
yarn build
```

打包后会在 `dist/` 目录生成静态文件：
- `index.html` - 主页面
- `assets/` - 打包后的CSS和JS文件
- `js/` - 第三方库文件

### 2. 部署到Nginx
1. 将 `dist/` 目录内容复制到服务器
2. 配置nginx（参考 `nginx.conf` 文件）
3. 重启nginx服务

### 3. 直接部署
也可以直接将 `dist/` 目录部署到任何静态文件服务器：
- Apache
- Nginx
- CDN
- GitHub Pages
- Vercel
- Netlify

## 文件结构

```
floppybird/
├── dist/                    # 打包后的静态文件（生产环境）
│   ├── index.html          # 主页面
│   ├── assets/             # 打包后的资源
│   └── js/                 # 第三方库
├── src/                    # 源码目录
│   └── main.js            # 主入口文件
├── js/                     # 游戏逻辑
│   ├── main.js            # 游戏主逻辑
│   ├── auth.js            # OAuth认证
│   ├── toast.js           # 提示框组件
│   └── game-module.js     # 游戏模块包装器
├── css/                    # 样式文件
├── public/                 # 静态资源
├── index.html             # 开发环境主页面
├── vite.config.js         # Vite配置
├── package.json           # 项目配置
└── nginx.conf             # Nginx配置示例
```

## OAuth配置

### OAuth流程
1. **用户点击登录** → 跳转到 `https://sso.nnnnn.fun/oauth/authorize`
2. **平台统一授权** → 用户在平台统一授权页面登录
3. **授权回调** → 返回游戏页面，携带授权码
4. **获取Token** → 使用授权码获取访问令牌
5. **获取用户信息** → 使用令牌获取用户详细信息

### 域名配置

#### 开发环境 (localhost)
- **API域名**: `http://localhost:18080` - 用于API调用
- **SSO域名**: `http://localhost:18080` - 用于OAuth授权页面
- **游戏地址**: `http://localhost:3000` - 游戏运行地址

#### 生产环境
- **API域名**: `https://api2.nnnnn.fun` - 用于API调用（token、用户信息等）
- **SSO域名**: `https://sso.nnnnn.fun` - 用于OAuth授权页面

### 开发环境
- 使用Vite代理，API请求通过 `/api` 路径代理到 `https://api2.nnnnn.fun`
- 无需额外配置

### 生产环境
- 直接调用 `https://api2.nnnnn.fun` API
- 需要确保API服务器支持CORS或使用nginx代理

### 应用配置
确保在N Platform后台配置了正确的应用信息：
- **Client ID**: `PhdyJRYj-app-7342570`
- **Redirect URI**: 你的游戏域名（如 `https://yourgame.com/`）
- **Scope**: `read`

## 技术栈

- **构建工具**: Vite
- **游戏引擎**: 原生JavaScript + jQuery
- **认证**: OAuth 2.0
- **样式**: CSS3 + 动画
- **音效**: Buzz.js

## 注意事项

1. **CORS问题**: 生产环境需要确保API服务器支持跨域请求
2. **HTTPS**: OAuth要求使用HTTPS协议
3. **域名配置**: 需要在N Platform后台配置正确的回调地址
4. **缓存**: 静态资源已配置长期缓存

## 故障排除

### 打包问题
- 确保所有JS文件都正确导入
- 检查ES模块语法
- 验证第三方库路径

### 运行问题
- 检查API服务器状态
- 验证OAuth配置
- 查看浏览器控制台错误

### 部署问题
- 确认nginx配置正确
- 检查文件权限
- 验证域名解析
