import { Usage } from "@/types/usage";

const formattedDocumentUploads = (usage: Usage[]) =>
  usage.map((u) => ({
    month: u.month,
    documentsUploaded: u.documentsUploaded,
  }));

export default formattedDocumentUploads;
