import { z, ZodSchema } from 'zod';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/es';

dayjs.extend(customParseFormat);
dayjs.locale('es');

export class ValidationEngine {
  
  // Validaciones específicas Ecuador
  static readonly CEDULA_REGEX = /^\d{10}$/;
  static readonly RUC_REGEX = /^\d{13}001$/;
  static readonly PLACA_REGEX = /^[A-Z]{3}[-]?\d{3,4}$/;
  static readonly TELEFONO_REGEX = /^[0-9]{7,10}$/;
  static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static cedulaSchema = z.string()
    .regex(this.CEDULA_REGEX, 'Cédula debe tener 10 dígitos exactamente')
    .refine(this.validateCedulaCheckDigit, 'Cédula ecuatoriana no válida');

  static rucSchema = z.string()
    .regex(this.RUC_REGEX, 'RUC debe tener 13 dígitos y terminar en 001')
    .refine(this.validateRucCheckDigit, 'RUC ecuatoriano no válido');

  static placaSchema = z.string()
    .regex(this.PLACA_REGEX, 'Placa debe tener formato ABC-1234 o ABC1234');

  static currencySchema = z.number()
    .positive('El valor debe ser positivo')
    .max(10000000, 'Valor máximo excedido')
    .multipleOf(0.01, 'Máximo 2 decimales permitidos');

  static dateSchema = z.string()
    .refine(this.validateSpanishDate, 'Fecha no válida. Use formato DD/MM/YYYY o español');

  static phoneSchema = z.string()
    .regex(this.TELEFONO_REGEX, 'Teléfono debe tener entre 7 y 10 dígitos');

  static emailSchema = z.string()
    .regex(this.EMAIL_REGEX, 'Email no válido');

  // Validación dígito verificador cédula
  private static validateCedulaCheckDigit(cedula: string): boolean {
    if (cedula.length !== 10) return false;
    
    const digits = cedula.split('').map(Number);
    const provincia = parseInt(cedula.substring(0, 2));
    
    if (provincia < 1 || provincia > 24) return false;
    
    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;
    
    for (let i = 0; i < coefficients.length; i++) {
      let result = digits[i] * coefficients[i];
      if (result > 9) result -= 9;
      sum += result;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[9];
  }

  // Validación dígito verificador RUC
  private static validateRucCheckDigit(ruc: string): boolean {
    if (ruc.length !== 13) return false;
    
    const cedula = ruc.substring(0, 10);
    return this.validateCedulaCheckDigit(cedula);
  }

  // Validación fecha española
  private static validateSpanishDate(dateStr: string): boolean {
    const formats = [
      'DD/MM/YYYY',
      'DD-MM-YYYY',
      'DD DE MMMM [DEL] YYYY',
      'DD [DE] MMMM [DEL] YYYY'
    ];
    
    return formats.some(format => 
      dayjs(dateStr, format, 'es', true).isValid()
    );
  }

  // Schema para personas
  static personaSchema = z.object({
    nombres: z.string().min(2, 'Nombres requeridos'),
    apellidos: z.string().min(2, 'Apellidos requeridos'),
    cedula: this.cedulaSchema,
    ruc: this.rucSchema.optional(),
    nacionalidad: z.string().min(2, 'Nacionalidad requerida'),
    estadoCivil: z.enum(['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'UNION_LIBRE'], {
      errorMap: () => ({ message: 'Estado civil no válido' })
    }),
    profesion: z.string().min(2, 'Profesión requerida'),
    domicilio: z.object({
      provincia: z.string().min(1, 'Provincia requerida'),
      canton: z.string().min(1, 'Cantón requerido'),
      parroquia: z.string().min(1, 'Parroquia requerida'),
      sector: z.string().min(1, 'Sector requerido'),
      calle: z.string().min(1, 'Calle requerida'),
      numero: z.string().optional(),
      referencia: z.string().optional()
    }),
    telefono: this.phoneSchema.optional(),
    email: this.emailSchema.optional(),
    rol: z.enum(['COMPRADOR', 'VENDEDOR', 'CONSTITUYENTE', 'APODERADO', 'TESTIGO'])
  });

  // Schema Article 29
  static article29Schema = z.object({
    valorOperacion: this.currencySchema,
    formaPago: z.enum(['EFECTIVO', 'TRANSFERENCIA', 'CHEQUE', 'CREDITO', 'MIXTO']),
    esOperacionCompleta: z.boolean(),
    detallesPago: z.string().optional(),
    fechaOperacion: this.dateSchema,
    moneda: z.enum(['USD', 'EUR']).default('USD')
  });

  // Schema para vehículos
  static vehiculoSchema = z.object({
    marca: z.string().min(1, 'Marca requerida'),
    modelo: z.string().min(1, 'Modelo requerido'),
    anio: z.number().min(1900).max(new Date().getFullYear() + 1),
    placa: this.placaSchema,
    chasis: z.string().min(10, 'Número de chasis requerido'),
    motor: z.string().min(5, 'Número de motor requerido'),
    cilindraje: z.string().min(1, 'Cilindraje requerido'),
    combustible: z.enum(['GASOLINA', 'DIESEL', 'GAS', 'ELECTRICO', 'HIBRIDO']),
    color: z.string().min(1, 'Color requerido'),
    clase: z.string().min(1, 'Clase requerida'),
    tipo: z.string().min(1, 'Tipo requerido')
  });

  // Schema compraventa completo
  static compraventaSchema = z.object({
    personas: z.array(this.personaSchema).min(2, 'Mínimo 2 personas requeridas'),
    inmueble: z.object({
      tipo: z.string().min(1, 'Tipo de inmueble requerido'),
      ubicacion: z.object({
        provincia: z.string().min(1, 'Provincia requerida'),
        canton: z.string().min(1, 'Cantón requerido'),
        parroquia: z.string().min(1, 'Parroquia requerida'),
        sector: z.string().min(1, 'Sector requerido'),
        calle: z.string().min(1, 'Calle requerida'),
        numero: z.string().optional(),
        referencia: z.string().optional()
      }),
      areaTerreno: z.number().positive().optional(),
      areaConstruccion: z.number().positive().optional(),
      linderos: z.string().min(10, 'Descripción de linderos requerida'),
      observaciones: z.string().optional()
    }).optional(),
    vehiculo: this.vehiculoSchema.optional(),
    article29: this.article29Schema,
    observaciones: z.string().optional(),
    fechaEscritura: this.dateSchema,
    notario: z.string().min(1, 'Notario requerido'),
    numeroEscritura: z.string().min(1, 'Número de escritura requerido')
  });

  // Obtener schema según tipo documento
  static getSchemaForDocumentType(documentType: string): ZodSchema {
    switch (documentType) {
      case 'PDF_EXTRACTO':
        return this.compraventaSchema;
      case 'SCREENSHOT_VEHICULO':
        return z.object({
          personas: z.array(this.personaSchema).min(2),
          vehiculo: this.vehiculoSchema,
          article29: this.article29Schema
        });
      case 'PDF_SOCIETARIO':
        return z.object({
          personas: z.array(this.personaSchema).min(1),
          article29: this.article29Schema,
          tipoSociedad: z.string().min(1)
        });
      default:
        return z.object({
          personas: z.array(this.personaSchema).min(1),
          observaciones: z.string().optional()
        });
    }
  }

  // Validación en tiempo real
  static validateField(fieldName: string, value: any, schema: ZodSchema): {
    isValid: boolean;
    error?: string;
    warning?: string;
  } {
    try {
      const result = schema.safeParse({ [fieldName]: value });
      
      if (result.success) {
        return { isValid: true };
      } else {
        const error = result.error.errors[0]?.message || 'Campo no válido';
        return { isValid: false, error };
      }
    } catch (err) {
      return { isValid: false, error: 'Error de validación' };
    }
  }

  // Validación completa formulario
  static validateForm<T>(data: T, schema: ZodSchema<T>): {
    isValid: boolean;
    errors: Record<string, string>;
    warnings: Record<string, string>;
  } {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { isValid: true, errors: {}, warnings: {} };
    }
    
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};
    
    result.error.errors.forEach(error => {
      const path = error.path.join('.');
      if (error.code === 'custom' && error.message.includes('advertencia')) {
        warnings[path] = error.message;
      } else {
        errors[path] = error.message;
      }
    });
    
    return { isValid: false, errors, warnings };
  }

  // Generar reglas de validación dinámicas
  static generateDynamicValidation(fieldType: string, options?: any): ZodSchema {
    switch (fieldType) {
      case 'cedula':
        return this.cedulaSchema;
      case 'ruc':
        return this.rucSchema;
      case 'placa':
        return this.placaSchema;
      case 'currency':
        return this.currencySchema;
      case 'date':
        return this.dateSchema;
      case 'tel':
        return this.phoneSchema;
      case 'email':
        return this.emailSchema;
      case 'select':
        if (options?.values) {
          return z.enum(options.values);
        }
        return z.string().min(1);
      case 'number':
        let numberSchema = z.number();
        if (options?.min !== undefined) numberSchema = numberSchema.min(options.min);
        if (options?.max !== undefined) numberSchema = numberSchema.max(options.max);
        return numberSchema;
      default:
        return z.string().min(1, 'Campo requerido');
    }
  }
}