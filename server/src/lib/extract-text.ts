import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs/promises";

/**
 * Extracts the raw text from a file given its path and MIME type.
 *
 * Supports the following MIME types:
 * - application/pdf: extracts text from a PDF file using pdf-parse.
 * - application/vnd.openxmlformats-officedocument.wordprocessingml.document: extracts text from a Word document using mammoth.
 * - text/plain: reads the contents of a plain text file.
 *
 * Throws an error if the MIME type is not supported.
 *
 * @param filePath - The path to the file.
 * @param mimeType - The MIME type of the file.
 * @returns A promise that resolves to the extracted text.
 */
const extractRawText = async (
  filePath: string,
  mimeType: string,
): Promise<string> => {
  switch (mimeType) {
    case "application/pdf": {
      let buffer: ArrayBuffer;

      if (filePath.startsWith("http")) {
        buffer = await fetch(filePath).then((r) => r.arrayBuffer());
      } else {
        const fileBuffer = await fs.readFile(filePath);
        buffer = fileBuffer.buffer.slice(
          fileBuffer.byteOffset,
          fileBuffer.byteOffset + fileBuffer.byteLength,
        ) as ArrayBuffer;
      }

      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
      });
      const pdf = await loadingTask.promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ");
        fullText += pageText + "\n";
        page.cleanup();
      }

      await loadingTask.destroy();

      return fullText;
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
