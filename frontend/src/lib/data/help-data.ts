export interface FormFieldGuide {
  name: string;
  required: boolean;
  type: string;
  description: string;
}

export interface StepGuide {
  stepNumber: number;
  title: string;
  instruction: string;
  details?: string[];
}

export interface TroubleshootingItem {
  issue: string;
  solution: string;
}

export interface HelpArticle {
  id: string;
  categoryId: string;
  categoryTitle: string;
  title: string;
  description: string;
  readTime: string;
  purpose: string;
  steps: StepGuide[];
  formFields?: FormFieldGuide[];
  screenshotPlaceholder?: {
    title: string;
    caption: string;
  };
  bestPractices: string[];
  troubleshooting: TroubleshootingItem[];
}

export interface HelpCategory {
  id: string;
  title: string;
  articles: HelpArticle[];
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: "nabung",
    title: "Target Tabungan (Nabung)",
    articles: [
      {
        id: "konsep-tabungan",
        categoryId: "nabung",
        categoryTitle: "Target Tabungan (Nabung)",
        title: "Konsep Kantong Celengan Digital",
        description: "Pelajari bagaimana FINUSA memisahkan pos tabungan dari dana operasional harian guna mencegah uang terpakai tanpa sadar.",
        readTime: "3 menit",
        purpose: "Membantu pengguna mengalokasikan dana ke dalam pos-pos tujuan finansial tertentu (misalnya Dana Darurat, Tabungan Liburan, Biaya Pendidikan) secara terisolasi tanpa tercampur di rekening harian.",
        steps: [
          {
            stepNumber: 1,
            title: "Pahami Pemisahan Pos Kas",
            instruction: "Tabungan di FINUSA berfungsi sebagai celengan virtual terpisah. Uang yang dimasukkan ke target tabungan tidak akan dihitung sebagai kas bebas untuk belanja harian di menu Monitor.",
            details: [
              "Dana darurat disarankan minimal 3 sampai 6 kali pengeluaran bulanan.",
              "Setiap pos memiliki batas target nominal dan estimasi tanggal penyelesaian."
            ]
          },
          {
            stepNumber: 2,
            title: "Navigasi ke Halaman Nabung",
            instruction: "Buka menu navigasi utama pada sidebar lalu pilih menu Nabung.",
            details: [
              "Di halaman ini terdapat ringkasan total target aktif, total dana terkumpul, dan persentase pencapaian keseluruhan."
            ]
          }
        ],
        bestPractices: [
          "Prioritaskan pengisian pos Dana Darurat sebelum membuat pos tabungan konsumtif.",
          "Gunakan metode pembagian 50/30/20 (50% kebutuhan pokok, 30% keinginan, 20% tabungan/investasi)."
        ],
        troubleshooting: [
          {
            issue: "Apakah saldo di tabungan otomatis terpotong dari rekening bank asli saya?",
            solution: "FINUSA adalah sistem pencatatan dan pemantauan mandiri. Transaksi fisik pemindahan uang antar-rekening tetap dilakukan via aplikasi perbankan Anda, sementara FINUSA mencatat alokasi dan status pencapaiannya secara real-time."
          }
        ]
      },
      {
        id: "tambah-target-tabungan",
        categoryId: "nabung",
        categoryTitle: "Target Tabungan (Nabung)",
        title: "Cara Menambah Target Tabungan Baru",
        description: "Panduan langkah demi langkah membuat target tabungan baru dari formulir hingga penentuan tenggat waktu.",
        readTime: "4 menit",
        purpose: "Membuat wadah celengan baru dengan spesifikasi nominal target, kategori tujuan, dan batas waktu penyelesaian yang terukur.",
        steps: [
          {
            stepNumber: 1,
            title: "Buka Halaman Nabung",
            instruction: "Masuk ke halaman Nabung melalui menu navigasi samping.",
            details: [
              "Perhatikan tombol aksi utama di pojok kanan atas halaman."
            ]
          },
          {
            stepNumber: 2,
            title: "Klik Tombol Tambah Target",
            instruction: "Klik tombol '+ Tambah Target' untuk membuka jendela formulir pembuatan target tabungan.",
            details: [
              "Jendela modal akan terbuka dengan beberapa input data yang wajib diisi."
            ]
          },
          {
            stepNumber: 3,
            title: "Lengkapi Rincian Formulir",
            instruction: "Isi nama pos tabungan, nominal target yang ingin dicapai, setoran awal (jika ada), serta tenggat waktu target tercapai.",
            details: [
              "Gunakan nama target yang spesifik, contoh: 'Dana Darurat 6 Bulan' atau 'Beli Laptop Kerja'.",
              "Pilih kategori pos yang relevan (Darurat, Investasi, Pendidikan, Elektronik, dll)."
            ]
          },
          {
            stepNumber: 4,
            title: "Simpan Target Baru",
            instruction: "Periksa kembali nominal yang dimasukkan, lalu klik tombol 'Simpan Target'. Target tabungan baru akan langsung muncul di daftar celengan aktif dengan progres awal 0%.",
            details: [
              "Sistem akan otomatis menghitung rekomendasi setoran rutin bulanan berdasarkan tenggat waktu yang dipilih."
            ]
          }
        ],
        formFields: [
          {
            name: "Nama Target",
            required: true,
            type: "Teks (Maks. 50 karakter)",
            description: "Nama penanda tujuan tabungan. Contoh: Tabungan Nikah, Dana Darurat, Asuransi Tahunan."
          },
          {
            name: "Target Nominal (Rp)",
            required: true,
            type: "Angka / Rupiah",
            description: "Total nominal dana yang harus terkumpul untuk mencapai target ini."
          },
          {
            name: "Setoran Awal (Rp)",
            required: false,
            type: "Angka / Rupiah",
            description: "Jumlah uang yang sudah tersedia dan langsung dialokasikan ke pos ini saat pembuatan. Default adalah Rp 0."
          },
          {
            name: "Tenggat Waktu (Target Date)",
            required: true,
            type: "Tanggal (Date Picker)",
            description: "Estimasi tanggal ketika target tabungan diharapkan selesai terkumpul."
          },
          {
            name: "Kategori Pos",
            required: true,
            type: "Pilihan Dropdown",
            description: "Klasifikasi pos tabungan: Dana Darurat, Investasi, Properti, Kendaraan, Liburan, Pendidikan, Gadget/Alat Kerja."
          }
        ],
        screenshotPlaceholder: {
          title: "Formulir Pembuatan Target Tabungan",
          caption: "Tampilan modal pembuatan target baru dengan kolom nama, nominal target, tanggal jatuh tempo, dan kategori pos."
        },
        bestPractices: [
          "Bagi target besar menjadi beberapa target berjangka pendek agar psikologi menabung tetap terjaga.",
          "Gunakan tenggat waktu realistis berdasarkan sisa kas bersih bulanan yang tertera di menu Monitor."
        ],
        troubleshooting: [
          {
            issue: "Tombol Simpan Target tidak dapat diklik (berwarna abu-abu)",
            solution: "Pastikan seluruh kolom bertanda bintang wajib telah diisi dengan benar. Nominal target harus lebih dari Rp 0 dan tanggal tenggat waktu tidak boleh tanggal di masa lalu."
          }
        ]
      },
      {
        id: "menyetor-dana-tabungan",
        categoryId: "nabung",
        categoryTitle: "Target Tabungan (Nabung)",
        title: "Cara Menyetor Dana ke Tabungan (Add Money)",
        description: "Tata cara menambahkan akumulasi uang ke dalam celengan aktif saat Anda menyisihkan penghasilan.",
        readTime: "3 menit",
        purpose: "Mencatat setoran berkala ke pos celengan digital dan memperbarui persentase ketercapaian secara bertahap.",
        steps: [
          {
            stepNumber: 1,
            title: "Pilih Kartu Target Tabungan",
            instruction: "Pada daftar target di halaman Nabung, cari target yang ingin disetor lalu klik tombol 'Setor Dana' atau icon tanda tambah.",
            details: [
              "Anda juga dapat mengklik kartu target untuk membuka modal detail target terlebih dahulu."
            ]
          },
          {
            stepNumber: 2,
            title: "Masukkan Nominal Setoran",
            instruction: "Tuliskan jumlah uang yang disisihkan ke target tersebut.",
            details: [
              "Tersedia tombol pintasan nominal cepat seperti +Rp 50.000, +Rp 100.000, +Rp 500.000 untuk mempercepat pengisian."
            ]
          },
          {
            stepNumber: 3,
            title: "Tentukan Rekening Sumber (Opsional)",
            instruction: "Pilih dari rekening atau kantong mana uang tersebut disisihkan.",
            details: [
              "Pilihan sumber: Kas Tunai, Bank BCA, Bank Mandiri, GoPay, OVO, atau sumber lainnya."
            ]
          },
          {
            stepNumber: 4,
            title: "Konfirmasi Setoran",
            instruction: "Klik tombol 'Konfirmasi Setoran'. Sistem akan langsung memperbarui grafik batang progres dan mencatat riwayat mutasi tabungan.",
            details: [
              "Jika setoran ini melampaui target, sistem akan memicu status target selesai."
            ]
          }
        ],
        formFields: [
          {
            name: "Nominal Setoran (Rp)",
            required: true,
            type: "Angka / Rupiah",
            description: "Jumlah uang yang dialokasikan ke pos celengan pada transaksi ini."
          },
          {
            name: "Tanggal Setor",
            required: true,
            type: "Tanggal",
            description: "Tanggal penyisihan uang dilakukan."
          },
          {
            name: "Catatan Tambahan",
            required: false,
            type: "Teks",
            description: "Keterangan opsional, misal: 'Sisa bonus lembur' atau 'Hasil jualan'."
          }
        ],
        screenshotPlaceholder: {
          title: "Modal Setor Dana Tabungan",
          caption: "Formulir pengisian nominal setoran dengan tombol pintas nominal cepat dan pilihan sumber dana."
        },
        bestPractices: [
          "Terapkan metode Pay Yourself First: sisihkan uang ke tabungan segera di hari gajian sebelum dipakai untuk keperluan lain.",
          "Hindari menyetor dengan nominal yang menyebabkan defisit pada kebutuhan pokok harian."
        ],
        troubleshooting: [
          {
            issue: "Salah memasukkan nominal setoran tabungan",
            solution: "Buka detail target tabungan, cari riwayat setoran di bagian bawah, lalu klik ikon pensil untuk mengubah nominal atau ikon tong sampah untuk membatalkan setoran tersebut."
          }
        ]
      },
      {
        id: "jadwal-auto-save",
        categoryId: "nabung",
        categoryTitle: "Target Tabungan (Nabung)",
        title: "Mengatur Jadwal Auto-Save & Rutinitas",
        description: "Konfigurasi pengingat dan perhitungan otomatis untuk setoran mingguan atau bulanan.",
        readTime: "3 menit",
        purpose: "Membantu konsistensi penyisihan dana secara berkala sesuai siklus penerimaan gaji atau pendapatan usaha.",
        steps: [
          {
            stepNumber: 1,
            title: "Buka Pengaturan Auto-Save",
            instruction: "Pada halaman Nabung, klik tombol 'Jadwal Rutin' atau 'Auto-Save' pada kartu target bersangkutan.",
            details: [
              "Fitur ini membantu Anda menghitung besaran setoran berkala yang dibutuhkan untuk mencapai target tepat waktu."
            ]
          },
          {
            stepNumber: 2,
            title: "Pilih Frekuensi Penyisihan",
            instruction: "Tentukan interval: Harian, Mingguan, atau Bulanan.",
            details: [
              "Untuk pekerja bergaji tetap, frekuensi Bulanan (sesuai tanggal gajian) adalah pilihan paling tepat.",
              "Untuk mahasiswa atau freelancer, frekuensi Mingguan membantu meringankan beban psikologis."
            ]
          },
          {
            stepNumber: 3,
            title: "Simpan Pengaturan Rutin",
            instruction: "Sistem akan menghitung target setoran per periode dan memberikan notifikasi pengingat pada hari yang telah Anda tentukan.",
            details: [
              "Status jadwal rutin akan tampil pada dashboard ringkasan Home."
            ]
          }
        ],
        bestPractices: [
          "Cocokkan jadwal rutin 1 hari setelah tanggal penerimaan gaji agar uang tabungan tidak sempat terpakai untuk belanja konsumtif."
        ],
        troubleshooting: [
          {
            issue: "Ingin mengubah tanggal jadwal rutin yang sudah aktif",
            solution: "Buka kembali modal Auto-Save pada target terkait, sesuaikan tanggal atau interval baru, lalu klik 'Perbarui Jadwal'."
          }
        ]
      },
      {
        id: "pencairan-target",
        categoryId: "nabung",
        categoryTitle: "Target Tabungan (Nabung)",
        title: "Pencairan & Penyelesaian Target Tabungan",
        description: "Tata cara menandai target selesai dan mencairkan kembali dana ke pos kas aktif saat tujuan tercapai.",
        readTime: "2 menit",
        purpose: "Menutup siklus tabungan yang telah berhasil mencapai 100% dan mencatat realisasi penggunaan dana.",
        steps: [
          {
            stepNumber: 1,
            title: "Periksa Status Ketercapaian",
            instruction: "Ketika progres tabungan telah mencapai 100%, kartu target akan menampilkan badge 'Tercapai'.",
            details: [
              "Anda akan menerima konfirmasi pencapaian target."
            ]
          },
          {
            stepNumber: 2,
            title: "Klik Opsi Tarik / Realisasikan Dana",
            instruction: "Klik opsi 'Tarik / Realisasikan Dana' untuk mengembalikan nominal ke kas operasional atau menandai bahwa dana telah dibelanjakan sesuai tujuan awal.",
            details: [
              "Jika uang digunakan untuk membeli barang target, pilih 'Catat sebagai Pengeluaran'.",
              "Jika dialihkan kembali ke kas bebas, pilih 'Kembalikan ke Saldo Utama'."
            ]
          }
        ],
        bestPractices: [
          "Jangan mencairkan tabungan dana darurat kecuali dalam kondisi krisis finansial yang sesungguhnya (kehilangan pekerjaan, sakit darurat)."
        ],
        troubleshooting: [
          {
            issue: "Apakah target yang sudah selesai bisa diaktifkan kembali?",
            solution: "Target yang sudah selesai akan dipindahkan ke tab 'Riwayat Selesai'. Anda dapat mereaktivasi atau menduplikasi target tersebut kapan saja jika ingin mengulang target yang sama."
          }
        ]
      }
    ]
  },
  {
    id: "catat",
    title: "Pencatatan Transaksi (Catat Kas)",
    articles: [
      {
        id: "alur-catat-transaksi",
        categoryId: "catat",
        categoryTitle: "Pencatatan Transaksi (Catat Kas)",
        title: "Panduan Alur Pencatatan Kas Harian",
        description: "Prinsip dasar pencatatan mutasi keuangan harian di FINUSA untuk menghasilkan data analisa yang akurat.",
        readTime: "3 menit",
        purpose: "Menjaga konsistensi pencatatan pemasukan, pengeluaran, dan perpindahan dana dengan hambatan seminimal mungkin.",
        steps: [
          {
            stepNumber: 1,
            title: "Pilih Metode Pencatatan",
            instruction: "FINUSA menyediakan dua jalur pencatatan: Scan Struk Otomatis (OCR) untuk struk belanja fisik, atau Formulir Manual untuk transaksi non-struk (QRIS, transfer, parkir tunai).",
            details: [
              "Gunakan Scan Struk saat berbelanja di supermarket, kafe, apotek, atau restoran yang mengeluarkan struk cetak.",
              "Gunakan Form Cepat saat bertransaksi via QRIS, e-wallet, atau kas kecil."
            ]
          },
          {
            stepNumber: 2,
            title: "Buka Halaman Catat",
            instruction: "Akses menu Catat dari sidebar atau tekan tombol cepat '+' pada bilah navigasi.",
            details: [
              "Halaman akan menampilkan tab: Pengeluaran, Pemasukan, dan Transfer."
            ]
          }
        ],
        bestPractices: [
          "Catat transaksi seketika setelah bertransaksi atau kumpulkan struk belanja untuk dipindai bersamaan di malam hari.",
          "Jangan gabungkan beberapa pengeluaran berbeda ke dalam satu pos acak."
        ],
        troubleshooting: [
          {
            issue: "Lupa mencatat transaksi beberapa hari yang lalu",
            solution: "Gunakan tanggal transaksi masa lalu pada pemilih kalender saat memasukkan data agar laporan arus kas bulanan tetap proporsional."
          }
        ]
      },
      {
        id: "scan-struk-ai",
        categoryId: "catat",
        categoryTitle: "Pencatatan Transaksi (Catat Kas)",
        title: "Scan Struk Belanja Otomatis (AI OCR)",
        description: "Cara memindai struk fisik menggunakan kamera atau file gambar dengan ekstraksi data otomatis.",
        readTime: "4 menit",
        purpose: "Menghilangkan keharusan mengetik manual total belanja, nama toko, tanggal transaksi, dan kategori pengeluaran.",
        steps: [
          {
            stepNumber: 1,
            title: "Akses Menu Scan",
            instruction: "Klik menu 'Scan' pada navigasi utama atau ikon kamera di halaman Catat.",
            details: [
              "Pastikan pencahayaan cukup terang saat memotret struk kertas."
            ]
          },
          {
            stepNumber: 2,
            title: "Unggah atau Ambil Foto Struk",
            instruction: "Seret dan letakkan gambar struk ke area unggah, atau klik untuk memilih file foto (format JPG, PNG, WEBP).",
            details: [
              "Posisikan struk tegak lurus, tidak terlipat, dan bagian total harga terlihat kontras."
            ]
          },
          {
            stepNumber: 3,
            title: "Proses Ekstraksi Otomatis",
            instruction: "Sistem OCR FINUSA akan memindai teks pada struk dalam waktu 2 sampai 4 detik.",
            details: [
              "Nama toko/merchant, tanggal transaksi, total nominal, dan prediksi kategori akan terisi otomatis ke dalam formulir verifikasi."
            ]
          },
          {
            stepNumber: 4,
            title: "Verifikasi & Simpan Transaksi",
            instruction: "Tinjau kembali data hasil ekstraksi. Jika ada rincian yang perlu disesuaikan, edit kolom terkait lalu klik 'Simpan ke Buku Kas'.",
            details: [
              "Data langsung tersinkron ke dashboard Monitor dan Google Sheets (jika integrasi aktif)."
            ]
          }
        ],
        screenshotPlaceholder: {
          title: "Area Pindai Struk AI",
          caption: "Antarmuka pemindaian struk dengan kotak pratinjau gambar dan formulir verifikasi data otomatis di sisi kanan."
        },
        bestPractices: [
          "Hindari memotret struk yang buram, robek pada bagian nominal, atau terkena pantulan cahaya flash berlebih.",
          "Struk dari minimarket populer di Indonesia (Indomaret, Alfamart) dan struk EDC memiliki tingkat akurasi ekstraksi tertinggi."
        ],
        troubleshooting: [
          {
            issue: "Nominal harga pada struk terbaca keliru oleh sistem",
            solution: "Pada formulir verifikasi hasil pindai, Anda dapat langsung mengetikkan koreksi nominal yang benar sebelum menekan tombol Simpan."
          }
        ]
      },
      {
        id: "input-manual-transaksi",
        categoryId: "catat",
        categoryTitle: "Pencatatan Transaksi (Catat Kas)",
        title: "Input Manual Pemasukan, Pengeluaran & Transfer",
        description: "Panduan mengisi transaksi secara manual dengan pemilihan kategori, metode pembayaran, dan catatan.",
        readTime: "3 menit",
        purpose: "Mencatat transaksi harian non-struk seperti pembayaran QRIS, biaya parkir, penerimaan gaji, dan pemindahan saldo rekening.",
        steps: [
          {
            stepNumber: 1,
            title: "Pilih Jenis Transaksi",
            instruction: "Di halaman Catat, pilih tab yang sesuai: Pengeluaran (Uang Keluar), Pemasukan (Uang Masuk), atau Transfer (Pindah Saldo).",
            details: [
              "Pengeluaran mengurangi saldo kas bebas.",
              "Pemasukan menambah saldo kas bebas.",
              "Transfer memindahkan saldo antar rekening tanpa mempengaruhi total kekayaan bersih."
            ]
          },
          {
            stepNumber: 2,
            title: "Isi Data Transaksi",
            instruction: "Masukkan nominal, pilih kategori (misal: Makan & Minum, Transportasi, Tagihan), rekening pembayaran, dan tanggal.",
            details: [
              "Tambahkan catatan opsional jika transaksi memerlukan penanda khusus."
            ]
          },
          {
            stepNumber: 3,
            title: "Klik Simpan Transaksi",
            instruction: "Tekan tombol 'Simpan Transaksi'. Formulir akan direset dan siap menerima transaksi berikutnya.",
            details: [
              "Gunakan opsi 'Simpan dan Tambah Lagi' jika Anda sedang merekap beberapa transaksi sekaligus."
            ]
          }
        ],
        formFields: [
          {
            name: "Jenis Mutasi",
            required: true,
            type: "Pilihan Tab",
            description: "Pengeluaran, Pemasukan, atau Transfer Antar Rekening."
          },
          {
            name: "Nominal (Rp)",
            required: true,
            type: "Angka / Rupiah",
            description: "Jumlah uang transaksi."
          },
          {
            name: "Kategori",
            required: true,
            type: "Pilihan Dropdown",
            description: "Kelompok anggaran pengeluaran atau sumber pemasukan."
          },
          {
            name: "Metode / Rekening",
            required: true,
            type: "Pilihan Dropdown",
            description: "Sumber pembayaran (Tunai, BCA, Mandiri, GoPay, QRIS, dll)."
          },
          {
            name: "Tanggal",
            required: true,
            type: "Tanggal",
            description: "Waktu transaksi terjadi."
          }
        ],
        bestPractices: [
          "Konsisten menggunakan kategori yang sama untuk pengeluaran sejenis agar grafik analitik akurat.",
          "Pisahkan pencatatan pengeluaran harian pribadi dari biaya bahan baku usaha."
        ],
        troubleshooting: [
          {
            issue: "Kategori yang dibutuhkan belum tersedia di daftar",
            solution: "Pilih 'Kategori Lainnya' atau buat kategori khusus baru melalui menu Pengaturan > Kategori Transaksi."
          }
        ]
      }
    ]
  },
  {
    id: "monitor",
    title: "Monitor & Analisis Finansial",
    articles: [
      {
        id: "ringkasan-arus-kas",
        categoryId: "monitor",
        categoryTitle: "Monitor & Analisis Finansial",
        title: "Membaca Ringkasan Arus Kas & Net Cashflow",
        description: "Memahami indikator finansial utama: total pemasukan, pengeluaran bersih, selisih kas, dan rasio tabungan.",
        readTime: "3 menit",
        purpose: "Memberikan diagnosis kesehatan keuangan bulanan secara objektif dan instan tanpa perlu menghitung manual.",
        steps: [
          {
            stepNumber: 1,
            title: "Buka Halaman Monitor",
            instruction: "Klik menu Monitor di sidebar navigasi.",
            details: [
              "Bagian atas halaman menampilkan 4 kartu KPI utama bulan berjalan."
            ]
          },
          {
            stepNumber: 2,
            title: "Pelajari 4 Indikator Utama",
            instruction: "Periksa kartu Total Pemasukan, Total Pengeluaran, Net Cashflow (Selisih Pemasukan - Pengeluaran), dan Rasio Tabungan.",
            details: [
              "Net Cashflow positif (hijau) menandakan keuangan surplus.",
              "Net Cashflow negatif (merah) memperingatkan bahwa pengeluaran melampaui pendapatan bulan ini.",
              "Rasio tabungan sehat berada di atas 20% dari total pemasukan."
            ]
          }
        ],
        bestPractices: [
          "Evaluasi kartu Net Cashflow setiap tanggal 15 dan 25 untuk mengontrol laju belanja sebelum akhir bulan tiba."
        ],
        troubleshooting: [
          {
            issue: "Angka Net Cashflow tidak sesuai dengan sisa uang fisik di dompet",
            solution: "Pastikan tidak ada transaksi tunai atau potongan biaya admin bank yang terlewat dicatat pada menu Catat."
          }
        ]
      },
      {
        id: "batas-anggaran-bulanan",
        categoryId: "monitor",
        categoryTitle: "Monitor & Analisis Finansial",
        title: "Cara Menentukan Batas Anggaran (Budgeting)",
        description: "Panduan menetapkan pagu batas maksimal belanja per kategori agar tidak overbudget.",
        readTime: "4 menit",
        purpose: "Mencegah pengeluaran impulsif dengan membatasi plafon dana pada kategori rawan bocor (seperti Makan di Luar, Hiburan, dan Belanja Online).",
        steps: [
          {
            stepNumber: 1,
            title: "Klik Atur Anggaran",
            instruction: "Pada halaman Monitor, temukan seksi 'Batas Anggaran Bulanan' dan klik tombol 'Kelola Anggaran'.",
            details: [
              "Daftar kategori pengeluaran akan muncul dengan kolom plafon nominal."
            ]
          },
          {
            stepNumber: 2,
            title: "Tentukan Pagu Nominal",
            instruction: "Masukkan batas maksimal pengeluaran yang diizinkan untuk setiap pos kategori dalam satu bulan kalender.",
            details: [
              "Contoh: Alokasikan Rp 1.500.000 untuk Makan & Minum, Rp 400.000 untuk Transportasi, Rp 300.000 untuk Hiburan."
            ]
          },
          {
            stepNumber: 3,
            title: "Pantau Bilah Progres",
            instruction: "Bilah progres akan berubah warna: Hijau (di bawah 70%), Kuning (70% - 90%), dan Merah (melampaui 100% / Overbudget).",
            details: [
              "Sistem memberikan notifikasi saat sebuah kategori mendekati batas 90%."
            ]
          }
        ],
        bestPractices: [
          "Gunakan riwayat rata-rata pengeluaran 2 bulan terakhir sebagai acuan dasar penentuan pagu anggaran.",
          "Jangan membuat pagu yang terlampau ketat dan tidak realistis agar tidak merasa frustrasi."
        ],
        troubleshooting: [
          {
            issue: "Pagu anggaran terlewati padahal bulan baru berjalan setengahnya",
            solution: "Tinjau kembali pos pengeluaran di kategori tersebut, kurangi alokasi pos fleksibel lain untuk menambal kelebihan, atau tingkatkan pagu jika terdapat kebutuhan mendesak yang sah."
          }
        ]
      },
      {
        id: "ekspor-laporan",
        categoryId: "monitor",
        categoryTitle: "Monitor & Analisis Finansial",
        title: "Ekspor Laporan Finansial (PDF & Excel/CSV)",
        description: "Mengunduh rekap mutasi transaksi dan analitik bulanan dalam bentuk dokumen rapi untuk arsip atau keperluan bisnis.",
        readTime: "2 menit",
        purpose: "Membuat salinan cetak atau file lembar kerja untuk rekonsiliasi, pembukuan lanjutan, atau bukti keuangan resmi.",
        steps: [
          {
            stepNumber: 1,
            title: "Klik Tombol Ekspor",
            instruction: "Pada sudut kanan atas halaman Monitor, klik tombol 'Ekspor Data'.",
            details: [
              "Modal pemilihan format dan rentang periode akan terbuka."
            ]
          },
          {
            stepNumber: 2,
            title: "Pilih Format Dokumen",
            instruction: "Pilih opsi: PDF (siap cetak dengan layout ringkasan) atau CSV/Excel (data tabular mentah).",
            details: [
              "Pilih rentang bulan atau tanggal kustom yang ingin disertakan dalam laporan."
            ]
          },
          {
            stepNumber: 3,
            title: "Unduh File",
            instruction: "Klik 'Mulai Ekspor' untuk mengunduh dokumen langsung ke perangkat Anda.",
            details: [
              "File akan disimpan di folder Downloads perangkat Anda secara lokal."
            ]
          }
        ],
        bestPractices: [
          "Unduh rekap bulanan setiap tanggal 1 bulan berikutnya sebagai arsip dokumentasi finansial jangka panjang."
        ],
        troubleshooting: [
          {
            issue: "File PDF hasil ekspor terpotong pada tabel mutasi",
            solution: "Jika transaksi dalam satu bulan melebihi 200 baris, gunakan format Excel/CSV untuk mempermudah pemilahan dan analisis data besar."
          }
        ]
      }
    ]
  },
  {
    id: "sheets",
    title: "Integrasi Google Sheets",
    articles: [
      {
        id: "menghubungkan-google-sheets",
        categoryId: "sheets",
        categoryTitle: "Integrasi Google Sheets",
        title: "Cara Menghubungkan Google Sheets",
        description: "Menghubungkan spreadsheet pribadi ke FINUSA untuk backup cloud otomatis dan pemrosesan data mandiri.",
        readTime: "4 menit",
        purpose: "Memastikan data keuangan Anda sepenuhnya milik Anda dan tersinkronisasi langsung ke Google Drive pribadi tanpa keterikatan platform.",
        steps: [
          {
            stepNumber: 1,
            title: "Buka Halaman Template / Sheets",
            instruction: "Navigasi ke menu Template di sidebar FINUSA.",
            details: [
              "Tersedia pilihan template resmi: Master Template Keuangan Pribadi dan Template Usaha Rumah Ramai."
            ]
          },
          {
            stepNumber: 2,
            title: "Salin Template Resmi",
            instruction: "Klik tautan 'Buka Template Google Sheets', lalu klik 'Make a copy' (Buat salinan) ke Google Drive akun Google Anda.",
            details: [
              "Jangan mengubah nama tab sheet bawaan agar struktur sinkronisasi tidak terganggu."
            ]
          },
          {
            stepNumber: 3,
            title: "Salin Spreadsheet ID atau URL",
            instruction: "Salin link URL Google Sheet yang baru saja Anda buat di akun Google Anda.",
            details: [
              "Pastikan izin akses dokumen diatur ke 'Anyone with the link can view/edit' atau bagikan ke email service account FINUSA."
            ]
          },
          {
            stepNumber: 4,
            title: "Tautkan ke FINUSA",
            instruction: "Tempelkan URL atau Sheet ID ke kolom input di FINUSA, lalu klik 'Uji & Sambungkan'. Status akan berubah menjadi 'Tersambung (Aktif)'.",
            details: [
              "Setiap transaksi baru yang dicatat di FINUSA akan otomatis terkirim ke sheet Anda."
            ]
          }
        ],
        screenshotPlaceholder: {
          title: "Antarmuka Integrasi Google Sheets",
          caption: "Langkah penautan URL spreadsheet dan pengujian status koneksi data 2 arah."
        },
        bestPractices: [
          "Gunakan email Google utama Anda untuk membuat salinan template agar arsip tersimpan aman.",
          "Hindari menghapus header baris pertama pada lembar spreadsheet."
        ],
        troubleshooting: [
          {
            issue: "Gagal menghubungkan: Spreadsheet tidak ditemukan atau izin ditolak",
            solution: "Periksa pengaturan 'Share' pada Google Sheet Anda. Pastikan dokumen dapat diakses dan tautan URL yang ditempelkan berformat lengkap."
          }
        ]
      },
      {
        id: "master-template-keuangan",
        categoryId: "sheets",
        categoryTitle: "Integrasi Google Sheets",
        title: "Panduan Penggunaan Master Template",
        description: "Bedah struktur tab, rumus kalkulasi, dan formula bawaan pada template master keuangan FINUSA.",
        readTime: "3 menit",
        purpose: "Memanfaatkan lembar spreadsheet cerdas untuk analisis mendalam, pivot table, dan pelaporan pajak tahunan.",
        steps: [
          {
            stepNumber: 1,
            title: "Struktur Tab Master Template",
            instruction: "Template terdiri dari 4 tab utama: Dashboard Rekap, Mutasi Kas, Alokasi Anggaran, dan Target Tabungan.",
            details: [
              "Tab Mutasi Kas terisi secara otomatis dari input aplikasi FINUSA.",
              "Tab Dashboard Rekap menyajikan grafik interaktif berbasis formula Google Sheets."
            ]
          },
          {
            stepNumber: 2,
            title: "Kustomisasi Formula Mandiri",
            instruction: "Anda bebas menambahkan formula VLOOKUP, SUMIFS, atau grafik kustom pada tab tambahan tanpa mempengaruhi integrasi sistem utama.",
            details: [
              "Sistem FINUSA hanya menulis baris baru di tab Mutasi Kas dan tidak akan menimpa tab lain yang Anda buat."
            ]
          }
        ],
        bestPractices: [
          "Buat tab duplikat jika ingin melakukan eksperimen rumus rumit agar tab bawaan tetap steril."
        ],
        troubleshooting: [
          {
            issue: "Transaksi baru tidak otomatis masuk ke baris sheet",
            solution: "Buka menu Template di FINUSA, lalu klik tombol 'Sinkronkan Ulang Sekarang'. Pastikan kuota API Google Drive Anda tidak sedang terkendala."
          }
        ]
      }
    ]
  },
  {
    id: "pembukuan",
    title: "Pembukuan Usaha & UMKM",
    articles: [
      {
        id: "pemisahan-kas-usaha",
        categoryId: "pembukuan",
        categoryTitle: "Pembukuan Usaha & UMKM",
        title: "Memisahkan Kas Pribadi dan Modal Usaha",
        description: "Praktek penting bagi freelancer dan pemilik UMKM agar uang operasional dagang tidak terpakai untuk konsumsi rumah tangga.",
        readTime: "4 menit",
        purpose: "Mencegah kebangkrutan modal usaha akibat percampuran rekening pribadi dan kas dagang.",
        steps: [
          {
            stepNumber: 1,
            title: "Aktifkan Mode Pembukuan Usaha",
            instruction: "Di menu Pengaturan, aktifkan opsi 'Mode Pembukuan Bisnis / UMKM'.",
            details: [
              "Kategori khusus usaha seperti Bahan Baku, Operasional Toko, Penjualan Produk, dan Ongkos Kirim akan otomatis diaktifkan."
            ]
          },
          {
            stepNumber: 2,
            title: "Tentukan Pos Gaji Pribadi (Owner's Draw)",
            instruction: "Tetapkan nominal gaji bulanan untuk diri Anda sendiri dari kas usaha ke kas pribadi.",
            details: [
              "Catat penarikan uang dari kas usaha untuk kebutuhan pribadi sebagai transaksi Transfer 'Gaji Pemilik', bukan sebagai pengeluaran acak."
            ]
          },
          {
            stepNumber: 3,
            title: "Pantau Laba Bersih Usaha",
            instruction: "Tinjau selisih pendapatan omzet terhadap biaya modal (HPP) dan operasional pada laporan ringkasan usaha.",
            details: [
              "Laba bersih yang tersisa adalah hak modal usaha untuk diputar kembali (reinvestasi)."
            ]
          }
        ],
        bestPractices: [
          "Miliki minimal 2 rekening perbankan berbeda: 1 rekening murni untuk penerimaan usaha & belanja stok, 1 rekening murni untuk kebutuhan rumah tangga.",
          "Jangan pernah mengambil kas di laci toko secara diam-diam tanpa mencatatnya di aplikasi FINUSA."
        ],
        troubleshooting: [
          {
            issue: "Uang modal dagang berkurang tanpa diketahui penyebabnya",
            solution: "Periksa kembali riwayat mutasi kas keluar. Umumnya terjadi akibat biaya operasional kecil (pulsa/paket data dagang, parkir kulakan, biaya packing) yang tidak dicatat."
          }
        ]
      },
      {
        id: "kelola-utang-piutang",
        categoryId: "pembukuan",
        categoryTitle: "Pembukuan Usaha & UMKM",
        title: "Pencatatan Utang & Piutang Pelanggan",
        description: "Cara mendokumentasikan tagihan pelanggan yang belum lunas dan kewajiban jatuh tempo ke pemasok barang.",
        readTime: "3 menit",
        purpose: "Memastikan arus kas bisnis tidak macet akibat piutang pelanggan yang terlupakan.",
        steps: [
          {
            stepNumber: 1,
            title: "Buka Menu Piutang & Utang",
            instruction: "Pilih tab Piutang di modul pembukuan usaha.",
            details: [
              "Tersedia dua kelompok: Piutang (orang lain berutang ke kita) dan Utang (kita berutang ke orang/supplier)."
            ]
          },
          {
            stepNumber: 2,
            title: "Tambah Catatan Tagihan",
            instruction: "Klik '+ Catat Tagihan', isi nama debitur/kreditur, nominal piutang, tanggal transaksi, dan tanggal jatuh tempo pembayaran.",
            details: [
              "Tambahkan nomor kontak peminjam untuk mempermudah penagihan."
            ]
          },
          {
            stepNumber: 3,
            title: "Pelunasan Bertahap",
            instruction: "Ketika pelanggan mencicil pembayaran, klik 'Catat Cicilan' pada tagihan tersebut hingga status berubah menjadi 'Lunas'.",
            details: [
              "Saldo penerimaan cicilan otomatis dicatat sebagai pemasukan kas operasional."
            ]
          }
        ],
        bestPractices: [
          "Terapkan batas maksimal tempo piutang maksimal 14 hari bagi pelanggan untuk menjaga kelancaran modal kerja."
        ],
        troubleshooting: [
          {
            issue: "Pelanggan melunasi sebagian hutangnya",
            solution: "Gunakan fitur 'Pelunasan Sebagian' (Cicilan), masukkan nominal yang dibayarkan, dan sistem akan otomatis memperbarui sisa piutang yang belum terbayar."
          }
        ]
      }
    ]
  },
  {
    id: "ai",
    title: "Finusa AI Advisor",
    articles: [
      {
        id: "konsultasi-ai-finansial",
        categoryId: "ai",
        categoryTitle: "Finusa AI Advisor",
        title: "Cara Konsultasi dengan Finusa AI Advisor",
        description: "Memanfaatkan asisten kecerdasan buatan untuk menganalisis kebiasaan belanja dan meminta rekomendasi penghematan.",
        readTime: "3 menit",
        purpose: "Mendapatkan saran objektif dan strategi keuangan personal tanpa biaya konsultasi finansial mahal.",
        steps: [
          {
            stepNumber: 1,
            title: "Buka Halaman AI",
            instruction: "Akses menu AI pada navigasi utama.",
            details: [
              "AI Finusa telah membaca ringkasan data transaksi dan anggaran Anda secara aman dalam lingkungan terenkripsi."
            ]
          },
          {
            stepNumber: 2,
            title: "Ajukan Pertanyaan Finansial",
            instruction: "Ketik pertanyaan atau pilih salah satu prompt cepat yang tersedia.",
            details: [
              "Contoh: 'Di pos mana pengeluaran terbesar saya bulan ini dan bagaimana cara memotongnya?'",
              "Contoh: 'Dengan gaji Rp 6.000.000, berapa lama saya bisa mengumpulkan dana darurat Rp 18.000.000?'"
            ]
          },
          {
            stepNumber: 3,
            title: "Dapatkan Strategi Tindakan",
            instruction: "AI akan memberikan rincian matematis, rekomendasi batas anggaran harian, dan simulasi penghematan.",
            details: [
              "Rekomendasi disesuaikan dengan konteks gaya hidup dan pola pengeluaran di Indonesia."
            ]
          }
        ],
        bestPractices: [
          "Semakin konsisten Anda mencatat transaksi harian, semakin akurat dan tajam analisis yang diberikan oleh AI."
        ],
        troubleshooting: [
          {
            issue: "Respon AI menyatakan 'Data transaksi belum mencukupi'",
            solution: "AI membutuhkan minimal 5 transaksi tercatat pada bulan berjalan agar dapat menyimpulkan pola dan memberikan saran yang relevan."
          }
        ]
      }
    ]
  },
  {
    id: "pengaturan",
    title: "Pengaturan & Keamanan Akun",
    articles: [
      {
        id: "keamanan-dan-profil",
        categoryId: "pengaturan",
        categoryTitle: "Pengaturan & Keamanan Akun",
        title: "Pengaturan Profil & Keamanan Akun",
        description: "Mengelola kata sandi, preferensi mata uang, notifikasi limit anggaran, dan backup data pribadi.",
        readTime: "2 menit",
        purpose: "Memastikan akun dan data transaksi keuangan Anda tetap terlindungi dan sesuai preferensi penggunaan.",
        steps: [
          {
            stepNumber: 1,
            title: "Akses Halaman Pengaturan",
            instruction: "Klik ikon Pengaturan (Roda Gigi) pada bagian bawah navigasi samping.",
            details: [
              "Terdapat tab: Profil, Preferensi Finansial, Keamanan, dan Cadangan Data."
            ]
          },
          {
            stepNumber: 2,
            title: "Atur Preferensi Notifikasi & Limit",
            instruction: "Aktifkan peringatan saat pengeluaran bulanan telah mencapai 80% dari total pagu anggaran.",
            details: [
              "Pilih format penulisan angka rupiah (Contoh: Rp 1.000.000 atau IDR 1.000.000)."
            ]
          }
        ],
        bestPractices: [
          "Gunakan kata sandi unik kombinasi huruf kapital, angka, dan simbol untuk melindungi catatan finansial Anda."
        ],
        troubleshooting: [
          {
            issue: "Lupa kata sandi akun FINUSA",
            solution: "Gunakan tautan 'Lupa Kata Sandi' pada halaman login. Tautan pemulihan akan dikirimkan langsung ke alamat email terdaftar Anda."
          }
        ]
      }
    ]
  }
];

export function getAllArticles(): HelpArticle[] {
  return HELP_CATEGORIES.flatMap((c) => c.articles);
}

export function getArticleById(id: string): HelpArticle | undefined {
  return getAllArticles().find((a) => a.id === id);
}
