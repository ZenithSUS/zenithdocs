import mammoth from "mammoth";
import fs from "fs/promises";
import * as pdfParseModule from "pdf-parse-new";

// Suppress pdf-parse/PDF.js internal logs
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

const pdfParse: (buffer: Buffer) => Promise<{ text: string }> =
  (pdfParseModule as any).default ??
  (pdfParseModule as any).parse ??
  pdfParseModule;

const suppressPdfLogs = <T>(fn: () => Promise<T>): Promise<T> => {
  console.log = (...args: any[]) => {
    const msg = args[0]?.toString() ?? "";
    if (!msg.startsWith("Info:") && !msg.startsWith("Warning:")) {
      originalConsoleLog(...args);
    }
  };
  console.warn = (...args: any[]) => {
    const msg = args[0]?.toString() ?? "";
    if (!msg.startsWith("Warning: fetchStandardFontData")) {
      originalConsoleWarn(...args);
    }
  };

  return fn().finally(() => {
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
  });
};

/**
 * Extracts the raw text from a file, given its path and MIME type.
 *
 * Supports the following MIME types:
 * - application/pdf
 * - application/vnd.openxmlformats-officedocument.wordprocessingml.document
 * - text/plain
 *
 * @throws {Error} - If the file type is not supported
 *
 * @param {string} filePath - The path to the file
 * @param {string} mimeType - The MIME type of the file
 *
 * @returns {Promise<string>} - The raw text extracted from the file
 */
const extractRawText = async (
  filePath: string,
  mimeType: string,
): Promise<string> => {
  switch (mimeType) {
    case "application/pdf": {
      const buffer = filePath.startsWith("http")
        ? await fetch(filePath)
            .then((r) => r.arrayBuffer())
            .then((ab) => Buffer.from(ab))
        : await fs.readFile(filePath);

      return suppressPdfLogs(() => pdfParse(buffer)).then((data) => data.text);
    }

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }

    case "text/plain": {
      return await fs.readFile(filePath, "utf-8");
    }

    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
};

export default extractRawText;
