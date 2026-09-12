const ExcelJS = require("exceljs");
const path = require("path");

async function generateRumahRamaiTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "FINUSA Financial Engine (Grant Sabatier Model)";
  workbook.lastModifiedBy = "FINUSA Personal & Family Finance";
  workbook.created = new Date();
  workbook.modified = new Date();

  // Aesthetic Palette - Warm Pastel Sage, Terracotta, Cream & Soft Slate (ala Rumah Ramai)
  const palette = {
    sageDark: "FF2D5A43",       // Deep Forest Sage
    sageHeader: "FF3D7053",     // Header Sage Green
    sageLight: "FFE8F2EB",      // Soft Sage Tint (Pendapatan)
    sageBorder: "FFB8D5C4",

    terraHeader: "FFA8483B",    // Warm Terracotta (Pengeluaran)
    terraLight: "FFFBECE9",     // Soft Terracotta Tint
    terraBorder: "FFF0C4BD",

    skyHeader: "FF2E6F9E",      // Soft Slate Blue (Investasi)
    skyLight: "FFEBF5FB",       // Soft Sky Tint
    skyBorder: "FFBCDDF2",

    amberHeader: "FF9A6F1A",    // Warm Ochre / Amber (Cicilan)
    amberLight: "FFFEF9E7",     // Soft Cream / Ochre Tint
    amberBorder: "FFF7E4B2",

    slateHeader: "FF2A3439",    // Neutral Slate Dark
    slateLight: "FFF4F6F7",     // Zebra / Light Slate
    slateBorder: "FFD5D8DC",

    white: "FFFFFFFF",
    textDark: "FF1C2833",
    textMuted: "FF566573",
  };

  const borderSoft = {
    top: { style: "thin", color: { argb: palette.slateBorder } },
    bottom: { style: "thin", color: { argb: palette.slateBorder } },
    left: { style: "thin", color: { argb: palette.slateBorder } },
    right: { style: "thin", color: { argb: palette.slateBorder } },
  };

  const makeHeader = (ws, cellRef, text, bgColor, textColor = palette.white, fontSize = 10.5) => {
    const cell = ws.getCell(cellRef);
    cell.value = text;
    cell.font = { name: "Arial", size: fontSize, bold: true, color: { argb: textColor } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 1. SHEET: INPUT MASTER (Monthly Core)
  // ════════════════════════════════════════════════════════════════════════════
  const wsMaster = workbook.addWorksheet("INPUT MASTER", {
    views: [{ showGridLines: true }],
  });
  wsMaster.properties.tabColor = { argb: "FF3D7053" };

  // Main Header Banner
  wsMaster.mergeCells("A1:M1");
  makeHeader(wsMaster, "A1", "FINANCIAL MANAGEMENT - INPUT MASTER BULANAN", palette.slateHeader, palette.white, 13);
  wsMaster.getRow(1).height = 30;

  // ── KOLOM A - D: KONTROL BULAN, RANGKUMAN & ARUS KAS ──
  // Box 1: Bulan & Tahun
  wsMaster.mergeCells("A3:D3");
  makeHeader(wsMaster, "A3", "PERIODE ANGGARAN", palette.slateHeader, palette.white, 9.5);
  wsMaster.getRow(3).height = 22;

  wsMaster.getCell("A4").value = "Bulan";
  wsMaster.getCell("B4").value = "September";
  wsMaster.getCell("C4").value = "Tahun";
  wsMaster.getCell("D4").value = 2026;
  [wsMaster.getCell("A4"), wsMaster.getCell("C4")].forEach(c => {
    c.font = { name: "Arial", size: 9, bold: true, color: { argb: palette.textMuted } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.slateLight } };
    c.alignment = { vertical: "middle", horizontal: "center" };
    c.border = borderSoft;
  });
  [wsMaster.getCell("B4"), wsMaster.getCell("D4")].forEach(c => {
    c.font = { name: "Arial", size: 10, bold: true, color: { argb: palette.textDark } };
    c.alignment = { vertical: "middle", horizontal: "center" };
    c.border = borderSoft;
  });
  wsMaster.getRow(4).height = 24;

  // Box 2: Tabel Rangkuman Arus Kas
  wsMaster.mergeCells("A6:D6");
  makeHeader(wsMaster, "A6", "RANGKUMAN ARUS KAS BULANAN", palette.slateHeader, palette.white, 10);
  wsMaster.getRow(6).height = 24;

  const rangkumanItems = [
    { label: "1. Total Pendapatan", formula: "SUM(H14:H19)", bg: palette.sageLight, text: palette.sageDark, bold: true },
    { label: "2. Total Pengeluaran (Grant Sabatier)", formula: "SUM(M14:M35)", bg: palette.terraLight, text: palette.terraHeader, bold: true },
    { label: "3. Total Investasi", formula: "SUM(H23:H27)", bg: palette.skyLight, text: palette.skyHeader, bold: true },
    { label: "4. Total Cicilan & Hutang", formula: "SUM(H31:H35)", bg: palette.amberLight, text: palette.amberHeader, bold: true },
    { label: "5. Sisa Arus Kas / Tabungan Bersih", formula: "D7-(D8+D9+D10)", bg: palette.slateLight, text: palette.slateHeader, bold: true },
  ];

  rangkumanItems.forEach((item, idx) => {
    const row = 7 + idx;
    wsMaster.mergeCells(`A${row}:C${row}`);
    const lbl = wsMaster.getCell(`A${row}`);
    lbl.value = item.label;
    lbl.font = { name: "Arial", size: 9.5, bold: item.bold, color: { argb: item.text } };
    lbl.fill = { type: "pattern", pattern: "solid", fgColor: { argb: item.bg } };
    lbl.alignment = { vertical: "middle", horizontal: "left" };
    lbl.border = borderSoft;

    const val = wsMaster.getCell(`D${row}`);
    val.value = { formula: item.formula, result: 0 };
    val.font = { name: "Arial", size: 10, bold: true, color: { argb: item.text } };
    val.fill = { type: "pattern", pattern: "solid", fgColor: { argb: item.bg } };
    val.alignment = { vertical: "middle", horizontal: "right" };
    val.numFmt = '"Rp "#,##0';
    val.border = borderSoft;
    wsMaster.getRow(row).height = 23;
  });

  // Health Metrics (Row 12 - 13)
  wsMaster.mergeCells("A12:C12");
  wsMaster.getCell("A12").value = "Rasio Tabungan & Investasi";
  wsMaster.getCell("A12").font = { name: "Arial", size: 8.5, italic: true };
  wsMaster.getCell("A12").alignment = { vertical: "middle", horizontal: "left" };
  wsMaster.getCell("A12").border = borderSoft;

  const rasioInv = wsMaster.getCell("D12");
  rasioInv.value = { formula: "IFERROR((D9+D11)/D7, 0)", result: 0 };
  rasioInv.font = { name: "Arial", size: 9, bold: true };
  rasioInv.alignment = { vertical: "middle", horizontal: "center" };
  rasioInv.numFmt = "0.0%";
  rasioInv.border = borderSoft;

  wsMaster.mergeCells("A13:C13");
  wsMaster.getCell("A13").value = "Rasio Beban Cicilan (Debt Ratio - Max 30%)";
  wsMaster.getCell("A13").font = { name: "Arial", size: 8.5, italic: true };
  wsMaster.getCell("A13").alignment = { vertical: "middle", horizontal: "left" };
  wsMaster.getCell("A13").border = borderSoft;

  const rasioCic = wsMaster.getCell("D13");
  rasioCic.value = { formula: "IFERROR(D10/D7, 0)", result: 0 };
  rasioCic.font = { name: "Arial", size: 9, bold: true };
  rasioCic.alignment = { vertical: "middle", horizontal: "center" };
  rasioCic.numFmt = "0.0%";
  rasioCic.border = borderSoft;

  // Chart Placeholder Box: Arus Kas
  wsMaster.mergeCells("A15:D15");
  makeHeader(wsMaster, "A15", "📊 DIAGRAM ARUS KAS BULANAN", palette.slateHeader, palette.white, 9.5);
  wsMaster.getRow(15).height = 22;

  wsMaster.mergeCells("A16:D28");
  const chartBox1 = wsMaster.getCell("A16");
  chartBox1.value = "[ AREA GRAFIK BATANG: ARUS KAS BULANAN ]\n(Menampilkan visualisasi perbandingan Pendapatan, Pengeluaran, Investasi, dan Cicilan)";
  chartBox1.font = { name: "Arial", size: 9, italic: true, color: { argb: palette.textMuted } };
  chartBox1.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  chartBox1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.slateLight } };
  chartBox1.border = borderSoft;

  // ── KOLOM E - H: PEMASUKAN, INVESTASI, CICILAN ──
  // Donut Chart Placeholder: Pemasukan
  wsMaster.mergeCells("E3:H3");
  makeHeader(wsMaster, "E3", "🍩 PROPORSI PEMASUKAN", palette.sageHeader, palette.white, 9.5);
  wsMaster.mergeCells("E4:H10");
  const chartBoxInc = wsMaster.getCell("E4");
  chartBoxInc.value = "[ DIAGRAM DONAT: SUMBER PEMASUKAN ]";
  chartBoxInc.font = { name: "Arial", size: 9, italic: true, color: { argb: palette.textMuted } };
  chartBoxInc.alignment = { vertical: "middle", horizontal: "center" };
  chartBoxInc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.sageLight } };
  chartBoxInc.border = borderSoft;

  // Table 1: Pemasukan Bulanan
  wsMaster.mergeCells("E12:H12");
  makeHeader(wsMaster, "E12", "DAFTAR PEMASUKAN (INCOME)", palette.sageHeader, palette.white, 10);
  wsMaster.getRow(12).height = 24;

  const incHeaders = ["No", "Sumber Pendapatan", "Kategori Aliran", "Nominal (Rp)"];
  wsMaster.getRow(13).values = ["", "", "", "", ...incHeaders];
  for (let c = 5; c <= 8; c++) {
    const cell = wsMaster.getRow(13).getCell(c);
    cell.font = { name: "Arial", size: 9, bold: true, color: { argb: palette.sageDark } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.sageLight } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = borderSoft;
  }
  wsMaster.getRow(13).height = 22;

  const incRows = [
    [1, "Gaji Pokok / Uang Saku Utama", "Gaji Utama", 0],
    [2, "Tunjangan / Insentif / Bonus", "Gaji Utama", 0],
    [3, "Freelance / Side Project", "Freelance", 0],
    [4, "Bisnis / Jualan / UMKM", "Bisnis", 0],
    [5, "Passive Income (Dividen/Bunga/Sewa)", "Passive Income", 0],
    [6, "Lain-lain / Hadiah / Transfer", "Lainnya", 0],
  ];

  incRows.forEach((r, i) => {
    const rowNum = 14 + i;
    wsMaster.getCell(`E${rowNum}`).value = r[0];
    wsMaster.getCell(`F${rowNum}`).value = r[1];
    wsMaster.getCell(`G${rowNum}`).value = r[2];
    wsMaster.getCell(`H${rowNum}`).value = r[3];

    wsMaster.getCell(`E${rowNum}`).alignment = { horizontal: "center" };
    wsMaster.getCell(`H${rowNum}`).numFmt = '"Rp "#,##0';
    for (let c = 5; c <= 8; c++) {
      wsMaster.getRow(rowNum).getCell(c).font = { name: "Arial", size: 9 };
      wsMaster.getRow(rowNum).getCell(c).border = borderSoft;
      if (i % 2 === 1) wsMaster.getRow(rowNum).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.slateLight } };
    }
    wsMaster.getRow(rowNum).height = 20;
  });

  // Table 2: Investasi Bulanan
  wsMaster.mergeCells("E21:H21");
  makeHeader(wsMaster, "E21", "ALOKASI INVESTASI BULANAN", palette.skyHeader, palette.white, 10);
  wsMaster.getRow(21).height = 24;

  const invHeaders = ["No", "Instrumen Investasi", "Kategori Aset", "Nominal (Rp)"];
  wsMaster.getRow(22).values = ["", "", "", "", ...invHeaders];
  for (let c = 5; c <= 8; c++) {
    const cell = wsMaster.getRow(22).getCell(c);
    cell.font = { name: "Arial", size: 9, bold: true, color: { argb: palette.skyHeader } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.skyLight } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = borderSoft;
  }
  wsMaster.getRow(22).height = 22;

  const invRows = [
    [1, "Reksa Dana (Pasar Uang / Obligasi)", "Pasar Uang", 0],
    [2, "Saham / ETF (IHSG / Global)", "Ekuitas", 0],
    [3, "Emas Fisik / Logam Mulia Digital", "Komoditas", 0],
    [4, "Surat Berharga Negara (SBN / Sukuk)", "Pendapatan Tetap", 0],
    [5, "Aset Kripto / P2P / Lainnya", "Aset Alternatif", 0],
  ];

  invRows.forEach((r, i) => {
    const rowNum = 23 + i;
    wsMaster.getCell(`E${rowNum}`).value = r[0];
    wsMaster.getCell(`F${rowNum}`).value = r[1];
    wsMaster.getCell(`G${rowNum}`).value = r[2];
    wsMaster.getCell(`H${rowNum}`).value = r[3];

    wsMaster.getCell(`E${rowNum}`).alignment = { horizontal: "center" };
    wsMaster.getCell(`H${rowNum}`).numFmt = '"Rp "#,##0';
    for (let c = 5; c <= 8; c++) {
      wsMaster.getRow(rowNum).getCell(c).font = { name: "Arial", size: 9 };
      wsMaster.getRow(rowNum).getCell(c).border = borderSoft;
      if (i % 2 === 1) wsMaster.getRow(rowNum).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.slateLight } };
    }
    wsMaster.getRow(rowNum).height = 20;
  });

  // Table 3: Cicilan & Hutang Berjalan
  wsMaster.mergeCells("E29:H29");
  makeHeader(wsMaster, "E29", "PELACAK CICILAN & HUTANG BERJALAN", palette.amberHeader, palette.white, 10);
  wsMaster.getRow(29).height = 24;

  const debtHeaders = ["No", "Nama Cicilan / Kredit", "Sisa Tenor", "Cicilan / Bulan"];
  wsMaster.getRow(30).values = ["", "", "", "", ...debtHeaders];
  for (let c = 5; c <= 8; c++) {
    const cell = wsMaster.getRow(30).getCell(c);
    cell.font = { name: "Arial", size: 9, bold: true, color: { argb: palette.amberHeader } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.amberLight } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = borderSoft;
  }
  wsMaster.getRow(30).height = 22;

  const debtRows = [
    [1, "KPR / Sewa Hunian Jangka Panjang", "120 Bulan", 0],
    [2, "Kredit Kendaraan (Motor/Mobil)", "24 Bulan", 0],
    [3, "Kartu Kredit / Paylater", "Lunas Bulan Ini", 0],
    [4, "Cicilan Gadget / Elektronik", "6 Bulan", 0],
    [5, "Pinjaman Lainnya", "12 Bulan", 0],
  ];

  debtRows.forEach((r, i) => {
    const rowNum = 31 + i;
    wsMaster.getCell(`E${rowNum}`).value = r[0];
    wsMaster.getCell(`F${rowNum}`).value = r[1];
    wsMaster.getCell(`G${rowNum}`).value = r[2];
    wsMaster.getCell(`H${rowNum}`).value = r[3];

    wsMaster.getCell(`E${rowNum}`).alignment = { horizontal: "center" };
    wsMaster.getCell(`G${rowNum}`).alignment = { horizontal: "center" };
    wsMaster.getCell(`H${rowNum}`).numFmt = '"Rp "#,##0';
    for (let c = 5; c <= 8; c++) {
      wsMaster.getRow(rowNum).getCell(c).font = { name: "Arial", size: 9 };
      wsMaster.getRow(rowNum).getCell(c).border = borderSoft;
      if (i % 2 === 1) wsMaster.getRow(rowNum).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.slateLight } };
    }
    wsMaster.getRow(rowNum).height = 20;
  });

  // ── KOLOM I - M: PENGELUARAN (GRANT SABATIER MODEL) ──
  // Donut Chart Placeholder: Pengeluaran
  wsMaster.mergeCells("I3:M3");
  makeHeader(wsMaster, "I3", "🍩 PROPORSI PENGELUARAN (THE BIG 3)", palette.terraHeader, palette.white, 9.5);
  wsMaster.mergeCells("I4:M10");
  const chartBoxExp = wsMaster.getCell("I4");
  chartBoxExp.value = "[ DIAGRAM DONAT: KATEGORI PENGELUARAN ]\n(Tempat Tinggal, Transportasi, Makanan, Gaya Hidup)";
  chartBoxExp.font = { name: "Arial", size: 9, italic: true, color: { argb: palette.textMuted } };
  chartBoxExp.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  chartBoxExp.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.terraLight } };
  chartBoxExp.border = borderSoft;

  // Table Pengeluaran Sabatier
  wsMaster.mergeCells("I12:M12");
  makeHeader(wsMaster, "I12", "DAFTAR PENGELUARAN BULANAN (GRANT SABATIER)", palette.terraHeader, palette.white, 10);
  wsMaster.getRow(12).height = 24;

  const expHeaders = ["No", "Pilar Kategori", "Sub-Kategori / Pos Pengeluaran", "Tipe", "Nominal (Rp)"];
  wsMaster.getRow(13).values = ["", "", "", "", "", "", "", "", ...expHeaders];
  for (let c = 9; c <= 13; c++) {
    const cell = wsMaster.getRow(13).getCell(c);
    cell.font = { name: "Arial", size: 9, bold: true, color: { argb: palette.terraHeader } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.terraLight } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = borderSoft;
  }

  const expItems = [
    // 1. Tempat Tinggal (The Big 1)
    [1, "🏠 Tempat Tinggal", "Sewa Kos / Kontrakan / IPL", "Kebutuhan", 0],
    [2, "🏠 Tempat Tinggal", "Listrik & Token PLN", "Kebutuhan", 0],
    [3, "🏠 Tempat Tinggal", "Air & Gas Tabung", "Kebutuhan", 0],
    [4, "🏠 Tempat Tinggal", "Internet Wifi / Kuota Data", "Kebutuhan", 0],
    [5, "🏠 Tempat Tinggal", "Perlengkapan & Kebersihan Rumah", "Kebutuhan", 0],
    // 2. Transportasi (The Big 2)
    [6, "🚗 Transportasi", "Bahan Bakar (Bensin / Pertalite / Pertamax)", "Kebutuhan", 0],
    [7, "🚗 Transportasi", "Transportasi Umum / Ojek Online (Gojek/Grab)", "Kebutuhan", 0],
    [8, "🚗 Transportasi", "Parkir, Tol & Cuci Kendaraan", "Kebutuhan", 0],
    [9, "🚗 Transportasi", "Perawatan, Servis & Ganti Oli", "Kebutuhan", 0],
    // 3. Makanan & Minuman (The Big 3)
    [10, "🍲 Makanan & Minuman", "Belanja Bahan Makanan Pokok (Pasar/Supermarket)", "Kebutuhan", 0],
    [11, "🍲 Makanan & Minuman", "Makan Harian di Luar (Warteg/Kantin)", "Kebutuhan", 0],
    [12, "🍲 Makanan & Minuman", "Kopi Susu, Camilan & Jajan Sore (Latte Factor)", "Keinginan", 0],
    [13, "🍲 Makanan & Minuman", "Pesan Antar Makanan (ShopeeFood/GoFood)", "Keinginan", 0],
    // 4. Kesehatan & Diri
    [14, "💊 Kesehatan", "BPJS Kesehatan / Asuransi", "Kebutuhan", 0],
    [15, "💊 Kesehatan", "Obat-obatan, Vitamin & Medis", "Kebutuhan", 0],
    [16, "💊 Kesehatan", "Skincare & Perawatan Tubuh", "Kebutuhan", 0],
    // 5. Gaya Hidup & Lainnya
    [17, "🎉 Gaya Hidup", "Langganan Digital (Netflix/Spotify/iCloud)", "Keinginan", 0],
    [18, "🎉 Gaya Hidup", "Nongkrong, Hiburan & Bioskop", "Keinginan", 0],
    [19, "🎉 Gaya Hidup", "Belanja Pakaian & Fashion Pribadi", "Keinginan", 0],
    [20, "🤝 Sosial & Donasi", "Uang Orang Tua / Keluarga (Sandwich Gen)", "Kebutuhan", 0],
    [21, "🤝 Sosial & Donasi", "Zakat, Infaq, Sedekah & Hadiah Teman", "Kebutuhan", 0],
    [22, "📦 Lain-lain", "Pengeluaran Tak Terduga / Darurat", "Kebutuhan", 0],
  ];

  expItems.forEach((r, i) => {
    const rowNum = 14 + i;
    wsMaster.getCell(`I${rowNum}`).value = r[0];
    wsMaster.getCell(`J${rowNum}`).value = r[1];
    wsMaster.getCell(`K${rowNum}`).value = r[2];
    wsMaster.getCell(`L${rowNum}`).value = r[3];
    wsMaster.getCell(`M${rowNum}`).value = r[4];

    wsMaster.getCell(`I${rowNum}`).alignment = { horizontal: "center" };
    wsMaster.getCell(`L${rowNum}`).alignment = { horizontal: "center" };
    wsMaster.getCell(`M${rowNum}`).numFmt = '"Rp "#,##0';

    for (let c = 9; c <= 13; c++) {
      wsMaster.getRow(rowNum).getCell(c).font = { name: "Arial", size: 9 };
      wsMaster.getRow(rowNum).getCell(c).border = borderSoft;
      if (i % 2 === 1) wsMaster.getRow(rowNum).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.slateLight } };
    }
    wsMaster.getRow(rowNum).height = 20;
  });

  // Column Widths for INPUT MASTER
  wsMaster.columns = [
    { width: 7 },   // A: No / Rangkuman label
    { width: 14 },  // B: Bulan / Tanggal
    { width: 12 },  // C: Tahun
    { width: 18 },  // D: Rangkuman Value
    { width: 5 },   // E: No Inc
    { width: 28 },  // F: Sumber
    { width: 16 },  // G: Kategori
    { width: 18 },  // H: Nominal Inc/Inv/Cic
    { width: 5 },   // I: No Exp
    { width: 22 },  // J: Pilar Sabatier
    { width: 34 },  // K: Sub Kategori
    { width: 14 },  // L: Tipe
    { width: 18 },  // M: Nominal Exp
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // 2. SHEET: OVERVIEW SATU TAHUN (12-Month Annual Consolidation)
  // ════════════════════════════════════════════════════════════════════════════
  const wsYear = workbook.addWorksheet("OVERVIEW SATU TAHUN", {
    views: [{ showGridLines: true }],
  });
  wsYear.properties.tabColor = { argb: "FF2E6F9E" };

  wsYear.mergeCells("A1:P1");
  makeHeader(wsYear, "A1", "OVERVIEW TAHUNAN - LAPORAN ARUS KAS 12 BULAN", palette.slateHeader, palette.white, 13);
  wsYear.getRow(1).height = 30;

  // 3 Big Visual KPI Cards on Top
  // Card 1: Total Pendapatan Tahunan (Col B - E)
  wsYear.mergeCells("B3:E3");
  makeHeader(wsYear, "B3", "TOTAL PENDAPATAN 1 TAHUN", palette.sageHeader, palette.white, 9.5);
  wsYear.mergeCells("B4:E5");
  const yrInc = wsYear.getCell("B4");
  yrInc.value = { formula: "SUM(B10:M10)", result: 0 };
  yrInc.font = { name: "Arial", size: 16, bold: true, color: { argb: palette.sageDark } };
  yrInc.alignment = { vertical: "middle", horizontal: "center" };
  yrInc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.sageLight } };
  yrInc.numFmt = '"Rp "#,##0';
  [wsYear.getCell("B3"), yrInc].forEach(c => c.border = borderSoft);

  // Card 2: Total Pengeluaran Tahunan (Col G - J)
  wsYear.mergeCells("G3:J3");
  makeHeader(wsYear, "G3", "TOTAL PENGELUARAN 1 TAHUN", palette.terraHeader, palette.white, 9.5);
  wsYear.mergeCells("G4:J5");
  const yrExp = wsYear.getCell("G4");
  yrExp.value = { formula: "SUM(B18:M18)", result: 0 };
  yrExp.font = { name: "Arial", size: 16, bold: true, color: { argb: palette.terraHeader } };
  yrExp.alignment = { vertical: "middle", horizontal: "center" };
  yrExp.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.terraLight } };
  yrExp.numFmt = '"Rp "#,##0';
  [wsYear.getCell("G3"), yrExp].forEach(c => c.border = borderSoft);

  // Card 3: Total Investasi & Tabungan (Col L - O)
  wsYear.mergeCells("L3:O3");
  makeHeader(wsYear, "L3", "TOTAL INVESTASI & TABUNGAN", palette.skyHeader, palette.white, 9.5);
  wsYear.mergeCells("L4:O5");
  const yrInv = wsYear.getCell("L4");
  yrInv.value = { formula: "SUM(B19:M19)+SUM(B21:M21)", result: 0 };
  yrInv.font = { name: "Arial", size: 16, bold: true, color: { argb: palette.skyHeader } };
  yrInv.alignment = { vertical: "middle", horizontal: "center" };
  yrInv.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.skyLight } };
  yrInv.numFmt = '"Rp "#,##0';
  [wsYear.getCell("L3"), yrInv].forEach(c => c.border = borderSoft);

  wsYear.getRow(3).height = 20;
  wsYear.getRow(4).height = 20;
  wsYear.getRow(5).height = 20;

  // Master 12-Month Table
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const yearTableHeaders = ["Kategori Arus Kas", ...months, "TOTAL TAHUN", "RATA-RATA / BLN"];

  wsYear.getRow(8).values = yearTableHeaders;
  wsYear.getRow(8).height = 26;
  for (let c = 1; c <= 15; c++) {
    const cell = wsYear.getRow(8).getCell(c);
    cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: palette.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.slateHeader } };
    cell.alignment = { vertical: "middle", horizontal: c === 1 ? "left" : "center" };
    cell.border = borderSoft;
  }

  const annualStructure = [
    // 1. PENDAPATAN
    { row: 9, name: "1. TOTAL PENDAPATAN (INCOME)", isHeader: true, bg: palette.sageLight, color: palette.sageDark },
    { row: 10, name: "   - Pemasukan Kas Bersih", formulaSeed: (col) => col === 10 ? "='INPUT MASTER'!D7" : 0 },

    // 2. PENGELUARAN (SABATIER)
    { row: 11, name: "2. PENGELUARAN BULANAN (EXPENSES)", isHeader: true, bg: palette.terraLight, color: palette.terraHeader },
    { row: 12, name: "   - 🏠 Tempat Tinggal & Utilitas", formulaSeed: (col) => col === 10 ? "=SUM('INPUT MASTER'!M14:M18)" : 0 },
    { row: 13, name: "   - 🚗 Transportasi Harian", formulaSeed: (col) => col === 10 ? "=SUM('INPUT MASTER'!M19:M22)" : 0 },
    { row: 14, name: "   - 🍲 Makanan & Minuman", formulaSeed: (col) => col === 10 ? "=SUM('INPUT MASTER'!M23:M26)" : 0 },
    { row: 15, name: "   - 💊 Kesehatan & Perawatan", formulaSeed: (col) => col === 10 ? "=SUM('INPUT MASTER'!M27:M29)" : 0 },
    { row: 16, name: "   - 🎉 Gaya Hidup, Sosial & Lainnya", formulaSeed: (col) => col === 10 ? "=SUM('INPUT MASTER'!M30:M35)" : 0 },
    { row: 17, name: "   TOTAL PENGELUARAN", isTotal: true, formulaRow: "SUM(B12:B16)", bg: palette.terraLight, color: palette.terraHeader },

    // 3. INVESTASI
    { row: 18, name: "3. TOTAL INVESTASI (ASSETS)", isHeader: true, bg: palette.skyLight, color: palette.skyHeader },
    { row: 19, name: "   - Reksadana, Saham, Emas, SBN", formulaSeed: (col) => col === 10 ? "='INPUT MASTER'!D9" : 0 },

    // 4. CICILAN
    { row: 20, name: "4. TOTAL CICILAN & HUTANG", isHeader: true, bg: palette.amberLight, color: palette.amberHeader },
    { row: 21, name: "   - Cicilan Berjalan", formulaSeed: (col) => col === 10 ? "='INPUT MASTER'!D10" : 0 },

    // 5. NET CASHFLOW
    { row: 22, name: "5. SISA ARUS KAS BERSIH (NET CASHFLOW)", isGrandTotal: true, formulaRow: "B10-(B17+B19+B21)", bg: palette.slateLight, color: palette.slateHeader },
  ];

  annualStructure.forEach(item => {
    const row = wsYear.getRow(item.row);
    row.getCell(1).value = item.name;
    row.getCell(1).font = { name: "Arial", size: 9, bold: item.isHeader || item.isTotal || item.isGrandTotal, color: { argb: item.color || palette.textDark } };
    row.getCell(1).border = borderSoft;
    row.height = 21;

    if (item.bg) {
      row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: item.bg } };
    }

    // Populate Jan (Col 2) to Des (Col 13)
    for (let c = 2; c <= 13; c++) {
      const colLetter = String.fromCharCode(64 + c);
      const cell = row.getCell(c);
      cell.border = borderSoft;

      if (item.isHeader) {
        cell.value = "";
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: item.bg } };
      } else if (item.isTotal) {
        cell.value = { formula: `SUM(${colLetter}12:${colLetter}16)`, result: 0 };
        cell.font = { name: "Arial", size: 9, bold: true, color: { argb: item.color } };
        cell.numFmt = '"Rp "#,##0';
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: item.bg } };
      } else if (item.isGrandTotal) {
        cell.value = { formula: `${colLetter}10-(${colLetter}17+${colLetter}19+${colLetter}21)`, result: 0 };
        cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: item.color } };
        cell.numFmt = '"Rp "#,##0';
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: item.bg } };
      } else if (item.formulaSeed) {
        const formulaStr = item.formulaSeed(c);
        if (typeof formulaStr === "string" && formulaStr.startsWith("=")) {
          cell.value = { formula: formulaStr.substring(1), result: 0 };
        } else {
          cell.value = 0;
        }
        cell.font = { name: "Arial", size: 9 };
        cell.numFmt = '"Rp "#,##0';
      }
    }

    // Column 14: TOTAL TAHUN
    const totCell = row.getCell(14);
    totCell.border = borderSoft;
    if (!item.isHeader) {
      totCell.value = { formula: `SUM(B${item.row}:M${item.row})`, result: 0 };
      totCell.font = { name: "Arial", size: 9, bold: true };
      totCell.numFmt = '"Rp "#,##0';
      totCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.slateLight } };
    }

    // Column 15: RATA-RATA / BLN
    const avgCell = row.getCell(15);
    avgCell.border = borderSoft;
    if (!item.isHeader) {
      avgCell.value = { formula: `AVERAGE(B${item.row}:M${item.row})`, result: 0 };
      avgCell.font = { name: "Arial", size: 9, bold: true };
      avgCell.numFmt = '"Rp "#,##0';
      avgCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.slateLight } };
    }
  });

  // Column Widths for OVERVIEW SATU TAHUN
  wsYear.columns = [
    { width: 34 }, // A: Kategori
    { width: 14 }, // B: Jan
    { width: 14 }, // C: Feb
    { width: 14 }, // D: Mar
    { width: 14 }, // E: Apr
    { width: 14 }, // F: Mei
    { width: 14 }, // G: Jun
    { width: 14 }, // H: Jul
    { width: 14 }, // I: Agu
    { width: 14 }, // J: Sep
    { width: 14 }, // K: Okt
    { width: 14 }, // L: Nov
    { width: 14 }, // M: Des
    { width: 18 }, // N: TOTAL TAHUN
    { width: 18 }, // O: RATA-RATA
  ];

  // Save the master file to TemplateSheets
  const targetPath = path.resolve("e:/File/Project/Finusa/TemplateSheets/FINUSA_Financial_Management_Master.xlsx");
  await workbook.xlsx.writeFile(targetPath);
  console.log("Master template generated successfully at:", targetPath);
}

generateRumahRamaiTemplate().catch(console.error);
