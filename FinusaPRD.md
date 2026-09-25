# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# FINUSA (Finance Nusantara) — Versi 2.0 (Live Context)

**Status:** Aktif / In Active Development  
**Kategori:** Personal Finance & Cashflow Management Web Application  
**Fokus Utama:** Manajemen Keuangan Pribadi, Smart OCR Receipt Scanner, & Target Tabungan  
**Target Pengguna:** Mahasiswa, Fresh Graduate, & Young Professional Indonesia  

---

## 1. Ringkasan Eksekutif & Identitas Produk

### 1.1 Apa itu FINUSA?
**FINUSA (Finance Nusantara)** adalah platform web manajemen keuangan pribadi yang dirancang khusus untuk generasi muda Indonesia. FINUSA memadukan kemudahan pencatatan transaksi harian, automasi pemindaian struk berbasis AI OCR, monitoring likuiditas visual, serta sistem target tabungan interaktif agar pengguna dapat mengelola arus kas dan mencapai kemandirian finansial tanpa merasa terbebani (*financial anxiety*).

### 1.2 Masalah yang Diselesaikan
1. **Malas Mencatat Manual:** Kebanyakan orang enggan mencatat pengeluaran karena repot mengetik satu per satu setiap habis belanja.
2. **Uang Habis Tanpa Jejak:** Sulit melihat ke mana larinya pengeluaran bulanan dan berapa rasio tabungan yang sehat.
3. **Tabungan Tanpa Arah:** Menabung tanpa target spesifik dan tanpa visual progress sering kali berakhir dengan tabungan terpakai untuk konsumsi impulsif.
4. **Jargon Keuangan Kaku:** Aplikasi perbankan konvensional cenderung kaku, formal, dan rumit untuk pemula.

### 1.3 Value Proposition & Diferensiasi Utama
- **Smart OCR Scanner (MVP Core):** Cukup foto struk belanja (minimarket, resto, kafe), AI FINUSA otomatis mengekstrak merchant, daftar item, pajak, dan nominal total ke pembukuan dalam hitungan detik.
- **Visual ATM-Card Summary:** Visualisasi ringkasan kas bergaya kartu debit fisik yang intuitif dan menarik secara estetika.
- **Milestone Tabungan:** Gamifikasi progres tabungan dengan perayaan pencapaian target (25%, 50%, 75%, 100%).
- **Ekosistem Template Terbuka:** Opsi integrasi template Google Sheets untuk pengguna yang membutuhkan laporan tahunan komprehensif.

---

## 2. Profil Pengguna & Tone of Voice

### 2.1 Persona Pengguna
1. **Mahasiswa (18–22 tahun):** Mengelola uang saku bulanan, anak kos, butuh kontrol ketat agar tidak defisit di akhir bulan.
2. **Fresh Graduate / First Jobber (22–26 tahun):** Baru memiliki penghasilan sendiri, mulai membangun dana darurat, dan belajar alokasi anggaran (50/30/20).
3. **Young Professional & Freelancer (25–32 tahun):** Memiliki arus kas dinamis, butuh memisahkan pos tabungan dan mencatat pengeluaran operasional secara cepat.

### 2.2 Tone of Voice & Copywriting
- **Bersahabat & Memberdayakan:** Menggunakan sapaan ramah ("Halo, kamu", "Santai dan istirahat yang cukup"), bukan bahasa korporat yang kaku.
- **Solutif & Bebas Jargon:** Menggunakan istilah yang dipahami umum (Pemasukan, Pengeluaran, Saldo Kas, Rasio Tabungan).
- **Anti-Overhyped AI:** Memposisikan AI sebagai asisten praktis ("Scan Struk Otomatis"), bukan sekadar jargon teknologi futuristik atau spekulasi ekonomi makro.

---

## 3. Arsitektur Fitur Utama (Live Application Mapping)

Berdasarkan implementasi kode pada direktori aplikasi (`src/app/(app)/`):

### 3.1 Home / Dashboard Ringkasan (`/home`)
- **Header Sambutan:** Personalisasi nama pengguna, sapaan dinamis waktu, status keaktifan akun.
- **Summary Cards (ATM Credit Card Style):**
  - *Kartu Hijau:* Total Pemasukan bulan berjalan.
  - *Kartu Merah:* Total Pengeluaran kas keluar.
  - *Kartu Biru:* Rasio Tabungan (% tersimpan dari total pemasukan).
  - *Kartu Kuning:* Pos Kategori Terbesar (fokus efisiensi belanja).
- **Akses Cepat Modul:** Tombol pintas ke Scan Struk AI, Monitor Keuangan, Target Tabungan, Catat Transaksi, dan Template Sheets.
- **Glance Target Tabungan & Aktivitas Terakhir:** Ringkasan progres celengan impian dan riwayat mutasi terbaru.
- **Tips Finansial Harian:** Edukasi mikro literasi keuangan yang berganti setiap hari.

### 3.2 Scan Struk AI (`/receipt-scanner` & `/ai`) — *Core MVP*
- **Kamera & Upload File:** Dukungan pengambilan foto langsung via kamera HP/laptop atau unggah file gambar struk (.jpg, .png, .webp).
- **Smart OCR Engine:** Pemrosesan visual untuk mendeteksi:
  - Nama Toko / Merchant
  - Tanggal & Waktu transaksi
  - Daftar Item Belanja (nama produk, kuantitas, harga satuan, subtotal)
  - Pajak (PPN), diskon, dan total akhir
- **Layar Konfirmasi & Koreksi:** Pengguna dapat mengoreksi item jika diperlukan sebelum data disimpan.
- **One-Click Simpan ke Pembukuan:** Transaksi langsung masuk ke buku kas pengeluaran dengan kategori yang sesuai.

### 3.3 Monitor Keuangan & Analisis Kas (`/monitor`)
- **KPI Metrics:** Total Saldo Kas Terkonsolidasi, Net Cashflow, Total Pemasukan, Total Pengeluaran, Rasio Tabungan dengan indikator tren perbandingan periode sebelumnya.
- **Grafik Arus Kas (Bar Chart):** Visualisasi perbandingan pemasukan vs pengeluaran antar bulan.
- **Breakdown Kategori (Donut Chart):** Distribusi pengeluaran per kategori belanja.
- **Filter Fleksibel:** Opsi filter waktu (Bulan Ini, Bulan Lalu, Tahun Berjalan).
- **Ekspor Laporan:** Unduh riwayat laporan keuangan untuk dokumentasi personal.

### 3.4 Target Tabungan (Nabung) (`/nabung`)
- **Goal Management:** Membuat pos tabungan terencana (contoh: Dana Darurat, Liburan, Beli Laptop, Investasi).
- **Detail Target:** Nominal impian, batas waktu (*deadline*), akumulasi saldo saat ini, sisa nominal yang harus dikumpulkan.
- **Setor Dana Manual & Simulasi Auto-Save:** Menambah saldo tabungan secara berkala.
- **Milestone Celebration:** Modal selebrasi interaktif ketika tabungan mencapai progres 25%, 50%, 75%, dan 100% untuk memotivasi pengguna.

### 3.5 Catat & Pembukuan Transaksi (`/catat` & `/pembukuan`)
- **Quick Add Bar:** Form pencatatan cepat satu baris untuk mencatat mutasi spontan.
- **Buku Kas Lengkap:** Tabel & kartu riwayat transaksi dengan penyaringan berdasarkan kategori, tanggal, tipe (pemasukan/pengeluaran), serta pencarian kata kunci.
- **Kategori Kustom:** Kelola kategori pengeluaran dan pemasukan sesuai gaya hidup pengguna.
- **Transaksi Berulang (Recurring):** Otomasi pencatatan tagihan bulanan (kos, internet, langganan streaming).
- **Bulk Import CSV:** Mendukung migrasi data riwayat transaksi lama.

### 3.6 Template Spreadsheet (`/template`)
- **Template Google Sheets Resmi:** Master template spreadsheet *Financial Freedom Management* yang siap di-*copy* ke Google Drive pribadi pengguna untuk budgeting tahunan.
- **Panduan 3 Langkah:** Instruksi visual sederhana untuk menyalin dan menggunakan template.

### 3.7 Pengaturan & Akun (`/settings`)
- Profil pengguna, ganti kata sandi, pengaturan zona waktu lokal, serta opsi kontrol data (*Export Data* & *Reset Account*).

---

## 4. Strategi Landing Page & Benchmark Industri

### 4.1 Pelajaran dari Fintech & Bank Digital Indonesia (Jago, Jenius, Livin')
1. **Hero yang Menjual Manfaat Riil:** Tidak menjual jargon teknis rumit. Fokus pada *benefit*: *"Kelola Keuanganmu, Lebih Cerdas & Teratur"*.
2. **Pratinjau Mockup Nyata:** Menampilkan antarmuka aplikasi sebenarnya (Kartu ATM Ringkasan Saldo, Scan Struk, Progres Tabungan) agar calon pengguna langsung paham apa yang akan didapatkan.
3. **Pemberian Panggung Khusus untuk Fitur Unggulan:** Fitur **Scan Struk AI** disorot secara khusus dengan visual alur foto → ekstraksi → otomatis tercatat.
4. **Trust Signals Terukur:** Keamanan data pengguna, privasi terjamin, gratis digunakan tanpa embel-embel kartu kredit.
5. **Navigasi Presisi:** Navbar intuitif dengan *glow-menu* terintegrasi yang memudahkan berpindah ke seksi fitur, login, dan signup gratis.

### 4.2 Struktur Alur Landing Page FINUSA
```
[1] Navbar (Brand Logo + Glow Menu + CTA Masuk/Mulai Gratis)
[2] Hero Section (Headline Tegas + Mockup Dashboard Finusa Asli + CTA Utama)
[3] Trust Bar (4 Pilar Kepercayaan: Data Terenkripsi, Komunitas Mahasiswa, Gratis Selamanya, Lokalitas Indonesia)
[4] Features Showcase (Hero Card Scan Struk AI + 5 Grid Modul Nyata)
[5] How It Works (3 Langkah Sederhana: Buat Akun → Catat/Scan → Pantau & Capai Goals)
[6] Feature Highlight (Deep Dive Scan Struk AI dengan visual alur kamera & ekstraksi item)
[7] Final CTA Banner (Ajakan Bergabung Ringan & Tanpa Risiko)
[8] Footer (Struktur 4 Kolom: Brand, Produk, Bantuan, Legal)
```

---

## 5. Standar Teknologi & Desain (Design System)

- **Framework:** Next.js 15 (App Router, Turbopack) + TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI primitives
- **Animasi:** Framer Motion (Transisi mulus 200–400ms, *exponential ease-out*)
- **Ikonografi:** Lucide React (SVG konsisten, dilarang memakai emoji sebagai ikon antarmuka)
- **Warna Utama:**
  - *Base Background:* `#0F1419` (Warm dark neutral, bukan pure black/cyberpunk)
  - *Section Surface:* `#1a1f2e`
  - *Card Surface:* `#1f2534`
  - *Primary Accent:* `#4B7BFF` (Muted Interactive Blue)
  - *Success / Secondary:* `#2A9D8F` / `#10B981` (Teal / Emerald)
  - *Warning / Highlight:* `#E8A76F` (Warm Amber)
- **Tipografi:** Plus Jakarta Sans (Utama) & Roboto Mono (Data monospaced/angka numerik finansial `tabular-nums`).

---

## 6. Roadmap & Milestone Pengembangan

| Fase | Deskripsi | Status |
|---|---|---|
| **Fase 1: Landing Page Revamp** | Penataan ulang landing page berbasis real personal finance app, eliminasi materi fiktif (Rupiah Radar), penonjolan OCR AI. | **SELESAI** |
| **Fase 2: Otentikasi & Akun** | Alur pendaftaran, login Supabase Auth, reset password, proteksi route middleware. | **SELESAI** |
| **Fase 3: Core App Modules** | Implementasi lengkap modul Home, Scan Struk, Monitor, Nabung, Catat, Template, dan Settings. | **SELESAI** |
| **Fase 4: Real Data Integration** | Pengayaan integrasi database live (Supabase PostgreSQL), penghitungan dinamis jumlah pengguna aktif untuk social proof. | **IN PROGRESS** |
| **Fase 5: Ekosistem Mobile** | Adaptasi PWA / aplikasi mobile native masa depan (React Native). | **PLANNED** |

---
*Dokumen ini merupakan acuan resmi pengembangan produk FINUSA (Finance Nusantara) dan harus dijadikan panduan konsistensi fitur serta komunikasi publik.*