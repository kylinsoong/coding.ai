import { io } from 'socket.io-client'
import { useAuthStore } from '../store/authStore'
import { useLotteryStore } from '../store/lotteryStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket = null

export const connectSocket = () => {
  if (socket?.connected) return socket

  const { user } = useAuthStore.getState()
  
  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  })

  socket.on('connect', () => {
    console.log('Socket connected')
    if (user?.id) {
      socket.emit('user:join', user.id)
    }
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.on('user:online', (data) => {
    console.log('User online:', data)
  })

  socket.on('user:offline', (data) => {
    console.log('User offline:', data)
  })

  socket.on('stats:online', (data) => {
    useLotteryStore.getState().setOnlineCount(data.count)
  })

  socket.on('lottery:started', (data) => {
    useLotteryStore.getState().setLotteryActive(true)
  })

  socket.on('lottery:winner', (data) => {
    useLotteryStore.getState().addWinner(data)
  })

  socket.on('redpacket:falling', (data) => {
    useLotteryStore.getState().addRedPacket(data)
  })

  socket.on('firework:exploded', (data) => {
    useLotteryStore.getState().addFirework(data)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket

export const emitLotteryTrigger = (data) => {
  if (socket?.connected) {
    socket.emit('lottery:trigger', data)
  }
}

export const emitLotteryResult = (data) => {
  if (socket?.connected) {
    socket.emit('lottery:result', data)
  }
}

export const emitRedPacketFall = (data) => {
  if (socket?.connected) {
    socket.emit('redpacket:fall', data)
  }
}

export const emitFireworkLaunch = (data) => {
  if (socket?.connected) {
    socket.emit('firework:launch', data)
  }
}
