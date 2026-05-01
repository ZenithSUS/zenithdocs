import ExcelJS from "exceljs";

function getCellValue(cell: ExcelJS.CellValue): string {
  if (cell == null) return "";
  if (cell instanceof Date) return cell.toLocaleDateString();
  if (typeof cell !== "object") return String(cell);

  // Formula cell
  if ("result" in cell) {
    const result = (cell as ExcelJS.CellFormulaValue).result;
    if (result instanceof Date) return result.toLocaleDateString();
    if (result != null && typeof result !== "object") return String(result);
    return "";
  }

  // Rich text
  if ("richText" in cell) {
    return (cell as ExcelJS.CellRichTextValue).richText
      .map((r) => r.text)
      .join("");
  }

  // Hyperlink
  if ("text" in cell) {
    return String((cell as ExcelJS.CellHyperlinkValue).text);
  }

  // Error cell
  if ("error" in cell) {
    return String((cell as ExcelJS.CellErrorValue).error);
  }

  return "";
}

export default getCellValue;
