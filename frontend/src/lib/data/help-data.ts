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
    id: "scan-ai",
    title: "Scan Struk AI (AI Scan)",
    articles: [
      {
        id: "cara-pakai-scan-ai",
        categoryId: "scan-ai",
        categoryTitle: "Scan Struk AI (AI Scan)",
        title: "Cara Menggunakan Scan Struk AI",
        description: "Panduan memindai nota dan struk belanja secara instan menggunakan kamera HP atau unggahan file gambar.",
        readTime: "3 menit",
        purpose: "Mengekstrak data transaksi belanja (nama toko, tanggal, total nominal, pos kategori, dan rincian belanja) secara otomatis tanpa mengetik angka satu per satu.",
        steps: [
          {
            stepNumber: 1,
            title: "Buka Menu Scan di Navigasi Utama",
            instruction: "Klik menu 'Scan' berlogo AI pada bilah navigasi utama (atau akses langsung /receipt-scanner).",
            details: [
              "Layar pemindai kamera interaktif akan langsung terbuka."
            ]
          },
          {
            stepNumber: 2,
            title: "Pilih Metode Foto Kamera atau Unggah File",
            instruction: "Tekan tombol 'Ambil Foto' untuk memotret langsung dengan kamera perangkat, atau 'Unggah Gambar' untuk memilih foto struk dari galeri HP/laptop.",
            details: [
              "Mendukung format gambar populer: JPG, JPEG, PNG, dan WEBP.",
              "Izinkan akses kamera pada browser Anda jika menggunakan webcam atau kamera HP."
            ]
          },
          {
            stepNumber: 3,
            title: "Pratinjau Foto & Jalankan Pemrosesan AI",
            instruction: "Periksa foto struk pada layar pratinjau. Pastikan teks harga dan nama toko terbaca jelas, lalu klik 'Proses Scan Struk'.",
            details: [
              "Mesin AI Vision OCR FINUSA akan memproses teks struk dalam hitungan detik.",
              "Sistem mengekstrak nama merchant, tanggal transaksi, rincian barang, pajak, diskon, dan grand total."
            ]
          },
          {
            stepNumber: 4,
            title: "Verifikasi Data pada Layar Konfirmasi",
            instruction: "Tinjau data yang berhasil diekstrak pada layar konfirmasi. Anda dapat mengoreksi nama merchant, mengubah kategori, atau menambah dan menghapus item.",
            details: [
              "Sistem menampilkan indikator skor akurasi (confidence score).",
              "Tersedia tombol '+ Tambah Item' atau ikon hapus untuk setiap baris barang."
            ]
          },
          {
            stepNumber: 5,
            title: "Simpan Pengeluaran ke Catatan Kas",
            instruction: "Klik tombol 'Simpan Pengeluaran'. Data transaksi akan langsung tercatat ke menu Monitor dan tersinkron ke Google Sheets.",
            details: [
              "Layar sukses akan muncul dan Anda dapat langsung memindai struk berikutnya."
            ]
          }
        ],
        formFields: [
          {
            name: "Nama Merchant / Toko",
            required: true,
            type: "Teks",
            description: "Nama tempat berbelanja yang terdeteksi otomatis (contoh: Indomaret, Alfamart, Starbucks)."
          },
          {
            name: "Tanggal Struk",
            required: true,
            type: "Tanggal",
            description: "Waktu transaksi yang tertera pada kertas struk."
          },
          {
            name: "Total Pengeluaran (Rp)",
            required: true,
            type: "Angka / Rupiah",
            description: "Nominal total pembayaran akhir setelah pajak dan diskon."
          },
          {
            name: "Kategori Pengeluaran",
            required: true,
            type: "Pilihan Dropdown",
            description: "Klasifikasi pos anggaran (Makan & Minum, Belanja Bulanan, Transportasi, Kesehatan, dll)."
          },
          {
            name: "Rincian Item Belanja",
            required: false,
            type: "Daftar Item (Nama, Qty, Harga)",
            description: "Daftar rincian barang per baris beserta jumlah dan harga satuan."
          }
        ],
        screenshotPlaceholder: {
          title: "Layar Pemindai Scan Struk AI",
          caption: "Antarmuka kamera pemindai struk dengan tombol ambil foto dan unggah file gambar."
        },
        bestPractices: [
          "Letakkan struk di atas permukaan datar berlatar gelap agar kontras teks kertas putih terlihat tajam.",
          "Hindari bayangan tangan atau pantulan cahaya flash langsung yang menutupi deretan angka nominal."
        ],
        troubleshooting: [
          {
            issue: "Kamera tidak menyala atau muncul peringatan 'Permission Denied'",
            solution: "Buka pengaturan izin browser Anda (ikon gembok di sebelah URL) dan ubah izin Kamera menjadi 'Izinkan' (Allow), lalu muat ulang halaman."
          },
          {
            issue: "Struk panjang atau terlipat tidak terbaca penuh",
            solution: "Lipat struk menjadi 2 bagian jika terlalu panjang dan ambil foto per bagian, atau gunakan opsi input manual cepat pada tombol yang tersedia."
          }
        ]
      },
      {
        id: "tips-akurasi-scan-ai",
        categoryId: "scan-ai",
        categoryTitle: "Scan Struk AI (AI Scan)",
        title: "Tips Memotret Struk agar Akurat",
        description: "Pedoman teknik pengambilan gambar struk kertas thermal dan kasir ritel di Indonesia.",
        readTime: "3 menit",
        purpose: "Memaksimalkan akurasi pembacaan AI OCR hingga 98%+ sehingga tidak perlu banyak melakukan koreksi manual.",
        steps: [
          {
            stepNumber: 1,
            title: "Ratakan Kertas Struk yang Kusut",
            instruction: "Kertas kasir thermal seringkali tergulung atau kusut di dalam kantong saku. Bentangkan kertas struk sebelum difoto.",
            details: [
              "Fokuskan lensa terutama pada bagian Nama Toko, Tanggal, dan Total Paling Bawah (Grand Total)."
            ]
          },
          {
            stepNumber: 2,
            title: "Gunakan Pencahayaan Merata",
            instruction: "Pastikan cahaya ruangan terang merata dan tidak ada bayangan gelap yang melintang di atas baris harga.",
            details: [
              "Jika memotret di malam hari, nyalakan lampu ruangan atau gunakan mode unggah foto dengan pencahayaan cukup."
            ]
          },
          {
            stepNumber: 3,
            title: "Posisikan Kamera Sejajar Tegak Lurus",
            instruction: "Ambil foto dari atas secara tegak lurus (bird-eye view), bukan dari sudut miring atau perspektif menyamping.",
            details: [
              "Posisi tegak lurus membantu algoritma OCR membaca baris teks per baris tanpa distorsi optik."
            ]
          }
        ],
        bestPractices: [
          "Segera foto struk belanjaan baru di hari yang sama sebelum tinta thermal memudar terpapar panas.",
          "Struk minimarket (Alfamart, Indomaret, Superindo), SPBU, dan struk mesin EDC perbankan memiliki format standar yang sangat optimal dipindai."
        ],
        troubleshooting: [
          {
            issue: "Tinta struk sudah pudar atau berwarna abu-abu sangat tipis",
            solution: "Gunakan tombol 'Input Manual' di bawah layar kamera untuk langsung mengisi formulir tanpa menunggu proses pemindaian."
          }
        ]
      },
      {
        id: "koreksi-data-scan-ai",
        categoryId: "scan-ai",
        categoryTitle: "Scan Struk AI (AI Scan)",
        title: "Koreksi Data & Penyesuaian Item Hasil Scan",
        description: "Cara mengedit rincian barang, diskon belanja, dan pos kategori pada layar konfirmasi sebelum disimpan.",
        readTime: "2 menit",
        purpose: "Memberikan kontrol penuh kepada pengguna untuk memvalidasi dan menyempurnakan hasil pembacaan AI.",
        steps: [
          {
            stepNumber: 1,
            title: "Periksa Ringkasan Total",
            instruction: "Setelah AI selesai memproses struk, halaman akan masuk ke layar 'Konfirmasi Data Struk'.",
            details: [
              "Cek apakah nominal Grand Total cocok dengan yang Anda bayarkan di kasir."
            ]
          },
          {
            stepNumber: 2,
            title: "Edit Kolom yang Perlu Penyesuaian",
            instruction: "Klik langsung pada kotak teks nama toko, tanggal, atau kategori untuk mengubah isinya jika diperlukan.",
            details: [
              "Setiap baris barang memiliki input Nama Barang, Jumlah (Qty), dan Harga Satuan."
            ]
          },
          {
            stepNumber: 3,
            title: "Hapus Item yang Tidak Perlu",
            instruction: "Klik ikon tong sampah merah pada baris item yang salah terbaca atau tidak ingin dicatat terpisah.",
            details: [
              "Klik '+ Tambah Item' jika ada barang di struk yang terlewat oleh pemindai."
            ]
          }
        ],
        bestPractices: [
          "Gunakan fitur pemilihan kategori yang tepat (misal: 'Belanja Bulanan' untuk kebutuhan dapur, 'Snack / Jajan' untuk camilan)."
        ],
        troubleshooting: [
          {
            issue: "Total struk tidak sama dengan jumlah subtotal item",
            solution: "Periksa kolom Pajak (PB1/PPN) atau Diskon Promo. Sistem menyediakan kolom penyesuaian khusus untuk selisih pajak atau diskon kasir."
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
        purpose: "Menjaga konsistensi pencatatan pemasukan, pengeluaran, dan perpindahan dana non-struk dengan hambatan seminimal mungkin.",
        steps: [
          {
            stepNumber: 1,
            title: "Buka Halaman Catat",
            instruction: "Akses menu Catat dari sidebar navigasi samping.",
            details: [
              "Halaman akan menampilkan tab utama: Pengeluaran, Pemasukan, dan Transfer."
            ]
          },
          {
            stepNumber: 2,
            title: "Pilih Jenis Transaksi",
            instruction: "Pilih tab yang sesuai dengan transaksi yang baru saja Anda lakukan.",
            details: [
              "Gunakan Pengeluaran saat membeli makanan via QRIS, membayar bensin tunai, atau bayar parkir.",
              "Gunakan Pemasukan saat menerima transfer gaji, uang saku, atau omzet harian.",
              "Gunakan Transfer saat memindahkan uang antar rekening bank atau top-up dompet digital."
            ]
          }
        ],
        bestPractices: [
          "Catat transaksi seketika setelah bertransaksi di kasir agar tidak menumpuk di ingatan.",
          "Gunakan Scan Struk AI jika transaksi mengeluarkan nota/struk fisik."
        ],
        troubleshooting: [
          {
            issue: "Lupa mencatat transaksi beberapa hari yang lalu",
            solution: "Gunakan tanggal transaksi masa lalu pada pemilih kalender saat memasukkan data agar laporan arus kas bulanan tetap proporsional."
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
