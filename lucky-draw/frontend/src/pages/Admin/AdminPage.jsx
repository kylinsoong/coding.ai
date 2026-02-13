import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { userAPI, redEnvelopeAPI, activityAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [redEnvelopes, setRedEnvelopes] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'users') {
        const response = await userAPI.getAll()
        setUsers(response.data.data)
      } else if (activeTab === 'redenvelopes') {
        const response = await redEnvelopeAPI.getAll()
        setRedEnvelopes(response.data.data)
      } else if (activeTab === 'activities') {
        const response = await activityAPI.getAll()
        setActivities(response.data.data)
      }
    } catch (error) {
      toast.error('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'users', label: '用户管理', icon: '👥' },
    { id: 'redenvelopes', label: '红包管理', icon: '🧧' },
    { id: 'activities', label: '活动管理', icon: '🎊' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card chinese-border box-shadow-glow mb-8"
      >
        <h1 className="font-display text-3xl font-bold gold-text text-center mb-6">
          🎊 后台管理系统
        </h1>

        <div className="flex justify-center space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-chinese-red text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card chinese-border box-shadow-glow"
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-imperial-gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div>
                <h2 className="font-display text-xl font-bold text-chinese-red mb-6">
                  用户列表 ({users.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 bg-spring-red-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-imperial-gold flex items-center justify-center text-deep-red font-bold">
                          {user.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                          <span className="text-sm text-gray-500">
                            {user.isOnline ? '在线' : '离线'}
                          </span>
                        </div>
                        {user.hasWon && (
                          <span className="text-xs text-imperial-gold font-bold">
                            已中奖
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'redenvelopes' && (
              <div>
                <h2 className="font-display text-xl font-bold text-chinese-red mb-6">
                  红包列表 ({redEnvelopes.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {redEnvelopes.map((envelope) => (
                    <div
                      key={envelope._id}
                      className="p-4 bg-spring-red-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-800">{envelope.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          envelope.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {envelope.isActive ? '进行中' : '已结束'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="text-gray-500">金额范围:</span>
                          <span className="ml-2 font-medium">¥{envelope.minAmount} - ¥{envelope.maxAmount}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">中奖概率:</span>
                          <span className="ml-2 font-medium">{envelope.winProbability}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">剩余:</span>
                          <span className="ml-2 font-medium">{envelope.remainingPackets}/{envelope.totalPackets}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">轮次:</span>
                          <span className="ml-2 font-medium">{envelope.round}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div>
                <h2 className="font-display text-xl font-bold text-chinese-red mb-6">
                  活动列表 ({activities.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activities.map((activity) => (
                    <div
                      key={activity._id}
                      className="p-4 bg-spring-red-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-800">{activity.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'active' ? 'bg-green-100 text-green-700' :
                          activity.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {activity.status === 'active' ? '进行中' :
                           activity.status === 'completed' ? '已结束' :
                           activity.status === 'draft' ? '草稿' : '暂停'}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="text-gray-500">开始时间:</span>
                          <span className="ml-2">{new Date(activity.startDate).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">结束时间:</span>
                          <span className="ml-2">{new Date(activity.endDate).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">最大参与人数:</span>
                          <span className="ml-2 font-medium">{activity.maxParticipants}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
