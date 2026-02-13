import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login: authLogin } = useAuthStore()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.department || !formData.phone) {
      toast.error('请填写完整信息')
      return
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      toast.error('请输入有效的手机号')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.register(formData)
      authLogin(response.data.data.user, response.data.data.token)
      toast.success('注册成功！')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-deep-red via-chinese-red to-red-700 opacity-90"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="card chinese-border box-shadow-glow">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">🎊</div>
            <h1 className="font-display text-3xl font-bold gold-text mb-2">
              注册参与年会抽奖
            </h1>
            <p className="text-gray-600">
              请填写您的信息
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                姓名
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="请输入您的姓名"
                className="input-field"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                部门
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="请输入您的部门"
                className="input-field"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                手机号码
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="请输入手机号"
                className="input-field"
                maxLength={11}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">
              已有账号？
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-outline w-full"
            >
              立即登录
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-white/80 text-sm">
          <p>🧧 恭喜发财 · 新年快乐</p>
        </div>
      </div>
    </div>
  )
}
