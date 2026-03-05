import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
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
      const parser = new PDFParse({ url: filePath }); // accepts local path or URL
      const result = await parser.getText();
      return result.text;
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
