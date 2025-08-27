// 游戏模块包装器
import { showSuccess, showError } from './toast.js';

// 导入游戏主逻辑
import './main.js';

// 导出游戏初始化函数
export function initGame() {
    console.log('初始化游戏...');
    
    // 检查是否有认证系统
    if (typeof auth !== 'undefined') {
        // 如果有认证系统，等待登录完成
        if (auth.isLoggedIn()) {
            showSplash();
            showSuccess('游戏已准备就绪！', '游戏启动');
        }
        // 如果未登录，认证系统会显示登录界面
    } else {
        // 如果没有认证系统，直接显示游戏（用于测试）
        showSplash();
    }

    // 开发模式：如果URL包含dev=true，直接显示游戏
    if (window.location.search.includes('dev=true')) {
        console.log('开发模式：直接显示游戏');
        showSplash();
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
