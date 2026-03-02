// 测试auth模块的工具函数
const jwt = require('jsonwebtoken');
const mockFs = require('mock-fs');
const { generateToken, generateUserId, checkUserExists } = require('../../auth/server');

// 模拟SECRET_KEY
process.env.SECRET_KEY = 'test_secret_key';

// 在每个测试套件前设置模拟文件系统
beforeEach(() => {
  // 模拟db.json文件
  mockFs({
    './auth/db.json': JSON.stringify({
      users: [
        {
          id: 'US001',
          username: 'admin',
          password: 'admin',
          role: 'admin',
          email: 'admin@example.com',
          status: 'active',
          createdAt: '2026-02-01T00:00:00Z',
          updatedAt: '2026-02-01T00:00:00Z'
        },
        {
          id: 'US002',
          username: 'kylin',
          password: 'kylin',
          role: 'user',
          email: 'kylin@example.com',
          status: 'active',
          createdAt: '2026-02-02T00:00:00Z',
          updatedAt: '2026-02-02T00:00:00Z'
        }
      ]
    })
  });
});

// 在每个测试套件后恢复文件系统
afterEach(() => {
  mockFs.restore();
});

describe('generateToken', () => {
  test('应该为用户生成有效的JWT令牌', () => {
    const user = {
      id: 'US001',
      username: 'admin',
      role: 'admin'
    };
    
    const token = generateToken(user);
    
    // 验证令牌是否存在
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    
    // 验证令牌是否可以解码
    const decoded = jwt.verify(token, 'collection_system_secret_key');
    expect(decoded.id).toBe(user.id);
    expect(decoded.username).toBe(user.username);
    expect(decoded.role).toBe(user.role);
  });
});

describe('generateUserId', () => {
  test('应该生成新的用户ID', () => {
    const userId = generateUserId();
    
    // 验证用户ID格式
    expect(userId).toMatch(/^US\d{3}$/);
    expect(userId).toBe('US003'); // 基于模拟数据，下一个ID应该是US003
  });
  
  test('当没有用户时应该生成US001', () => {
    // 重置模拟文件系统，没有用户
    mockFs.restore();
    mockFs({
      './auth/db.json': JSON.stringify({ users: [] })
    });
    
    const userId = generateUserId();
    expect(userId).toBe('US001');
  });
});

describe('checkUserExists', () => {
  test('应该返回true当用户存在时', () => {
    expect(checkUserExists('admin')).toBe(true);
    expect(checkUserExists('kylin')).toBe(true);
  });
  
  test('应该返回false当用户不存在时', () => {
    expect(checkUserExists('nonexistent')).toBe(false);
    expect(checkUserExists('testuser')).toBe(false);
  });
  
  test('应该区分大小写', () => {
    expect(checkUserExists('ADMIN')).toBe(false);
    expect(checkUserExists('Kylin')).toBe(false);
  });
});
