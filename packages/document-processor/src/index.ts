// Main exports
export { DocumentProcessor } from './DocumentProcessor';

// Extractors
export { PDFExtractor } from './extractors/PDFExtractor';
export { ScreenshotExtractor } from './extractors/ScreenshotExtractor';

// Engines
export { TesseractEngine } from './engines/TesseractEngine';

// Types and interfaces
export * from './types';

// Utilities and patterns
export * from './utils/patterns';

// Re-export for convenience
export {
  EcuadorPatterns,
  PatternValidator,
  DateParser,
  FieldExtractor
} from './utils/patterns';

// Version info
export const VERSION = '1.0.0';
export const SUPPORTED_LANGUAGES = ['spa', 'eng'];
export const SUPPORTED_FORMATS = ['.pdf', '.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.webp'];

// Factory function for easy initialization
export function createDocumentProcessor(): DocumentProcessor {
  return new DocumentProcessor();
}

// Utility function to check if a file extension is supported
export function isSupportedFormat(filePath: string): boolean {
  const ext = filePath.toLowerCase().split('.').pop();
  return SUPPORTED_FORMATS.includes(`.${ext}`);
}