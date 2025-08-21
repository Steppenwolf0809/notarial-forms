import Bull, { Job, Queue } from 'bull';
import Redis from 'ioredis';
import winston from 'winston';
import { DocumentProcessor } from '@notarial-forms/document-processor';
import { PrismaClient } from '@prisma/client';

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

// Initialize Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 1000,
  maxRetriesPerRequest: 3,
  lazyConnect: true
});

// Initialize Prisma client
const prisma = new PrismaClient();

// Document processor instance
const documentProcessor = new DocumentProcessor();

// Job data interfaces
export interface DocumentProcessingJobData {
  documentId: string;
  filePath: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  notariaId: string;
  source: 'drag_drop' | 'file_picker' | 'clipboard_paste';
  options?: {
    forceReprocess?: boolean;
    minConfidence?: number;
    extractImages?: boolean;
    enhanceImage?: boolean;
    ocrLanguage?: 'spa' | 'eng';
  };
  metadata?: {
    clientName?: string;
    clipboardData?: {
      originalFormat: string;
      timestamp: number;
      convertedFormat?: string;
    };
    uploadTimestamp: number;
    userAgent?: string;
    ipAddress?: string;
  };
}

export interface DocumentProcessingResult {
  success: boolean;
  documentType?: string;
  tramiteType?: string;
  confidence?: number;
  fieldsCount?: number;
  processingTime?: number;
  extractedFields?: Array<{
    fieldName: string;
    value: string;
    confidence: number;
    type?: string;
  }>;
  structuredData?: any;
  error?: string;
  retryCount?: number;
}

export interface ProcessingProgress {
  stage: 'queued' | 'processing' | 'extracting' | 'validating' | 'saving' | 'completed' | 'failed';
  progress: number; // 0-100
  message: string;
  details?: any;
}

// Create processing queue
export const processingQueue: Queue<DocumentProcessingJobData> = new Bull('document-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 50, // Keep last 50 failed jobs
    timeout: 10 * 60 * 1000, // 10 minutes timeout
    delay: 0
  },
  settings: {
    stalledInterval: 30 * 1000, // 30 seconds
    maxStalledCount: 1,
    retryProcessDelay: 5000
  }
});

// Job processing handler
processingQueue.process('process-document', 3, async (job: Job<DocumentProcessingJobData>) => {
  const { documentId, filePath, fileName, options = {}, metadata = {} } = job.data;
  
  logger.info(`Starting document processing for job ${job.id}`, {
    jobId: job.id,
    documentId,
    fileName: fileName,
    source: job.data.source
  });

  try {
    // Update job progress - Queued
    await job.progress({
      stage: 'processing',
      progress: 10,
      message: 'Iniciando procesamiento del documento...'
    } as ProcessingProgress);

    // Update document status in database
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'PROCESSING',
        updatedAt: new Date()
      }
    });

    // Check if document type detection is needed for clipboard images
    const shouldAutoDetectVehicle = job.data.source === 'clipboard_paste' && 
                                   job.data.mimeType.startsWith('image/');

    // Update progress - Processing
    await job.progress({
      stage: 'extracting',
      progress: 30,
      message: 'Extrayendo datos del documento...',
      details: { 
        autoDetectVehicle: shouldAutoDetectVehicle,
        ocrLanguage: options.ocrLanguage || 'spa'
      }
    } as ProcessingProgress);

    // Clear any potential Redis cache related to this document before processing
    try {
      const cacheKeys = [
        `document:${documentId}:*`,
        `extracted:${documentId}:*`,
        `ocr:${documentId}:*`,
        `processing:${documentId}:*`
      ];
      
      for (const pattern of cacheKeys) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
          logger.info(`Cleared ${keys.length} Redis cache keys for pattern: ${pattern}`, {
            jobId: job.id,
            documentId,
            pattern
          });
        }
      }
    } catch (cacheError) {
      logger.warn('Failed to clear Redis cache, continuing with processing', {
        jobId: job.id,
        documentId,
        error: cacheError instanceof Error ? cacheError.message : cacheError
      });
    }

    // Process document with document-processor
    const startTime = Date.now();
    const processingResult = await documentProcessor.processDocument(filePath, {
      forceDocumentType: shouldAutoDetectVehicle ? 'SCREENSHOT_VEHICULO' : undefined,
      enhanceImage: options.enhanceImage !== false,
      minConfidence: options.minConfidence || 0.7,
      extractImages: options.extractImages !== false,
      ocrLanguage: options.ocrLanguage || 'spa'
    });
    
    const processingTime = Date.now() - startTime;

    if (!processingResult.success) {
      throw new Error(processingResult.error || 'Document processing failed');
    }

    // Update progress - Validating
    await job.progress({
      stage: 'validating',
      progress: 70,
      message: 'Validando datos extraídos...',
      details: {
        fieldsExtracted: processingResult.fields.length,
        confidence: processingResult.confidence,
        documentType: processingResult.documentType
      }
    } as ProcessingProgress);

    // Validate and structure extracted data
    const structuredData = processingResult.structuredData || {};
    const extractedFields = processingResult.fields.map(field => ({
      fieldName: field.fieldName,
      value: field.value,
      confidence: field.confidence,
      type: field.type || 'other'
    }));

    // Update progress - Saving
    await job.progress({
      stage: 'saving',
      progress: 90,
      message: 'Guardando datos extraídos...'
    } as ProcessingProgress);

    // IMPORTANT: Clear any existing extracted fields before saving new ones
    // This ensures fresh data for each processing and prevents cache contamination
    const deletedFieldsResult = await prisma.extractedField.deleteMany({
      where: { documentId }
    });
    
    logger.info(`Cleared ${deletedFieldsResult.count} existing extracted fields for document ${documentId}`, {
      jobId: job.id,
      documentId,
      deletedCount: deletedFieldsResult.count,
      fileName: fileName,
      originalName: job.data.originalName
    });

    // Save extracted fields to database
    if (extractedFields.length > 0) {
      const fieldsToSave = extractedFields.map(field => ({
        documentId,
        fieldName: field.fieldName,
        value: field.value,
        confidence: field.confidence,
        type: field.type,
        createdAt: new Date()
      }));

      await prisma.extractedField.createMany({
        data: fieldsToSave
      });
      
      logger.info(`Saved ${extractedFields.length} new extracted fields for document ${documentId}`, {
        jobId: job.id,
        documentId,
        fileName: fileName,
        originalName: job.data.originalName,
        fieldCount: extractedFields.length,
        sampleFields: extractedFields.slice(0, 3).map(f => ({ 
          name: f.fieldName, 
          value: f.value.substring(0, 50) + (f.value.length > 50 ? '...' : ''),
          confidence: f.confidence 
        }))
      });
    }

    // Update document with processing results
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'EXTRACTED',
        type: processingResult.documentType as any,
        updatedAt: new Date(),
        // Store structured data as JSON if your schema supports it
        metadata: {
          ...metadata,
          processingResult: {
            confidence: processingResult.confidence,
            fieldsCount: extractedFields.length,
            processingTime,
            tramiteType: processingResult.tramiteType,
            structuredData,
            version: '1.0.0'
          }
        }
      }
    });

    // Update progress - Completed
    await job.progress({
      stage: 'completed',
      progress: 100,
      message: 'Procesamiento completado exitosamente',
      details: {
        fieldsExtracted: extractedFields.length,
        confidence: processingResult.confidence,
        processingTime
      }
    } as ProcessingProgress);

    // Prepare result
    const result: DocumentProcessingResult = {
      success: true,
      documentType: processingResult.documentType,
      tramiteType: processingResult.tramiteType,
      confidence: processingResult.confidence,
      fieldsCount: extractedFields.length,
      processingTime,
      extractedFields,
      structuredData
    };

    // Send webhook notification if configured
    await sendWebhookNotification('document.processed', documentId, {
      documentType: processingResult.documentType,
      tramiteType: processingResult.tramiteType,
      confidence: processingResult.confidence,
      fieldsCount: extractedFields.length,
      processingTime,
      source: job.data.source
    });

    logger.info(`Document processing completed successfully for job ${job.id}`, {
      jobId: job.id,
      documentId,
      fieldsExtracted: extractedFields.length,
      confidence: processingResult.confidence,
      processingTime
    });

    return result;

  } catch (error) {
    logger.error(`Document processing failed for job ${job.id}:`, {
      jobId: job.id,
      documentId,
      error: error instanceof Error ? error.message : error,
      attempt: job.attemptsMade,
      maxAttempts: job.opts.attempts
    });

    // Update document status to error
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'ERROR',
        updatedAt: new Date()
      }
    }).catch(dbError => {
      logger.error('Failed to update document status to ERROR:', dbError);
    });

    // Update job progress - Failed
    await job.progress({
      stage: 'failed',
      progress: 0,
      message: 'Error en el procesamiento del documento',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        attempt: job.attemptsMade,
        maxAttempts: job.opts.attempts
      }
    } as ProcessingProgress).catch(() => {
      // Ignore progress update errors during failure
    });

    // Send error webhook notification
    await sendWebhookNotification('document.failed', documentId, {
      error: error instanceof Error ? error.message : 'Unknown error',
      attempt: job.attemptsMade,
      source: job.data.source
    }).catch(webhookError => {
      logger.error('Failed to send error webhook:', webhookError);
    });

    // Prepare error result
    const result: DocumentProcessingResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown processing error',
      retryCount: job.attemptsMade
    };

    // Re-throw error for Bull to handle retries
    throw error;
  }
});

// Job event handlers
processingQueue.on('completed', (job: Job<DocumentProcessingJobData>, result: DocumentProcessingResult) => {
  logger.info(`Job ${job.id} completed successfully`, {
    jobId: job.id,
    documentId: job.data.documentId,
    fieldsExtracted: result.fieldsCount,
    processingTime: result.processingTime
  });
});

processingQueue.on('failed', (job: Job<DocumentProcessingJobData>, error: Error) => {
  logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, {
    jobId: job.id,
    documentId: job.data.documentId,
    error: error.message,
    attempts: job.attemptsMade
  });
});

processingQueue.on('stalled', (job: Job<DocumentProcessingJobData>) => {
  logger.warn(`Job ${job.id} stalled`, {
    jobId: job.id,
    documentId: job.data.documentId
  });
});

processingQueue.on('progress', (job: Job<DocumentProcessingJobData>, progress: ProcessingProgress) => {
  logger.debug(`Job ${job.id} progress: ${progress.progress}% - ${progress.message}`, {
    jobId: job.id,
    documentId: job.data.documentId,
    stage: progress.stage,
    progress: progress.progress
  });
});

// Queue processing functions
export const addDocumentProcessingJob = async (
  data: DocumentProcessingJobData,
  options: {
    priority?: number;
    delay?: number;
    attempts?: number;
    jobId?: string;
  } = {}
): Promise<Job<DocumentProcessingJobData>> => {
  const job = await processingQueue.add('process-document', data, {
    priority: options.priority || 0,
    delay: options.delay || 0,
    attempts: options.attempts || 3,
    jobId: options.jobId,
    removeOnComplete: 100,
    removeOnFail: 50
  });

  logger.info(`Added document processing job ${job.id}`, {
    jobId: job.id,
    documentId: data.documentId,
    priority: options.priority,
    delay: options.delay
  });

  return job;
};

// Get job status
export const getJobStatus = async (jobId: string): Promise<{
  status: string;
  progress: ProcessingProgress | null;
  result?: DocumentProcessingResult;
  error?: string;
} | null> => {
  try {
    const job = await processingQueue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    const progress = job.progress() as ProcessingProgress;

    return {
      status: state,
      progress: progress || null,
      result: job.returnvalue as DocumentProcessingResult,
      error: job.failedReason
    };
  } catch (error) {
    logger.error(`Failed to get job status for ${jobId}:`, error);
    return null;
  }
};

// Cancel job
export const cancelJob = async (jobId: string): Promise<boolean> => {
  try {
    const job = await processingQueue.getJob(jobId);
    if (!job) return false;

    await job.remove();
    logger.info(`Cancelled job ${jobId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to cancel job ${jobId}:`, error);
    return false;
  }
};

// Retry failed job
export const retryJob = async (jobId: string): Promise<Job<DocumentProcessingJobData> | null> => {
  try {
    const job = await processingQueue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    if (state !== 'failed') {
      throw new Error(`Job is not in failed state: ${state}`);
    }

    await job.retry();
    logger.info(`Retrying job ${jobId}`);
    return job;
  } catch (error) {
    logger.error(`Failed to retry job ${jobId}:`, error);
    return null;
  }
};

// Get queue statistics
export const getQueueStats = async () => {
  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      processingQueue.getWaiting(),
      processingQueue.getActive(),
      processingQueue.getCompleted(),
      processingQueue.getFailed(),
      processingQueue.getDelayed()
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
      total: waiting.length + active.length + completed.length + failed.length + delayed.length
    };
  } catch (error) {
    logger.error('Failed to get queue stats:', error);
    return null;
  }
};

// Clean old jobs
export const cleanOldJobs = async (maxAge: number = 24 * 60 * 60 * 1000) => {
  try {
    const cleaned = await processingQueue.clean(maxAge, 'completed');
    const cleanedFailed = await processingQueue.clean(maxAge, 'failed');
    
    logger.info(`Cleaned ${cleaned.length} completed and ${cleanedFailed.length} failed jobs older than ${maxAge}ms`);
    
    return cleaned.length + cleanedFailed.length;
  } catch (error) {
    logger.error('Failed to clean old jobs:', error);
    return 0;
  }
};

// Webhook notification function
const sendWebhookNotification = async (
  event: string,
  documentId: string,
  data: any
): Promise<void> => {
  try {
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) return;

    const payload = {
      event,
      documentId,
      timestamp: new Date().toISOString(),
      data
    };

    // This would typically use fetch or axios to send HTTP request
    // For now, just log the webhook payload
    logger.info(`Webhook notification: ${event}`, {
      event,
      documentId,
      data: payload
    });

    // TODO: Implement actual HTTP webhook delivery with retry logic
  } catch (error) {
    logger.error('Failed to send webhook notification:', error);
  }
};

// Graceful shutdown
export const gracefulShutdown = async (): Promise<void> => {
  logger.info('Shutting down processing queue...');
  
  try {
    await processingQueue.close();
    await redis.quit();
    await prisma.$disconnect();
    logger.info('Processing queue shutdown completed');
  } catch (error) {
    logger.error('Error during processing queue shutdown:', error);
  }
};

// Handle process signals for graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default processingQueue;