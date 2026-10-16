-- ==============================================================================
-- FINUSA - SIMPLE ADMIN SYSTEM SETUP MIGRATION
-- Migration: 02_simple_admin_setup.sql
-- ==============================================================================

-- 1. Tambahkan kolom system_role dan last_seen_at pada public.profiles jika belum ada
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS system_role TEXT NOT NULL DEFAULT 'user',
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 2. Tambahkan constraint check agar nilai role valid
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_system_role_check'
    ) THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_system_role_check 
        CHECK (system_role IN ('user', 'admin', 'super_admin'));
    END IF;
END $$;

-- 3. Indeks untuk optimasi query berdasarkan system_role
CREATE INDEX IF NOT EXISTS idx_profiles_system_role ON public.profiles(system_role);

-- 4. Fungsi Security Definer untuk cek status admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND system_role IN ('admin', 'super_admin')
    );
$$;

-- 5. Kebijakan RLS agar Admin dapat melihat seluruh daftar pengguna
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR public.is_admin()
    );

DROP POLICY IF EXISTS "Admins can update user system_role" ON public.profiles;
CREATE POLICY "Admins can update user system_role" ON public.profiles
    FOR UPDATE USING (
        auth.uid() = id OR public.is_admin()
    );

-- ==============================================================================
-- PETUNJUK MENGAKTIFKAN AKUN ADMIN:
-- Jalankan perintah SQL berikut di Supabase SQL Editor untuk menjadikan akun Anda Admin:
-- 
-- UPDATE public.profiles 
-- SET system_role = 'super_admin' 
-- WHERE email = 'MASUKKAN_EMAIL_ANDA_DISINI@gmail.com';
-- ==============================================================================
