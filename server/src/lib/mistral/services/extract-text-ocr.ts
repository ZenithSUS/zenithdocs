import client from "../index.js";

const extractWithMistralOCR = async (fileUrl: string): Promise<string> => {
  const response = await client.ocr.process({
    model: "mistral-ocr-latest",
    document: { type: "document_url", documentUrl: fileUrl },
  });

  return response.pages.map((page) => page.markdown).join("\n\n");
};

export default extractWithMistralOCR;
