# Database Package

Prisma ORM setup for the Notarial Forms system.

## Setup

### 1. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/notarial_forms?schema=public"
```

### 2. Database Operations

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Create and run migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database with sample data
npm run db:seed

# Reset database
npm run db:reset
```

## Models

### Document
- `id`: Unique identifier
- `type`: Document type (e.g., "Escritura Pública")
- `fileName`: Original file name
- `status`: PENDING | PROCESSING | COMPLETED | ERROR
- `createdAt`, `updatedAt`: Timestamps

### ActiveSession
- `id`: Unique identifier
- `documentId`: Reference to Document
- `clientName`: Client name
- `position`: Position in queue
- `expiresAt`: Session expiration time

### ExtractedField
- `id`: Unique identifier
- `documentId`: Reference to Document
- `fieldName`: Field identifier
- `value`: Extracted value
- `confidence`: Extraction confidence (0.0-1.0)

## Usage

```typescript
import { prisma } from '@notarial-forms/database'

// Create document
const document = await prisma.document.create({
  data: {
    type: 'Escritura Pública',
    fileName: 'document.pdf',
    status: 'PENDING'
  }
})

// Find documents with relations
const documents = await prisma.document.findMany({
  include: {
    activeSessions: true,
    extractedFields: true
  }
})
```