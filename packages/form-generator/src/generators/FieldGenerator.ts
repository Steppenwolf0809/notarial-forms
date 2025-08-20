import { FormFieldConfig, FieldType, SelectOption, FieldGeneratorOptions, ExtractedField } from '../types';
import { ValidationEngine } from '../engines/ValidationEngine';
import { TemplateEngine } from '../engines/TemplateEngine';

export class FieldGenerator {
  
  private options: FieldGeneratorOptions;
  
  constructor(options: FieldGeneratorOptions = {}) {
    this.options = {
      ecuadorianValidation: true,
      showConfidence: true,
      responsive: true,
      ...options
    };
  }

  // Generar campo específico por tipo
  generateField<T>(config: Partial<FormFieldConfig<T>>): FormFieldConfig<T> {
    const baseField: FormFieldConfig<T> = {
      name: config.name!,
      type: config.type || 'text',
      label: config.label || this.generateLabel(config.name!),
      required: config.required || false,
      validation: config.validation || this.getValidationForType(config.type || 'text'),
      metadata: {
        extractionSource: 'MANUAL',
        ecuadorianValidation: this.options.ecuadorianValidation,
        ...config.metadata
      },
      grid: this.getResponsiveGrid(config.type || 'text', config.grid),
      ...config
    };

    // Aplicar datos extraídos si están disponibles
    if (this.options.extractedData) {
      this.applyExtractedData(baseField);
    }

    // Generar opciones dinámicas para selects
    if (config.type === 'select' || config.type === 'multiselect') {
      baseField.options = config.options || this.generateSelectOptions(config.type, config.name as string);
    }

    return baseField;
  }

  // Generar campo de persona completo
  generatePersonField(role: 'COMPRADOR' | 'VENDEDOR' | 'CONSTITUYENTE', index: number = 0): FormFieldConfig[] {
    const prefix = `personas.${index}`;
    
    return [
      this.generateField({
        name: `${prefix}.rol` as any,
        type: 'select',
        label: 'Rol',
        defaultValue: role,
        options: [
          { value: 'COMPRADOR', label: 'Comprador' },
          { value: 'VENDEDOR', label: 'Vendedor' },
          { value: 'CONSTITUYENTE', label: 'Constituyente' },
          { value: 'APODERADO', label: 'Apoderado' },
          { value: 'TESTIGO', label: 'Testigo' }
        ],
        required: true,
        grid: { colSpan: 3 }
      }),
      
      this.generateField({
        name: `${prefix}.nombres` as any,
        type: 'text',
        label: 'Nombres',
        placeholder: 'Nombres completos',
        required: true,
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: `${prefix}.apellidos` as any,
        type: 'text',
        label: 'Apellidos',
        placeholder: 'Apellidos completos',
        required: true,
        grid: { colSpan: 5 }
      }),
      
      this.generateField({
        name: `${prefix}.cedula` as any,
        type: 'cedula',
        label: 'Cédula',
        placeholder: '1234567890',
        required: true,
        validation: ValidationEngine.cedulaSchema,
        metadata: { ecuadorianValidation: true },
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: `${prefix}.ruc` as any,
        type: 'ruc',
        label: 'RUC (Opcional)',
        placeholder: '1234567890001',
        validation: ValidationEngine.rucSchema,
        metadata: { ecuadorianValidation: true },
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: `${prefix}.nacionalidad` as any,
        type: 'text',
        label: 'Nacionalidad',
        placeholder: 'Ecuatoriana',
        defaultValue: 'Ecuatoriana',
        required: true,
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: `${prefix}.estadoCivil` as any,
        type: 'select',
        label: 'Estado Civil',
        options: [
          { value: 'SOLTERO', label: 'Soltero/a' },
          { value: 'CASADO', label: 'Casado/a' },
          { value: 'DIVORCIADO', label: 'Divorciado/a' },
          { value: 'VIUDO', label: 'Viudo/a' },
          { value: 'UNION_LIBRE', label: 'Unión Libre' }
        ],
        required: true,
        grid: { colSpan: 3 }
      }),
      
      this.generateField({
        name: `${prefix}.profesion` as any,
        type: 'text',
        label: 'Profesión',
        placeholder: 'Profesión u ocupación',
        required: true,
        grid: { colSpan: 5 }
      }),
      
      // Campos de domicilio
      ...this.generateDomicilioFields(`${prefix}.domicilio`),
      
      this.generateField({
        name: `${prefix}.telefono` as any,
        type: 'tel',
        label: 'Teléfono',
        placeholder: '0998765432',
        validation: ValidationEngine.phoneSchema,
        grid: { colSpan: 3 }
      }),
      
      this.generateField({
        name: `${prefix}.email` as any,
        type: 'email',
        label: 'Email',
        placeholder: 'correo@ejemplo.com',
        validation: ValidationEngine.emailSchema,
        grid: { colSpan: 5 }
      })
    ];
  }

  // Generar campos de domicilio
  generateDomicilioFields(prefix: string): FormFieldConfig[] {
    return [
      this.generateField({
        name: `${prefix}.provincia` as any,
        type: 'provincia',
        label: 'Provincia',
        options: TemplateEngine.getDynamicOptions('provincia'),
        required: true,
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: `${prefix}.canton` as any,
        type: 'canton',
        label: 'Cantón',
        required: true,
        conditional: {
          dependsOn: `${prefix}.provincia`,
          condition: 'exists'
        },
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: `${prefix}.parroquia` as any,
        type: 'parroquia',
        label: 'Parroquia',
        required: true,
        conditional: {
          dependsOn: `${prefix}.canton`,
          condition: 'exists'
        },
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: `${prefix}.calle` as any,
        type: 'direccion',
        label: 'Calle Principal',
        placeholder: 'Av. Principal, Calle Secundaria',
        required: true,
        grid: { colSpan: 8 }
      }),
      
      this.generateField({
        name: `${prefix}.numero` as any,
        type: 'text',
        label: 'Número',
        placeholder: 'N12-34',
        grid: { colSpan: 2 }
      }),
      
      this.generateField({
        name: `${prefix}.sector` as any,
        type: 'text',
        label: 'Sector',
        placeholder: 'Sector o barrio',
        required: true,
        grid: { colSpan: 6 }
      }),
      
      this.generateField({
        name: `${prefix}.referencia` as any,
        type: 'text',
        label: 'Referencia',
        placeholder: 'Punto de referencia',
        grid: { colSpan: 6 }
      })
    ];
  }

  // Generar campos de vehículo
  generateVehiculoFields(): FormFieldConfig[] {
    return [
      this.generateField({
        name: 'vehiculo.marca' as any,
        type: 'text',
        label: 'Marca',
        placeholder: 'TOYOTA',
        required: true,
        grid: { colSpan: 3 }
      }),
      
      this.generateField({
        name: 'vehiculo.modelo' as any,
        type: 'text',
        label: 'Modelo',
        placeholder: 'COROLLA',
        required: true,
        grid: { colSpan: 3 }
      }),
      
      this.generateField({
        name: 'vehiculo.anio' as any,
        type: 'number',
        label: 'Año',
        placeholder: '2020',
        required: true,
        validation: ValidationEngine.generateDynamicValidation('number', { 
          min: 1900, 
          max: new Date().getFullYear() + 1 
        }),
        grid: { colSpan: 2 }
      }),
      
      this.generateField({
        name: 'vehiculo.placa' as any,
        type: 'placa',
        label: 'Placa',
        placeholder: 'ABC-1234',
        required: true,
        validation: ValidationEngine.placaSchema,
        metadata: { ecuadorianValidation: true },
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: 'vehiculo.chasis' as any,
        type: 'text',
        label: 'Número de Chasis',
        placeholder: 'JTDKN3DU5E0123456',
        required: true,
        grid: { colSpan: 6 }
      }),
      
      this.generateField({
        name: 'vehiculo.motor' as any,
        type: 'text',
        label: 'Número de Motor',
        placeholder: '3ZZ1234567',
        required: true,
        grid: { colSpan: 6 }
      }),
      
      this.generateField({
        name: 'vehiculo.cilindraje' as any,
        type: 'text',
        label: 'Cilindraje',
        placeholder: '1800',
        required: true,
        grid: { colSpan: 3 }
      }),
      
      this.generateField({
        name: 'vehiculo.combustible' as any,
        type: 'select',
        label: 'Combustible',
        options: [
          { value: 'GASOLINA', label: 'Gasolina' },
          { value: 'DIESEL', label: 'Diesel' },
          { value: 'GAS', label: 'Gas' },
          { value: 'ELECTRICO', label: 'Eléctrico' },
          { value: 'HIBRIDO', label: 'Híbrido' }
        ],
        required: true,
        grid: { colSpan: 3 }
      }),
      
      this.generateField({
        name: 'vehiculo.color' as any,
        type: 'text',
        label: 'Color',
        placeholder: 'BLANCO',
        required: true,
        grid: { colSpan: 3 }
      }),
      
      this.generateField({
        name: 'vehiculo.clase' as any,
        type: 'text',
        label: 'Clase',
        placeholder: 'AUTOMOVIL',
        required: true,
        grid: { colSpan: 3 }
      }),
      
      this.generateField({
        name: 'vehiculo.tipo' as any,
        type: 'text',
        label: 'Tipo',
        placeholder: 'SEDAN',
        required: true,
        grid: { colSpan: 3 }
      })
    ];
  }

  // Generar campos Article 29
  generateArticle29Fields(): FormFieldConfig[] {
    return [
      this.generateField({
        name: 'article29.valorOperacion' as any,
        type: 'currency',
        label: 'Valor de la Operación (USD)',
        placeholder: '50000.00',
        required: true,
        validation: ValidationEngine.currencySchema,
        metadata: { article29Field: true },
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: 'article29.formaPago' as any,
        type: 'select',
        label: 'Forma de Pago',
        options: [
          { value: 'EFECTIVO', label: 'Efectivo' },
          { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
          { value: 'CHEQUE', label: 'Cheque' },
          { value: 'CREDITO', label: 'Crédito' },
          { value: 'MIXTO', label: 'Mixto' }
        ],
        required: true,
        metadata: { article29Field: true },
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: 'article29.moneda' as any,
        type: 'select',
        label: 'Moneda',
        options: [
          { value: 'USD', label: 'Dólares Americanos (USD)' },
          { value: 'EUR', label: 'Euros (EUR)' }
        ],
        defaultValue: 'USD',
        required: true,
        metadata: { article29Field: true },
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: 'article29.fechaOperacion' as any,
        type: 'date',
        label: 'Fecha de la Operación',
        required: true,
        validation: ValidationEngine.dateSchema,
        metadata: { article29Field: true },
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: 'article29.esOperacionCompleta' as any,
        type: 'checkbox',
        label: 'Operación Completa',
        defaultValue: true,
        metadata: { 
          article29Field: true,
          helpText: 'Marque si la operación se realiza en su totalidad'
        },
        grid: { colSpan: 4 }
      }),
      
      this.generateField({
        name: 'article29.detallesPago' as any,
        type: 'textarea',
        label: 'Detalles del Pago',
        placeholder: 'Especificar detalles adicionales del pago si aplica',
        conditional: {
          dependsOn: 'article29.formaPago',
          condition: 'equals',
          value: 'MIXTO'
        },
        grid: { colSpan: 12 }
      })
    ];
  }

  // Aplicar datos extraídos
  private applyExtractedData<T>(field: FormFieldConfig<T>): void {
    if (!this.options.extractedData) return;
    
    const extractedField = this.options.extractedData.find(
      data => this.matchFieldName(data.fieldName, field.name as string)
    );
    
    if (extractedField) {
      field.defaultValue = this.parseExtractedValue(extractedField.value, field.type);
      field.confidence = extractedField.confidence;
      field.metadata = {
        ...field.metadata,
        extractionSource: 'OCR'
      };
    }
  }

  // Matchear nombres de campos
  private matchFieldName(extractedName: string, fieldName: string): boolean {
    const normalizedExtracted = extractedName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedField = fieldName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Mapping común de campos
    const mappings: Record<string, string[]> = {
      'nombres': ['nombre', 'nombres', 'name'],
      'apellidos': ['apellido', 'apellidos', 'lastname'],
      'cedula': ['cedula', 'ci', 'identification'],
      'placa': ['placa', 'plate', 'matricula'],
      'marca': ['marca', 'brand'],
      'modelo': ['modelo', 'model'],
      'valoroperacion': ['valor', 'monto', 'precio', 'amount', 'valoroperacion']
    };
    
    return Object.values(mappings).some(group => 
      group.includes(normalizedExtracted) && group.includes(normalizedField)
    );
  }

  // Parsear valor extraído según tipo
  private parseExtractedValue(value: string, type: FieldType): any {
    switch (type) {
      case 'number':
      case 'currency':
        return parseFloat(value.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
      case 'checkbox':
        return ['true', 'si', 'yes', '1'].includes(value.toLowerCase());
      case 'date':
        return value; // Se parseará en el componente
      default:
        return value;
    }
  }

  // Obtener validación por tipo
  private getValidationForType(type: FieldType) {
    switch (type) {
      case 'cedula':
        return ValidationEngine.cedulaSchema;
      case 'ruc':
        return ValidationEngine.rucSchema;
      case 'placa':
        return ValidationEngine.placaSchema;
      case 'currency':
        return ValidationEngine.currencySchema;
      case 'date':
        return ValidationEngine.dateSchema;
      case 'tel':
        return ValidationEngine.phoneSchema;
      case 'email':
        return ValidationEngine.emailSchema;
      case 'number':
        return ValidationEngine.generateDynamicValidation('number');
      default:
        return ValidationEngine.generateDynamicValidation('text');
    }
  }

  // Generar label automáticamente
  private generateLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      'nombres': 'Nombres',
      'apellidos': 'Apellidos',
      'cedula': 'Cédula',
      'ruc': 'RUC',
      'nacionalidad': 'Nacionalidad',
      'estadoCivil': 'Estado Civil',
      'profesion': 'Profesión',
      'telefono': 'Teléfono',
      'email': 'Email',
      'provincia': 'Provincia',
      'canton': 'Cantón',
      'parroquia': 'Parroquia',
      'sector': 'Sector',
      'calle': 'Calle',
      'numero': 'Número',
      'placa': 'Placa',
      'marca': 'Marca',
      'modelo': 'Modelo',
      'anio': 'Año',
      'valorOperacion': 'Valor de la Operación',
      'formaPago': 'Forma de Pago'
    };
    
    const key = fieldName.split('.').pop() || fieldName;
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  // Obtener configuración de grid responsive
  private getResponsiveGrid(type: FieldType, customGrid?: any) {
    if (customGrid) return customGrid;
    
    const defaultGrids: Record<FieldType, any> = {
      text: { colSpan: 6 },
      email: { colSpan: 6 },
      tel: { colSpan: 4 },
      number: { colSpan: 3 },
      currency: { colSpan: 4 },
      date: { colSpan: 4 },
      select: { colSpan: 4 },
      multiselect: { colSpan: 6 },
      checkbox: { colSpan: 3 },
      radio: { colSpan: 4 },
      textarea: { colSpan: 12 },
      cedula: { colSpan: 4 },
      ruc: { colSpan: 4 },
      placa: { colSpan: 3 },
      direccion: { colSpan: 8 },
      provincia: { colSpan: 4 },
      canton: { colSpan: 4 },
      parroquia: { colSpan: 4 }
    };
    
    return defaultGrids[type] || { colSpan: 6 };
  }

  // Generar opciones para selects
  private generateSelectOptions(type: FieldType, fieldName: string): SelectOption[] {
    if (type === 'provincia') {
      return TemplateEngine.getDynamicOptions('provincia');
    }
    if (type === 'canton') {
      return TemplateEngine.getDynamicOptions('canton');
    }
    if (type === 'parroquia') {
      return TemplateEngine.getDynamicOptions('parroquia');
    }
    
    return [];
  }
}