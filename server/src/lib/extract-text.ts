import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs/promises";

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
      // Load into a Uint8Array inside an IIFE block so the intermediate
      // buffers fall out of scope (and become GC-eligible) before pdfjs loads
      const pdfData = await (async (): Promise<Uint8Array> => {
        if (filePath.startsWith("http")) {
          const arrayBuffer = await fetch(filePath).then((r) =>
            r.arrayBuffer(),
          );
          return new Uint8Array(arrayBuffer);
          // arrayBuffer goes out of scope here
        } else {
          const fileBuffer = await fs.readFile(filePath);
          const copy = new Uint8Array(fileBuffer);
          return copy;
          // fileBuffer goes out of scope here
        }
      })();

      const loadingTask = pdfjsLib.getDocument({
        data: pdfData,
        disableAutoFetch: true,
        disableStream: true,
      });

      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const pageTexts: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const pageText = content.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ");

        pageTexts.push(pageText);

        // Release each page's resources immediately after extraction
        page.cleanup();
        content.items.length = 0;
      }

      await loadingTask.destroy();

      return pageTexts.join("\n");
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
