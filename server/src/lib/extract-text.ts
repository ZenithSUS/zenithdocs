import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

/**
 * Extracts the raw text from a given buffer and mime type.
 * Supported mime types are application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, and text/plain.
 * Throws an error if the mime type is not supported.
 * @return {Promise<string>} The extracted raw text.
 */
const extractRawText = async (
  buffer: Buffer,
  mimeType: string,
): Promise<string> => {
  switch (mimeType) {
    case "application/pdf": {
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const result = await parser.getText();
      return result.text;
    }

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    case "text/plain": {
      return buffer.toString("utf-8");
    }

    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
};

export default extractRawText;
