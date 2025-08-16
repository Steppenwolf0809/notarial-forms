import { prisma } from './index.js'
import dayjs from 'dayjs'

async function seed() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.extractedField.deleteMany()
  await prisma.activeSession.deleteMany()
  await prisma.document.deleteMany()

  // Create sample documents
  const document1 = await prisma.document.create({
    data: {
      type: 'Escritura Pública',
      fileName: 'escritura_001.pdf',
      status: 'PENDING',
    },
  })

  const document2 = await prisma.document.create({
    data: {
      type: 'Testamento',
      fileName: 'testamento_002.pdf',
      status: 'PROCESSING',
    },
  })

  // Create active sessions
  await prisma.activeSession.create({
    data: {
      documentId: document1.id,
      clientName: 'Juan Pérez',
      position: 1,
      expiresAt: dayjs().add(1, 'hour').toDate(),
    },
  })

  await prisma.activeSession.create({
    data: {
      documentId: document2.id,
      clientName: 'María García',
      position: 2,
      expiresAt: dayjs().add(2, 'hours').toDate(),
    },
  })

  // Create extracted fields
  await prisma.extractedField.create({
    data: {
      documentId: document1.id,
      fieldName: 'client_name',
      value: 'Juan Pérez',
      confidence: 0.95,
    },
  })

  await prisma.extractedField.create({
    data: {
      documentId: document1.id,
      fieldName: 'document_date',
      value: '2024-01-15',
      confidence: 0.88,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📄 Created ${await prisma.document.count()} documents`)
  console.log(`🔄 Created ${await prisma.activeSession.count()} active sessions`)
  console.log(`📋 Created ${await prisma.extractedField.count()} extracted fields`)
}

seed()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })