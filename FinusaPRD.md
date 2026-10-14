# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# FINUSA (Finance Nusantara) — Versi 2.0 (Live Context)

**Status:** Aktif / In Active Development  
**Kategori:** Personal Finance, Smart OCR Cashflow, & Savings Management Platform  
**Fokus Utama:** Manajemen Keuangan Mandiri, Smart OCR Receipt Scanner, & Target Tabungan Gamifikasi  
**Target Pengguna:** Pelajar, Fresh Graduate, & Profesional Muda Indonesia  

---

## 1. Ringkasan Eksekutif & Identitas Produk

### 1.1 Apa itu FINUSA?
**FINUSA (Finance Nusantara)** adalah platform web manajemen keuangan pribadi yang dirancang untuk pelajar dan generasi muda Indonesia. FINUSA memadukan kemudahan pencatatan mutasi kas harian, automasi pemindaian struk berbasis AI OCR (Gemini Vision), visualisasi ringkasan likuiditas, serta sistem target tabungan interaktif berbasis milestone agar pengguna dapat mengontrol arus kas dan meraih tujuan finansial tanpa beban psikologis (*financial anxiety*).

### 1.2 Masalah yang Diselesaikan
1. **Malas Mencatat Manual:** Pengguna enggan mencatat pengeluaran karena repot mengetik rincian setiap struk belanjaan fisik secara manual.
2. **Kebocoran Kas Tak Terpantau:** Uang bulanan habis tanpa jejak jelas karena ketiadaan visualisasi arus kas masuk vs keluar dan pos pengeluaran terbesar.
3. **Tabungan Tanpa Arah & Mudah Terpakai:** Menabung tanpa target spesifik dan tanpa kompartemen terisolasi berakhir dengan dana terpakai untuk konsumsi impulsif.
4. **Birokrasi & Jargon Rumit:** Aplikasi perbankan konvensional atau software akuntansi formal terlalu kaku, penuh jargon akuntansi, dan memicu kecemasan bagi pemula.

### 1.3 Value Proposition & Diferensiasi Utama
- **Smart OCR Receipt Scanner (Core MVP):** Cukup foto atau unggah struk belanja (minimarket, SPBU, kafe/resto), AI FINUSA otomatis mengekstrak merchant, tanggal, daftar item, pajak/diskon, dan nominal total ke pembukuan dalam hitungan detik.
- **Peralihan dari AI Advisor ke Practical AI:** Menggantikan konsep AI Advisor/Chatbot percakapan yang rentan halusinasi dengan pemindaian struk berbasis AI terapan (*applied AI OCR*) yang memberikan dampak efisiensi waktu langsung setiap hari.
- **Visual Financial Summary Cards:** Visualisasi ringkasan kas interaktif yang menampilkan Pemasukan, Pengeluaran, Rasio Tabungan, dan Pos Terbesar secara instan dan intuitif.
- **Gamifikasi Milestone Tabungan:** Target tabungan dilengkapi perayaan milestone interaktif (25%, 50%, 75%, 100%) untuk membangun kebiasaan menyisihkan uang secara konsisten.
- **Pencatatan Kas Bersih & Bebas Keterikatan Bank:** Sistem mandiri yang berfokus murni pada alokasi kas personal, pos simpanan, dan dompet digital tanpa kerumitan rekonsiliasi rekening koran atau jargon perbankan.
- **Ekosistem Template Terbuka:** Integrasi master template Google Sheets & Excel (*Financial Freedom Management*) bagi pengguna yang membutuhkan budgeting tahunan komprehensif.

---

## 2. Profil Pengguna & Tone of Voice

### 2.1 Persona Pengguna
1. **Pelajar & Generasi Muda (16–22 tahun):**
   - Mengelola uang saku bulanan, beasiswa, atau penghasilan kerja lepas pemula.
   - Membutuhkan kontrol kas harian agar tidak defisit dan memiliki target tabungan untuk gadget belajar, sertifikasi, atau apresiasi diri.
2. **Fresh Graduate / First Jobber (22–26 tahun):**
   - Baru memiliki penghasilan mandiri, mulai membangun dana darurat, dan belajar alokasi anggaran (50/30/20).
3. **Profesional Muda & Freelancer (25–35 tahun):**
   - Memiliki arus kas dinamis, butuh memisahkan pos tabungan dari operasional, dan mencatat pengeluaran belanja harian dengan cepat.

### 2.2 Tone of Voice & Copywriting
- **Bersahabat & Memberdayakan:** Menggunakan sapaan ramah ("Halo, kamu", "Waktu terbaik evaluasi arus kas hari ini"), bukan istilah korporat yang kaku.
- **Solutif & Bebas Jargon Perbankan:** Menggunakan istilah kas yang umum dipahami (Kas Masuk, Kas Keluar, Saldo Kas, Pos Simpanan, Dompet Digital) tanpa istilah rumit seperti jasa giro, rekonsiliasi rekening koran, atau mutasi debet/kredit perbankan.
- **AI yang Membumi & Fungsional:** Memposisikan AI sebagai alat praktis pemindai struk otomatis (*Smart Receipt OCR*), bukan sebagai penasihat makro-ekonomi atau chatbot spekulatif.

---

## 3. Arsitektur Fitur Utama (Live Codebase Mapping)

### 3.1 Home / Dashboard Ringkasan (`/home`)
- **Header Sambutan:** Personalisasi nama pengguna, sapaan dinamis berdasarkan waktu lokal (Pagi, Siang, Sore, Malam), dan status sinkronisasi cloud.
- **4 Financial Summary Cards:**
  - *Kartu Hijau (Kas Masuk):* Total akumulasi pemasukan bulan berjalan.
  - *Kartu Merah (Kas Keluar):* Total pengeluaran kas keluar bulan berjalan.
  - *Kartu Biru (Rasio Tabungan):* Persentase tersimpan dari total pemasukan.
  - *Kartu Kuning (Pos Terbesar):* Kategori pengeluaran tertinggi sebagai fokus efisiensi belanja.
- **Akses Cepat Modul:** Tombol pintas ke Struk Scan, Catat Kas, Monitor Arus Kas, Target Tabungan, dan Template Sheets.
- **Glance Target Tabungan & Aktivitas Terakhir:** Ringkasan progres celengan impian dan riwayat mutasi transaksi terkini.
- **Tips Finansial Harian:** Edukasi mikro literasi keuangan yang berganti secara dinamis setiap hari.

### 3.2 Struk Scan (`/receipt-scanner` & `/ai`) — *Core MVP*
- **Kamera Langsung & Upload Gambar:** Mendukung pengambilan foto langsung dari kamera HP/laptop serta unggah file gambar (.jpg, .png, .webp).
- **Smart OCR Engine (Google Gemini Vision):** Pemrosesan visual berbasis multimodal AI untuk mendeteksi:
  - Nama Toko / Merchant
  - Tanggal & Waktu transaksi
  - Rincian Item Belanja (nama produk, kuantitas, harga satuan, subtotal)
  - Pajak (PPN), diskon belanja, dan nominal total akhir
  - Metode Pembayaran (Cash, QRIS, E-Wallet, Transfer Non-Tunai)
- **Layar Konfirmasi & Koreksi:** Pengguna dapat memvalidasi dan mengoreksi rincian item atau nominal sebelum disimpan.
- **One-Click Simpan ke Pembukuan:** Transaksi langsung tercatat ke dalam buku kas pengeluaran dengan kategori yang otomatis disesuaikan.
- *Status Transisi:* Rute `/ai` secara mulus dialihkan (*redirect*) ke `/receipt-scanner` menggantikan konsep AI Advisor terdahulu.

### 3.3 Catat Kas & Pembukuan Transaksi (`/catat`, rute alias `/pembukuan`)
- **Buku Transaksi (Ledger):** Tabel interaktif dan kartu riwayat transaksi kas masuk, keluar, serta transfer antar pos.
- **Quick Add Bar:** Form pencatatan cepat satu baris untuk mencatat mutasi spontan dalam hitungan detik.
- **Manajemen Kategori Pos Kas:** Pengelompokan pengeluaran dan pemasukan yang relevan (Gaji Pokok, Honor, Profit Jualan, Makan, Kebutuhan, Keinginan, Cicilan, Transportasi).
- **Jadwal Berulang (Recurring):** Otomasi pencatatan tagihan dan pengeluaran rutin berkala (sewa hunian/kos, tagihan internet, langganan digital).
- **Ekspor & Impor Data:** Modal ekspor riwayat transaksi ke format CSV, JSON, atau PDF ringkasan, serta bulk import CSV untuk data historis.
- *Pembersihan Konteks Bank:* Fitur rekonsiliasi mutasi rekening koran bank fiktif telah dieliminasi dari alur kerja agar platform berfokus murni pada pencatatan kas dan dompet personal yang ringan dan mandiri.

### 3.4 Target Tabungan (Nabung) (`/nabung`)
- **Goal Management:** Membuat dan memantau pos simpanan terencana (Dana Darurat, Gadget & Belajar, Kebutuhan Usaha, Pendidikan, Impian & Liburan).
- **Visual Progress Ring:** Tampilan visual persentase capaian target, akumulasi saldo saat ini, sisa nominal yang harus dikumpulkan, serta estimasi waktu tercapai.
- **Setor Dana Mandiri (Add Money):** Menambah saldo tabungan secara fleksibel dengan memilih sumber pos kas (Kas Utama Finansial, Pos Operasional Harian, Celengan Digital, Dompet Digital, Kas Tunai).
- **Simulasi Auto-Save:** Perencanaan penyisihan berkala (harian, mingguan, bulanan) dengan rekomendasi nominal otomatis berdasarkan tanggal target.
- **Milestone Celebration Modal:** Perayaan interaktif saat tabungan menembus milestone 25%, 50%, 75%, dan 100% untuk menjaga motivasi menabung.
- **Smart Insights & Recommendations:** Saran analitis cerdas untuk mengakselerasi target (misal: pengalihan surplus mingguan).
- **Pencapaian & Gamifikasi (Achievements):** Lencana apresiasi konsistensi menabung (Langkah Pertama, Disiplin 30 Hari, Target Juara).
- **Ekspor Data Tabungan:** Rekap data capaian tabungan dalam format CSV/JSON/PDF.

### 3.5 Monitor & Analisis Kas (`/monitor`)
- **KPI Metrics:** Total Saldo Kas Terkonsolidasi, Net Cashflow (Surplus/Defisit), Total Pemasukan, Total Pengeluaran, Rasio Tabungan.
- **Grafik Arus Kas Bulanan (Bar Chart):** Visualisasi perbandingan pemasukan vs pengeluaran antar bulan untuk evaluasi tren keuangan.
- **Breakdown Kategori (Donut Chart):** Distribusi persentase pengeluaran per kategori belanja.
- **Daftar Kompartemen Kas/Dompet:** Ringkasan saldo per pos kas (Kas Utama Usaha, Kas Operasional, Dompet Digital, Kas Tunai).
- **Filter Waktu Fleksibel:** Filter periode (Bulan Ini, 3 Bulan, Tahun Berjalan, Kustom).
- **Ekspor Laporan:** Unduh riwayat laporan keuangan untuk dokumentasi personal.

### 3.6 Template Spreadsheet Master (`/template`)
- **Template Google Sheets & Excel XLSX:** Master spreadsheet *Financial Freedom Management* resmi yang siap disalin ke Google Drive pengguna.
- **Modul Spreadsheet Lengkap:**
  - Executive Financial Dashboard
  - 50/30/20 Budgeting Calculator
  - Debt Snowball Elimination Tracker
  - Wealth & Net Worth Tracker
- **Panduan 3 Langkah:** Petunjuk visual mudah menyalin template dan menggunakannya.

### 3.7 Pengaturan Akun & Keamanan (`/settings`)
- **Profil Pengguna:** Manajemen data pribadi, avatar, nomor telepon, dan bio profil (Pelajar / Pengguna Mandiri).
- **Keamanan & Sandi:** Pembaruan kata sandi akun dan proteksi sesi login.
- **Preferensi Regional:** Pengaturan zona waktu lokal Indonesia (WIB, WITA, WIT).
- **Kontrol & Privasi Data:** Opsi ekspor data lengkap (JSON/CSV) dan fitur penghapusan/pengosongan riwayat kas secara mandiri.

### 3.8 Halaman Publik & Bantuan
- **Landing Page (`/`):** Tampilan modern berlatar gelap hangat (`#0F1419`), trust ticker, showcase fitur inti, deep-dive Struk Scan, perbandingan interaktif, dan CTA pendaftaran gratis.
- **Edukasi Perbandingan (`/perbandingan`):** Halaman simulasi kebocoran finansial harian dan solusi alokasi kompartemen FINUSA.
- **Pusat Bantuan (`/help` & `/bantuan`):** Dokumentasi fitur, panduan langkah demi langkah, dan FAQ.
- **Otentikasi (`/auth/*`):** Alur Login, Signup, Lupa Password, Reset Password terenkripsi berbasis Supabase Auth.

---

## 4. Standar Desain & Arsitektur Teknis

### 4.1 Tech Stack
- **Framework:** Next.js 15 (App Router, Turbopack) + React 19 + TypeScript
- **Styling:** Tailwind CSS + Radix UI / Shadcn primitives
- **Animasi:** Framer Motion (transisi halus 200–300ms) + Pure CSS Hardware Accelerated Marquee
- **Ikonografi:** Lucide React (ikon konsisten, SVG vector murni)
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Auth Services)
- **AI Vision Engine:** Google Gemini API (Multimodal receipt text & structure extraction)

### 4.2 Design Tokens & Palet Warna
- **Base Background:** `#0F1419` (Warm dark neutral)
- **Section Surface:** `#141923` - `#1a1f2e`
- **Card Surface:** `#161c28` - `#1f2534`
- **Primary Accent:** `#4B7BFF` (Interactive Clean Blue)
- **Success / Emerald:** `#10B981` / `#2A9D8F` (Pemasukan, Tabungan, Status Sehat)
- **Warning / Highlight:** `#E8A76F` / `#F59E0B` (Pos Terbesar, Milestone Alert)
- **Danger / Expense:** `#F43F5E` / `#EF4444` (Pengeluaran, Defisit)
- **Tipografi:** Plus Jakarta Sans (Utama) & Monospaced Fonts untuk angka finansial (`tabular-nums`).

---

## 5. Roadmap & Status Implementasi

| Modul / Fitur | Deskripsi | Status |
|---|---|---|
| **Landing Page Modern** | Desain responsif, showcase modul nyata, penonjolan Struk Scan, copy bebas jargon | **SELESAI** |
| **Otentikasi & Akun** | Signup, login, reset password via email, Supabase Auth session | **SELESAI** |
| **Struk Scan (MVP Core)** | Kamera/upload, ekstraksi Vision OCR, konfirmasi item, simpan ke database | **SELESAI** |
| **Dashboard Home** | 4 Summary cards, quick access, glance tabungan, tips finansial harian | **SELESAI** |
| **Catat & Pembukuan** | Buku kas, kategori pos, jadwal berulang, quick add, ekspor CSV/JSON/PDF | **SELESAI** |
| **Target Tabungan (Nabung)** | Kompartemen impian, progress ring, milestone celebration, auto-save simulator | **SELESAI** |
| **Monitor & Analisis Kas** | Diagram arus kas bulanan, breakdown donat, konsolidasi saldo kas | **SELESAI** |
| **Master Sheets Template** | Download master template Financial Freedom Management, panduan integrasi | **SELESAI** |
| **Pengaturan Akun** | Edit profil, ganti password, zona waktu, kosongkan transaksi | **SELESAI** |
| **Pembersihan Konteks Bank** | Menghapus residu rekonsiliasi mutasi rekening koran bank dan nama bank fiktif | **SELESAI** |
| **Generalisasi Persona Pelajar**| Mengubah fokus persona dari mahasiswa eksklusif menjadi pelajar & generasi muda umum | **SELESAI** |
| **PWA & Mobile App** | Adaptasi Progressive Web App & aplikasi native masa depan | **PLANNED** |

---
*Dokumen ini merupakan acuan resmi produk FINUSA (Finance Nusantara) yang telah diselaraskan penuh dengan implementasi codebase terkini.*