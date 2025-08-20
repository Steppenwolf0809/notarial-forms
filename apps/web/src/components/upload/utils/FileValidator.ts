import { 
  ValidationResult, 
  ValidationError, 
  ValidationErrorCode, 
  ValidationErrorCodes, 
  ErrorMessages, 
  UploadConfig, 
  FileTypeCategories 
} from '../types';

export class FileValidator {
  private config: UploadConfig;

  constructor(config: UploadConfig) {
    this.config = config;
  }

  validateFile(file: File, existingFiles: File[] = []): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Basic file validation
    errors.push(...this.validateBasicProperties(file));
    
    // Size validation
    errors.push(...this.validateFileSize(file));
    
    // Type validation
    errors.push(...this.validateFileType(file));
    
    // Duplicate validation
    errors.push(...this.validateDuplicates(file, existingFiles));
    
    // File structure validation
    errors.push(...this.validateFileStructure(file));

    // Performance warnings
    warnings.push(...this.generateWarnings(file));

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateMultipleFiles(files: File[], existingFiles: File[] = []): ValidationResult {
    const allErrors: ValidationError[] = [];
    const allWarnings: string[] = [];

    // Check file count limit
    const totalFiles = files.length + existingFiles.length;
    if (totalFiles > this.config.maxFiles) {
      allErrors.push({
        code: ValidationErrorCodes.TOO_MANY_FILES,
        message: this.formatErrorMessage(ValidationErrorCodes.TOO_MANY_FILES, {
          maxFiles: this.config.maxFiles.toString()
        })
      });
    }

    // Validate each file individually
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = this.validateFile(file, [...existingFiles, ...files.slice(0, i)]);
      
      allErrors.push(...result.errors.map(error => ({
        ...error,
        field: `file_${i}`
      })));
      
      allWarnings.push(...result.warnings);
    }

    // Check for duplicates within the new files
    const duplicateErrors = this.findDuplicatesInArray(files);
    allErrors.push(...duplicateErrors);

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }

  private validateBasicProperties(file: File): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if file exists and has content
    if (!file || file.size === 0) {
      errors.push({
        code: ValidationErrorCodes.EMPTY_FILE,
        message: ErrorMessages[ValidationErrorCodes.EMPTY_FILE]
      });
    }

    // Check if file has a name
    if (!file.name || file.name.trim() === '') {
      errors.push({
        code: ValidationErrorCodes.FILE_CORRUPTED,
        message: 'El archivo no tiene un nombre válido'
      });
    }

    // Check for suspicious file names
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      errors.push({
        code: ValidationErrorCodes.FILE_CORRUPTED,
        message: 'El nombre del archivo contiene caracteres no válidos'
      });
    }

    return errors;
  }

  private validateFileSize(file: File): ValidationError[] {
    const errors: ValidationError[] = [];

    if (file.size > this.config.maxSize) {
      errors.push({
        code: ValidationErrorCodes.FILE_TOO_LARGE,
        message: this.formatErrorMessage(ValidationErrorCodes.FILE_TOO_LARGE, {
          maxSize: this.formatFileSize(this.config.maxSize)
        })
      });
    }

    return errors;
  }

  private validateFileType(file: File): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const extension = this.getFileExtension(fileName);

    // Check MIME type
    if (!this.config.acceptedTypes.includes(fileType)) {
      // Try to infer type from extension if MIME type is missing or incorrect
      const inferredType = this.inferMimeTypeFromExtension(extension);
      
      if (!inferredType || !this.config.acceptedTypes.includes(inferredType)) {
        errors.push({
          code: ValidationErrorCodes.INVALID_TYPE,
          message: this.formatErrorMessage(ValidationErrorCodes.INVALID_TYPE, {
            acceptedTypes: this.formatAcceptedTypes()
          })
        });
      }
    }

    // Additional validation for specific file types
    if (fileType === 'application/pdf' || extension === 'pdf') {
      errors.push(...this.validatePDFSpecific(file));
    }

    if (fileType.startsWith('image/') || this.isImageExtension(extension)) {
      errors.push(...this.validateImageSpecific(file));
    }

    return errors;
  }

  private validatePDFSpecific(file: File): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check PDF signature (basic validation)
    return new Promise<ValidationError[]>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (arrayBuffer) {
          const uint8Array = new Uint8Array(arrayBuffer.slice(0, 5));
          const header = String.fromCharCode(...uint8Array);
          
          if (!header.startsWith('%PDF')) {
            errors.push({
              code: ValidationErrorCodes.INVALID_PDF,
              message: ErrorMessages[ValidationErrorCodes.INVALID_PDF]
            });
          }
        }
        resolve(errors);
      };
      reader.onerror = () => {
        errors.push({
          code: ValidationErrorCodes.FILE_CORRUPTED,
          message: ErrorMessages[ValidationErrorCodes.FILE_CORRUPTED]
        });
        resolve(errors);
      };
      reader.readAsArrayBuffer(file.slice(0, 5));
    });

    // Synchronous fallback for now
    return errors;
  }

  private validateImageSpecific(file: File): ValidationError[] {
    const errors: ValidationError[] = [];
    const maxImageSize = 20 * 1024 * 1024; // 20MB for images

    if (file.size > maxImageSize) {
      errors.push({
        code: ValidationErrorCodes.FILE_TOO_LARGE,
        message: `La imagen es demasiado grande. Tamaño máximo para imágenes: ${this.formatFileSize(maxImageSize)}`
      });
    }

    return errors;
  }

  private validateDuplicates(file: File, existingFiles: File[]): ValidationError[] {
    const errors: ValidationError[] = [];

    const isDuplicate = existingFiles.some(existingFile => 
      existingFile.name === file.name && 
      existingFile.size === file.size &&
      existingFile.lastModified === file.lastModified
    );

    if (isDuplicate) {
      errors.push({
        code: ValidationErrorCodes.DUPLICATE_FILE,
        message: ErrorMessages[ValidationErrorCodes.DUPLICATE_FILE]
      });
    }

    return errors;
  }

  private validateFileStructure(file: File): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for minimum file size based on type
    const extension = this.getFileExtension(file.name);
    
    if (extension === 'pdf' && file.size < 1024) { // PDF should be at least 1KB
      errors.push({
        code: ValidationErrorCodes.INVALID_PDF,
        message: 'El archivo PDF parece estar incompleto o corrupto'
      });
    }

    if (this.isImageExtension(extension) && file.size < 512) { // Images should be at least 512 bytes
      errors.push({
        code: ValidationErrorCodes.INVALID_IMAGE,
        message: 'La imagen parece estar incompleta o corrupta'
      });
    }

    return errors;
  }

  private findDuplicatesInArray(files: File[]): ValidationError[] {
    const errors: ValidationError[] = [];
    const seen = new Set<string>();

    for (const file of files) {
      const fileKey = `${file.name}_${file.size}_${file.lastModified}`;
      
      if (seen.has(fileKey)) {
        errors.push({
          code: ValidationErrorCodes.DUPLICATE_FILE,
          message: `Archivo duplicado: ${file.name}`
        });
      } else {
        seen.add(fileKey);
      }
    }

    return errors;
  }

  private generateWarnings(file: File): string[] {
    const warnings: string[] = [];

    // Large file warning
    if (file.size > 10 * 1024 * 1024) { // 10MB
      warnings.push(`El archivo ${file.name} es grande (${this.formatFileSize(file.size)}). El procesamiento puede tomar más tiempo.`);
    }

    // Old file warning
    const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
    if (file.lastModified < oneYearAgo) {
      warnings.push(`El archivo ${file.name} parece ser antiguo (modificado hace más de un año).`);
    }

    // Image quality warning
    if (this.isImageExtension(this.getFileExtension(file.name)) && file.size < 100 * 1024) {
      warnings.push(`La imagen ${file.name} es pequeña. Asegúrese de que tenga suficiente calidad para el OCR.`);
    }

    return warnings;
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  private isImageExtension(extension: string): boolean {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'webp'];
    return imageExtensions.includes(extension);
  }

  private inferMimeTypeFromExtension(extension: string): string | null {
    const mimeMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'webp': 'image/webp'
    };

    return mimeMap[extension] || null;
  }

  private formatErrorMessage(code: ValidationErrorCode, params: Record<string, string>): string {
    let message = ErrorMessages[code];
    
    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value);
    });

    return message;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private formatAcceptedTypes(): string {
    const categories: string[] = [];
    
    if (this.config.acceptedTypes.some(type => FileTypeCategories.PDF.includes(type))) {
      categories.push('PDF');
    }
    
    if (this.config.acceptedTypes.some(type => FileTypeCategories.IMAGE.includes(type))) {
      categories.push('Imágenes (PNG, JPG, JPEG, BMP, TIFF, WebP)');
    }

    return categories.join(', ');
  }

  // Static utility methods
  static createDefaultValidator(): FileValidator {
    return new FileValidator({
      maxSize: 50 * 1024 * 1024, // 50MB
      maxFiles: 10,
      acceptedTypes: FileTypeCategories.ALL,
      allowMultiple: true,
      autoProcess: true,
      compressionQuality: 0.8
    });
  }

  static isValidFileType(file: File, acceptedTypes: string[]): boolean {
    return acceptedTypes.includes(file.type.toLowerCase());
  }

  static getFileCategory(file: File): 'pdf' | 'image' | 'unknown' {
    if (FileTypeCategories.PDF.includes(file.type)) return 'pdf';
    if (FileTypeCategories.IMAGE.includes(file.type)) return 'image';
    return 'unknown';
  }

  static async validateFileIntegrity(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = () => resolve(true);
      reader.onerror = () => resolve(false);
      
      // Try to read the first 1KB of the file
      reader.readAsArrayBuffer(file.slice(0, 1024));
    });
  }

  static generateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          resolve(hashHex);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }
}