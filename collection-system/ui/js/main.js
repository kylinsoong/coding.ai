// 贷后催收系统主脚本文件



// 页面加载时检查登录状态并更新UI
function updateLoginUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.querySelector('.user-info');
    
    if (checkLogin()) {
        // 已登录，隐藏登录按钮，显示用户信息
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        
        // 根据用户权限显示/隐藏菜单
        updateMenuByRole();
    } else {
        // 未登录，显示登录按钮，隐藏用户信息
        if (loginBtn) loginBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// 根据用户角色更新菜单显示
function updateMenuByRole() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const isAdmin = currentUser.role === 'admin';
    
    // 显示/隐藏用户管理和系统设置菜单
    const userManagementMenu = document.querySelector('[data-module="users"]');
    const systemSettingsMenu = document.querySelector('[data-module="settings"]');
    
    if (isAdmin) {
        // Admin用户显示所有菜单
        if (userManagementMenu) userManagementMenu.style.display = 'block';
        if (systemSettingsMenu) systemSettingsMenu.style.display = 'block';
    } else {
        // 普通用户隐藏用户管理和系统设置
        if (userManagementMenu) userManagementMenu.style.display = 'none';
        if (systemSettingsMenu) systemSettingsMenu.style.display = 'none';
    }
    
    // 更新用户信息显示
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        const userInfoText = userInfo.querySelector('span');
        if (userInfoText) {
            userInfoText.textContent = currentUser.username;
        }
    }
}

// 页面加载时更新登录状态UI
updateLoginUI();

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// DOM元素选择
const sidebar = document.querySelector('.sidebar');
const menuToggle = document.getElementById('menuToggle');
const menuItems = document.querySelectorAll('.menu-item');
const modules = document.querySelectorAll('.module');
const pageTitle = document.getElementById('pageTitle');
const logoutItem = document.querySelector('.logout-item');

// 模块标题映射
const moduleTitles = {
    'dashboard': '仪表盘首页',
    'borrowers': '借款人管理',
    'tasks': '催收任务管理',
    'records': '催收记录管理',
    'analytics': '统计分析',
    'messages': '消息中心',
    'users': '用户管理',
    'settings': '系统设置'
};

// 初始化应用
function initApp() {
    // 绑定菜单点击事件
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const moduleId = item.getAttribute('data-module');
            if (moduleId) {
                switchModule(moduleId);
            }
        });
    });

    // 绑定侧边栏切换事件
    menuToggle.addEventListener('click', toggleSidebar);
    
    // 绑定退出登录事件
    if (logoutItem) {
        logoutItem.addEventListener('click', logout);
    }

    // 绑定其他交互事件
    bindOtherEvents();
}

// 切换模块
function switchModule(moduleId) {
    const currentUser = getCurrentUser();
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    // 检查用户是否有权限访问该模块
    const restrictedModules = ['users', 'settings'];
    if (restrictedModules.includes(moduleId) && !isAdmin) {
        // 无权限访问，切换到仪表盘
        moduleId = 'dashboard';
    }
    
    // 更新菜单激活状态
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeMenuItem = document.querySelector(`[data-module="${moduleId}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }

    // 更新模块显示
    modules.forEach(module => {
        module.classList.remove('active');
    });
    
    const activeModule = document.getElementById(moduleId);
    if (activeModule) {
        activeModule.classList.add('active');
    }

    // 更新页面标题
    pageTitle.textContent = moduleTitles[moduleId] || '贷后催收系统';

    // 小屏幕下自动关闭侧边栏
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }

    // 执行模块特定的初始化
    initModule(moduleId);
}

// 切换侧边栏
function toggleSidebar() {
    if (window.innerWidth > 768) {
        // 桌面端：折叠/展开
        sidebar.classList.toggle('collapsed');
    } else {
        // 移动端：显示/隐藏
        sidebar.classList.toggle('open');
    }
}

// 初始化特定模块
function initModule(moduleId) {
    switch (moduleId) {
        case 'dashboard':
            initDashboard();
            break;
        case 'borrowers':
            initBorrowers();
            break;
        case 'tasks':
            initTasks();
            break;
        case 'records':
            initRecords();
            break;
        case 'analytics':
            initAnalytics();
            break;
        case 'messages':
            initMessages();
            break;
        case 'users':
            initUsers();
            break;
        case 'settings':
            initSettings();
            break;
    }
}

// 仪表盘初始化
function initDashboard() {
    // 可以添加图表初始化等逻辑
    console.log('仪表盘初始化');
}

// 借款人管理初始化
function initBorrowers() {
    // 添加表格交互等逻辑
    console.log('借款人管理初始化');
}

// 催收任务管理初始化
function initTasks() {
    console.log('催收任务管理初始化');
}

// 催收记录管理初始化
function initRecords() {
    console.log('催收记录管理初始化');
}

// 统计分析初始化
function initAnalytics() {
    console.log('统计分析初始化');
}

// 消息中心初始化
function initMessages() {
    // 标记消息为已读
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.remove('unread');
        });
    });
    console.log('消息中心初始化');
}



// 用户管理初始化
async function initUsers() {
    console.log('用户管理初始化');
    
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        // 非管理员用户，显示无权限提示
        const usersModule = document.getElementById('users');
        usersModule.innerHTML = `
            <div class="no-permission">
                <div class="no-permission-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h3>无权限访问</h3>
                <p>您没有权限进行用户管理操作</p>
            </div>
        `;
        return;
    }
    
    // 绑定用户管理相关事件
    bindUserEvents();
    
    // 加载用户列表
    console.log('开始加载用户列表');
    await loadUsers();
    console.log('用户列表加载完成');
}

// 绑定用户管理事件
function bindUserEvents() {
    // 添加用户按钮点击事件
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', openAddUserModal);
    }
    
    // 保存用户按钮点击事件
    const saveUserBtn = document.getElementById('saveUserBtn');
    if (saveUserBtn) {
        saveUserBtn.addEventListener('click', saveUser);
    }
    
    // 重置密码按钮点击事件
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', resetUserPassword);
    }
    
    // 关闭模态框事件
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    // 分页控件事件
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', goToPrevPage);
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', goToNextPage);
    }
    
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', changePageSize);
    }
}

// 打开添加用户模态框
function openAddUserModal() {
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const passwordGroup = document.getElementById('passwordGroup');
    const statusGroup = document.getElementById('statusGroup');
    
    if (modal) {
        // 设置模态框标题
        modalTitle.textContent = '添加用户';
        // 显示密码字段
        if (passwordGroup) passwordGroup.style.display = 'block';
        // 隐藏状态字段
        if (statusGroup) statusGroup.style.display = 'none';
        // 重置表单
        resetUserForm();
        modal.classList.add('active');
    }
}

// 关闭模态框
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
}

// 重置用户表单
function resetUserForm() {
    const form = document.querySelector('#userModal .login-form');
    if (form) {
        form.reset();
    }
    
    // 重置表单字段
    const userIdInput = document.getElementById('userId');
    if (userIdInput) userIdInput.value = '';
    
    const usernameInput = document.getElementById('username');
    if (usernameInput) usernameInput.value = '';
    
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.value = '';
    
    const passwordInput = document.getElementById('password');
    if (passwordInput) passwordInput.value = '';
    
    const roleSelect = document.getElementById('role');
    if (roleSelect) roleSelect.value = 'user';
    
    const statusSelect = document.getElementById('status');
    if (statusSelect) statusSelect.value = 'active';
}

// 保存用户
async function saveUser() {
    console.log('saveUser函数被调用');
    // 获取表单数据
    const userIdInput = document.getElementById('userId');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const statusSelect = document.getElementById('status');
    
    console.log('表单元素:', {
        userIdInput: !!userIdInput,
        usernameInput: !!usernameInput,
        emailInput: !!emailInput,
        passwordInput: !!passwordInput,
        roleSelect: !!roleSelect,
        statusSelect: !!statusSelect
    });
    
    const userId = userIdInput ? userIdInput.value.trim() : '';
    const username = usernameInput ? usernameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const role = roleSelect ? roleSelect.value : '';
    const status = statusSelect ? statusSelect.value : 'active';
    
    console.log('表单数据:', {
        userId, username, email, role, status, password
    });
    
    // 表单验证
    if (!username || !email || !role) {
        console.error('表单验证失败:', { username, email, role });
        alert('请填写用户名、邮箱和角色');
        return;
    }
    
    let result;
    if (userId) {
        // 更新用户
        const userData = {
            username,
            email,
            role,
            status
        };
        
        if (password) {
            userData.password = password;
        }
        
        result = await updateUser(userId, userData);
    } else {
        // 创建用户
        if (!password) {
            alert('请填写密码');
            return;
        }
        
        result = await createUser({
            username,
            email,
            password,
            role
        });
    }
    
    if (result.success) {
        // 操作成功
        alert(userId ? '用户更新成功' : '用户创建成功');
        closeModal();
        // 重新加载用户列表
        await loadUsers();
    } else {
        // 操作失败
        alert(result.message || (userId ? '用户更新失败' : '用户创建失败'));
    }
}

// 分页相关变量
let currentPage = 1;
let pageSize = 10;
let allUsers = [];

// 加载用户列表
async function loadUsers() {
    const result = await fetchAllUsers();
    
    if (result.success) {
        allUsers = result.users;
        // 更新用户表格
        updateUsersTable();
        // 渲染分页控件
        renderPagination();
    } else {
        console.error('加载用户列表失败:', result.message);
    }
}

// 更新用户表格
function updateUsersTable() {
    const tableBody = document.querySelector('#users .data-table tbody');
    if (!tableBody) {
        return;
    }
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 计算分页数据
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);
    
    // 添加用户行
    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>
                <div style="display: flex; align-items: center;">
                    <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
                    <div>
                        <div style="font-weight: 500;">${user.username}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">${user.email}</div>
                    </div>
                </div>
            </td>
            <td><span class="role-badge ${user.role}">${user.role === 'admin' ? '管理员' : '催收员'}</span></td>
            <td><span class="status-badge ${user.status === 'active' ? 'success' : 'danger'}">${user.status === 'active' ? '启用' : '禁用'}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td>${formatDate(user.updatedAt)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editUser('${user.id}')">编辑</button>
                <button class="btn btn-sm btn-warning" onclick="openResetPasswordModal('${user.id}')">重置密码</button>
                <button class="btn btn-sm btn-danger" onclick="toggleUserStatus('${user.id}', '${user.status}')">${user.status === 'active' ? '禁用' : '启用'}</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 渲染分页控件
function renderPagination() {
    const pageNumbersContainer = document.getElementById('pageNumbers');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (!pageNumbersContainer || !prevPageBtn || !nextPageBtn) {
        return;
    }
    
    // 清空当前页码
    pageNumbersContainer.innerHTML = '';
    
    // 计算总页数
    const totalPages = Math.ceil(allUsers.length / pageSize);
    
    // 添加页码按钮
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);
        pageNumbersContainer.appendChild(pageBtn);
    }
    
    // 启用/禁用上一页/下一页按钮
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// 跳转到指定页码
function goToPage(pageNumber) {
    currentPage = pageNumber;
    updateUsersTable();
    renderPagination();
}

// 上一页
function goToPrevPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

// 下一页
function goToNextPage() {
    const totalPages = Math.ceil(allUsers.length / pageSize);
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

// 更改每页显示条数
function changePageSize() {
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    if (pageSizeSelect) {
        pageSize = parseInt(pageSizeSelect.value);
        currentPage = 1; // 重置到第一页
        updateUsersTable();
        renderPagination();
    }
}

// 打开重置密码模态框
function openResetPasswordModal(userId) {
    const modal = document.getElementById('resetPasswordModal');
    const resetUserIdInput = document.getElementById('resetUserId');
    
    if (modal && resetUserIdInput) {
        resetUserIdInput.value = userId;
        // 重置表单
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (newPasswordInput) newPasswordInput.value = '';
        if (confirmPasswordInput) confirmPasswordInput.value = '';
        modal.classList.add('active');
    }
}

// 重置用户密码
async function resetUserPassword() {
    const resetUserIdInput = document.getElementById('resetUserId');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    const userId = resetUserIdInput ? resetUserIdInput.value.trim() : '';
    const newPassword = newPasswordInput ? newPasswordInput.value : '';
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
    
    // 表单验证
    if (!newPassword || !confirmPassword) {
        alert('请填写新密码和确认密码');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('新密码和确认密码不匹配');
        return;
    }
    
    // 调用API重置密码
    const result = await window.resetUserPassword(userId, newPassword);
    
    if (result.success) {
        // 重置成功
        alert('密码重置成功');
        closeModal();
    } else {
        // 重置失败
        alert(result.message || '密码重置失败');
    }
}

// 启用/禁用用户
async function toggleUserStatus(userId, currentStatus) {
    console.log('toggleUserStatus函数被调用');
    console.log('参数:', { userId, currentStatus });
    
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? '启用' : '禁用';
    
    if (confirm(`确定要${action}该用户吗？`)) {
        console.log('开始调用updateUser函数');
        const result = await updateUser(userId, { status: newStatus });
        console.log('updateUser调用结果:', result);
        
        if (result.success) {
            alert(`用户${action}成功`);
            // 重新加载用户列表
            await loadUsers();
        } else {
            alert(result.message || `用户${action}失败`);
        }
    }
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

// 编辑用户
async function editUser(userId) {
    console.log('编辑用户:', userId);
    
    // 获取用户信息
    const users = await fetchAllUsers();
    if (users.success && users.users) {
        const user = users.users.find(u => u.id === userId);
        if (user) {
            // 打开模态框
            const modal = document.getElementById('userModal');
            const modalTitle = document.getElementById('modalTitle');
            const passwordGroup = document.getElementById('passwordGroup');
            const statusGroup = document.getElementById('statusGroup');
            
            if (modal) {
                // 设置模态框标题
                modalTitle.textContent = '编辑用户';
                // 隐藏密码字段（可选更新）
                if (passwordGroup) passwordGroup.style.display = 'none';
                // 显示状态字段
                if (statusGroup) statusGroup.style.display = 'block';
                
                // 填充用户数据
                const userIdInput = document.getElementById('userId');
                const usernameInput = document.getElementById('username');
                const emailInput = document.getElementById('email');
                const roleSelect = document.getElementById('role');
                const statusSelect = document.getElementById('status');
                
                if (userIdInput) userIdInput.value = user.id;
                if (usernameInput) usernameInput.value = user.username;
                if (emailInput) emailInput.value = user.email;
                if (roleSelect) roleSelect.value = user.role;
                if (statusSelect) statusSelect.value = user.status;
                
                modal.classList.add('active');
            }
        }
    }
}

// 删除用户
async function deleteUser(userId) {
    if (confirm('确定要删除该用户吗？')) {
        const result = await deleteUser(userId);
        
        if (result.success) {
            alert('用户删除成功');
            // 重新加载用户列表
            await loadUsers();
        } else {
            alert(result.message || '用户删除失败');
        }
    }
}

// 系统设置初始化
function initSettings() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        // 非管理员用户，显示无权限提示
        const settingsModule = document.getElementById('settings');
        settingsModule.innerHTML = `
            <div class="no-permission">
                <div class="no-permission-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h3>无权限访问</h3>
                <p>您没有权限进行系统设置操作</p>
            </div>
        `;
        return;
    }
    
    console.log('系统设置初始化');
}

// 绑定其他交互事件
function bindOtherEvents() {
    // 绑定按钮点击事件
    bindButtonEvents();
    
    // 绑定筛选器事件
    bindFilterEvents();
    
    // 绑定表单事件
    bindFormEvents();
}

// 绑定按钮事件
function bindButtonEvents() {
    // 通用按钮点击处理
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 防止默认行为
            e.preventDefault();
            
            // 获取按钮类型
            const btnClass = this.className;
            
            // 根据按钮类型执行不同操作
            if (btnClass.includes('btn-primary')) {
                handlePrimaryButton(this);
            } else if (btnClass.includes('btn-success')) {
                handleSuccessButton(this);
            } else if (btnClass.includes('btn-warning')) {
                handleWarningButton(this);
            } else if (btnClass.includes('btn-danger')) {
                handleDangerButton(this);
            } else if (btnClass.includes('btn-secondary')) {
                handleSecondaryButton(this);
            }
        });
    });
}

// 处理主要按钮点击
function handlePrimaryButton(button) {
    // 根据按钮文本执行不同操作
    const text = button.textContent.trim();
    
    if (text.includes('添加')) {
        console.log('添加操作');
    } else if (text.includes('分配')) {
        console.log('分配操作');
    } else if (text.includes('导出')) {
        console.log('导出操作');
    } else if (text.includes('保存')) {
        console.log('保存操作');
    }
}

// 处理成功按钮点击
function handleSuccessButton(button) {
    const text = button.textContent.trim();
    
    if (text.includes('催收')) {
        console.log('执行催收操作');
    } else if (text.includes('执行')) {
        console.log('执行任务');
    }
}

// 处理警告按钮点击
function handleWarningButton(button) {
    console.log('警告按钮操作');
}

// 处理危险按钮点击
function handleDangerButton(button) {
    console.log('危险按钮操作');
}

// 处理次要按钮点击
function handleSecondaryButton(button) {
    const text = button.textContent.trim();
    
    if (text.includes('清空')) {
        console.log('清空操作');
    } else if (text.includes('重置')) {
        console.log('重置操作');
    } else if (text.includes('取消')) {
        console.log('取消操作');
    }
}

// 绑定筛选器事件
function bindFilterEvents() {
    // 筛选器变化处理
    const filters = document.querySelectorAll('.filter-bar select, .filter-bar input');
    filters.forEach(filter => {
        filter.addEventListener('change', function() {
            console.log('筛选条件变化:', this.name, this.value);
            // 这里可以添加筛选逻辑
        });
    });
}

// 绑定表单事件
function bindFormEvents() {
    // 表单输入处理
    const formInputs = document.querySelectorAll('.form-group input, .form-group select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// 响应式处理
function handleResize() {
    // 调整窗口大小时的处理
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        sidebar.classList.remove('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initApp);

// 窗口大小变化时处理
window.addEventListener('resize', handleResize);

// 点击外部关闭侧边栏（移动端）
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle) {
            sidebar.classList.remove('open');
        }
    }
});

// 添加平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 模拟数据更新（用于演示）
function simulateDataUpdate() {
    // 模拟统计数据更新
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        // 随机更新部分统计数据
        if (Math.random() > 0.7) {
            const currentValue = stat.textContent;
            if (currentValue.includes('¥')) {
                // 金额格式
                const amount = parseInt(currentValue.replace(/[^0-9]/g, ''));
                const change = Math.floor(Math.random() * 100000);
                stat.textContent = `¥${(amount + change).toLocaleString()}`;
            } else if (currentValue.includes('%')) {
                // 百分比格式
                const percent = parseFloat(currentValue);
                const change = (Math.random() - 0.5) * 5;
                stat.textContent = `${(percent + change).toFixed(1)}%`;
            } else {
                // 数字格式
                const number = parseInt(currentValue.replace(/[^0-9]/g, ''));
                const change = Math.floor(Math.random() * 50);
                stat.textContent = (number + change).toLocaleString();
            }
        }
    });
}

// 定期模拟数据更新（每30秒）
setInterval(simulateDataUpdate, 30000);

// 搜索功能
function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            console.log('搜索:', searchTerm);
            // 这里可以添加搜索逻辑
        });
    }
}

// 初始化搜索功能
initSearch();

// 表格行点击事件
function initTableInteractions() {
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // 排除按钮点击
            if (!e.target.closest('.btn')) {
                console.log('点击表格行:', this);
                // 这里可以添加行点击逻辑
            }
        });
    });
}

// 初始化表格交互
initTableInteractions();