# Python REST服务

这个REST服务用于调用外部controller REST服务，处理音频文件。

## 功能

- 提供API接口，接收controller URL、认证令牌和音频文件URL
- 从环境变量读取默认的controller URL和认证令牌
- 调用外部controller REST服务，传递必要的参数
- 返回外部服务的响应结果
- 提供Swagger UI和API文档

## 依赖

- Flask: 用于构建REST API
- Requests: 用于发送HTTP请求到外部服务
- Flasgger: 用于生成Swagger UI和API文档
- python-dotenv: 用于加载环境变量

## 安装

1. 进入feature目录：
```bash
cd feature
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

## 配置

1. 复制.env.example文件为.env：
```bash
cp .env.example .env
```

2. 编辑.env文件，设置环境变量：
```bash
# Controller服务配置
CONTROLLER_URL=https://controller.example.com/api
TOKEN=your_auth_token

# 服务配置
HOST=0.0.0.0
PORT=5000
```

## 运行

```bash
python rest_service.py
```

服务将在 `http://localhost:5000` 启动。

## API接口

### 1. 调用外部controller服务

**URL**: `/api/call-controller`

**方法**: POST

**请求体**:
```json
{
  "url": "https://example.com/controller/api",  // 可选，默认从环境变量获取
  "token": "your_auth_token",  // 可选，默认从环境变量获取
  "audio_file_url": "https://example.com/audio.wav"  // 必填
}
```

**响应**:

返回外部controller服务的响应结果。

### 2. 健康检查

**URL**: `/health`

**方法**: GET

**响应**:
```json
{
  "status": "healthy"
}
```

### 3. Swagger UI

**URL**: `/apidocs`

**描述**: 提供交互式API文档，可以测试API接口。

## 示例

### 使用默认环境变量

```bash
curl --location "http://localhost:5000/api/call-controller" \
  --header "Content-Type: application/json" \
  --data '{
    "audio_file_url": "https://collection-systems.tos-cn-beijing.volces.com/202503151103-4acebc84-fdfa-4cee-9b9b-fd46fa71b138.wav?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Content-Sha256=UNSIGNED-PAYLOAD&X-Tos-Credential=AKTP0VyIce4T3PKjbQvwwqM8U1ZqOMxEaxh8NC5epLUz7B%2F20260210%2Fcn-beijing%2Ftos%2Frequest&X-Tos-Date=20260210T071625Z&X-Tos-Expires=3600&X-Tos-SignedHeaders=host&X-Tos-Security-Token=nChBESU9yNUNMTjRXYm1PaFpI.CiQKEEFaNDJTcXp6b1F0REx4S24SEEdRpuCiokXUkxLDEdN3yzEQvKqrzAYYzMarzAYg-ri06QcoAjCTnZwaOglzb25nemhpcWlCCnN0b3JhZ2VfZmVKqQF7IlN0YXRlbWVudCI6W3siRWZmZWN0IjoiQWxsb3ciLCJBY3Rpb24iOlsidG9zOioiLCJ0b3N2ZWN0b3JzOioiLCJrbXM6KiIsImNsb3VkX2RldGVjdDoqIiwiY2VydF9zZXJ2aWNlOioiLCJzaGFkb3c6KiIsImthZmthOioiLCJyb2NrZXRtcToqIiwiY2RuOioiXSwiUmVzb3VyY2UiOlsiKiJdfV19Uglzb25nemhpcWlYBGAB.XkxCSjBXFJHvRWoYr_Qb8eXdK__MFlQQIzKTKlYw0FrB_LjZ5IeNOGH7M2Z-55JT5u__1BfSqzBdigfIA798kw&X-Tos-Signature=28e2929e6c9f4d7ef62e10bf06ab6122396505967741eac31d2af86db7016c43"
  }'
```

### 覆盖环境变量

```bash
curl --location "http://localhost:5000/api/call-controller" \
  --header "Content-Type: application/json" \
  --data '{
    "url": "https://controller.example.com/api",
    "token": "override_token_789",
    "audio_file_url": "https://example.com/audio.wav"
  }'
```

## 注意事项

- 请确保提供有效的controller URL和认证令牌
- 音频文件URL必须是可访问的
- 可以通过环境变量或请求参数设置controller URL和令牌
- 请求参数的优先级高于环境变量
- Swagger UI可以通过访问`http://localhost:5000/apidocs`来使用
