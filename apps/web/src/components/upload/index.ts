// Main component export
export { default as DocumentUpload } from './DocumentUpload';

// Individual components
export { default as FileDropZone } from './components/FileDropZone';
export { default as FilePreview } from './components/FilePreview';
export { default as UploadProgress } from './components/UploadProgress';
export { default as ClipboardZone } from './components/ClipboardZone';

// Utilities
export { FileValidator } from './utils/FileValidator';
export { ClipboardHandler } from './utils/ClipboardHandler';

// Hooks
export { useFileUpload } from './hooks/useFileUpload';

// Types
export * from './types';

// Re-export for convenience
export type {
  DocumentUploadProps,
  UploadConfig,
  UploadedFile,
  ClipboardItem,
  ValidationResult,
  ProcessingResult
} from './types';