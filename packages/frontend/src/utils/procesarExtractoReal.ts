// Utilidad para procesar extractos notariales reales usando OCR REAL - VERSIÓN ACTUALIZADA
// Implementación con Tesseract.js y PDF.js para extracción real de texto
// ACTUALIZADO: 2025-01-20

// Importación dinámica de librerías con fallback a CDN
let tesseractModule: any = null;
let pdfjsModule: any = null;

async function loadTesseract() {
  if (tesseractModule) return tesseractModule;
  
  try {
    // Intentar importar desde node_modules usando string dinámico para evitar que Vite pre-procese
    const moduleName = 'tesseract.js';
    tesseractModule = await import(moduleName);
    console.log('✅ Tesseract.js cargado desde node_modules');
    return tesseractModule;
  } catch (error) {
    console.log('⚠️ Tesseract.js no disponible en node_modules, cargando desde CDN...');
    console.log('Error detalles:', error);
    
    // Fallback: cargar desde CDN con manejo robusto
    return new Promise((resolve, reject) => {
      // Verificar si ya está cargado en window
      if ((window as any).Tesseract) {
        console.log('✅ Tesseract.js ya disponible en window');
        tesseractModule = (window as any).Tesseract;
        resolve(tesseractModule);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
      script.async = true;
      script.onload = () => {
        console.log('📦 Script de Tesseract.js cargado desde CDN');
        // Dar tiempo para que se inicialice
        setTimeout(() => {
          if ((window as any).Tesseract) {
            tesseractModule = (window as any).Tesseract;
            console.log('✅ Tesseract.js disponible en window después de carga');
            resolve(tesseractModule);
          } else {
            console.error('❌ Tesseract.js no se inicializó correctamente');
            reject(new Error('Tesseract.js no se inicializó en window'));
          }
        }, 1000);
      };
      script.onerror = (error) => {
        console.error('❌ Error cargando Tesseract.js desde CDN:', error);
        reject(new Error('No se pudo cargar Tesseract.js desde CDN'));
      };
      
      console.log('🔄 Añadiendo script de Tesseract.js al DOM...');
      document.head.appendChild(script);
    });
  }
}

async function loadPDFJS() {
  if (pdfjsModule) return pdfjsModule;
  
  try {
    // Intentar importar desde node_modules usando string dinámico
    const moduleName = 'pdfjs-dist';
    pdfjsModule = await import(moduleName);
    console.log('✅ PDF.js cargado desde node_modules');
    // Configure PDF.js worker
    pdfjsModule.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsModule.version}/pdf.worker.min.js`;
    return pdfjsModule;
  } catch (error) {
    console.log('⚠️ PDF.js no disponible en node_modules, cargando desde CDN...');
    
    // Fallback: cargar desde CDN con manejo robusto
    return new Promise((resolve, reject) => {
      // Verificar si ya está cargado en window
      if ((window as any).pdfjsLib) {
        console.log('✅ PDF.js ya disponible en window');
        pdfjsModule = (window as any).pdfjsLib;
        if (!pdfjsModule.GlobalWorkerOptions.workerSrc) {
          pdfjsModule.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        resolve(pdfjsModule);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        console.log('📦 Script de PDF.js cargado desde CDN');
        // Dar tiempo para que se inicialice
        setTimeout(() => {
          pdfjsModule = (window as any).pdfjsLib;
          if (pdfjsModule) {
            console.log('✅ PDF.js disponible en window después de carga');
            // Configure worker
            pdfjsModule.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve(pdfjsModule);
          } else {
            console.error('❌ PDF.js no se inicializó correctamente');
            reject(new Error('PDF.js no se inicializó en window'));
          }
        }, 500);
      };
      script.onerror = (error) => {
        console.error('❌ Error cargando PDF.js desde CDN:', error);
        reject(new Error('No se pudo cargar PDF.js desde CDN'));
      };
      
      console.log('🔄 Añadiendo script de PDF.js al DOM...');
      document.head.appendChild(script);
    });
  }
}

interface DatosExtractoReal {
  escritura: string
  fechaOtorgamiento: string
  actoContrato: string
  valorContrato: string
  vendedor: {
    nombres: string
    apellidos: string
    cedula: string
    nacionalidad: string
    calidad: string
    tipoInterviniente: string
    esPersonaJuridica?: boolean
    razonSocial?: string
    ruc?: string
    representanteLegal?: string
  }
  vendedores?: Array<{
    nombres: string
    apellidos: string
    cedula: string
    nacionalidad: string
    calidad: string
    tipoInterviniente: string
    esPersonaJuridica?: boolean
    razonSocial?: string
    ruc?: string
    representanteLegal?: string
  }>
  compradores: Array<{
    nombres: string
    apellidos: string
    cedula: string
    nacionalidad: string
    calidad: string
    tipoInterviniente: string
    esPersonaJuridica?: boolean
    razonSocial?: string
    ruc?: string
    representanteLegal?: string
  }>
  relacionCompradores?: {
    sonConyuges: boolean
    tipoRelacion?: string
    observaciones?: string
  }
  ubicacion: {
    provincia: string
    canton: string
    parroquia: string
  }
  inmueble: {
    direccion: {
      callePrincipal: string
      numero: string
      calleSecundaria: string
      sector?: string
      referencia?: string
    }
    tipo: string
    area: string
    descripcion?: string
  }
  notaria: {
    nombre: string
    numero: string
  }
  tipo: string
  documentosDetectados?: string[]
  actosDetectados?: string[]
  confianzaOCR?: number
  textoExtraido?: string
}

// Normaliza texto para búsquedas robustas con regex (sin tildes, mayúsculas, espacios consistentes)
const normalizarTexto = (texto: string): string => {
  try {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // eliminar diacríticos
      .replace(/[\u2010-\u2015]/g, '-') // guiones raros a '-'
      .replace(/[\u00A0\t]+/g, ' ') // espacios no separables y tabs a espacio
      .replace(/\s+/g, ' ') // colapsar espacios y saltos de línea
      .toUpperCase()
  } catch {
    return texto.toUpperCase()
  }
}

// Normaliza cadenas de números de dinero a formato 1234567.89
const normalizarNumeroMoneda = (entrada: string): string => {
  let s = (entrada || '').trim()
  s = s.replace(/\s+/g, '') // quitar espacios internos

  const tienePunto = s.includes('.')
  const tieneComa = s.includes(',')

  if (tienePunto && tieneComa) {
    const lastDot = s.lastIndexOf('.')
    const lastComma = s.lastIndexOf(',')
    const sepDecimal = lastDot > lastComma ? '.' : ','
    const sepMiles = sepDecimal === '.' ? ',' : '.'
    s = s.replace(new RegExp('\\' + sepMiles, 'g'), '')
    if (sepDecimal === ',') s = s.replace(',', '.')
    return s
  }

  if (tieneComa) {
    const partes = s.split(',')
    if (partes[partes.length - 1].length === 2) {
      s = partes.slice(0, -1).join('') + '.' + partes[partes.length - 1]
    } else {
      s = s.replace(/,/g, '')
    }
    return s
  }

  if (tienePunto) {
    const partes = s.split('.')
    if (partes[partes.length - 1].length === 2) {
      s = partes.slice(0, -1).join('') + '.' + partes[partes.length - 1]
    } else {
      s = s.replace(/\./g, '')
    }
    return s
  }

  return s
}

/**
 * Procesa un archivo PDF de extracto notarial real usando OCR REAL
 * Extrae el texto actual del PDF usando Tesseract.js y PDF.js
 */
export const procesarExtractoNotarialReal = async (file: File): Promise<DatosExtractoReal> => {
  console.log(`🚀 VERSIÓN ACTUALIZADA 2025-01-20 - INICIANDO OCR REAL para: ${file.name}`)
  console.log(`📁 Tamaño del archivo: ${(file.size / 1024).toFixed(2)} KB`)
  console.log(`📄 Tipo de archivo: ${file.type}`)
  console.log(`🔧 USANDO NUEVOS PATRONES MEJORADOS`)
  
  // Limpiar cache para asegurar procesamiento fresco
  console.log('🧹 Limpiando cache para procesamiento fresco...')
  try {
    localStorage.clear()
    sessionStorage.clear()
    console.log('✅ Cache limpiado exitosamente')
  } catch (e) {
    console.warn('⚠️ No se pudo limpiar cache:', e)
  }

  let textoExtraido = ''
  let confianzaOCR = 0

  try {
    if (file.type === 'application/pdf') {
      console.log('📄 Procesando PDF...')
      const resultado = await procesarPDFConOCR(file)
      textoExtraido = resultado.texto
      confianzaOCR = resultado.confianza
    } else if (file.type.startsWith('image/')) {
      console.log('🖼️ Procesando imagen...')
      const resultado = await procesarImagenConOCR(file)
      textoExtraido = resultado.texto
      confianzaOCR = resultado.confianza
    } else {
      throw new Error(`Tipo de archivo no soportado: ${file.type}`)
    }

    console.log(`📝 Texto extraído (${textoExtraido.length} caracteres):`)
    console.log(textoExtraido.substring(0, 400) + '...')
    console.log(`🎯 Confianza OCR: ${(confianzaOCR * 100).toFixed(1)}%`)
    
    // Log completo para debugging detallado
    console.log('📝 TEXTO COMPLETO PARA DEBUGGING:')
    console.log('=' .repeat(80))
    console.log(textoExtraido)
    console.log('=' .repeat(80))
    
    // Debug específico para valor del contrato
    const textoNormalizadoDebug = normalizarTexto(textoExtraido)
    if (textoNormalizadoDebug.includes('CUANTIA')) {
      console.log('🔍 ENCONTRÉ LA PALABRA "CUANTIA" EN EL TEXTO')
      const indexCuantia = textoNormalizadoDebug.indexOf('CUANTIA')
      console.log('🔍 Contexto alrededor de CUANTIA:', textoNormalizadoDebug.substring(indexCuantia - 50, indexCuantia + 150))
    } else {
      console.log('⚠️ NO SE ENCONTRÓ LA PALABRA "CUANTIA" EN EL TEXTO')
    }

    // Verificar que el texto no esté vacío
    if (!textoExtraido || textoExtraido.trim().length < 10) {
      console.warn('⚠️ Texto extraído muy corto o vacío, usando fallback básico')
      throw new Error('Texto OCR insuficiente para procesamiento')
    }

    // Extraer datos del texto real
    console.log('🔍 Iniciando extracción de datos estructurados...')
    const datosExtraidos = await extraerDatosRealesDelTexto(textoExtraido, file.name)
    console.log('✅ Extracción de datos completada exitosamente')

    return {
      ...datosExtraidos,
      confianzaOCR,
      textoExtraido: textoExtraido.substring(0, 1000), // Primeros 1000 caracteres para debug
      tipo: 'OCR Real - Tesseract.js'
    }

  } catch (error) {
    console.error('❌ Error en OCR real:', error)
    
    // Fallback con mensaje claro de error
    return {
      escritura: `ERROR_OCR_${Date.now().toString().slice(-6)}`,
      fechaOtorgamiento: 'ERROR EN EXTRACCIÓN',
      actoContrato: 'ERROR',
      valorContrato: '0.00',
      vendedor: {
        nombres: 'ERROR',
        apellidos: 'EN PROCESAMIENTO',
        cedula: '0000000000',
        nacionalidad: 'ECUATORIANA',
        calidad: 'ERROR',
        tipoInterviniente: 'ERROR',
        esPersonaJuridica: false
      },
      compradores: [{
        nombres: 'ERROR',
        apellidos: 'EN PROCESAMIENTO',
        cedula: '0000000000',
        nacionalidad: 'ECUATORIANA',
        calidad: 'ERROR',
        tipoInterviniente: 'ERROR',
        esPersonaJuridica: false
      }],
      ubicacion: {
        provincia: 'ERROR',
        canton: 'ERROR',
        parroquia: 'ERROR'
      },
      inmueble: {
        direccion: {
          callePrincipal: 'ERROR EN PROCESAMIENTO',
          numero: '',
          calleSecundaria: ''
        },
        tipo: 'ERROR',
        area: '0'
      },
      notaria: {
        nombre: 'ERROR EN PROCESAMIENTO',
        numero: 'ERROR'
      },
      tipo: 'Error OCR',
      documentosDetectados: [`Error procesando: ${file.name}`],
      actosDetectados: ['Error en extracción'],
      confianzaOCR: 0,
      textoExtraido: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
    }
  }
}

/**
 * Procesa un archivo PDF usando PDF.js y Tesseract.js
 */
const procesarPDFConOCR = async (file: File): Promise<{ texto: string; confianza: number }> => {
  console.log('📄 Iniciando procesamiento de PDF...')
  
  try {
    // Paso 1: Intentar extraer texto directo con PDF.js
    try {
      const textoPDF = await extraerTextoDePDF(file)
      
      if (textoPDF && textoPDF.length > 100) {
        console.log('✅ Texto extraído directamente del PDF')
        return { texto: textoPDF, confianza: 0.95 }
      }
    } catch (pdfError) {
      console.log('⚠️ PDF.js no disponible, usando OCR directo en el archivo...')
    }

    console.log('⚠️ Convirtiendo PDF a imágenes para OCR...')
    
    // Paso 2: Convertir PDF a imágenes y aplicar OCR
    try {
      const imagenesCanvas = await convertirPDFAImagenes(file)
      let textoCompleto = ''
      let confianzaPromedio = 0
      
      for (let i = 0; i < imagenesCanvas.length; i++) {
        console.log(`🔍 Procesando página ${i + 1}/${imagenesCanvas.length} con OCR...`)
        
        const resultado = await aplicarOCREnCanvas(imagenesCanvas[i])
        textoCompleto += resultado.texto + '\n\n'
        confianzaPromedio += resultado.confianza
        
        console.log(`📄 Página ${i + 1}: ${resultado.texto.length} caracteres, confianza: ${(resultado.confianza * 100).toFixed(1)}%`)
      }
      
      confianzaPromedio = confianzaPromedio / imagenesCanvas.length
      
      return { texto: textoCompleto, confianza: confianzaPromedio }
      
    } catch (canvasError) {
      console.log('⚠️ Conversión a canvas falló, intentando OCR directo...')
      
      // Fallback: OCR directo del archivo como imagen
      const resultado = await procesarImagenConOCR(file)
      return resultado
    }
    
  } catch (error) {
    console.error('❌ Error procesando PDF:', error)
    throw error
  }
}

/**
 * Procesa una imagen directamente con Tesseract.js
 */
const procesarImagenConOCR = async (file: File): Promise<{ texto: string; confianza: number }> => {
  console.log('🖼️ Iniciando procesamiento de imagen...')
  
  try {
    const tesseract = await loadTesseract()
    const worker = await tesseract.createWorker('spa', 1, {
      logger: (m: any) => {
        if (m.status === 'recognizing text') {
          console.log(`📝 OCR Progreso: ${Math.round(m.progress * 100)}%`)
        }
      }
    })

    console.log('🔧 Configurando Tesseract para español...')
    await worker.setParameters({
      tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789áéíóúÁÉÍÓÚñÑ .,:-/()°',
      preserve_interword_spaces: '1'
    })

    console.log('🔍 Ejecutando OCR en imagen...')
    const { data } = await worker.recognize(file)
    
    await worker.terminate()
    
    console.log(`✅ OCR completado. Confianza: ${data.confidence}%`)
    
    return { 
      texto: data.text, 
      confianza: data.confidence / 100 
    }
    
  } catch (error) {
    console.error('❌ Error en OCR de imagen:', error)
    throw error
  }
}

/**
 * Extrae texto directamente de un PDF usando PDF.js
 */
const extraerTextoDePDF = async (file: File): Promise<string> => {
  const pdfjsLib = await loadPDFJS()
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  
  let textoCompleto = ''
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    
    const textoPagina = textContent.items
      .map((item: any) => item.str)
      .join(' ')
    
    textoCompleto += textoPagina + '\n\n'
  }
  
  return textoCompleto
}

/**
 * Convierte un PDF a imágenes Canvas para OCR
 */
const convertirPDFAImagenes = async (file: File): Promise<HTMLCanvasElement[]> => {
  const pdfjsLib = await loadPDFJS()
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  
  const canvases: HTMLCanvasElement[] = []
  
  for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 3); pageNum++) { // Máximo 3 páginas
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: 2.0 }) // Escala 2x para mejor OCR
    
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    
    canvas.height = viewport.height
    canvas.width = viewport.width
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise
    
    canvases.push(canvas)
  }
  
  return canvases
}

/**
 * Aplica OCR a un canvas usando Tesseract.js
 */
const aplicarOCREnCanvas = async (canvas: HTMLCanvasElement): Promise<{ texto: string; confianza: number }> => {
  const tesseract = await loadTesseract()
  const worker = await tesseract.createWorker('spa', 1, {
    logger: (m: any) => {
      if (m.status === 'recognizing text') {
        console.log(`📝 OCR Canvas: ${Math.round(m.progress * 100)}%`)
      }
    }
  })

  await worker.setParameters({
    tessedit_pageseg_mode: '1',
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789áéíóúÁÉÍÓÚñÑ .,:-/()°',
    preserve_interword_spaces: '1'
  })

  const { data } = await worker.recognize(canvas)
  await worker.terminate()
  
  return { 
    texto: data.text, 
    confianza: data.confidence / 100 
  }
}

/**
 * Extrae datos reales del texto usando patrones de expresiones regulares
 */
const extraerDatosRealesDelTexto = async (texto: string, fileName: string): Promise<DatosExtractoReal> => {
  console.log('🔍 Extrayendo datos REALES del texto OCR...')
  console.log(`📄 Archivo: ${fileName}`)
  
  // Usar texto normalizado para mayor robustez
  const textoUpper = normalizarTexto(texto)
  
  // 1. Extraer número de escritura con patrones reales ecuatorianos
  const escritura = extraerNumeroEscritura(textoUpper)
  console.log(`📋 Número de escritura encontrado: ${escritura}`)
  
  // 2. Extraer fecha de otorgamiento
  const fechaOtorgamiento = extraerFechaOtorgamiento(textoUpper)
  console.log(`📅 Fecha encontrada: ${fechaOtorgamiento}`)
  
  // 3. Extraer tipo de acto
  const actoContrato = extraerTipoActo(textoUpper)
  console.log(`⚖️ Acto detectado: ${actoContrato}`)
  
  // 4. Extraer valor del contrato
  const valorContrato = extraerValorContrato(textoUpper)
  console.log(`💰 Valor extraído: ${valorContrato}`)
  
  // 5. Extraer personas (vendedor y compradores)
  console.log('👥 INICIANDO EXTRACCIÓN DE PERSONAS...')
  const { vendedor, compradores, vendedores } = extraerPersonas(textoUpper)
  console.log(`👤 Vendedor: ${vendedor.nombres} ${vendedor.apellidos} ${vendedor.cedula}`)
  console.log(`👥 Compradores: ${compradores.length} encontrados`)
  compradores.forEach((comp, i) => {
    console.log(`👥 Comprador ${i+1}: ${comp.nombres} ${comp.apellidos} ${comp.cedula}`)
  })
  
  // 6. Extraer ubicación  
  console.log('📍 INICIANDO EXTRACCIÓN DE UBICACIÓN...')
  const ubicacion = extraerUbicacionReal(textoUpper)
  console.log(`📍 Ubicación: ${ubicacion.provincia} - ${ubicacion.canton} - ${ubicacion.parroquia}`)
  
  // 7. Detectar relación entre compradores
  const relacionCompradores = detectarRelacionCompradores(compradores)
  
  // 8. Extraer datos de notaría
  const notaria = extraerDatosNotaria(textoUpper)
  
  return {
    escritura,
    fechaOtorgamiento,
    actoContrato,
    valorContrato,
    vendedor,
    compradores,
    vendedores,
    relacionCompradores,
    ubicacion,
    inmueble: {
      direccion: {
        callePrincipal: '', // Para ser completado por el usuario
        numero: '',
        calleSecundaria: ''
      },
      tipo: '',
      area: ''
    },
    notaria,
    tipo: 'EXTRACTO NOTARIAL',
    documentosDetectados: [escritura],
    actosDetectados: [actoContrato]
  }
}

/**
 * Extrae el número de escritura usando patrones ecuatorianos reales
 */
const extraerNumeroEscritura = (texto: string): string => {
  // Patrones para números de escritura ecuatorianos
  const patrones = [
    /ESCRITURA[:\s]+N[°º]?\s*(\d{11,18}P\d{4,6})/i,
    /NUMERO[:\s]+(\d{11,18}P\d{4,6})/i,
    /(\d{11,18}P\d{4,6})/g,
    /ESCRITURA[:\s]+N[°º]?\s*(\d+)/i,
    /NUMERO[:\s]+(\d{4,})/i
  ]
  
  for (const patron of patrones) {
    const match = texto.match(patron)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return 'NO_EXTRAIDO'
}

/**
 * Extrae la fecha de otorgamiento
 */
const extraerFechaOtorgamiento = (texto: string): string => {
  // Patrones para fechas en español
  const patrones = [
    /FECHA[:\s]+DE[:\s]+OTORGAMIENTO[:\s]*([0-9]{1,2}[:\s]+DE[:\s]+[A-Z]+[:\s]+DEL?[:\s]+[0-9]{4})/i,
    /OTORGAMIENTO[:\s]*([0-9]{1,2}[:\s]+DE[:\s]+[A-Z]+[:\s]+DEL?[:\s]+[0-9]{4})/i,
    /([0-9]{1,2}[:\s]+DE[:\s]+[A-Z]+[:\s]+DEL?[:\s]+[0-9]{4})/i,
    /([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4})/i,
    /([0-9]{1,2}-[0-9]{1,2}-[0-9]{4})/i
  ]
  
  for (const patron of patrones) {
    const match = texto.match(patron)
    if (match && match[1]) {
      return match[1].replace(/\s+/g, ' ').trim()
    }
  }
  
  return 'NO_EXTRAIDA'
}

/**
 * Extrae el tipo de acto/contrato
 */
const extraerTipoActo = (texto: string): string => {
  const actos = [
    'COMPRAVENTA',
    'DONACION',
    'PERMUTA',
    'CANCELACION DE HIPOTECA',
    'HIPOTECA',
    'CONSTITUCION DE SOCIEDAD',
    'FIDEICOMISO',
    'CESION DE DERECHOS'
  ]
  
  // Buscar en patrones específicos
  for (const acto of actos) {
    if (texto.includes(`ACTO O CONTRATO: ${acto}`) || 
        texto.includes(`CONTRATO: ${acto}`) ||
        texto.includes(`ACTO: ${acto}`) ||
        texto.includes(acto)) {
      return acto
    }
  }
  
  return 'OTRO'
}

/**
 * Extrae el valor del contrato - VERSIÓN MEJORADA PARA PDFs NOTARIALES ECUATORIANOS
 */
const extraerValorContrato = (texto: string): string => {
  console.log('💰 Iniciando extracción de valor del contrato...')
  // Asegurar que el texto venga normalizado
  const t = normalizarTexto(texto)
  
  // Patrones específicos para documentos notariales ecuatorianos
  const patronesEspecificos = [
    // Patrón 1: CUANTÍA DEL ACTO O CONTRATO: seguido de valor
    /CUANTIA\s+DEL\s+ACTO\s+O\s+CONTRATO\s*:?\s*(([0-9]{1,3}(?:[.,][0-9]{3})+|[0-9]{4,})(?:[.,][0-9]{2})?)/i,
    // Patrón 2: CUANTÍA: seguido de valor
    /CUANTIA\s*:?\s*(([0-9]{1,3}(?:[.,][0-9]{3})+|[0-9]{4,})(?:[.,][0-9]{2})?)/i,
    // Patrón 3: VALOR DEL CONTRATO: seguido de valor  
    /VALOR\s+DEL\s+CONTRATO\s*:?\s*(([0-9]{1,3}(?:[.,][0-9]{3})+|[0-9]{4,})(?:[.,][0-9]{2})?)/i,
    // Patrón 4: PRECIO: seguido de valor
    /PRECIO\s*:?\s*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2})?)/i,
    // Patrón 5: USD o DÓLARES seguido de valor
    /(?:USD|DOLARES?)\s*[:\$]?\s*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2})?)/i,
    // Patrón 6: Formato específico con $
    /\$\s*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2})?)/g
  ]
  
  // Probar cada patrón específico
  for (let i = 0; i < patronesEspecificos.length; i++) {
    const patron = patronesEspecificos[i]
    console.log(`💰 Probando patrón ${i + 1}: ${patron}`)
    
    const match = t.match(patron)
    console.log(`💰 Resultado match:`, match)
    
    if (match && match[1]) {
      const valorNormalizado = normalizarNumeroMoneda(match[1])
      const numeroValue = parseFloat(valorNormalizado)
      
      // Validar que sea un valor razonable para un contrato inmobiliario
      if (numeroValue > 100 && numeroValue < 10000000) {
        console.log(`💰 ✅ VALOR ENCONTRADO con patrón ${i + 1}: ${valorNormalizado}`)
        return valorNormalizado
      } else {
        console.log(`💰 ⚠️ Valor fuera de rango razonable: ${numeroValue}`)
      }
    }
  }
  
  // Patrón de respaldo: buscar cualquier número que pueda ser el valor
  console.log('💰 Probando patrones de respaldo...')
  
  const patronesRespaldo = [
    // Números con formato de dinero (más de 4 dígitos + decimales)
    /([0-9]{4,}[.,][0-9]{2})/g,
    // Números grandes separados por comas o puntos
    /([0-9]{1,3}(?:[.,][0-9]{3})+(?:[.,][0-9]{2})?)/g,
    // Números grandes (más de 10000)
    /([0-9]{5,})/g
  ]
  
  const numerosCandidatos = []
  
  for (const patron of patronesRespaldo) {
    const matches = [...t.matchAll(patron)]
    for (const match of matches) {
      const numero = parseFloat(normalizarNumeroMoneda(match[1]))
      if (numero > 1000 && numero < 10000000) { // Rango razonable para inmuebles
        const textoNorm = normalizarNumeroMoneda(match[1])
        numerosCandidatos.push({ texto: textoNorm, valor: numero })
        console.log(`💰 Número candidato: ${textoNorm} = ${numero}`)
      }
    }
  }
  
  // Si encontramos candidatos, tomar el más grande
  if (numerosCandidatos.length > 0) {
    numerosCandidatos.sort((a, b) => b.valor - a.valor)
    const mejorCandidato = numerosCandidatos[0]
    console.log(`💰 VALOR ENCONTRADO (respaldo): ${mejorCandidato.texto} = ${mejorCandidato.valor}`)
    return mejorCandidato.texto
  }
  
  console.log('💰 No se encontró valor del contrato, usando 0.00')
  return '0.00'
}

/**
 * Extrae datos de personas (vendedores y compradores)
 */
const extraerPersonas = (texto: string): { vendedor: any; compradores: any[]; vendedores: any[] } => {
  // Buscar secciones de vendedor y compradores
  const seccionVendedor = extraerSeccionVendedor(texto)
  const seccionCompradores = extraerSeccionCompradores(texto)

  // Varios vendedores: segmentar por NATURAL en la sección vendedor (si existiera más de uno)
  const vendedores: any[] = []
  if (seccionVendedor) {
    const indices: number[] = []
    const re = /\bNATURAL\b/g
    let m: RegExpExecArray | null
    while ((m = re.exec(seccionVendedor)) !== null) indices.push(m.index)
    if (indices.length > 1) {
      for (let i = 0; i < indices.length; i++) {
        const inicio = indices[i]
        const fin = i === indices.length - 1 ? seccionVendedor.length : indices[i+1]
        const bloque = seccionVendedor.substring(inicio, fin)
        vendedores.push(parsearPersona(bloque, 'VENDEDOR'))
      }
    } else {
      vendedores.push(parsearPersona(seccionVendedor, 'VENDEDOR'))
    }
  }

  const vendedor = vendedores[0] || parsearPersona(seccionVendedor, 'VENDEDOR')
  const compradores = parsearCompradores(seccionCompradores)
  
  return { vendedor, compradores, vendedores }
}

const extraerSeccionVendedor = (texto: string): string => {
  console.log('👤 NUEVA VERSIÓN - Extrayendo sección de vendedor...')
  
  // Buscar patrón directo: Natural + Nombre + VENDEDOR
  const patronesVendedor = [
    // Patrón para encontrar vendedor en el formato real
    /Natural[\s\S]*?VENDEDOR[\s\S]*?(?=A FAVOR DE|Natural.*?COMPRADOR)/i,
    // Buscar desde el inicio hasta A FAVOR DE
    /[\s\S]*?VENDEDOR[\s\S]*?(?=A FAVOR DE)/i,
    // Buscar todo hasta que aparezca COMPRADOR
    /[\s\S]*?VENDEDOR[\s\S]*?(?=COMPRADOR)/i
  ]
  
  for (let i = 0; i < patronesVendedor.length; i++) {
    const patron = patronesVendedor[i]
    console.log(`👤 Probando patrón vendedor ${i + 1}`)
    const match = texto.match(patron)
    if (match && match[0].length > 50) {
      console.log(`👤 Sección vendedor encontrada:`, match[0].substring(0, 300))
      return match[0]
    }
  }
  
  console.log('👤 No se encontró sección de vendedor')
  return ''
}

const extraerSeccionCompradores = (texto: string): string => {
  console.log('👥 Extrayendo sección de compradores...')
  
  // Buscar desde "A FAVOR DE" o "COMPRADOR" hasta el final o próxima sección
  const patrones = [
    /A FAVOR DE[\s\S]*?(?=UBICACION|CUANTIA|Provincia|PROVINCIA|DESCRIPCION|$)/i,
    /COMPRADOR[\s\S]*?(?=UBICACION|CUANTIA|Provincia|PROVINCIA|DESCRIPCION|$)/i,
    // Buscar desde A FAVOR DE hasta UBICACION
    /A FAVOR DE[\s\S]*?(?=UBICACION)/i,
    // Buscar toda la información después de A FAVOR DE
    /A FAVOR DE[\s\S]*$/i
  ]
  
  for (let i = 0; i < patrones.length; i++) {
    const patron = patrones[i]
    console.log(`👥 Probando patrón comprador ${i + 1}`)
    const match = texto.match(patron)
    if (match && match[0].length > 10) {
      console.log(`👥 Sección compradores encontrada (${match[0].length} chars):`, match[0])
      return match[0]
    }
  }
  
  console.log('👥 No se encontró sección de compradores')
  return ''
}

const parsearPersona = (seccion: string, calidad: string): any => {
  console.log(`👤 NUEVA VERSIÓN - Parseando persona con calidad: ${calidad}`)
  console.log(`👤 Sección completa:`, seccion)
  
  // Extraer cédula o pasaporte
  let cedula = '0000000000'
  let nacionalidad = 'ECUATORIANA'
  
  // Buscar cédula ecuatoriana (permitiendo saltos/espacios/cortes)
  const cedulaMatch = seccion.match(/C[ÉE]DULA[:\s]*([0-9\.\-\s]{10,})/i)
  if (cedulaMatch) {
    const soloDigitos = cedulaMatch[1].replace(/\D/g, '')
    if (soloDigitos.length >= 10) cedula = soloDigitos.substring(0, 10)
    console.log(`👤 Cédula ecuatoriana encontrada: ${cedula}`)
  } else {
    // Buscar pasaporte extranjero
    const pasaporteMatch = seccion.match(/PASAPORTE[:\s]*([A-Z0-9\-\s]{4,20}?)(?=\s+(?:ECUATORIANA|ALEMANA|AMERICANA|COLOMBIANA|PERUANA|VENEZOLANA|ARGENTINA|CHILENA|BRASILENA|NACIONALIDAD|CALIDAD|COMPRADOR|VENDEDOR|PERSONA|QUE|REPRESENTA|$))/i)
    if (pasaporteMatch) {
      cedula = pasaporteMatch[1].replace(/[^A-Z0-9]/g, '')
      console.log(`👤 Pasaporte encontrado: ${cedula}`)
      
      // Detectar nacionalidad
      if (seccion.includes('ALEMANA')) nacionalidad = 'ALEMANA'
      else if (seccion.includes('AMERICANA')) nacionalidad = 'AMERICANA'
      else if (seccion.includes('COLOMBIANA')) nacionalidad = 'COLOMBIANA'
      else nacionalidad = 'EXTRANJERA'
    }
  }
  
  // Extraer nombre - buscar después de "Natural" hasta antes de "REPRESENTADO" o "POR"
  let nombreCompleto = 'NO_EXTRAIDO NO_EXTRAIDO'
  
  const patronesNombre: RegExp[] = [
    // Buscar después de Natural hasta REPRESENTADO o POR
    /NATURAL\s+([A-ZÑ\s]+?)(?=\s+(?:REPRESENTADO\s+POR|REPRESENTADO|POR\s+ESTIPULACION|POR|CEDULA|CÉDULA|PASAPORTE|DOCUMENTO|CALIDAD|NACIONALIDAD|COMPRADOR|VENDEDOR))/i,
    // Buscar nombres largos en mayúsculas (3+ palabras) - CON FLAG GLOBAL
    /([A-ZÑ]+\s+[A-ZÑ]+\s+[A-ZÑ]+(?:\s+[A-ZÑ]+)*)/g
  ]
  
  for (let i = 0; i < patronesNombre.length; i++) {
    const patron = patronesNombre[i]
    console.log(`👤 Probando patrón nombre ${i + 1}`)
    // Asegurar que matchAll reciba un regex con flag global
    const regexGlobal = new RegExp(patron.source, patron.flags.includes('g') ? patron.flags : patron.flags + 'g')
    const matches = [...seccion.matchAll(regexGlobal)]
    
    for (const match of matches) {
      const candidato = match[1] || match[0]
      // Filtrar palabras que no son nombres
      if (candidato && candidato.length > 4 && 
          !candidato.includes('REPRESENTADO') &&
          !candidato.includes('CEDULA') &&
          !candidato.includes('PASAPORTE') &&
          !candidato.includes('ECUATORIA') &&
          !candidato.includes('VENDEDOR') &&
          !candidato.includes('COMPRADOR')) {
        nombreCompleto = candidato.trim()
        console.log(`👤 Nombre encontrado: "${nombreCompleto}"`)
        break
      }
    }
    if (nombreCompleto !== 'NO_EXTRAIDO NO_EXTRAIDO') break
  }
  
  // Separar nombres y apellidos (formato ecuatoriano: Apellido1 Apellido2 Nombre1 Nombre2)
  const palabras = nombreCompleto.trim().split(/\s+/)
  let nombres = 'NO_EXTRAIDO'
  let apellidos = 'NO_EXTRAIDO'
  
  if (palabras.length >= 4) {
    apellidos = palabras.slice(0, 2).join(' ')
    nombres = palabras.slice(2).join(' ')
  } else if (palabras.length >= 3) {
    apellidos = palabras[0]
    nombres = palabras.slice(1).join(' ')
  } else if (palabras.length >= 2) {
    apellidos = palabras[0]
    nombres = palabras[1]
  }
  
  console.log(`👤 RESULTADO FINAL: ${nombres} ${apellidos} (${cedula}) - ${nacionalidad}`)
  
  return {
    nombres: nombres || 'NO_EXTRAIDO',
    apellidos: apellidos || 'NO_EXTRAIDO', 
    cedula,
    nacionalidad,
    calidad,
    tipoInterviniente: 'POR SUS PROPIOS DERECHOS',
    esPersonaJuridica: false
  }
}

const parsearCompradores = (seccion: string): any[] => {
  // Cortar la sección desde "A FAVOR DE" para evitar arrastre de vendedor
  const inicioAFavor = seccion.indexOf('A FAVOR DE')
  const texto = inicioAFavor >= 0 ? seccion.substring(inicioAFavor) : seccion

  // Identificar bloques por filas de la tabla: cada "NATURAL" abre un comprador
  const indiceNaturales: number[] = []
  const regexNatural = /\bNATURAL\b/g
  let m: RegExpExecArray | null
  while ((m = regexNatural.exec(texto)) !== null) {
    indiceNaturales.push(m.index)
  }

  // Si no hay múltiples NATURAL, fallback a separar por documentos
  if (indiceNaturales.length <= 1) {
    const cedulaPatron = /C[ÉE]DULA[:\s]*([0-9\.\-\s]{10,})/gi
    const pasaportePatron = /PASAPORTE[:\s]*([A-Z0-9\-\s]{4,20}?)(?=\s+(?:ECUATORIANA|ALEMANA|AMERICANA|COLOMBIANA|PERUANA|VENEZOLANA|ARGENTINA|CHILENA|BRASILENA|NACIONALIDAD|CALIDAD|COMPRADOR|VENDEDOR|PERSONA|QUE|REPRESENTA|$))/gi
    const cedulaMatches = [...texto.matchAll(cedulaPatron)]
    const pasaporteMatches = [...texto.matchAll(pasaportePatron)]
    if (cedulaMatches.length === 0 && pasaporteMatches.length === 0) {
      return [parsearPersona(texto, 'COMPRADOR')]
    }
    const compradores: any[] = []
    const todosDocs = [
      ...cedulaMatches.map(m => ({ index: m.index || 0, len: m[0].length })),
      ...pasaporteMatches.map(m => ({ index: m.index || 0, len: m[0].length }))
    ].sort((a,b) => a.index - b.index)
    for (let i = 0; i < todosDocs.length; i++) {
      const inicio = i === 0 ? 0 : todosDocs[i-1].index + todosDocs[i-1].len
      const fin = i === todosDocs.length - 1 ? texto.length : todosDocs[i+1].index
      const subseccion = texto.substring(inicio, fin)
      compradores.push(parsearPersona(subseccion, 'COMPRADOR'))
    }
    return compradores
  }

  // Construir compradores por bloques NATURAL ... hasta el siguiente NATURAL o fin
  const compradores: any[] = []
  for (let i = 0; i < indiceNaturales.length; i++) {
    const inicio = indiceNaturales[i]
    const fin = i === indiceNaturales.length - 1 ? texto.length : indiceNaturales[i+1]
    const bloque = texto.substring(inicio, fin)
    compradores.push(parsearPersona(bloque, 'COMPRADOR'))
  }
  return compradores
}

/**
 * Extrae ubicación real del texto - VERSIÓN MEJORADA
 */
const extraerUbicacionReal = (texto: string): { provincia: string; canton: string; parroquia: string } => {
  console.log('📍 Extrayendo ubicación...')
  console.log('📍 Texto para buscar ubicación (últimos 1000 chars):', texto.substring(Math.max(0, texto.length - 1000)))
  
  // Patrones más específicos para extractos ecuatorianos
  const patronesProvincia = [
    /PROVINCIA[:\s]*([A-Z\s]+?)(?=\s+CANTON|\s+CANTÓN|\s+Canton|$)/i,
    /Provincia[:\s]*([A-Z\s]+?)(?=\s+Canton|\s+Cantón|$)/i,
    // Buscar en formato tabla: PICHINCHA    QUITO    IÑAQUITO
    /PICHINCHA|GUAYAS|AZUAY|TUNGURAHUA|IMBABURA|MANABI|EL ORO|LOJA|COTOPAXI|CHIMBORAZO|BOLIVAR|CANAR|CARCHI|ESMERALDAS|GALAPAGOS|LOS RIOS|MORONA SANTIAGO|NAPO|ORELLANA|PASTAZA|SANTA ELENA|SANTO DOMINGO|SUCUMBIOS|ZAMORA CHINCHIPE/i,
    // Buscar en contexto de ubicación
    /UBICACION[\s\S]*?(PICHINCHA|GUAYAS|AZUAY|TUNGURAHUA|IMBABURA)/i
  ]
  
  const patronesCanton = [
    /CANTON[:\s]*([A-Z\s]+?)(?=\s+PARROQUIA|\s+Parroquia|\s+[A-Z]{2,}|\s*$)/i,
    /CANTÓN[:\s]*([A-Z\s]+?)(?=\s+PARROQUIA|\s+Parroquia|\s+[A-Z]{2,}|\s*$)/i,
    /Canton[:\s]*([A-Z\s]+?)(?=\s+Parroquia|\s+[A-Z]{2,}|\s*$)/i,
    // Cantones conocidos principales
    /\b(QUITO|GUAYAQUIL|CUENCA|AMBATO|IBARRA|PORTOVIEJO|MACHALA|LOJA|RIOBAMBA|LATACUNGA|TULCAN|ESMERALDAS|BABAHOYO|MACAS|TENA|NUEVA LOJA|PUYO|SANTA ELENA|SANTO DOMINGO|ZAMORA)\b/i
  ]
  
  const patronesParroquia = [
    /PARROQUIA[:\s]*([A-ZÑ\s]+?)(?=\s+[A-Z]{4,}|\s*$)/i,
    /Parroquia[:\s]*([A-ZÑ\s]+?)(?=\s+[A-Z]{4,}|\s*$)/i,
    // Buscar parroquias comunes de Quito
    /\b(IÑAQUITO|RUMIPAMBA|KENNEDY|MARISCAL SUCRE|BELISARIO QUEVEDO|LA MAGDALENA|SAN JUAN|ITCHIMBIA|CENTRO HISTORICO|CHILLOGALLO|QUITUMBE|CALDERON|CONOCOTO|CUMBAYA|TUMBACO|PUEMBO|PIFO|YARUQUI|CHECA|EL QUINCHE|GUAYLLABAMBA|LLANO CHICO|ZAMBIZA|NAYÓN|ZÁMBIZA)\b/i
  ]
  
  let provincia = 'NO_EXTRAIDA'
  let canton = 'NO_EXTRAIDO'
  let parroquia = 'NO_EXTRAIDA'
  
  // Extraer provincia
  for (let i = 0; i < patronesProvincia.length; i++) {
    const patron = patronesProvincia[i]
    console.log(`📍 Probando patrón provincia ${i + 1}:`, patron)
    const match = texto.match(patron)
    console.log(`📍 Match provincia:`, match)
    if (match) {
      if (match[1]) {
        provincia = match[1].trim()
      } else if (match[0]) {
        provincia = match[0].trim()
      }
      if (provincia && provincia !== 'NO_EXTRAIDA') {
        console.log(`📍 Provincia encontrada: "${provincia}"`)
        break
      }
    }
  }
  
  // Extraer cantón
  for (let i = 0; i < patronesCanton.length; i++) {
    const patron = patronesCanton[i]
    console.log(`📍 Probando patrón cantón ${i + 1}:`, patron)
    const match = texto.match(patron)
    console.log(`📍 Match cantón:`, match)
    if (match) {
      if (match[1]) {
        canton = match[1].trim()
      } else if (match[0]) {
        canton = match[0].trim()
      }
      if (canton && canton !== 'NO_EXTRAIDO') {
        console.log(`📍 Cantón encontrado: "${canton}"`)
        break
      }
    }
  }
  
  // Extraer parroquia
  for (let i = 0; i < patronesParroquia.length; i++) {
    const patron = patronesParroquia[i]
    console.log(`📍 Probando patrón parroquia ${i + 1}:`, patron)
    const match = texto.match(patron)
    console.log(`📍 Match parroquia:`, match)
    if (match) {
      if (match[1]) {
        parroquia = match[1].trim()
      } else if (match[0]) {
        parroquia = match[0].trim()
      }
      if (parroquia && parroquia !== 'NO_EXTRAIDA') {
        console.log(`📍 Parroquia encontrada: "${parroquia}"`)
        break
      }
    }
  }
  
  console.log(`📍 Ubicación final: ${provincia} / ${canton} / ${parroquia}`)
  
  return { provincia, canton, parroquia }
}

/**
 * Extrae datos de la notaría
 */
const extraerDatosNotaria = (texto: string): { nombre: string; numero: string } => {
  const notariaMatch = texto.match(/NOTARIA[:\s]+([A-Z\s]+)(?=DEL CANTON|$)/i)
  const numeroMatch = texto.match(/NOTARIA[:\s]+([A-Z\s]*[0-9]+[A-Z\s]*)/i)
  
  return {
    nombre: notariaMatch ? notariaMatch[1].trim() : 'NO_EXTRAIDA',
    numero: numeroMatch ? numeroMatch[1].trim() : 'NO_EXTRAIDO'
  }
}

/**
 * Detecta la relación entre compradores
 */
const detectarRelacionCompradores = (compradores: any[]): {
  sonConyuges: boolean
  tipoRelacion?: string
  observaciones?: string
} => {
  // Por defecto: independientes
  const resultadoBase = {
    sonConyuges: false,
    tipoRelacion: compradores.length < 2 ? 'COMPRADOR_UNICO' : 'INDEPENDIENTES',
    observaciones: undefined as string | undefined
  }

  // Solo marcar cónyuges si el texto explícitamente lo dice en algún campo
  // Este chequeo se hará a nivel de texto original en el futuro; por ahora, mantenemos independientes
  return resultadoBase
}

/**
 * Valida que los datos extraídos sean coherentes
 */
export const validarDatosExtraidos = (datos: DatosExtractoReal): {
  esValido: boolean
  errores: string[]
  advertencias: string[]
} => {
  const errores: string[] = []
  const advertencias: string[] = []
  
  if (!datos.escritura || datos.escritura === 'NO_EXTRAIDO') {
    errores.push('Número de escritura no encontrado')
  }
  
  if (!datos.vendedor.nombres || datos.vendedor.nombres === 'NO_EXTRAIDO') {
    advertencias.push('Datos del vendedor requieren revisión manual')
  }
  
  if (!datos.compradores || datos.compradores.length === 0) {
    errores.push('No se encontraron compradores')
  }
  
  if (datos.confianzaOCR && datos.confianzaOCR < 0.6) {
    advertencias.push(`Confianza OCR baja: ${(datos.confianzaOCR * 100).toFixed(1)}%`)
  }
  
  return {
    esValido: errores.length === 0,
    errores,
    advertencias
  }
}

export default procesarExtractoNotarialReal;