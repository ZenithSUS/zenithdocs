import client from "../index.js";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const extractWithMistralOCR = async (
  fileUrl: string,
  retries = 3,
  delayMs = 2000,
): Promise<string> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: { type: "document_url", documentUrl: fileUrl },
      });

      return response.pages.map((page) => page.markdown).join("\n\n");
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      const isTransient =
        msg.includes("503") ||
        msg.includes("overflow") ||
        msg.includes("disconnect");

      if (isTransient && attempt < retries) {
        console.log("=".repeat(50));
        console.warn(
          `Mistral OCR attempt ${attempt}/${retries} failed (transient) — retrying in ${delayMs}ms...`,
        );
        console.log("=".repeat(50) + "\n");
        await sleep(delayMs * attempt); // exponential backoff
        continue;
      }

      throw error; // non-transient or out of retries
    }
  }

  throw new Error("Mistral OCR: all retry attempts exhausted");
};

export default extractWithMistralOCR;
