import { supabase } from "../auth/supabase";
import { PembukuanService } from "./pembukuan.service";

export interface SaveReceiptTransactionParams {
  merchantName: string;
  totalAmount: number;
  date: string;
  time?: string;
  categoryName: string;
  accountId?: string;
  description?: string;
  imageBlob?: Blob;
  items?: Array<{ name: string; quantity: number; price: number; totalPrice: number }>;
}

export const ReceiptService = {
  async saveScannedReceipt(params: SaveReceiptTransactionParams) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Pengguna belum terautentikasi.");

    let receiptPhotoId: string | undefined = undefined;

    // 1. Upload photo to Supabase Storage if imageBlob exists
    if (params.imageBlob) {
      const fileName = `${user.id}/${Date.now()}_receipt.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(fileName, params.imageBlob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (!uploadError && uploadData) {
        // Record in receipt_photos
        const { data: photoRecord } = await supabase
          .from("receipt_photos")
          .insert({
            user_id: user.id,
            file_path: uploadData.path,
            file_size: params.imageBlob.size,
            extracted_data: {
              merchant: params.merchantName,
              total: params.totalAmount,
              date: params.date,
              items: params.items || [],
            },
          })
          .select("id")
          .single();

        if (photoRecord) {
          receiptPhotoId = photoRecord.id;
        }
      }
    }

    // 2. Resolve or find matching category
    const categories = await PembukuanService.getCategories();
    let category = categories.find(
      (c) => c.name.toLowerCase().includes(params.categoryName.toLowerCase()) ||
             params.categoryName.toLowerCase().includes(c.name.toLowerCase())
    );

    if (!category && categories.length > 0) {
      category = categories.find((c) => c.type === "expense") || categories[0];
    }

    // 3. Resolve or find default account
    const accounts = await PembukuanService.getAccounts();
    const account = accounts.find((a) => a.id === params.accountId) || accounts[0];

    // 4. Create transaction entry
    const newTx = await PembukuanService.createTransaction({
      amount: params.totalAmount,
      type: "expense",
      categoryId: category ? category.id : "",
      categoryName: category ? category.name : params.categoryName,
      categoryIcon: category ? category.icon : "ShoppingBag",
      categoryColor: category ? category.color : "#EF4444",
      accountId: account ? account.id : "",
      accountName: account ? account.name : "Kasir Tunai",
      description: params.description || `Struk belanja di ${params.merchantName}`,
      merchant: params.merchantName,
      date: params.date || new Date().toISOString().split("T")[0],
      time: params.time || "12:00",
      status: "completed",
      source: "receipt_scan",
      receiptPhotoId: receiptPhotoId,
      tags: ["ocr-receipt", params.categoryName.toLowerCase().replace(/\s+/g, "-")],
      isReconciled: false,
    });

    return newTx;
  },
};
