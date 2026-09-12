# 📊 FINUSA - Template Pengelolaan Keuangan Pribadi
## Panduan Lengkap untuk Mahasiswa dan Orang Awam di Indonesia

---

## 🎯 Tujuan Template

Template FINUSA dirancang khusus untuk membantu Anda:
- ✅ Mengelola uang bulanan/jajan dengan sistematis
- ✅ Memahami pola pengeluaran Anda
- ✅ Merencanakan pengeluaran lebih efisien
- ✅ Mencapai target menabung
- ✅ Membuat keputusan finansial yang lebih baik

---

## 📋 Struktur Template (5 Sheet)

### 1️⃣ DASHBOARD - Ringkasan Visual Keuangan

**Fungsi:** Halaman utama untuk melihat kondisi keuangan Anda secara keseluruhan.

**Komponen Utama:**

#### A. Metrics Card (Ringkasan Angka)
```
┌─────────────────────────────────┐
│ TOTAL PEMASUKAN                 │
│ Rp 2.000.000                    │
└─────────────────────────────────┘
```

**Kolom yang ditampilkan:**
1. **Total Pemasukan** - Jumlah uang yang masuk (uang saku, gaji, bonus)
   - Formula: =SUMIF('Input Harian'!C:C,"Pemasukan",E:E)
   
2. **Total Pengeluaran** - Jumlah uang yang keluar
   - Formula: =SUM('Input Harian'!E:E) atau =SUMIF('Input Harian'!C:C,"<>Pemasukan",E:E)
   
3. **Sisa Uang** - Uang yang tersisa
   - Formula: =B3-B4 (Total Pemasukan - Total Pengeluaran)
   
4. **Target Tabung %** - Persentase pencapaian target menabung
   - Formula: =(B5/Target!B3)*100

#### B. Pengeluaran per Kategori
Menampilkan breakdown pengeluaran dengan:
- Nama kategori
- Total jumlah pengeluaran per kategori
- Persentase dari total pengeluaran
- Progress bar visual

**Contoh Data:**
```
Kategori              | Jumlah    | %
─────────────────────────────────────
Makanan & Minuman     | Rp400.000 | 32%
Transport             | Rp300.000 | 24%
Hiburan               | Rp250.000 | 20%
Lainnya               | Rp300.000 | 24%
─────────────────────────────────────
TOTAL                 | Rp1.250.000 | 100%
```

**Formula untuk kategori:**
- Total: =SUMIF('Input Harian'!D:D,"Makanan",E:E)
- Persentase: =(C:C/SUM(C:C))*100
- Progress Bar: Gunakan conditional formatting dengan gradient

#### C. Pengeluaran Terbaru (10 Data Terakhir)
Tabel yang menampilkan:
- Tanggal
- Deskripsi
- Kategori
- Jumlah
- Hari

**Cara setup:** Filter dan sort otomatis dari sheet "Input Harian" dengan limit 10 baris terbaru.

#### D. Grafik Visual
- **Pie Chart** untuk distribusi pengeluaran per kategori
- **Bar Chart** untuk tren pengeluaran harian
- **Line Chart** untuk tren bulanan (jika data tersedia)

---

### 2️⃣ INPUT HARIAN - Lembar Pencatatan Transaksi

**Fungsi:** Tempat Anda mencatat setiap pengeluaran dan pemasukan.

**Struktur Kolom:**

| Kolom | Format | Keterangan |
|-------|--------|-----------|
| **Tanggal** | Date (DD/MM/YYYY) | Tanggal transaksi terjadi |
| **Hari** | Text (Auto-fill) | Hari dalam bahasa Indonesia |
| **Deskripsi** | Text | Penjelasan singkat transaksi |
| **Kategori** | Dropdown | Pilih dari list kategori |
| **Jumlah** | Currency (Rp) | Nominal uang |
| **Catatan** | Text | Keterangan tambahan (opsional) |

**Validasi Data:**
- Tanggal: Harus format date yang valid
- Kategori: Dropdown dari sheet "Kategori"
- Jumlah: Hanya angka positif

**Contoh Pengisian:**

```
Tanggal  | Hari     | Deskripsi           | Kategori        | Jumlah    | Catatan
─────────────────────────────────────────────────────────────────────────────────
12/09/24 | Rabu     | Lunch di kantin      | Makanan         | 50.000    | Nasi goreng
12/09/24 | Rabu     | Bensin motor        | Transport       | 75.000    | ISI bensin
11/09/24 | Selasa   | Beli buku           | Edukasi         | 150.000   | Buku Ekonomi
11/09/24 | Selasa   | Tagihan internet     | Utilitas        | 100.000   | Bulanan
```

**Tips Penggunaan:**
1. Input setiap hari atau setiap kali ada pengeluaran
2. Gunakan deskripsi yang jelas dan singkat
3. Pilih kategori yang paling sesuai
4. Data otomatis akan terupdate di Dashboard

**Formula Kolom Hari:**
```
=TEXT(A2,"DDDD")  // Bahasa Inggris
atau
=IF(A2="","",INDEX({"Senin";"Selasa";"Rabu";"Kamis";"Jumat";"Sabtu";"Minggu"},WEEKDAY(A2)))
```

---

### 3️⃣ KATEGORI - Daftar Kategori Pengeluaran

**Fungsi:** Mengelola kategori pengeluaran yang tersedia.

**Default Kategori:**

| No | Kategori | Deskripsi |
|----|----------|-----------|
| 1 | Makanan & Minuman | Makanan, minuman, kopi, restoran, snack |
| 2 | Transport | Bensin, ojek, angkot, bus, kereta, parkir, tol |
| 3 | Hiburan | Bioskop, konser, game, hobi, liburan |
| 4 | Edukasi | Buku, kursus, les, pelatihan, seminar |
| 5 | Kesehatan | Obat, dokter, olahraga, gym, wellness |
| 6 | Utilitas | Listrik, air, internet, telepon, langganan |
| 7 | Lainnya | Pengeluaran lain yang tidak masuk kategori |

**Cara Menambah Kategori Baru:**
1. Masuk ke sheet "Kategori"
2. Tambah baris baru dengan nomor urut
3. Isi nama kategori dan deskripsi
4. Kategori otomatis akan muncul di dropdown sheet "Input Harian"

**Coding Warna (Opsional):**
- Makanan: Biru (#5B9BD5)
- Transport: Orange (#ED7D31)
- Hiburan: Pink (#C55A11)
- Edukasi: Hijau (#70AD47)
- Kesehatan: Merah (#E74C3C)
- Utilitas: Ungu (#9B59B6)
- Lainnya: Abu-abu (#95A5A6)

---

### 4️⃣ ANALISIS - Laporan Detail Pengeluaran

**Fungsi:** Memberikan insight mendalam tentang pola pengeluaran Anda.

**Bagian A: Summary per Kategori**

```
Kategori          | Total      | Rata-rata | Count | %
────────────────────────────────────────────────────────
Makanan          | 400.000    | 50.000    | 8     | 32%
Transport        | 300.000    | 100.000   | 3     | 24%
Hiburan          | 250.000    | 125.000   | 2     | 20%
```

**Formula:**
- Total: =SUMIF('Input Harian'!D:D,"Makanan",'Input Harian'!E:E)
- Rata-rata: =AVERAGEIF('Input Harian'!D:D,"Makanan",'Input Harian'!E:E)
- Count: =COUNTIF('Input Harian'!D:D,"Makanan")
- Persentase: =(Total/SUM(Total))*100

**Bagian B: Tren 3 Bulan Terakhir**

```
Bulan     | Total Pengeluaran | Rata-rata Harian | Kategori Tertinggi
──────────────────────────────────────────────────────────────────────
September | Rp 1.250.000      | Rp 41.667         | Makanan (32%)
Agustus   | Rp 1.180.000      | Rp 38.065         | Transport (28%)
Juli      | Rp 1.100.000      | Rp 35.484         | Makanan (35%)
```

**Insight yang Bisa Didapat:**
- Kategori mana yang paling boros?
- Apakah pengeluaran meningkat atau menurun?
- Hari apa biasanya pengeluaran tertinggi?
- Kategori mana yang bisa dihemat?

---

### 5️⃣ TARGET TABUNG - Tracking Target Menabung

**Fungsi:** Memantau progress menabung Anda setiap bulan.

**Struktur:**

| Bulan | Target | Tercapai | Sisa | Progress % | Status |
|-------|--------|----------|------|-----------|--------|
| September | 500.000 | 750.000 | 0 | 150% | ✅ Tercapai+ |
| Agustus | 500.000 | 420.000 | 80.000 | 84% | ⚠️ Hampir |
| Juli | 500.000 | 300.000 | 200.000 | 60% | ❌ Belum |

**Formula:**
- Progress %: =(Tercapai/Target)*100
- Status: =IF(Progress%>=100,"✅ Tercapai",IF(Progress%>=80,"⚠️ Hampir","❌ Belum"))

**Cara Mengatur Target:**
1. Tentukan berapa jumlah yang ingin ditabung per bulan
2. Masukkan di kolom "Target"
3. Kolom "Tercapai" otomatis dihitung dari sheet "Input Harian"
4. Progress bar akan menunjukkan persentase tercapai

---

## 🔧 Cara Menggunakan Template

### Step 1: Setup Awal (15 menit)

1. **Buat copy template**
   - Buka template FINUSA di Google Drive
   - Klik "File" → "Buat salinan"
   - Beri nama: "Keuangan Saya - 2024"

2. **Sesuaikan kategori**
   - Masuk ke sheet "Kategori"
   - Edit kategori sesuai kebutuhan Anda
   - Tambah kategori baru jika perlu

3. **Atur target menabung**
   - Masuk ke sheet "Target Tabung"
   - Masukkan target bulanan Anda

### Step 2: Mulai Input Data

1. **Setiap hari/setelah pengeluaran:**
   - Masuk ke sheet "Input Harian"
   - Tambah baris baru
   - Isi tanggal, deskripsi, kategori, dan jumlah
   - Data otomatis akan terupdate di Dashboard

2. **Contoh input:**
   ```
   Tanggal: 12/09/2024
   Hari: Rabu (auto-fill)
   Deskripsi: Beli kopi di kafe
   Kategori: Makanan & Minuman
   Jumlah: 35000
   Catatan: Kopi Arabika
   ```

### Step 3: Monitor Progress

1. **Harian:** Lihat Dashboard untuk ringkasan hari ini
2. **Mingguan:** Lihat sheet "Analisis" untuk pola mingguan
3. **Bulanan:** Periksa persentase target tabung di sheet "Target Tabung"

---

## 💡 Tips & Trik Penggunaan Efektif

### Tips Input Data
- **Input setiap hari** untuk akurasi maksimal
- **Gunakan deskripsi yang jelas** - jangan hanya "beli" atau "bayar"
- **Jangan lupa categorize** - gunakan dropdown untuk kategori
- **Review mingguan** - cek sheet "Analisis" setiap Jumat/Sabtu

### Tips Penghematan
1. **Identifikasi kategori boros** - lihat pie chart di Dashboard
2. **Set budget per kategori** - bandingkan dengan target
3. **Track pengeluaran yang sama** - cari polanya
4. **Gunakan data untuk negosiasi** - misal tagihan internet

### Tips Menabung
1. **Tentukan target jangka panjang** - 3, 6, 12 bulan
2. **Bagi target menjadi bulanan** - lebih mudah tercapai
3. **Prioritaskan kategori** - mana yang paling penting?
4. **Reward diri** - kalau target tercapai, treat yourself

---

## 📊 Analisis Data yang Bisa Dilakukan

### Pertanyaan yang Bisa Dijawab:

1. **Berapa sih rata-rata pengeluaran saya per hari?**
   - Dashboard → Sisa Uang ÷ hari dalam bulan

2. **Kategori mana yang paling boros?**
   - Dashboard → Pie Chart atau sheet "Analisis"

3. **Apakah pengeluaran saya naik atau turun?**
   - Sheet "Analisis" → Tren 3 bulan terakhir

4. **Kapan saya paling banyak belanja?**
   - Input Harian → Sort by Jumlah descending

5. **Berapa persen pengeluaran saya untuk X?**
   - Sheet "Analisis" → Kolom persentase

### Membuat Insight:

**Contoh Analisis Sederhana:**
```
Bulan September:
- Total Pemasukan: Rp 2.000.000
- Total Pengeluaran: Rp 1.250.000
- Rata-rata per hari: Rp 41.667
- Pengeluaran terbesar: Makanan (32%)
- Pencapaian target: 75% (tercapai Rp 750.000 dari target Rp 1.000.000)

Action Plan:
- Hemat Rp 20.000 per hari dari Makanan
- Kurangi frekuensi makan di luar
- Proyeksi: Bisa hemat Rp 600.000 per bulan
```

---

## ✨ Fitur Advanced (Jika Sudah Mahir)

### 1. Conditional Formatting
Beri warna otomatis untuk:
- Pengeluaran > target harian: Merah
- Pengeluaran < target harian: Hijau
- Pengeluaran = target harian: Kuning

### 2. Data Validation
- Dropdown kategori dengan error message
- Range jumlah pengeluaran yang wajar
- Format tanggal yang konsisten

### 3. Pivot Table
Buat pivot untuk analisis yang lebih detail:
- Sum pengeluaran per kategori per minggu
- Average pengeluaran per hari
- Count transaksi per kategori

### 4. Google Forms Integration
Buat form untuk input pengeluaran (mobile-friendly)

### 5. Automation Script
Script Apps untuk:
- Auto-reminder input pengeluaran
- Auto-notif jika pengeluaran melebihi budget
- Auto-backup data mingguan

---

## 🎓 Best Practices Pengelolaan Keuangan

### Prinsip Umum:
1. **Track semuanya** - tidak ada pengeluaran yang terlalu kecil
2. **Categorize dengan benar** - kategori yang tepat = insight yang tepat
3. **Review reguler** - mingguan atau bulanan
4. **Adjust & improve** - pakai data untuk keputusan

### Strategi Penghematan:
1. **Hemat dari sumber** - kurangi pengeluaran, bukan dari tabungan
2. **Prioritas kebutuhan vs keinginan** - bedakan dengan jelas
3. **Gunakan metode 50-30-20** atau sesuai kebutuhan
4. **Emergency fund dulu** - sebelum investasi

### Metode Budgeting Populer:

**Metode 50-30-20:**
- 50% untuk kebutuhan (makanan, transport, tempat tinggal)
- 30% untuk keinginan (hiburan, hobi)
- 20% untuk tabungan

**Metode Zero-Based Budgeting:**
- Setiap rupiah harus dialokasikan
- Pendapatan - Pengeluaran = 0 (semua terencana)

**Metode Pay Yourself First:**
- Alokasikan tabungan dulu
- Sisa untuk pengeluaran

---

## 🆘 Troubleshooting

### Masalah: Formula tidak muncul hasil
**Solusi:** 
- Pastikan data di sheet "Input Harian" sudah diisi
- Check referensi sheet dan kolom sudah benar
- Refresh page (Ctrl+R atau Cmd+R)

### Masalah: Dropdown kategori tidak muncul
**Solusi:**
- Pastikan sheet "Kategori" sudah ada data
- Data validation belum di-setup, setup manual atau hubungi admin

### Masalah: Grafik chart tidak terupdate
**Solusi:**
- Google Sheets biasanya auto-update
- Jika lambat, tunggu beberapa saat
- Refresh page jika perlu

### Masalah: Sisa uang tidak sesuai perhitungan
**Solusi:**
- Check apakah ada data yang masuk sebagai "Pemasukan"
- Pastikan semua pengeluaran sudah dicatat
- Manual calculation: Pemasukan - Pengeluaran = Sisa

---

## 📱 Akses dari Mobile

### Menggunakan Google Sheets di HP:
1. Download Google Sheets app
2. Buka template di app
3. Input data lebih mudah dengan keyboard
4. Data otomatis sync ke versi desktop

### Tips Mobile-Friendly:
- Buat form input dengan Google Forms
- Sync ke Sheets otomatis
- Lihat Dashboard di mobile view

---

## 🔐 Keamanan & Privacy

### Rekomendasi:
1. **Jangan share spreadsheet yang berisi data pribadi** terlalu luas
2. **Backup berkala** - download sebagai Excel setiap bulan
3. **Password protect** - jika data sensitif
4. **Gunakan personal Google account** - bukan account kantor

---

## 📞 Support & Feedback

Jika ada pertanyaan atau saran:
1. Review panduan ini terlebih dahulu
2. Coba troubleshooting di atas
3. Hubungi pembuat template

---

## 📈 Kesimpulan

Dengan template FINUSA, Anda bisa:
- ✅ Memahami kemana uang Anda pergi
- ✅ Membuat keputusan finansial lebih baik
- ✅ Mencapai target menabung
- ✅ Membangun kebiasaan keuangan yang sehat
- ✅ Merencanakan masa depan lebih baik

**"Uang adalah alat, bukan tujuan. Gunakan dengan bijak."**

---

*Template FINUSA v1.0 - Dibuat dengan ❤️ untuk membantu Anda mengelola keuangan pribadi dengan lebih efisien*

*Terakhir diupdate: September 2024*