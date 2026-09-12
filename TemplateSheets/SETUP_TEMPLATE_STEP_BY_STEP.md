# 🛠️ SETUP TEMPLATE FINUSA - PANDUAN STEP-BY-STEP

## Persiapan Awal

1. Buka Google Sheets (sheets.google.com)
2. Klik "Spreadsheet kosong"
3. Beri nama: "FINUSA - Pengelolaan Keuangan Pribadi"
4. Buat 5 sheet dengan nama: Dashboard, Input Harian, Kategori, Analisis, Target Tabung

---

## 📋 SHEET 1: KATEGORI (Setup Dulu!)

**Kenapa setup ini dulu?** Karena sheet lain akan mereferensi data kategori.

### Step 1: Buat Header
Di baris 1, buat kolom:
- A1: No
- B1: Kategori
- C1: Deskripsi

### Step 2: Format Header
- Select A1:C1
- Klik format (toolbar warna) → Background: Biru (#1a73e8)
- Font: Putih, Bold, 12px
- Alignment: Center

### Step 3: Input Data Kategori
Baris 2-8:

| No | Kategori | Deskripsi |
|----|----------|-----------|
| 1 | Makanan & Minuman | Makanan, minuman, kopi, restoran, snack |
| 2 | Transport | Bensin, ojek, angkot, bus, kereta, parkir, tol |
| 3 | Hiburan | Bioskop, konser, game, hobi, liburan, event |
| 4 | Edukasi | Buku, kursus, les, pelatihan, seminar, tuition |
| 5 | Kesehatan | Obat, dokter, olahraga, gym, wellness, checkup |
| 6 | Utilitas | Listrik, air, internet, telepon, langganan |
| 7 | Lainnya | Pengeluaran lain yang tidak masuk kategori |

### Step 4: Format Kategori (Opsional)
- Column A: Width 5cm, Alignment center
- Column B: Width 15cm, Bold
- Column C: Width 30cm, Text wrapping

### Step 5: Protect Sheet
- Klik sheet menu → "Lindungi sheet" untuk jaga konsistensi

---

## 📝 SHEET 2: INPUT HARIAN

### Step 1: Buat Header (Baris 1)
- A1: Tanggal
- B1: Hari
- C1: Deskripsi
- D1: Kategori
- E1: Jumlah
- F1: Catatan

### Step 2: Format Header
- Select A1:F1
- Background: Biru (#5B9BD5)
- Font: Putih, Bold, 12px
- Alignment: Center

### Step 3: Format Kolom

**Kolom A (Tanggal):**
- Width: 12cm
- Format: Date (DD/MM/YYYY)
- Alignment: Center

**Kolom B (Hari):**
- Width: 12cm
- Alignment: Center
- Jangan isi manual, nanti pakai formula

**Kolom C (Deskripsi):**
- Width: 25cm
- Text wrapping: On
- Alignment: Left

**Kolom D (Kategori):**
- Width: 15cm
- Alignment: Center

**Kolom E (Jumlah):**
- Width: 15cm
- Format: Currency (Rp, 0 decimal)
- Alignment: Right

**Kolom F (Catatan):**
- Width: 20cm
- Text wrapping: On
- Alignment: Left

### Step 4: Setup Data Validation untuk Kategori

1. Select kolom D (D2:D1000) - sesuaikan range sesuai kebutuhan
2. Klik "Data" di menu → "Data validation"
3. Pilih "List from range"
4. Range: Kategori!B2:B8
5. Appearance: "Dropdown dalam sel"
6. Invalid data: Show warning
7. Klik "Save"

### Step 5: Tambah Formula untuk Kolom B (Hari)

Di B2, masukkan:
```
=IF(A2="","",TEXT(A2,"DDDD"))
```

Formula ini akan:
- Jika A2 kosong, tidak tampil apa-apa
- Jika A2 ada tanggal, tampilkan hari dalam bahasa Indonesia

**Catatan:** Google Sheets default menampilkan hari dalam bahasa Inggris. Untuk Indonesian:
```
=IF(A2="","",INDEX({"Senin";"Selasa";"Rabu";"Kamis";"Jumat";"Sabtu";"Minggu"},WEEKDAY(A2)))
```

Copy formula ke bawah (A2:A1000)

### Step 6: Buat 100 Baris Kosong Siap Input
- Select A2
- Drag hingga A101 untuk membuat 100 baris
- Atau copy paste 100 kali

### Step 7: Freeze Header
- Klik "View" → "Freeze" → "1 row"
- Ini agar header tetap terlihat saat scroll

---

## 📊 SHEET 3: DASHBOARD

### Bagian 1: Metrics Card

#### Baris 1-2: Title
- A1: "RINGKASAN KEUANGAN BULAN INI"
- Format: Font 18px, Bold, Biru (#1a73e8)

#### Baris 4-7: Metric Cards

**Row 4: Total Pemasukan**
- A4: "TOTAL PEMASUKAN"
- B4: Formula untuk hitung pemasukan

**Row 5: Total Pengeluaran**
- A5: "TOTAL PENGELUARAN"
- B5: Formula untuk hitung pengeluaran

**Row 6: Sisa Uang**
- A6: "SISA UANG"
- B6: =B4-B5

**Row 7: Target Tabung %**
- A7: "TARGET TABUNG"
- B7: Formula persentase

### Formula untuk B4 dan B5:

**Opsi 1 - Jika ada kategori "Pemasukan":**
```
Total Pemasukan (B4):
=SUMIF('Input Harian'!D:D,"Pemasukan",'Input Harian'!E:E)

Total Pengeluaran (B5):
=SUMIF('Input Harian'!D:D,"<>Pemasukan",'Input Harian'!E:E)
```

**Opsi 2 - Jika tanpa kategori pemasukan (gunakan ini):**
```
Total Pemasukan (B4):
=SUMIF('Input Harian'!D:D,"Makanan",'Input Harian'!E:E)*0+2000000
// Atau masukkan manual dari uang saku yang diterima

Total Pengeluaran (B5):
=SUM('Input Harian'!E:E)
```

**Sisa Uang (B6):**
```
=B4-B5
```

**Target Tabung (B7):**
```
=IFERROR((B6/500000)*100,0)
// 500000 adalah contoh target tabung per bulan, ubah sesuai kebutuhan Anda
```

### Format Metric Cards:
- Column A: Width 20cm, Font 11px, Gray color
- Column B: Width 25cm, Font 16px, Bold, Green color
- Row height: 30px
- Background: Light gray (#f5f5f5)

### Bagian 2: Pengeluaran per Kategori

#### Baris 10: Title
- A10: "PENGELUARAN BERDASARKAN KATEGORI"
- Format: Font 14px, Bold

#### Baris 11: Header
- A11: Kategori
- B11: Jumlah
- C11: Persentase
- Format: Background Biru, Font Putih

#### Baris 12-18: Data Kategori
Di kolom A, buat reference ke Kategori sheet:
```
A12: =Kategori!B2
A13: =Kategori!B3
A14: =Kategori!B4
... dan seterusnya
```

Di kolom B, hitung total per kategori:
```
B12: =SUMIF('Input Harian'!D:D,A12,'Input Harian'!E:E)
B13: =SUMIF('Input Harian'!D:D,A13,'Input Harian'!E:E)
... dan seterusnya
```

Di kolom C, hitung persentase:
```
C12: =IFERROR((B12/SUM($B$12:$B$18))*100,0)%
C13: =IFERROR((B13/SUM($B$12:$B$18))*100,0)%
... dan seterusnya
```

### Format untuk Section Pengeluaran:
- Column B: Currency format (Rp)
- Column C: Number format (0%)
- Conditional formatting: Color gradient (green to red)

### Bagian 3: Pengeluaran Terbaru (10 data terakhir)

#### Baris 21: Title
- A21: "PENGELUARAN TERBARU"

#### Baris 22: Header
- A22: Tanggal
- B22: Deskripsi
- C22: Kategori
- D22: Jumlah

#### Baris 23-32: Data (Manual atau Query)

**Option 1 - Manual dengan sort:**
1. Buka sheet Input Harian
2. Sort by Tanggal descending
3. Copy 10 baris teratas
4. Paste di Dashboard

**Option 2 - Automatic dengan QUERY (Advanced):**
```
A23: 
=QUERY('Input Harian'!A:E,"SELECT A,C,D,E WHERE A IS NOT NULL ORDER BY A DESC LIMIT 10",1)
```

### Format untuk Pengeluaran Terbaru:
- Column D: Currency format (Rp)
- Header: Bold, Background color
- Border: Thin border untuk setiap cell

### Bagian 4: Grafik (Visual)

#### Pie Chart - Distribusi Pengeluaran

1. Select data kategori dan jumlah (A11:B18)
2. Klik "Insert" → "Chart"
3. Chart type: Pie chart
4. Title: "Distribusi Pengeluaran per Kategori"
5. Positioning: Letakkan di sebelah kanan section pengeluaran
6. Size: 400x300px

#### Bar Chart - Pengeluaran Harian

1. Buat helper column di Input Harian untuk tanggal & jumlah
2. Select: Tanggal dan Jumlah
3. Insert chart → Bar chart
4. Title: "Tren Pengeluaran Harian"
5. Positioning: Letakkan di bawah pie chart

---

## 📈 SHEET 4: ANALISIS

### Bagian 1: Summary per Kategori

#### Baris 1: Title
- A1: "SUMMARY PENGELUARAN PER KATEGORI"
- Format: Font 14px, Bold

#### Baris 2: Header
- A2: Kategori
- B2: Total
- C2: Rata-rata
- D2: Count
- E2: Persentase

#### Baris 3-9: Data

Di kolom A, reference kategori:
```
A3: =Kategori!B2
A4: =Kategori!B3
... dst
```

Di kolom B, total per kategori:
```
B3: =SUMIF('Input Harian'!D:D,A3,'Input Harian'!E:E)
```

Di kolom C, rata-rata:
```
C3: =AVERAGEIF('Input Harian'!D:D,A3,'Input Harian'!E:E)
```

Di kolom D, count:
```
D3: =COUNTIF('Input Harian'!D:D,A3)
```

Di kolom E, persentase:
```
E3: =IFERROR((B3/SUM($B$3:$B$9))*100,0)
```

### Bagian 2: Tren 3 Bulan Terakhir

#### Baris 12: Title
- A12: "TREN 3 BULAN TERAKHIR"

#### Baris 13: Header
- A13: Bulan
- B13: Total Pengeluaran
- C13: Rata-rata Harian
- D13: Kategori Tertinggi
- E13: %

#### Baris 14-16: Data

**Contoh untuk September 2024:**
```
A14: September
B14: =SUMIF('Input Harian'!A:A,">=2024-09-01",'Input Harian'!E:E) - SUMIF('Input Harian'!A:A,">2024-09-30",'Input Harian'!E:E)
// Lebih mudah: Manual input atau query by date
C14: =B14/30 (untuk September ada 30 hari)
D14: (Lihat kategori mana yang paling tinggi dari Summary)
E14: (Lihat persentase dari Summary)
```

### Bagian 3: Visualisasi

1. Insert Bar Chart untuk tren 3 bulan
2. Insert Pie Chart untuk kategori terbesar
3. Format dengan warna yang konsisten

---

## 🎯 SHEET 5: TARGET TABUNG

### Baris 1: Title
- A1: "TRACKING TARGET MENABUNG"
- Format: Font 14px, Bold

### Baris 2: Header
- A2: Bulan
- B2: Target Tabung
- C2: Tercapai
- D2: Sisa
- E2: Progress %
- F2: Status

### Baris 3-14: Data 12 Bulan

#### Bulan:
```
A3: Januari
A4: Februari
... dst
```

#### Target Tabung (Manual Input):
```
B3: 500000 (atau sesuai target Anda)
B4: 500000
... dst
```

#### Tercapai (Formula):
```
C3: =SUMIFS('Input Harian'!E:E,'Input Harian'!A:A,">=2024-01-01",'Input Harian'!A:A,"<2024-02-01")
```

Atau lebih sederhana, masukkan manual dari sheet Input Harian setiap bulan.

#### Sisa:
```
D3: =B3-C3
```

#### Progress %:
```
E3: =IFERROR((C3/B3)*100,0)
```

#### Status:
```
F3: =IF(E3>=100,"✅ Tercapai",IF(E3>=80,"⚠️ Hampir","❌ Belum"))
```

### Format:
- Column B, C, D: Currency format (Rp)
- Column E: Percentage format
- Column F: Font size 12px
- Conditional formatting untuk column E: Green (>100%), Yellow (80-100%), Red (<80%)

### Visualisasi:
Insert Line Chart atau Bar Chart untuk melihat tren target tabung selama 12 bulan.

---

## 🎨 FORMATTING TIPS

### Color Scheme:
- Primary: Biru (#1a73e8)
- Secondary: Hijau (#34a853)
- Accent: Orange (#f57c00)
- Danger: Merah (#d32f2f)
- Background: Putih (#ffffff)
- Text: Abu-abu gelap (#333333)

### Typography:
- Heading: Font 14-18px, Bold
- Body: Font 11px, Regular
- Data: Font 11px, Regular

### Spacing:
- Row height untuk header: 30px
- Row height untuk data: 25px
- Column padding: Auto (double-click border)

### Borders:
- Header: Solid border, 1px
- Data rows: Light border, 0.5px

---

## ✅ CHECKLIST FINAL

Sebelum mulai menggunakan template:

- [ ] Semua 5 sheet sudah dibuat dengan nama yang benar
- [ ] Sheet Kategori sudah punya data 7 kategori default
- [ ] Sheet Input Harian sudah punya dropdown validasi
- [ ] Formula di Dashboard sudah correctly reference sheet lain
- [ ] Semua format (currency, date, percentage) sudah diterapkan
- [ ] Header di semua sheet sudah di-format dengan warna
- [ ] Freeze row sudah diterapkan untuk header
- [ ] Pie chart sudah dibuat untuk visualisasi
- [ ] Target Tabung sudah diisi dengan target bulanan Anda
- [ ] Template sudah di-test dengan input dummy 3-5 transaksi

---

## 🚀 LANGKAH PERTAMA SETELAH SETUP

1. **Input 5-10 transaksi dummy** ke sheet Input Harian
2. **Cek Dashboard** - apakah data sudah terupdate?
3. **Cek Analisis** - apakah perhitungan sudah benar?
4. **Cek Grafik** - apakah chart sudah muncul?
5. **Share template** ke device lain dan test akses

---

## 💡 TIPS MAINTENANCE

- **Backup bulanan**: Download sebagai Excel
- **Archive data**: Setiap tahun buat spreadsheet baru
- **Update kategori**: Jika ada kategori baru, update di sheet Kategori
- **Review formula**: Setiap 3 bulan, cek formula masih akurat

---

## 📞 TROUBLESHOOTING COMMON ISSUES

### Issue: Dropdown kategori tidak muncul
**Fix:** Check sheet Kategori ada data, atau setup data validation lagi

### Issue: Formula menunjukkan #REF!
**Fix:** Check sheet name benar, atau referensi range sudah tepat

### Issue: Jumlah di Dashboard tidak sesuai
**Fix:** Check apakah semua pengeluaran sudah di-input, currency format correct

### Issue: Grafik chart tidak muncul
**Fix:** Check ada minimal 2 kategori dengan data, atau refresh browser

---

*Setup selesai! Sekarang Anda siap mulai tracking keuangan pribadi dengan template FINUSA. Happy budgeting! 💰*