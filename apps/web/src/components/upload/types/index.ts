import { z } from 'zod';
import { DocumentType, TramiteType } from '@notarial-forms/document-processor';

export enum UploadState {
  IDLE = 'idle',
  DRAGOVER = 'dragover',
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum FileStatus {
  PENDING = 'pending',
  VALIDATING = 'validating',
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error'
}

export enum FileSource {
  DRAG_DROP = 'drag_drop',
  FILE_PICKER = 'file_picker',
  CLIPBOARD_PASTE = 'clipboard_paste'
}

export const UploadConfigSchema = z.object({
  maxSize: z.number().min(1).default(50 * 1024 * 1024), // 50MB default
  maxFiles: z.number().min(1).default(10),
  acceptedTypes: z.array(z.string()).default([
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/bmp',
    'image/tiff',
    'image/webp'
  ]),
  allowMultiple: z.boolean().default(true),
  allowClipboard: z.boolean().default(true),
  autoProcess: z.boolean().default(true),
  compressionQuality: z.number().min(0.1).max(1).default(0.8),
  clipboardImageFormat: z.enum(['png', 'jpeg', 'webp']).default('png'),
  generateThumbnails: z.boolean().default(true)
});

export type UploadConfig = z.infer<typeof UploadConfigSchema>;

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  extension: string;
  isImage: boolean;
  isPDF: boolean;
  source: FileSource;
  thumbnail?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  clipboardData?: {
    originalFormat: string;
    convertedFormat: string;
    timestamp: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export interface UploadProgress {
  fileId: string;
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  timeRemaining: number; // seconds
  stage: 'upload' | 'process' | 'complete';
}

export interface ProcessingResult {
  fileId: string;
  documentType: DocumentType;
  tramiteType: TramiteType;
  confidence: number;
  fieldsCount: number;
  processingTime: number;
  success: boolean;
  error?: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  metadata: FileMetadata;
  status: FileStatus;
  progress: UploadProgress;
  validation: ValidationResult;
  processing?: ProcessingResult;
  preview?: string;
  uploadUrl?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface ClipboardItem {
  id: string;
  type: string;
  blob: Blob;
  preview: string;
  fileName: string;
  timestamp: number;
}

export interface ClipboardHandlerOptions {
  enabled: boolean;
  imageFormat: 'png' | 'jpeg' | 'webp';
  quality: number;
  maxSize: number;
  generatePreview: boolean;
  autoDetectType: boolean;
}

export interface DropZoneProps {
  config: UploadConfig;
  state: UploadState;
  files: UploadedFile[];
  onFilesAdded: (files: File[]) => void;
  onClipboardPaste: (items: ClipboardItem[]) => void;
  onFilesRemoved: (fileIds: string[]) => void;
  onStateChange: (state: UploadState) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface FilePreviewProps {
  file: UploadedFile;
  onRemove: (fileId: string) => void;
  onRetry: (fileId: string) => void;
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

export interface UploadProgressProps {
  file: UploadedFile;
  showDetails?: boolean;
  animated?: boolean;
  className?: string;
}

export interface ClipboardHandlerProps {
  config: UploadConfig;
  onPaste: (items: ClipboardItem[]) => void;
  onError: (error: string) => void;
  enabled?: boolean;
  children?: React.ReactNode;
}

export interface DocumentUploadProps {
  config?: Partial<UploadConfig>;
  onFileSelect?: (files: UploadedFile[]) => void;
  onClipboardPaste?: (items: ClipboardItem[]) => void;
  onUploadProgress?: (progress: UploadProgress) => void;
  onUploadComplete?: (file: UploadedFile) => void;
  onProcessingComplete?: (result: ProcessingResult) => void;
  onError?: (error: ValidationError | string, fileId?: string) => void;
  onSuccess?: (files: UploadedFile[]) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface UseFileUploadOptions {
  config: UploadConfig;
  onFileSelect?: (files: UploadedFile[]) => void;
  onClipboardPaste?: (items: ClipboardItem[]) => void;
  onUploadProgress?: (progress: UploadProgress) => void;
  onUploadComplete?: (file: UploadedFile) => void;
  onProcessingComplete?: (result: ProcessingResult) => void;
  onError?: (error: ValidationError | string, fileId?: string) => void;
  onSuccess?: (files: UploadedFile[]) => void;
}

export interface UseFileUploadReturn {
  files: UploadedFile[];
  state: UploadState;
  isUploading: boolean;
  isProcessing: boolean;
  addFiles: (files: File[]) => Promise<void>;
  addClipboardItems: (items: ClipboardItem[]) => Promise<void>;
  removeFile: (fileId: string) => void;
  retryFile: (fileId: string) => Promise<void>;
  clearFiles: () => void;
  uploadFile: (fileId: string) => Promise<void>;
  processFile: (fileId: string) => Promise<void>;
  validateFile: (file: File) => ValidationResult;
  setState: (state: UploadState) => void;
}

// Error codes for validation
export const ValidationErrorCodes = {
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_TYPE: 'INVALID_TYPE',
  TOO_MANY_FILES: 'TOO_MANY_FILES',
  FILE_CORRUPTED: 'FILE_CORRUPTED',
  INVALID_PDF: 'INVALID_PDF',
  INVALID_IMAGE: 'INVALID_IMAGE',
  EMPTY_FILE: 'EMPTY_FILE',
  DUPLICATE_FILE: 'DUPLICATE_FILE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  CLIPBOARD_ERROR: 'CLIPBOARD_ERROR',
  CLIPBOARD_EMPTY: 'CLIPBOARD_EMPTY',
  CLIPBOARD_UNSUPPORTED: 'CLIPBOARD_UNSUPPORTED'
} as const;

export type ValidationErrorCode = typeof ValidationErrorCodes[keyof typeof ValidationErrorCodes];

// File type categories
export const FileTypeCategories = {
  PDF: ['application/pdf'],
  IMAGE: ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/tiff', 'image/webp'],
  ALL: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/tiff', 'image/webp']
} as const;

// Spanish error messages
export const ErrorMessages: Record<ValidationErrorCode, string> = {
  [ValidationErrorCodes.FILE_TOO_LARGE]: 'El archivo es demasiado grande. Tamaño máximo permitido: {maxSize}',
  [ValidationErrorCodes.INVALID_TYPE]: 'Tipo de archivo no permitido. Tipos aceptados: {acceptedTypes}',
  [ValidationErrorCodes.TOO_MANY_FILES]: 'Demasiados archivos. Máximo permitido: {maxFiles}',
  [ValidationErrorCodes.FILE_CORRUPTED]: 'El archivo está corrupto o dañado',
  [ValidationErrorCodes.INVALID_PDF]: 'El archivo PDF no es válido o está corrupto',
  [ValidationErrorCodes.INVALID_IMAGE]: 'La imagen no es válida o está corrupta',
  [ValidationErrorCodes.EMPTY_FILE]: 'El archivo está vacío',
  [ValidationErrorCodes.DUPLICATE_FILE]: 'Este archivo ya fue agregado',
  [ValidationErrorCodes.NETWORK_ERROR]: 'Error de conexión. Verifique su conexión a internet',
  [ValidationErrorCodes.PROCESSING_ERROR]: 'Error al procesar el documento',
  [ValidationErrorCodes.UPLOAD_ERROR]: 'Error al subir el archivo',
  [ValidationErrorCodes.CLIPBOARD_ERROR]: 'Error al acceder al portapapeles',
  [ValidationErrorCodes.CLIPBOARD_EMPTY]: 'El portapapeles está vacío o no contiene imágenes',
  [ValidationErrorCodes.CLIPBOARD_UNSUPPORTED]: 'El contenido del portapapeles no es compatible'
};

// Document type descriptions in Spanish
export const DocumentTypeDescriptions: Record<DocumentType, string> = {
  [DocumentType.PDF_EXTRACTO]: 'Extracto Notarial',
  [DocumentType.PDF_DILIGENCIA]: 'Diligencia Notarial',
  [DocumentType.SCREENSHOT_VEHICULO]: 'Captura de Pantalla - Vehículo'
};

// Tramite type descriptions in Spanish
export const TramiteTypeDescriptions: Record<TramiteType, string> = {
  COMPRAVENTA: 'Compraventa',
  DONACION: 'Donación',
  CONSTITUCION_SOCIEDAD: 'Constitución de Sociedad',
  FIDEICOMISO: 'Fideicomiso',
  CONSORCIO: 'Consorcio',
  VEHICULO: 'Trámite de Vehículo',
  DILIGENCIA: 'Diligencia',
  OTRO: 'Otro Trámite'
};

// File source descriptions
export const FileSourceDescriptions: Record<FileSource, string> = {
  [FileSource.DRAG_DROP]: 'Arrastrado',
  [FileSource.FILE_PICKER]: 'Seleccionado',
  [FileSource.CLIPBOARD_PASTE]: 'Pegado desde portapapeles'
};