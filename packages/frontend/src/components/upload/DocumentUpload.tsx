import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentUploadProps, UploadConfigSchema, UploadState, FileStatus, ClipboardItem, FileSource } from './types';
import { useFileUpload } from './hooks/useFileUpload';
import FileDropZone from './components/FileDropZone';
import FilePreview from './components/FilePreview';
import UploadProgress from './components/UploadProgress';

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  config: userConfig = {},
  onFileSelect,
  onClipboardPaste,
  onUploadProgress,
  onUploadComplete,
  onProcessingComplete,
  onError,
  onSuccess,
  disabled = false,
  className = '',
  children
}) => {
  // Merge user config with defaults
  const config = useMemo(() => {
    const defaultConfig = UploadConfigSchema.parse({});
    return UploadConfigSchema.parse({ ...defaultConfig, ...userConfig });
  }, [userConfig]);

  // Use file upload hook
  const {
    files,
    state,
    isUploading,
    isProcessing,
    addFiles,
    addClipboardItems,
    removeFile,
    retryFile,
    clearFiles,
    setState
  } = useFileUpload({
    config,
    onFileSelect,
    onClipboardPaste,
    onUploadProgress,
    onUploadComplete,
    onProcessingComplete,
    onError,
    onSuccess
  });

  // Handle files added from drop zone
  const handleFilesAdded = useCallback((newFiles: File[]) => {
    addFiles(newFiles, FileSource.DRAG_DROP);
  }, [addFiles]);

  // Handle clipboard paste
  const handleClipboardPaste = useCallback((items: ClipboardItem[]) => {
    addClipboardItems(items);
  }, [addClipboardItems]);

  // Handle file removal
  const handleFileRemove = useCallback((fileId: string) => {
    removeFile(fileId);
  }, [removeFile]);

  // Handle file retry
  const handleFileRetry = useCallback((fileId: string) => {
    retryFile(fileId);
  }, [retryFile]);

  // Handle state changes from drop zone
  const handleStateChange = useCallback((newState: UploadState) => {
    setState(newState);
  }, [setState]);

  // Get summary statistics
  const stats = useMemo(() => {
    const total = files.length;
    const completed = files.filter(f => f.status === FileStatus.COMPLETED).length;
    const errors = files.filter(f => f.status === FileStatus.ERROR).length;
    const processing = files.filter(f => 
      f.status === FileStatus.UPLOADING || f.status === FileStatus.PROCESSING
    ).length;
    
    return { total, completed, errors, processing };
  }, [files]);

  // Get overall progress percentage
  const overallProgress = useMemo(() => {
    if (files.length === 0) return 0;
    
    const totalProgress = files.reduce((sum, file) => sum + file.progress.percentage, 0);
    return Math.round(totalProgress / files.length);
  }, [files]);

  // Check if we should show the summary
  const showSummary = files.length > 0;

  // Check if we can add more files
  const canAddMore = files.length < config.maxFiles && !disabled;

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Drop Zone */}
      <FileDropZone
        config={config}
        state={state}
        files={files}
        onFilesAdded={handleFilesAdded}
        onClipboardPaste={handleClipboardPaste}
        onFilesRemoved={(fileIds) => fileIds.forEach(handleFileRemove)}
        onStateChange={handleStateChange}
        disabled={disabled || !canAddMore}
      >
        {children}
      </FileDropZone>

      {/* Upload Summary */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Archivos ({stats.total})
              </h3>
              
              <div className="flex items-center space-x-4">
                {/* Overall Progress */}
                {(isUploading || isProcessing) && (
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 font-mono">
                      {overallProgress}%
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center space-x-2">
                  {files.some(f => f.status === FileStatus.ERROR) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        files
                          .filter(f => f.status === FileStatus.ERROR)
                          .forEach(f => retryFile(f.id));
                      }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reintentar errores
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFiles}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Limpiar todo
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-500">Completados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.processing}</div>
                <div className="text-sm text-gray-500">Procesando</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                <div className="text-sm text-gray-500">Errores</div>
              </div>
            </div>

            {/* Files List */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Show progress for active uploads */}
                    {(file.status === FileStatus.UPLOADING || file.status === FileStatus.PROCESSING) ? (
                      <UploadProgress
                        file={file}
                        showDetails={true}
                        animated={true}
                        className="bg-white border border-gray-200 rounded-lg p-3"
                      />
                    ) : (
                      <FilePreview
                        file={file}
                        onRemove={handleFileRemove}
                        onRetry={handleFileRetry}
                        showDetails={true}
                        compact={false}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add more files button */}
            {canAddMore && files.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = config.allowMultiple;
                    input.accept = config.acceptedTypes.join(',');
                    input.onchange = (e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.files) {
                        addFiles(Array.from(target.files), FileSource.FILE_PICKER);
                      }
                    };
                    input.click();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar más archivos ({config.maxFiles - files.length} restantes)
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Status Messages */}
      <AnimatePresence>
        {state === UploadState.SUCCESS && stats.completed > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-green-800">
                  ¡Procesamiento completado!
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  {stats.completed} de {stats.total} archivos procesados exitosamente.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {state === UploadState.ERROR && stats.errors > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Errores en el procesamiento
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  {stats.errors} archivo(s) tuvieron errores. Revisa los detalles y reintenta.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {state === UploadState.UPLOADING && `Subiendo ${stats.processing} archivos`}
        {state === UploadState.PROCESSING && `Procesando ${stats.processing} documentos`}
        {state === UploadState.SUCCESS && `${stats.completed} archivos procesados exitosamente`}
        {state === UploadState.ERROR && `${stats.errors} archivos con errores`}
      </div>
    </div>
  );
};

export default DocumentUpload;