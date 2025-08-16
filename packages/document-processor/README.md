# @notarial-forms/document-processor

Complete OCR document extraction engine for Ecuadorian notarial forms using Strategy Pattern and SOLID principles.

## Features

- **Complete OCR Extraction**: Extracts ALL possible data from Ecuadorian notarial documents
- **Strategy Pattern**: Modular extractors for different document types
- **SOLID Principles**: Single responsibility, extensible architecture
- **Ecuador Validation**: Complete patterns for cédulas, RUCs, placas, dates
- **Worker Pool**: Parallel processing with Tesseract worker management
- **Smart Caching**: Intelligent OCR result caching with memory management
- **Robust Error Handling**: Comprehensive validation and error recovery

## Supported Document Types

### PDF Documents
- **PDF_EXTRACTO**: Notarial extracts with Article 29 support
  - Valor operación, forma de pago
  - Sociedades, fideicomisos, consorcios
  - Complete person and company data extraction
- **PDF_DILIGENCIA**: Notarial diligences and declarations

### Image Documents  
- **SCREENSHOT_VEHICULO**: Vehicle system screenshots
  - Complete vehicle data (marca, modelo, año, placa, motor, chasis)
  - Buyer/seller information extraction
  - Transaction details (price, payment method, dates)

## Architecture

```
DocumentProcessor (Coordinator)
├── PDFExtractor (Notarial Documents)
├── ScreenshotExtractor (Vehicle Screenshots)  
└── TesseractEngine (OCR with Worker Pool)
```

## Installation

```bash
npm install @notarial-forms/document-processor
```

## Usage

### Basic Document Processing

```typescript
import { DocumentProcessor } from '@notarial-forms/document-processor';

const processor = new DocumentProcessor();

// Process any supported document
const result = await processor.processDocument('/path/to/document.pdf');

console.log('Extracted fields:', result.fields);
console.log('Structured data:', result.structuredData);
console.log('Confidence:', result.confidence);
```

### Advanced Processing with Options

```typescript
const result = await processor.processDocument('/path/to/document.pdf', {
  forceDocumentType: DocumentType.PDF_EXTRACTO,
  enhanceImage: true,
  minConfidence: 0.8,
  ocrLanguage: 'spa'
});
```

### Batch Processing

```typescript
const results = await processor.processMultipleDocuments([
  '/path/to/doc1.pdf',
  '/path/to/doc2.png',
  '/path/to/doc3.pdf'
], { concurrency: 2 });
```

### Document Validation

```typescript
const canProcess = await processor.canProcessDocument('/path/to/document.pdf');
if (canProcess.canProcess) {
  const result = await processor.processDocument('/path/to/document.pdf');
}
```

## Ecuador-Specific Features

### Validation Patterns

```typescript
import { PatternValidator } from '@notarial-forms/document-processor';

// Validate Ecuadorian cédula with checksum
const isValidCedula = PatternValidator.validateCedula('1700936170');

// Validate RUC format
const isValidRUC = PatternValidator.validateRUC('1700936170001');

// Validate vehicle plate
const isValidPlate = PatternValidator.validatePlate('BBW-0223');
```

### Date Parsing

```typescript
import { DateParser } from '@notarial-forms/document-processor';

// Parse Spanish dates
const date = DateParser.parseSpanishDate('24 DE JUNIO DEL 2025');

// Parse any date format
const anyDate = DateParser.parseAnyDate('24/06/2025');
```

### Field Extraction

```typescript
import { FieldExtractor } from '@notarial-forms/document-processor';

// Extract all Ecuador-specific fields from text
const fields = FieldExtractor.extractAllFields(documentText);
```

## Extracted Data Structure

### Notarial Documents

```typescript
interface NotarialData {
  numeroEscritura?: string;
  fechaEscritura?: Date;
  notario?: string;
  valorOperacion?: string;
  formaPago?: string;
  articulo29?: boolean;
  comparecientes?: PersonData[];
  sociedades?: CompanyData[];
}
```

### Vehicle Documents

```typescript
interface VehicleData {
  marca?: string;
  modelo?: string;
  año?: string;
  placa?: string;
  motor?: string;
  chasis?: string;
  comprador?: PersonData;
  vendedor?: PersonData;
  valorVenta?: string;
}
```

### Person Data

```typescript
interface PersonData {
  nombreCompleto?: string;
  cedula?: string;
  ruc?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}
```

## Performance Features

### OCR Engine with Worker Pool

```typescript
import { TesseractEngine } from '@notarial-forms/document-processor';

const engine = new TesseractEngine(3); // 3 workers
await engine.initialize();

// Parallel processing
const results = await engine.recognizeMultiple([
  'image1.png', 
  'image2.png'
], 2); // 2 concurrent

await engine.terminate();
```

### Caching and Health Monitoring

```typescript
// Check cache statistics
const stats = engine.getCacheStats();
console.log('Cache hits:', stats.hits);

// Health check
const health = await engine.healthCheck();
console.log('Engine status:', health.status);
```

## Error Handling

```typescript
const result = await processor.processDocument('/path/to/document.pdf');

if (!result.success) {
  console.error('Processing failed:', result.error);
  // Handle error case
} else {
  console.log('Success! Confidence:', result.confidence);
  // Process extracted data
}
```

## Configuration

### OCR Settings

```typescript
const result = await processor.processDocument('/path/to/image.png', {
  ocrLanguage: 'spa',
  enhanceImage: true,
  minConfidence: 0.8
});
```

### Image Preprocessing

The ScreenshotExtractor automatically applies multiple preprocessing techniques:

- **Standard**: Greyscale, normalize, sharpen, threshold
- **High Contrast**: Enhanced contrast for better text recognition  
- **Scaled**: Upscaling for small text
- **Enhanced**: Advanced noise reduction and clarity

## Article 29 Support

Complete support for Ecuador's Article 29 requirements:

```typescript
// Automatically detects Article 29 documents
const result = await processor.processDocument('/path/to/extracto.pdf');

if (result.structuredData.notarial?.articulo29) {
  console.log('Article 29 document detected');
  console.log('Valor operación:', result.structuredData.notarial.valorOperacion);
  console.log('Forma de pago:', result.structuredData.notarial.formaPago);
}
```

## Document Types Detection

Automatic detection based on:

- **File extension**: `.pdf` vs image formats
- **Filename patterns**: Keywords like "extracto", "diligencia", "vehiculo"
- **Content analysis**: Document structure and keywords
- **Size heuristics**: File size and page count

## License

MIT