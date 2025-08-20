import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import winston from 'winston';
import { 
  DocumentResponse, 
  ErrorResponse, 
  ExtractedDataResponse 
} from '../schemas/validation';
import { getJobStatus } from '../queue/processing';

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

// Get documents with pagination and filters
export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      notariaId,
      search,
      dateFrom,
      dateTo,
      includeFields = false,
      includeSessions = false
    } = req.query as any;

    logger.info(`Retrieving documents with filters`, {
      requestId: req.requestId,
      page,
      limit,
      status,
      type,
      notariaId,
      search,
      includeFields,
      includeSessions
    });

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (notariaId) {
      where.notariaId = notariaId;
    }

    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        { originalName: { contains: search, mode: 'insensitive' } },
        { extractedFields: { some: { value: { contains: search, mode: 'insensitive' } } } }
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    // Build include clause
    const include: any = {};

    if (includeFields) {
      include.extractedFields = {
        orderBy: { createdAt: 'asc' }
      };
    }

    if (includeSessions) {
      include.activeSessions = {
        where: { status: 'ACTIVE' },
        orderBy: { position: 'asc' }
      };
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Execute queries in parallel
    const [documents, totalCount] = await Promise.all([
      prisma.document.findMany({
        where,
        include,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.document.count({ where })
    ]);

    // Transform documents to response format
    const documentsResponse: DocumentResponse[] = documents.map(doc => ({
      id: doc.id,
      fileName: doc.fileName,
      originalName: doc.originalName,
      filePath: doc.filePath,
      type: doc.type as any,
      status: doc.status as any,
      size: doc.size,
      notariaId: doc.notariaId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      source: (doc.metadata as any)?.source || 'file_picker',
      metadata: doc.metadata as any,
      ...(includeFields && {
        extractedFields: doc.extractedFields?.map(field => ({
          id: field.id,
          fieldName: field.fieldName,
          value: field.value,
          confidence: field.confidence,
          type: field.type || 'other',
          createdAt: field.createdAt
        }))
      }),
      ...(includeSessions && {
        activeSessions: doc.activeSessions?.map(session => ({
          id: session.id,
          clientName: session.clientName,
          tramiteType: session.tramiteType as any,
          position: session.position,
          status: session.status as any,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt
        }))
      })
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    logger.info(`Retrieved ${documents.length} documents (page ${page}/${totalPages})`, {
      requestId: req.requestId,
      totalCount,
      totalPages
    });

    // Send response
    res.json({
      success: true,
      data: {
        documents: documentsResponse,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage,
          nextPage: hasNextPage ? page + 1 : null,
          previousPage: hasPreviousPage ? page - 1 : null
        }
      }
    });

  } catch (error) {
    logger.error(`Error retrieving documents:`, {
      requestId: req.requestId,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to retrieve documents',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'RETRIEVE_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Get single document by ID with full relations
export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { includeFields = 'true', includeSessions = 'true' } = req.query;

    logger.info(`Retrieving document ${id}`, {
      requestId: req.requestId,
      documentId: id,
      includeFields,
      includeSessions
    });

    // Build include clause
    const include: any = {};

    if (includeFields === 'true') {
      include.extractedFields = {
        orderBy: { createdAt: 'asc' }
      };
    }

    if (includeSessions === 'true') {
      include.activeSessions = {
        orderBy: { position: 'asc' }
      };
    }

    // Find document
    const document = await prisma.document.findUnique({
      where: { id },
      include
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

    // Transform to response format
    const documentResponse: DocumentResponse = {
      id: document.id,
      fileName: document.fileName,
      originalName: document.originalName,
      filePath: document.filePath,
      type: document.type as any,
      status: document.status as any,
      size: document.size,
      notariaId: document.notariaId,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      source: (document.metadata as any)?.source || 'file_picker',
      metadata: document.metadata as any,
      ...(includeFields === 'true' && {
        extractedFields: document.extractedFields?.map(field => ({
          id: field.id,
          fieldName: field.fieldName,
          value: field.value,
          confidence: field.confidence,
          type: field.type || 'other',
          createdAt: field.createdAt
        }))
      }),
      ...(includeSessions === 'true' && {
        activeSessions: document.activeSessions?.map(session => ({
          id: session.id,
          clientName: session.clientName,
          tramiteType: session.tramiteType as any,
          position: session.position,
          status: session.status as any,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt
        }))
      })
    };

    logger.info(`Retrieved document ${id} successfully`, {
      requestId: req.requestId,
      documentId: id,
      fieldsCount: document.extractedFields?.length || 0,
      sessionsCount: document.activeSessions?.length || 0
    });

    res.json({
      success: true,
      data: {
        document: documentResponse
      }
    });

  } catch (error) {
    logger.error(`Error retrieving document ${req.params.id}:`, {
      requestId: req.requestId,
      documentId: req.params.id,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to retrieve document',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'DOCUMENT_RETRIEVE_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Get processing status for document
export const getProcessingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    logger.info(`Getting processing status for document ${id}`, {
      requestId: req.requestId,
      documentId: id
    });

    // Get document with metadata
    const document = await prisma.document.findUnique({
      where: { id }
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

    // Get processing job ID from metadata
    const processingJobId = (document.metadata as any)?.processingJobId;
    
    let jobStatus = null;
    if (processingJobId) {
      jobStatus = await getJobStatus(processingJobId);
    }

    // Prepare response based on document status and job status
    const response: any = {
      success: true,
      data: {
        documentId: document.id,
        documentStatus: document.status,
        updatedAt: document.updatedAt
      }
    };

    if (jobStatus) {
      response.data.processing = {
        jobId: processingJobId,
        status: jobStatus.status,
        progress: jobStatus.progress || null,
        error: jobStatus.error || null
      };

      // Add processing result if completed
      if (jobStatus.result) {
        response.data.result = {
          documentType: jobStatus.result.documentType,
          tramiteType: jobStatus.result.tramiteType,
          confidence: jobStatus.result.confidence,
          fieldsCount: jobStatus.result.fieldsCount,
          processingTime: jobStatus.result.processingTime
        };
      }
    } else if (document.status === 'EXTRACTED' || document.status === 'COMPLETED') {
      // No active job, but document is processed
      const processingResult = (document.metadata as any)?.processingResult;
      if (processingResult) {
        response.data.result = {
          documentType: document.type,
          tramiteType: processingResult.tramiteType,
          confidence: processingResult.confidence,
          fieldsCount: processingResult.fieldsCount,
          processingTime: processingResult.processingTime
        };
      }
    }

    logger.info(`Retrieved processing status for document ${id}`, {
      requestId: req.requestId,
      documentId: id,
      status: document.status,
      hasJob: !!processingJobId
    });

    res.json(response);

  } catch (error) {
    logger.error(`Error getting processing status for document ${req.params.id}:`, {
      requestId: req.requestId,
      documentId: req.params.id,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to get processing status',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'STATUS_RETRIEVE_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Get documents by notaria with live queue
export const getDocumentsByNotaria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notariaId } = req.params;
    const { status = 'EXTRACTED', includeQueue = 'true' } = req.query;

    logger.info(`Getting documents for notaria ${notariaId}`, {
      requestId: req.requestId,
      notariaId,
      status,
      includeQueue
    });

    // Build query
    const where: any = { notariaId };
    
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Get documents with active sessions if requested
    const include: any = {};
    if (includeQueue === 'true') {
      include.activeSessions = {
        where: { status: 'ACTIVE' },
        orderBy: { position: 'asc' }
      };
    }

    const documents = await prisma.document.findMany({
      where,
      include,
      orderBy: { updatedAt: 'desc' },
      take: 50 // Limit for performance
    });

    // Transform response
    const documentsResponse = documents.map(doc => ({
      id: doc.id,
      fileName: doc.fileName,
      originalName: doc.originalName,
      type: doc.type,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      source: (doc.metadata as any)?.source || 'file_picker',
      ...(includeQueue === 'true' && {
        queuePosition: doc.activeSessions?.[0]?.position || null,
        clientName: doc.activeSessions?.[0]?.clientName || null,
        tramiteType: doc.activeSessions?.[0]?.tramiteType || null
      })
    }));

    // Get queue statistics if requested
    let queueStats = null;
    if (includeQueue === 'true') {
      const activeSessionsCount = await prisma.activeSession.count({
        where: { 
          notariaId,
          status: 'ACTIVE'
        }
      });

      queueStats = {
        activeSessionsCount,
        documentsInQueue: documents.filter(doc => doc.activeSessions?.length > 0).length
      };
    }

    logger.info(`Retrieved ${documents.length} documents for notaria ${notariaId}`, {
      requestId: req.requestId,
      notariaId,
      documentsCount: documents.length,
      queueStats
    });

    res.json({
      success: true,
      data: {
        notariaId,
        documents: documentsResponse,
        ...(queueStats && { queueStats })
      }
    });

  } catch (error) {
    logger.error(`Error getting documents for notaria ${req.params.notariaId}:`, {
      requestId: req.requestId,
      notariaId: req.params.notariaId,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to retrieve documents for notaria',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'NOTARIA_RETRIEVE_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Health check for retrieve endpoints
export const retrieveHealthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`;

    // Get basic stats
    const [totalDocuments, processingCount, extractedCount] = await Promise.all([
      prisma.document.count(),
      prisma.document.count({ where: { status: 'PROCESSING' } }),
      prisma.document.count({ where: { status: 'EXTRACTED' } })
    ]);

    const healthResponse = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        statistics: {
          totalDocuments,
          processingDocuments: processingCount,
          extractedDocuments: extractedCount
        },
        services: {
          database: 'connected',
          retrieval: 'operational'
        }
      }
    };

    res.json(healthResponse);

  } catch (error) {
    logger.error('Retrieve health check failed:', error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Service unhealthy',
      details: error instanceof Error ? error.message : 'Health check failed',
      code: 'RETRIEVE_HEALTH_CHECK_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(503).json(errorResponse);
  }
};