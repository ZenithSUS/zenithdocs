import mammoth from "mammoth";
import fs from "fs/promises";
import * as pdfParseModule from "pdf-parse-new";
import colors from "../utils/log-colors.js";
import extractWithMistralOCR from "./mistral/services/extract-text-ocr.js";

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
  getFilePath: () => Promise<string>,
  mimeType: string,
  fileUrl: string,
): Promise<string> => {
  switch (mimeType) {
    case "application/pdf": {
      try {
        return await extractWithMistralOCR(fileUrl);
      } catch (error) {
        // Only fallback on OCR-specific failures, not auth/network errors
        const isOcrFailure =
          error instanceof Error &&
          !error.message.includes("401") &&
          !error.message.includes("403") &&
          !error.message.includes("429"); // don't fallback on rate limit

        if (!isOcrFailure) throw error;

        console.error("=".repeat(50));
        console.error(
          `${colors.red}Mistral OCR failed — falling back to pdf-parse (images will be lost)${colors.reset}`,
        );
        console.error(
          "Reason:",
          error instanceof Error ? error.message : error,
        );
        console.error("=".repeat(50) + "\n");

        const filePath = await getFilePath();
        const buffer = await fs.readFile(filePath);
        const result = await suppressPdfLogs(() => pdfParse(buffer));
        return result.text;
      }
    }

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      try {
        return await extractWithMistralOCR(fileUrl);
      } catch (error) {
        console.error("=".repeat(50));
        console.error(
          `${colors.red}Mistral OCR failed for DOCX — falling back to mammoth${colors.reset}`,
        );
        console.error(
          "Reason:",
          error instanceof Error ? error.message : error,
        );
        console.error("=".repeat(50) + "\n");

        const filePath = await getFilePath();
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
      }
    }

    case "text/plain": {
      const filePath = await getFilePath();
      return await fs.readFile(filePath, "utf-8");
    }

    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
};

export default extractRawText;
