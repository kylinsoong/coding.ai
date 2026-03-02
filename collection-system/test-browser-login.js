const axios = require('axios');

// 测试登录功能
async function testLogin() {
    try {
        console.log('开始测试登录功能...');
        
        // 发送登录请求
        const response = await axios.post('http://localhost:3001/api/auth/login', {
            username: 'admin',
            password: 'admin'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:8080',
                'Referer': 'http://localhost:8080/login.html'
            },
            withCredentials: true
        });
        
        console.log('登录响应状态:', response.status);
        console.log('登录响应数据:', response.data);
        
        if (response.data.success) {
            console.log('登录成功!');
            
            // 测试获取当前用户信息
            try {
                const meResponse = await axios.get('http://localhost:3001/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${response.data.token}`,
                        'Origin': 'http://localhost:8080',
                        'Referer': 'http://localhost:8080/index.html'
                    },
                    withCredentials: true
                });
                
                console.log('获取当前用户信息响应:', meResponse.data);
            } catch (error) {
                console.error('获取当前用户信息失败:', error.message);
            }
        } else {
            console.log('登录失败!');
        }
    } catch (error) {
        console.error('登录错误:', error.message);
        if (error.response) {
            console.error('响应状态:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
    }
}

// 运行测试
testLogin();