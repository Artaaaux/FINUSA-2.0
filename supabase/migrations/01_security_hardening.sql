-- ==============================================================================
-- FINUSA - SECURITY HARDENING & MIGRATION UPDATE
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. PERBAIKAN RLS TABEL PROFILES: HAPUS IZIN INSERT DARI ROLE ANONIM
-- Sebelumnya terdapat "auth.uid() IS NULL" yang membuka celah injeksi profil oleh anonim.
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. PENGERASAN PRIVASI STORAGE BUCKET: NONAKTIFKAN AKSES PUBLIK STRUK
-- Fitur AI Scan diperbarui untuk TIDAK LAGI menyimpan foto struk fisik pengguna.
-- Seluruh bucket 'receipts' dijadikan privat dan policy akses publik dicabut sepenuhnya.
UPDATE storage.buckets 
SET public = false 
WHERE id = 'receipts';

DROP POLICY IF EXISTS "Anyone can view receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can view receipts in storage" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload receipts to storage" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their receipts in storage" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their receipts in storage" ON storage.objects;

-- Hanya pengguna pemilik yang dapat mengakses berkas mereka sendiri (jika ada berkas lama)
CREATE POLICY "Users can view own receipts in storage" ON storage.objects
    FOR SELECT 
    USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own receipts in storage" ON storage.objects
    FOR DELETE 
    USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. BATASI HAK AKSES ROLE ANONIM (DEFENSE IN DEPTH)
-- Cabut izin tulis (INSERT, UPDATE, DELETE, TRUNCATE) pada semua tabel schema public dari role anon.
-- Mencegah eksploitasi jika ada tabel yang tidak sengaja belum mengaktifkan RLS.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM anon;

-- Pastikan role authenticated tetap memiliki hak akses melalui RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- 4. PASTIKAN SELURUH TABEL MENGAKTIFKAN RLS (ROW LEVEL SECURITY)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.receipt_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.goal_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.recurring_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.google_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.synced_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sheet_sync_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.expenses ENABLE ROW LEVEL SECURITY;
