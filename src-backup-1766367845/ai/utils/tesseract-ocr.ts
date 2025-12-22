import Tesseract from 'tesseract.js';
import path from 'path';

export async function ocrScan(buffer: Buffer, lang = 'eng'): Promise<string> {
  try {
    // Create worker with explicit paths for Next.js
    const worker = await Tesseract.createWorker(lang, undefined, {
      workerPath: path.resolve(process.cwd(), 'node_modules/tesseract.js/dist/worker.min.js'),
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      corePath: 'https://unpkg.com/tesseract.js-core@v4.0.2/tesseract-core.wasm.js',
      logger: () => {} // Suppress logs
    });

    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    
    return text || '';
  } catch (error) {
    console.error('OCR failed:', error);
    // Return empty string instead of throwing to allow graceful degradation
    return '';
  }
}