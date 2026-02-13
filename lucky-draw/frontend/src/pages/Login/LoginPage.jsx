import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { qrCode } = useParams()
  const { login: authLogin } = useAuthStore()

  useEffect(() => {
    if (qrCode) {
      toast.success('扫码成功，请输入手机号登录')
    }
  }, [qrCode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phone) {
      toast.error('请输入手机号')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.login({ phone })
      authLogin(response.data.data.user, response.data.data.token)
      toast.success('登录成功！')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || '登录失败，请重试')
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
            <div className="text-6xl mb-4 animate-bounce">🧧</div>
            <h1 className="font-display text-3xl font-bold gold-text mb-2">
              欢迎参与年会抽奖
            </h1>
            <p className="text-gray-600">
              请输入您的手机号登录
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                手机号码
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">
              还没有账号？
            </p>
            <button
              onClick={() => navigate('/register')}
              className="btn-outline w-full"
            >
              立即注册
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-white/80 text-sm">
          <p>🎊 2026新春盛典 · 恭候您的到来</p>
        </div>
      </div>
    </div>
  )
}
