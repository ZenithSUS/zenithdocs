import {
  AlignLeft,
  Clock,
  FileText,
  FileType,
  Folder,
  HardDrive,
  Tag,
} from "lucide-react";
import sizefmt from "@/helpers/size-format";

interface StatusMeta {
  text: string;
  label: string;
}

interface DocumentFolder {
  name: string;
}

interface Document {
  fileType: string;
  fileSize: number;
  createdAt: string;
  rawText?: string;
  status: string;
}

interface Props {
  document: Document;
  folder: DocumentFolder | null;
  statusMeta: StatusMeta;
}

const DetailRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="pt-4 border-t border-white/8">
    <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-text/30 font-sans mb-1">
      {icon} {label}
    </div>
    {children}
  </div>
);

const DocumentDetailsTab = ({ document, folder, statusMeta }: Props) => (
  <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/12 rounded-lg p-6 sm:p-8">
    <h3 className="text-[11px] tracking-[0.15em] text-[#C9A227] mb-6 font-sans flex items-center gap-2">
      <FileText size={13} />
      DOCUMENT INFORMATION
    </h3>

    <div className="space-y-4">
      {/* Top grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-text/30 font-sans mb-1">
            <FileType size={10} /> FILE TYPE
          </div>
          <div className="text-[14px] text-text/70 font-sans">
            {document.fileType}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-text/30 font-sans mb-1">
            <HardDrive size={10} /> FILE SIZE
          </div>
          <div className="text-[14px] text-text/70 font-sans">
            {sizefmt.bytes(document.fileSize)}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-text/30 font-sans mb-1">
            <Tag size={10} /> STATUS
          </div>
          <div className={`text-[14px] font-sans ${statusMeta.text}`}>
            {statusMeta.label}
          </div>
        </div>
      </div>

      <DetailRow icon={<Folder size={10} />} label="FOLDER">
        <div className="text-[14px] text-text/70 font-sans">
          {folder?.name ?? "No folder"}
        </div>
      </DetailRow>

      <DetailRow icon={<Clock size={10} />} label="UPLOADED">
        <div className="text-[14px] text-text/70 font-sans">
          {new Date(document.createdAt).toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </div>
      </DetailRow>

      {document.rawText && (
        <DetailRow icon={<AlignLeft size={10} />} label="EXTRACTED TEXT">
          <div className="text-[13px] text-text/60 font-sans leading-[1.8] whitespace-pre-wrap max-h-96 overflow-y-auto p-4 bg-black/20 rounded border border-white/6">
            {document.rawText}
          </div>
        </DetailRow>
      )}
    </div>
  </div>
);

export default DocumentDetailsTab;
