"use client";

import { useRef, useState, useEffect } from "react";
import { ThreeDot } from "react-loading-indicators";

interface Folder {
  _id: string;
  name: string;
}

interface Props {
  folders: Folder[];
  value: string;
  onChange: (value: string) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

const FolderSelect = ({
  folders,
  value,
  onChange,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options = [{ _id: "", name: "No Folder" }, ...folders];
  const selected = options.find((f) => f._id === value);

  return (
    <div className="mb-8">
      <label className="text-[11px] tracking-[0.15em] text-primary mb-3 block font-sans">
        SELECT FOLDER (OPTIONAL)
      </label>

      <div className="relative w-full sm:w-64" ref={ref}>
        {/* Trigger */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center justify-between w-full px-4 py-3 bg-white/8 border border-primary/18 rounded text-[#F5F5F5] text-sm font-sans focus:outline-none hover:border-primary/40 transition-colors cursor-pointer"
        >
          <span>{selected?.name ?? "No Folder"}</span>
          <svg
            className={`w-4 h-4 text-primary transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown panel */}
        {open && (
          <div className="absolute z-50 top-full mt-1 left-0 w-full bg-[#1a1a1a] border border-primary/18 rounded shadow-xl overflow-hidden">
            <div className="max-h-52 overflow-y-auto">
              {options.map((f) => (
                <button
                  key={f._id || "no-folder"}
                  onClick={() => {
                    onChange(f._id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-sans transition-colors duration-100 ${
                    value === f._id
                      ? "bg-primary/15 text-primary"
                      : "text-[#F5F5F5]/60 hover:bg-white/6 hover:text-[#F5F5F5]/80"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            {/* Load more */}
            {hasNextPage && (
              <div className="border-t border-primary/10">
                {isFetchingNextPage ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-[#F5F5F5]/40 font-sans">
                    <span>Loading</span>
                    <ThreeDot size="small" color="#c9a227" />
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchNextPage();
                    }}
                    className="w-full px-4 py-2.5 text-sm text-[#F5F5F5]/40 font-sans hover:text-primary hover:bg-white/4 transition-colors duration-150 text-center"
                  >
                    Load more
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderSelect;
