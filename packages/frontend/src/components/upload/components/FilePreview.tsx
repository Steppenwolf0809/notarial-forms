import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilePreviewProps, FileStatus, DocumentTypeDescriptions, TramiteTypeDescriptions, FileSource, FileSourceDescriptions } from '../types';

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  onRetry,
  showDetails = true,
  compact = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Generate thumbnail for images
  useEffect(() => {
    if (file.metadata.isImage && file.file) {
      generateThumbnail(file.file)
        .then(setThumbnail)
        .catch(() => setImageError(true));
    } else if (file.preview) {
      setThumbnail(file.preview);
    }
  }, [file.file, file.preview, file.metadata.isImage]);

  const generateThumbnail = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Cannot create canvas context'));
            return;
          }

          // Calculate thumbnail dimensions (max 200x200)
          const maxSize = 200;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get file type icon
  const getFileTypeIcon = () => {
    if (file.metadata.isPDF) {
      return (
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      );
    } else if (file.metadata.isImage) {
      return (
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    const statusConfig = {
      [FileStatus.PENDING]: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'En espera' },
      [FileStatus.VALIDATING]: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Validando' },
      [FileStatus.UPLOADING]: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Subiendo' },
      [FileStatus.PROCESSING]: { bg: 'bg-yellow-100', text: 'text-yellow-600', label: 'Procesando' },
      [FileStatus.COMPLETED]: { bg: 'bg-green-100', text: 'text-green-600', label: 'Completado' },
      [FileStatus.ERROR]: { bg: 'bg-red-100', text: 'text-red-600', label: 'Error' }
    };

    const config = statusConfig[file.status];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Get validation badge
  const getValidationBadge = () => {
    if (!file.validation) return null;

    if (file.validation.isValid) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Válido
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {file.validation.errors.length} error(es)
        </span>
      );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start space-x-3">
          {/* Thumbnail or icon */}
          <div className="flex-shrink-0">
            {thumbnail && !imageError ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                src={thumbnail}
                alt={`Preview de ${file.metadata.name}`}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                onError={() => setImageError(true)}
              />
            ) : (
              getFileTypeIcon()
            )}
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {file.metadata.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatSize(file.metadata.size)}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 uppercase">
                    {file.metadata.extension}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {FileSourceDescriptions[file.metadata.source]}
                  </span>
                  {file.metadata.dimensions && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {file.metadata.dimensions.width}×{file.metadata.dimensions.height}
                      </span>
                    </>
                  )}
                  {file.metadata.source === FileSource.CLIPBOARD_PASTE && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-blue-600">
                        Ctrl+V
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-2">
                {file.status === FileStatus.ERROR && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRetry(file.id)}
                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Reintentar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onRemove(file.id)}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                  title="Eliminar archivo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {showDetails && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                    title={isExpanded ? "Contraer detalles" : "Expandir detalles"}
                  >
                    <motion.svg
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Status badges */}
            <div className="flex items-center space-x-2 mt-2">
              {getStatusBadge()}
              {getValidationBadge()}
            </div>
          </div>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-100 space-y-3 overflow-hidden"
            >
              {/* File metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-medium text-gray-500">Tipo MIME:</span>
                  <span className="ml-2 text-gray-700">{file.metadata.type}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Origen:</span>
                  <span className="ml-2 text-gray-700">{FileSourceDescriptions[file.metadata.source]}</span>
                </div>
                {file.metadata.source !== FileSource.CLIPBOARD_PASTE && (
                  <div>
                    <span className="font-medium text-gray-500">Modificado:</span>
                    <span className="ml-2 text-gray-700">{formatDate(file.metadata.lastModified)}</span>
                  </div>
                )}
                {file.metadata.clipboardData && (
                  <div>
                    <span className="font-medium text-gray-500">Formato original:</span>
                    <span className="ml-2 text-gray-700">{file.metadata.clipboardData.originalFormat}</span>
                  </div>
                )}
              </div>

              {/* Processing results */}
              {file.processing && file.status === FileStatus.COMPLETED && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-3"
                >
                  <h5 className="font-medium text-green-800 mb-2">Procesamiento completado</h5>
                  <div className="space-y-1 text-xs text-green-700">
                    <div>
                      <span className="font-medium">Tipo de documento:</span>
                      <span className="ml-2">{DocumentTypeDescriptions[file.processing.documentType]}</span>
                    </div>
                    <div>
                      <span className="font-medium">Tipo de trámite:</span>
                      <span className="ml-2">{TramiteTypeDescriptions[file.processing.tramiteType]}</span>
                    </div>
                    <div>
                      <span className="font-medium">Confianza:</span>
                      <span className="ml-2">{Math.round(file.processing.confidence * 100)}%</span>
                    </div>
                    <div>
                      <span className="font-medium">Campos extraídos:</span>
                      <span className="ml-2">{file.processing.fieldsCount}</span>
                    </div>
                    <div>
                      <span className="font-medium">Tiempo de procesamiento:</span>
                      <span className="ml-2">{file.processing.processingTime}ms</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Validation errors */}
              {file.validation && !file.validation.isValid && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <h5 className="font-medium text-red-800 mb-2">Errores de validación</h5>
                  <ul className="space-y-1 text-xs text-red-700">
                    {file.validation.errors.map((error, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{error.message}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Validation warnings */}
              {file.validation && file.validation.warnings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                >
                  <h5 className="font-medium text-yellow-800 mb-2">Advertencias</h5>
                  <ul className="space-y-1 text-xs text-yellow-700">
                    {file.validation.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-500 mt-0.5">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Error details */}
              {file.status === FileStatus.ERROR && file.error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <h5 className="font-medium text-red-800 mb-2">Error</h5>
                  <p className="text-xs text-red-700">{file.error}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FilePreview;