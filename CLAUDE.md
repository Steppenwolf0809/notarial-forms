# claude.md - Sistema de Formularios Notariales

## Contexto del Proyecto

**Sistema de automatización para formularios notariales ecuatorianos** que extrae datos de documentos mediante OCR y genera formularios pre-llenados con cola de trámites en tiempo real.

### **Problema que Resuelve:**
Los usuarios deben llenar manualmente formularios extensos (personas naturales/jurídicas) con datos que ya están disponibles en extractos notariales y sistemas de vehículos.

### **Solución:**
1. **Matriculador** sube documento (PDF extracto o screenshot sistema)
2. **OCR extrae** datos automáticamente con validación
3. **Sistema genera** formulario pre-llenado 
4. **Usuario accede** via QR estático, selecciona su trámite
5. **Usuario completa** información faltante (teléfonos, direcciones)
6. **Sistema genera** PDF final para firma

## Stack Tecnológico

```
Frontend: React + TypeScript + Vite + Tailwind CSS
Backend: Node.js + Express + TypeScript  
Base de Datos: PostgreSQL + Prisma ORM
OCR: Tesseract.js (español) + Sharp para preprocessing
Estado: Zustand + Socket.io (tiempo real)
Validación: Zod schemas (datos ecuatorianos)
Fechas: DayJS (formato español)
Animaciones: Framer Motion
Forms: React Hook Form + Zod resolver
```

## Arquitectura del Proyecto

```
notarial-forms/ (monorepo)
├── apps/
│   ├── web/                     # React frontend
│   │   ├── src/components/      # UI components
│   │   ├── src/pages/          # Rutas principales
│   │   └── src/hooks/          # Custom hooks
│   └── api/                     # Express backend
│       ├── routes/             # API endpoints
│       ├── middleware/         # Auth, validation
│       └── services/           # Business logic
├── packages/
│   ├── database/               # Prisma models
│   ├── shared-types/           # Zod schemas + types
│   ├── document-processor/     # OCR + extraction
│   ├── session-queue/          # Cola trámites
│   ├── form-generator/         # Formularios dinámicos
│   └── pdf-generator/          # PDF final
```

## Modelos de Datos Principales

### **Document**
```typescript
- id: string (cuid)
- type: PDF_EXTRACTO | PDF_DILIGENCIA | SCREENSHOT_VEHICULO
- fileName: string
- filePath: string  
- status: UPLOADED | PROCESSING | EXTRACTED | SESSION_ACTIVE | COMPLETED
- createdAt: DateTime
```

### **ActiveSession** (Cola de Trámites)
```typescript
- id: string
- documentId: string
- notariaId: string ('NOTARIA_18_QUITO')
- clientName: string (extraído automáticamente)
- tramiteType: string (COMPRAVENTA | VEHÍCULO | DILIGENCIA)
- position: number (orden en cola)
- status: ACTIVE | COMPLETED | EXPIRED
- expiresAt: DateTime (2 horas default)
```

### **ExtractedField**
```typescript
- id: string
- documentId: string
- fieldName: string
- value: string
- confidence: number (0-1, precisión OCR)
```

## Tipos de Documentos

### **1. Extractos Notariales (PDF)**
- **Estructura:** Tabular, datos organizados
- **Extrae:** Nombres, cédulas, fechas, valores, ubicación
- **Precisión esperada:** 90-95%
- **Ejemplo:** "STACEY CHIRIBOGA CARLOS MANUEL", cédula "1700936170"

### **2. Screenshots de Vehículos (Imagen)**
- **Estructura:** Tablas HTML capturadas
- **Extrae:** Compradores, vendedores, datos del vehículo
- **Precisión esperada:** 95-99%
- **Ejemplo:** TOYOTA, placa BBW0223, motor 3ZZ3201336

### **3. Diligencias (PDF)**
- **Estructura:** Texto corrido narrativo
- **Extrae:** Personas, fechas, ubicaciones
- **Precisión esperada:** 75-85%

## Validaciones Específicas Ecuador

### **Cédulas Ecuatorianas**
```regex
/^\d{10}$/  # Exactamente 10 dígitos
```

### **RUCs**
```regex
/^\d{13}001$/  # 13 dígitos terminados en 001
```

### **Placas de Vehículos**
```regex
/^[A-Z]{3}[-]?\d{3,4}$/  # ABC-1234 o ABC1234
```

### **Fechas en Español**
```
Formatos: "24 DE JUNIO DEL 2025", "DD/MM/YYYY"
Librería: DayJS con locale 'es'
```

## Flujo de Usuario Completo

### **Lado Matriculador:**
1. Sube documento (PDF/imagen)
2. Sistema procesa con OCR automáticamente
3. Revisa datos extraídos, corrige si necesario
4. **Activa sesión** → Cliente aparece en cola
5. Entrega código o permite escanear QR estático

### **Lado Cliente:**
1. Escanea QR estático de la notaría
2. Ve lista de trámites activos en tiempo real
3. Selecciona su trámite por nombre
4. Completa campos faltantes en formulario pre-llenado
5. Envía formulario completado
6. Recibe confirmación

### **Sistema en Tiempo Real:**
- **Socket.io** actualiza cola automáticamente
- **Zustand** mantiene estado sincronizado
- **Framer Motion** anima transiciones

## Principios de Desarrollo

### **SOLID:**
- **S:** Cada package tiene responsabilidad única
- **O:** Extensible para nuevos tipos de documentos
- **L:** Extractors intercambiables (Tesseract ↔ Google Vision)
- **I:** Interfaces específicas por funcionalidad
- **D:** Dependencias por abstracciones

### **KISS:**
- Funcionalidad mínima viable primero
- UI simple pero efectiva
- Complejidad incremental

### **DRY:**
- Schemas Zod reutilizables
- Componentes React modulares
- Utilidades compartidas

## Configuraciones Específicas

### **Tesseract OCR:**
```typescript
{
  lang: 'spa',                    // Español
  tessedit_pageseg_mode: '6',     // Tabla estructurada
  tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789áéíóúÁÉÍÓÚñÑ .,:-'
}
```

### **DayJS:**
```typescript
import 'dayjs/locale/es'
dayjs.locale('es')
dayjs.extend(customParseFormat)
```

### **Socket.io Events:**
```typescript
// Cliente → Servidor
'join-notaria': { notariaId: string }
'complete-session': { sessionId: string }

// Servidor → Cliente  
'queue-updated': { sessions: ActiveSession[] }
'session-ready': { sessionId: string }
```

## Métricas de Calidad

### **OCR Performance:**
- Extractos: ≥90% campos extraídos correctamente
- Screenshots: ≥95% precisión en datos estructurados
- Diligencias: ≥75% información básica extraída

### **UX Performance:**
- Upload: <5s procesamiento inicial
- Cola tiempo real: <1s latencia updates
- Formularios: <2s generación desde datos extraídos

### **Sistema:**
- Soporte 10+ trámites simultáneos por notaría
- Sesiones expiran en 2 horas automáticamente
- Backup automático de datos extraídos

## Deploy y Entornos

### **Desarrollo:**
- Local: Docker Compose
- DB: PostgreSQL local o Railway
- Files: Storage local

### **Testing:**
- Platform: Railway
- DB: Railway PostgreSQL
- Files: Railway volumes

### **Producción:**
- Server: Servidor privado notaría
- DB: PostgreSQL dedicado
- Files: Storage local encriptado
- Backup: Automatizado diario

## Dependencias Principales

```json
{
  "zod": "^3.22.4",              // Validación
  "dayjs": "^1.11.10",           // Fechas ES
  "zustand": "^4.4.1",           // Estado
  "framer-motion": "^10.16.4",   // Animaciones  
  "react-hook-form": "^7.47.0",  // Formularios
  "tesseract.js": "^4.1.4",      // OCR
  "socket.io": "^4.7.5",         // Real-time
  "sharp": "^0.32.6",            // Imagen processing
  "@prisma/client": "^5.x",      // Database
  "qrcode": "^1.5.3"             // QR generation
}
```

## Comandos de Desarrollo

```bash
# Desarrollo
npm run dev              # Start both apps
npm run dev:web          # Frontend only  
npm run dev:api          # Backend only

# Base de datos
npm run db:migrate       # Run migrations
npm run db:generate      # Generate Prisma client
npm run db:studio        # Open Prisma Studio

# Build
npm run build           # Build all packages
npm run build:web       # Build frontend
npm run build:api       # Build backend
```

## Notas Importantes

### **Seguridad:**
- Archivos subidos se encriptan automáticamente
- Sesiones expiran en 2 horas máximo
- Rate limiting en uploads (5 archivos/minuto)
- Validación estricta de tipos de archivo

### **Performance:**
- Tesseract worker pool para OCR paralelo
- Zustand subscribeWithSelector para updates selectivos
- Sharp para optimización de imágenes
- React.memo en componentes de cola

### **Escalabilidad:**
- Arquitectura modular permite agregar notarías
- OCR engines intercambiables (Tesseract ↔ Google Vision)
- Fácil extensión para nuevos tipos de documentos
- Base de datos preparada para multi-tenancy

---

**Contacto del Proyecto:**
- Sistema diseñado para Notaría Décima Octava, Quito
- Optimizado para documentos ecuatorianos
- Principios SOLID aplicados desde el inicio