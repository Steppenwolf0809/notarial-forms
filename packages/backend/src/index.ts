import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { z } from 'zod'
import dayjs from 'dayjs'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors())
app.use(express.json())

const healthSchema = z.object({
  timestamp: z.string(),
  status: z.literal('healthy'),
  uptime: z.number()
})

app.get('/api/health', (req, res) => {
  const health = healthSchema.parse({
    timestamp: dayjs().toISOString(),
    status: 'healthy' as const,
    uptime: process.uptime()
  })
  
  res.json(health)
})

app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello from Notarial Forms API!',
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})