import { create } from 'zustand'

export const useLotteryStore = create((set, get) => ({
  onlineCount: 0,
  winners: [],
  isLotteryActive: false,
  redPacketsFalling: [],
  fireworks: [],
  
  setOnlineCount: (count) => set({ onlineCount: count }),
  
  addWinner: (winner) => set((state) => ({
    winners: [winner, ...state.winners].slice(0, 50)
  })),
  
  setWinners: (winners) => set({ winners }),
  
  setLotteryActive: (active) => set({ isLotteryActive: active }),
  
  addRedPacket: (packet) => set((state) => ({
    redPacketsFalling: [...state.redPacketsFalling, packet]
  })),
  
  removeRedPacket: (id) => set((state) => ({
    redPacketsFalling: state.redPacketsFalling.filter(p => p.id !== id)
  })),
  
  addFirework: (firework) => set((state) => ({
    fireworks: [...state.fireworks, firework]
  })),
  
  removeFirework: (id) => set((state) => ({
    fireworks: state.fireworks.filter(f => f.id !== id)
  })),
  
  clearEffects: () => set({
    redPacketsFalling: [],
    fireworks: []
  }),
}))
