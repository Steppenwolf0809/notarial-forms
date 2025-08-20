import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import winston from 'winston';
import { 
  ExtractedDataResponse, 
  ErrorResponse 
} from '../schemas/validation';

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Initialize Prisma client
const prisma = new PrismaClient();

// Helper function to parse names
const parsePersonName = (fullName: string): { nombres?: string; apellidos?: string } => {
  if (!fullName) return {};
  
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) {
    return { nombres: parts[0], apellidos: parts[1] || '' };
  }
  
  // Assume first two are nombres, rest are apellidos
  const nombres = parts.slice(0, 2).join(' ');
  const apellidos = parts.slice(2).join(' ');
  
  return { nombres, apellidos };
};

// Helper function to extract vehicle data
const extractVehicleData = (fields: any[]): any => {
  const vehicleData: any = {};
  
  for (const field of fields) {
    const fieldName = field.fieldName.toLowerCase();
    const value = field.value;
    
    if (fieldName.includes('marca')) {
      vehicleData.marca = value;
    } else if (fieldName.includes('modelo')) {
      vehicleData.modelo = value;
    } else if (fieldName.includes('año') || fieldName.includes('year')) {
      vehicleData.año = value;
    } else if (fieldName.includes('placa') || fieldName.includes('plate')) {
      vehicleData.placa = value;
    } else if (fieldName.includes('motor') || fieldName.includes('engine')) {
      vehicleData.motor = value;
    } else if (fieldName.includes('chasis') || fieldName.includes('chassis')) {
      vehicleData.chasis = value;
    } else if (fieldName.includes('color')) {
      vehicleData.color = value;
    } else if (fieldName.includes('tipo') || fieldName.includes('type')) {
      vehicleData.tipo = value;
    } else if (fieldName.includes('combustible') || fieldName.includes('fuel')) {
      vehicleData.combustible = value;
    } else if (fieldName.includes('comprador') || fieldName.includes('buyer')) {
      vehicleData.comprador = value;
    } else if (fieldName.includes('vendedor') || fieldName.includes('seller')) {
      vehicleData.vendedor = value;
    } else if (fieldName.includes('valor') && fieldName.includes('venta')) {
      vehicleData.valorVenta = value;
    } else if (fieldName.includes('forma') && fieldName.includes('pago')) {
      vehicleData.formaPago = value;
    }
  }
  
  return vehicleData;
};

// Helper function to extract notarial data
const extractNotarialData = (fields: any[]): any => {
  const notarialData: any = {};
  
  for (const field of fields) {
    const fieldName = field.fieldName.toLowerCase();
    const value = field.value;
    
    if (fieldName.includes('numero') && fieldName.includes('escritura')) {
      notarialData.numeroEscritura = value;
    } else if (fieldName.includes('fecha') && fieldName.includes('escritura')) {
      notarialData.fechaEscritura = new Date(value);
    } else if (fieldName.includes('notario')) {
      notarialData.notario = value;
    } else if (fieldName.includes('canton')) {
      notarialData.canton = value;
    } else if (fieldName.includes('provincia')) {
      notarialData.provincia = value;
    } else if (fieldName.includes('valor') && fieldName.includes('operacion')) {
      notarialData.valorOperacion = value;
    } else if (fieldName.includes('forma') && fieldName.includes('pago')) {
      notarialData.formaPago = value;
    } else if (fieldName.includes('articulo') && fieldName.includes('29')) {
      notarialData.articulo29 = value.toLowerCase().includes('si') || value.toLowerCase().includes('yes');
    } else if (fieldName.includes('descripcion') && fieldName.includes('inmueble')) {
      notarialData.descripcionInmueble = value;
    } else if (fieldName.includes('ubicacion') && fieldName.includes('inmueble')) {
      notarialData.ubicacionInmueble = value;
    }
  }
  
  return notarialData;
};

// Helper function to extract person data
const extractPersonsData = (fields: any[]): any[] => {
  const persons: Map<string, any> = new Map();
  
  for (const field of fields) {
    const fieldName = field.fieldName.toLowerCase();
    const value = field.value;
    
    // Try to identify person-related fields
    if (fieldName.includes('nombre') || fieldName.includes('name')) {
      const personKey = 'persona_principal';
      if (!persons.has(personKey)) {
        persons.set(personKey, {});
      }
      
      const person = persons.get(personKey);
      if (fieldName.includes('completo') || fieldName.includes('full')) {
        person.nombreCompleto = value;
        const parsed = parsePersonName(value);
        person.nombres = parsed.nombres;
        person.apellidos = parsed.apellidos;
      } else {
        person.nombreCompleto = value;
        const parsed = parsePersonName(value);
        person.nombres = parsed.nombres;
        person.apellidos = parsed.apellidos;
      }
    } else if (fieldName.includes('cedula') || fieldName.includes('id')) {
      const personKey = 'persona_principal';
      if (!persons.has(personKey)) {
        persons.set(personKey, {});
      }
      persons.get(personKey).cedula = value;
    } else if (fieldName.includes('ruc')) {
      const personKey = 'persona_principal';
      if (!persons.has(personKey)) {
        persons.set(personKey, {});
      }
      persons.get(personKey).ruc = value;
    } else if (fieldName.includes('pasaporte') || fieldName.includes('passport')) {
      const personKey = 'persona_principal';
      if (!persons.has(personKey)) {
        persons.set(personKey, {});
      }
      persons.get(personKey).pasaporte = value;
    }
  }
  
  return Array.from(persons.values()).filter(person => 
    person.nombreCompleto || person.nombres || person.cedula || person.ruc
  );
};

// Helper function to extract company data
const extractCompaniesData = (fields: any[]): any[] => {
  const companies: any[] = [];
  
  for (const field of fields) {
    const fieldName = field.fieldName.toLowerCase();
    const value = field.value;
    
    if (fieldName.includes('sociedad') || fieldName.includes('empresa') || fieldName.includes('company')) {
      const company: any = {};
      
      if (fieldName.includes('denominacion') || fieldName.includes('nombre')) {
        company.denominacion = value;
      }
      
      if (fieldName.includes('ruc')) {
        company.ruc = value;
      }
      
      if (fieldName.includes('tipo')) {
        company.tipoSociedad = value;
      }
      
      if (fieldName.includes('capital')) {
        company.capital = value;
      }
      
      if (fieldName.includes('representante')) {
        company.representanteLegal = value;
      }
      
      if (fieldName.includes('objeto')) {
        company.objetoSocial = value;
      }
      
      if (fieldName.includes('domicilio')) {
        company.domicilio = value;
      }
      
      if (Object.keys(company).length > 0) {
        companies.push(company);
      }
    }
  }
  
  return companies;
};

// Get extracted data formatted for dynamic forms
export const getExtractedData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { format = 'structured' } = req.query;

    logger.info(`Getting extracted data for document ${id}`, {
      requestId: req.requestId,
      documentId: id,
      format
    });

    // Get document with extracted fields
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        extractedFields: {
          where: { confidence: { gte: 0.5 } }, // Filter low-confidence fields
          orderBy: { confidence: 'desc' }
        }
      }
    });

    if (!document) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Document not found',
        details: `No document found with ID: ${id}`,
        code: 'DOCUMENT_NOT_FOUND',
        timestamp: new Date(),
        requestId: req.requestId
      };

      res.status(404).json(errorResponse);
      return;
    }

    if (document.status === 'UPLOADED' || document.status === 'PROCESSING') {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Document not processed',
        details: 'Document has not been processed yet. Please wait for extraction to complete.',
        code: 'DOCUMENT_NOT_PROCESSED',
        timestamp: new Date(),
        requestId: req.requestId
      };

      res.status(400).json(errorResponse);
      return;
    }

    if (!document.extractedFields || document.extractedFields.length === 0) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'No extracted data found',
        details: 'Document processing completed but no data was extracted.',
        code: 'NO_EXTRACTED_DATA',
        timestamp: new Date(),
        requestId: req.requestId
      };

      res.status(404).json(errorResponse);
      return;
    }

    // Get processing metadata
    const processingResult = (document.metadata as any)?.processingResult || {};
    const confidence = processingResult.confidence || 0.8;
    const processingTime = processingResult.processingTime || 0;

    // Determine tramite type based on document type and extracted data
    let tramiteType = processingResult.tramiteType || 'OTRO';
    if (document.type === 'SCREENSHOT_VEHICULO') {
      tramiteType = 'VEHICULO';
    } else if (document.type === 'PDF_EXTRACTO') {
      // Analyze extracted fields to determine tramite type
      const hasVehicleFields = document.extractedFields.some(field => 
        field.fieldName.toLowerCase().includes('placa') || 
        field.fieldName.toLowerCase().includes('motor') ||
        field.fieldName.toLowerCase().includes('chasis')
      );
      
      if (hasVehicleFields) {
        tramiteType = 'VEHICULO';
      } else {
        tramiteType = 'COMPRAVENTA';
      }
    }

    // Structure the extracted data
    const rawFields = document.extractedFields.map(field => ({
      nombre: field.fieldName,
      valor: field.value,
      confianza: field.confidence,
      tipo: field.type || 'other'
    }));

    // Extract structured data based on document type
    const personas = extractPersonsData(document.extractedFields);
    const vehiculo = document.type === 'SCREENSHOT_VEHICULO' || tramiteType === 'VEHICULO' 
      ? extractVehicleData(document.extractedFields) 
      : undefined;
    const notarial = document.type === 'PDF_EXTRACTO' || document.type === 'PDF_DILIGENCIA'
      ? extractNotarialData(document.extractedFields)
      : undefined;
    const sociedades = extractCompaniesData(document.extractedFields);

    // Prepare form data
    const formData: any = {
      camposExtraidos: rawFields
    };

    if (personas.length > 0) {
      formData.personas = personas;
    }

    if (vehiculo && Object.keys(vehiculo).length > 0) {
      formData.vehiculo = vehiculo;
    }

    if (notarial && Object.keys(notarial).length > 0) {
      formData.notarial = notarial;
    }

    if (sociedades.length > 0) {
      formData.sociedades = sociedades;
    }

    // Prepare metadata
    const metadata = {
      source: (document.metadata as any)?.source || 'file_picker',
      processingTime,
      ocrEngine: 'tesseract.js',
      version: '1.0.0',
      ...(((document.metadata as any)?.clipboardData) && {
        clipboardData: {
          originalFormat: (document.metadata as any).clipboardData.originalFormat,
          timestamp: (document.metadata as any).clipboardData.timestamp
        }
      })
    };

    // Create response
    const response: ExtractedDataResponse = {
      success: true,
      data: {
        documentId: document.id,
        documentType: document.type as any,
        tramiteType: tramiteType as any,
        confidence,
        extractedAt: document.updatedAt,
        formData,
        metadata
      }
    };

    logger.info(`Retrieved extracted data for document ${id}`, {
      requestId: req.requestId,
      documentId: id,
      fieldsCount: document.extractedFields.length,
      confidence,
      tramiteType,
      hasPersonas: personas.length > 0,
      hasVehiculo: !!vehiculo,
      hasNotarial: !!notarial,
      hasSociedades: sociedades.length > 0
    });

    res.json(response);

  } catch (error) {
    logger.error(`Error getting extracted data for document ${req.params.id}:`, {
      requestId: req.requestId,
      documentId: req.params.id,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to retrieve extracted data',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'EXTRACTED_DATA_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Get extracted data in raw format (all fields)
export const getRawExtractedData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { minConfidence = 0 } = req.query;

    logger.info(`Getting raw extracted data for document ${id}`, {
      requestId: req.requestId,
      documentId: id,
      minConfidence
    });

    // Get document with all extracted fields
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        extractedFields: {
          where: { confidence: { gte: Number(minConfidence) } },
          orderBy: [
            { confidence: 'desc' },
            { fieldName: 'asc' }
          ]
        }
      }
    });

    if (!document) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Document not found',
        details: `No document found with ID: ${id}`,
        code: 'DOCUMENT_NOT_FOUND',
        timestamp: new Date(),
        requestId: req.requestId
      };

      res.status(404).json(errorResponse);
      return;
    }

    // Group fields by type/category
    const fieldsByType: Record<string, any[]> = {};
    const fieldsByConfidence: Record<string, any[]> = {
      high: [], // >= 0.8
      medium: [], // 0.5 - 0.79
      low: [] // < 0.5
    };

    for (const field of document.extractedFields || []) {
      const fieldData = {
        id: field.id,
        fieldName: field.fieldName,
        value: field.value,
        confidence: field.confidence,
        type: field.type || 'other',
        createdAt: field.createdAt
      };

      // Group by type
      const type = field.type || 'other';
      if (!fieldsByType[type]) {
        fieldsByType[type] = [];
      }
      fieldsByType[type].push(fieldData);

      // Group by confidence
      if (field.confidence >= 0.8) {
        fieldsByConfidence.high.push(fieldData);
      } else if (field.confidence >= 0.5) {
        fieldsByConfidence.medium.push(fieldData);
      } else {
        fieldsByConfidence.low.push(fieldData);
      }
    }

    // Calculate statistics
    const stats = {
      totalFields: document.extractedFields?.length || 0,
      averageConfidence: document.extractedFields?.length > 0 
        ? document.extractedFields.reduce((sum, field) => sum + field.confidence, 0) / document.extractedFields.length
        : 0,
      confidenceDistribution: {
        high: fieldsByConfidence.high.length,
        medium: fieldsByConfidence.medium.length,
        low: fieldsByConfidence.low.length
      },
      fieldTypes: Object.keys(fieldsByType).map(type => ({
        type,
        count: fieldsByType[type].length
      }))
    };

    logger.info(`Retrieved raw extracted data for document ${id}`, {
      requestId: req.requestId,
      documentId: id,
      totalFields: stats.totalFields,
      averageConfidence: stats.averageConfidence
    });

    res.json({
      success: true,
      data: {
        documentId: document.id,
        documentType: document.type,
        status: document.status,
        extractedAt: document.updatedAt,
        fields: {
          all: document.extractedFields || [],
          byType: fieldsByType,
          byConfidence: fieldsByConfidence
        },
        statistics: stats,
        metadata: {
          processingResult: (document.metadata as any)?.processingResult,
          source: (document.metadata as any)?.source
        }
      }
    });

  } catch (error) {
    logger.error(`Error getting raw extracted data for document ${req.params.id}:`, {
      requestId: req.requestId,
      documentId: req.params.id,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to retrieve raw extracted data',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'RAW_DATA_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Health check for extracted-data endpoints
export const extractedDataHealthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // Test database connectivity and get extraction stats
    const [totalExtracted, avgConfidence] = await Promise.all([
      prisma.document.count({
        where: {
          status: { in: ['EXTRACTED', 'SESSION_ACTIVE', 'COMPLETED'] }
        }
      }),
      prisma.extractedField.aggregate({
        _avg: { confidence: true }
      })
    ]);

    const healthResponse = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        statistics: {
          totalExtractedDocuments: totalExtracted,
          averageExtractionConfidence: avgConfidence._avg?.confidence || 0
        },
        services: {
          database: 'connected',
          extraction: 'operational'
        }
      }
    };

    res.json(healthResponse);

  } catch (error) {
    logger.error('Extracted data health check failed:', error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Service unhealthy',
      details: error instanceof Error ? error.message : 'Health check failed',
      code: 'EXTRACTED_DATA_HEALTH_CHECK_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(503).json(errorResponse);
  }
};