import { getPdfText } from './pdf-text-extract';
import { ocrScan } from './tesseract-ocr';
export async function extractTextFromFiles(
  files: { name: string; buffer: Buffer; mimetype: string }[]
): Promise<string> {
  const chunks: string[] = [];
  for (const f of files) {
    let text: string | null = null;
    if (f.mimetype === 'application/pdf') text = await getPdfText(f.buffer);
    if (!text) text = await ocrScan(f.buffer); // fallback
    chunks.push(`--- ${f.name} ---\n${text}`);
  }
  return chunks.join('\n');
}
