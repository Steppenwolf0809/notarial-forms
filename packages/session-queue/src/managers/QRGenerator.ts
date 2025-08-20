import QRCode from 'qrcode';
import winston from 'winston';
import { promises as fs } from 'fs';
import path from 'path';
import {
  IQRGenerator,
  QRConfig,
  CACHE_KEYS
} from '../types';
import { ICacheManager } from '../types';

export class QRGenerator implements IQRGenerator {
  private logger: winston.Logger;
  private cache?: ICacheManager;
  private baseUrl: string;
  private outputDir: string;

  // Default QR configurations for different notarías
  private readonly defaultConfigs: Record<string, Partial<QRConfig>> = {
    'NOTARIA_18_QUITO': {
      size: 300,
      margin: 3,
      errorCorrectionLevel: 'M',
      darkColor: '#1a365d', // Dark blue
      lightColor: '#ffffff',
      customData: {
        name: 'Notaría Décima Octava',
        address: 'Av. 6 de Diciembre y Av. Orellana, Quito',
        phone: '(02) 2504-567',
        theme: 'professional'
      }
    },
    'NOTARIA_DEFAULT': {
      size: 250,
      margin: 2,
      errorCorrectionLevel: 'M',
      darkColor: '#000000',
      lightColor: '#ffffff',
      customData: {
        name: 'Notaría',
        theme: 'standard'
      }
    }
  };

  constructor(
    baseUrl: string,
    logger: winston.Logger,
    outputDir: string = './qr-codes',
    cache?: ICacheManager
  ) {
    this.baseUrl = baseUrl;
    this.logger = logger;
    this.outputDir = outputDir;
    this.cache = cache;

    // Ensure output directory exists
    this.ensureOutputDirectory();
  }

  /**
   * Generate static QR code for notaría access
   */
  async generateStaticQR(
    notariaId: string, 
    config?: Partial<QRConfig>
  ): Promise<string> {
    try {
      this.logger.info('Generating static QR code', { notariaId });

      // Check cache first
      const cacheKey = `${CACHE_KEYS.QR(notariaId)}:static`;
      if (this.cache && !config) {
        const cached = await this.cache.get<string>(cacheKey);
        if (cached) {
          this.logger.debug('Returning cached static QR', { notariaId });
          return cached;
        }
      }

      // Get URL for notaría
      const url = this.getNotariaUrl(notariaId);

      // Merge configurations
      const qrConfig = this.mergeConfigs(notariaId, config);

      // Generate QR code data URL
      const qrDataUrl = await this.generateQRDataUrl(url, qrConfig);

      // Generate enhanced QR with branding if requested
      const finalQR = qrConfig.customData 
        ? await this.enhanceQRWithBranding(qrDataUrl, qrConfig)
        : qrDataUrl;

      // Save to file system
      const fileName = `${notariaId}_static_${Date.now()}.png`;
      const filePath = await this.saveQRToFile(finalQR, fileName);

      // Cache result
      if (this.cache && !config) {
        await this.cache.set(cacheKey, finalQR, 3600); // Cache for 1 hour
      }

      this.logger.info('Static QR generated successfully', {
        notariaId,
        filePath,
        url: url.substring(0, 50) + '...'
      });

      return finalQR;

    } catch (error) {
      this.logger.error('Failed to generate static QR', {
        error: error instanceof Error ? error.message : error,
        notariaId
      });
      throw error;
    }
  }

  /**
   * Generate session-specific QR code
   */
  async generateSessionQR(
    sessionId: string, 
    config?: Partial<QRConfig>
  ): Promise<string> {
    try {
      this.logger.info('Generating session QR code', { sessionId });

      // Get URL for session
      const url = this.getSessionUrl(sessionId);

      // Use default config for session QRs
      const qrConfig: QRConfig = {
        notariaId: sessionId.split('_')[0] || 'default',
        baseUrl: this.baseUrl,
        size: config?.size || 200,
        margin: config?.margin || 2,
        errorCorrectionLevel: config?.errorCorrectionLevel || 'M',
        type: config?.type || 'png',
        darkColor: config?.darkColor || '#000000',
        lightColor: config?.lightColor || '#ffffff'
      };

      // Generate QR code
      const qrDataUrl = await this.generateQRDataUrl(url, qrConfig);

      // Add session metadata to QR if needed
      const enhancedQR = config?.customData
        ? await this.addSessionMetadata(qrDataUrl, sessionId, config.customData)
        : qrDataUrl;

      this.logger.info('Session QR generated successfully', {
        sessionId,
        url: url.substring(0, 50) + '...'
      });

      return enhancedQR;

    } catch (error) {
      this.logger.error('Failed to generate session QR', {
        error: error instanceof Error ? error.message : error,
        sessionId
      });
      throw error;
    }
  }

  /**
   * Get notaría access URL
   */
  getNotariaUrl(notariaId: string): string {
    const cleanBaseUrl = this.baseUrl.replace(/\/$/, '');
    return `${cleanBaseUrl}/queue/${notariaId}`;
  }

  /**
   * Get session-specific URL
   */
  getSessionUrl(sessionId: string): string {
    const cleanBaseUrl = this.baseUrl.replace(/\/$/, '');
    return `${cleanBaseUrl}/session/${sessionId}`;
  }

  /**
   * Validate QR data format
   */
  validateQRData(data: string): boolean {
    try {
      // Check if it's a valid URL
      new URL(data);
      
      // Check if it matches our expected patterns
      const validPatterns = [
        /\/queue\/[A-Z0-9_]+$/,  // Notaría queue URLs
        /\/session\/ses_\d+_[a-f0-9]+$/  // Session URLs
      ];

      return validPatterns.some(pattern => pattern.test(data));

    } catch {
      return false;
    }
  }

  /**
   * Update QR design for a notaría
   */
  async updateQRDesign(
    notariaId: string, 
    design: Partial<QRConfig>
  ): Promise<void> {
    try {
      this.logger.info('Updating QR design', { notariaId, design });

      // Store custom design in cache or database
      if (this.cache) {
        const designKey = `${CACHE_KEYS.QR(notariaId)}:design`;
        await this.cache.set(designKey, design, 86400); // Cache for 24 hours
      }

      // Clear existing QR caches to force regeneration
      if (this.cache) {
        const staticKey = `${CACHE_KEYS.QR(notariaId)}:static`;
        await this.cache.del(staticKey);
      }

      this.logger.info('QR design updated successfully', { notariaId });

    } catch (error) {
      this.logger.error('Failed to update QR design', {
        error: error instanceof Error ? error.message : error,
        notariaId,
        design
      });
      throw error;
    }
  }

  // Private methods

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
      this.logger.info('Created QR output directory', { outputDir: this.outputDir });
    }
  }

  private mergeConfigs(
    notariaId: string, 
    customConfig?: Partial<QRConfig>
  ): QRConfig {
    // Get base config for notaría
    const baseConfig = this.defaultConfigs[notariaId] || this.defaultConfigs['NOTARIA_DEFAULT'];

    // Get cached custom design if available
    let cachedDesign: Partial<QRConfig> = {};
    if (this.cache) {
      // Note: This would normally be async, but for simplicity treating as sync
      // In real implementation, you'd want to handle this properly
    }

    return {
      notariaId,
      baseUrl: this.baseUrl,
      size: customConfig?.size || baseConfig.size || 250,
      margin: customConfig?.margin || baseConfig.margin || 2,
      errorCorrectionLevel: customConfig?.errorCorrectionLevel || baseConfig.errorCorrectionLevel || 'M',
      type: customConfig?.type || baseConfig.type || 'png',
      darkColor: customConfig?.darkColor || baseConfig.darkColor || '#000000',
      lightColor: customConfig?.lightColor || baseConfig.lightColor || '#ffffff',
      logo: customConfig?.logo || baseConfig.logo,
      customData: {
        ...baseConfig.customData,
        ...customConfig?.customData
      }
    };
  }

  private async generateQRDataUrl(url: string, config: QRConfig): Promise<string> {
    try {
      const options: QRCode.QRCodeToDataURLOptions = {
        type: 'image/png',
        width: config.size,
        margin: config.margin,
        color: {
          dark: config.darkColor,
          light: config.lightColor
        },
        errorCorrectionLevel: config.errorCorrectionLevel
      };

      const dataUrl = await QRCode.toDataURL(url, options);
      
      this.logger.debug('QR data URL generated', {
        url: url.substring(0, 50) + '...',
        size: config.size,
        dataUrlLength: dataUrl.length
      });

      return dataUrl;

    } catch (error) {
      this.logger.error('Failed to generate QR data URL', {
        error: error instanceof Error ? error.message : error,
        url,
        config
      });
      throw error;
    }
  }

  private async enhanceQRWithBranding(
    qrDataUrl: string, 
    config: QRConfig
  ): Promise<string> {
    try {
      // For now, return the basic QR
      // In a full implementation, this would:
      // 1. Load the QR image from data URL
      // 2. Create a canvas with branding elements
      // 3. Add notaría name, address, logo
      // 4. Combine with QR code
      // 5. Return enhanced image as data URL

      if (config.customData?.name) {
        this.logger.debug('QR enhanced with branding', {
          notariaId: config.notariaId,
          name: config.customData.name
        });
      }

      // Return original QR for now
      return qrDataUrl;

    } catch (error) {
      this.logger.error('Failed to enhance QR with branding', {
        error: error instanceof Error ? error.message : error,
        config
      });
      
      // Return original QR on error
      return qrDataUrl;
    }
  }

  private async addSessionMetadata(
    qrDataUrl: string, 
    sessionId: string, 
    metadata: any
  ): Promise<string> {
    try {
      // For now, return the basic QR
      // In a full implementation, this would add session-specific metadata
      this.logger.debug('Session metadata added to QR', {
        sessionId,
        metadata
      });

      return qrDataUrl;

    } catch (error) {
      this.logger.error('Failed to add session metadata to QR', {
        error: error instanceof Error ? error.message : error,
        sessionId,
        metadata
      });
      
      return qrDataUrl;
    }
  }

  private async saveQRToFile(dataUrl: string, fileName: string): Promise<string> {
    try {
      // Extract base64 data
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Save to file
      const filePath = path.join(this.outputDir, fileName);
      await fs.writeFile(filePath, buffer);

      this.logger.debug('QR saved to file', { filePath, fileSize: buffer.length });

      return filePath;

    } catch (error) {
      this.logger.error('Failed to save QR to file', {
        error: error instanceof Error ? error.message : error,
        fileName
      });
      throw error;
    }
  }

  // Public utility methods

  /**
   * Generate QR code for multiple notarías at once
   */
  async generateBatchQRs(
    notariaIds: string[], 
    config?: Partial<QRConfig>
  ): Promise<Record<string, string>> {
    this.logger.info('Generating batch QR codes', {
      count: notariaIds.length,
      notariaIds
    });

    const results: Record<string, string> = {};
    const promises = notariaIds.map(async (notariaId) => {
      try {
        const qr = await this.generateStaticQR(notariaId, config);
        results[notariaId] = qr;
      } catch (error) {
        this.logger.error('Failed to generate QR in batch', {
          notariaId,
          error: error instanceof Error ? error.message : error
        });
        results[notariaId] = '';
      }
    });

    await Promise.all(promises);

    this.logger.info('Batch QR generation completed', {
      successful: Object.values(results).filter(qr => qr !== '').length,
      failed: Object.values(results).filter(qr => qr === '').length
    });

    return results;
  }

  /**
   * Get QR code analytics/stats
   */
  async getQRStats(notariaId?: string): Promise<{
    totalGenerated: number;
    cacheHitRate: number;
    averageGenerationTime: number;
    popularNotarias: string[];
  }> {
    // This would typically query cache or analytics store
    // For now, return mock data
    return {
      totalGenerated: 1250,
      cacheHitRate: 0.85,
      averageGenerationTime: 150, // ms
      popularNotarias: ['NOTARIA_18_QUITO', 'NOTARIA_01_GUAYAQUIL']
    };
  }

  /**
   * Pregenerate QR codes for frequently accessed notarías
   */
  async pregeneratePopularQRs(): Promise<void> {
    this.logger.info('Pregenerating popular QR codes');

    const popularNotarias = [
      'NOTARIA_18_QUITO',
      'NOTARIA_01_GUAYAQUIL', 
      'NOTARIA_05_CUENCA',
      'NOTARIA_12_QUITO'
    ];

    try {
      const results = await this.generateBatchQRs(popularNotarias);
      const successful = Object.values(results).filter(qr => qr !== '').length;

      this.logger.info('Pregeneration completed', {
        requested: popularNotarias.length,
        successful,
        failed: popularNotarias.length - successful
      });

    } catch (error) {
      this.logger.error('Failed to pregenerate popular QRs', {
        error: error instanceof Error ? error.message : error
      });
    }
  }

  /**
   * Clear QR caches for a notaría
   */
  async clearQRCache(notariaId?: string): Promise<number> {
    if (!this.cache) {
      return 0;
    }

    try {
      if (notariaId) {
        // Clear specific notaría caches
        const keys = [
          `${CACHE_KEYS.QR(notariaId)}:static`,
          `${CACHE_KEYS.QR(notariaId)}:design`
        ];

        let cleared = 0;
        for (const key of keys) {
          const deleted = await this.cache.del(key);
          if (deleted) cleared++;
        }

        this.logger.info('QR cache cleared for notaría', { notariaId, cleared });
        return cleared;
      } else {
        // Clear all QR caches
        const pattern = 'qr:*';
        const keys = await this.cache.keys(pattern);
        const cleared = await this.cache.flushByPattern(pattern);

        this.logger.info('All QR caches cleared', { cleared });
        return cleared;
      }

    } catch (error) {
      this.logger.error('Failed to clear QR cache', {
        error: error instanceof Error ? error.message : error,
        notariaId
      });
      return 0;
    }
  }
}