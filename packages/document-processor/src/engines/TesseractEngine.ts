import Tesseract from 'tesseract.js';
import NodeCache from 'node-cache';
import asyncPool from 'async-pool';
import { OCREngine, OCROptions, OCRResult, WordInfo, LineInfo, ParagraphInfo, BoundingBox } from '../types';

export class TesseractEngine implements OCREngine {
  private workers: Tesseract.Worker[] = [];
  private cache: NodeCache;
  private isInit: boolean = false;
  private confidence: number = 0;
  private readonly maxWorkers: number;
  private availableWorkers: Tesseract.Worker[] = [];
  private busyWorkers: Set<Tesseract.Worker> = new Set();

  private readonly defaultConfig: OCROptions = {
    language: 'spa',
    pageSegMode: Tesseract.PSM.UNIFORM_BLOCK, // PSM_6 for tables
    ocrEngineMode: Tesseract.OEM.LSTM_ONLY,
    whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789áéíóúÁÉÍÓÚñÑ .,:-()[]{}/$%&@#+=*',
    variables: {
      'tessedit_char_whitelist': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789áéíóúÁÉÍÓÚñÑ .,:-()[]{}/$%&@#+=*',
      'preserve_interword_spaces': '1',
      'user_defined_dpi': '300'
    }
  };

  constructor(maxWorkers: number = 3, cacheOptions?: { stdTTL?: number; checkperiod?: number }) {
    this.maxWorkers = maxWorkers;
    this.cache = new NodeCache({
      stdTTL: cacheOptions?.stdTTL || 3600, // 1 hour default cache
      checkperiod: cacheOptions?.checkperiod || 600, // Check every 10 minutes
      useClones: false
    });
    
    // Clean cache on memory pressure
    process.on('memoryUsage', () => {
      const usage = process.memoryUsage();
      if (usage.heapUsed > 500 * 1024 * 1024) { // 500MB
        this.cache.flushAll();
      }
    });
  }

  async initialize(): Promise<void> {
    if (this.isInit) return;

    try {
      // Create worker pool
      const workerPromises = Array.from({ length: this.maxWorkers }, () => 
        this.createConfiguredWorker()
      );

      this.workers = await Promise.all(workerPromises);
      this.availableWorkers = [...this.workers];
      this.isInit = true;

      console.log(`TesseractEngine initialized with ${this.maxWorkers} workers`);
    } catch (error) {
      throw new Error(`Failed to initialize TesseractEngine: ${error}`);
    }
  }

  private async createConfiguredWorker(): Promise<Tesseract.Worker> {
    const worker = await Tesseract.createWorker(this.defaultConfig.language);

    // Configure worker with optimal settings for Ecuadorian documents
    await worker.setParameters({
      tessedit_pageseg_mode: this.defaultConfig.pageSegMode?.toString() || '6',
      tessedit_ocr_engine_mode: this.defaultConfig.ocrEngineMode?.toString() || '3',
      tessedit_char_whitelist: this.defaultConfig.whitelist || '',
      preserve_interword_spaces: '1',
      user_defined_dpi: '300',
      // Optimize for Spanish text
      textord_really_old_xheight: '1',
      textord_min_xheight: '10',
      // Better handling of tables
      textord_tabfind_find_tables: '1',
      textord_tablefind_good_width: '3',
      textord_tablefind_good_height: '3',
      // Improve number recognition
      classify_enable_learning: '0',
      classify_enable_adaptive_matcher: '1'
    });

    return worker;
  }

  private async getAvailableWorker(): Promise<Tesseract.Worker> {
    // Wait for available worker
    while (this.availableWorkers.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const worker = this.availableWorkers.pop()!;
    this.busyWorkers.add(worker);
    return worker;
  }

  private releaseWorker(worker: Tesseract.Worker): void {
    this.busyWorkers.delete(worker);
    this.availableWorkers.push(worker);
  }

  async recognize(imagePath: string, options?: OCROptions): Promise<OCRResult> {
    if (!this.isInit) {
      await this.initialize();
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(imagePath, options);
    const cached = this.cache.get<OCRResult>(cacheKey);
    if (cached) {
      this.confidence = cached.confidence;
      return cached;
    }

    const worker = await this.getAvailableWorker();

    try {
      // Apply custom options if provided
      if (options) {
        await this.applyCustomOptions(worker, options);
      }

      const startTime = Date.now();
      const { data } = await worker.recognize(imagePath);
      const processingTime = Date.now() - startTime;

      this.confidence = data.confidence / 100;

      // Build detailed OCR result
      const result: OCRResult = {
        text: data.text,
        confidence: this.confidence,
        words: this.extractWords(data),
        lines: this.extractLines(data),
        paragraphs: this.extractParagraphs(data)
      };

      // Log performance metrics
      if (processingTime > 5000) {
        console.warn(`Slow OCR processing: ${processingTime}ms for ${imagePath}`);
      }

      if (this.confidence < 0.8) {
        console.warn(`Low OCR confidence: ${this.confidence.toFixed(2)} for ${imagePath}`);
      }

      // Cache result
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      throw new Error(`OCR recognition failed for ${imagePath}: ${error}`);
    } finally {
      this.releaseWorker(worker);
    }
  }

  private async applyCustomOptions(worker: Tesseract.Worker, options: OCROptions): Promise<void> {
    const parameters: Record<string, string> = {};

    if (options.pageSegMode !== undefined) {
      parameters.tessedit_pageseg_mode = options.pageSegMode.toString();
    }

    if (options.ocrEngineMode !== undefined) {
      parameters.tessedit_ocr_engine_mode = options.ocrEngineMode.toString();
    }

    if (options.whitelist) {
      parameters.tessedit_char_whitelist = options.whitelist;
    }

    if (options.blacklist) {
      parameters.tessedit_char_blacklist = options.blacklist;
    }

    if (options.variables) {
      Object.assign(parameters, options.variables);
    }

    if (Object.keys(parameters).length > 0) {
      await worker.setParameters(parameters);
    }
  }

  private extractWords(data: any): WordInfo[] {
    if (!data.words) return [];

    return data.words.map((word: any) => ({
      text: word.text,
      confidence: word.confidence / 100,
      bbox: {
        x0: word.bbox.x0,
        y0: word.bbox.y0,
        x1: word.bbox.x1,
        y1: word.bbox.y1
      }
    }));
  }

  private extractLines(data: any): LineInfo[] {
    if (!data.lines) return [];

    return data.lines.map((line: any) => ({
      text: line.text,
      confidence: line.confidence / 100,
      bbox: {
        x0: line.bbox.x0,
        y0: line.bbox.y0,
        x1: line.bbox.x1,
        y1: line.bbox.y1
      },
      words: line.words ? this.extractWords({ words: line.words }) : []
    }));
  }

  private extractParagraphs(data: any): ParagraphInfo[] {
    if (!data.paragraphs) return [];

    return data.paragraphs.map((paragraph: any) => ({
      text: paragraph.text,
      confidence: paragraph.confidence / 100,
      bbox: {
        x0: paragraph.bbox.x0,
        y0: paragraph.bbox.y0,
        x1: paragraph.bbox.x1,
        y1: paragraph.bbox.y1
      },
      lines: paragraph.lines ? this.extractLines({ lines: paragraph.lines }) : []
    }));
  }

  private generateCacheKey(imagePath: string, options?: OCROptions): string {
    const optionsStr = options ? JSON.stringify(options) : '';
    return `ocr:${imagePath}:${optionsStr}`;
  }

  getConfidence(): number {
    return this.confidence;
  }

  isInitialized(): boolean {
    return this.isInit;
  }

  async recognizeMultiple(imagePaths: string[], concurrency: number = 2, options?: OCROptions): Promise<OCRResult[]> {
    if (!this.isInit) {
      await this.initialize();
    }

    const processingFunction = async (imagePath: string): Promise<OCRResult> => {
      return this.recognize(imagePath, options);
    };

    return asyncPool(Math.min(concurrency, this.maxWorkers), imagePaths, processingFunction);
  }

  getCacheStats(): { keys: number; hits: number; misses: number; size: string } {
    const stats = this.cache.getStats();
    return {
      keys: stats.keys,
      hits: stats.hits,
      misses: stats.misses,
      size: `${Math.round(stats.ksize / 1024)}KB`
    };
  }

  clearCache(): void {
    this.cache.flushAll();
  }

  async terminate(): Promise<void> {
    if (!this.isInit) return;

    try {
      // Wait for all workers to be available
      while (this.busyWorkers.size > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Terminate all workers
      await Promise.all(this.workers.map(worker => worker.terminate()));
      
      this.workers = [];
      this.availableWorkers = [];
      this.busyWorkers.clear();
      this.isInit = false;
      this.cache.flushAll();

      console.log('TesseractEngine terminated successfully');
    } catch (error) {
      console.error('Error terminating TesseractEngine:', error);
      throw error;
    }
  }

  // Health check method
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    try {
      if (!this.isInit) {
        return { status: 'unhealthy', details: { reason: 'Not initialized' } };
      }

      const details = {
        totalWorkers: this.workers.length,
        availableWorkers: this.availableWorkers.length,
        busyWorkers: this.busyWorkers.size,
        cacheStats: this.getCacheStats(),
        memoryUsage: process.memoryUsage()
      };

      return { status: 'healthy', details };
    } catch (error) {
      return { status: 'unhealthy', details: { error: error.message } };
    }
  }
}