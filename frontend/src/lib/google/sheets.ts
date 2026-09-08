import { google } from "googleapis";
import { getOAuth2Client } from "./oauth";
import { createClient } from "@/lib/auth/supabase-server";

export async function getAuthenticatedGoogleClients(userId: string) {
  const supabase = await createClient();

  const { data: account, error } = await supabase
    .from("google_accounts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  if (error || !account) {
    throw new Error("Akun Google belum terhubung atau sesi telah berakhir.");
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.token_expiry ? new Date(account.token_expiry).getTime() : undefined,
  });

  // Listen for automatic token refreshes
  oauth2Client.on("tokens", async (tokens) => {
    const updatePayload: Record<string, unknown> = {
      access_token: tokens.access_token,
      last_used_at: new Date().toISOString(),
    };
    if (tokens.refresh_token) {
      updatePayload.refresh_token = tokens.refresh_token;
    }
    if (tokens.expiry_date) {
      updatePayload.token_expiry = new Date(tokens.expiry_date).toISOString();
    }

    await supabase
      .from("google_accounts")
      .update(updatePayload)
      .eq("id", account.id);
  });

  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  return { sheets, drive, account, oauth2Client, supabase };
}

export async function createGoogleSpreadsheet(
  userId: string,
  title: string,
  templateCategory: string = "income_expense"
) {
  const { sheets, supabase } = await getAuthenticatedGoogleClients(userId);

  // 1. Create Spreadsheet on Google Drive
  const newSheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: title || `FINUSA - Pembukuan & Rekap Transaksi`,
      },
      sheets: [
        {
          properties: {
            title: "Data Transaksi",
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    },
  });

  const spreadsheetId = newSheet.data.spreadsheetId;
  const spreadsheetUrl = newSheet.data.spreadsheetUrl;

  if (!spreadsheetId || !spreadsheetUrl) {
    throw new Error("Gagal membuat Google Spreadsheet baru.");
  }

  // 2. Set Header Row and formatting
  const headers = [
    ["Tanggal", "Jenis Transaksi", "Kategori", "Nominal (IDR)", "Keterangan", "Sumber Rekening / Kas", "Status"]
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Data Transaksi!A1:G1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: headers,
    },
  });

  // 3. Save to Supabase public.synced_sheets
  const { data: dbSheet, error: dbError } = await supabase
    .from("synced_sheets")
    .insert({
      user_id: userId,
      google_sheet_id: spreadsheetId,
      sheet_title: title || `FINUSA - Pembukuan & Rekap Transaksi`,
      sheet_url: spreadsheetUrl,
      sheet_tab_name: "Data Transaksi",
      sync_frequency: "realtime",
      is_active: true,
      bidirectional: true,
      template_category: templateCategory,
      sync_status: "synced",
      row_count: 0,
      last_sync_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (dbError) {
    console.error("Failed to insert into synced_sheets:", dbError);
  }

  // 4. Initial push of existing transactions
  if (dbSheet) {
    try {
      await syncSpreadsheetTransactions(userId, dbSheet.id);
    } catch (e) {
      console.warn("Initial sync error on created sheet:", e);
    }
  }

  return dbSheet || {
    id: spreadsheetId,
    googleSheetId: spreadsheetId,
    sheetTitle: title,
    sheetUrl: spreadsheetUrl,
    sheetTabName: "Data Transaksi",
  };
}

export async function syncSpreadsheetTransactions(
  userId: string,
  sheetRecordId: string,
  triggeredBy: string = "manual_user"
) {
  const startTime = Date.now();
  const { sheets, supabase } = await getAuthenticatedGoogleClients(userId);

  // 1. Get sheet info from Supabase
  const { data: sheetRecord, error: sheetError } = await supabase
    .from("synced_sheets")
    .select("*")
    .eq("id", sheetRecordId)
    .eq("user_id", userId)
    .single();

  if (sheetError || !sheetRecord) {
    throw new Error("Spreadsheet yang disinkronkan tidak ditemukan.");
  }

  // 2. Fetch all user transactions from Supabase
  const { data: transactions, error: txError } = await supabase
    .from("transactions")
    .select("*, categories(name), accounts(name)")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (txError) {
    throw new Error(`Gagal mengambil data transaksi: ${txError.message}`);
  }

  // 3. Format rows
  const header = ["Tanggal", "Jenis Transaksi", "Kategori", "Nominal (IDR)", "Keterangan", "Sumber Rekening / Kas", "Status"];
  const rows = (transactions || []).map((t) => [
    t.date || "",
    t.type === "income" ? "Pemasukan" : "Pengeluaran",
    t.categories?.name || t.category_name || "Lainnya",
    Number(t.amount) || 0,
    t.description || "",
    t.accounts?.name || t.account_name || "Kas Utama",
    t.status === "completed" ? "Selesai" : "Pending",
  ]);

  const allValues = [header, ...rows];

  // 4. Clear and write values to Google Sheet
  const tabName = sheetRecord.sheet_tab_name || "Data Transaksi";
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetRecord.google_sheet_id,
    range: `${tabName}!A1:G${allValues.length}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: allValues,
    },
  });

  const durationMs = Date.now() - startTime;
  const rowCount = rows.length;

  // 5. Update synced_sheets status
  await supabase
    .from("synced_sheets")
    .update({
      last_sync_at: new Date().toISOString(),
      sync_status: "synced",
      row_count: rowCount,
      last_error: null,
    })
    .eq("id", sheetRecordId);

  // 6. Log history in public.sheet_sync_history
  await supabase
    .from("sheet_sync_history")
    .insert({
      sheet_id: sheetRecordId,
      user_id: userId,
      sheet_title: sheetRecord.sheet_title,
      status: "success",
      rows_added: rowCount,
      rows_updated: 0,
      rows_deleted: 0,
      duration_ms: durationMs,
      triggered_by: triggeredBy,
    });

  return {
    success: true,
    rowCount,
    durationMs,
  };
}
