import express from 'express';
import cors from 'cors';

// Middleware imports
import { uploadMiddleware } from './middleware/upload';
import {
  addRequestId,
  validateUpload,
  validateCUID,
  uploadRateLimit,
  processRateLimit,
  queryRateLimit,
  validateFileSize,
  validateContentType,
  logRequest
} from './middleware/validation';

// Controller imports
import {
  uploadDocuments,
  getUploadProgress,
  uploadHealthCheck
} from './controllers/upload';

import {
  getDocuments,
  getDocumentById,
  getProcessingStatus,
  getDocumentsByNotaria,
  retrieveHealthCheck
} from './controllers/retrieve';

import {
  getExtractedData,
  getRawExtractedData,
  extractedDataHealthCheck
} from './controllers/extracted-data';

import {
  processDocument,
  getProcessingStatusById,
  cancelProcessing,
  retryProcessing,
  processHealthCheck
} from './controllers/process';

// Form session controllers (cliente completa formulario)
import {
  createFormSession,
  getFormSessionByAccessId,
  updateFormSessionByAccessId,
  completeFormSession,
  generateFormPdf,
  createStandaloneFormSession,
  listFormSessions
} from './controllers/form-session';

// Create router
const router = express.Router();

// Global middleware for all document routes
router.use(addRequestId);
router.use(logRequest);

// CORS configuration for document routes
router.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Upload-Source', 'X-Cedula']
}));

// Health check endpoints
router.get('/health', uploadHealthCheck);
router.get('/health/upload', uploadHealthCheck);
router.get('/health/retrieve', retrieveHealthCheck);
router.get('/health/extract', extractedDataHealthCheck);
router.get('/health/process', processHealthCheck);

// Upload endpoints
router.post('/upload',
  uploadRateLimit,
  validateContentType(['multipart/form-data', 'application/json']),
  validateFileSize(52428800), // 50MB
  uploadMiddleware,
  validateUpload,
  uploadDocuments
);

// Upload progress endpoint
router.get('/upload/progress/:jobId',
  queryRateLimit,
  getUploadProgress
);

// Document retrieval endpoints
router.get('/',
  queryRateLimit,
  getDocuments
);

router.get('/:id',
  queryRateLimit,
  validateCUID('id'),
  getDocumentById
);

router.get('/:id/status',
  queryRateLimit,
  validateCUID('id'),
  getProcessingStatus
);

// Notaria-specific endpoints
router.get('/notaria/:notariaId',
  queryRateLimit,
  getDocumentsByNotaria
);

// Extracted data endpoints
router.get('/:id/extracted-data',
  queryRateLimit,
  validateCUID('id'),
  getExtractedData
);

router.get('/:id/extracted-data/raw',
  queryRateLimit,
  validateCUID('id'),
  getRawExtractedData
);

// Processing endpoints
router.post('/:id/process',
  processRateLimit,
  validateCUID('id'),
  validateContentType(['application/json']),
  processDocument
);

router.get('/processing/:id/status',
  queryRateLimit,
  getProcessingStatusById
);

router.delete('/processing/:id/cancel',
  processRateLimit,
  cancelProcessing
);

router.post('/processing/:id/retry',
  processRateLimit,
  retryProcessing
);

// Form session endpoints
router.post('/:id/form-session',
  processRateLimit,
  validateCUID('id'),
  validateContentType(['application/json']),
  createFormSession
);

router.get('/form-session/:accessId',
  queryRateLimit,
  getFormSessionByAccessId
);

router.put('/form-session/:accessId',
  processRateLimit,
  validateContentType(['application/json']),
  updateFormSessionByAccessId
);

router.post('/form-session/:accessId/complete',
  processRateLimit,
  validateContentType(['application/json']),
  completeFormSession
);

router.get('/form-session/:accessId/pdf',
  queryRateLimit,
  generateFormPdf
);

// Standalone create and list (para flujo simulado del frontend)
router.post('/form-session',
  processRateLimit,
  validateContentType(['application/json']),
  createStandaloneFormSession
);

router.get('/form-session',
  queryRateLimit,
  listFormSessions
);

// Error handling middleware
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Documents route error:', {
    requestId: req.requestId,
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  const errorResponse = {
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    timestamp: new Date(),
    requestId: req.requestId
  };

  res.status(500).json(errorResponse);
});

// 404 handler for unmatched routes
router.use('*', (req: express.Request, res: express.Response) => {
  const errorResponse = {
    success: false,
    error: 'Route not found',
    details: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    code: 'ROUTE_NOT_FOUND',
    timestamp: new Date(),
    requestId: req.requestId
  };

  res.status(404).json(errorResponse);
});

export default router;