import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import winston from 'winston';

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

// Upload configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '52428800'); // 50MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/bmp',
  'image/tiff',
  'image/webp'
];

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    logger.info(`Created upload directory: ${UPLOAD_DIR}`);
  }
}

// Generate unique filename
function generateFilename(originalname: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalname);
  const baseName = path.basename(originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${timestamp}_${randomString}_${baseName}${ext}`;
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDir();
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const filename = generateFilename(file.originalname);
    cb(null, filename);
  }
});

// File filter for validation
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    logger.warn(`Rejected file with invalid MIME type: ${file.mimetype}`);
    return cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`));
  }
  
  // Additional security checks
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.webp'];
  
  if (!allowedExtensions.includes(ext)) {
    logger.warn(`Rejected file with invalid extension: ${ext}`);
    return cb(new Error(`Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`));
  }
  
  cb(null, true);
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10, // Max 10 files per request
    fieldSize: 50 * 1024 * 1024, // 50MB for base64 data
    fields: 20
  }
});

// Base64 data interface
interface Base64FileData {
  name: string;
  type: string;
  data: string;
  size?: number;
  source: 'clipboard' | 'file';
  metadata?: {
    timestamp?: number;
    originalFormat?: string;
    convertedFormat?: string;
  };
}

// Base64 parser middleware
export const parseBase64Files = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if this is a JSON request with base64 data
    if (req.headers['content-type']?.includes('application/json') && req.body.files) {
      const base64Files: Base64FileData[] = req.body.files;
      const processedFiles: Express.Multer.File[] = [];
      
      await ensureUploadDir();
      
      for (const fileData of base64Files) {
        try {
          // Validate base64 file data
          if (!fileData.name || !fileData.type || !fileData.data) {
            throw new Error('Invalid base64 file data structure');
          }
          
          // Validate MIME type
          if (!ALLOWED_MIME_TYPES.includes(fileData.type.toLowerCase())) {
            throw new Error(`Invalid file type: ${fileData.type}`);
          }
          
          // Remove base64 prefix if present
          const base64Data = fileData.data.replace(/^data:([^;]+);base64,/, '');
          
          // Validate base64 format
          if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
            throw new Error('Invalid base64 data format');
          }
          
          // Convert to buffer
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Validate file size
          if (buffer.length > MAX_FILE_SIZE) {
            throw new Error(`File too large: ${buffer.length} bytes (max: ${MAX_FILE_SIZE} bytes)`);
          }
          
          // Generate filename
          const filename = generateFilename(fileData.name);
          const filepath = path.join(UPLOAD_DIR, filename);
          
          // Save file to disk
          await fs.writeFile(filepath, buffer);
          
          // Create multer-compatible file object
          const multerFile: Express.Multer.File = {
            fieldname: 'files',
            originalname: fileData.name,
            encoding: 'base64',
            mimetype: fileData.type,
            buffer: buffer,
            size: buffer.length,
            filename: filename,
            path: filepath,
            destination: UPLOAD_DIR,
            stream: null as any,
            // Add custom metadata for clipboard files
            ...((fileData.source === 'clipboard' || fileData.metadata) && {
              clipboardMetadata: {
                source: fileData.source,
                ...fileData.metadata
              }
            })
          };
          
          processedFiles.push(multerFile);
          
          logger.info(`Processed base64 file: ${fileData.name} (${buffer.length} bytes)`);
        } catch (error) {
          logger.error(`Failed to process base64 file ${fileData.name}:`, error);
          throw error;
        }
      }
      
      // Attach processed files to request
      req.files = processedFiles;
      
      logger.info(`Processed ${processedFiles.length} base64 files`);
    }
    
    next();
  } catch (error) {
    logger.error('Base64 parsing error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid base64 file data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Multipart upload middleware
export const uploadMultipart = upload.array('files', 10);

// Combined upload middleware that handles both multipart and base64
export const uploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle multipart upload
      uploadMultipart(req, res, (err) => {
        if (err) {
          logger.error('Multipart upload error:', err);
          
          if (err instanceof multer.MulterError) {
            switch (err.code) {
              case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                  success: false,
                  error: 'File too large',
                  details: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
                });
              case 'LIMIT_FILE_COUNT':
                return res.status(400).json({
                  success: false,
                  error: 'Too many files',
                  details: 'Maximum 10 files allowed per request'
                });
              case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                  success: false,
                  error: 'Unexpected field',
                  details: 'Invalid file field name'
                });
              default:
                return res.status(400).json({
                  success: false,
                  error: 'Upload error',
                  details: err.message
                });
            }
          }
          
          return res.status(400).json({
            success: false,
            error: 'File upload failed',
            details: err.message
          });
        }
        
        logger.info(`Uploaded ${(req.files as Express.Multer.File[])?.length || 0} files via multipart`);
        next();
      });
    } else if (contentType.includes('application/json')) {
      // Handle base64 upload
      await parseBase64Files(req, res, next);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported content type',
        details: 'Expected multipart/form-data or application/json'
      });
    }
  } catch (error) {
    logger.error('Upload middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// File cleanup utility
export const cleanupTempFiles = async (files: Express.Multer.File[]) => {
  if (!files || !Array.isArray(files)) return;
  
  for (const file of files) {
    try {
      if (file.path) {
        await fs.unlink(file.path);
        logger.info(`Cleaned up temporary file: ${file.path}`);
      }
    } catch (error) {
      logger.warn(`Failed to cleanup file ${file.path}:`, error);
    }
  }
};

// File type detection utility
export const detectFileType = (file: Express.Multer.File): {
  isPDF: boolean;
  isImage: boolean;
  isFromClipboard: boolean;
  documentType?: string;
} => {
  const isPDF = file.mimetype === 'application/pdf';
  const isImage = file.mimetype.startsWith('image/');
  const isFromClipboard = !!(file as any).clipboardMetadata;
  
  let documentType: string | undefined;
  if (isPDF) {
    // Detect PDF type from filename
    const filename = file.originalname.toLowerCase();
    if (filename.includes('extracto') || filename.includes('escritura')) {
      documentType = 'PDF_EXTRACTO';
    } else if (filename.includes('diligencia') || filename.includes('declaracion')) {
      documentType = 'PDF_DILIGENCIA';
    } else {
      documentType = 'PDF_EXTRACTO'; // Default for PDFs
    }
  } else if (isImage) {
    // Images from clipboard are likely vehicle screenshots
    documentType = isFromClipboard ? 'SCREENSHOT_VEHICULO' : 'PDF_EXTRACTO';
  }
  
  return {
    isPDF,
    isImage,
    isFromClipboard,
    documentType
  };
};

// Export configuration for external use
export const uploadConfig = {
  UPLOAD_DIR,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES
};