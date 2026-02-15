function FileIcon({ type }: { type: string }) {
  const map: Record<string, string> = {
    pdf: "#C9A227",
    docx: "#3b82f6",
    txt: "#6b7280",
  };
  return (
    <div
      className="w-8 h-9 rounded-sm flex items-center justify-center text-[9px] font-bold tracking-wider font-sans"
      style={{
        background: `${map[type] ?? "#6b7280"}18`,
        color: map[type] ?? "#6b7280",
        border: `1px solid ${map[type] ?? "#6b7280"}30`,
      }}
    >
      {type.toUpperCase()}
    </div>
  );
}

export default FileIcon;
