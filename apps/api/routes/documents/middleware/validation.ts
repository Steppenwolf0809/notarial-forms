import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import {
  validateUploadRequest,
  validateDocumentQuery,
  validateProcessRequest,
  ValidationError,
  ErrorResponse,
  RateLimitSchema
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

// Request ID generator
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Add request ID to all requests
export const addRequestId = (req: Request, res: Response, next: NextFunction) => {
  req.requestId = generateRequestId();
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

// Generic validation middleware factory
export const validateSchema = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      const validated = schema.parse(data);
      req[source] = validated;
      next();
    } catch (error) {
      logger.error(`Validation error for ${req.method} ${req.path}:`, {
        requestId: req.requestId,
        error: error instanceof ZodError ? error.errors : error,
        data: req[source]
      });

      if (error instanceof ZodError) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Validation failed',
          details: error.errors.map(err => 
            `${err.path.join('.')}: ${err.message}`
          ).join(', '),
          code: 'VALIDATION_ERROR',
          timestamp: new Date(),
          requestId: req.requestId
        };
        
        return res.status(400).json(errorResponse);
      }

      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid request data',
        details: error instanceof Error ? error.message : 'Unknown validation error',
        code: 'INVALID_REQUEST',
        timestamp: new Date(),
        requestId: req.requestId
      };

      res.status(400).json(errorResponse);
    }
  };
};

// Upload request validation
export const validateUpload = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Handle both multipart and JSON requests
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      // For multipart uploads, validate files exist
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'No files provided',
          details: 'At least one file is required for upload',
          code: 'NO_FILES',
          timestamp: new Date(),
          requestId: req.requestId
        };
        return res.status(400).json(errorResponse);
      }
      
      // Validate additional form data if present
      if (req.body.notariaId || req.body.autoProcess || req.body.metadata) {
        try {
          const validatedBody = validateUploadRequest({
            ...req.body,
            autoProcess: req.body.autoProcess === 'true' || req.body.autoProcess === true,
            metadata: req.body.metadata ? JSON.parse(req.body.metadata) : undefined
          });
          req.body = validatedBody;
        } catch (parseError) {
          const errorResponse: ErrorResponse = {
            success: false,
            error: 'Invalid upload parameters',
            details: parseError instanceof Error ? parseError.message : 'Invalid JSON in metadata',
            code: 'INVALID_PARAMS',
            timestamp: new Date(),
            requestId: req.requestId
          };
          return res.status(400).json(errorResponse);
        }
      }
    } else if (contentType.includes('application/json')) {
      // For JSON uploads, validate the entire request body
      const validated = validateUploadRequest(req.body);
      req.body = validated;
    } else {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Unsupported content type',
        details: 'Expected multipart/form-data or application/json',
        code: 'UNSUPPORTED_CONTENT_TYPE',
        timestamp: new Date(),
        requestId: req.requestId
      };
      return res.status(415).json(errorResponse);
    }
    
    next();
  } catch (error) {
    logger.error(`Upload validation error for ${req.method} ${req.path}:`, {
      requestId: req.requestId,
      error: error instanceof ZodError ? error.errors : error,
      body: req.body
    });

    if (error instanceof ZodError) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Upload validation failed',
        details: error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', '),
        code: 'UPLOAD_VALIDATION_ERROR',
        timestamp: new Date(),
        requestId: req.requestId
      };
      
      return res.status(400).json(errorResponse);
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Invalid upload request',
      details: error instanceof Error ? error.message : 'Unknown validation error',
      code: 'INVALID_UPLOAD',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(400).json(errorResponse);
  }
};

// Document query validation
export const validateDocumentQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = validateDocumentQuery(req.query);
    req.query = validated as any;
    next();
  } catch (error) {
    logger.error(`Query validation error for ${req.method} ${req.path}:`, {
      requestId: req.requestId,
      error: error instanceof ZodError ? error.errors : error,
      query: req.query
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Invalid query parameters',
      details: error instanceof ZodError 
        ? error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
        : error instanceof Error ? error.message : 'Unknown validation error',
      code: 'INVALID_QUERY',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(400).json(errorResponse);
  }
};

// Process request validation
export const validateProcessRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = validateProcessRequest(req.body);
    req.body = validated;
    next();
  } catch (error) {
    logger.error(`Process validation error for ${req.method} ${req.path}:`, {
      requestId: req.requestId,
      error: error instanceof ZodError ? error.errors : error,
      body: req.body
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Invalid process request',
      details: error instanceof ZodError 
        ? error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
        : error instanceof Error ? error.message : 'Unknown validation error',
      code: 'INVALID_PROCESS_REQUEST',
      timestamp: new Date(),
      requestId: req.requestId
    };

    res.status(400).json(errorResponse);
  }
};

// CUID validation middleware
export const validateCUID = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    
    if (!value) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Missing parameter',
        details: `Parameter '${paramName}' is required`,
        code: 'MISSING_PARAMETER',
        timestamp: new Date(),
        requestId: req.requestId
      };
      return res.status(400).json(errorResponse);
    }
    
    // CUID format validation (c followed by 25 alphanumeric characters)
    if (!/^c[a-z0-9]{24}$/.test(value)) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid ID format',
        details: `Parameter '${paramName}' must be a valid CUID`,
        code: 'INVALID_ID_FORMAT',
        timestamp: new Date(),
        requestId: req.requestId
      };
      return res.status(400).json(errorResponse);
    }
    
    next();
  };
};

// Rate limiting configurations
export const createRateLimit = (options: Partial<typeof RateLimitSchema._type> = {}) => {
  const config = RateLimitSchema.parse(options);
  
  return rateLimit({
    windowMs: config.windowMs,
    max: config.maxRequests,
    message: {
      success: false,
      error: 'Rate limit exceeded',
      details: config.message,
      code: 'RATE_LIMIT_EXCEEDED',
      timestamp: new Date()
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req, res) => {
      // Skip rate limiting for successful requests if configured
      if (config.skipSuccessfulRequests && res.statusCode < 400) {
        return true;
      }
      
      // Skip rate limiting for failed requests if configured
      if (config.skipFailedRequests && res.statusCode >= 400) {
        return true;
      }
      
      return false;
    },
    keyGenerator: (req) => {
      // Use IP + user agent for more specific rate limiting
      return `${req.ip}-${req.get('User-Agent')}`;
    },
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for ${req.ip}:`, {
        requestId: req.requestId,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method
      });
      
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Rate limit exceeded',
        details: config.message,
        code: 'RATE_LIMIT_EXCEEDED',
        timestamp: new Date(),
        requestId: req.requestId
      };
      
      res.status(429).json(errorResponse);
    }
  });
};

// Specific rate limits for different endpoints
export const uploadRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20, // 20 uploads per 15 minutes
  message: 'Too many file uploads, please try again later'
});

export const processRateLimit = createRateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 50, // 50 process requests per 5 minutes
  message: 'Too many processing requests, please try again later'
});

export const queryRateLimit = createRateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 100, // 100 queries per minute
  message: 'Too many queries, please try again later'
});

// File size validation
export const validateFileSize = (maxSize: number = 50 * 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    
    if (files && Array.isArray(files)) {
      for (const file of files) {
        if (file.size > maxSize) {
          const errorResponse: ErrorResponse = {
            success: false,
            error: 'File too large',
            details: `File '${file.originalname}' exceeds maximum size of ${Math.round(maxSize / (1024 * 1024))}MB`,
            code: 'FILE_TOO_LARGE',
            timestamp: new Date(),
            requestId: req.requestId
          };
          return res.status(400).json(errorResponse);
        }
      }
    }
    
    next();
  };
};

// Content type validation
export const validateContentType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers['content-type'] || '';
    
    const isAllowed = allowedTypes.some(type => contentType.includes(type));
    
    if (!isAllowed) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Unsupported content type',
        details: `Expected one of: ${allowedTypes.join(', ')}`,
        code: 'UNSUPPORTED_CONTENT_TYPE',
        timestamp: new Date(),
        requestId: req.requestId
      };
      return res.status(415).json(errorResponse);
    }
    
    next();
  };
};

// Request logging middleware
export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  logger.info(`${req.method} ${req.path} started`, {
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.path} completed`, {
      requestId: req.requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
};

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}