export interface CategoryOption {
  id: string;
  name: string;
  description: string;
  iconName: string;
  colorClass: string;
  badgeClass: string;
}

export const FINUSA_CATEGORIES: CategoryOption[] = [
  {
    id: "makanan",
    name: "Makanan & Minuman",
    description: "Restoran, kafe, warung makan, kuliner harian",
    iconName: "Utensils",
    colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  {
    id: "belanja",
    name: "Belanja & Groceries",
    description: "Minimarket, supermarket, pasar, kebutuhan pokok",
    iconName: "ShoppingCart",
    colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25",
    badgeClass: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  },
  {
    id: "transportasi",
    name: "Transportasi",
    description: "Bensin, parkir, tol, ojek online, tiket perjalanan",
    iconName: "Car",
    colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  {
    id: "utilitas",
    name: "Utilitas & Tagihan",
    description: "Listrik, air, pulsa, paket data, wifi, langganan",
    iconName: "Zap",
    colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  },
  {
    id: "kesehatan",
    name: "Kesehatan",
    description: "Apotek, obat, klinik, dokter, vitamin",
    iconName: "HeartPulse",
    colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/25",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
  {
    id: "hiburan",
    name: "Hiburan & Rekreasi",
    description: "Bioskop, buku, game, hobi, rekreasi",
    iconName: "Clapperboard",
    colorClass: "text-pink-400 bg-pink-500/10 border-pink-500/25",
    badgeClass: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  },
  {
    id: "operasional",
    name: "Operasional Usaha",
    description: "Kulakan bahan baku, packaging, stok jualan UMKM",
    iconName: "Briefcase",
    colorClass: "text-teal-400 bg-teal-500/10 border-teal-500/25",
    badgeClass: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  },
  {
    id: "lainnya",
    name: "Lainnya",
    description: "Pengeluaran umum lainnya",
    iconName: "MoreHorizontal",
    colorClass: "text-slate-400 bg-slate-500/10 border-slate-500/25",
    badgeClass: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  },
];

const CATEGORY_KEYWORD_MAP: Record<string, string[]> = {
  "Makanan & Minuman": [
    "restoran", "restaurant", "cafe", "coffee", "kopi", "warung", "warteg",
    "mcdonalds", "mcd", "kfc", "hokben", "burger", "pizza", "starbucks",
    "mixue", "janji jiwa", "kenangan", "chatime", "fore", "dapur", "bakso",
    "mie gacoan", "gacoan", "solaria", "richeese", "ayam", "bebek", "soto",
    "sate", "nasi", "padang", "haus", "tea", "roti", "bakery", "bread",
  ],
  "Belanja & Groceries": [
    "indomaret", "alfamart", "alfamidi", "superindo", "hypermart", "transmart",
    "lotte", "hero", "grand lucky", "papaya", "yoma", "famima", "family mart",
    "circle k", "supermarket", "minimarket", "toko", "pasar", "mart", "store",
    "uniqlo", "zara", "h&m", "matahari", "miniso", "kKV", "sociolla",
  ],
  "Transportasi": [
    "pertamina", "shell", "bp-akr", "spbu", "bensin", "parkir", "parking",
    "jasamarga", "toll", "tol", "grab", "gojek", "maxim", "indrive", "bluebird",
    "kereta", "kai", "krl", "mrt", "transjakarta", "garuda", "lion air",
  ],
  "Utilitas & Tagihan": [
    "pln", "listrik", "token", "pdam", "air", "telkom", "indihome", "myrepublic",
    "biznet", "first media", "telkomsel", "indosat", "xl", "smartfren", "pulsa",
  ],
  "Kesehatan": [
    "kimia farma", "guardian", "watsons", "k-24", "apotek", "pharmacy", "obat",
    "klinik", "clinic", "rumah sakit", "hospital", "lab", "prodia", "halodoc",
  ],
  "Hiburan & Rekreasi": [
    "xxi", "cinema", "cgv", "cinepolis", "bioskop", "gramedia", "periplus",
    "timezone", "timezone", "netflix", "spotify", "steam", "playstation",
  ],
  "Operasional Usaha": [
    "kulakan", "bahan baku", "distributor", "grosir", "plastik", "dus",
    "packaging", "kardus", "supplier", "cetak", "percetakan", "atk",
  ],
};

/**
 * Auto-detects category from merchant name and item descriptions
 */
export function detectCategory(
  merchantName?: string,
  items?: Array<{ name: string; price?: number }>,
  rawText?: string
): string {
  const combined = [
    merchantName || "",
    ...(items ? items.map((i) => i.name) : []),
    rawText || "",
  ]
    .join(" ")
    .toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORD_MAP)) {
    for (const kw of keywords) {
      if (combined.includes(kw)) {
        return category;
      }
    }
  }

  return "Belanja & Groceries";
}

/**
 * Get category metadata for UI rendering
 */
export function getCategoryMeta(categoryName: string): CategoryOption {
  const found = FINUSA_CATEGORIES.find(
    (c) =>
      c.name.toLowerCase() === categoryName.toLowerCase() ||
      c.id.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    found || {
      id: "lainnya",
      name: categoryName || "Lainnya",
      description: "Pengeluaran umum",
      iconName: "MoreHorizontal",
      colorClass: "text-slate-400 bg-slate-500/10 border-slate-500/25",
      badgeClass: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    }
  );
}
