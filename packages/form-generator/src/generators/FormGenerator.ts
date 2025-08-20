import { DocumentType } from '@notarial-forms/shared-types';
import { 
  NotarialFormTemplate, 
  FormGeneratorConfig, 
  ExtractedField, 
  FormData,
  FormFieldConfig,
  FormState,
  FormHistoryEntry
} from '../types';
import { TemplateEngine } from '../engines/TemplateEngine';
import { ValidationEngine } from '../engines/ValidationEngine';
import { FieldGenerator } from './FieldGenerator';

export class FormGenerator {
  private config: FormGeneratorConfig;
  private template: NotarialFormTemplate;
  private fieldGenerator: FieldGenerator;
  private state: FormState;
  
  constructor(config: FormGeneratorConfig) {
    this.config = {
      autoSave: true,
      autoSaveInterval: 30000, // 30 segundos
      showProgress: true,
      showConfidence: true,
      allowUndo: true,
      responsive: true,
      locale: 'es',
      ...config
    };
    
    this.template = this.getTemplateForDocument();
    this.fieldGenerator = new FieldGenerator({
      extractedData: this.config.extractedData,
      ecuadorianValidation: true,
      showConfidence: this.config.showConfidence,
      responsive: this.config.responsive
    });
    
    this.state = this.initializeState();
  }

  // Obtener template según tipo de documento
  private getTemplateForDocument(): NotarialFormTemplate {
    if (this.config.template) {
      // Obtener template específico por nombre
      return this.getTemplateByName(this.config.template);
    }
    
    return TemplateEngine.getTemplate(this.config.documentType);
  }

  private getTemplateByName(templateName: string): NotarialFormTemplate {
    switch (templateName.toUpperCase()) {
      case 'COMPRAVENTA':
        return TemplateEngine.getCompraventaTemplate();
      case 'VEHICULO':
        return TemplateEngine.getVehiculoTemplate();
      case 'SOCIETARIO':
        return TemplateEngine.getSocietarioTemplate();
      default:
        return TemplateEngine.getTemplate(this.config.documentType);
    }
  }

  // Inicializar estado del formulario
  private initializeState(): FormState {
    const initialData = this.generateInitialData();
    
    return {
      data: initialData,
      isDirty: false,
      isValid: false,
      errors: {},
      progress: this.calculateProgress(initialData),
      confidence: this.calculateConfidence(initialData),
      history: [{
        data: initialData,
        timestamp: new Date(),
        action: 'LOAD'
      }],
      historyIndex: 0
    };
  }

  // Generar datos iniciales pre-llenados
  private generateInitialData(): Partial<FormData> {
    const data: Partial<FormData> = {};
    
    if (this.config.extractedData) {
      // Pre-llenar con datos extraídos
      this.populateFromExtractedData(data);
    }
    
    // Aplicar valores por defecto según tipo de documento
    this.applyDefaultValues(data);
    
    return data;
  }

  // Popular con datos extraídos del OCR
  private populateFromExtractedData(data: Partial<FormData>): void {
    if (!this.config.extractedData) return;
    
    this.config.extractedData.forEach(field => {
      const mappedPath = this.mapExtractedField(field);
      if (mappedPath) {
        this.setNestedValue(data, mappedPath, field.value);
      }
    });
  }

  // Mapear campos extraídos a paths del formulario
  private mapExtractedField(field: ExtractedField): string | null {
    const mappings: Record<string, string> = {
      // Personas
      'comprador_nombres': 'personas.0.nombres',
      'comprador_apellidos': 'personas.0.apellidos',
      'comprador_cedula': 'personas.0.cedula',
      'vendedor_nombres': 'personas.1.nombres',
      'vendedor_apellidos': 'personas.1.apellidos',
      'vendedor_cedula': 'personas.1.cedula',
      
      // Vehículos
      'vehiculo_marca': 'vehiculo.marca',
      'vehiculo_modelo': 'vehiculo.modelo',
      'vehiculo_placa': 'vehiculo.placa',
      'vehiculo_anio': 'vehiculo.anio',
      'vehiculo_chasis': 'vehiculo.chasis',
      'vehiculo_motor': 'vehiculo.motor',
      
      // Article 29
      'valor_operacion': 'article29.valorOperacion',
      'forma_pago': 'article29.formaPago',
      'fecha_operacion': 'article29.fechaOperacion',
      
      // Detalles
      'fecha_escritura': 'fechaEscritura',
      'notario': 'notario',
      'numero_escritura': 'numeroEscritura'
    };
    
    const normalizedFieldName = field.fieldName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return mappings[normalizedFieldName] || null;
  }

  // Aplicar valores por defecto
  private applyDefaultValues(data: Partial<FormData>): void {
    // Valores por defecto según tipo de documento
    switch (this.config.documentType) {
      case 'PDF_EXTRACTO':
        this.setDefaultValue(data, 'personas.0.rol', 'COMPRADOR');
        this.setDefaultValue(data, 'personas.1.rol', 'VENDEDOR');
        this.setDefaultValue(data, 'personas.0.nacionalidad', 'Ecuatoriana');
        this.setDefaultValue(data, 'personas.1.nacionalidad', 'Ecuatoriana');
        this.setDefaultValue(data, 'article29.moneda', 'USD');
        this.setDefaultValue(data, 'article29.esOperacionCompleta', true);
        break;
        
      case 'SCREENSHOT_VEHICULO':
        this.setDefaultValue(data, 'personas.0.rol', 'COMPRADOR');
        this.setDefaultValue(data, 'personas.1.rol', 'VENDEDOR');
        this.setDefaultValue(data, 'article29.moneda', 'USD');
        break;
        
      case 'PDF_SOCIETARIO':
        this.setDefaultValue(data, 'personas.0.rol', 'CONSTITUYENTE');
        this.setDefaultValue(data, 'article29.moneda', 'USD');
        break;
    }
    
    // Fecha actual para campos de fecha
    const today = new Date().toLocaleDateString('es-EC');
    this.setDefaultValue(data, 'fechaEscritura', today);
    this.setDefaultValue(data, 'article29.fechaOperacion', today);
  }

  // Establecer valor por defecto si no existe
  private setDefaultValue(data: any, path: string, value: any): void {
    if (!this.getNestedValue(data, path)) {
      this.setNestedValue(data, path, value);
    }
  }

  // Generar formulario completo
  generateForm(): {
    template: NotarialFormTemplate;
    initialData: Partial<FormData>;
    config: FormGeneratorConfig;
    validationSchema: any;
  } {
    return {
      template: this.template,
      initialData: this.state.data,
      config: this.config,
      validationSchema: this.template.validationSchema
    };
  }

  // Actualizar datos del formulario
  updateFormData(path: string, value: any): FormState {
    const newData = { ...this.state.data };
    this.setNestedValue(newData, path, value);
    
    // Validación en tiempo real
    const validation = ValidationEngine.validateForm(newData, this.template.validationSchema);
    
    // Actualizar estado
    this.state = {
      ...this.state,
      data: newData,
      isDirty: true,
      isValid: validation.isValid,
      errors: validation.errors,
      progress: this.calculateProgress(newData),
      confidence: this.calculateConfidence(newData)
    };
    
    // Agregar a historial
    this.addToHistory({
      data: newData,
      timestamp: new Date(),
      action: 'CHANGE',
      field: path
    });
    
    return this.state;
  }

  // Calcular progreso del formulario
  private calculateProgress(data: Partial<FormData>): number {
    const requiredFields = this.template.requiredFields || [];
    if (requiredFields.length === 0) return 0;
    
    const completedFields = requiredFields.filter(field => {
      const value = this.getNestedValue(data, field);
      return value !== undefined && value !== null && value !== '';
    });
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  }

  // Calcular confianza promedio de campos extraídos
  private calculateConfidence(data: Partial<FormData>): Record<string, number> {
    const confidence: Record<string, number> = {};
    
    if (!this.config.extractedData) return confidence;
    
    this.config.extractedData.forEach(field => {
      const mappedPath = this.mapExtractedField(field);
      if (mappedPath) {
        confidence[mappedPath] = field.confidence;
      }
    });
    
    return confidence;
  }

  // Validar campo específico
  validateField(path: string, value: any): { isValid: boolean; error?: string } {
    // Buscar configuración del campo
    const fieldConfig = this.findFieldConfig(path);
    if (!fieldConfig?.validation) {
      return { isValid: true };
    }
    
    return ValidationEngine.validateField(path, value, fieldConfig.validation);
  }

  // Buscar configuración de campo
  private findFieldConfig(path: string): FormFieldConfig | null {
    for (const section of this.template.sections) {
      const field = section.fields.find(f => f.name === path);
      if (field) return field;
    }
    return null;
  }

  // Generar campos dinámicamente
  generateDynamicFields(sectionId: string): FormFieldConfig[] {
    switch (sectionId) {
      case 'personas':
        return [
          ...this.fieldGenerator.generatePersonField('COMPRADOR', 0),
          ...this.fieldGenerator.generatePersonField('VENDEDOR', 1)
        ];
        
      case 'vehiculo':
        return this.fieldGenerator.generateVehiculoFields();
        
      case 'article29':
        return this.fieldGenerator.generateArticle29Fields();
        
      default:
        return [];
    }
  }

  // Auto-save
  enableAutoSave(callback: (data: Partial<FormData>) => void): void {
    if (!this.config.autoSave) return;
    
    setInterval(() => {
      if (this.state.isDirty) {
        callback(this.state.data);
        this.state.lastSaved = new Date();
        this.state.isDirty = false;
      }
    }, this.config.autoSaveInterval);
  }

  // Undo/Redo
  undo(): FormState | null {
    if (this.state.historyIndex > 0) {
      this.state.historyIndex--;
      const historyEntry = this.state.history[this.state.historyIndex];
      
      this.state = {
        ...this.state,
        data: historyEntry.data,
        isDirty: true
      };
      
      return this.state;
    }
    return null;
  }

  redo(): FormState | null {
    if (this.state.historyIndex < this.state.history.length - 1) {
      this.state.historyIndex++;
      const historyEntry = this.state.history[this.state.historyIndex];
      
      this.state = {
        ...this.state,
        data: historyEntry.data,
        isDirty: true
      };
      
      return this.state;
    }
    return null;
  }

  // Agregar entrada al historial
  private addToHistory(entry: FormHistoryEntry): void {
    // Limitar historial a últimas 50 entradas
    if (this.state.history.length >= 50) {
      this.state.history = this.state.history.slice(-49);
      this.state.historyIndex = this.state.history.length;
    }
    
    // Remover entradas futuras si estamos en medio del historial
    if (this.state.historyIndex < this.state.history.length - 1) {
      this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
    }
    
    this.state.history.push(entry);
    this.state.historyIndex = this.state.history.length - 1;
  }

  // Exportar formulario
  exportForm(): {
    template: string;
    data: Partial<FormData>;
    metadata: {
      documentType: DocumentType;
      progress: number;
      confidence: Record<string, number>;
      exportDate: string;
      version: string;
    };
  } {
    return {
      template: this.template.id,
      data: this.state.data,
      metadata: {
        documentType: this.config.documentType,
        progress: this.state.progress,
        confidence: this.state.confidence,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }
    };
  }

  // Importar formulario
  importForm(exportedForm: any): void {
    if (exportedForm.template !== this.template.id) {
      throw new Error(`Template mismatch: expected ${this.template.id}, got ${exportedForm.template}`);
    }
    
    this.state = {
      ...this.state,
      data: exportedForm.data,
      isDirty: true,
      progress: this.calculateProgress(exportedForm.data),
      confidence: exportedForm.metadata?.confidence || {}
    };
    
    this.addToHistory({
      data: exportedForm.data,
      timestamp: new Date(),
      action: 'LOAD'
    });
  }

  // Obtener estado actual
  getState(): FormState {
    return { ...this.state };
  }

  // Reiniciar formulario
  reset(): void {
    this.state = this.initializeState();
  }

  // Utilidades para manejo de objetos anidados
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    
    const target = keys.reduce((current, key) => {
      if (!(key in current)) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    
    target[lastKey] = value;
  }

  // Validación completa del formulario
  validateComplete(): { isValid: boolean; errors: Record<string, string>; warnings: Record<string, string> } {
    return ValidationEngine.validateForm(this.state.data, this.template.validationSchema);
  }

  // Obtener campos con baja confianza
  getLowConfidenceFields(threshold: number = 0.8): Array<{ path: string; confidence: number; value: any }> {
    const lowConfidenceFields: Array<{ path: string; confidence: number; value: any }> = [];
    
    Object.entries(this.state.confidence).forEach(([path, confidence]) => {
      if (confidence < threshold) {
        lowConfidenceFields.push({
          path,
          confidence,
          value: this.getNestedValue(this.state.data, path)
        });
      }
    });
    
    return lowConfidenceFields;
  }

  // Obtener resumen del formulario
  getFormSummary(): {
    progress: number;
    totalFields: number;
    completedFields: number;
    requiredFields: number;
    completedRequiredFields: number;
    averageConfidence: number;
    lowConfidenceCount: number;
    isValid: boolean;
    errorCount: number;
  } {
    const requiredFields = this.template.requiredFields || [];
    const allFields = this.getAllFieldPaths();
    
    const completedFields = allFields.filter(path => {
      const value = this.getNestedValue(this.state.data, path);
      return value !== undefined && value !== null && value !== '';
    });
    
    const completedRequiredFields = requiredFields.filter(path => {
      const value = this.getNestedValue(this.state.data, path);
      return value !== undefined && value !== null && value !== '';
    });
    
    const confidenceValues = Object.values(this.state.confidence);
    const averageConfidence = confidenceValues.length > 0 
      ? confidenceValues.reduce((sum, conf) => sum + conf, 0) / confidenceValues.length 
      : 1;
    
    const lowConfidenceCount = this.getLowConfidenceFields().length;
    
    return {
      progress: this.state.progress,
      totalFields: allFields.length,
      completedFields: completedFields.length,
      requiredFields: requiredFields.length,
      completedRequiredFields: completedRequiredFields.length,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      lowConfidenceCount,
      isValid: this.state.isValid,
      errorCount: Object.keys(this.state.errors).length
    };
  }

  // Obtener todos los paths de campos
  private getAllFieldPaths(): string[] {
    const paths: string[] = [];
    
    this.template.sections.forEach(section => {
      section.fields.forEach(field => {
        paths.push(field.name as string);
      });
    });
    
    return paths;
  }
}