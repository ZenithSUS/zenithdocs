import mammoth from "mammoth";
import fs from "fs/promises";
import * as pdfParseModule from "pdf-parse-new";
import { createWorker, Worker as TesseractWorker } from "tesseract.js";
import * as mupdf from "mupdf";
import JSZip from "jszip";
import path from "path";
import os from "os";

const pdfParse: (
  buffer: Buffer,
) => Promise<{ text: string; numpages: number }> =
  (pdfParseModule as any).default ??
  (pdfParseModule as any).parse ??
  pdfParseModule;

const TESSDATA_DIR = path.resolve(process.cwd(), "tessdata");

// ─── Singleton OCR worker ────────────────────────────────────────────────────

let _worker: TesseractWorker | null = null;

const getOcrWorker = async (): Promise<TesseractWorker> => {
  if (!_worker) {
    _worker = await createWorker("eng", 1, {
      logger: () => {},
      errorHandler: () => {},
      cachePath: TESSDATA_DIR,
    });
  }
  return _worker;
};

export const warmOcr = async (): Promise<void> => {
  await getOcrWorker();
  console.log("[ocr] tesseract worker ready");
};

export const terminateOcr = async (): Promise<void> => {
  if (_worker) {
    await _worker.terminate();
    _worker = null;
  }
};

// ─── Logging suppression ─────────────────────────────────────────────────────

const suppressPdfLogs = <T>(fn: () => Promise<T>): Promise<T> => {
  const originalLog = console.log;
  const originalWarn = console.warn;
  console.log = (...args: any[]) => {
    const msg = args[0]?.toString() ?? "";
    if (!msg.startsWith("Info:") && !msg.startsWith("Warning:"))
      originalLog(...args);
  };
  console.warn = (...args: any[]) => {
    const msg = args[0]?.toString() ?? "";
    if (!msg.startsWith("Warning: fetchStandardFontData"))
      originalWarn(...args);
  };
  return fn().finally(() => {
    console.log = originalLog;
    console.warn = originalWarn;
  });
};

// ─── Page image detection ────────────────────────────────────────────────────

const scanPagesForImages = (
  fileBuffer: Buffer,
  numPages: number,
): boolean[] => {
  const doc = mupdf.Document.openDocument(fileBuffer, "application/pdf");
  try {
    return Array.from({ length: numPages }, (_, i) => {
      try {
        const page = doc.loadPage(i) as mupdf.PDFPage;
        const resources = page.getObject().get("Resources");
        if (!resources || resources.isNull()) return false;
        const xObject = resources.get("XObject");
        if (!xObject || xObject.isNull()) return false;
        const resolved = xObject.isIndirect() ? xObject.resolve() : xObject;
        if (!resolved.isDictionary()) return false;
        let hasImage = false;
        // Note: mupdf forEach passes (value, key) — not (key, value)
        resolved.forEach((val: mupdf.PDFObject, key: string | number) => {
          if (hasImage) return;
          if (typeof key === "string" && key.startsWith("Image")) {
            hasImage = true;
            return;
          }
          try {
            const entry = val.isIndirect() ? val.resolve() : val;
            const subtype = entry.get("Subtype");
            if (subtype && !subtype.isNull() && subtype.asName() === "Image")
              hasImage = true;
          } catch {
            /* skip */
          }
        });
        return hasImage;
      } catch {
        return false;
      }
    });
  } finally {
    doc.destroy();
  }
};

// ─── Adaptive scale ──────────────────────────────────────────────────────────
// Fewer OCR pages = higher quality render. More pages = lower res to save RAM.
// Tesseract handles 1.0x fine for normal body text and large slide text.

const getScaleForPageCount = (numOcrPages: number): number => {
  if (numOcrPages <= 5) return 2.0; // high quality, few pages
  if (numOcrPages <= 15) return 1.5; // balanced
  if (numOcrPages <= 30) return 1.2; // lower res, still readable
  return 1.0; // minimum — works for normal/large text
};

// Max width cap — prevents huge pages from producing massive pixmaps
const MAX_WIDTH_PX = 1920;

// ─── OCR helpers ─────────────────────────────────────────────────────────────

const ocrImageBuffer = async (
  worker: TesseractWorker,
  imageBuffer: Buffer,
  ext = "png",
): Promise<string> => {
  const tmpFile = path.join(
    os.tmpdir(),
    `ocr-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`,
  );
  await fs.writeFile(tmpFile, imageBuffer);
  try {
    const { data } = await worker.recognize(tmpFile);
    return data.text.trim();
  } finally {
    await fs.unlink(tmpFile).catch(() => {});
  }
};

const renderPageToBuffer = (
  fileBuffer: Buffer,
  pageIndex: number,
  scale: number,
): Buffer => {
  const doc = mupdf.Document.openDocument(fileBuffer, "application/pdf");
  try {
    const page = doc.loadPage(pageIndex);
    const bounds = page.getBounds();
    const pageWidthPt = bounds[2] - bounds[0];

    // Never exceed MAX_WIDTH_PX regardless of requested scale
    const finalScale = Math.min(scale, MAX_WIDTH_PX / pageWidthPt);

    const matrix = mupdf.Matrix.scale(finalScale, finalScale);
    const pixmap = page.toPixmap(
      matrix,
      mupdf.ColorSpace.DeviceRGB,
      false,
      true,
    );
    const png = Buffer.from(pixmap.asPNG());
    pixmap.destroy();
    page.destroy();
    return png;
  } finally {
    doc.destroy();
  }
};

// ─── Heuristic ───────────────────────────────────────────────────────────────

const PAGE_TEXT_THRESHOLD = 50;

const pageNeedsOcr = (nativeText: string): boolean =>
  nativeText.replace(/\s+/g, "").length < PAGE_TEXT_THRESHOLD;

// ─── PDF extraction ──────────────────────────────────────────────────────────

const extractPdfText = async (filePath: string): Promise<string> => {
  const buffer = await fs.readFile(filePath);
  const parsed = await suppressPdfLogs(() => pdfParse(buffer));
  const nativePages = parsed.text.split("\f").map((p) => p.trim());

  const pageHasImage = scanPagesForImages(buffer, parsed.numpages);

  const needsOcrCount = nativePages.filter(
    (text, i) => pageNeedsOcr(text) || pageHasImage[i],
  ).length;

  if (needsOcrCount === 0) {
    console.log("[extract] native text only, skipping OCR");
    return nativePages.join("\n\n");
  }

  // Pick scale based on how many pages need OCR — fewer pages = higher quality
  const scale = getScaleForPageCount(needsOcrCount);

  console.log(
    `[extract] ${needsOcrCount}/${parsed.numpages} pages need OCR (scale: ${scale}x)`,
  );

  const worker = await getOcrWorker();
  const parts: string[] = [];

  for (let i = 0; i < parsed.numpages; i++) {
    const native = nativePages[i] ?? "";

    if (!pageNeedsOcr(native) && !pageHasImage[i]) {
      parts.push(native);
      nativePages[i] = ""; // release reference — GC can reclaim
      continue;
    }

    let ocrText = "";
    try {
      const pageBuffer = renderPageToBuffer(buffer, i, scale);
      ocrText = await ocrImageBuffer(worker, pageBuffer);
      // pageBuffer goes out of scope here — GC can reclaim
    } catch (err) {
      console.warn(
        `[extract] OCR failed on page ${i + 1}:`,
        (err as Error).message,
      );
    }

    if (pageHasImage[i] && ocrText.length > native.length * 0.8) {
      // Image-based page: OCR is more complete than native text layer
      const nativeOnlyLines = native
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 2 && !ocrText.includes(l));
      parts.push([ocrText, ...nativeOnlyLines].filter(Boolean).join("\n"));
    } else {
      // Text-heavy page with incidental image: native is primary
      const ocrLines = ocrText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 2 && !native.includes(l));
      parts.push([native, ...ocrLines].filter(Boolean).join("\n"));
    }

    nativePages[i] = ""; // release reference after merge
  }

  return parts.join("\n\n");
};

// ─── DOCX extraction ─────────────────────────────────────────────────────────

const extractDocxText = async (filePath: string): Promise<string> => {
  const { value: nativeText } = await mammoth.extractRawText({
    path: filePath,
  });

  const docxBuffer = await fs.readFile(filePath);
  const zip = await JSZip.loadAsync(docxBuffer);

  const imageEntries = Object.entries(zip.files).filter(([name]) =>
    /^word\/media\/.+\.(png|jpe?g|bmp|tiff?)$/i.test(name),
  );

  console.log(`[extract] ${imageEntries.length} images in DOCX`);
  if (imageEntries.length === 0) return nativeText;

  const worker = await getOcrWorker();
  const ocrTexts: string[] = [];

  for (const [name, entry] of imageEntries) {
    const ext = name.split(".").pop() ?? "png";
    const imgBuffer = Buffer.from(await entry.async("arraybuffer"));

    // Skip tiny images — likely icons or decorations, not content
    if (imgBuffer.byteLength < 10 * 1024) continue;

    try {
      const ocrText = await ocrImageBuffer(worker, imgBuffer, ext);
      const newLines = ocrText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 2 && !nativeText.includes(l));
      if (newLines.length > 0) ocrTexts.push(newLines.join("\n"));
    } catch (err) {
      console.warn(
        `[extract] OCR failed on DOCX image ${name}:`,
        (err as Error).message,
      );
    }
  }

  return [nativeText, ...ocrTexts].filter(Boolean).join("\n\n");
};

// ─── Public API ──────────────────────────────────────────────────────────────

const extractRawText = async (
  filePath: string,
  mimeType: string,
): Promise<string> => {
  switch (mimeType) {
    case "application/pdf":
      return extractPdfText(filePath);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return extractDocxText(filePath);
    case "text/plain":
      return fs.readFile(filePath, "utf-8");
    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
};

export default extractRawText;
