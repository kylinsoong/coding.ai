// 认证系统脚本 - 使用REST API

// API基础URL
const API_BASE_URL = 'http://localhost:3001/api';

// 处理登录 - 使用REST API
async function handleLogin() {
    // 获取DOM元素
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    
    // 检查必要的元素是否存在
    if (!usernameInput || !passwordInput) return;
    
    const startTime = Date.now();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    console.log('[API LOG] POST /auth/login 被调用');
    console.log('[API LOG] 请求参数:', { username, password: '***' });
    
    // 表单验证
    if (!username || !password) {
        console.log('[API LOG] POST /auth/login 失败 - 缺少必要参数');
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        showMessage('请输入用户名和密码', 'error');
        return;
    }
    
    try {
        console.log('[DEBUG] 准备发送登录请求到:', `${API_BASE_URL}/auth/login`);
        console.log('[DEBUG] 请求体:', JSON.stringify({ username, password }));
        
        // 发送登录请求到API
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        console.log('[DEBUG] 响应状态码:', response.status);
        console.log('[DEBUG] 响应头:', JSON.stringify([...response.headers]));
        
        // 检查响应是否成功
        if (!response.ok) {
            console.error('[DEBUG] 响应失败:', response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('[DEBUG] 响应数据:', data);
        
        if (data.success) {
            // 登录成功
            console.log('[API LOG] POST /auth/login 成功 - 用户:', username);
            console.log('[API LOG] 响应:', { success: true, user: data.user, token: '***' });
            
            if (rememberCheckbox && rememberCheckbox.checked) {
                // 记住用户
                localStorage.setItem('rememberedUser', username);
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            // 保存用户会话和令牌
            sessionStorage.setItem('currentUser', JSON.stringify(data.user));
            sessionStorage.setItem('authToken', data.token);
            
            console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
            // 跳转到主页面
            window.location.href = 'index.html';
        } else {
            // 登录失败
            console.log('[API LOG] POST /auth/login 失败 -', data.message || '用户名或密码错误');
            console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
            showMessage(data.message || '用户名或密码错误', 'error');
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        console.error('[API LOG] POST /auth/login 请求异常:', error);
        console.error('[DEBUG] 错误详情:', error.stack);
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        showMessage('登录失败，请稍后重试', 'error');
    }
}

// 切换密码显示/隐藏
function togglePassword() {
    const passwordField = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    
    if (!passwordField || !togglePasswordBtn) return;
    
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    
    // 切换图标
    const icon = togglePasswordBtn.querySelector('i');
    if (icon) {
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    }
}

// 检查记住的用户
function checkRememberedUser() {
    const usernameInput = document.getElementById('username');
    const rememberCheckbox = document.getElementById('remember');
    const passwordInput = document.getElementById('password');
    
    if (!usernameInput || !rememberCheckbox || !passwordInput) return;
    
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        usernameInput.value = rememberedUser;
        rememberCheckbox.checked = true;
        passwordInput.focus();
    }
}

// 显示消息
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // 添加样式
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    // 根据类型设置背景色
    if (type === 'error') {
        messageEl.style.backgroundColor = '#ef4444';
    } else if (type === 'success') {
        messageEl.style.backgroundColor = '#10b981';
    } else {
        messageEl.style.backgroundColor = '#3b82f6';
    }
    
    // 添加到页面
    document.body.appendChild(messageEl);
    
    // 3秒后移除
    setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, 3000);
}

// 检查用户是否已登录
function checkLogin() {
    const currentUser = sessionStorage.getItem('currentUser');
    const authToken = sessionStorage.getItem('authToken');
    return !!currentUser && !!authToken;
}

// 退出登录
function logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
    window.location.href = 'login.html';
}

// 获取当前用户信息
function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// 获取认证令牌
function getAuthToken() {
    return sessionStorage.getItem('authToken');
}

// 使用API获取当前用户信息
async function fetchCurrentUser() {
    const startTime = Date.now();
    console.log('[API LOG] GET /auth/me 被调用');
    
    try {
        const token = getAuthToken();
        console.log('[API LOG] 请求参数: 令牌已提供');
        
        if (!token) {
            console.log('[API LOG] GET /auth/me 失败 - 未提供令牌');
            console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
            return null;
        }
        
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('[API LOG] GET /auth/me 成功 - 用户:', data.user.username);
            console.log('[API LOG] 响应:', { success: true, user: data.user });
            // 更新会话中的用户信息
            sessionStorage.setItem('currentUser', JSON.stringify(data.user));
            console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
            return data.user;
        } else {
            console.log('[API LOG] GET /auth/me 失败 -', data.message || '令牌无效');
            // 令牌无效，清除会话
            logout();
            console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
            return null;
        }
    } catch (error) {
        console.error('[API LOG] GET /auth/me 请求异常:', error);
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        return null;
    }
}

// 使用API创建用户
async function createUser(userData) {
    const startTime = Date.now();
    console.log('[API LOG] POST /users 被调用');
    console.log('[API LOG] 请求参数:', { ...userData, password: '***' });
    
    try {
        const token = getAuthToken();
        if (!token) {
            console.log('[API LOG] POST /users 失败 - 未登录');
            console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
            return { success: false, message: '未登录' };
        }
        
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('[API LOG] POST /users 成功 - 创建用户:', userData.username);
            console.log('[API LOG] 响应:', result);
        } else {
            console.log('[API LOG] POST /users 失败 -', result.message || '创建用户失败');
        }
        
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        return result;
    } catch (error) {
        console.error('[API LOG] POST /users 请求异常:', error);
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        return { success: false, message: '创建用户失败' };
    }
}

// 使用API获取所有用户
async function fetchAllUsers() {
    const startTime = Date.now();
    console.log('[API LOG] GET /users 被调用');
    
    try {
        const token = getAuthToken();
        if (!token) {
            console.log('[API LOG] GET /users 失败 - 未登录');
            console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
            return { success: false, message: '未登录' };
        }
        
        console.log('[API LOG] 请求参数: 令牌已提供');
        
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('[API LOG] GET /users 成功 - 返回用户数量:', result.users ? result.users.length : 0);
            console.log('[API LOG] 响应:', result);
        } else {
            console.log('[API LOG] GET /users 失败 -', result.message || '获取用户列表失败');
        }
        
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        return result;
    } catch (error) {
        console.error('[API LOG] GET /users 请求异常:', error);
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        return { success: false, message: '获取用户列表失败' };
    }
}

// 使用API更新用户
async function updateUser(userId, userData) {
    const startTime = Date.now();
    console.log('[API LOG] PUT /users/:id 被调用');
    console.log('[API LOG] 请求参数:', { userId, userData });
    
    try {
        const token = getAuthToken();
        if (!token) {
            console.log('[API LOG] PUT /users/:id 失败 - 未登录');
            console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
            return { success: false, message: '未登录' };
        }
        
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('[API LOG] PUT /users/:id 成功 - 更新用户ID:', userId);
            console.log('[API LOG] 响应:', result);
        } else {
            console.log('[API LOG] PUT /users/:id 失败 -', result.message || '更新用户失败');
        }
        
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        return result;
    } catch (error) {
        console.error('[API LOG] PUT /users/:id 请求异常:', error);
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        return { success: false, message: '更新用户失败' };
    }
}

// 使用API删除用户
async function deleteUser(userId) {
    const startTime = Date.now();
    console.log('[API LOG] DELETE /users/:id 被调用');
    console.log('[API LOG] 请求参数:', { userId });
    
    try {
        const token = getAuthToken();
        if (!token) {
            console.log('[API LOG] DELETE /users/:id 失败 - 未登录');
            console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
            return { success: false, message: '未登录' };
        }
        
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('[API LOG] DELETE /users/:id 成功 - 删除用户ID:', userId);
            console.log('[API LOG] 响应:', result);
        } else {
            console.log('[API LOG] DELETE /users/:id 失败 -', result.message || '删除用户失败');
        }
        
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        return result;
    } catch (error) {
        console.error('[API LOG] DELETE /users/:id 请求异常:', error);
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        return { success: false, message: '删除用户失败' };
    }
}

// 使用API重置用户密码
async function resetUserPassword(userId, newPassword) {
    const startTime = Date.now();
    console.log('[API LOG] POST /users/:id/change-password 被调用');
    console.log('[API LOG] 请求参数:', { userId, newPassword: '***' });
    
    try {
        const token = getAuthToken();
        if (!token) {
            console.log('[API LOG] POST /users/:id/change-password 失败 - 未登录');
            console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
            return { success: false, message: '未登录' };
        }
        
        const response = await fetch(`${API_BASE_URL}/users/${userId}/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                oldPassword: newPassword, // 由于是管理员重置密码，这里使用相同的新密码作为旧密码
                newPassword: newPassword 
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('[API LOG] POST /users/:id/change-password 成功 - 用户ID:', userId);
            console.log('[API LOG] 响应:', result);
        } else {
            console.log('[API LOG] POST /users/:id/change-password 失败 -', result.message || '重置密码失败');
        }
        
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        return result;
    } catch (error) {
        console.error('[API LOG] POST /users/:id/change-password 请求异常:', error);
        console.log('[API LOG] 执行时间:', Date.now() - startTime, 'ms');
        return { success: false, message: '重置密码失败' };
    }
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);