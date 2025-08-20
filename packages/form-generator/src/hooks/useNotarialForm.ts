import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  FormGenerator, 
  FormGeneratorConfig, 
  FormState, 
  FormData,
  ExtractedField,
  AutoSaveConfig 
} from '../';

export interface UseNotarialFormConfig extends FormGeneratorConfig {
  onAutoSave?: (data: Partial<FormData>) => void | Promise<void>;
  onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void;
  onProgressChange?: (progress: number) => void;
  onConfidenceChange?: (confidence: Record<string, number>) => void;
  autoSaveKey?: string;
  debounceMs?: number;
}

export interface UseNotarialFormReturn<T extends FieldValues = FormData> {
  // React Hook Form instance
  form: UseFormReturn<T>;
  
  // Form Generator instance
  generator: FormGenerator;
  
  // Form state
  state: FormState<T>;
  
  // Template and configuration
  template: any;
  config: FormGeneratorConfig;
  
  // Actions
  actions: {
    updateField: (path: string, value: any) => void;
    validateField: (path: string, value: any) => Promise<boolean>;
    reset: () => void;
    undo: () => boolean;
    redo: () => boolean;
    exportForm: () => any;
    importForm: (data: any) => void;
    saveToLocalStorage: () => void;
    loadFromLocalStorage: () => boolean;
  };
  
  // Status
  status: {
    isLoading: boolean;
    isSaving: boolean;
    lastSaved?: Date;
    hasChanges: boolean;
    canUndo: boolean;
    canRedo: boolean;
  };
  
  // Form summary
  summary: {
    progress: number;
    totalFields: number;
    completedFields: number;
    requiredFields: number;
    completedRequiredFields: number;
    averageConfidence: number;
    lowConfidenceCount: number;
    isValid: boolean;
    errorCount: number;
  };
}

export function useNotarialForm<T extends FieldValues = FormData>(
  config: UseNotarialFormConfig
): UseNotarialFormReturn<T> {
  
  // Initialize form generator
  const [generator] = useState(() => new FormGenerator(config));
  const [state, setState] = useState<FormState<T>>(() => generator.getState() as FormState<T>);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>();
  
  // Get template and form configuration
  const formConfig = generator.generateForm();
  
  // Initialize React Hook Form
  const form = useForm<T>({
    resolver: zodResolver(formConfig.validationSchema),
    defaultValues: formConfig.initialData as T,
    mode: 'onChange'
  });
  
  // Refs for callbacks and timers
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const onAutoSaveRef = useRef(config.onAutoSave);
  const onValidationChangeRef = useRef(config.onValidationChange);
  const onProgressChangeRef = useRef(config.onProgressChange);
  const onConfidenceChangeRef = useRef(config.onConfidenceChange);
  
  // Update refs when callbacks change
  useEffect(() => {
    onAutoSaveRef.current = config.onAutoSave;
    onValidationChangeRef.current = config.onValidationChange;
    onProgressChangeRef.current = config.onProgressChange;
    onConfidenceChangeRef.current = config.onConfidenceChange;
  }, [config]);

  // Watch for form changes
  const watchedValues = form.watch();
  
  // Handle field updates with debouncing
  const handleFieldUpdate = useCallback((path: string, value: any) => {
    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      const newState = generator.updateFormData(path, value);
      setState(newState as FormState<T>);
      
      // Trigger callbacks
      if (onValidationChangeRef.current) {
        onValidationChangeRef.current(newState.isValid, newState.errors);
      }
      
      if (onProgressChangeRef.current) {
        onProgressChangeRef.current(newState.progress);
      }
      
      if (onConfidenceChangeRef.current) {
        onConfidenceChangeRef.current(newState.confidence);
      }
      
      // Auto-save if enabled
      if (config.autoSave && onAutoSaveRef.current) {
        handleAutoSave(newState.data);
      }
    }, config.debounceMs || 300);
  }, [generator, config]);

  // Auto-save functionality
  const handleAutoSave = useCallback(async (data: Partial<FormData>) => {
    if (!onAutoSaveRef.current) return;
    
    setIsSaving(true);
    try {
      await onAutoSaveRef.current(data);
      setLastSaved(new Date());
      
      // Also save to localStorage if key provided
      if (config.autoSaveKey) {
        localStorage.setItem(config.autoSaveKey, JSON.stringify({
          data,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [config.autoSaveKey]);

  // Watch for form value changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && value[name] !== undefined) {
        handleFieldUpdate(name, value[name]);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, handleFieldUpdate]);

  // Initialize form
  useEffect(() => {
    const initializeForm = async () => {
      setIsLoading(true);
      
      try {
        // Try to load from localStorage first
        if (config.autoSaveKey) {
          const saved = localStorage.getItem(config.autoSaveKey);
          if (saved) {
            const { data, timestamp } = JSON.parse(saved);
            const savedDate = new Date(timestamp);
            const now = new Date();
            const hoursDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);
            
            // Only restore if saved within last 24 hours
            if (hoursDiff < 24) {
              form.reset(data);
              setLastSaved(savedDate);
            }
          }
        }
        
        // Setup auto-save interval
        if (config.autoSave) {
          generator.enableAutoSave((data) => handleAutoSave(data));
        }
        
      } catch (error) {
        console.error('Failed to initialize form:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeForm();
    
    // Cleanup
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Actions
  const actions = {
    updateField: useCallback((path: string, value: any) => {
      form.setValue(path as any, value, { shouldValidate: true });
      handleFieldUpdate(path, value);
    }, [form, handleFieldUpdate]),

    validateField: useCallback(async (path: string, value: any): Promise<boolean> => {
      const result = generator.validateField(path, value);
      
      if (!result.isValid && result.error) {
        form.setError(path as any, { 
          type: 'validation', 
          message: result.error 
        });
      } else {
        form.clearErrors(path as any);
      }
      
      return result.isValid;
    }, [generator, form]),

    reset: useCallback(() => {
      generator.reset();
      const newFormConfig = generator.generateForm();
      form.reset(newFormConfig.initialData as T);
      setState(generator.getState() as FormState<T>);
      
      // Clear localStorage
      if (config.autoSaveKey) {
        localStorage.removeItem(config.autoSaveKey);
      }
    }, [generator, form, config.autoSaveKey]),

    undo: useCallback((): boolean => {
      const previousState = generator.undo();
      if (previousState) {
        setState(previousState as FormState<T>);
        form.reset(previousState.data as T);
        return true;
      }
      return false;
    }, [generator, form]),

    redo: useCallback((): boolean => {
      const nextState = generator.redo();
      if (nextState) {
        setState(nextState as FormState<T>);
        form.reset(nextState.data as T);
        return true;
      }
      return false;
    }, [generator, form]),

    exportForm: useCallback(() => {
      return generator.exportForm();
    }, [generator]),

    importForm: useCallback((data: any) => {
      generator.importForm(data);
      const newState = generator.getState();
      setState(newState as FormState<T>);
      form.reset(newState.data as T);
    }, [generator, form]),

    saveToLocalStorage: useCallback(() => {
      if (config.autoSaveKey) {
        const exportedData = generator.exportForm();
        localStorage.setItem(config.autoSaveKey, JSON.stringify({
          ...exportedData,
          timestamp: new Date().toISOString()
        }));
        setLastSaved(new Date());
      }
    }, [generator, config.autoSaveKey]),

    loadFromLocalStorage: useCallback((): boolean => {
      if (!config.autoSaveKey) return false;
      
      try {
        const saved = localStorage.getItem(config.autoSaveKey);
        if (saved) {
          const data = JSON.parse(saved);
          generator.importForm(data);
          const newState = generator.getState();
          setState(newState as FormState<T>);
          form.reset(newState.data as T);
          setLastSaved(new Date(data.timestamp));
          return true;
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
      }
      
      return false;
    }, [generator, form, config.autoSaveKey])
  };

  // Status
  const status = {
    isLoading,
    isSaving,
    lastSaved,
    hasChanges: state.isDirty,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1
  };

  // Form summary
  const summary = generator.getFormSummary();

  return {
    form,
    generator,
    state,
    template: formConfig.template,
    config: formConfig.config,
    actions,
    status,
    summary
  };
}