import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { connectSocket, disconnectSocket } from '../../services/socket'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Lantern from '../Lantern/Lantern'
import Fireworks from '../Fireworks/Fireworks'

export default function Layout({ children }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    connectSocket()
    return () => {
      disconnectSocket()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      disconnectSocket()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Lantern />
      <Fireworks />
      
      <Header user={user} onLogout={handleLogout} />
      
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}
