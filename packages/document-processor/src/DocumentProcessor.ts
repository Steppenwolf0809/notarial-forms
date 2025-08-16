import fs from 'fs/promises';
import path from 'path';
import { 
  DocumentType, 
  DocumentExtractor, 
  ExtractionResult, 
  ExtractionOptions,
  TramiteType,
  DocumentMetadata 
} from './types';
import { PDFExtractor } from './extractors/PDFExtractor';
import { ScreenshotExtractor } from './extractors/ScreenshotExtractor';

export class DocumentProcessor {
  private extractors: Map<DocumentType, DocumentExtractor> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.initializeExtractors();
  }

  private initializeExtractors(): void {
    // Register PDF extractor for both extracto and diligencia types
    const pdfExtractor = new PDFExtractor();
    this.extractors.set(DocumentType.PDF_EXTRACTO, pdfExtractor);
    this.extractors.set(DocumentType.PDF_DILIGENCIA, pdfExtractor);

    // Register screenshot extractor for vehicle documents
    const screenshotExtractor = new ScreenshotExtractor();
    this.extractors.set(DocumentType.SCREENSHOT_VEHICULO, screenshotExtractor);

    this.initialized = true;
    console.log('DocumentProcessor initialized with', this.extractors.size, 'document types');
  }

  /**
   * Detects document type based on file characteristics and content analysis
   */
  async detectDocumentType(filePath: string): Promise<DocumentType> {
    try {
      await this.validateFilePath(filePath);
      
      const extension = path.extname(filePath).toLowerCase();
      const fileName = path.basename(filePath).toUpperCase();

      // Image files are likely vehicle screenshots
      if (['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.webp'].includes(extension)) {
        return DocumentType.SCREENSHOT_VEHICULO;
      }

      // PDF files require content analysis
      if (extension === '.pdf') {
        return await this.detectPDFType(filePath, fileName);
      }

      // Default fallback
      return DocumentType.PDF_EXTRACTO;
    } catch (error) {
      console.warn('Document type detection failed, using default:', error);
      return DocumentType.PDF_EXTRACTO;
    }
  }

  private async detectPDFType(filePath: string, fileName: string): Promise<DocumentType> {
    // First check filename for obvious indicators
    const diligenciaIndicators = [
      'DILIGENCIA', 'DECLARACION', 'TESTIMONIO', 'RECONOCIMIENTO', 
      'PROTOCOLIZACION', 'ACTA', 'NOTARIAL'
    ];
    
    const extractoIndicators = [
      'EXTRACTO', 'COMPRAVENTA', 'ESCRITURA', 'VENTA', 'DONACION',
      'CONSTITUCION', 'SOCIEDAD', 'FIDEICOMISO', 'CONSORCIO'
    ];

    // Check filename first (fastest method)
    if (diligenciaIndicators.some(indicator => fileName.includes(indicator))) {
      return DocumentType.PDF_DILIGENCIA;
    }

    if (extractoIndicators.some(indicator => fileName.includes(indicator))) {
      return DocumentType.PDF_EXTRACTO;
    }

    // If filename is ambiguous, analyze content
    try {
      const pdfExtractor = this.extractors.get(DocumentType.PDF_EXTRACTO) as PDFExtractor;
      if (pdfExtractor) {
        // Quick validation and metadata check
        const metadata = await pdfExtractor.getMetadata(filePath);
        
        // Small files are often diligencias
        if (metadata.fileSize < 100 * 1024) { // Less than 100KB
          return DocumentType.PDF_DILIGENCIA;
        }

        // Large files with many pages are often extractos
        if (metadata.pageCount && metadata.pageCount > 3) {
          return DocumentType.PDF_EXTRACTO;
        }
      }
    } catch (error) {
      console.warn('PDF content analysis failed:', error);
    }

    // Default to extracto for PDFs
    return DocumentType.PDF_EXTRACTO;
  }

  /**
   * Detects the type of notarial transaction from file characteristics
   */
  detectTramiteType(filePath: string, documentType?: DocumentType): TramiteType {
    const fileName = path.basename(filePath).toUpperCase();
    const extension = path.extname(filePath).toLowerCase();

    // Vehicle documents
    if (documentType === DocumentType.SCREENSHOT_VEHICULO || 
        ['.png', '.jpg', '.jpeg'].includes(extension)) {
      return TramiteType.VEHICULO;
    }

    // Analyze filename for transaction type indicators
    const tramitePatterns: Array<{ type: TramiteType; patterns: string[] }> = [
      {
        type: TramiteType.COMPRAVENTA,
        patterns: ['COMPRAVENTA', 'COMPRA', 'VENTA', 'ADQUISICION', 'TRANSFERENCIA']
      },
      {
        type: TramiteType.DONACION,
        patterns: ['DONACION', 'DONATIVO', 'LIBERALIDAD']
      },
      {
        type: TramiteType.CONSTITUCION_SOCIEDAD,
        patterns: ['CONSTITUCION', 'SOCIEDAD', 'CIA', 'COMPAÑIA', 'S.A.', 'LTDA']
      },
      {
        type: TramiteType.FIDEICOMISO,
        patterns: ['FIDEICOMISO', 'FIDUCIARIO', 'TRUST']
      },
      {
        type: TramiteType.CONSORCIO,
        patterns: ['CONSORCIO', 'UNION', 'TEMPORAL', 'JOINT', 'VENTURE']
      },
      {
        type: TramiteType.DILIGENCIA,
        patterns: ['DILIGENCIA', 'DECLARACION', 'TESTIMONIO', 'ACTA']
      }
    ];

    for (const pattern of tramitePatterns) {
      if (pattern.patterns.some(p => fileName.includes(p))) {
        return pattern.type;
      }
    }

    return TramiteType.OTRO;
  }

  /**
   * Processes a document and extracts all relevant data
   */
  async processDocument(
    filePath: string, 
    options?: ExtractionOptions & { documentType?: DocumentType; tramiteType?: TramiteType }
  ): Promise<ExtractionResult> {
    if (!this.initialized) {
      throw new Error('DocumentProcessor not initialized');
    }

    try {
      // Validate input file
      await this.validateFilePath(filePath);

      // Determine document type
      const documentType = options?.documentType || await this.detectDocumentType(filePath);
      
      // Get appropriate extractor
      const extractor = this.extractors.get(documentType);
      if (!extractor) {
        throw new Error(`No extractor available for document type: ${documentType}`);
      }

      // Validate that extractor supports this document type
      if (!extractor.supports(documentType)) {
        throw new Error(`Extractor does not support document type: ${documentType}`);
      }

      // Validate input with the specific extractor
      const isValidInput = await extractor.validateInput(filePath);
      if (!isValidInput) {
        throw new Error(`Invalid input file for ${documentType} extractor`);
      }

      console.log(`Processing ${documentType} document: ${path.basename(filePath)}`);
      
      // Extract data
      const result = await extractor.extract(filePath, options);

      // Enhance result with additional metadata
      result.metadata = {
        ...result.metadata,
        fileName: path.basename(filePath),
        originalPath: filePath,
        detectedType: documentType,
        processingTimestamp: new Date().toISOString()
      };

      // Log processing results
      this.logProcessingResult(result);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Document processing failed for ${filePath}:`, errorMessage);
      
      return {
        documentType: DocumentType.PDF_EXTRACTO,
        tramiteType: TramiteType.OTRO,
        fields: [],
        structuredData: {},
        processingTime: 0,
        success: false,
        confidence: 0,
        error: errorMessage,
        metadata: {
          fileName: path.basename(filePath),
          fileSize: 0,
          ocrEngine: 'Unknown',
          extractorVersion: '1.0.0',
          processingDate: new Date()
        }
      };
    }
  }

  /**
   * Processes multiple documents in parallel
   */
  async processMultipleDocuments(
    filePaths: string[], 
    options?: ExtractionOptions & { concurrency?: number }
  ): Promise<ExtractionResult[]> {
    const concurrency = options?.concurrency || 3;
    const results: ExtractionResult[] = [];

    // Process in batches to avoid overwhelming the system
    for (let i = 0; i < filePaths.length; i += concurrency) {
      const batch = filePaths.slice(i, i + concurrency);
      const batchPromises = batch.map(filePath => 
        this.processDocument(filePath, options)
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches to prevent resource exhaustion
      if (i + concurrency < filePaths.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return results;
  }

  /**
   * Gets metadata for a document without full processing
   */
  async getDocumentMetadata(filePath: string): Promise<DocumentMetadata> {
    await this.validateFilePath(filePath);
    
    const documentType = await this.detectDocumentType(filePath);
    const extractor = this.extractors.get(documentType);
    
    if (!extractor) {
      throw new Error(`No extractor available for document type: ${documentType}`);
    }

    return extractor.getMetadata(filePath);
  }

  /**
   * Validates if a file can be processed
   */
  async canProcessDocument(filePath: string): Promise<{ 
    canProcess: boolean; 
    documentType?: DocumentType; 
    reason?: string 
  }> {
    try {
      await this.validateFilePath(filePath);
      
      const documentType = await this.detectDocumentType(filePath);
      const extractor = this.extractors.get(documentType);
      
      if (!extractor) {
        return { 
          canProcess: false, 
          reason: `No extractor available for document type: ${documentType}` 
        };
      }

      const isValid = await extractor.validateInput(filePath);
      
      return {
        canProcess: isValid,
        documentType,
        reason: isValid ? undefined : 'File format not supported or corrupted'
      };
    } catch (error) {
      return {
        canProcess: false,
        reason: error instanceof Error ? error.message : 'Unknown validation error'
      };
    }
  }

  /**
   * Gets list of supported file extensions
   */
  getSupportedExtensions(): string[] {
    return ['.pdf', '.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.webp'];
  }

  /**
   * Gets list of supported document types
   */
  getSupportedDocumentTypes(): DocumentType[] {
    return Array.from(this.extractors.keys());
  }

  /**
   * Gets processing statistics and health check
   */
  getProcessorInfo(): {
    initialized: boolean;
    supportedTypes: DocumentType[];
    supportedExtensions: string[];
    extractorCount: number;
  } {
    return {
      initialized: this.initialized,
      supportedTypes: this.getSupportedDocumentTypes(),
      supportedExtensions: this.getSupportedExtensions(),
      extractorCount: this.extractors.size
    };
  }

  private async validateFilePath(filePath: string): Promise<void> {
    try {
      const stats = await fs.stat(filePath);
      
      if (!stats.isFile()) {
        throw new Error(`Path is not a file: ${filePath}`);
      }

      if (stats.size === 0) {
        throw new Error(`File is empty: ${filePath}`);
      }

      if (stats.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error(`File too large (>50MB): ${filePath}`);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${filePath}`);
      }
      throw error;
    }
  }

  private logProcessingResult(result: ExtractionResult): void {
    const status = result.success ? 'SUCCESS' : 'FAILED';
    const confidence = result.success ? `${(result.confidence * 100).toFixed(1)}%` : 'N/A';
    const fieldCount = result.fields.length;
    const processingTime = `${result.processingTime}ms`;

    console.log(
      `[${status}] ${result.documentType} | ` +
      `Fields: ${fieldCount} | ` +
      `Confidence: ${confidence} | ` +
      `Time: ${processingTime}` +
      (result.error ? ` | Error: ${result.error}` : '')
    );

    // Warn about low confidence results
    if (result.success && result.confidence < 0.7) {
      console.warn(`Low confidence result: ${confidence} for ${result.metadata.fileName}`);
    }

    // Warn about slow processing
    if (result.processingTime > 10000) { // 10 seconds
      console.warn(`Slow processing: ${processingTime} for ${result.metadata.fileName}`);
    }
  }
}