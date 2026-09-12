import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { SheetTemplate } from "../types";

/**
 * Format angka sebagai Rupiah string untuk cell Excel.
 */
function formatCellValue(value: string | number): string | number {
  return value;
}

/**
 * Generate dan download file .xlsx dari template.
 */
export async function downloadTemplate(template: SheetTemplate): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Finusa";
  workbook.created = new Date();

  const sheetName = template.name.length > 31
    ? template.name.slice(0, 31)
    : template.name;

  const worksheet = workbook.addWorksheet(sheetName);

  // ── Header Row ──
  const headerRow = worksheet.addRow(template.sampleColumns);
  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11,
      name: "Calibri",
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E3A5F" }, // Dark blue
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF4A7AB5" } },
    };
  });
  headerRow.height = 28;

  // ── Data Rows ──
  template.sampleRows.forEach((row, rowIdx) => {
    const dataRow = worksheet.addRow(
      row.map((val) => formatCellValue(val))
    );

    const isEven = rowIdx % 2 === 0;
    dataRow.eachCell((cell, colNumber) => {
      // Alternating row colors
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEven ? "FFF8FAFC" : "FFFFFFFF" },
      };

      cell.font = {
        size: 10,
        name: "Calibri",
        color: { argb: "FF334155" },
      };

      cell.alignment = {
        vertical: "middle",
      };

      cell.border = {
        bottom: { style: "hair", color: { argb: "FFE2E8F0" } },
      };

      // Format number columns as Indonesian Rupiah
      if (typeof cell.value === "number" && cell.value >= 1000) {
        const colName = template.sampleColumns[colNumber - 1]?.toLowerCase() ?? "";
        if (colName.includes("nominal") || colName.includes("rp") ||
            colName.includes("plafon") || colName.includes("realisasi") ||
            colName.includes("sisa") || colName.includes("saldo") ||
            colName.includes("masuk") || colName.includes("keluar") ||
            colName.includes("net") || colName.includes("omzet") ||
            colName.includes("hpp") || colName.includes("laba") ||
            colName.includes("biaya") || colName.includes("pendapatan") ||
            colName.includes("pph")) {
          cell.numFmt = '#,##0';
        }
      }
    });
  });

  // ── Auto-fit column widths ──
  worksheet.columns.forEach((column) => {
    if (!column.values) return;
    let maxLen = 12;
    column.values.forEach((val) => {
      if (val) {
        const len = String(val).length;
        if (len > maxLen) maxLen = len;
      }
    });
    column.width = Math.min(maxLen + 4, 35);
  });

  // ── Freeze header row ──
  worksheet.views = [
    { state: "frozen", ySplit: 1 },
  ];

  // ── Auto-filter ──
  const lastCol = template.sampleColumns.length;
  const lastRow = template.sampleRows.length + 1;
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: lastRow, column: lastCol },
  };

  // ── Generate & Download ──
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const fileName = `Finusa - ${template.name}.xlsx`;
  saveAs(blob, fileName);
}
