// N Platform OAuth Authentication
export class NPlatformAuth {
    constructor() {
        this.clientId = 'PhdyJRYj-app-7342570'; // 你的应用client_id
        this.redirectUri = window.location.origin + window.location.pathname; // 直接使用当前页面作为回调
        
        // 根据环境使用不同的API地址
        this.apiBase = typeof __API_BASE__ !== 'undefined' ? __API_BASE__ : 'https://api2.nnnnn.fun';
        
        // 根据环境选择SSO授权域名
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.ssoBase = 'http://localhost:18080'; // 本地开发环境
        } else {
            this.ssoBase = 'https://sso.nnnnn.fun'; // 生产环境
        }
        
        this.accessToken = null;
        this.userInfo = null;
        this.devMode = window.location.search.includes('dev=true'); // 开发模式
        this.init();
    }

    init() {
        console.log('初始化OAuth认证系统');
        console.log('当前域名:', window.location.hostname);
        console.log('回调地址:', this.redirectUri);
        console.log('SSO地址:', this.ssoBase);
        console.log('API地址:', this.apiBase);
        
        // 检查URL参数中是否有授权码
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        if (code) {
            console.log('检测到授权码:', code);
            console.log('状态参数:', state);
            console.log('开始处理OAuth回调...');
            
            // 延迟处理，确保页面完全加载
            setTimeout(() => {
                this.handleOAuthCallback(code, state);
            }, 100);
        } else {
            console.log('未检测到授权码，检查登录状态');
            this.checkLoginStatus();
        }
    }

    // 检查登录状态
    checkLoginStatus() {
        // 开发模式：跳过登录
        if (this.devMode) {
            console.log('开发模式：跳过登录验证');
            this.hideLoginModal();
            if (typeof showSplash === 'function') {
                showSplash();
            }
            return;
        }

        const savedToken = localStorage.getItem('n_platform_token');
        const savedUserInfo = localStorage.getItem('n_platform_user');
        
        if (savedToken && savedUserInfo) {
            try {
                this.accessToken = savedToken;
                this.userInfo = JSON.parse(savedUserInfo);
                
                // 验证token是否有效
                this.validateToken();
            } catch (e) {
                this.clearAuth();
                this.showLoginModal();
            }
        } else {
            this.showLoginModal();
        }
    }

    // 显示登录模态框
    showLoginModal() {
        const modal = `
            <div class="login-overlay" id="loginOverlay">
                <div class="login-modal">
                    <div class="login-logo"></div>
                    <div class="login-title">欢迎来到 Floppy Bird</div>
                    <div class="login-subtitle">请使用 N Platform 账号登录开始游戏</div>
                    <button class="login-btn" id="loginBtn" onclick="auth.login()">
                        <span class="loading" style="display: none;"></span>
                        使用 N Platform 登录
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
        document.getElementById('gamecontainer').style.display = 'none';
    }

    // 隐藏登录模态框
    hideLoginModal() {
        const overlay = document.getElementById('loginOverlay');
        if (overlay) {
            overlay.remove();
        }
        document.getElementById('gamecontainer').style.display = 'block';
    }

    // 显示用户信息
    showUserInfo() {
        const userInfoHtml = `
            <div class="user-info">
                <div class="user-avatar" style="background-image: url('${this.userInfo.avatar || ''}')"></div>
                <div class="user-details">
                    <div class="user-name">${this.userInfo.user_name || '用户'}</div>
                    <div class="user-balance">余额: ${this.userInfo.balance || 0} N</div>
                </div>
            </div>
            <button class="logout-btn" onclick="auth.logout()">退出登录</button>
        `;
        
        // 替换登录按钮为用户信息
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.parentElement.innerHTML = userInfoHtml;
        }
    }

    // 开始OAuth登录流程
    login() {
        const loginBtn = document.getElementById('loginBtn');
        const loading = loginBtn.querySelector('.loading');
        const text = loginBtn.querySelector('span:not(.loading)') || loginBtn;
        
        // 显示加载状态
        loading.style.display = 'inline-block';
        text.textContent = '正在跳转...';
        loginBtn.disabled = true;

        // 生成state参数用于安全验证
        const state = this.generateState();
        localStorage.setItem('oauth_state', state);

        // 构建OAuth授权URL - 使用SSO域名
        const authUrl = `${this.ssoBase}/oauth/authorize?` + 
            `client_id=${encodeURIComponent(this.clientId)}&` +
            `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
            `response_type=code&` +
            `state=${encodeURIComponent(state)}&` +
            `scope=read`;

        console.log('跳转到OAuth授权页面:', authUrl);
        // 跳转到授权页面
        window.location.href = authUrl;
    }

    // 处理OAuth回调
    async handleOAuthCallback(code, state) {
        // 验证state参数
        const savedState = localStorage.getItem('oauth_state');
        if (state !== savedState) {
            showError('授权验证失败，请重新登录', '验证失败');
            this.clearAuth();
            this.showLoginModal();
            return;
        }

        try {
            // 获取access token
            const tokenResponse = await this.getAccessToken(code, state);
            
            if (tokenResponse.access_token) {
                this.accessToken = tokenResponse.access_token;
                localStorage.setItem('n_platform_token', this.accessToken);
                
                // 获取用户信息
                await this.getUserInfo();
                
                // 隐藏登录模态框，显示游戏
                this.hideLoginModal();
                
                // 清除URL中的参数
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // 显示成功消息
                showSuccess('登录成功！欢迎回来', '登录成功');
                
                // 初始化游戏
                if (typeof initGame === 'function') {
                    initGame();
                }
            } else {
                throw new Error('获取访问令牌失败');
            }
        } catch (error) {
            console.error('OAuth回调处理失败:', error);
            showError('登录失败，请重试', '登录失败');
            this.clearAuth();
            this.showLoginModal();
        }
    }

    // 获取access token
    async getAccessToken(code, state) {
        try {
            console.log('开始获取access token...');
            console.log('API地址:', this.apiBase);
            console.log('请求参数:', { code, state, redirect_uri: this.redirectUri });
            
            const response = await fetch(`${this.apiBase}/oauth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    state: state,
                    redirect_uri: this.redirectUri
                }),
                // 添加CORS配置
                mode: 'cors',
                credentials: 'include'
            });

            console.log('Token响应状态:', response.status);
            console.log('Token响应头:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Token请求失败:', errorText);
                throw new Error(`Token请求失败: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Token响应数据:', result);
            
            // 检查API返回的错误
            if (result.error) {
                throw new Error(result.error_description || result.error);
            }

            return result;
        } catch (error) {
            console.error('获取token失败:', error);
            throw error;
        }
    }

    // 获取用户信息
    async getUserInfo() {
        try {
            console.log('开始获取用户信息...');
            console.log('API地址:', this.apiBase);
            console.log('Token:', this.accessToken ? '已设置' : '未设置');
            
            const response = await fetch(`${this.apiBase}/oapi/me`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                },
                // 添加CORS配置
                mode: 'cors',
                credentials: 'include'
            });

            console.log('用户信息响应状态:', response.status);
            console.log('用户信息响应头:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('获取用户信息失败:', errorText);
                throw new Error(`获取用户信息失败: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('用户信息响应数据:', result);
            
            if (result.code === 0 && result.data) {
                this.userInfo = result.data;
                localStorage.setItem('n_platform_user', JSON.stringify(this.userInfo));
            } else {
                throw new Error(result.msg || '获取用户信息失败');
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
            throw error;
        }
    }

    // 验证token有效性
    async validateToken() {
        try {
            await this.getUserInfo();
            this.hideLoginModal();
            this.showUserInfo();
            
            // 初始化游戏
            if (typeof initGame === 'function') {
                initGame();
            }
        } catch (error) {
            console.error('Token验证失败:', error);
            this.clearAuth();
            this.showLoginModal();
        }
    }

    // 退出登录
    logout() {
        this.clearAuth();
        this.showLoginModal();
    }

    // 清除认证信息
    clearAuth() {
        this.accessToken = null;
        this.userInfo = null;
        localStorage.removeItem('n_platform_token');
        localStorage.removeItem('n_platform_user');
        localStorage.removeItem('oauth_state');
    }

    // 生成随机state参数
    generateState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    // 获取当前用户信息
    getCurrentUser() {
        return this.userInfo;
    }

    // 检查是否已登录
    isLoggedIn() {
        return this.accessToken !== null && this.userInfo !== null;
    }
}

// 初始化认证系统
let auth;
document.addEventListener('DOMContentLoaded', function() {
    auth = new NPlatformAuth();
    window.auth = auth; // 导出到全局
});

// 游戏初始化函数
function initGame() {
    // 这里可以添加游戏特定的初始化逻辑
    console.log('用户已登录，开始游戏');
    
    // 显示用户信息
    if (auth && auth.isLoggedIn()) {
        auth.showUserInfo();
        
        // 初始化游戏界面
        if (typeof showSplash === 'function') {
            showSplash();
        }
    }
}

// 开发模式：直接初始化游戏
function initDevGame() {
    console.log('开发模式：直接初始化游戏');
    if (typeof showSplash === 'function') {
        showSplash();
    }
}

// 导出函数到全局
window.initGame = initGame;
window.initDevGame = initDevGame;
