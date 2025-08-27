// Toast Notification System
export class ToastNotification {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // 创建toast容器
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', title = '', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconClass = this.getIconClass(type);
        const titleText = title || this.getDefaultTitle(type);
        
        toast.innerHTML = `
            <div class="toast-icon ${iconClass}"></div>
            <div class="toast-content">
                <div class="toast-title">${titleText}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        this.container.appendChild(toast);

        // 自动移除
        if (duration > 0) {
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }

        return toast;
    }

    hide(toast) {
        if (toast && toast.parentElement) {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }
    }

    getIconClass(type) {
        switch (type) {
            case 'success': return 'success';
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'info': 
            default: return 'info';
        }
    }

    getDefaultTitle(type) {
        switch (type) {
            case 'success': return '成功';
            case 'error': return '错误';
            case 'warning': return '警告';
            case 'info': 
            default: return '提示';
        }
    }

    // 便捷方法
    success(message, title = '') {
        return this.show(message, 'success', title);
    }

    error(message, title = '') {
        return this.show(message, 'error', title);
    }

    warning(message, title = '') {
        return this.show(message, 'warning', title);
    }

    info(message, title = '') {
        return this.show(message, 'info', title);
    }
}

// 全局toast实例
let toast;
document.addEventListener('DOMContentLoaded', function() {
    toast = new ToastNotification();
});

// 全局便捷函数
export function showToast(message, type = 'info', title = '', duration = 4000) {
    if (toast) {
        return toast.show(message, type, title, duration);
    }
}

export function showSuccess(message, title = '') {
    return showToast(message, 'success', title);
}

export function showError(message, title = '') {
    return showToast(message, 'error', title);
}

export function showWarning(message, title = '') {
    return showToast(message, 'warning', title);
}

export function showInfo(message, title = '') {
    return showToast(message, 'info', title);
}
