"use client";

import getCellValue from "@/utils/get-cell-value";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import ExcelJS from "exceljs";
import { memo, useEffect, useState, useRef, useCallback } from "react";
import type { Sheet } from "@fortune-sheet/core";
import computeSheet from "@/utils/compute-sheets";

// Raw sheet data before formula evaluation
interface RawSheet {
  name: string;
  data: (string | null)[][];
}

// Cache raw sheet data per URL (cheap to store, avoids re-fetching)
const rawSheetsCache = new Map<string, RawSheet[]>();
// Cache computed Fortune Sheet data per "url::sheetIndex"
const computedSheetCache = new Map<string, Sheet>();

function DocumentViewerXlsx({ url }: { url: string }) {
  const [rawSheets, setRawSheets] = useState<RawSheet[]>(
    () => rawSheetsCache.get(url) ?? [],
  );
  const [loadingFile, setLoadingFile] = useState(
    () => !rawSheetsCache.has(url),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSheet, setActiveSheet] = useState<Sheet | null>(null);
  const [computingSheet, setComputingSheet] = useState(false);
  const computeRef = useRef<{ url: string; index: number } | null>(null);

  useEffect(() => {
    if (rawSheetsCache.has(url)) {
      setRawSheets(rawSheetsCache.get(url)!);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const sheetsData: RawSheet[] = [];
        workbook.eachSheet((sheet) => {
          const data: (string | null)[][] = [];
          sheet.eachRow((row) => {
            const values = row.values as ExcelJS.CellValue[];
            data.push(
              values.slice(1).map((cell) => {
                if (cell == null) return null;
                if (typeof cell === "object" && "formula" in cell)
                  return `=${(cell as ExcelJS.CellFormulaValue).formula}`;
                return getCellValue(cell);
              }),
            );
          });
          sheetsData.push({ name: sheet.name, data });
        });

        rawSheetsCache.set(url, sheetsData);
        if (!cancelled) {
          setRawSheets(sheetsData);
          setLoadingFile(false);
        }
      } catch (err) {
        console.error("Failed to load XLSX:", err);
        if (!cancelled) setLoadingFile(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [url]);

  // Compute active sheet
  useEffect(() => {
    if (rawSheets.length === 0) return;

    const cacheKey = `${url}::${activeIndex}`;
    if (computedSheetCache.has(cacheKey)) {
      setActiveSheet(computedSheetCache.get(cacheKey)!);
      return;
    }

    setComputingSheet(true);
    computeRef.current = { url, index: activeIndex };

    // Defer heavy work off the render cycle
    const timer = setTimeout(() => {
      const snap = computeRef.current;
      if (!snap || snap.url !== url || snap.index !== activeIndex) return;

      try {
        const sheet = computeSheet(rawSheets, activeIndex);
        computedSheetCache.set(cacheKey, sheet);
        setActiveSheet(sheet);
      } catch (err) {
        console.error("Failed to compute sheet:", err);
      } finally {
        setComputingSheet(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [rawSheets, activeIndex, url]);

  const handleSheetChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (loadingFile) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-full text-sm text-gray-400">
        <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full" />
        Loading workbook…
      </div>
    );
  }

  if (rawSheets.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-sm text-gray-400">
        No sheets found.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Sheet tab bar */}
      <div className="flex overflow-x-auto border-b border-gray-700 bg-gray-900 shrink-0">
        {rawSheets.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSheetChange(i)}
            className={`px-3 py-1.5 text-xs whitespace-nowrap border-r border-gray-700 transition-colors ${
              i === activeIndex
                ? "bg-primary text-gray-900 font-semibold"
                : "bg-white/8 text-gray-400 hover:bg-gray-800"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Sheet content */}
      <div className="flex-1 relative overflow-hidden">
        {computingSheet && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/60 text-sm text-gray-300 gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full" />
            Computing sheet…
          </div>
        )}
        {activeSheet && (
          <Workbook
            key={`${url}::${activeIndex}`} // remount only when sheet changes
            data={[activeSheet]}
            onChange={() => {}}
            allowEdit={false}
            showToolbar={false}
            showFormulaBar={false}
          />
        )}
      </div>
    </div>
  );
}

export default memo(DocumentViewerXlsx);
