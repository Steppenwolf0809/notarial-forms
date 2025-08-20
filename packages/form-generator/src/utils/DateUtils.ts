import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

export class DateUtils {
  
  private static readonly ECUADOR_TIMEZONE = 'America/Guayaquil';
  
  private static readonly SPANISH_MONTHS = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  
  private static readonly SPANISH_DAYS = [
    'DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'
  ];

  // Formatos aceptados para fechas en español
  private static readonly SPANISH_FORMATS = [
    'DD/MM/YYYY',
    'DD-MM-YYYY',
    'DD [DE] MMMM [DEL] YYYY',
    'DD [DE] MMMM [DE] YYYY',
    'D [DE] MMMM [DEL] YYYY',
    'D [DE] MMMM [DE] YYYY',
    'DD [DE] MMM [DEL] YYYY',
    'DD [DE] MMM [DE] YYYY',
    'YYYY-MM-DD'
  ];

  // Parsear fecha en español
  static parseSpanishDate(dateString: string): Dayjs | null {
    if (!dateString || typeof dateString !== 'string') return null;
    
    // Normalizar texto
    const normalized = dateString
      .toUpperCase()
      .trim()
      .replace(/\s+/g, ' ');
    
    // Intentar parsear con diferentes formatos
    for (const format of this.SPANISH_FORMATS) {
      const parsed = dayjs(normalized, format, 'es', true);
      if (parsed.isValid()) {
        return parsed.tz(this.ECUADOR_TIMEZONE);
      }
    }
    
    // Intentar parseo manual para formatos complejos
    return this.parseComplexSpanishDate(normalized);
  }

  // Parsear fechas complejas en español
  private static parseComplexSpanishDate(dateString: string): Dayjs | null {
    // Patrón: "24 DE JUNIO DEL 2024"
    const complexPattern = /(\d{1,2})\s+DE\s+(\w+)\s+DEL?\s+(\d{4})/;
    const match = dateString.match(complexPattern);
    
    if (match) {
      const [, day, monthName, year] = match;
      const monthIndex = this.SPANISH_MONTHS.indexOf(monthName.toUpperCase());
      
      if (monthIndex !== -1) {
        const date = dayjs()
          .year(parseInt(year))
          .month(monthIndex)
          .date(parseInt(day))
          .tz(this.ECUADOR_TIMEZONE);
        
        if (date.isValid()) {
          return date;
        }
      }
    }
    
    return null;
  }

  // Formatear fecha para documentos notariales
  static formatForDocument(date: Dayjs | Date | string): string {
    const d = this.ensureDayjs(date);
    if (!d || !d.isValid()) return '';
    
    const dayNum = d.date();
    const monthName = this.SPANISH_MONTHS[d.month()];
    const year = d.year();
    
    return `${dayNum} DE ${monthName} DEL ${year}`;
  }

  // Formatear fecha estándar
  static formatStandard(date: Dayjs | Date | string): string {
    const d = this.ensureDayjs(date);
    if (!d || !d.isValid()) return '';
    
    return d.format('DD/MM/YYYY');
  }

  // Formatear fecha con día de la semana
  static formatWithDay(date: Dayjs | Date | string): string {
    const d = this.ensureDayjs(date);
    if (!d || !d.isValid()) return '';
    
    const dayName = this.SPANISH_DAYS[d.day()];
    const formatted = this.formatForDocument(d);
    
    return `${dayName}, ${formatted}`;
  }

  // Validar fecha
  static validateDate(
    dateString: string,
    options: {
      minDate?: Dayjs | Date | string;
      maxDate?: Dayjs | Date | string;
      allowFuture?: boolean;
      allowPast?: boolean;
    } = {}
  ): { isValid: boolean; error?: string; parsed?: Dayjs } {
    
    const parsed = this.parseSpanishDate(dateString);
    
    if (!parsed) {
      return {
        isValid: false,
        error: 'Formato de fecha no válido. Use DD/MM/YYYY o "DD DE MES DEL YYYY"'
      };
    }
    
    const {
      minDate,
      maxDate,
      allowFuture = true,
      allowPast = true
    } = options;
    
    const now = dayjs().tz(this.ECUADOR_TIMEZONE);
    
    // Validar futuro/pasado
    if (!allowFuture && parsed.isAfter(now, 'day')) {
      return {
        isValid: false,
        error: 'No se permiten fechas futuras'
      };
    }
    
    if (!allowPast && parsed.isBefore(now, 'day')) {
      return {
        isValid: false,
        error: 'No se permiten fechas pasadas'
      };
    }
    
    // Validar rango mínimo
    if (minDate) {
      const min = this.ensureDayjs(minDate);
      if (min && parsed.isBefore(min, 'day')) {
        return {
          isValid: false,
          error: `La fecha debe ser posterior a ${this.formatStandard(min)}`
        };
      }
    }
    
    // Validar rango máximo
    if (maxDate) {
      const max = this.ensureDayjs(maxDate);
      if (max && parsed.isAfter(max, 'day')) {
        return {
          isValid: false,
          error: `La fecha debe ser anterior a ${this.formatStandard(max)}`
        };
      }
    }
    
    return { isValid: true, parsed };
  }

  // Validaciones específicas para documentos notariales
  static validateNotarialDate(
    dateString: string,
    type: 'ESCRITURA' | 'OPERACION' | 'NACIMIENTO' | 'MATRIMONIO'
  ): { isValid: boolean; error?: string; warning?: string; parsed?: Dayjs } {
    
    const baseValidation = this.validateDate(dateString);
    if (!baseValidation.isValid) {
      return baseValidation;
    }
    
    const parsed = baseValidation.parsed!;
    const now = dayjs().tz(this.ECUADOR_TIMEZONE);
    
    switch (type) {
      case 'ESCRITURA':
        // Las escrituras no pueden ser futuras y no muy antiguas (1 año máximo)
        const oneYearAgo = now.subtract(1, 'year');
        
        if (parsed.isAfter(now, 'day')) {
          return {
            isValid: false,
            error: 'La fecha de escritura no puede ser futura'
          };
        }
        
        if (parsed.isBefore(oneYearAgo, 'day')) {
          return {
            isValid: true,
            warning: 'Fecha de escritura muy antigua (más de 1 año)',
            parsed
          };
        }
        break;
        
      case 'OPERACION':
        // Las operaciones pueden ser hasta 30 días en el futuro o pasado
        const thirtyDaysAgo = now.subtract(30, 'days');
        const thirtyDaysAhead = now.add(30, 'days');
        
        if (parsed.isBefore(thirtyDaysAgo, 'day')) {
          return {
            isValid: false,
            error: 'La fecha de operación no puede ser más de 30 días en el pasado'
          };
        }
        
        if (parsed.isAfter(thirtyDaysAhead, 'day')) {
          return {
            isValid: false,
            error: 'La fecha de operación no puede ser más de 30 días en el futuro'
          };
        }
        break;
        
      case 'NACIMIENTO':
        // Nacimientos: mínimo 18 años (mayoría de edad)
        const eighteenYearsAgo = now.subtract(18, 'years');
        const hundredYearsAgo = now.subtract(100, 'years');
        
        if (parsed.isAfter(now, 'day')) {
          return {
            isValid: false,
            error: 'La fecha de nacimiento no puede ser futura'
          };
        }
        
        if (parsed.isAfter(eighteenYearsAgo, 'day')) {
          return {
            isValid: false,
            error: 'La persona debe ser mayor de edad (18 años)'
          };
        }
        
        if (parsed.isBefore(hundredYearsAgo, 'day')) {
          return {
            isValid: true,
            warning: 'Fecha de nacimiento muy antigua (más de 100 años)',
            parsed
          };
        }
        break;
        
      case 'MATRIMONIO':
        // Matrimonios: no futuros, no muy antiguos
        const fiftyYearsAgo = now.subtract(50, 'years');
        
        if (parsed.isAfter(now, 'day')) {
          return {
            isValid: false,
            error: 'La fecha de matrimonio no puede ser futura'
          };
        }
        
        if (parsed.isBefore(fiftyYearsAgo, 'day')) {
          return {
            isValid: true,
            warning: 'Fecha de matrimonio muy antigua (más de 50 años)',
            parsed
          };
        }
        break;
    }
    
    return { isValid: true, parsed };
  }

  // Calcular edad
  static calculateAge(birthDate: Dayjs | Date | string, referenceDate?: Dayjs | Date | string): number {
    const birth = this.ensureDayjs(birthDate);
    const reference = referenceDate ? this.ensureDayjs(referenceDate) : dayjs().tz(this.ECUADOR_TIMEZONE);
    
    if (!birth || !reference || !birth.isValid() || !reference.isValid()) {
      return 0;
    }
    
    return reference.diff(birth, 'years');
  }

  // Obtener fecha actual en Ecuador
  static now(): Dayjs {
    return dayjs().tz(this.ECUADOR_TIMEZONE);
  }

  // Obtener fecha de hoy formateada
  static today(): string {
    return this.formatStandard(this.now());
  }

  // Obtener fecha de hoy para documentos
  static todayForDocument(): string {
    return this.formatForDocument(this.now());
  }

  // Convertir a formato ISO
  static toISO(date: Dayjs | Date | string): string {
    const d = this.ensureDayjs(date);
    return d && d.isValid() ? d.toISOString() : '';
  }

  // Comparar fechas
  static compare(date1: Dayjs | Date | string, date2: Dayjs | Date | string): number {
    const d1 = this.ensureDayjs(date1);
    const d2 = this.ensureDayjs(date2);
    
    if (!d1 || !d2 || !d1.isValid() || !d2.isValid()) return 0;
    
    if (d1.isBefore(d2)) return -1;
    if (d1.isAfter(d2)) return 1;
    return 0;
  }

  // Generar rango de años para selects
  static generateYearRange(startYear?: number, endYear?: number): Array<{ value: number; label: string }> {
    const currentYear = this.now().year();
    const start = startYear || currentYear - 100;
    const end = endYear || currentYear + 5;
    
    const years: Array<{ value: number; label: string }> = [];
    
    for (let year = end; year >= start; year--) {
      years.push({
        value: year,
        label: year.toString()
      });
    }
    
    return years;
  }

  // Sugerir fechas comunes
  static generateDateSuggestions(type: 'RECENT' | 'COMMON_BIRTH_YEARS' | 'COMMON_OPERATION'): string[] {
    const now = this.now();
    
    switch (type) {
      case 'RECENT':
        return [
          this.formatStandard(now),
          this.formatStandard(now.subtract(1, 'day')),
          this.formatStandard(now.subtract(1, 'week')),
          this.formatStandard(now.subtract(1, 'month'))
        ];
        
      case 'COMMON_BIRTH_YEARS':
        const commonBirthYears = [1960, 1970, 1980, 1990, 2000];
        return commonBirthYears.map(year => 
          this.formatStandard(dayjs().year(year).month(0).date(1))
        );
        
      case 'COMMON_OPERATION':
        return [
          this.formatStandard(now),
          this.formatStandard(now.add(1, 'day')),
          this.formatStandard(now.add(1, 'week')),
          this.formatStandard(now.add(1, 'month'))
        ];
        
      default:
        return [];
    }
  }

  // Utilidad privada para asegurar objeto Dayjs
  private static ensureDayjs(date: Dayjs | Date | string): Dayjs | null {
    if (!date) return null;
    
    if (dayjs.isDayjs(date)) {
      return date.isValid() ? date : null;
    }
    
    if (typeof date === 'string') {
      return this.parseSpanishDate(date);
    }
    
    const d = dayjs(date).tz(this.ECUADOR_TIMEZONE);
    return d.isValid() ? d : null;
  }

  // Validar si es día hábil (lunes a viernes)
  static isBusinessDay(date: Dayjs | Date | string): boolean {
    const d = this.ensureDayjs(date);
    if (!d) return false;
    
    const dayOfWeek = d.day();
    return dayOfWeek >= 1 && dayOfWeek <= 5; // Lunes = 1, Viernes = 5
  }

  // Obtener siguiente día hábil
  static getNextBusinessDay(date: Dayjs | Date | string): Dayjs | null {
    let d = this.ensureDayjs(date);
    if (!d) return null;
    
    do {
      d = d.add(1, 'day');
    } while (!this.isBusinessDay(d));
    
    return d;
  }

  // Formatear intervalo de fechas
  static formatDateRange(startDate: Dayjs | Date | string, endDate: Dayjs | Date | string): string {
    const start = this.ensureDayjs(startDate);
    const end = this.ensureDayjs(endDate);
    
    if (!start || !end) return '';
    
    return `${this.formatStandard(start)} - ${this.formatStandard(end)}`;
  }
}