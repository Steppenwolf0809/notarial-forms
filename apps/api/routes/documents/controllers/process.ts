import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import winston from 'winston';
import fs from 'fs/promises';
import { 
  ProcessingStatus, 
  ErrorResponse 
} from '../schemas/validation';
import { 
  addDocumentProcessingJob, 
  getJobStatus, 
  cancelJob, 
  retryJob,
  DocumentProcessingJobData 
} from '../queue/processing';

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

// Process document manually (or reprocess)
export const processDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      forceReprocess = false,
      options = {}
    } = req.body;

    logger.info(`Processing document ${id}`, {
      requestId: req.requestId,
      documentId: id,
      forceReprocess,
      options
    });

    // Get document
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

    // Check if file still exists
    try {
      await fs.access(document.filePath);
    } catch {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'File not found',
        details: `Document file no longer exists: ${document.filePath}`,
        code: 'FILE_NOT_FOUND',
        timestamp: new Date(),
        requestId: req.requestId
      };

      res.status(404).json(errorResponse);
      return;
    }

    // Check if document is already processed and forceReprocess is false
    if (!forceReprocess && (document.status === 'EXTRACTED' || document.status === 'COMPLETED')) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Document already processed',
        details: 'Document has already been processed. Use forceReprocess=true to reprocess.',
        code: 'ALREADY_PROCESSED',
        timestamp: new Date(),
        requestId: req.requestId
      };

      res.status(400).json(errorResponse);
      return;
    }

    // Check if document is currently being processed
    const currentJobId = (document.metadata as any)?.processingJobId;
    if (currentJobId && !forceReprocess) {
      const jobStatus = await getJobStatus(currentJobId);
      if (jobStatus && (jobStatus.status === 'waiting' || jobStatus.status === 'active')) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Document currently processing',
          details: `Document is already being processed (Job ID: ${currentJobId}). Use forceReprocess=true to cancel and restart.`,
          code: 'CURRENTLY_PROCESSING',
          timestamp: new Date(),
          requestId: req.requestId
        };

        res.status(409).json(errorResponse);
        return;
      }
    }

    // Cancel existing job if force reprocessing
    if (forceReprocess && currentJobId) {
      logger.info(`Cancelling existing processing job ${currentJobId}`, {
        requestId: req.requestId,
        documentId: id,
        jobId: currentJobId
      });
      
      await cancelJob(currentJobId);
    }

    // Clear existing extracted fields if reprocessing
    if (forceReprocess) {
      await prisma.extractedField.deleteMany({
        where: { documentId: document.id }
      });

      logger.info(`Cleared existing extracted fields for document ${id}`, {
        requestId: req.requestId,
        documentId: id
      });
    }

    // Prepare job data
    const metadata = (document.metadata as any) || {};
    const source = metadata.source || 'file_picker';
    const isFromClipboard = source === 'clipboard_paste';
    
    // Get file stats for job data
    const fileStats = await fs.stat(document.filePath);
    const mimeType = document.type === 'PDF_EXTRACTO' || document.type === 'PDF_DILIGENCIA' 
      ? 'application/pdf' 
      : 'image/png'; // Default for screenshots

    const jobData: DocumentProcessingJobData = {
      documentId: document.id,
      filePath: document.filePath,
      fileName: document.fileName,
      originalName: document.originalName,
      mimeType,
      fileSize: fileStats.size,
      notariaId: document.notariaId,
      source: source as any,
      options: {
        forceReprocess,
        minConfidence: options.minConfidence || 0.7,
        extractImages: options.extractImages !== false,
        enhanceImage: options.enhanceImage !== false,
        ocrLanguage: options.ocrLanguage || 'spa'
      },
      metadata: {
        ...metadata,
        processingTriggeredAt: Date.now(),
        triggeredBy: req.requestId
      }
    };

    // Add processing job with higher priority for manual triggers
    const priority = isFromClipboard ? 15 : 10; // Higher priority than auto-processing
    const job = await addDocumentProcessingJob(jobData, {
      priority,
      jobId: `manual_${document.id}_${Date.now()}`
    });

    // Update document status and metadata
    await prisma.document.update({
      where: { id: document.id },
      data: {
        status: 'PROCESSING',
        metadata: {
          ...metadata,
          processingJobId: job.id.toString(),
          lastProcessingTriggered: new Date(),
          processingOptions: jobData.options
        },
        updatedAt: new Date()
      }
    });

    logger.info(`Started processing job for document ${id}`, {
      requestId: req.requestId,
      documentId: id,
      jobId: job.id,
      priority,
      forceReprocess
    });

    // Prepare response
    const response: ProcessingStatus = {
      success: true,
      data: {
        jobId: job.id.toString(),
        documentId: document.id,
        status: 'queued',
        progress: 0,
        startedAt: new Date()
      }
    };

    res.status(202).json(response);

  } catch (error) {
    logger.error(`Error processing document ${req.params.id}:`, {
      requestId: req.requestId,
      documentId: req.params.id,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to start document processing',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'PROCESSING_START_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Get processing status by job ID or document ID
export const getProcessingStatusById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type = 'document' } = req.query; // 'document' or 'job'

    logger.info(`Getting processing status for ${type} ${id}`, {
      requestId: req.requestId,
      id,
      type
    });

    let jobStatus = null;
    let document = null;

    if (type === 'job') {
      // Get status by job ID
      jobStatus = await getJobStatus(id);
      
      if (!jobStatus) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Job not found',
          details: `No processing job found with ID: ${id}`,
          code: 'JOB_NOT_FOUND',
          timestamp: new Date(),
          requestId: req.requestId
        };

        res.status(404).json(errorResponse);
        return;
      }
    } else {
      // Get status by document ID
      document = await prisma.document.findUnique({
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

      // Get job status if document has a processing job
      const jobId = (document.metadata as any)?.processingJobId;
      if (jobId) {
        jobStatus = await getJobStatus(jobId);
      }
    }

    // Prepare response based on available data
    const response: ProcessingStatus = {
      success: true,
      data: {
        jobId: jobStatus ? 
          (typeof jobStatus === 'object' ? id : jobStatus.toString()) : 
          (document?.metadata as any)?.processingJobId || 'unknown',
        documentId: document?.id || 'unknown',
        status: jobStatus?.status || (document ? mapDocumentStatusToJobStatus(document.status) : 'unknown'),
        progress: typeof jobStatus?.progress === 'object' ? jobStatus.progress.progress || 0 : 0
      }
    };

    // Add timestamps if available
    const processingResult = (document?.metadata as any)?.processingResult;
    if (processingResult) {
      response.data.startedAt = document.createdAt;
      if (document.status === 'EXTRACTED' || document.status === 'COMPLETED') {
        response.data.completedAt = document.updatedAt;
      }
    }

    // Add error if job failed
    if (jobStatus?.error) {
      response.data.error = jobStatus.error;
    }

    // Add result if processing completed
    if (jobStatus?.result) {
      response.data.result = {
        documentType: jobStatus.result.documentType,
        tramiteType: jobStatus.result.tramiteType,
        confidence: jobStatus.result.confidence,
        fieldsCount: jobStatus.result.fieldsCount,
        processingTime: jobStatus.result.processingTime,
        extractedFields: jobStatus.result.extractedFields || []
      };
    } else if (processingResult) {
      // Use stored processing result
      response.data.result = {
        documentType: document.type as any,
        tramiteType: processingResult.tramiteType || 'OTRO',
        confidence: processingResult.confidence || 0,
        fieldsCount: processingResult.fieldsCount || 0,
        processingTime: processingResult.processingTime || 0,
        extractedFields: []
      };
    }

    logger.info(`Retrieved processing status for ${type} ${id}`, {
      requestId: req.requestId,
      id,
      type,
      status: response.data.status,
      progress: response.data.progress
    });

    res.json(response);

  } catch (error) {
    logger.error(`Error getting processing status for ${req.query.type || 'document'} ${req.params.id}:`, {
      requestId: req.requestId,
      id: req.params.id,
      type: req.query.type,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to get processing status',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'STATUS_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Cancel processing job
export const cancelProcessing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type = 'document' } = req.query;

    logger.info(`Cancelling processing for ${type} ${id}`, {
      requestId: req.requestId,
      id,
      type
    });

    let jobId = id;

    if (type === 'document') {
      // Get document to find job ID
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

      jobId = (document.metadata as any)?.processingJobId;
      
      if (!jobId) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'No active processing job',
          details: 'Document does not have an active processing job to cancel',
          code: 'NO_ACTIVE_JOB',
          timestamp: new Date(),
          requestId: req.requestId
        };

        res.status(400).json(errorResponse);
        return;
      }
    }

    // Cancel the job
    const cancelled = await cancelJob(jobId);

    if (!cancelled) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Failed to cancel job',
        details: 'Job may not exist or has already completed',
        code: 'CANCEL_FAILED',
        timestamp: new Date(),
        requestId: req.requestId
      };

      res.status(400).json(errorResponse);
      return;
    }

    // Update document status if cancelling by document ID
    if (type === 'document') {
      await prisma.document.update({
        where: { id },
        data: {
          status: 'UPLOADED',
          updatedAt: new Date()
        }
      });
    }

    logger.info(`Successfully cancelled processing job ${jobId}`, {
      requestId: req.requestId,
      jobId,
      type,
      originalId: id
    });

    res.json({
      success: true,
      data: {
        jobId,
        status: 'cancelled',
        message: 'Processing job cancelled successfully'
      }
    });

  } catch (error) {
    logger.error(`Error cancelling processing for ${req.query.type || 'document'} ${req.params.id}:`, {
      requestId: req.requestId,
      id: req.params.id,
      type: req.query.type,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to cancel processing',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'CANCEL_ERROR',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Retry failed processing job
export const retryProcessing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type = 'document' } = req.query;

    logger.info(`Retrying processing for ${type} ${id}`, {
      requestId: req.requestId,
      id,
      type
    });

    let jobId = id;

    if (type === 'document') {
      // Get document to find job ID
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

      jobId = (document.metadata as any)?.processingJobId;
      
      if (!jobId) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'No processing job found',
          details: 'Document does not have a processing job to retry',
          code: 'NO_JOB_TO_RETRY',
          timestamp: new Date(),
          requestId: req.requestId
        };

        res.status(400).json(errorResponse);
        return;
      }
    }

    // Retry the job
    const retriedJob = await retryJob(jobId);

    if (!retriedJob) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Failed to retry job',
        details: 'Job may not exist, is not in failed state, or has exceeded max retries',
        code: 'RETRY_FAILED',
        timestamp: new Date(),
        requestId: req.requestId
      };

      res.status(400).json(errorResponse);
      return;
    }

    // Update document status if retrying by document ID
    if (type === 'document') {
      await prisma.document.update({
        where: { id },
        data: {
          status: 'PROCESSING',
          updatedAt: new Date()
        }
      });
    }

    logger.info(`Successfully retried processing job ${jobId}`, {
      requestId: req.requestId,
      jobId,
      type,
      originalId: id,
      retriedJobId: retriedJob.id
    });

    const response: ProcessingStatus = {
      success: true,
      data: {
        jobId: retriedJob.id.toString(),
        documentId: type === 'document' ? id : 'unknown',
        status: 'queued',
        progress: 0,
        startedAt: new Date()
      }
    };

    res.json(response);

  } catch (error) {
    logger.error(`Error retrying processing for ${req.query.type || 'document'} ${req.params.id}:`, {
      requestId: req.requestId,
      id: req.params.id,
      type: req.query.type,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to retry processing',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'RETRY_ERROR',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Helper function to map document status to job status
function mapDocumentStatusToJobStatus(documentStatus: string): string {
  switch (documentStatus) {
    case 'UPLOADED': return 'waiting';
    case 'PROCESSING': return 'processing';
    case 'EXTRACTED': return 'completed';
    case 'COMPLETED': return 'completed';
    case 'ERROR': return 'failed';
    default: return 'unknown';
  }
}

// Health check for process endpoints
export const processHealthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // Test database connectivity and get processing stats
    const [processingCount, errorCount, totalProcessed] = await Promise.all([
      prisma.document.count({ where: { status: 'PROCESSING' } }),
      prisma.document.count({ where: { status: 'ERROR' } }),
      prisma.document.count({ 
        where: { status: { in: ['EXTRACTED', 'COMPLETED'] } }
      })
    ]);

    const healthResponse = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        statistics: {
          currentlyProcessing: processingCount,
          totalProcessed,
          errorCount,
          successRate: totalProcessed + errorCount > 0 
            ? Math.round((totalProcessed / (totalProcessed + errorCount)) * 100) 
            : 100
        },
        services: {
          database: 'connected',
          processing: 'operational',
          queue: 'operational'
        }
      }
    };

    res.json(healthResponse);

  } catch (error) {
    logger.error('Process health check failed:', error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Service unhealthy',
      details: error instanceof Error ? error.message : 'Health check failed',
      code: 'PROCESS_HEALTH_CHECK_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(503).json(errorResponse);
  }
};