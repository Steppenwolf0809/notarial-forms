import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardHandlerProps, ClipboardItem } from '../types';
import { ClipboardHandler } from '../utils/ClipboardHandler';

const ClipboardZone: React.FC<ClipboardHandlerProps> = ({
  config,
  onPaste,
  onError,
  enabled = true,
  children
}) => {
  const clipboardHandlerRef = useRef<ClipboardHandler | null>(null);
  const [showPasteHint, setShowPasteHint] = useState(false);
  const [recentPaste, setRecentPaste] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize clipboard handler
  useEffect(() => {
    const handler = new ClipboardHandler({
      enabled: enabled && config.allowClipboard,
      imageFormat: config.clipboardImageFormat,
      quality: config.compressionQuality,
      maxSize: config.maxSize,
      generatePreview: config.generateThumbnails,
      autoDetectType: true
    });

    clipboardHandlerRef.current = handler;
    setIsSupported(ClipboardHandler.isSupported());

    return () => {
      handler.stopListening();
    };
  }, [config, enabled]);

  // Handle paste events
  const handlePaste = useCallback(async (items: ClipboardItem[]) => {
    setRecentPaste(`${items.length} imagen(es) pegada(s) desde el portapapeles`);
    
    // Show confirmation briefly
    setTimeout(() => setRecentPaste(null), 3000);
    
    onPaste(items);
  }, [onPaste]);

  // Handle paste errors
  const handlePasteError = useCallback((error: string) => {
    setRecentPaste(`Error: ${error}`);
    setTimeout(() => setRecentPaste(null), 5000);
    onError(error);
  }, [onError]);

  // Start/stop listening based on enabled state
  useEffect(() => {
    const handler = clipboardHandlerRef.current;
    if (!handler || !isSupported) return;

    if (enabled && config.allowClipboard) {
      handler.startListening(handlePaste, handlePasteError);
    } else {
      handler.stopListening();
    }

    return () => {
      handler.stopListening();
    };
  }, [enabled, config.allowClipboard, isSupported, handlePaste, handlePasteError]);

  // Show paste hint on focus
  const handleFocus = useCallback(() => {
    if (enabled && config.allowClipboard && isSupported) {
      setShowPasteHint(true);
    }
  }, [enabled, config.allowClipboard, isSupported]);

  const handleBlur = useCallback(() => {
    setShowPasteHint(false);
  }, []);

  // Handle manual paste button click
  const handleManualPaste = useCallback(async () => {
    const handler = clipboardHandlerRef.current;
    if (!handler) return;

    try {
      const items = await handler.readClipboard();
      handlePaste(items);
    } catch (error) {
      handlePasteError(error instanceof Error ? error.message : 'Error al leer el portapapeles');
    }
  }, [handlePaste, handlePasteError]);

  // Get paste instructions
  const instructions = ClipboardHandler.getInstructions();

  if (!isSupported || !enabled || !config.allowClipboard) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative w-full"
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      {children}

      {/* Paste hint overlay */}
      <AnimatePresence>
        {showPasteHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg z-10"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{instructions.shortcut} para pegar</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent paste notification */}
      <AnimatePresence>
        {recentPaste && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`px-4 py-3 rounded-lg shadow-lg max-w-sm ${
              recentPaste.startsWith('Error') 
                ? 'bg-red-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              <div className="flex items-center space-x-2">
                {recentPaste.startsWith('Error') ? (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                <span className="text-sm font-medium">{recentPaste}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual paste button (for mobile or when shortcuts don't work) */}
      <div className="absolute bottom-4 left-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleManualPaste}
          className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          title="Pegar desde portapapeles"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Pegar
        </motion.button>
      </div>

      {/* Clipboard instructions (only show when relevant) */}
      {showPasteHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-16 left-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs max-w-xs"
        >
          <p>{instructions.longDescription}</p>
          <div className="absolute bottom-0 left-6 transform translate-y-full">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ClipboardZone;