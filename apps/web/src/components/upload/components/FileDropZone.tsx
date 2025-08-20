import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropZoneProps, UploadState, ClipboardItem } from '../types';
import ClipboardZone from './ClipboardZone';

const FileDropZone: React.FC<DropZoneProps> = ({
  config,
  state,
  files,
  onFilesAdded,
  onClipboardPaste,
  onFilesRemoved,
  onStateChange,
  disabled = false,
  className = '',
  children
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragCounter, setDragCounter] = useState(0);

  // Handle file input change
  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      onFilesAdded(selectedFiles);
    }
    // Reset input to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  }, [onFilesAdded]);

  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleClick();
    }
  }, [disabled, handleClick]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled) return;

    setDragCounter(prev => prev + 1);
    
    if (dragCounter === 0) {
      onStateChange(UploadState.DRAGOVER);
    }
  }, [disabled, dragCounter, onStateChange]);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled) return;

    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        onStateChange(UploadState.IDLE);
      }
      return newCounter;
    });
  }, [disabled, onStateChange]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled) return;

    // Show visual feedback for valid files
    const items = Array.from(event.dataTransfer.items);
    const hasValidFiles = items.some(item => {
      if (item.kind === 'file') {
        return config.acceptedTypes.includes(item.type);
      }
      return false;
    });

    event.dataTransfer.dropEffect = hasValidFiles ? 'copy' : 'none';
  }, [disabled, config.acceptedTypes]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled) return;

    setDragCounter(0);
    onStateChange(UploadState.IDLE);

    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFilesAdded(droppedFiles);
    }
  }, [disabled, onFilesAdded, onStateChange]);

  // Get drop zone styling based on state
  const getDropZoneClasses = useCallback(() => {
    const baseClasses = [
      'relative',
      'border-2',
      'border-dashed',
      'rounded-lg',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-offset-2'
    ];

    if (disabled) {
      baseClasses.push(
        'border-gray-200',
        'bg-gray-50',
        'cursor-not-allowed',
        'opacity-50'
      );
    } else {
      switch (state) {
        case UploadState.DRAGOVER:
          baseClasses.push(
            'border-blue-500',
            'bg-blue-50',
            'cursor-copy',
            'shadow-lg',
            'scale-[1.02]'
          );
          break;
        case UploadState.UPLOADING:
        case UploadState.PROCESSING:
          baseClasses.push(
            'border-yellow-400',
            'bg-yellow-50',
            'cursor-wait'
          );
          break;
        case UploadState.SUCCESS:
          baseClasses.push(
            'border-green-500',
            'bg-green-50'
          );
          break;
        case UploadState.ERROR:
          baseClasses.push(
            'border-red-500',
            'bg-red-50'
          );
          break;
        default:
          baseClasses.push(
            'border-gray-300',
            'bg-white',
            'hover:border-blue-400',
            'hover:bg-blue-50',
            'cursor-pointer'
          );
      }
    }

    return baseClasses.join(' ');
  }, [state, disabled]);

  // Get icon based on state
  const getStateIcon = useCallback(() => {
    switch (state) {
      case UploadState.DRAGOVER:
        return (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className="text-blue-500"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </motion.div>
        );
      case UploadState.UPLOADING:
      case UploadState.PROCESSING:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-yellow-500"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.div>
        );
      case UploadState.SUCCESS:
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-green-500"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        );
      case UploadState.ERROR:
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-red-500"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </motion.div>
        );
      default:
        return (
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </motion.div>
        );
    }
  }, [state]);

  // Get state message
  const getStateMessage = useCallback(() => {
    switch (state) {
      case UploadState.DRAGOVER:
        return 'Suelta los archivos aquí';
      case UploadState.UPLOADING:
        return 'Subiendo archivos...';
      case UploadState.PROCESSING:
        return 'Procesando documentos...';
      case UploadState.SUCCESS:
        return `${files.length} archivo(s) procesado(s) exitosamente`;
      case UploadState.ERROR:
        return 'Error en el procesamiento';
      default:
        return config.allowMultiple 
          ? 'Arrastra archivos aquí o haz clic para seleccionar'
          : 'Arrastra un archivo aquí o haz clic para seleccionar';
    }
  }, [state, files.length, config.allowMultiple]);

  // Handle clipboard paste
  const handleClipboardPaste = useCallback((items: ClipboardItem[]) => {
    onClipboardPaste(items);
  }, [onClipboardPaste]);

  // Handle clipboard errors
  const handleClipboardError = useCallback((error: string) => {
    console.error('Clipboard error:', error);
  }, []);

  // Get supported formats text
  const getSupportedFormatsText = useCallback(() => {
    const isPDFSupported = config.acceptedTypes.some(type => type === 'application/pdf');
    const isImageSupported = config.acceptedTypes.some(type => type.startsWith('image/'));
    
    let text = '';
    if (isPDFSupported && isImageSupported) {
      text = 'Formatos soportados: PDF, PNG, JPG, JPEG, BMP, TIFF, WebP';
    } else if (isPDFSupported) {
      text = 'Formato soportado: PDF';
    } else if (isImageSupported) {
      text = 'Formatos soportados: PNG, JPG, JPEG, BMP, TIFF, WebP';
    } else {
      text = 'Consulta los formatos soportados';
    }

    // Add clipboard support note
    if (config.allowClipboard && isImageSupported) {
      text += ' • Ctrl+V para pegar capturas';
    }

    return text;
  }, [config.acceptedTypes, config.allowClipboard]);

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={config.allowMultiple}
        accept={config.acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
        aria-label="Seleccionar archivos para subir"
      />

      {/* Clipboard zone wrapper */}
      <ClipboardZone
        config={config}
        onPaste={handleClipboardPaste}
        onError={handleClipboardError}
        enabled={!disabled}
      >
        {/* Drop zone */}
        <motion.div
        ref={dropRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={getDropZoneClasses()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Zona de arrastre y selección de archivos"
        aria-describedby="drop-zone-description"
        whileHover={!disabled ? { scale: 1.01 } : undefined}
        whileTap={!disabled ? { scale: 0.99 } : undefined}
      >
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
          {/* State icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-4"
            >
              {getStateIcon()}
            </motion.div>
          </AnimatePresence>

          {/* State message */}
          <AnimatePresence mode="wait">
            <motion.h3
              key={state}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-medium mb-2"
            >
              {getStateMessage()}
            </motion.h3>
          </AnimatePresence>

          {/* Supported formats and limits */}
          {state === UploadState.IDLE && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-500 space-y-1"
              id="drop-zone-description"
            >
              <p>{getSupportedFormatsText()}</p>
              <p>Tamaño máximo: {Math.round(config.maxSize / (1024 * 1024))} MB</p>
              {config.allowMultiple && (
                <p>Máximo {config.maxFiles} archivos</p>
              )}
            </motion.div>
          )}

          {/* Additional content slot */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              {children}
            </motion.div>
          )}
        </div>

        {/* Visual overlay for drag state */}
        <AnimatePresence>
          {state === UploadState.DRAGOVER && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Pulse animation for processing states */}
        {(state === UploadState.UPLOADING || state === UploadState.PROCESSING) && (
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(59, 130, 246, 0.4)',
                '0 0 0 10px rgba(59, 130, 246, 0)',
                '0 0 0 0 rgba(59, 130, 246, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-lg pointer-events-none"
          />
        )}
      </motion.div>

      {/* Accessibility improvements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {state === UploadState.SUCCESS && `${files.length} archivos procesados exitosamente`}
        {state === UploadState.ERROR && 'Error en el procesamiento de archivos'}
        {state === UploadState.UPLOADING && 'Subiendo archivos'}
        {state === UploadState.PROCESSING && 'Procesando documentos'}
      </div>
      </ClipboardZone>
    </div>
  );
};

export default FileDropZone;