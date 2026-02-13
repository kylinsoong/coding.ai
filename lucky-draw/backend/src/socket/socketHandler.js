import User from '../models/User.js'

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on('user:join', async (userId) => {
      try {
        socket.userId = userId
        socket.join('users')

        const user = await User.findByIdAndUpdate(
          userId,
          { isOnline: true, lastActiveAt: Date.now() },
          { new: true }
        )

        if (user) {
          io.emit('user:online', {
            userId: user._id,
            name: user.name,
            isOnline: true,
          })

          const onlineCount = await User.countDocuments({ isOnline: true })
          io.emit('stats:online', { count: onlineCount })
        }
      } catch (error) {
        console.error('Error handling user join:', error)
      }
    })

    socket.on('user:leave', async () => {
      try {
        if (socket.userId) {
          const user = await User.findByIdAndUpdate(
            socket.userId,
            { isOnline: false },
            { new: true }
          )

          if (user) {
            io.emit('user:offline', {
              userId: user._id,
              name: user.name,
              isOnline: false,
            })

            const onlineCount = await User.countDocuments({ isOnline: true })
            io.emit('stats:online', { count: onlineCount })
          }
        }
      } catch (error) {
        console.error('Error handling user leave:', error)
      }
    })

    socket.on('lottery:trigger', (data) => {
      io.emit('lottery:started', data)
    })

    socket.on('lottery:result', (data) => {
      io.emit('lottery:winner', data)
    })

    socket.on('redpacket:fall', (data) => {
      io.emit('redpacket:falling', data)
    })

    socket.on('firework:launch', (data) => {
      io.emit('firework:exploded', data)
    })

    socket.on('disconnect', async () => {
      try {
        if (socket.userId) {
          const user = await User.findByIdAndUpdate(
            socket.userId,
            { isOnline: false },
            { new: true }
          )

          if (user) {
            io.emit('user:offline', {
              userId: user._id,
              name: user.name,
              isOnline: false,
            })

            const onlineCount = await User.countDocuments({ isOnline: true })
            io.emit('stats:online', { count: onlineCount })
          }
        }
        console.log(`Client disconnected: ${socket.id}`)
      } catch (error) {
        console.error('Error handling disconnect:', error)
      }
    })
  })

  return io
}
