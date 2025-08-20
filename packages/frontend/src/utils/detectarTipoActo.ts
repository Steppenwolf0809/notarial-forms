// Utilidad para detectar automáticamente el tipo de acto del Artículo 29
// basado en el contenido del extracto notarial

export type TipoActoArticulo29 = 
  | 'COMPRAVENTA_INMOBILIARIO'
  | 'PERMUTA_INMOBILIARIO' 
  | 'ACTO_SOCIETARIO'
  | 'CONTRATO_FIDUCIARIO'
  | 'CONSORCIO'
  | 'DONACION_CESION'
  | 'VEHICULO_MAQUINARIA'

export interface ConfiguracionFormulario {
  tipoActo: TipoActoArticulo29
  tituloFormulario: string
  icono: string
  reutilizaFormularioBase: boolean
  camposEspecificos: string[]
  seccionesCondicionales: string[]
}

/**
 * Detecta automáticamente el tipo de acto según el Artículo 29
 * basándose en palabras clave del extracto notarial
 */
export const detectarTipoActo = (actoContrato: string): TipoActoArticulo29 => {
  const acto = actoContrato.toLowerCase().trim()
  
  // 1. Compra y venta de bienes inmobiliarios (incluidos promesa o constitución de hipoteca)
  if (acto.includes('compraventa') || 
      acto.includes('compra venta') ||
      acto.includes('promesa') ||
      acto.includes('hipoteca') ||
      (acto.includes('venta') && acto.includes('inmueble'))) {
    return 'COMPRAVENTA_INMOBILIARIO'
  }
  
  // 2. Permuta que incluye bienes inmuebles
  if (acto.includes('permuta')) {
    return 'PERMUTA_INMOBILIARIO'
  }
  
  // 3. Todo acto de conformación y reestructuración societaria
  if (acto.includes('constitucion') ||
      acto.includes('sociedad') ||
      acto.includes('reestructuracion') ||
      acto.includes('conformacion') ||
      acto.includes('liquidacion') && acto.includes('sociedad') ||
      acto.includes('s.a.') ||
      acto.includes('limitada') ||
      acto.includes('cia') ||
      acto.includes('compañia')) {
    return 'ACTO_SOCIETARIO'
  }
  
  // 4. Creación, operación, administración o liquidación de contratos fiduciarios
  if (acto.includes('fideicomiso') ||
      acto.includes('fiduciario') ||
      acto.includes('fiducia')) {
    return 'CONTRATO_FIDUCIARIO'
  }
  
  // 5. Creación, operación, administración o liquidación de consorcios
  if (acto.includes('consorcio')) {
    return 'CONSORCIO'
  }
  
  // 6. Donaciones y/o cesiones de derechos
  if (acto.includes('donacion') ||
      acto.includes('cesion') ||
      acto.includes('traspaso gratuito')) {
    return 'DONACION_CESION'
  }
  
  // 7. Reconocimiento de firma de contratos de compra y venta de vehículos y maquinaria
  if (acto.includes('vehiculo') ||
      acto.includes('maquinaria') ||
      acto.includes('reconocimiento') ||
      acto.includes('automotor')) {
    return 'VEHICULO_MAQUINARIA'
  }
  
  // Default: Si no detecta nada específico, asume compraventa inmobiliaria
  return 'COMPRAVENTA_INMOBILIARIO'
}

/**
 * Obtiene la configuración del formulario según el tipo de acto detectado
 */
export const obtenerConfiguracionFormulario = (tipoActo: TipoActoArticulo29): ConfiguracionFormulario => {
  const configuraciones: Record<TipoActoArticulo29, ConfiguracionFormulario> = {
    'COMPRAVENTA_INMOBILIARIO': {
      tipoActo: 'COMPRAVENTA_INMOBILIARIO',
      tituloFormulario: 'Formulario UAFE - Compraventa Inmobiliaria',
      icono: '🏠',
      reutilizaFormularioBase: true,
      camposEspecificos: ['avaluoMunicipal', 'formasPagoMultiples'],
      seccionesCondicionales: []
    },
    
    'PERMUTA_INMOBILIARIO': {
      tipoActo: 'PERMUTA_INMOBILIARIO',
      tituloFormulario: 'Formulario UAFE - Permuta de Inmuebles',
      icono: '🔄',
      reutilizaFormularioBase: true,
      camposEspecificos: ['bienEntregadoPermuta', 'valorComercialPermuta', 'diferenciaPago'],
      seccionesCondicionales: ['datosPermuta']
    },
    
    'DONACION_CESION': {
      tipoActo: 'DONACION_CESION',
      tituloFormulario: 'Formulario UAFE - Donación/Cesión',
      icono: '🎁',
      reutilizaFormularioBase: true,
      camposEspecificos: ['motivoDonacion', 'valorComercialBien', 'relacionDonanteDonatorio'],
      seccionesCondicionales: ['datosDonacion']
    },
    
    'ACTO_SOCIETARIO': {
      tipoActo: 'ACTO_SOCIETARIO',
      tituloFormulario: 'Formulario UAFE - Acto Societario',
      icono: '🏢',
      reutilizaFormularioBase: false,
      camposEspecificos: ['datosSociedad', 'socios', 'capitalSocial', 'representanteLegal'],
      seccionesCondicionales: ['personasJuridicas', 'socios', 'beneficiariosFinales']
    },
    
    'CONTRATO_FIDUCIARIO': {
      tipoActo: 'CONTRATO_FIDUCIARIO',
      tituloFormulario: 'Formulario UAFE - Contrato Fiduciario',
      icono: '⚖️',
      reutilizaFormularioBase: false,
      camposEspecificos: ['fiduciante', 'fiduciario', 'beneficiarios', 'finalidadFideicomiso'],
      seccionesCondicionales: ['datosFiduciarios']
    },
    
    'CONSORCIO': {
      tipoActo: 'CONSORCIO',
      tituloFormulario: 'Formulario UAFE - Consorcio',
      icono: '🤝',
      reutilizaFormularioBase: false,
      camposEspecificos: ['miembrosConsorcio', 'objetoConsorcio', 'administrador', 'participaciones'],
      seccionesCondicionales: ['datosConsorcio']
    },
    
    'VEHICULO_MAQUINARIA': {
      tipoActo: 'VEHICULO_MAQUINARIA',
      tituloFormulario: 'Formulario UAFE - Vehículo/Maquinaria',
      icono: '🚗',
      reutilizaFormularioBase: false,
      camposEspecificos: ['datosVehiculo', 'motor', 'chasis', 'valorComercial'],
      seccionesCondicionales: ['vehiculo']
    }
  }
  
  return configuraciones[tipoActo]
}

/**
 * Valida si el tipo detectado coincide con los datos extraídos
 */
export const validarDeteccion = (tipoDetectado: TipoActoArticulo29, extractedData: any): {
  esValido: boolean
  confianza: number
  sugerencias: string[]
} => {
  const sugerencias: string[] = []
  let confianza = 0.8 // Confianza base
  
  // Validaciones específicas según el tipo
  switch (tipoDetectado) {
    case 'COMPRAVENTA_INMOBILIARIO':
      if (extractedData.valorContrato && parseFloat(extractedData.valorContrato) > 0) {
        confianza += 0.1
      }
      if (extractedData.comprador && extractedData.vendedor) {
        confianza += 0.1
      }
      break
      
    case 'ACTO_SOCIETARIO':
      if (extractedData.sociedades && extractedData.sociedades.length > 0) {
        confianza += 0.2
      } else {
        sugerencias.push('No se detectaron datos de sociedades. Verificar si es realmente un acto societario.')
        confianza -= 0.2
      }
      break
      
    case 'VEHICULO_MAQUINARIA':
      if (extractedData.vehiculo) {
        confianza += 0.2
      } else {
        sugerencias.push('No se detectaron datos de vehículo. Verificar el tipo de acto.')
        confianza -= 0.3
      }
      break
  }
  
  return {
    esValido: confianza > 0.6,
    confianza: Math.min(1.0, Math.max(0.0, confianza)),
    sugerencias
  }
}

/**
 * Obtiene campos específicos para mostrar en el resumen del trámite
 */
export const obtenerCamposResumen = (tipoActo: TipoActoArticulo29, extractedData: any): Array<{
  etiqueta: string
  valor: string
  relevancia: 'alta' | 'media' | 'baja'
}> => {
  const campos = []
  
  // Campos comunes
  campos.push({
    etiqueta: 'Tipo de Acto',
    valor: obtenerConfiguracionFormulario(tipoActo).tituloFormulario.replace('Formulario UAFE - ', ''),
    relevancia: 'alta' as const
  })
  
  // Campos específicos según el tipo
  switch (tipoActo) {
    case 'COMPRAVENTA_INMOBILIARIO':
    case 'PERMUTA_INMOBILIARIO':
    case 'DONACION_CESION':
      if (extractedData.valorContrato) {
        campos.push({
          etiqueta: 'Valor',
          valor: `$${parseFloat(extractedData.valorContrato).toLocaleString('es-EC')}`,
          relevancia: 'alta' as const
        })
      }
      break
      
    case 'ACTO_SOCIETARIO':
      if (extractedData.sociedades?.[0]?.denominacion) {
        campos.push({
          etiqueta: 'Sociedad',
          valor: extractedData.sociedades[0].denominacion,
          relevancia: 'alta' as const
        })
      }
      break
      
    case 'VEHICULO_MAQUINARIA':
      if (extractedData.vehiculo?.marca) {
        campos.push({
          etiqueta: 'Vehículo',
          valor: `${extractedData.vehiculo.marca} ${extractedData.vehiculo.modelo || ''}`.trim(),
          relevancia: 'alta' as const
        })
      }
      break
  }
  
  return campos
}
