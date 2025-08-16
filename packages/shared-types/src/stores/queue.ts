import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { z } from 'zod'
import dayjs from 'dayjs'
import { 
  ActiveSessionSchema, 
  TramiteTypeSchema,
  SessionStatusSchema,
  generateSessionId
} from '../schemas/session.js'
import { ExtractedDataSchema } from '../schemas/document.js'

// Infer types from Zod schemas
type ActiveSession = z.infer<typeof ActiveSessionSchema>
type ExtractedData = z.infer<typeof ExtractedDataSchema>
type TramiteType = z.infer<typeof TramiteTypeSchema>
type SessionStatus = z.infer<typeof SessionStatusSchema>

// Queue store state interface
interface QueueState {
  // Main state
  activeSessions: ActiveSession[]
  currentDocument: ExtractedData | null
  isProcessing: boolean
  
  // Notary office info
  notaryId: string
  notaryName: string
  
  // Queue statistics
  totalSessionsToday: number
  averageWaitTimeMinutes: number
  lastUpdated: string
  
  // Real-time updates flag
  isRealTimeEnabled: boolean
}

// Queue store actions interface
interface QueueActions {
  // Session management
  setActiveSessions: (sessions: ActiveSession[]) => void
  addToQueue: (sessionData: Omit<ActiveSession, 'id' | 'createdAt' | 'updatedAt' | 'position'>) => Promise<ActiveSession>
  removeFromQueue: (sessionId: string) => void
  updateSession: (sessionId: string, updates: Partial<ActiveSession>) => void
  moveSessionPosition: (sessionId: string, newPosition: number) => void
  
  // Document management
  setCurrentDocument: (document: ExtractedData | null) => void
  
  // Processing state
  setProcessing: (isProcessing: boolean) => void
  
  // Queue operations
  clearExpiredSessions: () => void
  pauseSession: (sessionId: string) => void
  resumeSession: (sessionId: string) => void
  completeSession: (sessionId: string) => void
  
  // Real-time updates
  enableRealTime: () => void
  disableRealTime: () => void
  
  // Notary office management
  setNotaryInfo: (notaryId: string, notaryName: string) => void
  
  // Statistics
  updateStatistics: () => void
  resetDailyStats: () => void
}

// Computed getters interface
interface QueueComputed {
  // Session queries
  getSessionByPosition: (position: number) => ActiveSession | undefined
  getSessionById: (sessionId: string) => ActiveSession | undefined
  getSessionsByStatus: (status: SessionStatus) => ActiveSession[]
  getSessionsByTramiteType: (type: TramiteType) => ActiveSession[]
  
  // Queue statistics
  getTotalActiveCount: () => number
  getWaitingCount: () => number
  getProcessingCount: () => number
  getNextPosition: () => number
  getUsedPositions: () => number[]
  
  // Time calculations
  getEstimatedWaitTime: (position: number) => number
  getAverageProcessingTime: () => number
  
  // Queue health
  getExpiredSessions: () => ActiveSession[]
  getOverdueThreshold: () => number
}

// Combined store interface
type QueueStore = QueueState & QueueActions & QueueComputed

// Initial state
const initialState: QueueState = {
  activeSessions: [],
  currentDocument: null,
  isProcessing: false,
  notaryId: '',
  notaryName: '',
  totalSessionsToday: 0,
  averageWaitTimeMinutes: 0,
  lastUpdated: dayjs().toISOString(),
  isRealTimeEnabled: false
}

// Create the Zustand store with subscribeWithSelector middleware
export const useQueueStore = create<QueueStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    ...initialState,
    
    // Session management actions
    setActiveSessions: (sessions) => {
      set({ 
        activeSessions: sessions.sort((a, b) => a.position - b.position),
        lastUpdated: dayjs().toISOString()
      })
    },
    
    addToQueue: async (sessionData) => {
      const state = get()
      const nextPosition = state.getNextPosition()
      
      const newSession: ActiveSession = {
        ...sessionData,
        id: generateSessionId(),
        position: nextPosition,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        status: 'WAITING'
      }
      
      // Validate session before adding
      const validation = ActiveSessionSchema.safeParse(newSession)
      if (!validation.success) {
        throw new Error(`Invalid session data: ${validation.error.message}`)
      }
      
      set((state) => ({
        activeSessions: [...state.activeSessions, newSession].sort((a, b) => a.position - b.position),
        lastUpdated: dayjs().toISOString()
      }))
      
      return newSession
    },
    
    removeFromQueue: (sessionId) => {
      set((state) => ({
        activeSessions: state.activeSessions.filter(session => session.id !== sessionId),
        lastUpdated: dayjs().toISOString()
      }))
    },
    
    updateSession: (sessionId, updates) => {
      set((state) => ({
        activeSessions: state.activeSessions.map(session =>
          session.id === sessionId
            ? { ...session, ...updates, updatedAt: dayjs().toISOString() }
            : session
        ),
        lastUpdated: dayjs().toISOString()
      }))
    },
    
    moveSessionPosition: (sessionId, newPosition) => {
      const state = get()
      const usedPositions = state.getUsedPositions()
      
      if (usedPositions.includes(newPosition)) {
        throw new Error(`Position ${newPosition} is already occupied`)
      }
      
      state.updateSession(sessionId, { position: newPosition })
    },
    
    // Document management
    setCurrentDocument: (document) => {
      set({ 
        currentDocument: document,
        lastUpdated: dayjs().toISOString()
      })
    },
    
    // Processing state
    setProcessing: (isProcessing) => {
      set({ 
        isProcessing,
        lastUpdated: dayjs().toISOString()
      })
    },
    
    // Queue operations
    clearExpiredSessions: () => {
      const now = dayjs()
      set((state) => ({
        activeSessions: state.activeSessions.filter(session => 
          dayjs(session.expires).isAfter(now)
        ),
        lastUpdated: dayjs().toISOString()
      }))
    },
    
    pauseSession: (sessionId) => {
      get().updateSession(sessionId, { status: 'PAUSED' })
    },
    
    resumeSession: (sessionId) => {
      get().updateSession(sessionId, { status: 'WAITING' })
    },
    
    completeSession: (sessionId) => {
      get().updateSession(sessionId, { 
        status: 'COMPLETED',
        completedAt: dayjs().toISOString()
      })
    },
    
    // Real-time updates
    enableRealTime: () => {
      set({ isRealTimeEnabled: true })
    },
    
    disableRealTime: () => {
      set({ isRealTimeEnabled: false })
    },
    
    // Notary office management
    setNotaryInfo: (notaryId, notaryName) => {
      set({ notaryId, notaryName })
    },
    
    // Statistics
    updateStatistics: () => {
      const state = get()
      const completedSessions = state.activeSessions.filter(s => s.status === 'COMPLETED')
      const totalWaitTime = completedSessions.reduce((sum, session) => {
        if (session.waitTimeMinutes) {
          return sum + session.waitTimeMinutes
        }
        return sum
      }, 0)
      
      const averageWaitTime = completedSessions.length > 0 
        ? totalWaitTime / completedSessions.length 
        : 0
      
      set({
        totalSessionsToday: completedSessions.length,
        averageWaitTimeMinutes: Math.round(averageWaitTime),
        lastUpdated: dayjs().toISOString()
      })
    },
    
    resetDailyStats: () => {
      set({
        totalSessionsToday: 0,
        averageWaitTimeMinutes: 0,
        lastUpdated: dayjs().toISOString()
      })
    },
    
    // Computed getters
    getSessionByPosition: (position) => {
      return get().activeSessions.find(session => session.position === position)
    },
    
    getSessionById: (sessionId) => {
      return get().activeSessions.find(session => session.id === sessionId)
    },
    
    getSessionsByStatus: (status) => {
      return get().activeSessions.filter(session => session.status === status)
    },
    
    getSessionsByTramiteType: (type) => {
      return get().activeSessions.filter(session => session.tramiteType === type)
    },
    
    getTotalActiveCount: () => {
      return get().activeSessions.length
    },
    
    getWaitingCount: () => {
      return get().activeSessions.filter(session => session.status === 'WAITING').length
    },
    
    getProcessingCount: () => {
      return get().activeSessions.filter(session => session.status === 'ACTIVE').length
    },
    
    getNextPosition: () => {
      const sessions = get().activeSessions
      if (sessions.length === 0) return 1
      
      const maxPosition = Math.max(...sessions.map(s => s.position))
      return maxPosition + 1
    },
    
    getUsedPositions: () => {
      return get().activeSessions.map(session => session.position)
    },
    
    getEstimatedWaitTime: (position) => {
      const state = get()
      const sessionsAhead = state.activeSessions.filter(s => s.position < position)
      const averageTime = state.averageWaitTimeMinutes || 15 // Default 15 minutes
      return sessionsAhead.length * averageTime
    },
    
    getAverageProcessingTime: () => {
      const sessions = get().activeSessions.filter(s => s.processingTimeMinutes)
      if (sessions.length === 0) return 0
      
      const totalTime = sessions.reduce((sum, s) => sum + (s.processingTimeMinutes || 0), 0)
      return Math.round(totalTime / sessions.length)
    },
    
    getExpiredSessions: () => {
      const now = dayjs()
      return get().activeSessions.filter(session => 
        dayjs(session.expires).isBefore(now)
      )
    },
    
    getOverdueThreshold: () => {
      const averageTime = get().averageWaitTimeMinutes
      return averageTime * 1.5 // 150% of average time
    }
  }))
)

// Selectors for specific state slices
export const useActiveSessions = () => useQueueStore(state => state.activeSessions)
export const useCurrentDocument = () => useQueueStore(state => state.currentDocument)
export const useIsProcessing = () => useQueueStore(state => state.isProcessing)
export const useQueueStats = () => useQueueStore(state => ({
  total: state.getTotalActiveCount(),
  waiting: state.getWaitingCount(),
  processing: state.getProcessingCount(),
  averageWait: state.averageWaitTimeMinutes
}))

// Real-time subscription helpers
export const subscribeToQueueChanges = (callback: (sessions: ActiveSession[]) => void) => {
  return useQueueStore.subscribe(
    state => state.activeSessions,
    callback,
    { fireImmediately: true }
  )
}

export const subscribeToProcessingState = (callback: (isProcessing: boolean) => void) => {
  return useQueueStore.subscribe(
    state => state.isProcessing,
    callback,
    { fireImmediately: true }
  )
}