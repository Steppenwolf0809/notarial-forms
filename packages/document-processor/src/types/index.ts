import { z } from 'zod';

export enum DocumentType {
  PDF_EXTRACTO = 'PDF_EXTRACTO',
  PDF_DILIGENCIA = 'PDF_DILIGENCIA',
  SCREENSHOT_VEHICULO = 'SCREENSHOT_VEHICULO'
}

export enum TramiteType {
  COMPRAVENTA = 'COMPRAVENTA',
  DONACION = 'DONACION',
  CONSTITUCION_SOCIEDAD = 'CONSTITUCION_SOCIEDAD',
  FIDEICOMISO = 'FIDEICOMISO',
  CONSORCIO = 'CONSORCIO',
  VEHICULO = 'VEHICULO',
  DILIGENCIA = 'DILIGENCIA',
  OTRO = 'OTRO'
}

export enum FieldType {
  CEDULA = 'cedula',
  RUC = 'ruc',
  PASSPORT = 'passport',
  PLATE = 'plate',
  DATE = 'date',
  NAME = 'name',
  AMOUNT = 'amount',
  ADDRESS = 'address',
  PHONE = 'phone',
  EMAIL = 'email',
  VEHICLE_BRAND = 'vehicle_brand',
  VEHICLE_MODEL = 'vehicle_model',
  VEHICLE_YEAR = 'vehicle_year',
  VEHICLE_ENGINE = 'vehicle_engine',
  VEHICLE_CHASSIS = 'vehicle_chassis',
  LOCATION = 'location',
  NOTARY_NAME = 'notary_name',
  VALOR_OPERACION = 'valor_operacion',
  FORMA_PAGO = 'forma_pago',
  NATIONALITY = 'nationality',
  OTHER = 'other'
}

export const EcuadorianCedulaSchema = z.string()
  .regex(/^\d{10}$/, 'Cédula must be exactly 10 digits')
  .refine((val) => validateCedulaChecksum(val), 'Invalid cédula checksum');

export const EcuadorianRUCSchema = z.string()
  .regex(/^\d{13}001$/, 'RUC must be 13 digits followed by 001');

export const EcuadorianPlateSchema = z.string()
  .regex(/^[A-Z]{3}[-]?\d{3,4}$/, 'Plate format: ABC-1234 or ABC1234');

export const PassportSchema = z.string()
  .regex(/^[A-Z0-9]{6,15}$/, 'Invalid passport format');

export const PhoneSchema = z.string()
  .regex(/^(\+593|0)[0-9]{8,9}$/, 'Invalid Ecuador phone format');

export const EmailSchema = z.string().email('Invalid email format');

export interface ExtractedField {
  fieldName: string;
  value: string;
  confidence: number;
  type: FieldType;
  location?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rawText?: string;
  validationStatus: 'valid' | 'invalid' | 'unknown';
  validationMessage?: string;
}

export interface PersonData {
  nombres?: string;
  apellidos?: string;
  nombreCompleto?: string;
  cedula?: string;
  ruc?: string;
  pasaporte?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  nacionalidad?: string;
  estadoCivil?: string;
  profesion?: string;
}

export interface VehicleData {
  marca?: string;
  modelo?: string;
  año?: string;
  placa?: string;
  motor?: string;
  chasis?: string;
  color?: string;
  tipo?: string;
  cilindraje?: string;
  combustible?: string;
  traccion?: string;
  comprador?: PersonData;
  vendedor?: PersonData;
  valorVenta?: string;
  formaPago?: string;
  fechaTransferencia?: Date;
}

export interface NotarialData {
  numeroEscritura?: string;
  fechaEscritura?: Date;
  notario?: string;
  canton?: string;
  provincia?: string;
  comparecientes?: PersonData[];
  valorOperacion?: string;
  formaPago?: string;
  tipoOperacion?: TramiteType;
  articulo29?: boolean;
  descripcionInmueble?: string;
  ubicacionInmueble?: string;
  linderos?: string;
  sociedades?: CompanyData[];
  fideicomisos?: FideicomisoData[];
  consorcios?: ConsorcioData[];
}

export interface CompanyData {
  denominacion?: string;
  ruc?: string;
  tipoSociedad?: string;
  capital?: string;
  representanteLegal?: PersonData;
  socios?: PersonData[];
  objetoSocial?: string;
  domicilio?: string;
}

export interface FideicomisoData {
  denominacion?: string;
  fideicomitente?: PersonData;
  fiduciario?: PersonData;
  beneficiario?: PersonData;
  bienes?: string;
  plazo?: string;
  condiciones?: string;
}

export interface ConsorcioData {
  denominacion?: string;
  participantes?: PersonData[];
  objetoConsorcio?: string;
  plazo?: string;
  aportes?: string;
}

export interface ExtractionResult {
  documentType: DocumentType;
  tramiteType: TramiteType;
  fields: ExtractedField[];
  structuredData: {
    notarial?: NotarialData;
    vehicle?: VehicleData;
    persons?: PersonData[];
    companies?: CompanyData[];
  };
  processingTime: number;
  success: boolean;
  confidence: number;
  error?: string;
  metadata: {
    fileName: string;
    fileSize: number;
    pageCount?: number;
    ocrEngine: string;
    extractorVersion: string;
    processingDate: Date;
  };
}

export interface DocumentExtractor {
  extract(filePath: string, options?: ExtractionOptions): Promise<ExtractionResult>;
  supports(documentType: DocumentType): boolean;
  validateInput(filePath: string): Promise<boolean>;
  getMetadata(filePath: string): Promise<DocumentMetadata>;
}

export interface OCREngine {
  recognize(imagePath: string, options?: OCROptions): Promise<OCRResult>;
  getConfidence(): number;
  initialize(): Promise<void>;
  terminate(): Promise<void>;
  isInitialized(): boolean;
}

export interface ExtractionOptions {
  forceDocumentType?: DocumentType;
  enhanceImage?: boolean;
  minConfidence?: number;
  extractImages?: boolean;
  ocrLanguage?: string;
  customPatterns?: RegExp[];
}

export interface OCROptions {
  language?: string;
  pageSegMode?: number;
  ocrEngineMode?: number;
  whitelist?: string;
  blacklist?: string;
  variables?: Record<string, string>;
}

export interface OCRResult {
  text: string;
  confidence: number;
  words?: WordInfo[];
  lines?: LineInfo[];
  paragraphs?: ParagraphInfo[];
}

export interface WordInfo {
  text: string;
  confidence: number;
  bbox: BoundingBox;
}

export interface LineInfo {
  text: string;
  confidence: number;
  bbox: BoundingBox;
  words: WordInfo[];
}

export interface ParagraphInfo {
  text: string;
  confidence: number;
  bbox: BoundingBox;
  lines: LineInfo[];
}

export interface BoundingBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface DocumentMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdDate?: Date;
  modifiedDate?: Date;
  pageCount?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

function validateCedulaChecksum(cedula: string): boolean {
  if (!/^\d{10}$/.test(cedula)) return false;
  
  const digits = cedula.split('').map(Number);
  const province = parseInt(cedula.substring(0, 2));
  
  if (province < 1 || province > 24) return false;
  
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    let product = digits[i] * coefficients[i];
    if (product >= 10) product -= 9;
    sum += product;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[9];
}