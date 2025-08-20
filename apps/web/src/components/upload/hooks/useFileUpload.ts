import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  UseFileUploadOptions, 
  UseFileUploadReturn,
  UploadedFile,
  UploadState,
  FileStatus,
  FileMetadata,
  UploadProgress,
  ValidationResult,
  ProcessingResult,
  ValidationErrorCodes,
  ClipboardItem,
  FileSource
} from '../types';
import { FileValidator } from '../utils/FileValidator';
import { ClipboardHandler } from '../utils/ClipboardHandler';
import { DocumentProcessor, DocumentType, TramiteType } from '@notarial-forms/document-processor';

export const useFileUpload = (options: UseFileUploadOptions): UseFileUploadReturn => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<UploadState>(UploadState.IDLE);
  
  const fileValidatorRef = useRef(new FileValidator(options.config));
  const documentProcessorRef = useRef(new DocumentProcessor());
  const clipboardHandlerRef = useRef(new ClipboardHandler());
  const uploadControllerRef = useRef<Map<string, AbortController>>(new Map());

  // Update validator when config changes
  useEffect(() => {
    fileValidatorRef.current = new FileValidator(options.config);
  }, [options.config]);

  // Computed states
  const isUploading = state === UploadState.UPLOADING;
  const isProcessing = state === UploadState.PROCESSING;

  // Generate unique file ID
  const generateFileId = useCallback((): string => {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Create file metadata
  const createFileMetadata = useCallback((file: File, source: FileSource = FileSource.FILE_PICKER, clipboardData?: any): FileMetadata => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';

    return {
      id: generateFileId(),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      extension,
      isImage,
      isPDF,
      source,
      clipboardData
    };
  }, [generateFileId]);

  // Create initial uploaded file object
  const createUploadedFile = useCallback((file: File, source: FileSource = FileSource.FILE_PICKER, clipboardData?: any): UploadedFile => {
    const metadata = createFileMetadata(file, source, clipboardData);
    
    return {
      id: metadata.id,
      file,
      metadata,
      status: FileStatus.PENDING,
      progress: {
        fileId: metadata.id,
        loaded: 0,
        total: file.size,
        percentage: 0,
        speed: 0,
        timeRemaining: 0,
        stage: 'upload'
      },
      validation: { isValid: true, errors: [], warnings: [] },
      createdAt: new Date()
    };
  }, [createFileMetadata]);

  // Validate single file
  const validateFile = useCallback((file: File): ValidationResult => {
    const existingFiles = files.map(f => f.file);
    return fileValidatorRef.current.validateFile(file, existingFiles);
  }, [files]);

  // Update file in state
  const updateFile = useCallback((fileId: string, updates: Partial<UploadedFile>) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId ? { ...file, ...updates } : file
      )
    );
  }, []);

  // Update file progress
  const updateProgress = useCallback((fileId: string, progress: Partial<UploadProgress>) => {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === fileId
          ? {
              ...file,
              progress: { ...file.progress, ...progress }
            }
          : file
      )
    );

    // Call progress callback
    const file = files.find(f => f.id === fileId);
    if (file && options.onUploadProgress) {
      options.onUploadProgress({ ...file.progress, ...progress });
    }
  }, [files, options]);

  // Simulate upload progress (replace with actual upload logic)
  const simulateUpload = useCallback(async (fileId: string): Promise<void> => {
    const controller = new AbortController();
    uploadControllerRef.current.set(fileId, controller);

    try {
      updateFile(fileId, { status: FileStatus.UPLOADING });

      let progress = 0;
      const startTime = Date.now();
      const file = files.find(f => f.id === fileId);
      
      if (!file) throw new Error('File not found');

      while (progress < 100 && !controller.signal.aborted) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        progress += Math.random() * 10;
        progress = Math.min(progress, 100);
        
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = (file.file.size * (progress / 100)) / elapsed;
        const timeRemaining = elapsed > 0 ? ((100 - progress) / progress) * elapsed : 0;

        updateProgress(fileId, {
          loaded: Math.round(file.file.size * (progress / 100)),
          percentage: progress,
          speed,
          timeRemaining,
          stage: 'upload'
        });
      }

      if (!controller.signal.aborted) {
        updateFile(fileId, { 
          status: FileStatus.PROCESSING,
          uploadUrl: `https://example.com/files/${fileId}` // Mock URL
        });
        updateProgress(fileId, { stage: 'process' });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        updateFile(fileId, { 
          status: FileStatus.ERROR, 
          error: error instanceof Error ? error.message : 'Upload failed'
        });
        options.onError?.(error instanceof Error ? error.message : 'Upload failed', fileId);
      }
    } finally {
      uploadControllerRef.current.delete(fileId);
    }
  }, [files, updateFile, updateProgress, options]);

  // Process file with document-processor
  const processFile = useCallback(async (fileId: string): Promise<void> => {
    const file = files.find(f => f.id === fileId);
    if (!file) {
      options.onError?.('File not found', fileId);
      return;
    }

    try {
      updateFile(fileId, { status: FileStatus.PROCESSING });
      updateProgress(fileId, { stage: 'process', percentage: 0 });

      // Create temporary file URL for processing
      const fileUrl = URL.createObjectURL(file.file);
      
      try {
        // Process with document processor
        const result = await documentProcessorRef.current.processDocument(fileUrl);
        
        const processingResult: ProcessingResult = {
          fileId,
          documentType: result.documentType,
          tramiteType: result.tramiteType,
          confidence: result.confidence,
          fieldsCount: result.fields.length,
          processingTime: result.processingTime,
          success: result.success,
          error: result.error
        };

        if (result.success) {
          updateFile(fileId, {
            status: FileStatus.COMPLETED,
            processing: processingResult,
            completedAt: new Date()
          });
          updateProgress(fileId, { percentage: 100, stage: 'complete' });
          
          options.onProcessingComplete?.(processingResult);
          options.onUploadComplete?.(file);
        } else {
          updateFile(fileId, {
            status: FileStatus.ERROR,
            error: result.error || 'Processing failed'
          });
          options.onError?.(result.error || 'Processing failed', fileId);
        }
      } finally {
        URL.revokeObjectURL(fileUrl);
      }
    } catch (error) {
      updateFile(fileId, {
        status: FileStatus.ERROR,
        error: error instanceof Error ? error.message : 'Processing failed'
      });
      options.onError?.(error instanceof Error ? error.message : 'Processing failed', fileId);
    }
  }, [files, updateFile, updateProgress, options]);

  // Upload and process file
  const uploadFile = useCallback(async (fileId: string): Promise<void> => {
    await simulateUpload(fileId);
    
    // Only process if upload was successful
    const file = files.find(f => f.id === fileId);
    if (file?.status === FileStatus.PROCESSING) {
      await processFile(fileId);
    }
  }, [simulateUpload, processFile, files]);

  // Add clipboard items
  const addClipboardItems = useCallback(async (items: ClipboardItem[]): Promise<void> => {
    if (items.length === 0) return;

    try {
      // Convert clipboard items to files
      const newFiles: File[] = [];
      const clipboardDataMap = new Map<string, any>();

      for (const item of items) {
        const file = await clipboardHandlerRef.current.clipboardItemToFile(item);
        newFiles.push(file);
        clipboardDataMap.set(file.name, {
          originalFormat: item.type,
          convertedFormat: file.type,
          timestamp: item.timestamp
        });
      }

      // Validate files
      const validation = fileValidatorRef.current.validateMultipleFiles(
        newFiles,
        files.map(f => f.file)
      );

      if (!validation.isValid) {
        validation.errors.forEach(error => {
          options.onError?.(error, undefined);
        });
        return;
      }

      // Create uploaded file objects with clipboard source
      const uploadedFiles = newFiles.map(file => {
        const clipboardData = clipboardDataMap.get(file.name);
        const uploadedFile = createUploadedFile(file, FileSource.CLIPBOARD_PASTE, clipboardData);
        const fileValidation = validateFile(file);
        return {
          ...uploadedFile,
          validation: fileValidation,
          status: fileValidation.isValid ? FileStatus.PENDING : FileStatus.ERROR,
          preview: items.find(item => item.fileName === file.name)?.preview
        };
      });

      // Add files to state
      setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
      
      // Notify callbacks
      options.onFileSelect?.(uploadedFiles);
      options.onClipboardPaste?.(items);

      // Auto-upload if enabled
      if (options.config.autoProcess) {
        setState(UploadState.UPLOADING);
        
        try {
          for (const uploadedFile of uploadedFiles) {
            if (uploadedFile.validation.isValid) {
              await uploadFile(uploadedFile.id);
            }
          }
          
          setState(UploadState.SUCCESS);
          options.onSuccess?.(files.filter(f => f.status === FileStatus.COMPLETED));
        } catch (error) {
          setState(UploadState.ERROR);
          options.onError?.(error instanceof Error ? error.message : 'Upload failed');
        }
      } else {
        setState(UploadState.IDLE);
      }
    } catch (error) {
      options.onError?.(error instanceof Error ? error.message : 'Failed to process clipboard items');
    }
  }, [files, validateFile, createUploadedFile, uploadFile, options]);

  // Add files to upload queue
  const addFiles = useCallback(async (newFiles: File[], source: FileSource = FileSource.DRAG_DROP): Promise<void> => {
    if (newFiles.length === 0) return;

    // Validate multiple files
    const validation = fileValidatorRef.current.validateMultipleFiles(
      newFiles,
      files.map(f => f.file)
    );

    if (!validation.isValid) {
      validation.errors.forEach(error => {
        options.onError?.(error, undefined);
      });
      return;
    }

    // Create uploaded file objects
    const uploadedFiles = newFiles.map(file => {
      const uploadedFile = createUploadedFile(file, source);
      const fileValidation = validateFile(file);
      return {
        ...uploadedFile,
        validation: fileValidation,
        status: fileValidation.isValid ? FileStatus.PENDING : FileStatus.ERROR
      };
    });

    // Add files to state
    setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
    
    // Notify callback
    options.onFileSelect?.(uploadedFiles);

    // Auto-upload if enabled
    if (options.config.autoProcess) {
      setState(UploadState.UPLOADING);
      
      try {
        // Upload files sequentially to avoid overwhelming the system
        for (const uploadedFile of uploadedFiles) {
          if (uploadedFile.validation.isValid) {
            await uploadFile(uploadedFile.id);
          }
        }
        
        setState(UploadState.SUCCESS);
        options.onSuccess?.(files.filter(f => f.status === FileStatus.COMPLETED));
      } catch (error) {
        setState(UploadState.ERROR);
        options.onError?.(error instanceof Error ? error.message : 'Upload failed');
      }
    } else {
      setState(UploadState.IDLE);
    }
  }, [files, validateFile, createUploadedFile, uploadFile, options]);

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    // Cancel upload if in progress
    const controller = uploadControllerRef.current.get(fileId);
    if (controller) {
      controller.abort();
      uploadControllerRef.current.delete(fileId);
    }

    // Remove from state
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));

    // Update state if no files left
    setFiles(prevFiles => {
      if (prevFiles.length === 0) {
        setState(UploadState.IDLE);
      }
      return prevFiles;
    });
  }, []);

  // Retry file upload
  const retryFile = useCallback(async (fileId: string): Promise<void> => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    // Reset file state
    updateFile(fileId, {
      status: FileStatus.PENDING,
      error: undefined,
      processing: undefined,
      progress: {
        ...file.progress,
        loaded: 0,
        percentage: 0,
        speed: 0,
        timeRemaining: 0,
        stage: 'upload'
      }
    });

    // Retry upload
    await uploadFile(fileId);
  }, [files, updateFile, uploadFile]);

  // Clear all files
  const clearFiles = useCallback(() => {
    // Cancel all ongoing uploads
    uploadControllerRef.current.forEach(controller => controller.abort());
    uploadControllerRef.current.clear();

    setFiles([]);
    setState(UploadState.IDLE);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      uploadControllerRef.current.forEach(controller => controller.abort());
      uploadControllerRef.current.clear();
    };
  }, []);

  return {
    files,
    state,
    isUploading,
    isProcessing,
    addFiles,
    addClipboardItems,
    removeFile,
    retryFile,
    clearFiles,
    uploadFile,
    processFile,
    validateFile,
    setState
  };
};