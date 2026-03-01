"use client";

function FileIcon({ type }: { type: string }) {
  const normalizeType = (raw: string): string => {
    const mimeMap: Record<string, string> = {
      "vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
      "vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
      plain: "txt",
    };
    return mimeMap[raw] ?? raw;
  };

  const colorMap: Record<string, string> = {
    pdf: "#C9A227",
    docx: "#3b82f6",
    txt: "#6b7280",
  };

  const normalized = normalizeType(type);
  const color = colorMap[normalized] ?? "#6b7280";

  return (
    <div
      className="w-8 h-9 rounded-sm flex items-center justify-center text-[9px] font-bold tracking-wider font-sans truncate"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {normalized.toUpperCase()}
    </div>
  );
}

export default FileIcon;
