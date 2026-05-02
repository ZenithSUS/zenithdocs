"use client";

import getCellValue from "@/utils/get-cell-value";
import { Workbook } from "@fortune-sheet/react";
import { HyperFormula } from "hyperformula";
import "@fortune-sheet/react/dist/index.css";
import ExcelJS from "exceljs";
import { memo, useEffect, useState } from "react";
import type { Sheet } from "@fortune-sheet/core";

const sheetsCache = new Map<string, Sheet[]>();

function DocumentViewerXlsx({ url }: { url: string }) {
  const [sheets, setSheets] = useState<Sheet[]>(
    () => sheetsCache.get(url) ?? [],
  );
  const [loading, setLoading] = useState(() => !sheetsCache.has(url));

  useEffect(() => {
    if (sheetsCache.has(url)) return;

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const sheetsData: { name: string; data: (string | null)[][] }[] = [];
        workbook.eachSheet((sheet) => {
          const data: (string | null)[][] = [];
          sheet.eachRow((row) => {
            const values = row.values as ExcelJS.CellValue[];
            data.push(
              values.slice(1).map((cell) => {
                if (cell == null) return null;
                if (typeof cell === "object" && "formula" in cell) {
                  return `=${cell.formula}`;
                }
                return getCellValue(cell);
              }),
            );
          });
          sheetsData.push({ name: sheet.name, data });
        });

        if (sheetsData.length === 0) {
          if (!cancelled) setLoading(false);
          return;
        }

        const hf = HyperFormula.buildFromSheets(
          Object.fromEntries(sheetsData.map((s) => [s.name, s.data])),
          { licenseKey: "gpl-v3" },
        );

        const computed: Sheet[] = sheetsData.map((s, sheetIndex) => ({
          name: s.name,
          celldata: s.data.flatMap((row, r) =>
            row
              .map((_, c) => {
                const val = hf.getCellValue({
                  sheet: sheetIndex,
                  row: r,
                  col: c,
                });
                const m = val == null ? "" : String(val);
                return { r, c, v: { v: m, m } };
              })
              .filter((cell) => cell.v.m !== ""),
          ),
        }));

        sheetsCache.set(url, computed);

        if (!cancelled) {
          setSheets(computed);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load XLSX:", err);
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading XLSX viewer...
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <Workbook
        data={sheets}
        onChange={() => {}}
        allowEdit={false}
        showToolbar={false}
        showFormulaBar={false}
      />
    </div>
  );
}

export default memo(DocumentViewerXlsx);
