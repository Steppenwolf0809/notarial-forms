import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { 
  DocumentType, 
  DocumentExtractor, 
  ExtractionResult, 
  ExtractedField, 
  ExtractionOptions,
  DocumentMetadata,
  TramiteType,
  FieldType,
  VehicleData,
  PersonData
} from '../types';
import { TesseractEngine } from '../engines/TesseractEngine';
import { 
  EcuadorPatterns, 
  PatternValidator, 
  DateParser, 
  FieldExtractor 
} from '../utils/patterns';

export class ScreenshotExtractor implements DocumentExtractor {
  private ocrEngine: TesseractEngine;
  private readonly supportedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.webp'];

  constructor() {
    this.ocrEngine = new TesseractEngine(3); // 3 workers for parallel processing
  }

  supports(documentType: DocumentType): boolean {
    return documentType === DocumentType.SCREENSHOT_VEHICULO;
  }

  async validateInput(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) return false;

      const ext = path.extname(filePath).toLowerCase();
      if (!this.supportedExtensions.includes(ext)) return false;

      // Check if file can be read by Sharp
      const metadata = await sharp(filePath).metadata();
      return !!(metadata.width && metadata.height);
    } catch {
      return false;
    }
  }

  async getMetadata(filePath: string): Promise<DocumentMetadata> {
    const stats = await fs.stat(filePath);
    
    try {
      const metadata = await sharp(filePath).metadata();
      return {
        fileName: path.basename(filePath),
        fileSize: stats.size,
        mimeType: this.getMimeType(path.extname(filePath)),
        createdDate: stats.birthtime,
        modifiedDate: stats.mtime,
        dimensions: {
          width: metadata.width || 0,
          height: metadata.height || 0
        }
      };
    } catch {
      return {
        fileName: path.basename(filePath),
        fileSize: stats.size,
        mimeType: 'image/unknown',
        createdDate: stats.birthtime,
        modifiedDate: stats.mtime
      };
    }
  }

  private getMimeType(extension: string): string {
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.bmp': 'image/bmp',
      '.tiff': 'image/tiff',
      '.webp': 'image/webp'
    };
    return mimeMap[extension.toLowerCase()] || 'image/unknown';
  }

  async extract(filePath: string, options?: ExtractionOptions): Promise<ExtractionResult> {
    const startTime = Date.now();
    
    try {
      // Validate input
      const isValid = await this.validateInput(filePath);
      if (!isValid) {
        throw new Error('Invalid image file');
      }

      // Get metadata
      const metadata = await this.getMetadata(filePath);

      // Initialize OCR engine
      await this.ocrEngine.initialize();

      // Preprocess image for better OCR
      const preprocessedPaths = await this.preprocessImage(filePath, options);

      // Perform OCR on multiple preprocessed versions
      const ocrResults = await Promise.all(
        preprocessedPaths.map(path => this.ocrEngine.recognize(path))
      );

      // Combine and analyze OCR results
      const bestResult = this.selectBestOCRResult(ocrResults);
      const text = bestResult.text;

      if (!text || text.trim().length === 0) {
        throw new Error('No text content extracted from image');
      }

      // Extract all vehicle-related fields
      const fields = this.extractVehicleFields(text, bestResult.confidence);

      // Build structured vehicle data
      const structuredData = this.buildVehicleStructuredData(fields, text);

      // Calculate overall confidence
      const confidence = this.calculateOverallConfidence(fields, bestResult.confidence);

      const result: ExtractionResult = {
        documentType: DocumentType.SCREENSHOT_VEHICULO,
        tramiteType: TramiteType.VEHICULO,
        fields,
        structuredData,
        processingTime: Date.now() - startTime,
        success: true,
        confidence,
        metadata: {
          ...metadata,
          ocrEngine: 'Tesseract-Spanish',
          extractorVersion: '1.0.0',
          processingDate: new Date()
        }
      };

      // Cleanup preprocessed files
      await this.cleanupTempFiles(preprocessedPaths);

      return result;

    } catch (error) {
      return {
        documentType: DocumentType.SCREENSHOT_VEHICULO,
        tramiteType: TramiteType.VEHICULO,
        fields: [],
        structuredData: {},
        processingTime: Date.now() - startTime,
        success: false,
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          fileName: path.basename(filePath),
          fileSize: 0,
          ocrEngine: 'Tesseract-Spanish',
          extractorVersion: '1.0.0',
          processingDate: new Date()
        }
      };
    } finally {
      // Always cleanup
      await this.ocrEngine.terminate();
    }
  }

  private async preprocessImage(filePath: string, options?: ExtractionOptions): Promise<string[]> {
    const baseOutputPath = filePath.replace(/\.[^.]+$/, '');
    const preprocessedPaths: string[] = [];

    try {
      // Standard preprocessing for table data
      const standardPath = `${baseOutputPath}_standard.png`;
      await sharp(filePath)
        .greyscale()
        .normalize()
        .gamma(1.2)
        .sharpen({ sigma: 1, m1: 0.5, m2: 2 })
        .threshold(128)
        .png({ quality: 100 })
        .toFile(standardPath);
      preprocessedPaths.push(standardPath);

      // High contrast version for better text recognition
      const contrastPath = `${baseOutputPath}_contrast.png`;
      await sharp(filePath)
        .greyscale()
        .normalize()
        .linear(1.5, -(128 * 0.5)) // Increase contrast
        .sharpen({ sigma: 1.5 })
        .threshold(120)
        .png({ quality: 100 })
        .toFile(contrastPath);
      preprocessedPaths.push(contrastPath);

      // Scaled version for small text
      const metadata = await sharp(filePath).metadata();
      if (metadata.width && metadata.height) {
        const scaleFactor = Math.max(1, 2000 / Math.max(metadata.width, metadata.height));
        
        if (scaleFactor > 1.2) {
          const scaledPath = `${baseOutputPath}_scaled.png`;
          await sharp(filePath)
            .resize(Math.round(metadata.width * scaleFactor), Math.round(metadata.height * scaleFactor))
            .greyscale()
            .normalize()
            .sharpen()
            .threshold(130)
            .png({ quality: 100 })
            .toFile(scaledPath);
          preprocessedPaths.push(scaledPath);
        }
      }

      // Enhanced version for complex backgrounds
      if (options?.enhanceImage !== false) {
        const enhancedPath = `${baseOutputPath}_enhanced.png`;
        await sharp(filePath)
          .greyscale()
          .blur(0.3)
          .normalize()
          .gamma(0.8)
          .sharpen({ sigma: 2 })
          .threshold(135)
          .median(3) // Remove noise
          .png({ quality: 100 })
          .toFile(enhancedPath);
        preprocessedPaths.push(enhancedPath);
      }

      return preprocessedPaths;
    } catch (error) {
      // Cleanup any partial files
      await this.cleanupTempFiles(preprocessedPaths);
      throw new Error(`Image preprocessing failed: ${error}`);
    }
  }

  private selectBestOCRResult(results: any[]): any {
    if (results.length === 0) {
      throw new Error('No OCR results available');
    }

    // Sort by confidence and content quality
    const scoredResults = results.map(result => ({
      result,
      score: this.scoreOCRResult(result)
    }));

    scoredResults.sort((a, b) => b.score - a.score);
    return scoredResults[0].result;
  }

  private scoreOCRResult(result: any): number {
    const confidence = result.confidence || 0;
    const text = result.text || '';
    
    // Base score from confidence
    let score = confidence * 0.6;

    // Bonus for vehicle-specific content
    const vehicleKeywords = ['TOYOTA', 'CHEVROLET', 'NISSAN', 'PLACA', 'MOTOR', 'CHASIS', 'COMPRADOR', 'VENDEDOR'];
    const keywordCount = vehicleKeywords.filter(keyword => 
      text.toUpperCase().includes(keyword)
    ).length;
    score += keywordCount * 0.05;

    // Bonus for finding cédulas
    const cedulaMatches = text.match(EcuadorPatterns.cedula) || [];
    const validCedulas = cedulaMatches.filter(cedula => PatternValidator.validateCedula(cedula));
    score += validCedulas.length * 0.1;

    // Bonus for finding plates
    const plateMatches = text.match(EcuadorPatterns.plate) || [];
    const validPlates = plateMatches.filter(plate => PatternValidator.validatePlate(plate));
    score += validPlates.length * 0.1;

    // Penalty for very short text
    if (text.length < 50) {
      score *= 0.5;
    }

    return Math.min(1, score);
  }

  private extractVehicleFields(text: string, baseConfidence: number): ExtractedField[] {
    const fields: ExtractedField[] = [];

    // Extract standard fields first
    const standardFields = FieldExtractor.extractAllFields(text);
    fields.push(...standardFields.map(field => ({
      ...field,
      confidence: field.confidence * baseConfidence
    })));

    // Extract vehicle-specific fields
    fields.push(...this.extractVehicleBrandAndModel(text, baseConfidence));
    fields.push(...this.extractVehicleIdentifiers(text, baseConfidence));
    fields.push(...this.extractVehicleDetails(text, baseConfidence));
    fields.push(...this.extractTransactionDetails(text, baseConfidence));
    fields.push(...this.extractPersonRoles(text, baseConfidence));

    return this.deduplicateFields(fields);
  }

  private extractVehicleBrandAndModel(text: string, baseConfidence: number): ExtractedField[] {
    const fields: ExtractedField[] = [];
    const upperText = text.toUpperCase();

    // Vehicle brands
    const brandMatches = Array.from(upperText.matchAll(EcuadorPatterns.vehicleBrands));
    brandMatches.forEach((match, index) => {
      if (index < 2) { // Limit to avoid duplicates
        fields.push({
          fieldName: 'marca_vehiculo',
          value: match[0],
          confidence: baseConfidence * 0.95,
          type: FieldType.VEHICLE_BRAND,
          validationStatus: 'valid'
        });

        // Try to find model near brand
        const brandIndex = match.index || 0;
        const contextStart = Math.max(0, brandIndex - 20);
        const contextEnd = Math.min(upperText.length, brandIndex + 50);
        const context = upperText.substring(contextStart, contextEnd);
        
        const modelPattern = /\b[A-Z0-9]{2,15}\b/g;
        const modelMatches = Array.from(context.matchAll(modelPattern));
        
        if (modelMatches.length > 0) {
          const potentialModel = modelMatches.find(m => 
            m[0] !== match[0] && // Not the same as brand
            m[0].length >= 3 && 
            !/^\d+$/.test(m[0]) // Not just numbers
          );
          
          if (potentialModel) {
            fields.push({
              fieldName: 'modelo_vehiculo',
              value: potentialModel[0],
              confidence: baseConfidence * 0.85,
              type: FieldType.VEHICLE_MODEL,
              validationStatus: 'unknown'
            });
          }
        }
      }
    });

    // Vehicle year
    const yearMatches = Array.from(text.matchAll(EcuadorPatterns.vehicleYear));
    yearMatches.forEach(match => {
      if (PatternValidator.validateYear(match[0])) {
        fields.push({
          fieldName: 'año_vehiculo',
          value: match[0],
          confidence: baseConfidence * 0.9,
          type: FieldType.VEHICLE_YEAR,
          validationStatus: 'valid'
        });
      }
    });

    return fields;
  }

  private extractVehicleIdentifiers(text: string, baseConfidence: number): ExtractedField[] {
    const fields: ExtractedField[] = [];

    // Engine numbers
    const engineMatches = Array.from(text.matchAll(EcuadorPatterns.engineNumber));
    engineMatches.forEach(match => {
      // Validate engine number context
      const context = this.getFieldContext(text, match.index || 0, 'MOTOR');
      if (context.isRelevant) {
        fields.push({
          fieldName: 'numero_motor',
          value: match[0],
          confidence: baseConfidence * 0.9,
          type: FieldType.VEHICLE_ENGINE,
          validationStatus: 'valid'
        });
      }
    });

    // Chassis numbers
    const chassisMatches = Array.from(text.matchAll(EcuadorPatterns.chassisNumber));
    chassisMatches.forEach(match => {
      if (PatternValidator.validateChassisNumber(match[0])) {
        const context = this.getFieldContext(text, match.index || 0, 'CHASIS');
        fields.push({
          fieldName: 'numero_chasis',
          value: match[0],
          confidence: baseConfidence * (context.isRelevant ? 0.95 : 0.8),
          type: FieldType.VEHICLE_CHASSIS,
          validationStatus: 'valid'
        });
      }
    });

    return fields;
  }

  private extractVehicleDetails(text: string, baseConfidence: number): ExtractedField[] {
    const fields: ExtractedField[] = [];
    const upperText = text.toUpperCase();

    // Vehicle type
    const vehicleTypes = ['AUTOMOVIL', 'CAMIONETA', 'MOTOCICLETA', 'CAMION', 'BUS', 'TAXI'];
    for (const type of vehicleTypes) {
      if (upperText.includes(type)) {
        fields.push({
          fieldName: 'tipo_vehiculo',
          value: type,
          confidence: baseConfidence * 0.9,
          type: FieldType.OTHER,
          validationStatus: 'valid'
        });
        break;
      }
    }

    // Color
    const colors = ['BLANCO', 'NEGRO', 'AZUL', 'ROJO', 'GRIS', 'PLATEADO', 'DORADO', 'VERDE', 'AMARILLO'];
    for (const color of colors) {
      if (upperText.includes(color)) {
        fields.push({
          fieldName: 'color_vehiculo',
          value: color,
          confidence: baseConfidence * 0.8,
          type: FieldType.OTHER,
          validationStatus: 'valid'
        });
        break;
      }
    }

    // Fuel type
    const fuelTypes = ['GASOLINA', 'DIESEL', 'GAS', 'HIBRIDO', 'ELECTRICO'];
    for (const fuel of fuelTypes) {
      if (upperText.includes(fuel)) {
        fields.push({
          fieldName: 'combustible',
          value: fuel,
          confidence: baseConfidence * 0.85,
          type: FieldType.OTHER,
          validationStatus: 'valid'
        });
        break;
      }
    }

    // Transmission
    const transmissions = ['MANUAL', 'AUTOMATICA', 'AUTOMATICO'];
    for (const transmission of transmissions) {
      if (upperText.includes(transmission)) {
        fields.push({
          fieldName: 'transmision',
          value: transmission,
          confidence: baseConfidence * 0.8,
          type: FieldType.OTHER,
          validationStatus: 'valid'
        });
        break;
      }
    }

    return fields;
  }

  private extractTransactionDetails(text: string, baseConfidence: number): ExtractedField[] {
    const fields: ExtractedField[] = [];

    // Sale price
    const amountMatches = Array.from(text.matchAll(EcuadorPatterns.amount));
    amountMatches.forEach(match => {
      const context = this.getFieldContext(text, match.index || 0, 'PRECIO|VALOR|VENTA');
      if (context.isRelevant) {
        fields.push({
          fieldName: 'precio_venta',
          value: match[0],
          confidence: baseConfidence * 0.9,
          type: FieldType.AMOUNT,
          validationStatus: 'valid'
        });
      }
    });

    // Payment method
    const paymentMethods = ['CONTADO', 'CREDITO', 'FINANCIADO', 'CHEQUE', 'TRANSFERENCIA'];
    for (const method of paymentMethods) {
      if (text.toUpperCase().includes(method)) {
        fields.push({
          fieldName: 'forma_pago',
          value: method,
          confidence: baseConfidence * 0.85,
          type: FieldType.FORMA_PAGO,
          validationStatus: 'valid'
        });
        break;
      }
    }

    // Transfer date
    const dateMatches = Array.from(text.matchAll(EcuadorPatterns.dateNumeric));
    dateMatches.forEach(match => {
      const date = DateParser.parseNumericDate(match[0]);
      if (date) {
        fields.push({
          fieldName: 'fecha_transferencia',
          value: match[0],
          confidence: baseConfidence * 0.85,
          type: FieldType.DATE,
          validationStatus: 'valid'
        });
      }
    });

    return fields;
  }

  private extractPersonRoles(text: string, baseConfidence: number): ExtractedField[] {
    const fields: ExtractedField[] = [];

    // Find cédulas and try to determine roles
    const cedulaMatches = Array.from(text.matchAll(EcuadorPatterns.cedula));
    
    cedulaMatches.forEach((match, index) => {
      if (!PatternValidator.validateCedula(match[0])) return;

      const context = this.getFieldContext(text, match.index || 0, 'COMPRADOR|VENDEDOR|PROPIETARIO');
      let role = 'persona';
      
      if (context.matchedKeyword?.includes('COMPRADOR')) {
        role = 'comprador';
      } else if (context.matchedKeyword?.includes('VENDEDOR')) {
        role = 'vendedor';
      } else if (context.matchedKeyword?.includes('PROPIETARIO')) {
        role = 'propietario';
      } else {
        // Assign role based on order
        role = index === 0 ? 'comprador' : 'vendedor';
      }

      fields.push({
        fieldName: `${role}_cedula`,
        value: match[0],
        confidence: baseConfidence * (context.isRelevant ? 0.95 : 0.85),
        type: FieldType.CEDULA,
        validationStatus: 'valid'
      });

      // Try to find name near cédula
      const nameContext = text.substring(
        Math.max(0, (match.index || 0) - 100),
        Math.min(text.length, (match.index || 0) + 100)
      );
      
      const nameMatches = Array.from(nameContext.matchAll(EcuadorPatterns.nameFull));
      if (nameMatches.length > 0) {
        fields.push({
          fieldName: `${role}_nombre`,
          value: nameMatches[0][0],
          confidence: baseConfidence * 0.8,
          type: FieldType.NAME,
          validationStatus: 'unknown'
        });
      }
    });

    return fields;
  }

  private getFieldContext(text: string, fieldIndex: number, keywordPattern: string): {
    isRelevant: boolean;
    matchedKeyword?: string;
    distance?: number;
  } {
    const contextRange = 100;
    const contextStart = Math.max(0, fieldIndex - contextRange);
    const contextEnd = Math.min(text.length, fieldIndex + contextRange);
    const context = text.substring(contextStart, contextEnd).toUpperCase();

    const regex = new RegExp(keywordPattern, 'gi');
    const matches = Array.from(context.matchAll(regex));
    
    if (matches.length === 0) {
      return { isRelevant: false };
    }

    const closestMatch = matches.reduce((closest, match) => {
      const distance = Math.abs((match.index || 0) - (fieldIndex - contextStart));
      return distance < closest.distance ? { match: match[0], distance } : closest;
    }, { match: '', distance: Infinity });

    return {
      isRelevant: closestMatch.distance < contextRange / 2,
      matchedKeyword: closestMatch.match,
      distance: closestMatch.distance
    };
  }

  private deduplicateFields(fields: ExtractedField[]): ExtractedField[] {
    const seen = new Map<string, ExtractedField>();
    
    for (const field of fields) {
      const key = `${field.fieldName}:${field.value}`;
      const existing = seen.get(key);
      
      if (!existing || field.confidence > existing.confidence) {
        seen.set(key, field);
      }
    }
    
    return Array.from(seen.values()).sort((a, b) => b.confidence - a.confidence);
  }

  private buildVehicleStructuredData(fields: ExtractedField[], text: string): { vehicle?: VehicleData; persons?: PersonData[] } {
    const vehicleData: VehicleData = {};
    const persons: PersonData[] = [];

    // Build vehicle data
    fields.forEach(field => {
      switch (field.fieldName) {
        case 'marca_vehiculo':
          vehicleData.marca = field.value;
          break;
        case 'modelo_vehiculo':
          vehicleData.modelo = field.value;
          break;
        case 'año_vehiculo':
          vehicleData.año = field.value;
          break;
        case 'placa':
          vehicleData.placa = field.value;
          break;
        case 'numero_motor':
          vehicleData.motor = field.value;
          break;
        case 'numero_chasis':
          vehicleData.chasis = field.value;
          break;
        case 'color_vehiculo':
          vehicleData.color = field.value;
          break;
        case 'tipo_vehiculo':
          vehicleData.tipo = field.value;
          break;
        case 'combustible':
          vehicleData.combustible = field.value;
          break;
        case 'precio_venta':
          vehicleData.valorVenta = field.value;
          break;
        case 'forma_pago':
          vehicleData.formaPago = field.value;
          break;
        case 'fecha_transferencia':
          const date = DateParser.parseAnyDate(field.value);
          if (date) vehicleData.fechaTransferencia = date;
          break;
      }
    });

    // Build persons data
    const compradorData: PersonData = {};
    const vendedorData: PersonData = {};

    fields.forEach(field => {
      if (field.fieldName.startsWith('comprador_')) {
        const subField = field.fieldName.replace('comprador_', '');
        if (subField === 'cedula') compradorData.cedula = field.value;
        if (subField === 'nombre') compradorData.nombreCompleto = field.value;
      } else if (field.fieldName.startsWith('vendedor_')) {
        const subField = field.fieldName.replace('vendedor_', '');
        if (subField === 'cedula') vendedorData.cedula = field.value;
        if (subField === 'nombre') vendedorData.nombreCompleto = field.value;
      }
    });

    if (Object.keys(compradorData).length > 0) {
      vehicleData.comprador = compradorData;
      persons.push(compradorData);
    }

    if (Object.keys(vendedorData).length > 0) {
      vehicleData.vendedor = vendedorData;
      persons.push(vendedorData);
    }

    const result: any = {};
    if (Object.keys(vehicleData).length > 0) {
      result.vehicle = vehicleData;
    }
    if (persons.length > 0) {
      result.persons = persons;
    }

    return result;
  }

  private calculateOverallConfidence(fields: ExtractedField[], baseConfidence: number): number {
    if (fields.length === 0) return 0;

    const fieldConfidence = fields.reduce((sum, field) => sum + field.confidence, 0) / fields.length;
    
    // Weight OCR confidence with field extraction confidence
    const combinedConfidence = (baseConfidence * 0.4) + (fieldConfidence * 0.6);

    // Bonus for critical vehicle fields
    const criticalFields = fields.filter(f => 
      f.type === FieldType.PLATE || 
      f.type === FieldType.VEHICLE_BRAND ||
      f.type === FieldType.CEDULA ||
      f.fieldName === 'numero_motor'
    );

    const bonus = Math.min(0.15, criticalFields.length * 0.03);
    return Math.min(1, combinedConfidence + bonus);
  }

  private async cleanupTempFiles(filePaths: string[]): Promise<void> {
    try {
      await Promise.all(
        filePaths.map(async (filePath) => {
          try {
            await fs.unlink(filePath);
          } catch {
            // Ignore cleanup errors
          }
        })
      );
    } catch {
      // Ignore cleanup errors
    }
  }
}