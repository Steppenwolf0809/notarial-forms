import { DocumentType } from '@notarial-forms/shared-types';
import { NotarialFormTemplate, FormSection, FormFieldConfig } from '../types';
import { ValidationEngine } from './ValidationEngine';

export class TemplateEngine {
  
  private static readonly ECUADOR_PROVINCES = [
    'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro',
    'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos',
    'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha',
    'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe'
  ];

  private static readonly ESTADOS_CIVILES = [
    { value: 'SOLTERO', label: 'Soltero/a' },
    { value: 'CASADO', label: 'Casado/a' },
    { value: 'DIVORCIADO', label: 'Divorciado/a' },
    { value: 'VIUDO', label: 'Viudo/a' },
    { value: 'UNION_LIBRE', label: 'Unión Libre' }
  ];

  private static readonly FORMAS_PAGO = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
    { value: 'CHEQUE', label: 'Cheque' },
    { value: 'CREDITO', label: 'Crédito' },
    { value: 'MIXTO', label: 'Mixto' }
  ];

  private static readonly COMBUSTIBLES = [
    { value: 'GASOLINA', label: 'Gasolina' },
    { value: 'DIESEL', label: 'Diesel' },
    { value: 'GAS', label: 'Gas' },
    { value: 'ELECTRICO', label: 'Eléctrico' },
    { value: 'HIBRIDO', label: 'Híbrido' }
  ];

  // Template completo para compraventa (PDF_EXTRACTO)
  static getCompraventaTemplate(): NotarialFormTemplate {
    return {
      id: 'COMPRAVENTA',
      name: 'Formulario de Compraventa',
      documentType: 'PDF_EXTRACTO' as DocumentType,
      sections: [
        this.getPersonasSection(),
        this.getInmuebleSection(),
        this.getArticle29Section(),
        this.getDetallesSection()
      ],
      validationSchema: ValidationEngine.compraventaSchema,
      article29Fields: ['valorOperacion', 'formaPago', 'esOperacionCompleta', 'fechaOperacion'],
      requiredFields: [
        'personas.0.nombres', 'personas.0.apellidos', 'personas.0.cedula',
        'personas.1.nombres', 'personas.1.apellidos', 'personas.1.cedula',
        'article29.valorOperacion', 'article29.formaPago', 'fechaEscritura'
      ]
    };
  }

  // Template para vehículos (SCREENSHOT_VEHICULO)
  static getVehiculoTemplate(): NotarialFormTemplate {
    return {
      id: 'VEHICULO',
      name: 'Formulario de Vehículo',
      documentType: 'SCREENSHOT_VEHICULO' as DocumentType,
      sections: [
        this.getPersonasSection(),
        this.getVehiculoSection(),
        this.getArticle29Section()
      ],
      validationSchema: ValidationEngine.getSchemaForDocumentType('SCREENSHOT_VEHICULO'),
      article29Fields: ['valorOperacion', 'formaPago', 'esOperacionCompleta'],
      requiredFields: [
        'personas.0.nombres', 'personas.0.cedula',
        'personas.1.nombres', 'personas.1.cedula',
        'vehiculo.marca', 'vehiculo.modelo', 'vehiculo.placa',
        'article29.valorOperacion'
      ]
    };
  }

  // Template para societario (PDF_SOCIETARIO)
  static getSocietarioTemplate(): NotarialFormTemplate {
    return {
      id: 'SOCIETARIO',
      name: 'Formulario Societario Article 29',
      documentType: 'PDF_SOCIETARIO' as DocumentType,
      sections: [
        this.getPersonasSection(),
        this.getSociedadSection(),
        this.getArticle29Section()
      ],
      validationSchema: ValidationEngine.getSchemaForDocumentType('PDF_SOCIETARIO'),
      article29Fields: ['valorOperacion', 'formaPago', 'esOperacionCompleta'],
      requiredFields: [
        'personas.0.nombres', 'personas.0.cedula',
        'tipoSociedad', 'article29.valorOperacion'
      ]
    };
  }

  // Sección de personas (reutilizable)
  private static getPersonasSection(): FormSection {
    return {
      id: 'personas',
      title: 'Datos de las Personas',
      description: 'Información completa de compradores, vendedores y otros participantes',
      fields: [
        // Comprador
        {
          name: 'personas.0.rol',
          type: 'select',
          label: 'Rol',
          defaultValue: 'COMPRADOR',
          options: [
            { value: 'COMPRADOR', label: 'Comprador' },
            { value: 'VENDEDOR', label: 'Vendedor' },
            { value: 'CONSTITUYENTE', label: 'Constituyente' },
            { value: 'APODERADO', label: 'Apoderado' },
            { value: 'TESTIGO', label: 'Testigo' }
          ],
          required: true,
          grid: { colSpan: 2 }
        },
        {
          name: 'personas.0.nombres',
          type: 'text',
          label: 'Nombres',
          placeholder: 'Nombres completos',
          required: true,
          validation: ValidationEngine.generateDynamicValidation('text'),
          grid: { colSpan: 6 }
        },
        {
          name: 'personas.0.apellidos',
          type: 'text',
          label: 'Apellidos',
          placeholder: 'Apellidos completos',
          required: true,
          validation: ValidationEngine.generateDynamicValidation('text'),
          grid: { colSpan: 6 }
        },
        {
          name: 'personas.0.cedula',
          type: 'cedula',
          label: 'Cédula',
          placeholder: '1234567890',
          required: true,
          validation: ValidationEngine.cedulaSchema,
          metadata: { ecuadorianValidation: true },
          grid: { colSpan: 4 }
        },
        {
          name: 'personas.0.ruc',
          type: 'ruc',
          label: 'RUC (Opcional)',
          placeholder: '1234567890001',
          validation: ValidationEngine.rucSchema,
          metadata: { ecuadorianValidation: true },
          grid: { colSpan: 4 }
        },
        {
          name: 'personas.0.nacionalidad',
          type: 'text',
          label: 'Nacionalidad',
          placeholder: 'Ecuatoriana',
          defaultValue: 'Ecuatoriana',
          required: true,
          grid: { colSpan: 4 }
        },
        {
          name: 'personas.0.estadoCivil',
          type: 'select',
          label: 'Estado Civil',
          options: this.ESTADOS_CIVILES,
          required: true,
          grid: { colSpan: 3 }
        },
        {
          name: 'personas.0.profesion',
          type: 'text',
          label: 'Profesión',
          placeholder: 'Profesión u ocupación',
          required: true,
          grid: { colSpan: 4 }
        },
        
        // Domicilio Comprador
        {
          name: 'personas.0.domicilio.provincia',
          type: 'provincia',
          label: 'Provincia',
          options: this.ECUADOR_PROVINCES.map(p => ({ value: p, label: p })),
          required: true,
          grid: { colSpan: 4 }
        },
        {
          name: 'personas.0.domicilio.canton',
          type: 'canton',
          label: 'Cantón',
          required: true,
          conditional: {
            dependsOn: 'personas.0.domicilio.provincia',
            condition: 'exists'
          },
          grid: { colSpan: 4 }
        },
        {
          name: 'personas.0.domicilio.parroquia',
          type: 'parroquia',
          label: 'Parroquia',
          required: true,
          conditional: {
            dependsOn: 'personas.0.domicilio.canton',
            condition: 'exists'
          },
          grid: { colSpan: 4 }
        },
        {
          name: 'personas.0.domicilio.calle',
          type: 'direccion',
          label: 'Calle Principal',
          placeholder: 'Av. Principal, Calle Secundaria',
          required: true,
          grid: { colSpan: 8 }
        },
        {
          name: 'personas.0.domicilio.numero',
          type: 'text',
          label: 'Número',
          placeholder: 'N12-34',
          grid: { colSpan: 2 }
        },
        {
          name: 'personas.0.domicilio.sector',
          type: 'text',
          label: 'Sector',
          placeholder: 'Sector o barrio',
          required: true,
          grid: { colSpan: 6 }
        },
        {
          name: 'personas.0.telefono',
          type: 'tel',
          label: 'Teléfono',
          placeholder: '0998765432',
          validation: ValidationEngine.phoneSchema,
          grid: { colSpan: 3 }
        },
        {
          name: 'personas.0.email',
          type: 'email',
          label: 'Email',
          placeholder: 'correo@ejemplo.com',
          validation: ValidationEngine.emailSchema,
          grid: { colSpan: 5 }
        },

        // Vendedor (persona 1)
        {
          name: 'personas.1.rol',
          type: 'select',
          label: 'Rol',
          defaultValue: 'VENDEDOR',
          options: [
            { value: 'COMPRADOR', label: 'Comprador' },
            { value: 'VENDEDOR', label: 'Vendedor' },
            { value: 'CONSTITUYENTE', label: 'Constituyente' },
            { value: 'APODERADO', label: 'Apoderado' },
            { value: 'TESTIGO', label: 'Testigo' }
          ],
          required: true,
          grid: { colSpan: 2 }
        }
        // ... repetir campos similares para persona 1 (vendedor)
      ],
      defaultExpanded: true
    };
  }

  // Sección inmueble
  private static getInmuebleSection(): FormSection {
    return {
      id: 'inmueble',
      title: 'Datos del Inmueble',
      description: 'Información del bien inmueble objeto de la transacción',
      conditional: {
        dependsOn: 'documentType',
        condition: 'equals',
        value: 'PDF_EXTRACTO'
      },
      fields: [
        {
          name: 'inmueble.tipo',
          type: 'select',
          label: 'Tipo de Inmueble',
          options: [
            { value: 'CASA', label: 'Casa' },
            { value: 'DEPARTAMENTO', label: 'Departamento' },
            { value: 'TERRENO', label: 'Terreno' },
            { value: 'LOCAL_COMERCIAL', label: 'Local Comercial' },
            { value: 'OFICINA', label: 'Oficina' },
            { value: 'BODEGA', label: 'Bodega' },
            { value: 'OTRO', label: 'Otro' }
          ],
          required: true,
          grid: { colSpan: 4 }
        },
        {
          name: 'inmueble.areaTerreno',
          type: 'number',
          label: 'Área de Terreno (m²)',
          placeholder: '120.50',
          grid: { colSpan: 3 }
        },
        {
          name: 'inmueble.areaConstruccion',
          type: 'number',
          label: 'Área de Construcción (m²)',
          placeholder: '85.30',
          grid: { colSpan: 3 }
        },
        {
          name: 'inmueble.ubicacion.provincia',
          type: 'provincia',
          label: 'Provincia',
          options: this.ECUADOR_PROVINCES.map(p => ({ value: p, label: p })),
          required: true,
          grid: { colSpan: 4 }
        },
        {
          name: 'inmueble.ubicacion.canton',
          type: 'canton',
          label: 'Cantón',
          required: true,
          grid: { colSpan: 4 }
        },
        {
          name: 'inmueble.ubicacion.parroquia',
          type: 'parroquia',
          label: 'Parroquia',
          required: true,
          grid: { colSpan: 4 }
        },
        {
          name: 'inmueble.ubicacion.calle',
          type: 'direccion',
          label: 'Dirección Completa',
          placeholder: 'Av. Principal N12-34 y Calle Secundaria',
          required: true,
          grid: { colSpan: 12 }
        },
        {
          name: 'inmueble.linderos',
          type: 'textarea',
          label: 'Linderos y Dimensiones',
          placeholder: 'Norte: ... Sur: ... Este: ... Oeste: ...',
          required: true,
          grid: { colSpan: 12 }
        },
        {
          name: 'inmueble.observaciones',
          type: 'textarea',
          label: 'Observaciones',
          placeholder: 'Información adicional del inmueble',
          grid: { colSpan: 12 }
        }
      ],
      collapsible: true,
      defaultExpanded: true
    };
  }

  // Sección vehículo
  private static getVehiculoSection(): FormSection {
    return {
      id: 'vehiculo',
      title: 'Datos del Vehículo',
      description: 'Información del vehículo objeto de la transacción',
      conditional: {
        dependsOn: 'documentType',
        condition: 'equals',
        value: 'SCREENSHOT_VEHICULO'
      },
      fields: [
        {
          name: 'vehiculo.marca',
          type: 'text',
          label: 'Marca',
          placeholder: 'TOYOTA',
          required: true,
          grid: { colSpan: 3 }
        },
        {
          name: 'vehiculo.modelo',
          type: 'text',
          label: 'Modelo',
          placeholder: 'COROLLA',
          required: true,
          grid: { colSpan: 3 }
        },
        {
          name: 'vehiculo.anio',
          type: 'number',
          label: 'Año',
          placeholder: '2020',
          required: true,
          validation: ValidationEngine.generateDynamicValidation('number', { min: 1900, max: new Date().getFullYear() + 1 }),
          grid: { colSpan: 2 }
        },
        {
          name: 'vehiculo.placa',
          type: 'placa',
          label: 'Placa',
          placeholder: 'ABC-1234',
          required: true,
          validation: ValidationEngine.placaSchema,
          metadata: { ecuadorianValidation: true },
          grid: { colSpan: 3 }
        },
        {
          name: 'vehiculo.chasis',
          type: 'text',
          label: 'Número de Chasis',
          placeholder: 'JTDKN3DU5E0123456',
          required: true,
          grid: { colSpan: 6 }
        },
        {
          name: 'vehiculo.motor',
          type: 'text',
          label: 'Número de Motor',
          placeholder: '3ZZ1234567',
          required: true,
          grid: { colSpan: 6 }
        },
        {
          name: 'vehiculo.cilindraje',
          type: 'text',
          label: 'Cilindraje',
          placeholder: '1800',
          required: true,
          grid: { colSpan: 3 }
        },
        {
          name: 'vehiculo.combustible',
          type: 'select',
          label: 'Combustible',
          options: this.COMBUSTIBLES,
          required: true,
          grid: { colSpan: 3 }
        },
        {
          name: 'vehiculo.color',
          type: 'text',
          label: 'Color',
          placeholder: 'BLANCO',
          required: true,
          grid: { colSpan: 3 }
        },
        {
          name: 'vehiculo.clase',
          type: 'text',
          label: 'Clase',
          placeholder: 'AUTOMOVIL',
          required: true,
          grid: { colSpan: 3 }
        },
        {
          name: 'vehiculo.tipo',
          type: 'text',
          label: 'Tipo',
          placeholder: 'SEDAN',
          required: true,
          grid: { colSpan: 3 }
        }
      ],
      collapsible: true,
      defaultExpanded: true
    };
  }

  // Sección sociedad
  private static getSociedadSection(): FormSection {
    return {
      id: 'sociedad',
      title: 'Datos de la Sociedad',
      description: 'Información de la sociedad según Article 29',
      conditional: {
        dependsOn: 'documentType',
        condition: 'equals',
        value: 'PDF_SOCIETARIO'
      },
      fields: [
        {
          name: 'tipoSociedad',
          type: 'select',
          label: 'Tipo de Sociedad',
          options: [
            { value: 'COMPANIA_LIMITADA', label: 'Compañía de Responsabilidad Limitada' },
            { value: 'SOCIEDAD_ANONIMA', label: 'Sociedad Anónima' },
            { value: 'SOCIEDAD_SIMPLE', label: 'Sociedad Simple' },
            { value: 'EMPRESA_UNIPERSONAL', label: 'Empresa Unipersonal de Responsabilidad Limitada' }
          ],
          required: true,
          grid: { colSpan: 6 }
        },
        {
          name: 'denominacionSocial',
          type: 'text',
          label: 'Denominación Social',
          placeholder: 'EMPRESA EJEMPLO CIA. LTDA.',
          required: true,
          grid: { colSpan: 6 }
        },
        {
          name: 'objetoSocial',
          type: 'textarea',
          label: 'Objeto Social',
          placeholder: 'Descripción de las actividades de la sociedad',
          required: true,
          grid: { colSpan: 12 }
        }
      ],
      collapsible: true,
      defaultExpanded: true
    };
  }

  // Sección Article 29 (obligatorio)
  private static getArticle29Section(): FormSection {
    return {
      id: 'article29',
      title: 'Article 29 - Información Económica',
      description: 'Datos obligatorios según Article 29 para control tributario',
      fields: [
        {
          name: 'article29.valorOperacion',
          type: 'currency',
          label: 'Valor de la Operación (USD)',
          placeholder: '50000.00',
          required: true,
          validation: ValidationEngine.currencySchema,
          metadata: { article29Field: true },
          grid: { colSpan: 4 }
        },
        {
          name: 'article29.formaPago',
          type: 'select',
          label: 'Forma de Pago',
          options: this.FORMAS_PAGO,
          required: true,
          metadata: { article29Field: true },
          grid: { colSpan: 4 }
        },
        {
          name: 'article29.moneda',
          type: 'select',
          label: 'Moneda',
          options: [
            { value: 'USD', label: 'Dólares Americanos (USD)' },
            { value: 'EUR', label: 'Euros (EUR)' }
          ],
          defaultValue: 'USD',
          required: true,
          metadata: { article29Field: true },
          grid: { colSpan: 4 }
        },
        {
          name: 'article29.fechaOperacion',
          type: 'date',
          label: 'Fecha de la Operación',
          required: true,
          validation: ValidationEngine.dateSchema,
          metadata: { article29Field: true },
          grid: { colSpan: 4 }
        },
        {
          name: 'article29.esOperacionCompleta',
          type: 'checkbox',
          label: 'Operación Completa',
          defaultValue: true,
          metadata: { 
            article29Field: true,
            helpText: 'Marque si la operación se realiza en su totalidad'
          },
          grid: { colSpan: 4 }
        },
        {
          name: 'article29.detallesPago',
          type: 'textarea',
          label: 'Detalles del Pago',
          placeholder: 'Especificar detalles adicionales del pago si aplica',
          conditional: {
            dependsOn: 'article29.formaPago',
            condition: 'equals',
            value: 'MIXTO'
          },
          grid: { colSpan: 12 }
        }
      ],
      collapsible: false,
      defaultExpanded: true
    };
  }

  // Sección detalles adicionales
  private static getDetallesSection(): FormSection {
    return {
      id: 'detalles',
      title: 'Detalles de la Escritura',
      description: 'Información adicional y detalles de la escritura',
      fields: [
        {
          name: 'fechaEscritura',
          type: 'date',
          label: 'Fecha de la Escritura',
          required: true,
          validation: ValidationEngine.dateSchema,
          grid: { colSpan: 4 }
        },
        {
          name: 'notario',
          type: 'text',
          label: 'Notario',
          placeholder: 'Dr. Juan Pérez Notario Público',
          required: true,
          grid: { colSpan: 4 }
        },
        {
          name: 'numeroEscritura',
          type: 'text',
          label: 'Número de Escritura',
          placeholder: '001-2024',
          required: true,
          grid: { colSpan: 4 }
        },
        {
          name: 'observaciones',
          type: 'textarea',
          label: 'Observaciones Generales',
          placeholder: 'Información adicional relevante para la escritura',
          grid: { colSpan: 12 }
        }
      ],
      collapsible: true,
      defaultExpanded: false
    };
  }

  // Obtener template según tipo de documento
  static getTemplate(documentType: DocumentType): NotarialFormTemplate {
    switch (documentType) {
      case 'PDF_EXTRACTO':
        return this.getCompraventaTemplate();
      case 'SCREENSHOT_VEHICULO':
        return this.getVehiculoTemplate();
      case 'PDF_SOCIETARIO':
        return this.getSocietarioTemplate();
      case 'PDF_DILIGENCIA':
        return this.getDiligenciaTemplate();
      case 'PDF_FIDUCIARIO':
        return this.getFiduciarioTemplate();
      case 'PDF_DONACION':
        return this.getDonacionTemplate();
      case 'PDF_CONSORCIO':
        return this.getConsorcioTemplate();
      default:
        return this.getCompraventaTemplate();
    }
  }

  // Templates adicionales (versiones simplificadas)
  private static getDiligenciaTemplate(): NotarialFormTemplate {
    return {
      id: 'DILIGENCIA',
      name: 'Formulario de Diligencia',
      documentType: 'PDF_DILIGENCIA' as DocumentType,
      sections: [this.getPersonasSection(), this.getDetallesSection()],
      validationSchema: ValidationEngine.getSchemaForDocumentType('PDF_DILIGENCIA'),
      requiredFields: ['personas.0.nombres', 'personas.0.cedula']
    };
  }

  private static getFiduciarioTemplate(): NotarialFormTemplate {
    return {
      id: 'FIDUCIARIO',
      name: 'Formulario Fiduciario',
      documentType: 'PDF_FIDUCIARIO' as DocumentType,
      sections: [this.getPersonasSection(), this.getArticle29Section(), this.getDetallesSection()],
      validationSchema: ValidationEngine.getSchemaForDocumentType('PDF_FIDUCIARIO'),
      article29Fields: ['valorOperacion', 'formaPago'],
      requiredFields: ['personas.0.nombres', 'personas.0.cedula', 'article29.valorOperacion']
    };
  }

  private static getDonacionTemplate(): NotarialFormTemplate {
    return {
      id: 'DONACION',
      name: 'Formulario de Donación',
      documentType: 'PDF_DONACION' as DocumentType,
      sections: [this.getPersonasSection(), this.getArticle29Section(), this.getDetallesSection()],
      validationSchema: ValidationEngine.getSchemaForDocumentType('PDF_DONACION'),
      article29Fields: ['valorOperacion'],
      requiredFields: ['personas.0.nombres', 'personas.0.cedula', 'article29.valorOperacion']
    };
  }

  private static getConsorcioTemplate(): NotarialFormTemplate {
    return {
      id: 'CONSORCIO',
      name: 'Formulario de Consorcio',
      documentType: 'PDF_CONSORCIO' as DocumentType,
      sections: [this.getPersonasSection(), this.getSociedadSection(), this.getArticle29Section()],
      validationSchema: ValidationEngine.getSchemaForDocumentType('PDF_CONSORCIO'),
      article29Fields: ['valorOperacion', 'formaPago'],
      requiredFields: ['personas.0.nombres', 'personas.0.cedula', 'tipoSociedad']
    };
  }

  // Obtener opciones dinámicas para dropdowns
  static getDynamicOptions(fieldType: string, parentValue?: string): Array<{ value: string; label: string }> {
    // Implementación de cantones y parroquias basado en provincia
    // Por ahora retornamos opciones básicas
    switch (fieldType) {
      case 'provincia':
        return this.ECUADOR_PROVINCES.map(p => ({ value: p, label: p }));
      case 'canton':
        // En una implementación real, esto dependería de la provincia seleccionada
        return [
          { value: 'QUITO', label: 'Quito' },
          { value: 'GUAYAQUIL', label: 'Guayaquil' },
          { value: 'CUENCA', label: 'Cuenca' }
        ];
      case 'parroquia':
        // En una implementación real, esto dependería del cantón seleccionado
        return [
          { value: 'CENTRO', label: 'Centro' },
          { value: 'NORTE', label: 'Norte' },
          { value: 'SUR', label: 'Sur' }
        ];
      default:
        return [];
    }
  }
}