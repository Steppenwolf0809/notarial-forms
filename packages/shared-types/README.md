# Shared Types Package

Tipos compartidos y validaciones Zod para el sistema de formularios notariales ecuatorianos.

## 🏗️ Arquitectura

```
src/
├── schemas/          # Esquemas de validación Zod
│   ├── person.ts     # Validaciones de personas (cédulas, RUCs, pasaportes)
│   ├── vehicle.ts    # Validaciones de vehículos (placas ecuatorianas)
│   ├── document.ts   # Datos extraídos y confianza
│   └── session.ts    # Sesiones activas y cola de trámites
├── types/            # Tipos TypeScript inferidos
│   └── index.ts      # Todos los tipos exportados
├── stores/           # Estado global con Zustand
│   └── queue.ts      # Gestión de cola en tiempo real
└── index.ts          # Exports principales
```

## 📋 Schemas Principales

### PersonSchema - Personas Ecuatorianas
```typescript
import { PersonSchema } from '@notarial-forms/shared-types'

// Validación de cédulas ecuatorianas (10 dígitos exactos)
// RUCs (13 dígitos terminados en 001)
// Pasaportes alfanuméricos
// Roles: COMPRADOR/VENDEDOR/REPRESENTANTE
```

### VehicleSchema - Vehículos Ecuador
```typescript
import { VehicleSchema } from '@notarial-forms/shared-types'

// Placas formato ABC-1234 o ABC1234
// Campos obligatorios: marca, placa, motor, chasis
```

### ExtractedDataSchema - Datos OCR + Artículo 29
```typescript
import { ExtractedDataSchema } from '@notarial-forms/shared-types'

// Array personas mínimo 1
// Confidence score 0-1
// Tipos: PDF_EXTRACTO/PDF_DILIGENCIA/SCREENSHOT_VEHICULO
// NUEVOS: PDF_SOCIETARIO/PDF_FIDUCIARIO/PDF_DONACION/PDF_CONSORCIO

// Campos Artículo 29:
// valorOperacion, moneda, formaPago, esOperacionCompleta
// pagoAnterior, requiereDeclaracion, observacionesPago
```

### ActiveSessionSchema - Cola de Trámites
```typescript
import { ActiveSessionSchema } from '@notarial-forms/shared-types'

// Cliente extraído de personas
// 30+ tipos de trámites notariales (incluye SOCIETARIO, FIDUCIARIO, CONSORCIO)
// Position único por notaría
// Expira en 2 horas automáticamente
```

## 🏪 Store Zustand

### Queue Store con subscribeWithSelector
```typescript
import { useQueueStore } from '@notarial-forms/shared-types'

// Estado
const activeSessions = useQueueStore(state => state.activeSessions)
const currentDocument = useQueueStore(state => state.currentDocument)
const isProcessing = useQueueStore(state => state.isProcessing)

// Acciones
const { addToQueue, removeFromQueue, setCurrentDocument } = useQueueStore()

// Computed
const totalActive = useQueueStore(state => state.getTotalActiveCount())
const sessionByPosition = useQueueStore(state => state.getSessionByPosition(5))
```

### Real-time Updates
```typescript
import { subscribeToQueueChanges } from '@notarial-forms/shared-types'

// Suscripción a cambios de cola
const unsubscribe = subscribeToQueueChanges((sessions) => {
  console.log('Cola actualizada:', sessions.length)
})
```

## 🇪🇨 Validaciones Ecuador

### Cédulas Ecuatorianas
```typescript
import { validateCedula, isValidCedula } from '@notarial-forms/shared-types'

isValidCedula('0123456789') // true - 10 dígitos exactos
```

### RUCs Empresas
```typescript
import { validateRuc, isValidRuc } from '@notarial-forms/shared-types'

isValidRuc('0123456789001') // true - 13 dígitos + 001
```

### Placas Vehículos
```typescript
import { validatePlateFormat, formatPlate } from '@notarial-forms/shared-types'

validatePlateFormat('ABC-1234') // true
validatePlateFormat('ABC1234')  // true
formatPlate('ABC1234') // 'ABC-1234'
```

## 📊 Tipos de Trámites + Artículo 29

30+ tipos extraídos de documentos notariales:

```typescript
type TramiteType = 
  | 'COMPRAVENTA'
  | 'VEHICULO'
  | 'ESCRITURA_PUBLICA'
  | 'TESTAMENTO'
  | 'PODER_GENERAL'
  | 'HIPOTECA'
  | 'CONSTITUCION_COMPANIA'
  | 'SOCIETARIO'      // NUEVO - Artículo 29
  | 'FIDUCIARIO'      // NUEVO - Artículo 29
  | 'CONSORCIO'       // NUEVO - Artículo 29
  // ... y 20+ más
```

### 🏛️ Nuevos Enums Artículo 29
```typescript
type FormaPago = 'EFECTIVO' | 'TRANSFERENCIA' | 'CHEQUE' | 'FINANCIAMIENTO' | 'MIXTO'
type Moneda = 'USD' | 'DOLARES'
type ExtractionType = 'PDF_SOCIETARIO' | 'PDF_FIDUCIARIO' | 'PDF_DONACION' | 'PDF_CONSORCIO'
```

## 🚀 Uso

### Instalación
```bash
npm install
npm run build
```

### Desarrollo
```bash
npm run dev  # TypeScript watch mode
```

### En otros packages
```typescript
import { 
  PersonSchema, 
  VehicleSchema,
  useQueueStore,
  type Person,
  type Vehicle 
} from '@notarial-forms/shared-types'
```

## ⚙️ Configuración

### TypeScript Strict Mode
- `exactOptionalPropertyTypes: true`
- `noImplicitReturns: true`
- `noUncheckedIndexedAccess: true`

### Zero Defaults
- Todos los datos OCR sin valores por defecto
- Nacionalidad obligatoria sin default
- Confidence scores explícitos

## 🔍 Constantes Ecuador

```typescript
import { ECUADOR_CONSTANTS } from '@notarial-forms/shared-types'

ECUADOR_CONSTANTS.CEDULA.REGEX      // /^\d{10}$/
ECUADOR_CONSTANTS.RUC.REGEX         // /^\d{13}001$/
ECUADOR_CONSTANTS.VEHICLE_PLATE     // Formatos válidos

// Helpers Artículo 29
isArticle29Document(tipo)           // Requiere info pago
requiresMonedaField(valorOperacion) // >= $10,000 USD
requiresDeclaracionField(valor, pago) // < $10,000 y pagado
```

## 📝 Mensajes de Error

Todos los mensajes en español:
```typescript
import { ERROR_MESSAGES } from '@notarial-forms/shared-types'

ERROR_MESSAGES.INVALID_CEDULA     // "Cédula ecuatoriana inválida..."
ERROR_MESSAGES.INVALID_PLATE      // "Placa inválida. Formato debe ser..."
ERROR_MESSAGES.MISSING_MONEDA     // "Para operaciones de $10,000 USD..."
ERROR_MESSAGES.INVALID_PAYMENT_INFO // "Documentos societarios requieren..."
```

## 🔧 Tecnologías

- **Zod 3.22.4** - Validación de esquemas
- **Zustand 4.4.1** - Estado global con subscribeWithSelector
- **TypeScript** - Strict mode
- **Day.js** - Manejo de fechas

## 📈 Real-time Features

- Actualizaciones automáticas de cola
- Suscripciones granulares por estado
- Eventos de sesión en tiempo real
- Métricas en vivo de productividad