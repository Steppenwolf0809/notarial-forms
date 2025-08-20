import { DocumentType } from '@notarial-forms/shared-types';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { ZodSchema } from 'zod';

export interface ExtractedField {
  id: string;
  documentId: string;
  fieldName: string;
  value: string;
  confidence: number;
}

export interface FormFieldConfig<T extends FieldValues = FieldValues> {
  name: Path<T>;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ZodSchema;
  defaultValue?: any;
  options?: SelectOption[];
  confidence?: number;
  conditional?: ConditionalRule;
  grid?: GridConfig;
  metadata?: FieldMetadata;
}

export interface FieldMetadata {
  extractionSource?: 'OCR' | 'MANUAL' | 'COMPUTED';
  ecuadorianValidation?: boolean;
  article29Field?: boolean;
  autoComplete?: string;
  helpText?: string;
}

export interface GridConfig {
  colSpan?: number;
  rowSpan?: number;
  order?: number;
}

export interface ConditionalRule {
  dependsOn: string;
  condition: 'equals' | 'notEquals' | 'exists' | 'notExists';
  value?: any;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export type FieldType = 
  | 'text'
  | 'email' 
  | 'tel'
  | 'number'
  | 'currency'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'cedula'
  | 'ruc'
  | 'placa'
  | 'direccion'
  | 'provincia'
  | 'canton'
  | 'parroquia';

export interface NotarialFormTemplate {
  id: string;
  name: string;
  documentType: DocumentType;
  sections: FormSection[];
  validationSchema: ZodSchema;
  article29Fields?: string[];
  requiredFields: string[];
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  conditional?: ConditionalRule;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface FormGeneratorConfig {
  documentType: DocumentType;
  template?: string;
  extractedData?: ExtractedField[];
  autoSave?: boolean;
  autoSaveInterval?: number;
  showProgress?: boolean;
  showConfidence?: boolean;
  allowUndo?: boolean;
  responsive?: boolean;
  locale?: 'es' | 'en';
}

export interface FormState<T extends FieldValues = FieldValues> {
  data: Partial<T>;
  isDirty: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  progress: number;
  lastSaved?: Date;
  confidence: Record<string, number>;
  history: FormHistoryEntry<T>[];
  historyIndex: number;
}

export interface FormHistoryEntry<T extends FieldValues = FieldValues> {
  data: Partial<T>;
  timestamp: Date;
  action: 'CHANGE' | 'RESET' | 'LOAD' | 'SAVE';
  field?: string;
}

export interface AutoSaveConfig {
  enabled: boolean;
  interval: number;
  key: string;
  onSave?: (data: any) => void | Promise<void>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

export interface FieldGeneratorOptions {
  extractedData?: ExtractedField[];
  ecuadorianValidation?: boolean;
  showConfidence?: boolean;
  responsive?: boolean;
}

export interface PersonaData {
  nombres: string;
  apellidos: string;
  cedula: string;
  ruc?: string;
  nacionalidad: string;
  estadoCivil: string;
  profesion: string;
  domicilio: DireccionData;
  telefono?: string;
  email?: string;
  rol: 'COMPRADOR' | 'VENDEDOR' | 'CONSTITUYENTE' | 'APODERADO' | 'TESTIGO';
}

export interface DireccionData {
  provincia: string;
  canton: string;
  parroquia: string;
  sector: string;
  calle: string;
  numero?: string;
  referencia?: string;
}

export interface Article29Data {
  valorOperacion: number;
  formaPago: 'EFECTIVO' | 'TRANSFERENCIA' | 'CHEQUE' | 'CREDITO' | 'MIXTO';
  esOperacionCompleta: boolean;
  detallesPago?: string;
  fechaOperacion: string;
  moneda: 'USD' | 'EUR';
}

export interface VehiculoData {
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  chasis: string;
  motor: string;
  cilindraje: string;
  combustible: 'GASOLINA' | 'DIESEL' | 'GAS' | 'ELECTRICO' | 'HIBRIDO';
  color: string;
  clase: string;
  tipo: string;
}

export interface CompraventaFormData extends FieldValues {
  personas: PersonaData[];
  inmueble?: {
    tipo: string;
    ubicacion: DireccionData;
    areaTerreno?: number;
    areaConstruccion?: number;
    linderos: string;
    observaciones?: string;
  };
  vehiculo?: VehiculoData;
  article29: Article29Data;
  observaciones?: string;
  fechaEscritura: string;
  notario: string;
  numeroEscritura: string;
}

export type FormData = CompraventaFormData | FieldValues;