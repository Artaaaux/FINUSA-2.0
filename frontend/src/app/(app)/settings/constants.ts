import {
  UserProfileSettings,
  FaqItem,
  KeyboardShortcutItem
} from "./types";

export const INITIAL_PROFILE: UserProfileSettings = {
  firstName: "Arta",
  lastName: "Rachta",
  email: "artaaaux.finance@gmail.com",
  phoneNumber: "+62 812-3456-7890",
  bio: "Pelajar & Penggiat Literasi Finansial. Mengelola pencatatan kas dan target tabungan mandiri di Finusa.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces",
  companyName: "Nusantara Financial Community",
  role: "Pelajar / Pengguna Mandiri",
  timezone: "Asia/Jakarta (WIB)",
};

export const FAQ_LIST: FaqItem[] = [
  {
    category: "Keamanan & Data",
    question: "Bagaimana Finusa melindungi data keuangan dan kredensial saya?",
    answer: "Finusa menggunakan enkripsi data berstandar industri AES-256 saat data tersimpan (at-rest) dan TLS 1.3 saat transmisi data (in-transit). Token Google Sheets disimpan terenkripsi dengan secret key terisolasi dan kami tidak pernah membagikan kredensial akun Anda kepada pihak luar.",
  },
  {
    category: "Google Sheets",
    question: "Bagaimana cara kerja sinkronisasi dua arah dengan Google Sheets?",
    answer: "Saat sinkronisasi dua arah aktif, Anda dapat menambahkan atau mengedit transaksi langsung di Google Sheets. Finusa akan mendeteksi perubahan tersebut secara otomatis dan menyelaraskannya ke database pembukuan Anda.",
  },
  {
    category: "Ekspor & Pencadangan",
    question: "Dalam format apa saja data saya bisa diekspor?",
    answer: "Anda dapat mengekspor seluruh rekap transaksi, pos tabungan, dan log audit dalam format JSON mentah, spreadsheet CSV terstruktur, atau dokumen ringkasan PDF.",
  },
];

export const KEYBOARD_SHORTCUTS: KeyboardShortcutItem[] = [
  { keyCombo: ["⌘", "K"], description: "Buka Command Bar / Pencarian Global", category: "Navigasi" },
  { keyCombo: ["G", "H"], description: "Buka Halaman Home / Dashboard", category: "Navigasi" },
  { keyCombo: ["G", "P"], description: "Buka Pembukuan Transaksi", category: "Navigasi" },
  { keyCombo: ["G", "N"], description: "Buka Target Nabung", category: "Navigasi" },
  { keyCombo: ["G", "S"], description: "Buka Integrasi Google Sheets", category: "Navigasi" },
  { keyCombo: ["N"], description: "Catat Transaksi Baru Cepat", category: "Aksi Finansial" },
  { keyCombo: ["/"], description: "Fokus ke Kolom Pencarian", category: "Umum" },
  { keyCombo: ["Esc"], description: "Tutup Modal / Batalkan Dialog", category: "Umum" },
];
