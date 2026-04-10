import { FileText, Search, ChevronDown } from "lucide-react";

const documents = [
  { name: "contract_review_2024.pdf", date: "Apr 2026" },
  { name: "contract_review_2023.pdf", date: "Mar 2025" },
  { name: "contract_review_2022.pdf", date: "Feb 2024" },
  { name: "contract_review_2021.pdf", date: "Jan 2023" },
  { name: "contract_review_2020.pdf", date: "Dec 2022" },
];

export default function SourceDocumentList() {
  return (
    <div className="border border-white/10 rounded-lg bg-white/5 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/3">
        <FileText size={14} className="text-white/40" />
        <span className="text-[11px] tracking-widest text-white/40 uppercase font-sans">
          Source document
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-md bg-white/3">
          <Search size={13} className="text-white/30" />
          <input
            placeholder="Search documents…"
            className="bg-transparent outline-none text-sm w-full text-white/70 placeholder:text-white/25"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          {documents.map((doc, i) => (
            <div
              key={doc.name}
              className={`p-3 rounded-md border transition-colors ${
                i === 0 ? "border-blue-500/40 bg-blue-500/8" : "border-white/8"
              }`}
            >
              <div className="text-sm text-white/80 truncate">{doc.name}</div>
              <div className="text-[11px] text-white/35 mt-0.5">
                PDF · {doc.date}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-white/35 py-1">
          <ChevronDown size={13} />
          Load more
        </div>
      </div>
    </div>
  );
}
