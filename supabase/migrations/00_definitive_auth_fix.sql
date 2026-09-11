-- ==============================================================================
-- FINUSA - DEFINITIVE DATABASE AUTH & TRIGGER FIX
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. HAPUS SEMUA TRIGGER LAMA DARI auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. BERIKAN HAK AKSES SCHEMA PUBLIC KE supabase_auth_admin (ROLE RESMI SUPABASE AUTH)
-- Tanpa grant ini, PostgreSQL 15 memblokir eksekusi fungsi trigger auth dengan error 42501
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role, supabase_auth_admin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated, service_role, supabase_auth_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated, service_role, supabase_auth_admin;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, authenticated, service_role, supabase_auth_admin;

-- 3. PASTIKAN TABEL PROFILES SUDAH ADA & MEMILIKI POLICY YANG BENAR
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL DEFAULT '',
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
    phone_number TEXT DEFAULT '',
    company_name TEXT DEFAULT '',
    role TEXT DEFAULT 'Pemilik Akun',
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    timezone TEXT DEFAULT 'Asia/Jakarta (WIB)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 4. BUAT FUNGSI TRIGGER YANG KEBAL ERROR DENGAN HAK AKSES LENGKAP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(COALESCE(NEW.email, ''), '@', 1),
            'Pengguna FINUSA'
        ),
        'Pemilik Akun'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = CASE 
            WHEN public.profiles.first_name IS NULL OR public.profiles.first_name = '' 
            THEN EXCLUDED.first_name 
            ELSE public.profiles.first_name 
        END;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Jaminan 100%: Jangan pernah gagalkan pendaftaran user di auth.users
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Atur kepemilikan dan hak eksekusi ke role-role Supabase
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role, supabase_auth_admin;

-- 5. PASANG KEMBALI TRIGGER KE auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
