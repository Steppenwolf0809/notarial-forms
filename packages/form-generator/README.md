# @notarial-forms/form-generator

Generador dinámico de formularios notariales ecuatorianos con integración completa de React Hook Form, validación Zod en tiempo real y características avanzadas.

## Características

### Generación Automática
- ✅ Formularios dinámicos basados en ExtractedData
- ✅ Pre-llenado automático de campos con datos OCR
- ✅ Validación tiempo real con integración Zod
- ✅ Auto-guardado cada 30 segundos
- ✅ Soporte completo Article 29 campos obligatorios

### Arquitectura Modular
- **FormGenerator**: Generación dinámica según tipo documento
- **FieldGenerator**: Creación campos específicos por tipos
- **TemplateEngine**: Templates formularios notariales
- **ValidationEngine**: Reglas validación ecuatorianas

### Tipos de Formularios
- `PDF_EXTRACTO`: Formulario compraventa completo
- `PDF_DILIGENCIA`: Formulario declaraciones
- `SCREENSHOT_VEHICULO`: Formulario vehículos
- `PDF_SOCIETARIO`: Formulario societario Article 29
- `PDF_FIDUCIARIO`: Formulario fiduciarios
- `PDF_DONACION`: Formulario donaciones
- `PDF_CONSORCIO`: Formulario consorcios

### Campos Dinámicos
- Personas con roles (COMPRADOR/VENDEDOR)
- Ubicación (Provincia/Cantón/Parroquia) con dropdowns
- Monetarios USD con validación
- Fechas en formato español
- Article 29: valorOperacion, formaPago, esOperacionCompleta

### Características Avanzadas
- Auto-save con localStorage backup
- Progress tracking con porcentaje completion
- Field confidence scoring visual
- Undo/Redo functionality
- Export/Import draft forms
- Responsive design mobile/desktop

## Uso

```typescript
import { FormGenerator, useNotarialForm } from '@notarial-forms/form-generator';

const form = useNotarialForm({
  documentType: 'PDF_EXTRACTO',
  extractedData: extractedFields,
  onAutoSave: (data) => console.log('Auto-saved:', data)
});

<FormGenerator
  form={form}
  template="COMPRAVENTA"
  autoSave={true}
  showProgress={true}
/>
```