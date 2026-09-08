export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface ExtractedReceiptData {
  merchant: string;
  merchantAddress?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM:SS or HH:MM
  category: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentMethod: string;
  confidence: number; // 0-100
  notes?: string;
  isSimulated?: boolean;
}
