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
    id: "makan",
    name: "Makan",
    description: "Makanan, minuman, kuliner, dan kebutuhan konsumsi harian",
    iconName: "Utensils",
    colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  {
    id: "kebutuhan",
    name: "Kebutuhan",
    description: "Kebutuhan pokok rumah tangga, sabun, odol, deterjen, perawatan diri",
    iconName: "Package",
    colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  {
    id: "transportasi",
    name: "Transportasi",
    description: "Bensin, tol, parkir, ojek/taksi online, perawatan kendaraan",
    iconName: "Car",
    colorClass: "text-sky-400 bg-sky-500/10 border-sky-500/25",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  },
  {
    id: "cicilan",
    name: "Cicilan",
    description: "Cicilan, tagihan berkala, pulsa, listrik, air, kredit",
    iconName: "CreditCard",
    colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  },
  {
    id: "keinginan",
    name: "Keinginan",
    description: "Hiburan, santai, hobi, belanja baju, rokok, rekreasi",
    iconName: "Sparkles",
    colorClass: "text-pink-400 bg-pink-500/10 border-pink-500/25",
    badgeClass: "bg-pink-500/15 text-pink-300 border-pink-500/30",
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

const ITEM_CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Makan": [
    "roti", "bread", "bakery", "susu", "milk", "kopi", "coffee", "teh", "tea",
    "mie", "indomie", "sedap", "nasi", "beras", "ayam", "daging", "ikan",
    "telur", "egg", "sayur", "buah", "apel", "jeruk", "pisang", "biskuit",
    "snack", "chiki", "oreo", "wafer", "coklat", "chocolate", "keju", "cheese",
    "mentega", "minyak", "goreng", "saus", "kecap", "garam", "gula", "bumbu",
    "aqua", "air mineral", "le minerale", "teh botol", "pocari", "jus", "juice",
    "sosis", "nugget", "bakso", "kfc", "mcd", "burger", "pizza", "kuliner",
    "makan", "minum", "food", "beverage", "drink", "gacoan", "solaria",
  ],
  "Kebutuhan": [
    "sabun", "soap", "lifebuoy", "lux", "dettol", "biore", "shampoo", "sampo",
    "pantene", "sunsilk", "clear", "pasta gigi", "odol", "pepsodent", "ciptadent",
    "sikat gigi", "tisu", "tissue", "pashmina", "deterjen", "detergent", "rinso",
    "daia", "soklin", "downy", "molto", "sunlight", "mama lemon", "pembersih",
    "baygon", "hit", "autan", "obat nyamuk", "wipol", "karbol", "spons", "pel",
    "shampo", "conditioner", "deodorant", "rexona", "pembalut", "charm", "laurier",
    "popok", "pampers", "mamypoko", "kapas", "cotton bud", "obat", "panadol",
    "bodrex", "paracetamol", "tolak angin", "minyak kayu putih", "betadine",
    "plester", "hansaplast", "lampu", "baterai", "kantong", "plastik", "kresek",
  ],
  "Transportasi": [
    "pertamax", "pertalite", "bensin", "solar", "dexlite", "shell", "spbu",
    "oli", "pelumas", "parkir", "parking", "tol", "toll", "jasamarga",
    "grab", "gojek", "goride", "gocar", "maxim", "indrive", "tiket", "krl",
    "mrt", "kereta", "bengkel", "tambal ban", "cuci motor", "cuci mobil",
  ],
  "Cicilan": [
    "pln", "listrik", "token", "pdam", "air", "pulsa", "paket data", "kuota",
    "indihome", "biznet", "wifi", "bpjs", "asuransi", "cicilan", "angsuran",
    "kredit", "paylater", "kartu kredit", "sewa",
  ],
  "Keinginan": [
    "rokok", "surya", "sampoerna", "marlboro", "magnum", "djarum", "esse",
    "vape", "liquid", "game", "steam", "playstation", "topup", "diamond",
    "bioskop", "cinema", "xxi", "cgv", "buku", "novel", "komik", "mainan",
    "baju", "kaos", "celana", "sepatu", "sandal", "tas", "aksesoris",
    "parfum", "makeup", "skincare", "lipstik", "nonton", "karaoke",
  ],
};

/**
 * Detects specific category for an individual item
 */
export function detectItemCategory(itemName: string): string {
  const lower = (itemName || "").toLowerCase();

  for (const [category, keywords] of Object.entries(ITEM_CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return category;
      }
    }
  }

  return "Makan"; // Default to Makan for general minimarket purchases
}

/**
 * Auto-detects primary category for a receipt from merchant and items
 */
export function detectCategory(
  merchantName?: string,
  items?: Array<{ name: string; price?: number; category?: string }>,
  rawText?: string
): string {
  if (items && items.length > 0) {
    // If items already have categories, pick the most frequent or highest total
    const counts: Record<string, number> = {};
    for (const item of items) {
      const cat = item.category || detectItemCategory(item.name);
      counts[cat] = (counts[cat] || 0) + (item.price || 1);
    }
    let bestCat = "Makan";
    let maxVal = -1;
    for (const [cat, val] of Object.entries(counts)) {
      if (val > maxVal) {
        maxVal = val;
        bestCat = cat;
      }
    }
    return bestCat;
  }

  const combined = [merchantName || "", rawText || ""].join(" ").toLowerCase();
  for (const [category, keywords] of Object.entries(ITEM_CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (combined.includes(kw)) {
        return category;
      }
    }
  }

  return "Makan";
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
