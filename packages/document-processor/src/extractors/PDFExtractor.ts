import pdf from 'pdf-parse';
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
  NotarialData,
  PersonData,
  CompanyData,
  FideicomisoData,
  ConsorcioData
} from '../types';
import { 
  EcuadorPatterns, 
  PatternValidator, 
  DateParser, 
  FieldExtractor 
} from '../utils/patterns';

export class PDFExtractor implements DocumentExtractor {
  private readonly supportedTypes = [DocumentType.PDF_EXTRACTO, DocumentType.PDF_DILIGENCIA];

  supports(documentType: DocumentType): boolean {
    return this.supportedTypes.includes(documentType);
  }

  async validateInput(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) return false;

      const ext = path.extname(filePath).toLowerCase();
      if (ext !== '.pdf') return false;

      // Check if file can be read
      const buffer = await fs.readFile(filePath);
      if (buffer.length === 0) return false;

      // Basic PDF header check
      const header = buffer.toString('ascii', 0, 4);
      return header === '%PDF';
    } catch {
      return false;
    }
  }

  async getMetadata(filePath: string): Promise<DocumentMetadata> {
    const stats = await fs.stat(filePath);
    const buffer = await fs.readFile(filePath);
    
    try {
      const pdfData = await pdf(buffer);
      return {
        fileName: path.basename(filePath),
        fileSize: stats.size,
        mimeType: 'application/pdf',
        createdDate: stats.birthtime,
        modifiedDate: stats.mtime,
        pageCount: pdfData.numpages
      };
    } catch {
      return {
        fileName: path.basename(filePath),
        fileSize: stats.size,
        mimeType: 'application/pdf',
        createdDate: stats.birthtime,
        modifiedDate: stats.mtime
      };
    }
  }

  async extract(filePath: string, options?: ExtractionOptions): Promise<ExtractionResult> {
    const startTime = Date.now();
    
    try {
      // Validate input
      const isValid = await this.validateInput(filePath);
      if (!isValid) {
        throw new Error('Invalid PDF file');
      }

      // Get metadata
      const metadata = await this.getMetadata(filePath);
      
      // Read and parse PDF
      const buffer = await fs.readFile(filePath);
      const pdfData = await pdf(buffer);
      const text = pdfData.text;

      if (!text || text.trim().length === 0) {
        throw new Error('No text content found in PDF');
      }

      // Detect document and tramite types
      const documentType = options?.forceDocumentType || this.detectDocumentType(text);
      const tramiteType = this.detectTramiteType(text);

      // Extract all fields
      const fields = this.extractAllFields(text, documentType);
      
      // Build structured data
      const structuredData = this.buildStructuredData(fields, text, tramiteType);

      // Calculate overall confidence
      const confidence = this.calculateOverallConfidence(fields);

      const result: ExtractionResult = {
        documentType,
        tramiteType,
        fields,
        structuredData,
        processingTime: Date.now() - startTime,
        success: true,
        confidence,
        metadata: {
          ...metadata,
          ocrEngine: 'PDF-Parse',
          extractorVersion: '1.0.0',
          processingDate: new Date()
        }
      };

      return result;
    } catch (error) {
      return {
        documentType: DocumentType.PDF_EXTRACTO,
        tramiteType: TramiteType.OTRO,
        fields: [],
        structuredData: {},
        processingTime: Date.now() - startTime,
        success: false,
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          fileName: path.basename(filePath),
          fileSize: 0,
          ocrEngine: 'PDF-Parse',
          extractorVersion: '1.0.0',
          processingDate: new Date()
        }
      };
    }
  }

  private detectDocumentType(text: string): DocumentType {
    const upperText = text.toUpperCase();
    
    const extractoKeywords = [
      'EXTRACTO', 'COMPRAVENTA', 'VALOROPERACION', 'VALOR DE LA OPERACION',
      'ARTICULO 29', 'ART. 29', 'ESCRITURA PUBLICA', 'NOTARIO'
    ];
    
    const diligenciaKeywords = [
      'DILIGENCIA', 'DECLARACION', 'TESTIMONIO', 'RECONOCIMIENTO',
      'PROTOCOLIZACION', 'ACTA NOTARIAL'
    ];
    
    // Check for extracto patterns first (more specific)
    if (extractoKeywords.some(keyword => upperText.includes(keyword))) {
      return DocumentType.PDF_EXTRACTO;
    }
    
    // Check for diligencia patterns
    if (diligenciaKeywords.some(keyword => upperText.includes(keyword))) {
      return DocumentType.PDF_DILIGENCIA;
    }
    
    // Default to extracto if unclear
    return DocumentType.PDF_EXTRACTO;
  }

  private detectTramiteType(text: string): TramiteType {
    const upperText = text.toUpperCase();
    
    const typePatterns: Array<{ type: TramiteType; keywords: string[] }> = [
      {
        type: TramiteType.COMPRAVENTA,
        keywords: ['COMPRAVENTA', 'COMPRA VENTA', 'VENTA', 'ADQUISICION', 'TRANSFERENCIA DOMINIO']
      },
      {
        type: TramiteType.DONACION,
        keywords: ['DONACION', 'DONATIVO', 'LIBERALIDAD', 'GRATUITO']
      },
      {
        type: TramiteType.CONSTITUCION_SOCIEDAD,
        keywords: ['CONSTITUCION', 'SOCIEDAD ANONIMA', 'CIA LTDA', 'COMPAÑIA LIMITADA', 'S.A.']
      },
      {
        type: TramiteType.FIDEICOMISO,
        keywords: ['FIDEICOMISO', 'FIDUCIARIO', 'FIDEICOMITENTE', 'BENEFICIARIO FIDEICOMISO']
      },
      {
        type: TramiteType.CONSORCIO,
        keywords: ['CONSORCIO', 'UNION TEMPORAL', 'JOINT VENTURE']
      },
      {
        type: TramiteType.VEHICULO,
        keywords: ['VEHICULO', 'AUTOMOVIL', 'MOTOCICLETA', 'CAMIONETA', 'PLACA', 'MOTOR', 'CHASIS']
      },
      {
        type: TramiteType.DILIGENCIA,
        keywords: ['DILIGENCIA', 'DECLARACION', 'TESTIMONIO', 'ACTA']
      }
    ];

    for (const pattern of typePatterns) {
      if (pattern.keywords.some(keyword => upperText.includes(keyword))) {
        return pattern.type;
      }
    }

    return TramiteType.OTRO;
  }

  private extractAllFields(text: string, documentType: DocumentType): ExtractedField[] {
    const fields: ExtractedField[] = [];

    // Extract standard fields
    fields.push(...FieldExtractor.extractAllFields(text));

    // Extract document-specific fields
    if (documentType === DocumentType.PDF_EXTRACTO) {
      fields.push(...this.extractExtractoSpecificFields(text));
    } else if (documentType === DocumentType.PDF_DILIGENCIA) {
      fields.push(...this.extractDiligenciaSpecificFields(text));
    }

    // Extract legal entity fields
    fields.push(...this.extractLegalEntityFields(text));

    // Extract location fields
    fields.push(...this.extractLocationFields(text));

    // Extract notarial fields
    fields.push(...this.extractNotarialFields(text));

    // Remove duplicates and validate
    return this.deduplicateAndValidateFields(fields);
  }

  private extractExtractoSpecificFields(text: string): ExtractedField[] {
    const fields: ExtractedField[] = [];
    const upperText = text.toUpperCase();

    // Article 29 detection
    if (EcuadorPatterns.articulo29.test(upperText)) {
      fields.push({
        fieldName: 'articulo_29',
        value: 'true',
        confidence: 0.95,
        type: FieldType.OTHER,
        validationStatus: 'valid'
      });
    }

    // Valor de operación
    const valorOperacionMatches = Array.from(text.matchAll(EcuadorPatterns.valorOperacion));
    if (valorOperacionMatches.length > 0) {
      // Look for amounts near "valor operacion"
      const amountMatches = Array.from(text.matchAll(EcuadorPatterns.amount));
      amountMatches.forEach(match => {
        const matchIndex = match.index || 0;
        const valorIndex = valorOperacionMatches[0].index || 0;
        
        // If amount is within 200 characters of "valor operacion"
        if (Math.abs(matchIndex - valorIndex) < 200) {
          fields.push({
            fieldName: 'valor_operacion',
            value: match[0],
            confidence: 0.9,
            type: FieldType.VALOR_OPERACION,
            validationStatus: 'valid'
          });
        }
      });
    }

    // Forma de pago
    const formaPagoMatches = Array.from(text.matchAll(EcuadorPatterns.formaPago));
    if (formaPagoMatches.length > 0) {
      // Extract forma de pago details
      const formaPagoIndex = formaPagoMatches[0].index || 0;
      const contextStart = Math.max(0, formaPagoIndex - 50);
      const contextEnd = Math.min(text.length, formaPagoIndex + 300);
      const context = text.substring(contextStart, contextEnd);
      
      const pagoKeywords = ['CONTADO', 'CREDITO', 'FINANCIADO', 'HIPOTECA', 'PRESTAMO', 'CHEQUE', 'TRANSFERENCIA'];
      for (const keyword of pagoKeywords) {
        if (context.toUpperCase().includes(keyword)) {
          fields.push({
            fieldName: 'forma_pago',
            value: keyword,
            confidence: 0.85,
            type: FieldType.FORMA_PAGO,
            validationStatus: 'valid'
          });
          break;
        }
      }
    }

    // Escritura number
    const escrituraMatches = Array.from(text.matchAll(EcuadorPatterns.escrituraNumber));
    escrituraMatches.forEach(match => {
      if (match[1]) {
        fields.push({
          fieldName: 'numero_escritura',
          value: match[1],
          confidence: 0.9,
          type: FieldType.OTHER,
          validationStatus: 'valid'
        });
      }
    });

    // Repertorio number
    const repertorioMatches = Array.from(text.matchAll(EcuadorPatterns.repertorioNumber));
    repertorioMatches.forEach(match => {
      if (match[1]) {
        fields.push({
          fieldName: 'numero_repertorio',
          value: match[1],
          confidence: 0.9,
          type: FieldType.OTHER,
          validationStatus: 'valid'
        });
      }
    });

    return fields;
  }

  private extractDiligenciaSpecificFields(text: string): ExtractedField[] {
    const fields: ExtractedField[] = [];

    // Extract declarant information
    const nameMatches = Array.from(text.matchAll(EcuadorPatterns.nameFull));
    nameMatches.forEach((match, index) => {
      if (index < 3) { // Limit to first 3 names found
        fields.push({
          fieldName: `declarante_${index + 1}`,
          value: match[0],
          confidence: 0.8,
          type: FieldType.NAME,
          validationStatus: 'unknown'
        });
      }
    });

    // Extract declaration purpose
    const purposeKeywords = ['OBJETO', 'PROPOSITO', 'FINALIDAD', 'MOTIVO'];
    for (const keyword of purposeKeywords) {
      const regex = new RegExp(`${keyword}[:\\s]*([^.]{10,100})`, 'gi');
      const matches = Array.from(text.matchAll(regex));
      if (matches.length > 0) {
        fields.push({
          fieldName: 'objeto_diligencia',
          value: matches[0][1].trim(),
          confidence: 0.75,
          type: FieldType.OTHER,
          validationStatus: 'unknown'
        });
        break;
      }
    }

    return fields;
  }

  private extractLegalEntityFields(text: string): ExtractedField[] {
    const fields: ExtractedField[] = [];

    // Company types
    const companyMatches = Array.from(text.matchAll(EcuadorPatterns.companyTypes));
    companyMatches.forEach(match => {
      fields.push({
        fieldName: 'tipo_sociedad',
        value: match[0],
        confidence: 0.9,
        type: FieldType.OTHER,
        validationStatus: 'valid'
      });
    });

    // Notary references
    const notaryMatches = Array.from(text.matchAll(EcuadorPatterns.notaryNumbers));
    notaryMatches.forEach(match => {
      fields.push({
        fieldName: 'notaria',
        value: match[0],
        confidence: 0.95,
        type: FieldType.NOTARY_NAME,
        validationStatus: 'valid'
      });
    });

    return fields;
  }

  private extractLocationFields(text: string): ExtractedField[] {
    const fields: ExtractedField[] = [];

    // Provinces
    const provinceMatches = Array.from(text.matchAll(EcuadorPatterns.provinces));
    provinceMatches.forEach(match => {
      fields.push({
        fieldName: 'provincia',
        value: match[0],
        confidence: 0.9,
        type: FieldType.LOCATION,
        validationStatus: 'valid'
      });
    });

    // Cantons
    const cantonMatches = Array.from(text.matchAll(EcuadorPatterns.cantons));
    cantonMatches.forEach(match => {
      fields.push({
        fieldName: 'canton',
        value: match[0],
        confidence: 0.9,
        type: FieldType.LOCATION,
        validationStatus: 'valid'
      });
    });

    // Addresses
    const addressMatches = Array.from(text.matchAll(EcuadorPatterns.address));
    addressMatches.forEach((match, index) => {
      if (index < 2) { // Limit to first 2 addresses
        fields.push({
          fieldName: `direccion_${index + 1}`,
          value: match[0],
          confidence: 0.75,
          type: FieldType.ADDRESS,
          validationStatus: 'unknown'
        });
      }
    });

    return fields;
  }

  private extractNotarialFields(text: string): ExtractedField[] {
    const fields: ExtractedField[] = [];

    // Folio numbers
    const folioMatches = Array.from(text.matchAll(EcuadorPatterns.folioNumber));
    folioMatches.forEach(match => {
      if (match[1]) {
        fields.push({
          fieldName: 'numero_folio',
          value: match[1],
          confidence: 0.9,
          type: FieldType.OTHER,
          validationStatus: 'valid'
        });
      }
    });

    // Extract notary names with titles
    const titleMatches = Array.from(text.matchAll(EcuadorPatterns.titles));
    titleMatches.forEach(match => {
      const nameAfterTitle = text.substring((match.index || 0) + match[0].length, (match.index || 0) + match[0].length + 50);
      const nameMatch = nameAfterTitle.match(/([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,3})/);
      
      if (nameMatch) {
        fields.push({
          fieldName: 'notario_nombre',
          value: `${match[0]}${nameMatch[1]}`,
          confidence: 0.85,
          type: FieldType.NOTARY_NAME,
          validationStatus: 'valid'
        });
      }
    });

    return fields;
  }

  private deduplicateAndValidateFields(fields: ExtractedField[]): ExtractedField[] {
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

  private buildStructuredData(fields: ExtractedField[], text: string, tramiteType: TramiteType): any {
    const structuredData: any = {};

    // Build persons data
    const persons = this.buildPersonsData(fields);
    if (persons.length > 0) {
      structuredData.persons = persons;
    }

    // Build notarial data
    const notarial = this.buildNotarialData(fields, text, tramiteType);
    if (Object.keys(notarial).length > 0) {
      structuredData.notarial = notarial;
    }

    // Build companies data if applicable
    const companies = this.buildCompaniesData(fields, text);
    if (companies.length > 0) {
      structuredData.companies = companies;
    }

    return structuredData;
  }

  private buildPersonsData(fields: ExtractedField[]): PersonData[] {
    const persons: PersonData[] = [];
    const personMap = new Map<string, PersonData>();

    // Group fields by person (using cédula as key)
    fields.forEach(field => {
      if (field.type === FieldType.CEDULA) {
        const person: PersonData = personMap.get(field.value) || { cedula: field.value };
        personMap.set(field.value, person);
      }
    });

    // Add other fields to persons
    fields.forEach(field => {
      if (field.type === FieldType.NAME && field.fieldName.includes('declarante')) {
        const person: PersonData = { nombreCompleto: field.value };
        persons.push(person);
      }
    });

    return Array.from(personMap.values()).concat(persons);
  }

  private buildNotarialData(fields: ExtractedField[], text: string, tramiteType: TramiteType): NotarialData {
    const notarial: NotarialData = {
      tipoOperacion: tramiteType
    };

    fields.forEach(field => {
      switch (field.fieldName) {
        case 'numero_escritura':
          notarial.numeroEscritura = field.value;
          break;
        case 'fecha':
          const date = DateParser.parseAnyDate(field.value);
          if (date) notarial.fechaEscritura = date;
          break;
        case 'notario_nombre':
          notarial.notario = field.value;
          break;
        case 'canton':
          notarial.canton = field.value;
          break;
        case 'provincia':
          notarial.provincia = field.value;
          break;
        case 'valor_operacion':
          notarial.valorOperacion = field.value;
          break;
        case 'forma_pago':
          notarial.formaPago = field.value;
          break;
        case 'articulo_29':
          notarial.articulo29 = field.value === 'true';
          break;
      }
    });

    return notarial;
  }

  private buildCompaniesData(fields: ExtractedField[], text: string): CompanyData[] {
    const companies: CompanyData[] = [];

    // Look for company formation documents
    if (text.toUpperCase().includes('CONSTITUCION') || text.toUpperCase().includes('SOCIEDAD')) {
      const company: CompanyData = {};
      
      fields.forEach(field => {
        if (field.fieldName === 'tipo_sociedad') {
          company.tipoSociedad = field.value;
        }
        if (field.type === FieldType.RUC) {
          company.ruc = field.value;
        }
      });

      if (Object.keys(company).length > 0) {
        companies.push(company);
      }
    }

    return companies;
  }

  private calculateOverallConfidence(fields: ExtractedField[]): number {
    if (fields.length === 0) return 0;

    const totalConfidence = fields.reduce((sum, field) => sum + field.confidence, 0);
    const averageConfidence = totalConfidence / fields.length;

    // Apply bonus for critical fields
    const criticalFields = fields.filter(f => 
      f.type === FieldType.CEDULA || 
      f.type === FieldType.RUC || 
      f.fieldName === 'valor_operacion'
    );

    const bonus = criticalFields.length * 0.05;
    return Math.min(1, averageConfidence + bonus);
  }
}