import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export class CurrencyUtils {
  
  // Formatear valor monetario
  static formatCurrency(
    value: number, 
    currency: 'USD' | 'EUR' = 'USD',
    locale: 'es-EC' | 'en-US' = 'es-EC'
  ): string {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(value);
  }

  // Formatear valor sin símbolo de moneda
  static formatNumber(
    value: number,
    locale: 'es-EC' | 'en-US' = 'es-EC'
  ): string {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(value);
  }

  // Parsear string a número
  static parseAmount(value: string): number {
    // Remover símbolos de moneda y espacios
    const cleaned = value
      .replace(/[$€,\s]/g, '')
      .replace(/\./g, '') // Remover puntos de miles
      .replace(/,/g, '.'); // Convertir coma decimal a punto
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Validar monto
  static validateAmount(
    value: number,
    options: {
      min?: number;
      max?: number;
      allowZero?: boolean;
    } = {}
  ): { isValid: boolean; error?: string } {
    const { min = 0.01, max = 10000000, allowZero = false } = options;
    
    if (!allowZero && value === 0) {
      return { isValid: false, error: 'El valor no puede ser cero' };
    }
    
    if (value < 0) {
      return { isValid: false, error: 'El valor no puede ser negativo' };
    }
    
    if (value < min) {
      return { isValid: false, error: `El valor mínimo es ${this.formatCurrency(min)}` };
    }
    
    if (value > max) {
      return { isValid: false, error: `El valor máximo es ${this.formatCurrency(max)}` };
    }
    
    // Validar máximo 2 decimales
    const decimals = (value.toString().split('.')[1] || '').length;
    if (decimals > 2) {
      return { isValid: false, error: 'Máximo 2 decimales permitidos' };
    }
    
    return { isValid: true };
  }

  // Convertir número a palabras (para documentos legales)
  static numberToWords(value: number, currency: 'USD' | 'EUR' = 'USD'): string {
    const integerPart = Math.floor(value);
    const decimalPart = Math.round((value - integerPart) * 100);
    
    const integerWords = this.convertIntegerToWords(integerPart);
    const currencyName = currency === 'USD' ? 'DÓLARES' : 'EUROS';
    
    if (decimalPart === 0) {
      return `${integerWords} ${currencyName} AMERICANOS`;
    } else {
      const decimalWords = this.convertIntegerToWords(decimalPart);
      return `${integerWords} ${currencyName} AMERICANOS CON ${decimalWords} CENTAVOS`;
    }
  }

  // Convertir entero a palabras en español
  private static convertIntegerToWords(num: number): string {
    if (num === 0) return 'CERO';
    
    const units = [
      '', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'
    ];
    
    const teens = [
      'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 
      'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'
    ];
    
    const tens = [
      '', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 
      'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'
    ];
    
    const hundreds = [
      '', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
      'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'
    ];
    
    if (num < 10) return units[num];
    
    if (num < 20) return teens[num - 10];
    
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const unit = num % 10;
      
      if (ten === 2 && unit > 0) {
        return `VEINTI${units[unit]}`;
      }
      
      return tens[ten] + (unit > 0 ? ` Y ${units[unit]}` : '');
    }
    
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      
      let result = hundred === 1 ? 'CIEN' : hundreds[hundred];
      if (remainder > 0) {
        result += ` ${this.convertIntegerToWords(remainder)}`;
      }
      
      return result;
    }
    
    if (num < 1000000) {
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;
      
      let result = '';
      if (thousand === 1) {
        result = 'MIL';
      } else {
        result = `${this.convertIntegerToWords(thousand)} MIL`;
      }
      
      if (remainder > 0) {
        result += ` ${this.convertIntegerToWords(remainder)}`;
      }
      
      return result;
    }
    
    if (num < 1000000000) {
      const million = Math.floor(num / 1000000);
      const remainder = num % 1000000;
      
      let result = '';
      if (million === 1) {
        result = 'UN MILLÓN';
      } else {
        result = `${this.convertIntegerToWords(million)} MILLONES`;
      }
      
      if (remainder > 0) {
        result += ` ${this.convertIntegerToWords(remainder)}`;
      }
      
      return result;
    }
    
    return 'NÚMERO DEMASIADO GRANDE';
  }

  // Calcular porcentaje de IVA (Ecuador = 12%)
  static calculateIVA(amount: number, rate: number = 0.12): {
    subtotal: number;
    iva: number;
    total: number;
  } {
    const subtotal = amount / (1 + rate);
    const iva = amount - subtotal;
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      iva: Math.round(iva * 100) / 100,
      total: amount
    };
  }

  // Formatear para documentos notariales
  static formatForDocument(
    amount: number,
    currency: 'USD' | 'EUR' = 'USD',
    includeWords: boolean = true
  ): string {
    const formatted = this.formatCurrency(amount, currency);
    
    if (includeWords) {
      const words = this.numberToWords(amount, currency);
      return `${formatted} (${words})`;
    }
    
    return formatted;
  }

  // Validar rangos típicos para diferentes tipos de operaciones
  static validateByOperationType(
    amount: number,
    operationType: 'COMPRAVENTA' | 'VEHICULO' | 'SOCIETARIO' | 'DONACION' | 'OTROS'
  ): { isValid: boolean; warning?: string; error?: string } {
    const ranges = {
      COMPRAVENTA: { min: 1000, max: 5000000, typical: [50000, 300000] },
      VEHICULO: { min: 500, max: 200000, typical: [8000, 50000] },
      SOCIETARIO: { min: 800, max: 10000000, typical: [800, 100000] },
      DONACION: { min: 100, max: 1000000, typical: [1000, 50000] },
      OTROS: { min: 100, max: 10000000, typical: [1000, 100000] }
    };
    
    const range = ranges[operationType];
    
    if (amount < range.min) {
      return {
        isValid: false,
        error: `Valor muy bajo para ${operationType}. Mínimo recomendado: ${this.formatCurrency(range.min)}`
      };
    }
    
    if (amount > range.max) {
      return {
        isValid: false,
        error: `Valor muy alto para ${operationType}. Máximo recomendado: ${this.formatCurrency(range.max)}`
      };
    }
    
    const [typicalMin, typicalMax] = range.typical;
    if (amount < typicalMin || amount > typicalMax) {
      return {
        isValid: true,
        warning: `Valor fuera del rango típico para ${operationType} (${this.formatCurrency(typicalMin)} - ${this.formatCurrency(typicalMax)})`
      };
    }
    
    return { isValid: true };
  }

  // Generar sugerencias de montos comunes
  static generateAmountSuggestions(operationType: string): number[] {
    const suggestions = {
      COMPRAVENTA: [50000, 80000, 120000, 150000, 200000, 300000],
      VEHICULO: [8000, 12000, 15000, 20000, 25000, 35000],
      SOCIETARIO: [800, 1000, 5000, 10000, 50000],
      DONACION: [1000, 5000, 10000, 25000, 50000],
      OTROS: [1000, 5000, 10000, 25000, 50000]
    };
    
    return suggestions[operationType as keyof typeof suggestions] || suggestions.OTROS;
  }

  // Formatear input mientras se escribe
  static formatInput(value: string): string {
    // Remover caracteres no numéricos excepto punto y coma
    let cleaned = value.replace(/[^\d.,]/g, '');
    
    // Convertir coma a punto para decimales
    cleaned = cleaned.replace(',', '.');
    
    // Permitir solo un punto decimal
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limitar decimales a 2
    if (parts[1] && parts[1].length > 2) {
      cleaned = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    // Formatear con separadores de miles
    const [integer, decimal] = cleaned.split('.');
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
  }
}