// 游戏模块包装器
import { showSuccess, showError } from './toast.js';

// 导入游戏主逻辑
import './main.js';

// 检查游戏环境是否准备就绪
function isGameReady() {
    // 检查必要的游戏变量
    const requiredVars = ['highscore', 'score', 'states', 'showSplash'];
    const missingVars = requiredVars.filter(varName => typeof window[varName] === 'undefined');
    
    if (missingVars.length > 0) {
        console.warn('游戏环境未准备就绪，缺少变量:', missingVars);
        return false;
    }
    
    // 检查必要的DOM元素
    const requiredElements = ['gamecontainer', 'player', 'splash'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.warn('游戏DOM元素未准备就绪，缺少元素:', missingElements);
        return false;
    }
    
    console.log('游戏环境检查通过，所有必要组件已就绪');
    return true;
}

// 导出游戏初始化函数
export function initGame() {
    if (gameInitialized) {
        console.log('游戏已经初始化，跳过重复初始化');
        return;
    }
    
    console.log('尝试初始化游戏...');
    
    // 检查游戏环境是否准备就绪
    if (!isGameReady()) {
        console.log('游戏环境未准备就绪，延迟重试...');
        setTimeout(() => {
            if (isGameReady()) {
                initGame();
            } else {
                console.error('游戏环境检查失败，无法初始化游戏');
            }
        }, 500);
        return;
    }
    
    console.log('初始化游戏...');
    
    // 检查是否有认证系统
    if (typeof auth !== 'undefined') {
        // 如果有认证系统，等待登录完成
        if (auth.isLoggedIn()) {
            showSplash();
            showSuccess('游戏已准备就绪！', '游戏启动');
            gameInitialized = true;
        }
        // 如果未登录，认证系统会显示登录界面
    } else {
        // 如果没有认证系统，直接显示游戏（用于测试）
        showSplash();
        gameInitialized = true;
    }

    // 开发模式：如果URL包含dev=true，直接显示游戏
    if (window.location.search.includes('dev=true')) {
        console.log('开发模式：直接显示游戏');
        showSplash();
        gameInitialized = true;
    }
}

// 当DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    if(window.location.search == "?debug")
        debugmode = true;
    if(window.location.search == "?easy")
        pipeheight = 200;

    //get the highscore
    var savedscore = getCookie("highscore");
    if(savedscore != "")
        highscore = parseInt(savedscore);

    // 延迟初始化，确保auth对象已创建
    setTimeout(() => {
        initGame();
    }, 100);
});
