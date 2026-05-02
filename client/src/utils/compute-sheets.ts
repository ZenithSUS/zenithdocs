import { HyperFormula } from "hyperformula";
import type { Sheet } from "@fortune-sheet/core";

interface RawSheet {
  name: string;
  data: (string | null)[][];
}

function computeSheet(rawSheets: RawSheet[], sheetIndex: number): Sheet {
  // Check if already computed (keyed without url since rawSheets are already url-scoped)
  // We'll key by reference instead — caller manages the url prefix
  const s = rawSheets[sheetIndex];

  // Build HyperFormula with ONLY this sheet to keep memory/time minimal
  const hf = HyperFormula.buildFromSheets(
    { [s.name]: s.data },
    { licenseKey: "gpl-v3" },
  );

  return {
    name: s.name,
    celldata: s.data.flatMap((row, r) =>
      row
        .map((_, c) => {
          const val = hf.getCellValue({ sheet: 0, row: r, col: c });
          const m = val == null ? "" : String(val);
          return { r, c, v: { v: m, m } };
        })
        .filter((cell) => cell.v.m !== ""),
    ),
  };
}

export default computeSheet;
