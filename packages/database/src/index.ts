import { PrismaClient } from './generated/client/index.js'

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

export * from './generated/client/index.js'

export default prisma