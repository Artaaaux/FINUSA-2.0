import type { ExtractedReceiptData } from "./types";

/**
 * Generates realistic Indonesian receipt sample data for testing/demo/fallback
 */
export function generateSimulatedReceipt(): ExtractedReceiptData {
  const samples = [
    {
      merchant: "Indomaret Point Sudirman",
      merchantAddress: "Jl. Jend. Sudirman No. 45, Jakarta Pusat",
      category: "Makan",
      paymentMethod: "QRIS",
      items: [
        { id: "item-1", name: "Ultra Milk Coklat 250ml", category: "Makan", quantity: 2, price: 7500, totalPrice: 15000 },
        { id: "item-2", name: "Roti Tawar Gandum", category: "Makan", quantity: 1, price: 18500, totalPrice: 18500 },
        { id: "item-3", name: "Sabun Mandi Lifebuoy", category: "Kebutuhan", quantity: 2, price: 4000, totalPrice: 8000 },
        { id: "item-4", name: "Pasta Gigi Pepsodent", category: "Kebutuhan", quantity: 1, price: 16000, totalPrice: 16000 },
      ],
      tax: 0,
      discount: 2500,
    },
    {
      merchant: "Kopi Kenangan - Mall Ambassador",
      merchantAddress: "Mall Ambassador Lt. 2, Jakarta Selatan",
      category: "Makan",
      paymentMethod: "GoPay",
      items: [
        { id: "item-1", name: "Kopi Kenangan Mantan (L)", category: "Makan", quantity: 1, price: 24000, totalPrice: 24000 },
        { id: "item-2", name: "Roti Coklat Klasik", category: "Makan", quantity: 1, price: 12000, totalPrice: 12000 },
      ],
      tax: 3600,
      discount: 0,
    },
    {
      merchant: "SPBU Pertamina 31.129.02",
      merchantAddress: "Jl. HR Rasuna Said Kav. 10",
      category: "Transportasi",
      paymentMethod: "MyPertamina / QRIS",
      items: [
        { id: "item-1", name: "Pertamax (RON 92)", category: "Transportasi", quantity: 7.8, price: 12800, totalPrice: 100000 },
      ],
      tax: 0,
      discount: 0,
    },
    {
      merchant: "Apotek Kimia Farma Salemba",
      merchantAddress: "Jl. Salemba Raya No. 12",
      category: "Kebutuhan",
      paymentMethod: "Debit BCA",
      items: [
        { id: "item-1", name: "Panadol Extra 10 Tablet", category: "Kebutuhan", quantity: 2, price: 14500, totalPrice: 29000 },
        { id: "item-2", name: "Enervon-C Multivitamin 30s", category: "Kebutuhan", quantity: 1, price: 45000, totalPrice: 45000 },
      ],
      tax: 0,
      discount: 0,
    },
  ];

  const randomSample = samples[Math.floor(Math.random() * samples.length)];
  const subtotal = randomSample.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = subtotal + randomSample.tax - randomSample.discount;

  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  const timeStr = today.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return {
    merchant: randomSample.merchant,
    merchantAddress: randomSample.merchantAddress,
    date: dateStr,
    time: timeStr,
    category: randomSample.category,
    items: randomSample.items,
    subtotal,
    tax: randomSample.tax,
    serviceCharge: 0,
    discount: randomSample.discount,
    total,
    paymentMethod: randomSample.paymentMethod,
    confidence: 94,
    notes: "Data diekstrak otomatis melalui OCR FINUSA Vision",
    isSimulated: true,
  };
}
