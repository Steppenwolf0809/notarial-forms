import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadProgressProps, FileStatus } from '../types';

const UploadProgress: React.FC<UploadProgressProps> = ({
  file,
  showDetails = true,
  animated = true,
  className = ''
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  // Animate percentage changes
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayPercentage(file.progress.percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayPercentage(file.progress.percentage);
    }
  }, [file.progress.percentage, animated]);

  // Calculate estimated time
  useEffect(() => {
    const timeRemaining = file.progress.timeRemaining;
    if (timeRemaining > 0) {
      if (timeRemaining < 60) {
        setEstimatedTime(`${Math.ceil(timeRemaining)}s restantes`);
      } else if (timeRemaining < 3600) {
        const minutes = Math.ceil(timeRemaining / 60);
        setEstimatedTime(`${minutes}m restantes`);
      } else {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.ceil((timeRemaining % 3600) / 60);
        setEstimatedTime(`${hours}h ${minutes}m restantes`);
      }
    } else {
      setEstimatedTime('');
    }
  }, [file.progress.timeRemaining]);

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format speed
  const formatSpeed = (bytesPerSecond: number): string => {
    if (bytesPerSecond === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Get progress bar color based on status and stage
  const getProgressColor = (): string => {
    switch (file.status) {
      case FileStatus.UPLOADING:
        return 'bg-blue-500';
      case FileStatus.PROCESSING:
        return 'bg-yellow-500';
      case FileStatus.COMPLETED:
        return 'bg-green-500';
      case FileStatus.ERROR:
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (file.status) {
      case FileStatus.UPLOADING:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 text-blue-500"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </motion.div>
        );
      case FileStatus.PROCESSING:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 text-yellow-500"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </motion.div>
        );
      case FileStatus.COMPLETED:
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-4 h-4 text-green-500"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        );
      case FileStatus.ERROR:
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-4 h-4 text-red-500"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
        );
      default:
        return (
          <div className="w-4 h-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
    }
  };

  // Get status text
  const getStatusText = (): string => {
    switch (file.status) {
      case FileStatus.PENDING:
        return 'En espera';
      case FileStatus.VALIDATING:
        return 'Validando archivo';
      case FileStatus.UPLOADING:
        return file.progress.stage === 'upload' ? 'Subiendo' : 'Subiendo archivo';
      case FileStatus.PROCESSING:
        return 'Procesando documento';
      case FileStatus.COMPLETED:
        return 'Completado';
      case FileStatus.ERROR:
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-2">
        {/* Header with file name and status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {getStatusIcon()}
            <span className="text-sm font-medium text-gray-700 truncate">
              {file.metadata.name}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{getStatusText()}</span>
            {displayPercentage > 0 && (
              <motion.span
                key={displayPercentage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono"
              >
                {Math.round(displayPercentage)}%
              </motion.span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors duration-300 ${getProgressColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${displayPercentage}%` }}
              transition={animated ? { duration: 0.5, ease: "easeOut" } : { duration: 0 }}
            />
          </div>
          
          {/* Animated shimmer effect */}
          {(file.status === FileStatus.UPLOADING || file.status === FileStatus.PROCESSING) && animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: [-100, 400] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ width: '100px' }}
            />
          )}
        </div>

        {/* Details section */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-1 overflow-hidden"
            >
              {/* File size and progress details */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {formatSize(file.progress.loaded)} de {formatSize(file.progress.total)}
                </span>
                {file.progress.speed > 0 && (
                  <span>{formatSpeed(file.progress.speed)}</span>
                )}
              </div>

              {/* Estimated time remaining */}
              {estimatedTime && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500"
                >
                  {estimatedTime}
                </motion.div>
              )}

              {/* Processing stage details */}
              {file.status === FileStatus.PROCESSING && file.processing && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200"
                >
                  <div className="flex justify-between items-center">
                    <span>Detectando tipo de documento...</span>
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 bg-yellow-500 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Success details */}
              {file.status === FileStatus.COMPLETED && file.processing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200"
                >
                  <div className="flex justify-between items-center">
                    <span>
                      Documento procesado: {file.processing.documentType}
                    </span>
                    <span className="text-green-600">
                      {Math.round(file.processing.confidence * 100)}% confianza
                    </span>
                  </div>
                  <div className="mt-1 text-green-600">
                    {file.processing.fieldsCount} campos extraídos en {file.processing.processingTime}ms
                  </div>
                </motion.div>
              )}

              {/* Error details */}
              {file.status === FileStatus.ERROR && file.error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200"
                >
                  <div className="font-medium">Error:</div>
                  <div className="mt-1">{file.error}</div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadProgress;