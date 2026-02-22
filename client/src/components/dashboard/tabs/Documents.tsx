"use client";

import Doc from "@/types/doc";
import sizefmt from "@/helpers/size-format";
import { Folder } from "@/types/folder";
import { SUMMARY_ICONS } from "@/components/dashboard/tabs/Summary";
import FileIcon from "@/components/FileIcon";
import STATUS_META from "@/constants/status-meta";
import { useState } from "react";
import FOLDERS from "@/seeds/folder";
import SUMMARIES from "@/seeds/summary";
import useDocument from "@/features/documents/useDocument";

function DocumentsTab({ userId }: { userId: string }) {
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<Doc["status"] | "all">(
    "all",
  );

  const { documentsByUserPage } = useDocument(userId, "");
  const { data: documents } = documentsByUserPage;

  const allDocs = documents?.pages.flatMap((page) => page.documents) ?? [];

  const filteredDocs = allDocs.filter((doc) => {
    const folderId =
      typeof doc.folder === "object"
        ? doc.folder?._id
        : typeof doc.folder === "string"
          ? doc.folder
          : undefined;

    if (filterFolder !== "all") {
      return folderId === filterFolder;
    }

    if (filterStatus !== "all") {
      return doc.status === filterStatus;
    }

    return true;
  });
  const folders = FOLDERS.filter((f) => {
    return filteredDocs.some((d) => d.folder === f._id);
  });

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 p-1 bg-white/4 border border-white/8 rounded-sm">
          {(
            ["all", "uploaded", "processing", "completed", "failed"] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-[10px] tracking-[0.08em] font-sans rounded-sm transition-all duration-150 capitalize ${
                filterStatus === s
                  ? "bg-primary text-background font-bold"
                  : "text-text/45 hover:text-text/70"
              }`}
            >
              {s === "all" ? "ALL" : STATUS_META[s].label.toUpperCase()}
            </button>
          ))}
        </div>
        <select
          value={filterFolder}
          onChange={(e) => setFilterFolder(e.target.value)}
          className="px-3 py-2 bg-white/4 border border-white/8 rounded-sm text-[11px] font-sans text-text/60 outline-none hover:border-primary/30 transition-colors cursor-pointer"
        >
          <option value="all">All Folders</option>
          {FOLDERS.map((f: Folder) => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}
          <option value="">No Folder</option>
        </select>
        <span className="text-[11px] text-text/25 font-sans ml-auto">
          {filteredDocs.length} documents
        </span>
      </div>

      {/* Document table */}
      <div className="border border-white/8 rounded-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/6 bg-white/2">
          {["TYPE", "DOCUMENT", "SIZE", "STATUS", "DATE"].map((h) => (
            <span
              key={h}
              className="text-[9px] tracking-[0.18em] text-text/25 font-sans"
            >
              {h}
            </span>
          ))}
        </div>
        <div className="divide-y divide-white/4">
          {filteredDocs.length === 0 ? (
            <div className="px-5 py-12 text-center text-text/25 text-[13px] font-sans">
              No documents match the current filters.
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const sm = STATUS_META[doc.status];
              const folder = FOLDERS.find((f) => f._id === doc.folder);
              const isSelected = selectedDoc?._id === doc._id;
              const fileType = doc.fileType;

              return (
                <div
                  key={doc._id}
                  onClick={() => setSelectedDoc(isSelected ? null : doc)}
                  className={`grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-primary/8 border-l-2 border-l-primary"
                      : "hover:bg-white/3"
                  }`}
                >
                  <div className="flex items-center gap-3 sm:contents">
                    <FileIcon type={fileType} />
                    <div className="sm:col-start-2 min-w-0">
                      <div className="text-[13px] font-sans text-text/80 truncate">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-text/30 font-sans mt-0.5 sm:hidden">
                        {folder?.name ?? "No folder"} ·{" "}
                        {sizefmt.bytes(doc.fileSize)}
                      </div>
                      <div className="text-[11px] text-text/30 font-sans mt-0.5 hidden sm:block">
                        {folder?.name ?? "—"}
                      </div>
                    </div>
                    <span className="text-[12px] text-text/35 font-sans my-auto hidden sm:block">
                      {sizefmt.bytes(doc.fileSize)}
                    </span>
                    <div
                      className={`flex items-center gap-1.5 text-[11px] font-sans ${sm.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${sm.dot} ${doc.status === "processing" ? "animate-pulse" : ""}`}
                      />
                      <span className="hidden sm:inline">{sm.label}</span>
                    </div>
                    <span className="text-[11px] text-text/25 text-right my-auto font-sans hidden sm:block">
                      {sizefmt.date(doc.createdAt)}
                    </span>
                  </div>

                  {/* Expanded summary panel */}
                  {isSelected && (
                    <div className="col-span-full mt-3 pt-3 border-t border-primary/10">
                      {(() => {
                        const sum = SUMMARIES.find(
                          (s) => s.document === doc._id,
                        );
                        return sum ? (
                          <div className="px-4 py-4 bg-primary/5 border border-primary/12 rounded-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-primary text-[13px]">
                                {SUMMARY_ICONS[sum.type]}
                              </span>
                              <span className="text-[10px] tracking-[0.12em] text-primary font-sans">
                                {sum.type.toUpperCase()} SUMMARY
                              </span>
                              <span className="ml-auto text-[10px] text-text/25 font-sans">
                                {sum.tokensUsed} tokens
                              </span>
                            </div>
                            <p className="text-[13px] text-text/65 font-sans leading-[1.7] whitespace-pre-line">
                              {sum.content}
                            </p>
                          </div>
                        ) : (
                          <div className="text-[12px] text-text/30 font-sans flex items-center gap-2">
                            <span className="text-text/20">◎</span>
                            {doc.status === "processing"
                              ? "Processing — summary will appear when complete."
                              : doc.status === "failed"
                                ? "Processing failed. Please re-upload the document."
                                : doc.status === "uploaded"
                                  ? "Document queued. Processing will begin shortly."
                                  : "No summary generated yet."}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentsTab;
