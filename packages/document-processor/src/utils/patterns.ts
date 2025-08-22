import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/es';
import { FieldType, ExtractedField } from '../types';

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.locale('es');

export class EcuadorPatterns {
  static readonly cedula = /\b\d{10}\b/g;
  static readonly ruc = /\b\d{13}001\b/g;
  static readonly passport = /\b[A-Z0-9]{6,15}\b/g;
  static readonly plate = /\b[A-Z]{3}[-]?\d{3,4}\b/g;
  static readonly plateOld = /\b[A-Z]{2}[-]?\d{4,5}\b/g;
  static readonly phone = /\b(\+593|0)[0-9]{8,9}\b/g;
  static readonly email = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  
  // Date patterns for Ecuador
  static readonly dateSpanish = /\b\d{1,2}\s+DE\s+[A-ZÁÉÍÓÚÑ]+\s+DEL?\s+\d{4}\b/gi;
  static readonly dateNumeric = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g;
  static readonly dateSlashReverse = /\b\d{4}\/\d{1,2}\/\d{1,2}\b/g;
  static readonly dateDashReverse = /\b\d{4}-\d{1,2}-\d{1,2}\b/g;
  
  // Money and amounts
  static readonly amount = /\$\s*[\d,]+\.?\d*/g;
  static readonly amountWords = /\b(UN|DOS|TRES|CUATRO|CINCO|SEIS|SIETE|OCHO|NUEVE|DIEZ|ONCE|DOCE|TRECE|CATORCE|QUINCE|DIECISEIS|DIECISIETE|DIECIOCHO|DIECINUEVE|VEINTE|VEINTIUN|TREINTA|CUARENTA|CINCUENTA|SESENTA|SETENTA|OCHENTA|NOVENTA|CIEN|CIENTO|DOSCIENTOS|TRESCIENTOS|CUATROCIENTOS|QUINIENTOS|SEISCIENTOS|SETECIENTOS|OCHOCIENTOS|NOVECIENTOS|MIL|MILLON|MILLONES)\s+(DOLARES?|USD)\b/gi;
  
  // Names and titles
  static readonly personName = /\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,4}\b/g;
  static readonly nameFull = /\b[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]{2,50}\b/g;
  static readonly titles = /\b(DR|DRA|ING|ECON|AB|LIC|MSC|PHD|MD)\.\s*[A-ZÁÉÍÓÚÑ]/g;
  
  // Vehicle specific
  static readonly vehicleBrands = /\b(TOYOTA|CHEVROLET|NISSAN|HYUNDAI|KIA|FORD|MAZDA|MITSUBISHI|SUZUKI|VOLKSWAGEN|RENAULT|PEUGEOT|CITROEN|FIAT|BMW|MERCEDES|AUDI|VOLVO|JEEP|LAND\s+ROVER|SUBARU|ISUZU|DAIHATSU|GREAT\s+WALL|JAC|CHERY|GEELY|BYD|DFSK|FOTON|JMC|DONGFENG|CHANGHE|CHANA)\b/gi;
  static readonly engineNumber = /\b[A-Z0-9]{6,17}\b/g;
  static readonly chassisNumber = /\b[A-HJ-NPR-Z0-9]{17}\b/g;
  static readonly vehicleYear = /\b(19|20)\d{2}\b/g;
  
  // Legal entities
  static readonly companyTypes = /\b(CIA\.\s*LTDA|COMPAÑIA\s+LIMITADA|S\.A\.|SOCIEDAD\s+ANONIMA|FUNDACION|CORPORACION|COOPERATIVA|CONSORCIO)\b/gi;
  static readonly notaryNumbers = /(PRIMERA|SEGUNDA|TERCERA|CUARTA|QUINTA|SEXTA|SEPTIMA|OCTAVA|NOVENA|DECIMA|UNDECIMA|DUODECIMA|DECIMOTERCERA|DECIMOCUARTA|DECIMOQUINTA|DECIMOSEXTA|DECIMOSEPTIMA|DECIMOCTAVA|DECIMONOVENA|VIGESIMA)\s+NOTARIA/gi;
  
  // Locations in Ecuador
  static readonly provinces = /\b(AZUAY|BOLIVAR|CAÑAR|CARCHI|COTOPAXI|CHIMBORAZO|EL\s+ORO|ESMERALDAS|GUAYAS|IMBABURA|LOJA|LOS\s+RIOS|MANABI|MORONA\s+SANTIAGO|NAPO|PASTAZA|PICHINCHA|TUNGURAHUA|ZAMORA\s+CHINCHIPE|GALAPAGOS|SUCUMBIOS|ORELLANA|SANTO\s+DOMINGO|SANTA\s+ELENA)\b/gi;
  static readonly cantons = /\b(QUITO|GUAYAQUIL|CUENCA|AMBATO|MANTA|PORTOVIEJO|MACHALA|SANTO\s+DOMINGO|ELOY\s+ALFARO|LOJA|RIOBAMBA|ESMERALDAS|IBARRA|MILAGRO|LA\s+LIBERTAD|BABAHOYO|GUARANDA|TULCAN|LATACUNGA|PUYO|MACAS|TENA|NUEVA\s+LOJA|FRANCISCO\s+DE\s+ORELLANA|ZAMORA|AZOGUES|PASAJE|DAULE|SAMBORONDON|CAYAMBE|SANGOLQUI|OTAVALO|SALINAS)\b/gi;
  
  // Document specific - Patrones mejorados para números de escritura ecuatorianos
  static readonly escrituraNumber = /ESCRITURA\s+N[°º]?\s*[:\s]*(\d{4,18}P?\d{0,10})/gi;
  static readonly escrituraCompleteNumber = /(\d{11,18}P\d{4,6})/g;
  static readonly repertorioNumber = /REPERTORIO\s+N[°º]?\s*(\d+)/gi;
  static readonly folioNumber = /FOLIO\s+N[°º]?\s*(\d+)/gi;
  
  // Article 29 specific patterns
  static readonly articulo29 = /ARTICULO\s+29|ART\.\s*29|ARTICLE\s+29/gi;
  static readonly valorOperacion = /VALOR\s+DE\s+LA\s+OPERACION|VALOR\s+OPERACION|PRECIO\s+DE\s+VENTA/gi;
  static readonly formaPago = /FORMA\s+DE\s+PAGO|MODALIDAD\s+DE\s+PAGO|CONDICIONES\s+DE\s+PAGO/gi;
  
  // Address patterns - mejorados para direcciones ecuatorianas
  static readonly address = /\b(CALLE|AVENIDA|AV\.|PASAJE|SECTOR|BARRIO|CIUDADELA|CONJUNTO|URBANIZACION|VILLA|CONDOMINIOS?)\s+[A-ZÁÉÍÓÚÑ0-9\s\-\.]{5,50}/gi;
  static readonly addressNumber = /\b(N[°º]?\s*\d+[\-\d]*|#\s*\d+[\-\d]*|NUMERO\s+\d+)\b/gi;
  static readonly fullAddress = /(CALLE|AV\.|AVENIDA)\s+([A-ZÁÉÍÓÚÑ\s]+?)\s+N?[°º]?\s*(\d+[\-\d]*)\s+Y\s+(CALLE|AV\.|AVENIDA)?\s*([A-ZÁÉÍÓÚÑ\s]+)/gi;
  static readonly simpleAddress = /(CALLE|AVENIDA|AV\.)\s+([A-ZÁÉÍÓÚÑ\s]+?)\s+Y\s+([A-ZÁÉÍÓÚÑ\s]+)/gi;
  static readonly addressLocation = /(?:DIRECCION|UBICADO\s+EN|INMUEBLE\s+UBICADO\s+EN)[:\s]+([A-ZÁÉÍÓÚÑ\s\d\-\.]+)/gi;
  
  // Nationality patterns (common nationalities in Spanish text, emphasized Ecuadorian context)
  static readonly nationalityLabel = /\bNACIONALIDAD\b\s*[:\-]?\s*([A-ZÁÉÍÓÚÑ\s]{3,30})/gi;
  static readonly nationalityWords = /\b(ECUATORIANO|ECUATORIANA|COLOMBIANO|COLOMBIANA|PERUANO|PERUANA|VENEZOLANO|VENEZOLANA|CHILENO|CHILENA|ARGENTINO|ARGENTINA|ESPAÑOL|ESPAÑOLA|ESTADOUNIDENSE|MEXICANO|MEXICANA|BRASILEÑO|BRASILEÑA|ITALIANO|ITALIANA|FRANCES|FRANCESA|ALEMAN|ALEMANA|CUBANO|CUBANA|URUGUAYO|URUGUAYA|PARAGUAYO|PARAGUAYA|BOLIVIANO|BOLIVIANA)\b/gi;
}

export class PatternValidator {
  static validateCedula(cedula: string): boolean {
    if (!/^\d{10}$/.test(cedula)) return false;
    
    const digits = cedula.split('').map(Number);
    const province = parseInt(cedula.substring(0, 2));
    
    if (province < 1 || province > 24) return false;
    
    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      let product = digits[i] * coefficients[i];
      if (product >= 10) product -= 9;
      sum += product;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[9];
  }

  static validateRUC(ruc: string): boolean {
    if (!/^\d{13}001$/.test(ruc)) return false;
    
    const cedula = ruc.substring(0, 10);
    return this.validateCedula(cedula);
  }

  static validatePlate(plate: string): boolean {
    const cleaned = plate.replace('-', '');
    return /^[A-Z]{3}\d{3,4}$/.test(cleaned) || /^[A-Z]{2}\d{4,5}$/.test(cleaned);
  }

  static validatePhone(phone: string): boolean {
    return /^(\+593|0)[0-9]{8,9}$/.test(phone);
  }

  static validateEmail(email: string): boolean {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(email);
  }

  static validatePassport(passport: string): boolean {
    return /^[A-Z0-9]{6,15}$/.test(passport.toUpperCase());
  }

  static validateChassisNumber(chassis: string): boolean {
    // VIN validation (17 characters, excluding I, O, Q)
    return /^[A-HJ-NPR-Z0-9]{17}$/.test(chassis.toUpperCase());
  }

  static validateYear(year: string): boolean {
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    return yearNum >= 1900 && yearNum <= currentYear + 1;
  }
}

export class DateParser {
  private static readonly spanishMonths = {
    'ENERO': 1, 'FEBRERO': 2, 'MARZO': 3, 'ABRIL': 4, 'MAYO': 5, 'JUNIO': 6,
    'JULIO': 7, 'AGOSTO': 8, 'SEPTIEMBRE': 9, 'OCTUBRE': 10, 'NOVIEMBRE': 11, 'DICIEMBRE': 12
  };

  static parseSpanishDate(dateStr: string): Date | null {
    try {
      const cleaned = dateStr.replace(/\s+/g, ' ').trim().toUpperCase();
      
      // Pattern: "24 DE JUNIO DEL 2025"
      const match = cleaned.match(/(\d{1,2})\s+DE\s+([A-ZÁÉÍÓÚÑ]+)\s+DEL?\s+(\d{4})/);
      
      if (match) {
        const [, day, monthName, year] = match;
        const monthNum = this.spanishMonths[monthName as keyof typeof this.spanishMonths];
        
        if (monthNum) {
          const date = new Date(parseInt(year), monthNum - 1, parseInt(day));
          return isNaN(date.getTime()) ? null : date;
        }
      }
      
      // Try with dayjs as fallback
      const parsed = dayjs(cleaned, ['DD DE MMMM DEL YYYY', 'DD DE MMMM DE YYYY'], 'es');
      return parsed.isValid() ? parsed.toDate() : null;
    } catch {
      return null;
    }
  }

  static parseNumericDate(dateStr: string): Date | null {
    try {
      // Try different formats
      const formats = ['DD/MM/YYYY', 'D/M/YYYY', 'YYYY/MM/DD', 'YYYY-MM-DD'];
      
      for (const format of formats) {
        const parsed = dayjs(dateStr, format);
        if (parsed.isValid()) {
          return parsed.toDate();
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }

  static parseAnyDate(dateStr: string): Date | null {
    return this.parseSpanishDate(dateStr) || this.parseNumericDate(dateStr);
  }
}

export class FieldExtractor {
  static extractAllFields(text: string): ExtractedField[] {
    const fields: ExtractedField[] = [];
    
    // Extract cédulas
    const cedulas = Array.from(text.matchAll(EcuadorPatterns.cedula));
    cedulas.forEach(match => {
      const value = match[0];
      if (PatternValidator.validateCedula(value)) {
        fields.push({
          fieldName: 'cedula',
          value,
          confidence: 0.95,
          type: FieldType.CEDULA,
          validationStatus: 'valid'
        });
      }
    });

    // Extract RUCs
    const rucs = Array.from(text.matchAll(EcuadorPatterns.ruc));
    rucs.forEach(match => {
      const value = match[0];
      if (PatternValidator.validateRUC(value)) {
        fields.push({
          fieldName: 'ruc',
          value,
          confidence: 0.95,
          type: FieldType.RUC,
          validationStatus: 'valid'
        });
      }
    });

    // Extract plates
    const plates = Array.from(text.matchAll(EcuadorPatterns.plate));
    plates.forEach(match => {
      const value = match[0];
      if (PatternValidator.validatePlate(value)) {
        fields.push({
          fieldName: 'placa',
          value,
          confidence: 0.9,
          type: FieldType.PLATE,
          validationStatus: 'valid'
        });
      }
    });

    // Extract dates
    const spanishDates = Array.from(text.matchAll(EcuadorPatterns.dateSpanish));
    spanishDates.forEach(match => {
      const value = match[0];
      const date = DateParser.parseSpanishDate(value);
      if (date) {
        fields.push({
          fieldName: 'fecha',
          value,
          confidence: 0.9,
          type: FieldType.DATE,
          validationStatus: 'valid'
        });
      }
    });

    // Extract amounts
    const amounts = Array.from(text.matchAll(EcuadorPatterns.amount));
    amounts.forEach(match => {
      const value = match[0];
      fields.push({
        fieldName: 'monto',
        value,
        confidence: 0.85,
        type: FieldType.AMOUNT,
        validationStatus: 'unknown'
      });
    });

    // Extract vehicle brands
    const brands = Array.from(text.matchAll(EcuadorPatterns.vehicleBrands));
    brands.forEach(match => {
      const value = match[0];
      fields.push({
        fieldName: 'marca_vehiculo',
        value: value.toUpperCase(),
        confidence: 0.9,
        type: FieldType.VEHICLE_BRAND,
        validationStatus: 'valid'
      });
    });

    // Extract phones
    const phones = Array.from(text.matchAll(EcuadorPatterns.phone));
    phones.forEach(match => {
      const value = match[0];
      if (PatternValidator.validatePhone(value)) {
        fields.push({
          fieldName: 'telefono',
          value,
          confidence: 0.85,
          type: FieldType.PHONE,
          validationStatus: 'valid'
        });
      }
    });

    // Extract emails
    const emails = Array.from(text.matchAll(EcuadorPatterns.email));
    emails.forEach(match => {
      const value = match[0];
      if (PatternValidator.validateEmail(value)) {
        fields.push({
          fieldName: 'email',
          value,
          confidence: 0.9,
          type: FieldType.EMAIL,
          validationStatus: 'valid'
        });
      }
    });

    // Extract nationality via labeled pattern first
    const natLabeled = Array.from(text.matchAll(EcuadorPatterns.nationalityLabel));
    natLabeled.forEach(match => {
      const value = (match[1] || '').trim();
      if (value) {
        fields.push({
          fieldName: 'nacionalidad',
          value,
          confidence: 0.88,
          type: FieldType.NATIONALITY,
          validationStatus: 'valid'
        });
      }
    });

    // Extract standalone nationality words (avoid duplicates if labeled exists)
    if (natLabeled.length === 0) {
      const natWords = Array.from(text.matchAll(EcuadorPatterns.nationalityWords));
      natWords.forEach(match => {
        const value = (match[0] || '').trim();
        if (value) {
          fields.push({
            fieldName: 'nacionalidad',
            value,
            confidence: 0.8,
            type: FieldType.NATIONALITY,
            validationStatus: 'unknown'
          });
        }
      });
    }

    return fields;
  }

  static extractSpecificField(text: string, fieldType: FieldType, pattern: RegExp): ExtractedField[] {
    const fields: ExtractedField[] = [];
    const matches = Array.from(text.matchAll(pattern));
    
    matches.forEach(match => {
      const value = match[0];
      let isValid = false;
      
      switch (fieldType) {
        case FieldType.CEDULA:
          isValid = PatternValidator.validateCedula(value);
          break;
        case FieldType.RUC:
          isValid = PatternValidator.validateRUC(value);
          break;
        case FieldType.PLATE:
          isValid = PatternValidator.validatePlate(value);
          break;
        case FieldType.PHONE:
          isValid = PatternValidator.validatePhone(value);
          break;
        case FieldType.EMAIL:
          isValid = PatternValidator.validateEmail(value);
          break;
        default:
          isValid = true;
      }
      
      if (isValid) {
        fields.push({
          fieldName: fieldType,
          value,
          confidence: this.getConfidenceForFieldType(fieldType),
          type: fieldType,
          validationStatus: 'valid'
        });
      }
    });
    
    return fields;
  }

  private static getConfidenceForFieldType(fieldType: FieldType): number {
    const confidenceMap: Record<FieldType, number> = {
      [FieldType.CEDULA]: 0.95,
      [FieldType.RUC]: 0.95,
      [FieldType.PLATE]: 0.9,
      [FieldType.DATE]: 0.9,
      [FieldType.PHONE]: 0.85,
      [FieldType.EMAIL]: 0.9,
      [FieldType.AMOUNT]: 0.85,
      [FieldType.VEHICLE_BRAND]: 0.9,
      [FieldType.NAME]: 0.8,
      [FieldType.ADDRESS]: 0.75,
      [FieldType.PASSPORT]: 0.85,
      [FieldType.VEHICLE_MODEL]: 0.8,
      [FieldType.VEHICLE_YEAR]: 0.9,
      [FieldType.VEHICLE_ENGINE]: 0.85,
      [FieldType.VEHICLE_CHASSIS]: 0.9,
      [FieldType.LOCATION]: 0.8,
      [FieldType.NOTARY_NAME]: 0.85,
      [FieldType.VALOR_OPERACION]: 0.9,
      [FieldType.FORMA_PAGO]: 0.8,
      [FieldType.NATIONALITY]: 0.88,
      [FieldType.OTHER]: 0.7
    };
    
    return confidenceMap[fieldType] || 0.7;
  }
}