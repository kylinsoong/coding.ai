from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import os
from flasgger import Swagger

# 加载环境变量
load_dotenv()

app = Flask(__name__)

# 配置 Swagger
swagger = Swagger(app, template={
    "info": {
        "title": "音频处理 REST 服务",
        "description": "调用外部 Controller REST 服务进行音频处理",
        "version": "1.0.0"
    },
    "basePath": "/api"
})


@app.route('/api/call-controller', methods=['POST'])
def call_controller():
    """
    调用外部 Controller REST 服务进行音频处理
    ---
    tags:
      - 音频处理
    parameters:
      - in: body
        name: 请求体
        required: true
        schema:
          type: object
          properties:
            audio_file_url:
              type: string
              description: 音频文件 URL (必填)
              example: https://example.com/audio.wav
          required:
            - audio_file_url
    responses:
      200:
        description: 音频处理成功
        schema:
          type: object
          description: 外部 Controller 服务的响应结果
      400:
        description: 请求参数错误
        schema:
          type: object
          properties:
            error:
              type: string
              description: 错误信息
      500:
        description: 服务内部错误
        schema:
          type: object
          properties:
            error:
              type: string
              description: 错误信息
    """
    try:
        # 获取请求参数
        data = request.get_json()
        
        # 验证必填参数
        if not data or 'audio_file_url' not in data:
            return jsonify({'error': 'audio_file_url 是必填参数'}), 400
        
        # 只从环境变量获取 Controller URL
        controller_url = os.getenv('CONTROLLER_URL')
        if not controller_url:
            return jsonify({'error': '未从环境变量中获取到 Controller URL'}), 400
        
        # 只从环境变量获取 TOKEN
        token = os.getenv('TOKEN')
        if not token:
            return jsonify({'error': '未从环境变量中获取到 TOKEN'}), 400
        
        # 准备请求数据
        audio_file_url = data['audio_file_url']
        request_data = {
            'audio_file': {
                'url': audio_file_url
            }
        }
        
        # 准备请求头
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        # 调用外部 controller REST 服务
        response = requests.post(controller_url, json=request_data, headers=headers)
        
        # 返回外部服务的响应结果
        return jsonify(response.json()), response.status_code
        
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'调用外部服务失败: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'服务内部错误: {str(e)}'}), 500

if __name__ == '__main__':
    # 从环境变量获取端口，默认 5000
    port = int(os.getenv('PORT', 5000))
    # 从环境变量获取主机，默认 127.0.0.1
    host = os.getenv('HOST', '127.0.0.1')
    
    app.run(host=host, port=port)
