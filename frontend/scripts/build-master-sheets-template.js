const ExcelJS = require("exceljs");
const path = require("path");

async function generateMasterTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "FINUSA Academic Financial Engine";
  workbook.lastModifiedBy = "FINUSA Financial Literacy";
  workbook.created = new Date();
  workbook.modified = new Date();

  // ════════════════════════════════════════════════════════════════════════════
  // SOPHISTICATED COLOR PALETTE (Modern Google Sheets Tables & Fintech Aesthetic)
  // ════════════════════════════════════════════════════════════════════════════
  const colors = {
    // Dark headers / brand
    headerDark: "FF0F172A",       // Slate 900
    sectionBanner: "FF1E293B",    // Slate 800
    subBanner: "FF334155",        // Slate 700

    // Table headers (Modern Google Sheets Tables look: Light slate header with dark text)
    tableHeaderBg: "FFF1F5F9",    // Slate 100
    tableHeaderBorder: "FFCBD5E1",// Slate 300
    tableHeaderText: "FF0F172A",  // Slate 900

    // Borders & Grid
    borderSoft: "FFE2E8F0",       // Slate 200
    zebraBg: "FFF8FAFC",          // Slate 50
    white: "FFFFFFFF",

    // KPI Cards Palette
    kpiIncomeBorder: "FFBFDBFE",  // Blue 200
    kpiIncomeBg: "FFEFF6FF",      // Blue 50
    kpiIncomeText: "FF1D4ED8",    // Blue 700

    kpiExpenseBorder: "FFFECDD3", // Rose 200
    kpiExpenseBg: "FFFFF1F2",     // Rose 50
    kpiExpenseText: "FFBE123C",   // Rose 700

    kpiCashBorder: "FFA7F3D0",    // Emerald 200
    kpiCashBg: "FFECFDF5",        // Emerald 50
    kpiCashText: "FF047857",      // Emerald 700

    kpiBurnBorder: "FFFDE68A",    // Amber 200
    kpiBurnBg: "FFFFFBEB",        // Amber 50
    kpiBurnText: "FFB45309",      // Amber 700

    kpiStatusBorder: "FFCBD5E1",  // Slate 300
    kpiStatusBg: "FFF8FAFC",      // Slate 50
    kpiStatusText: "FF0F172A",    // Slate 900

    textMuted: "FF64748B",        // Slate 500
  };

  const borderAllSoft = {
    top: { style: "thin", color: { argb: colors.borderSoft } },
    bottom: { style: "thin", color: { argb: colors.borderSoft } },
    left: { style: "thin", color: { argb: colors.borderSoft } },
    right: { style: "thin", color: { argb: colors.borderSoft } },
  };

  const borderHeaderTable = {
    top: { style: "medium", color: { argb: colors.tableHeaderBorder } },
    bottom: { style: "medium", color: { argb: colors.tableHeaderBorder } },
    left: { style: "thin", color: { argb: colors.tableHeaderBorder } },
    right: { style: "thin", color: { argb: colors.tableHeaderBorder } },
  };

  const borderTotalRow = {
    top: { style: "thin", color: { argb: colors.tableHeaderBorder } },
    bottom: { style: "double", color: { argb: colors.sectionBanner } },
    left: { style: "thin", color: { argb: colors.borderSoft } },
    right: { style: "thin", color: { argb: colors.borderSoft } },
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 1. WORKSHEET: Dashboard
  // ════════════════════════════════════════════════════════════════════════════
  const wsDash = workbook.addWorksheet("Dashboard", {
    views: [{ showGridLines: true }],
  });
  wsDash.properties.tabColor = { argb: "FF10B981" }; // Emerald

  // Top Header Banner
  wsDash.mergeCells("A2:G2");
  const titleCell = wsDash.getCell("A2");
  titleCell.value = "FINUSA MASTER FINANCIAL CONTROL CENTER";
  titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: colors.white } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.headerDark } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  wsDash.getRow(2).height = 30;

  wsDash.mergeCells("A3:G3");
  const subtitleCell = wsDash.getCell("A3");
  subtitleCell.value = "Sistem Manajemen Arus Kas & Pengendalian Pengeluaran | Berbasis Riset Ekonomi Perilaku Harvard";
  subtitleCell.font = { name: "Arial", size: 9, italic: true, color: { argb: "FF94A3B8" } };
  subtitleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.headerDark } };
  subtitleCell.alignment = { vertical: "middle", horizontal: "center" };
  wsDash.getRow(3).height = 18;

  wsDash.getRow(1).height = 10;
  wsDash.getRow(4).height = 12;

  // KPI CARDS (Row 5 - 7)
  const cards = [
    {
      col: "A",
      title: "TOTAL PEMASUKAN",
      formula: 'SUMIF(Transaksi!D4:D200, "Pemasukan", Transaksi!G4:G200)',
      result: 2500000,
      note: "Uang saku, gaji & transfer",
      borderColor: colors.kpiIncomeBorder,
      bgColor: colors.kpiIncomeBg,
      textColor: colors.kpiIncomeText,
      numFmt: '"Rp "#,##0',
    },
    {
      col: "B",
      title: "TOTAL PENGELUARAN",
      formula: 'SUMIF(Transaksi!D4:D200, "Pengeluaran", Transaksi!G4:G200)',
      result: 1658000,
      note: "Realisasi belanja aktual",
      borderColor: colors.kpiExpenseBorder,
      bgColor: colors.kpiExpenseBg,
      textColor: colors.kpiExpenseText,
      numFmt: '"Rp "#,##0',
    },
    {
      col: "C",
      title: "SISA KAS BERSIH",
      formula: "A6-B6",
      result: 842000,
      note: "Saldo kas likuid tersedia",
      borderColor: colors.kpiCashBorder,
      bgColor: colors.kpiCashBg,
      textColor: colors.kpiCashText,
      numFmt: '"Rp "#,##0',
    },
    {
      col: "D",
      title: "BATAS HARIAN AMAN",
      formula: "ROUND(MAX(0, C6/18), 0)",
      result: 46778,
      note: "Maksimal belanja / hari",
      borderColor: colors.kpiBurnBorder,
      bgColor: colors.kpiBurnBg,
      textColor: colors.kpiBurnText,
      numFmt: '"Rp "#,##0',
    },
  ];

  wsDash.getRow(5).height = 20;
  wsDash.getRow(6).height = 30;
  wsDash.getRow(7).height = 18;

  cards.forEach((c) => {
    // Row 5: Title
    const tCell = wsDash.getCell(`${c.col}5`);
    tCell.value = c.title;
    tCell.font = { name: "Arial", size: 8.5, bold: true, color: { argb: c.textColor } };
    tCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: c.bgColor } };
    tCell.alignment = { vertical: "bottom", horizontal: "center" };
    tCell.border = {
      top: { style: "thin", color: { argb: c.borderColor } },
      left: { style: "thin", color: { argb: c.borderColor } },
      right: { style: "thin", color: { argb: c.borderColor } },
    };

    // Row 6: Value
    const vCell = wsDash.getCell(`${c.col}6`);
    vCell.value = { formula: c.formula, result: c.result };
    vCell.font = { name: "Arial", size: 14, bold: true, color: { argb: c.textColor } };
    vCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: c.bgColor } };
    vCell.alignment = { vertical: "middle", horizontal: "center" };
    vCell.numFmt = c.numFmt;
    vCell.border = {
      left: { style: "thin", color: { argb: c.borderColor } },
      right: { style: "thin", color: { argb: c.borderColor } },
    };

    // Row 7: Subtitle note
    const nCell = wsDash.getCell(`${c.col}7`);
    nCell.value = c.note;
    nCell.font = { name: "Arial", size: 8, italic: true, color: { argb: colors.textMuted } };
    nCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: c.bgColor } };
    nCell.alignment = { vertical: "top", horizontal: "center" };
    nCell.border = {
      bottom: { style: "thin", color: { argb: c.borderColor } },
      left: { style: "thin", color: { argb: c.borderColor } },
      right: { style: "thin", color: { argb: c.borderColor } },
    };
  });

  // Card 5: Status Card (E5:G5 merged, E6:G6 merged, E7:G7 merged)
  wsDash.mergeCells("E5:G5");
  const statTitle = wsDash.getCell("E5");
  statTitle.value = "STATUS KEUANGAN & DIAGNOSTIK KAS";
  statTitle.font = { name: "Arial", size: 8.5, bold: true, color: { argb: colors.kpiStatusText } };
  statTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.kpiStatusBg } };
  statTitle.alignment = { vertical: "bottom", horizontal: "center" };
  wsDash.getCell("E5").border = {
    top: { style: "thin", color: { argb: colors.kpiStatusBorder } },
    left: { style: "thin", color: { argb: colors.kpiStatusBorder } },
    right: { style: "thin", color: { argb: colors.kpiStatusBorder } },
  };

  wsDash.mergeCells("E6:G6");
  const statVal = wsDash.getCell("E6");
  statVal.value = {
    formula: 'IF(C6<0, "🔴 DEFISIT / KRITIS", IF(B6/A6>0.85, "🟡 WASPADA (Kas Menipis)", "🟢 SEHAT & TERKENDALI"))',
    result: "🟢 SEHAT & TERKENDALI",
  };
  statVal.font = { name: "Arial", size: 13, bold: true, color: { argb: "FF065F46" } };
  statVal.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.kpiStatusBg } };
  statVal.alignment = { vertical: "middle", horizontal: "center" };
  wsDash.getCell("E6").border = {
    left: { style: "thin", color: { argb: colors.kpiStatusBorder } },
    right: { style: "thin", color: { argb: colors.kpiStatusBorder } },
  };

  wsDash.mergeCells("E7:G7");
  const statNote = wsDash.getCell("E7");
  statNote.value = "Arus kas bulan ini dalam batas aman (surplus kas terjaga)";
  statNote.font = { name: "Arial", size: 8, italic: true, color: { argb: colors.textMuted } };
  statNote.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.kpiStatusBg } };
  statNote.alignment = { vertical: "top", horizontal: "center" };
  wsDash.getCell("E7").border = {
    bottom: { style: "thin", color: { argb: colors.kpiStatusBorder } },
    left: { style: "thin", color: { argb: colors.kpiStatusBorder } },
    right: { style: "thin", color: { argb: colors.kpiStatusBorder } },
  };

  wsDash.getRow(8).height = 12;

  // ────────────────────────────────────────────────────────────────────────────
  // Section 1: Evaluasi Alokasi 50 / 30 / 20
  // ────────────────────────────────────────────────────────────────────────────
  wsDash.mergeCells("A9:G9");
  const sec1 = wsDash.getCell("A9");
  sec1.value = "⚖️  EVALUASI ALOKASI KEUANGAN: FORMULA 50 / 30 / 20 (ELIZABETH WARREN)";
  sec1.font = { name: "Arial", size: 10.5, bold: true, color: { argb: colors.white } };
  sec1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.sectionBanner } };
  sec1.alignment = { vertical: "middle", horizontal: "left" };
  wsDash.getRow(9).height = 24;

  const alokasiHeaders = [
    "Pilar Alokasi Anggaran",
    "Target Porsi",
    "Batas Plafon",
    "Realisasi Aktual",
    "% Terpakai",
    "Status Evaluasi",
    "Panduan Strategis Harvard",
  ];
  wsDash.getRow(10).values = alokasiHeaders;
  wsDash.getRow(10).height = 24;
  for (let c = 1; c <= 7; c++) {
    const cell = wsDash.getRow(10).getCell(c);
    cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: colors.tableHeaderText } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.tableHeaderBg } };
    cell.alignment = { vertical: "middle", horizontal: c === 1 ? "left" : "center" };
    cell.border = borderHeaderTable;
  }

  const alokasiRows = [
    [
      "Kebutuhan Pokok (Needs: Makan, Kos, Transport, Kuliah)",
      0.50,
      { formula: "A6*0.5", result: 1250000 },
      { formula: 'SUMIF(Transaksi!F4:F200, "Kebutuhan", Transaksi!G4:G200)', result: 1105000 },
      { formula: "D11/A6", result: 0.442 },
      { formula: 'IF(D11<=C11, "🟢 Sesuai Batas", "🔴 Melebihi Plafon")', result: "🟢 Sesuai Batas" },
      "Jaga pengeluaran kebutuhan tidak melampaui 50% pemasukan.",
    ],
    [
      "Keinginan & Rekreasi (Wants: Kopi, Nongkrong, Liburan)",
      0.30,
      { formula: "A6*0.3", result: 750000 },
      { formula: 'SUMIF(Transaksi!F4:F200, "Keinginan", Transaksi!G4:G200)', result: 253000 },
      { formula: "D12/A6", result: 0.1012 },
      { formula: 'IF(D12<=C12, "🟢 Terkendali", "🔴 Bahaya (The Latte Factor!)")', result: "🟢 Terkendali" },
      "Kendalikan jajan harian dan kurangi nongkrong impulsif.",
    ],
    [
      "Tabungan & Masa Depan (Savings: Dana Darurat & Investasi)",
      0.20,
      { formula: "A6*0.2", result: 500000 },
      { formula: 'SUMIF(Transaksi!F4:F200, "Tabungan", Transaksi!G4:G200)', result: 300000 },
      { formula: "D13/A6", result: 0.12 },
      { formula: 'IF(D13>=C13, "🟢 Target Tercapai", "🟡 Tabungan Kurang")', result: "🟡 Tabungan Kurang" },
      "Sisihkan di awal bulan begitu uang saku/gaji masuk (Pay Yourself First).",
    ],
  ];

  alokasiRows.forEach((r, idx) => {
    const rowNum = 11 + idx;
    const row = wsDash.getRow(rowNum);
    row.values = r;
    row.height = 22;
    row.font = { name: "Arial", size: 9 };
    row.getCell(2).numFmt = "0.0%";
    row.getCell(2).alignment = { horizontal: "center" };
    row.getCell(3).numFmt = '"Rp "#,##0';
    row.getCell(4).numFmt = '"Rp "#,##0';
    row.getCell(5).numFmt = "0.0%";
    row.getCell(5).alignment = { horizontal: "center" };
    row.getCell(6).alignment = { horizontal: "center" };

    for (let c = 1; c <= 7; c++) {
      row.getCell(c).border = borderAllSoft;
      if (idx % 2 === 1) {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.zebraBg } };
      }
    }
  });

  // Total Alokasi Row
  const totalAlokasi = wsDash.getRow(14);
  totalAlokasi.values = [
    "TOTAL ALOKASI PENGELUARAN & TABUNGAN",
    { formula: "SUM(B11:B13)", result: 1.0 },
    { formula: "SUM(C11:C13)", result: 2500000 },
    { formula: "SUM(D11:D13)", result: 1658000 },
    { formula: "D14/A6", result: 0.6632 },
    { formula: 'IF(D14<=A6, "🟢 Surplus Kas", "🔴 Defisit Kas")', result: "🟢 Surplus Kas" },
    "Kondisi kas surplus Rp 842.000 (disiplin terjaga).",
  ];
  totalAlokasi.height = 24;
  totalAlokasi.font = { name: "Arial", size: 9.5, bold: true, color: { argb: colors.headerDark } };
  totalAlokasi.getCell(2).numFmt = "0.0%";
  totalAlokasi.getCell(2).alignment = { horizontal: "center" };
  totalAlokasi.getCell(3).numFmt = '"Rp "#,##0';
  totalAlokasi.getCell(4).numFmt = '"Rp "#,##0';
  totalAlokasi.getCell(5).numFmt = "0.0%";
  totalAlokasi.getCell(5).alignment = { horizontal: "center" };
  totalAlokasi.getCell(6).alignment = { horizontal: "center" };

  for (let c = 1; c <= 7; c++) {
    totalAlokasi.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.tableHeaderBg } };
    totalAlokasi.getCell(c).border = borderTotalRow;
  }

  wsDash.getRow(15).height = 14;

  // ────────────────────────────────────────────────────────────────────────────
  // Section 2: Kontrol Plafon Anggaran per Kategori
  // ────────────────────────────────────────────────────────────────────────────
  wsDash.mergeCells("A16:G16");
  const sec2 = wsDash.getCell("A16");
  sec2.value = "🎯  KONTROL PLAFON ANGGARAN BULANAN (BUDGET CEILING)";
  sec2.font = { name: "Arial", size: 10.5, bold: true, color: { argb: colors.white } };
  sec2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.sectionBanner } };
  sec2.alignment = { vertical: "middle", horizontal: "left" };
  wsDash.getRow(16).height = 24;

  const catHeaders = [
    "Kategori Pengeluaran",
    "Pilar Alokasi",
    "Plafon Anggaran",
    "Realisasi Terpakai",
    "Sisa Kuota Anggaran",
    "% Terpakai",
    "Status Keamanan",
  ];
  wsDash.getRow(17).values = catHeaders;
  wsDash.getRow(17).height = 24;
  for (let c = 1; c <= 7; c++) {
    const cell = wsDash.getRow(17).getCell(c);
    cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: colors.tableHeaderText } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.tableHeaderBg } };
    cell.alignment = { vertical: "middle", horizontal: c <= 2 ? "left" : "center" };
    cell.border = borderHeaderTable;
  }

  const categoryDashRows = [
    ["Makanan & Minuman Pokok", "Kebutuhan", { formula: "Budget!C4", result: 750000 }, { formula: "Budget!D4", result: 145000 }, { formula: "Budget!E4", result: 605000 }, { formula: "Budget!F4", result: 0.1933 }, { formula: "Budget!G4", result: "🟢 AMAN" }],
    ["Tempat Tinggal & Kos/Utilitas", "Kebutuhan", { formula: "Budget!C5", result: 850000 }, { formula: "Budget!D5", result: 860000 }, { formula: "Budget!E5", result: -10000 }, { formula: "Budget!F5", result: 1.0117 }, { formula: "Budget!G5", result: "🔴 OVERBUDGET" }],
    ["Transportasi Harian & Bensin", "Kebutuhan", { formula: "Budget!C6", result: 200000 }, { formula: "Budget!D6", result: 80000 }, { formula: "Budget!E6", result: 120000 }, { formula: "Budget!F6", result: 0.40 }, { formula: "Budget!G6", result: "🟢 AMAN" }],
    ["Pendidikan, Buku & Kuliah", "Kebutuhan", { formula: "Budget!C7", result: 150000 }, { formula: "Budget!D7", result: 75000 }, { formula: "Budget!E7", result: 75000 }, { formula: "Budget!F7", result: 0.50 }, { formula: "Budget!G7", result: "🟢 AMAN" }],
    ["Kopi Kekinian & Nongkrong", "Keinginan", { formula: "Budget!C8", result: 150000 }, { formula: "Budget!D8", result: 53000 }, { formula: "Budget!E8", result: 97000 }, { formula: "Budget!F8", result: 0.3533 }, { formula: "Budget!G8", result: "🟢 AMAN" }],
    ["Hiburan, Game & Liburan", "Keinginan", { formula: "Budget!C9", result: 100000 }, { formula: "Budget!D9", result: 50000 }, { formula: "Budget!E9", result: 50000 }, { formula: "Budget!F9", result: 0.50 }, { formula: "Budget!G9", result: "🟢 AMAN" }],
    ["Belanja & Fashion Pribadi", "Keinginan", { formula: "Budget!C10", result: 100000 }, { formula: "Budget!D10", result: 85000 }, { formula: "Budget!E10", result: 15000 }, { formula: "Budget!F10", result: 0.85 }, { formula: "Budget!G10", result: "🟡 HAMPIR HABIS" }],
    ["Kesehatan & Obat", "Kebutuhan", { formula: "Budget!C11", result: 50000 }, { formula: "Budget!D11", result: 25000 }, { formula: "Budget!E11", result: 25000 }, { formula: "Budget!F11", result: 0.50 }, { formula: "Budget!G11", result: "🟢 AMAN" }],
    ["Dana Darurat & Simpanan", "Tabungan", { formula: "Budget!C12", result: 300000 }, { formula: "Budget!D12", result: 300000 }, { formula: "Budget!E12", result: 0 }, { formula: "Budget!F12", result: 1.0 }, { formula: "Budget!G12", result: "🟢 TERCAPAI" }],
    ["Lain-lain / Biaya Tak Terduga", "Kebutuhan", { formula: "Budget!C13", result: 50000 }, { formula: "Budget!D13", result: 0 }, { formula: "Budget!E13", result: 50000 }, { formula: "Budget!F13", result: 0.0 }, { formula: "Budget!G13", result: "🟢 AMAN" }],
  ];

  categoryDashRows.forEach((r, idx) => {
    const rowNum = 18 + idx;
    const row = wsDash.getRow(rowNum);
    row.values = r;
    row.height = 21;
    row.font = { name: "Arial", size: 9 };
    row.getCell(2).alignment = { horizontal: "center" };
    row.getCell(3).numFmt = '"Rp "#,##0';
    row.getCell(4).numFmt = '"Rp "#,##0';
    row.getCell(5).numFmt = '"Rp "#,##0';
    row.getCell(6).numFmt = "0.0%";
    row.getCell(6).alignment = { horizontal: "center" };
    row.getCell(7).alignment = { horizontal: "center" };

    for (let c = 1; c <= 7; c++) {
      row.getCell(c).border = borderAllSoft;
      if (idx % 2 === 1) {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.zebraBg } };
      }
    }
  });

  // Total Category Row
  const totalCatRow = wsDash.getRow(28);
  totalCatRow.values = [
    "TOTAL KESELURUHAN ANGGARAN",
    "10 Kategori",
    { formula: "SUM(C18:C27)", result: 2700000 },
    { formula: "SUM(D18:D27)", result: 1658000 },
    { formula: "SUM(E18:E27)", result: 1042000 },
    { formula: "D28/C28", result: 0.614 },
    { formula: 'IF(D28>C28, "🔴 OVERBUDGET", "🟢 AMAN")', result: "🟢 AMAN" },
  ];
  totalCatRow.height = 24;
  totalCatRow.font = { name: "Arial", size: 9.5, bold: true, color: { argb: colors.headerDark } };
  totalCatRow.getCell(2).alignment = { horizontal: "center" };
  totalCatRow.getCell(3).numFmt = '"Rp "#,##0';
  totalCatRow.getCell(4).numFmt = '"Rp "#,##0';
  totalCatRow.getCell(5).numFmt = '"Rp "#,##0';
  totalCatRow.getCell(6).numFmt = "0.0%";
  totalCatRow.getCell(6).alignment = { horizontal: "center" };
  totalCatRow.getCell(7).alignment = { horizontal: "center" };

  for (let c = 1; c <= 7; c++) {
    totalCatRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.tableHeaderBg } };
    totalCatRow.getCell(c).border = borderTotalRow;
  }

  wsDash.columns = [
    { width: 34 }, // A: Pilar / Kategori
    { width: 18 }, // B: Porsi / Tipe
    { width: 20 }, // C: Batas Plafon
    { width: 20 }, // D: Realisasi
    { width: 20 }, // E: Sisa / %
    { width: 18 }, // F: % Terpakai / Status
    { width: 40 }, // G: Status / Panduan
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // 2. WORKSHEET: Transaksi
  // ════════════════════════════════════════════════════════════════════════════
  const wsInput = workbook.addWorksheet("Transaksi", {
    views: [{ showGridLines: true, state: "frozen", ySplit: 3 }],
  });
  wsInput.properties.tabColor = { argb: "FF3B82F6" }; // Blue

  wsInput.mergeCells("A1:I1");
  const inputTitle = wsInput.getCell("A1");
  inputTitle.value = "BUKU CATATAN TRANSAKSI HARIAN (CASHFLOW LOG)";
  inputTitle.font = { name: "Arial", size: 13, bold: true, color: { argb: colors.white } };
  inputTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.headerDark } };
  inputTitle.alignment = { vertical: "middle", horizontal: "center" };
  wsInput.getRow(1).height = 28;

  wsInput.mergeCells("A2:I2");
  const inputGuide = wsInput.getCell("A2");
  inputGuide.value = "Tips: Catat pengeluaran segera setelah bertransaksi. Hari terisi otomatis. Kategori dan Pilar terintegrasi.";
  inputGuide.font = { name: "Arial", size: 9, italic: true, color: { argb: "FF94A3B8" } };
  inputGuide.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.headerDark } };
  inputGuide.alignment = { vertical: "middle", horizontal: "center" };
  wsInput.getRow(2).height = 18;

  const inputHeaders = [
    "No",
    "Tanggal (YYYY-MM-DD)",
    "Hari",
    "Tipe Aliran",
    "Kategori Transaksi",
    "Pilar Alokasi",
    "Nominal (Rp)",
    "Metode / Dompet",
    "Catatan & Keterangan Rinci",
  ];
  wsInput.getRow(3).values = inputHeaders;
  wsInput.getRow(3).height = 24;
  for (let c = 1; c <= 9; c++) {
    const cell = wsInput.getRow(3).getCell(c);
    cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: colors.tableHeaderText } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.tableHeaderBg } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = borderHeaderTable;
  }
  wsInput.autoFilter = "A3:I3";

  // Realistic sample data for university students / general youths in Indonesia
  const sampleTransactions = [
    [1, "2026-09-01", { formula: 'IF(B4="","",TEXT(B4,"dddd"))', result: "Selasa" }, "Pemasukan", "Uang Saku / Gaji Bulanan", "Pemasukan", 2500000, "Transfer BCA", "Kiriman uang saku bulanan dari orang tua"],
    [2, "2026-09-01", { formula: 'IF(B5="","",TEXT(B5,"dddd"))', result: "Selasa" }, "Pengeluaran", "Tempat Tinggal & Kos/Utilitas", "Kebutuhan", 800000, "Transfer BCA", "Bayar sewa kamar kos bulanan"],
    [3, "2026-09-01", { formula: 'IF(B6="","",TEXT(B6,"dddd"))', result: "Selasa" }, "Pengeluaran", "Dana Darurat & Simpanan", "Tabungan", 300000, "Auto-Debit", "Alokasi tabungan disiplin awal bulan"],
    [4, "2026-09-02", { formula: 'IF(B7="","",TEXT(B7,"dddd"))', result: "Rabu" }, "Pengeluaran", "Makanan & Minuman Pokok", "Kebutuhan", 35000, "GoPay QRIS", "Makan siang nasi padang di dekat kampus"],
    [5, "2026-09-02", { formula: 'IF(B8="","",TEXT(B8,"dddd"))', result: "Rabu" }, "Pengeluaran", "Transportasi Harian & Bensin", "Kebutuhan", 40000, "Tunai", "Isi bensin motor Pertalite full tank"],
    [6, "2026-09-03", { formula: 'IF(B9="","",TEXT(B9,"dddd"))', result: "Kamis" }, "Pengeluaran", "Makanan & Minuman Pokok", "Kebutuhan", 30000, "ShopeePay", "Makan malam warteg"],
    [7, "2026-09-03", { formula: 'IF(B10="","",TEXT(B10,"dddd"))', result: "Kamis" }, "Pengeluaran", "Kopi Kekinian & Nongkrong", "Keinginan", 28000, "QRIS", "Beli es kopi susu gula aren bareng teman"],
    [8, "2026-09-04", { formula: 'IF(B11="","",TEXT(B11,"dddd"))', result: "Jumat" }, "Pengeluaran", "Pendidikan, Buku & Kuliah", "Kebutuhan", 75000, "Transfer", "Fotokopi modul kuliah & jilid laporan"],
    [9, "2026-09-05", { formula: 'IF(B12="","",TEXT(B12,"dddd"))', result: "Sabtu" }, "Pengeluaran", "Tempat Tinggal & Kos/Utilitas", "Kebutuhan", 60000, "BCA Mobile", "Beli token listrik PLN kos"],
    [10, "2026-09-06", { formula: 'IF(B13="","",TEXT(B13,"dddd"))', result: "Minggu" }, "Pengeluaran", "Hiburan, Game & Liburan", "Keinginan", 50000, "OVO", "Nonton bioskop akhir pekan"],
    [11, "2026-09-07", { formula: 'IF(B14="","",TEXT(B14,"dddd"))', result: "Senin" }, "Pengeluaran", "Makanan & Minuman Pokok", "Kebutuhan", 45000, "Tunai", "Makan siang + jus buah"],
    [12, "2026-09-08", { formula: 'IF(B15="","",TEXT(B15,"dddd"))', result: "Selasa" }, "Pengeluaran", "Kesehatan & Obat", "Kebutuhan", 25000, "Tunai", "Beli vitamin C & obat flu di apotek"],
    [13, "2026-09-09", { formula: 'IF(B16="","",TEXT(B16,"dddd"))', result: "Rabu" }, "Pengeluaran", "Kopi Kekinian & Nongkrong", "Keinginan", 25000, "GoPay QRIS", "Kopi cold brew saat ngerjain tugas kelompok"],
    [14, "2026-09-10", { formula: 'IF(B17="","",TEXT(B17,"dddd"))', result: "Kamis" }, "Pengeluaran", "Makanan & Minuman Pokok", "Kebutuhan", 35000, "ShopeePay", "Makan malam mie ayam"],
    [15, "2026-09-11", { formula: 'IF(B18="","",TEXT(B18,"dddd"))', result: "Jumat" }, "Pengeluaran", "Transportasi Harian & Bensin", "Kebutuhan", 40000, "Tunai", "Bensin motor mingguan"],
    [16, "2026-09-12", { formula: 'IF(B19="","",TEXT(B19,"dddd"))', result: "Sabtu" }, "Pengeluaran", "Belanja & Fashion Pribadi", "Keinginan", 85000, "ShopeePay", "Beli kaos polos promo tanggal kembar"],
  ];

  sampleTransactions.forEach((tx, idx) => {
    const rowNum = 4 + idx;
    const row = wsInput.getRow(rowNum);
    row.values = tx;
    row.height = 21;
    row.font = { name: "Arial", size: 9 };
    row.getCell(1).alignment = { horizontal: "center" };
    row.getCell(2).alignment = { horizontal: "center" };
    row.getCell(3).alignment = { horizontal: "center" };
    row.getCell(4).alignment = { horizontal: "center" };
    row.getCell(6).alignment = { horizontal: "center" };
    row.getCell(7).numFmt = '"Rp "#,##0';
    row.getCell(7).alignment = { horizontal: "right" };

    for (let c = 1; c <= 9; c++) {
      row.getCell(c).border = borderAllSoft;
      if (idx % 2 === 1) {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.zebraBg } };
      }
    }
  });

  // Ready blank rows for continuous logging (up to row 120)
  for (let r = 20; r <= 120; r++) {
    const row = wsInput.getRow(r);
    row.values = [r - 3, "", { formula: `IF(B${r}="","",TEXT(B${r},"dddd"))`, result: "" }, "", "", "", "", "", ""];
    row.height = 20;
    row.font = { name: "Arial", size: 9 };
    row.getCell(1).alignment = { horizontal: "center" };
    row.getCell(2).alignment = { horizontal: "center" };
    row.getCell(3).alignment = { horizontal: "center" };
    row.getCell(7).numFmt = '"Rp "#,##0';
    for (let c = 1; c <= 9; c++) {
      row.getCell(c).border = borderAllSoft;
    }
  }

  wsInput.columns = [
    { width: 6 },  // A: No
    { width: 16 }, // B: Tanggal
    { width: 12 }, // C: Hari
    { width: 14 }, // D: Tipe
    { width: 30 }, // E: Kategori
    { width: 16 }, // F: Pilar
    { width: 18 }, // G: Nominal
    { width: 18 }, // H: Metode
    { width: 44 }, // I: Catatan
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // 3. WORKSHEET: Budget
  // ════════════════════════════════════════════════════════════════════════════
  const wsBudget = workbook.addWorksheet("Budget", {
    views: [{ showGridLines: true }],
  });
  wsBudget.properties.tabColor = { argb: "FFF59E0B" }; // Amber

  wsBudget.mergeCells("A1:G1");
  const budgetTitle = wsBudget.getCell("A1");
  budgetTitle.value = "PENETAPAN PLAFON ANGGARAN & MASTER KATEGORI (BUDGET CEILING)";
  budgetTitle.font = { name: "Arial", size: 13, bold: true, color: { argb: colors.white } };
  budgetTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.headerDark } };
  budgetTitle.alignment = { vertical: "middle", horizontal: "center" };
  wsBudget.getRow(1).height = 28;

  wsBudget.mergeCells("A2:G2");
  const budgetSub = wsBudget.getCell("A2");
  budgetSub.value = "Aturan Emas: Tentukan plafon maksimal di awal bulan. Realisasi dihitung otomatis dari buku catatan transaksi.";
  budgetSub.font = { name: "Arial", size: 9, italic: true, color: { argb: "FF94A3B8" } };
  budgetSub.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.headerDark } };
  budgetSub.alignment = { vertical: "middle", horizontal: "center" };
  wsBudget.getRow(2).height = 18;

  const budgetHeaders = [
    "No",
    "Nama Kategori Pengeluaran",
    "Plafon Budget (Batas Max)",
    "Realisasi Pengeluaran",
    "Sisa Kuota Anggaran",
    "% Terpakai",
    "Status Keamanan Budget",
  ];
  wsBudget.getRow(3).values = budgetHeaders;
  wsBudget.getRow(3).height = 24;
  for (let c = 1; c <= 7; c++) {
    const cell = wsBudget.getRow(3).getCell(c);
    cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: colors.tableHeaderText } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.tableHeaderBg } };
    cell.alignment = { vertical: "middle", horizontal: c <= 2 ? "left" : "center" };
    cell.border = borderHeaderTable;
  }
  wsBudget.autoFilter = "A3:G3";

  const budgetItems = [
    [1, "Makanan & Minuman Pokok", 750000, { formula: 'SUMIFS(Transaksi!G$4:G$200, Transaksi!E$4:E$200, B4, Transaksi!D$4:D$200, "Pengeluaran")', result: 145000 }, { formula: "C4-D4", result: 605000 }, { formula: "IF(C4=0,0,D4/C4)", result: 0.1933 }, { formula: 'IF(D4>C4, "🔴 OVERBUDGET", IF(F4>0.8, "🟡 HAMPIR HABIS", "🟢 AMAN"))', result: "🟢 AMAN" }],
    [2, "Tempat Tinggal & Kos/Utilitas", 850000, { formula: 'SUMIFS(Transaksi!G$4:G$200, Transaksi!E$4:E$200, B5, Transaksi!D$4:D$200, "Pengeluaran")', result: 860000 }, { formula: "C5-D5", result: -10000 }, { formula: "IF(C5=0,0,D5/C5)", result: 1.0117 }, { formula: 'IF(D5>C5, "🔴 OVERBUDGET", IF(F5>0.8, "🟡 HAMPIR HABIS", "🟢 AMAN"))', result: "🔴 OVERBUDGET" }],
    [3, "Transportasi Harian & Bensin", 200000, { formula: 'SUMIFS(Transaksi!G$4:G$200, Transaksi!E$4:E$200, B6, Transaksi!D$4:D$200, "Pengeluaran")', result: 80000 }, { formula: "C6-D6", result: 120000 }, { formula: "IF(C6=0,0,D6/C6)", result: 0.40 }, { formula: 'IF(D6>C6, "🔴 OVERBUDGET", IF(F6>0.8, "🟡 HAMPIR HABIS", "🟢 AMAN"))', result: "🟢 AMAN" }],
    [4, "Pendidikan, Buku & Kuliah", 150000, { formula: 'SUMIFS(Transaksi!G$4:G$200, Transaksi!E$4:E$200, B7, Transaksi!D$4:D$200, "Pengeluaran")', result: 75000 }, { formula: "C7-D7", result: 75000 }, { formula: "IF(C7=0,0,D7/C7)", result: 0.50 }, { formula: 'IF(D7>C7, "🔴 OVERBUDGET", IF(F7>0.8, "🟡 HAMPIR HABIS", "🟢 AMAN"))', result: "🟢 AMAN" }],
    [5, "Kopi Kekinian & Nongkrong", 150000, { formula: 'SUMIFS(Transaksi!G$4:G$200, Transaksi!E$4:E$200, B8, Transaksi!D$4:D$200, "Pengeluaran")', result: 53000 }, { formula: "C8-D8", result: 97000 }, { formula: "IF(C8=0,0,D8/C8)", result: 0.3533 }, { formula: 'IF(D8>C8, "🔴 OVERBUDGET", IF(F8>0.8, "🟡 HAMPIR HABIS", "🟢 AMAN"))', result: "🟢 AMAN" }],
    [6, "Hiburan, Game & Liburan", 100000, { formula: 'SUMIFS(Transaksi!G$4:G$200, Transaksi!E$4:E$200, B9, Transaksi!D$4:D$200, "Pengeluaran")', result: 50000 }, { formula: "C9-D9", result: 50000 }, { formula: "IF(C9=0,0,D9/C9)", result: 0.50 }, { formula: 'IF(D9>C9, "🔴 OVERBUDGET", IF(F9>0.8, "🟡 HAMPIR HABIS", "🟢 AMAN"))', result: "🟢 AMAN" }],
    [7, "Belanja & Fashion Pribadi", 100000, { formula: 'SUMIFS(Transaksi!G$4:G$200, Transaksi!E$4:E$200, B10, Transaksi!D$4:D$200, "Pengeluaran")', result: 85000 }, { formula: "C10-D10", result: 15000 }, { formula: "IF(C10=0,0,D10/C10)", result: 0.85 }, { formula: 'IF(D10>C10, "🔴 OVERBUDGET", IF(F10>0.8, "🟡 HAMPIR HABIS", "🟢 AMAN"))', result: "🟡 HAMPIR HABIS" }],
    [8, "Kesehatan & Obat", 50000, { formula: 'SUMIFS(Transaksi!G$4:G$200, Transaksi!E$4:E$200, B11, Transaksi!D$4:D$200, "Pengeluaran")', result: 25000 }, { formula: "C11-D11", result: 25000 }, { formula: "IF(C11=0,0,D11/C11)", result: 0.50 }, { formula: 'IF(D11>C11, "🔴 OVERBUDGET", IF(F11>0.8, "🟡 HAMPIR HABIS", "🟢 AMAN"))', result: "🟢 AMAN" }],
    [9, "Dana Darurat & Simpanan", 300000, { formula: 'SUMIFS(Transaksi!G$4:G$200, Transaksi!E$4:E$200, B12, Transaksi!D$4:D$200, "Pengeluaran")', result: 300000 }, { formula: "C12-D12", result: 0 }, { formula: "IF(C12=0,0,D12/C12)", result: 1.0 }, { formula: 'IF(D12>=C12, "🟢 TERCAPAI", "🟡 KURANG")', result: "🟢 TERCAPAI" }],
    [10, "Lain-lain / Biaya Tak Terduga", 50000, { formula: 'SUMIFS(Transaksi!G$4:G$200, Transaksi!E$4:E$200, B13, Transaksi!D$4:D$200, "Pengeluaran")', result: 0 }, { formula: "C13-D13", result: 50000 }, { formula: "IF(C13=0,0,D13/C13)", result: 0.0 }, { formula: 'IF(D13>C13, "🔴 OVERBUDGET", IF(F13>0.8, "🟡 HAMPIR HABIS", "🟢 AMAN"))', result: "🟢 AMAN" }],
  ];

  budgetItems.forEach((b, idx) => {
    const rowNum = 4 + idx;
    const row = wsBudget.getRow(rowNum);
    row.values = b;
    row.height = 21;
    row.font = { name: "Arial", size: 9 };
    row.getCell(1).alignment = { horizontal: "center" };
    row.getCell(3).numFmt = '"Rp "#,##0';
    row.getCell(4).numFmt = '"Rp "#,##0';
    row.getCell(5).numFmt = '"Rp "#,##0';
    row.getCell(6).numFmt = "0.0%";
    row.getCell(6).alignment = { horizontal: "center" };
    row.getCell(7).alignment = { horizontal: "center" };

    for (let c = 1; c <= 7; c++) {
      row.getCell(c).border = borderAllSoft;
      if (idx % 2 === 1) {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.zebraBg } };
      }
    }
  });

  // Total Budget Row
  const totalRowNum = 14;
  const totRow = wsBudget.getRow(totalRowNum);
  totRow.values = [
    "TOTAL PENGELUARAN & ALOKASI",
    "10 Kategori",
    { formula: "SUM(C4:C13)", result: 2700000 },
    { formula: "SUM(D4:D13)", result: 1658000 },
    { formula: "SUM(E4:E13)", result: 1042000 },
    { formula: "D14/C14", result: 0.614 },
    { formula: 'IF(D14>C14, "🔴 OVERBUDGET", "🟢 AMAN")', result: "🟢 AMAN" },
  ];
  totRow.height = 24;
  totRow.font = { name: "Arial", size: 9.5, bold: true, color: { argb: colors.headerDark } };
  totRow.getCell(2).alignment = { horizontal: "center" };
  totRow.getCell(3).numFmt = '"Rp "#,##0';
  totRow.getCell(4).numFmt = '"Rp "#,##0';
  totRow.getCell(5).numFmt = '"Rp "#,##0';
  totRow.getCell(6).numFmt = "0.0%";
  totRow.getCell(6).alignment = { horizontal: "center" };
  totRow.getCell(7).alignment = { horizontal: "center" };

  for (let c = 1; c <= 7; c++) {
    totRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.tableHeaderBg } };
    totRow.getCell(c).border = borderTotalRow;
  }

  wsBudget.columns = [
    { width: 6 },  // A
    { width: 34 }, // B
    { width: 22 }, // C
    { width: 22 }, // D
    { width: 22 }, // E
    { width: 14 }, // F
    { width: 26 }, // G
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // 4. WORKSHEET: Analisis
  // ════════════════════════════════════════════════════════════════════════════
  const wsAnalysis = workbook.addWorksheet("Analisis", {
    views: [{ showGridLines: true }],
  });
  wsAnalysis.properties.tabColor = { argb: "FF8B5CF6" }; // Purple

  wsAnalysis.mergeCells("A1:D1");
  const analTitle = wsAnalysis.getCell("A1");
  analTitle.value = "DIAGNOSIS PERILAKU KEUANGAN & AUDIT KEBOCORAN KAS";
  analTitle.font = { name: "Arial", size: 13, bold: true, color: { argb: colors.white } };
  analTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.headerDark } };
  analTitle.alignment = { vertical: "middle", horizontal: "center" };
  wsAnalysis.getRow(1).height = 28;

  wsAnalysis.mergeCells("A2:D2");
  const analSub = wsAnalysis.getCell("A2");
  analSub.value = "Identifikasi kebocoran mikro (The Latte Factor) dan laju pengeluaran harian (Daily Burn Rate).";
  analSub.font = { name: "Arial", size: 9, italic: true, color: { argb: "FF94A3B8" } };
  analSub.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.headerDark } };
  analSub.alignment = { vertical: "middle", horizontal: "center" };
  wsAnalysis.getRow(2).height = 18;

  const diagHeaders = [
    "Indikator Diagnostik Perilaku",
    "Nilai Aktual Saat Ini",
    "Batas Referensi Sehat (Benchmark)",
    "Interpretasi & Solusi Finansial Harvard",
  ];
  wsAnalysis.getRow(4).values = diagHeaders;
  wsAnalysis.getRow(4).height = 24;
  for (let c = 1; c <= 4; c++) {
    const cell = wsAnalysis.getRow(4).getCell(c);
    cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: colors.tableHeaderText } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.tableHeaderBg } };
    cell.alignment = { vertical: "middle", horizontal: c === 1 ? "left" : "center" };
    cell.border = borderHeaderTable;
  }
  wsAnalysis.autoFilter = "A4:D4";

  const diagData = [
    [
      "Rata-rata Pengeluaran Harian (Daily Burn Rate)",
      { formula: "ROUND(Dashboard!B6/12, 0)", result: 138167 },
      "Maksimal Rp 75.000 / hari",
      "Kecepatan uang keluar harian. Jika tinggi di awal bulan, periksa pos makan & kos.",
    ],
    [
      "Kebocoran Mikro (Kopi & Jajan / The Latte Factor)",
      { formula: "Budget!D8", result: 53000 },
      "Maksimal Rp 150.000 / bulan",
      "Pengeluaran kecil yang sering diabaikan tapi menyerap 15-25% uang saku.",
    ],
    [
      "Rasio Tabungan Disiplin (Savings Rate)",
      { formula: "Dashboard!D13/Dashboard!A6", result: 0.12 },
      "Minimal 20% dari pemasukan",
      "Pondasi keamanan finansial. Sisihkan di awal sebelum belanja konsumtif.",
    ],
    [
      "Rasio Kebutuhan vs Keinginan",
      { formula: "Dashboard!D11/Dashboard!D12", result: 4.367 },
      "Minimal 1.6x (Kebutuhan > Keinginan)",
      "Sangat sehat jika rasio > 2.0x, menandakan belanja terkonsentrasi pada esensial.",
    ],
  ];

  diagData.forEach((d, idx) => {
    const rowNum = 5 + idx;
    const row = wsAnalysis.getRow(rowNum);
    row.values = d;
    row.height = 24;
    row.font = { name: "Arial", size: 9 };
    if (idx === 0 || idx === 1) {
      row.getCell(2).numFmt = '"Rp "#,##0';
      row.getCell(2).alignment = { horizontal: "right" };
    }
    if (idx === 2) {
      row.getCell(2).numFmt = "0.0%";
      row.getCell(2).alignment = { horizontal: "center" };
    }
    if (idx === 3) {
      row.getCell(2).numFmt = '0.0"x"';
      row.getCell(2).alignment = { horizontal: "center" };
    }

    for (let c = 1; c <= 4; c++) {
      row.getCell(c).border = borderAllSoft;
      if (idx % 2 === 1) {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.zebraBg } };
      }
    }
  });

  wsAnalysis.columns = [
    { width: 42 }, // A
    { width: 22 }, // B
    { width: 30 }, // C
    { width: 56 }, // D
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // 5. WORKSHEET: Tabungan
  // ════════════════════════════════════════════════════════════════════════════
  const wsGoals = workbook.addWorksheet("Tabungan", {
    views: [{ showGridLines: true }],
  });
  wsGoals.properties.tabColor = { argb: "FF14B8A6" }; // Teal

  wsGoals.mergeCells("A1:H1");
  const goalTitle = wsGoals.getCell("A1");
  goalTitle.value = "PERENCANAAN POS TABUNGAN & DANA DARURAT (SINKING FUNDS)";
  goalTitle.font = { name: "Arial", size: 13, bold: true, color: { argb: colors.white } };
  goalTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.headerDark } };
  goalTitle.alignment = { vertical: "middle", horizontal: "center" };
  wsGoals.getRow(1).height = 28;

  wsGoals.mergeCells("A2:H2");
  const goalSub = wsGoals.getCell("A2");
  goalSub.value = "Prinsip Pay Yourself First: Tabung di awal sebelum uang habis terpakai.";
  goalSub.font = { name: "Arial", size: 9, italic: true, color: { argb: "FF94A3B8" } };
  goalSub.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.headerDark } };
  goalSub.alignment = { vertical: "middle", horizontal: "center" };
  wsGoals.getRow(2).height = 18;

  const goalHeaders = [
    "No",
    "Nama Pos Tabungan",
    "Kategori Prioritas",
    "Target Dana (Rp)",
    "Terkumpul Saat Ini",
    "Sisa Kebutuhan",
    "% Capaian",
    "Status Capaian",
  ];
  wsGoals.getRow(3).values = goalHeaders;
  wsGoals.getRow(3).height = 24;
  for (let c = 1; c <= 8; c++) {
    const cell = wsGoals.getRow(3).getCell(c);
    cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: colors.tableHeaderText } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.tableHeaderBg } };
    cell.alignment = { vertical: "middle", horizontal: c <= 2 ? "left" : "center" };
    cell.border = borderHeaderTable;
  }
  wsGoals.autoFilter = "A3:H3";

  const savingsGoals = [
    [1, "Dana Darurat Mahasiswa (3 Bulan Kas)", "Prioritas Utama", 4500000, 1800000, { formula: "D4-E4", result: 2700000 }, { formula: "E4/D4", result: 0.40 }, { formula: 'IF(G4>=1, "🟢 TERCAPAI", IF(G4>=0.5, "🟡 BERJALAN BAIK", "⚪ PROSES AWAL"))', result: "⚪ PROSES AWAL" }],
    [2, "Laptop Belajar & Produktivitas", "Pendidikan", 8000000, 3200000, { formula: "D5-E5", result: 4800000 }, { formula: "E5/D5", result: 0.40 }, { formula: 'IF(G5>=1, "🟢 TERCAPAI", IF(G5>=0.5, "🟡 BERJALAN BAIK", "⚪ PROSES AWAL"))', result: "⚪ PROSES AWAL" }],
    [3, "Ujian Sertifikasi & Pelatihan", "Pengembangan Diri", 1500000, 1000000, { formula: "D6-E6", result: 500000 }, { formula: "E6/D6", result: 0.6667 }, { formula: 'IF(G6>=1, "🟢 TERCAPAI", IF(G6>=0.5, "🟡 BERJALAN BAIK", "⚪ PROSES AWAL"))', result: "🟡 BERJALAN BAIK" }],
    [4, "Liburan Akhir Semester", "Impian & Hadiah Diri", 2000000, 750000, { formula: "D7-E7", result: 1250000 }, { formula: "E7/D7", result: 0.375 }, { formula: 'IF(G7>=1, "🟢 TERCAPAI", IF(G7>=0.5, "🟡 BERJALAN BAIK", "⚪ PROSES AWAL"))', result: "⚪ PROSES AWAL" }],
  ];

  savingsGoals.forEach((sg, idx) => {
    const rowNum = 4 + idx;
    const row = wsGoals.getRow(rowNum);
    row.values = sg;
    row.height = 21;
    row.font = { name: "Arial", size: 9 };
    row.getCell(1).alignment = { horizontal: "center" };
    row.getCell(3).alignment = { horizontal: "center" };
    row.getCell(4).numFmt = '"Rp "#,##0';
    row.getCell(5).numFmt = '"Rp "#,##0';
    row.getCell(6).numFmt = '"Rp "#,##0';
    row.getCell(7).numFmt = "0.0%";
    row.getCell(7).alignment = { horizontal: "center" };
    row.getCell(8).alignment = { horizontal: "center" };

    for (let c = 1; c <= 8; c++) {
      row.getCell(c).border = borderAllSoft;
      if (idx % 2 === 1) {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.zebraBg } };
      }
    }
  });

  // Total Tabungan Row
  const totalGoalRow = wsGoals.getRow(8);
  totalGoalRow.values = [
    "TOTAL SIMPANAN & TARGET TABUNGAN",
    "4 Pos Tabungan",
    "-",
    { formula: "SUM(D4:D7)", result: 16000000 },
    { formula: "SUM(E4:E7)", result: 6750000 },
    { formula: "SUM(F4:F7)", result: 9250000 },
    { formula: "E8/D8", result: 0.4218 },
    { formula: 'IF(G8>=1, "🟢 TERCAPAI", "🟡 SEDANG BERJALAN")', result: "🟡 SEDANG BERJALAN" },
  ];
  totalGoalRow.height = 24;
  totalGoalRow.font = { name: "Arial", size: 9.5, bold: true, color: { argb: colors.headerDark } };
  totalGoalRow.getCell(2).alignment = { horizontal: "center" };
  totalGoalRow.getCell(3).alignment = { horizontal: "center" };
  totalGoalRow.getCell(4).numFmt = '"Rp "#,##0';
  totalGoalRow.getCell(5).numFmt = '"Rp "#,##0';
  totalGoalRow.getCell(6).numFmt = '"Rp "#,##0';
  totalGoalRow.getCell(7).numFmt = "0.0%";
  totalGoalRow.getCell(7).alignment = { horizontal: "center" };
  totalGoalRow.getCell(8).alignment = { horizontal: "center" };

  for (let c = 1; c <= 8; c++) {
    totalGoalRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.tableHeaderBg } };
    totalGoalRow.getCell(c).border = borderTotalRow;
  }

  wsGoals.columns = [
    { width: 6 },  // A: No
    { width: 34 }, // B: Nama
    { width: 22 }, // C: Prioritas
    { width: 20 }, // D: Target
    { width: 20 }, // E: Terkumpul
    { width: 20 }, // F: Sisa
    { width: 16 }, // G: %
    { width: 22 }, // H: Status
  ];

  // Save the master file to TemplateSheets
  const targetPath = path.resolve("e:/File/Project/Finusa/TemplateSheets/FINUSA_Master_Template_Keuangan_Pribadi.xlsx");
  await workbook.xlsx.writeFile(targetPath);
  console.log("Master template generated successfully at:", targetPath);
}

generateMasterTemplate().catch(console.error);
