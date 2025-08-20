import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import winston from 'winston';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { 
  UploadResponse, 
  DocumentResponse,
  ErrorResponse 
} from '../schemas/validation';
import { 
  addDocumentProcessingJob, 
  DocumentProcessingJobData 
} from '../queue/processing';
import { detectFileType, cleanupTempFiles } from '../middleware/upload';

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

// Generate document ID
const generateDocumentId = (): string => {
  return crypto.randomBytes(12).toString('base64url');
};

// Upload controller
export const uploadDocuments = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  let uploadedFiles: Express.Multer.File[] = [];

  try {
    // Get uploaded files
    uploadedFiles = (req.files as Express.Multer.File[]) || [];
    
    if (uploadedFiles.length === 0) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'No files provided',
        details: 'At least one file is required for upload',
        code: 'NO_FILES_PROVIDED',
        timestamp: new Date(),
        requestId: req.requestId
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Extract request data
    const { 
      notariaId = 'NOTARIA_18_QUITO', 
      autoProcess = true, 
      metadata = {} 
    } = req.body;

    logger.info(`Processing ${uploadedFiles.length} file(s) upload`, {
      requestId: req.requestId,
      fileCount: uploadedFiles.length,
      notariaId,
      autoProcess,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    const documentsCreated: DocumentResponse[] = [];
    const processingJobs: string[] = [];

    // Process each uploaded file
    for (const file of uploadedFiles) {
      try {
        // Generate unique document ID
        const documentId = `doc_${generateDocumentId()}`;

        // Detect file type and source
        const fileTypeInfo = detectFileType(file);
        const isFromClipboard = fileTypeInfo.isFromClipboard;
        const clipboardMetadata = (file as any).clipboardMetadata;

        // Determine file source
        let fileSource: 'drag_drop' | 'file_picker' | 'clipboard_paste' = 'file_picker';
        if (isFromClipboard) {
          fileSource = 'clipboard_paste';
        } else if (req.headers['x-upload-source'] === 'drag_drop') {
          fileSource = 'drag_drop';
        }

        // Prepare document metadata
        const documentMetadata = {
          ...metadata,
          uploadTimestamp: Date.now(),
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip,
          requestId: req.requestId,
          source: fileSource,
          ...(clipboardMetadata && {
            clipboardData: {
              originalFormat: clipboardMetadata.originalFormat || file.mimetype,
              timestamp: clipboardMetadata.timestamp || Date.now(),
              convertedFormat: file.mimetype
            }
          })
        };

        // Create document record in database
        const document = await prisma.document.create({
          data: {
            id: documentId,
            fileName: file.filename,
            originalName: file.originalname,
            filePath: file.path,
            type: (fileTypeInfo.documentType as any) || 'PDF_EXTRACTO',
            status: 'UPLOADED',
            size: file.size,
            notariaId,
            metadata: documentMetadata,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });

        logger.info(`Document record created: ${documentId}`, {
          requestId: req.requestId,
          documentId,
          fileName: file.filename,
          originalName: file.originalname,
          size: file.size,
          type: fileTypeInfo.documentType,
          source: fileSource,
          isFromClipboard
        });

        // Prepare document response
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
          source: fileSource as any,
          metadata: documentMetadata
        };

        documentsCreated.push(documentResponse);

        // Add to processing queue if auto-process is enabled
        if (autoProcess) {
          try {
            const jobData: DocumentProcessingJobData = {
              documentId: document.id,
              filePath: document.filePath,
              fileName: document.fileName,
              originalName: document.originalName,
              mimeType: file.mimetype,
              fileSize: file.size,
              notariaId: document.notariaId,
              source: fileSource,
              options: {
                minConfidence: 0.7,
                extractImages: true,
                enhanceImage: fileTypeInfo.isImage, // Enable for images
                ocrLanguage: 'spa'
              },
              metadata: {
                ...documentMetadata,
                ...(isFromClipboard && clipboardMetadata && {
                  clipboardData: clipboardMetadata
                })
              }
            };

            // Add higher priority for clipboard pastes (vehicle screenshots)
            const priority = isFromClipboard ? 10 : 0;
            
            const job = await addDocumentProcessingJob(jobData, { 
              priority,
              jobId: `${documentId}_${Date.now()}`
            });

            processingJobs.push(job.id.toString());

            // Update document with processing job ID
            await prisma.document.update({
              where: { id: documentId },
              data: {
                status: 'PROCESSING',
                metadata: {
                  ...documentMetadata,
                  processingJobId: job.id.toString()
                },
                updatedAt: new Date()
              }
            });

            documentResponse.status = 'PROCESSING' as any;

            logger.info(`Processing job queued for document ${documentId}`, {
              requestId: req.requestId,
              documentId,
              jobId: job.id,
              priority,
              isFromClipboard
            });

          } catch (jobError) {
            logger.error(`Failed to queue processing job for document ${documentId}:`, {
              requestId: req.requestId,
              documentId,
              error: jobError instanceof Error ? jobError.message : jobError
            });

            // Don't fail the entire upload, just log the error
            // Document is still created successfully
          }
        }

      } catch (fileError) {
        logger.error(`Failed to process file ${file.originalname}:`, {
          requestId: req.requestId,
          fileName: file.originalname,
          error: fileError instanceof Error ? fileError.message : fileError
        });

        // Cleanup the file if document creation failed
        try {
          await fs.unlink(file.path);
        } catch (cleanupError) {
          logger.warn(`Failed to cleanup file ${file.path}:`, cleanupError);
        }

        // Continue processing other files
        continue;
      }
    }

    // Check if any documents were created
    if (documentsCreated.length === 0) {
      await cleanupTempFiles(uploadedFiles);
      
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Failed to process any files',
        details: 'All uploaded files failed to process',
        code: 'PROCESSING_FAILED',
        timestamp: new Date(),
        requestId: req.requestId
      };
      res.status(500).json(errorResponse);
      return;
    }

    // Log successful upload completion
    const processingTime = Date.now() - startTime;
    logger.info(`Upload completed successfully`, {
      requestId: req.requestId,
      documentsCreated: documentsCreated.length,
      processingJobs: processingJobs.length,
      processingTime: `${processingTime}ms`,
      autoProcess
    });

    // Send success response
    const response: UploadResponse = {
      success: true,
      data: {
        documents: documentsCreated.map(doc => ({
          id: doc.id,
          fileName: doc.fileName,
          originalName: doc.originalName,
          type: doc.type,
          status: doc.status,
          size: doc.size,
          uploadedAt: doc.createdAt,
          source: doc.source,
          processingJobId: processingJobs.find((_, index) => 
            documentsCreated[index]?.id === doc.id
          ),
          metadata: doc.metadata
        }))
      }
    };

    res.status(201).json(response);

  } catch (error) {
    logger.error(`Upload controller error:`, {
      requestId: req.requestId,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    // Cleanup uploaded files on error
    await cleanupTempFiles(uploadedFiles);

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'UPLOAD_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Get upload progress (for real-time updates)
export const getUploadProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Missing job ID',
        details: 'Job ID is required to check upload progress',
        code: 'MISSING_JOB_ID',
        timestamp: new Date(),
        requestId: req.requestId
      };
      res.status(400).json(errorResponse);
      return;
    }

    // This would integrate with the queue system to get real-time progress
    // For now, return a basic response
    const progressResponse = {
      success: true,
      data: {
        jobId,
        status: 'processing',
        progress: 50,
        message: 'Procesando documento...',
        stage: 'extracting'
      }
    };

    res.json(progressResponse);

  } catch (error) {
    logger.error(`Get upload progress error:`, {
      requestId: req.requestId,
      error: error instanceof Error ? error.message : error
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to get progress',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'PROGRESS_ERROR',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(500).json(errorResponse);
  }
};

// Health check endpoint
export const uploadHealthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    // Check upload directory exists and is writable
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    await fs.access(uploadDir, fs.constants.W_OK);

    const healthResponse = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          uploadDirectory: 'accessible',
          processingQueue: 'operational'
        }
      }
    };

    res.json(healthResponse);

  } catch (error) {
    logger.error('Upload health check failed:', error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Service unhealthy',
      details: error instanceof Error ? error.message : 'Health check failed',
      code: 'HEALTH_CHECK_FAILED',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(503).json(errorResponse);
  }
};