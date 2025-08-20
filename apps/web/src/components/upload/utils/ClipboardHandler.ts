import { ClipboardItem, ClipboardHandlerOptions, ValidationErrorCodes } from '../types';

export class ClipboardHandler {
  private options: ClipboardHandlerOptions;
  private isListening: boolean = false;
  private pasteHandler?: (event: ClipboardEvent) => void;

  constructor(options: Partial<ClipboardHandlerOptions> = {}) {
    this.options = {
      enabled: true,
      imageFormat: 'png',
      quality: 0.8,
      maxSize: 50 * 1024 * 1024, // 50MB
      generatePreview: true,
      autoDetectType: true,
      ...options
    };
  }

  /**
   * Start listening for paste events
   */
  startListening(
    onPaste: (items: ClipboardItem[]) => void,
    onError: (error: string) => void
  ): void {
    if (!this.options.enabled || this.isListening) return;

    this.pasteHandler = (event: ClipboardEvent) => {
      this.handlePasteEvent(event, onPaste, onError);
    };

    document.addEventListener('paste', this.pasteHandler);
    this.isListening = true;
  }

  /**
   * Stop listening for paste events
   */
  stopListening(): void {
    if (!this.isListening || !this.pasteHandler) return;

    document.removeEventListener('paste', this.pasteHandler);
    this.pasteHandler = undefined;
    this.isListening = false;
  }

  /**
   * Manually read from clipboard
   */
  async readClipboard(): Promise<ClipboardItem[]> {
    if (!this.options.enabled) {
      throw new Error('Clipboard functionality is disabled');
    }

    if (!navigator.clipboard) {
      throw new Error('Clipboard API not supported in this browser');
    }

    try {
      const clipboardItems = await navigator.clipboard.read();
      const processedItems: ClipboardItem[] = [];

      for (const item of clipboardItems) {
        const imageTypes = item.types.filter(type => type.startsWith('image/'));
        
        for (const type of imageTypes) {
          try {
            const blob = await item.getType(type);
            const processedItem = await this.processClipboardBlob(blob, type);
            processedItems.push(processedItem);
          } catch (error) {
            console.warn(`Failed to process clipboard item of type ${type}:`, error);
          }
        }
      }

      if (processedItems.length === 0) {
        throw new Error('No valid images found in clipboard');
      }

      return processedItems;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Clipboard access failed: ${error.message}`);
      }
      throw new Error('Unknown clipboard error');
    }
  }

  /**
   * Handle paste event
   */
  private async handlePasteEvent(
    event: ClipboardEvent,
    onPaste: (items: ClipboardItem[]) => void,
    onError: (error: string) => void
  ): Promise<void> {
    event.preventDefault();

    try {
      const clipboardData = event.clipboardData;
      if (!clipboardData) {
        onError('No hay datos en el portapapeles');
        return;
      }

      const items = Array.from(clipboardData.items);
      const imageItems = items.filter(item => item.type.startsWith('image/'));

      if (imageItems.length === 0) {
        onError('El portapapeles no contiene imágenes');
        return;
      }

      const processedItems: ClipboardItem[] = [];

      for (const item of imageItems) {
        try {
          const file = item.getAsFile();
          if (file) {
            const blob = new Blob([file], { type: file.type });
            const processedItem = await this.processClipboardBlob(blob, file.type);
            processedItems.push(processedItem);
          }
        } catch (error) {
          console.warn('Failed to process clipboard item:', error);
        }
      }

      if (processedItems.length > 0) {
        onPaste(processedItems);
      } else {
        onError('No se pudo procesar ninguna imagen del portapapeles');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error desconocido del portapapeles');
    }
  }

  /**
   * Process clipboard blob into ClipboardItem
   */
  private async processClipboardBlob(blob: Blob, originalType: string): Promise<ClipboardItem> {
    // Validate size
    if (blob.size > this.options.maxSize) {
      throw new Error(`Image too large: ${blob.size} bytes (max: ${this.options.maxSize} bytes)`);
    }

    // Convert to desired format if needed
    const { convertedBlob, finalType } = await this.convertImageFormat(blob, originalType);

    // Generate preview
    const preview = this.options.generatePreview 
      ? await this.generatePreview(convertedBlob)
      : '';

    // Generate filename
    const fileName = this.generateFileName(finalType);

    const clipboardItem: ClipboardItem = {
      id: this.generateId(),
      type: finalType,
      blob: convertedBlob,
      preview,
      fileName,
      timestamp: Date.now()
    };

    return clipboardItem;
  }

  /**
   * Convert image to desired format
   */
  private async convertImageFormat(
    blob: Blob, 
    originalType: string
  ): Promise<{ convertedBlob: Blob; finalType: string }> {
    const targetFormat = this.options.imageFormat;
    const targetMimeType = `image/${targetFormat}`;

    // If already in target format, return as-is
    if (blob.type === targetMimeType) {
      return { convertedBlob: blob, finalType: targetMimeType };
    }

    try {
      // Create image from blob
      const imageBitmap = await createImageBitmap(blob);
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot create canvas context');
      }

      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;

      // Draw image to canvas
      ctx.drawImage(imageBitmap, 0, 0);

      // Convert to target format
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (convertedBlob) => {
            if (convertedBlob) {
              resolve({ convertedBlob, finalType: targetMimeType });
            } else {
              reject(new Error('Failed to convert image format'));
            }
          },
          targetMimeType,
          this.options.quality
        );
      });
    } catch (error) {
      // If conversion fails, return original
      console.warn('Image format conversion failed, using original:', error);
      return { convertedBlob: blob, finalType: blob.type };
    }
  }

  /**
   * Generate preview image (base64 data URL)
   */
  private async generatePreview(blob: Blob): Promise<string> {
    try {
      const imageBitmap = await createImageBitmap(blob);
      
      // Calculate thumbnail size (max 200x200)
      const maxSize = 200;
      let { width, height } = imageBitmap;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      // Create thumbnail canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot create canvas context');
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(imageBitmap, 0, 0, width, height);

      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (error) {
      console.warn('Failed to generate preview:', error);
      return '';
    }
  }

  /**
   * Generate filename for clipboard item
   */
  private generateFileName(mimeType: string): string {
    const extension = this.getExtensionFromMimeType(mimeType);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `screenshot-${timestamp}.${extension}`;
  }

  /**
   * Get file extension from MIME type
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const extensionMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/webp': 'webp',
      'image/bmp': 'bmp',
      'image/tiff': 'tiff'
    };

    return extensionMap[mimeType] || 'png';
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `clipboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Convert ClipboardItem to File object
   */
  async clipboardItemToFile(item: ClipboardItem): Promise<File> {
    return new File([item.blob], item.fileName, {
      type: item.type,
      lastModified: item.timestamp
    });
  }

  /**
   * Check if clipboard functionality is supported
   */
  static isSupported(): boolean {
    return !!(navigator.clipboard && navigator.clipboard.read);
  }

  /**
   * Check if clipboard has image content
   */
  static async hasImageContent(): Promise<boolean> {
    if (!ClipboardHandler.isSupported()) return false;

    try {
      const items = await navigator.clipboard.read();
      return items.some(item => 
        item.types.some(type => type.startsWith('image/'))
      );
    } catch {
      return false;
    }
  }

  /**
   * Get supported image formats
   */
  static getSupportedFormats(): string[] {
    return ['image/png', 'image/jpeg', 'image/webp', 'image/bmp'];
  }

  /**
   * Validate clipboard permissions
   */
  static async checkPermissions(): Promise<{
    canRead: boolean;
    canWrite: boolean;
    error?: string;
  }> {
    const result = { canRead: false, canWrite: false, error: undefined as string | undefined };

    try {
      // Check read permission
      if (navigator.permissions && navigator.permissions.query) {
        const readPermission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
        result.canRead = readPermission.state === 'granted' || readPermission.state === 'prompt';
        
        const writePermission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
        result.canWrite = writePermission.state === 'granted' || writePermission.state === 'prompt';
      } else {
        // Fallback: assume supported if API exists
        result.canRead = !!navigator.clipboard?.read;
        result.canWrite = !!navigator.clipboard?.write;
      }
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Permission check failed';
    }

    return result;
  }

  /**
   * Show clipboard instructions to user
   */
  static getInstructions(): {
    shortcut: string;
    description: string;
    longDescription: string;
  } {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcut = isMac ? 'Cmd+V' : 'Ctrl+V';
    
    return {
      shortcut,
      description: `Presiona ${shortcut} para pegar desde el portapapeles`,
      longDescription: `Puedes pegar imágenes directamente desde el portapapeles usando ${shortcut}. Esto es útil para capturas de pantalla y imágenes copiadas.`
    };
  }

  /**
   * Update options
   */
  updateOptions(newOptions: Partial<ClipboardHandlerOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Get current options
   */
  getOptions(): ClipboardHandlerOptions {
    return { ...this.options };
  }

  /**
   * Check if currently listening
   */
  isListeningForPaste(): boolean {
    return this.isListening;
  }
}