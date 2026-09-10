-- ==============================================================================
-- FINUSA - FIX DATABASE TRIGGER v2 (FINAL ROBUST VERSION)
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- 
-- Skrip ini memperbaiki:
-- 1. Function handle_new_user() diatur OWNER TO postgres dan SECURITY DEFINER
-- 2. Setiap langkah (profile, accounts, categories, preferences) memiliki block
--    EXCEPTION terisolasi sendiri, dan ada GLOBAL EXCEPTION di level terluar.
-- 3. Trigger DIJAMIN 100% selalu RETURN NEW sehingga auth.users tidak akan pernah
--    gagal di-insert dan tidak memicu error 500 "Database error saving new user".
-- 4. Semua tabel yang diperlukan (profiles, accounts, categories, user_preferences)
--    dipastikan ada dengan IF NOT EXISTS.
-- 5. Backfill user lama dibungkus per-user exception agar jika ada data aneh tidak
--    menggagalkan eksekusi skrip ini.
-- ==============================================================================

-- ============================================================
-- LANGKAH 1: Pastikan tabel-tabel utama sudah ada
-- ============================================================

-- 1. Profiles
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

-- 2. Accounts
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'bank',
    balance NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'IDR',
    account_number TEXT DEFAULT '',
    institution TEXT DEFAULT '',
    color TEXT DEFAULT '#4B7BFF',
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    icon TEXT DEFAULT 'Layers',
    color TEXT DEFAULT '#4B7BFF',
    budget_limit NUMERIC DEFAULT 0,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. User Preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT NOT NULL DEFAULT 'dark',
    color_accent TEXT NOT NULL DEFAULT '#4B7BFF',
    currency_display TEXT NOT NULL DEFAULT 'full',
    date_format TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    font_size TEXT NOT NULL DEFAULT 'normal',
    compact_mode BOOLEAN NOT NULL DEFAULT false,
    high_contrast BOOLEAN NOT NULL DEFAULT false,
    dyslexia_font BOOLEAN NOT NULL DEFAULT false,
    colorblind_mode BOOLEAN NOT NULL DEFAULT false,
    default_currency TEXT NOT NULL DEFAULT 'IDR (Rp)',
    default_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    budget_warning_threshold INT NOT NULL DEFAULT 80,
    business_mode BOOLEAN NOT NULL DEFAULT true,
    include_transfers_in_cashflow BOOLEAN NOT NULL DEFAULT false,
    analytics_tracking BOOLEAN NOT NULL DEFAULT true,
    marketing_emails BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================
-- LANGKAH 2: Buat fungsi handle_new_user() yang kebal error
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    default_acc_id UUID := NULL;
    user_display_name TEXT := '';
    user_email TEXT := '';
BEGIN
    user_email := COALESCE(NEW.email, '');

    -- Ambil display name yang bersih dari metadata atau email
    user_display_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'first_name',
        NULLIF(split_part(user_email, '@', 1), ''),
        'Pengguna Baru'
    );

    -- 1. SIMPAN PROFIL PENGGUNA
    BEGIN
        INSERT INTO public.profiles (id, email, first_name, avatar_url, role)
        VALUES (
            NEW.id,
            user_email,
            user_display_name,
            COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
            'Pemilik Akun'
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            first_name = CASE 
                WHEN public.profiles.first_name IS NULL OR public.profiles.first_name = '' 
                THEN EXCLUDED.first_name 
                ELSE public.profiles.first_name 
            END,
            avatar_url = CASE 
                WHEN public.profiles.avatar_url IS NULL OR public.profiles.avatar_url = '' 
                THEN EXCLUDED.avatar_url 
                ELSE public.profiles.avatar_url 
            END;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user profile exception: %', SQLERRM;
    END;

    -- 2. BUAT DOMPET / REKENING DEFAULT (Jika belum ada)
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE user_id = NEW.id) THEN
            INSERT INTO public.accounts (user_id, name, type, balance, color, is_default)
            VALUES 
                (NEW.id, 'Cash / Tunai', 'cash', 0, '#E8A76F', true),
                (NEW.id, 'Transfer Bank', 'bank', 0, '#4B7BFF', false),
                (NEW.id, 'QRIS', 'e_wallet', 0, '#2A9D8F', false),
                (NEW.id, 'E-Wallet', 'e_wallet', 0, '#10B981', false);
        END IF;

        SELECT id INTO default_acc_id 
        FROM public.accounts 
        WHERE user_id = NEW.id AND is_default = true 
        LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user accounts exception: %', SQLERRM;
    END;

    -- 3. BUAT KATEGORI DEFAULT (Jika belum ada)
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM public.categories WHERE user_id = NEW.id) THEN
            INSERT INTO public.categories (user_id, name, type, icon, color, budget_limit, is_default)
            VALUES
                -- Incomes
                (NEW.id, 'Gaji Pokok', 'income', 'Wallet', '#10B981', 0, true),
                (NEW.id, 'Honor', 'income', 'Briefcase', '#3B82F6', 0, true),
                (NEW.id, 'Profit jualan', 'income', 'TrendingUp', '#06B6D4', 0, true),
                -- Expenses
                (NEW.id, 'Makan', 'expense', 'Utensils', '#F59E0B', 0, true),
                (NEW.id, 'Transportasi', 'expense', 'Car', '#0EA5E9', 0, true),
                (NEW.id, 'Cicilan', 'expense', 'CreditCard', '#8B5CF6', 0, true),
                (NEW.id, 'Kebutuhan', 'expense', 'Package', '#10B981', 0, true),
                (NEW.id, 'Keinginan', 'expense', 'Sparkles', '#EC4899', 0, true);
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user categories exception: %', SQLERRM;
    END;

    -- 4. BUAT PREFERENSI DEFAULT
    BEGIN
        INSERT INTO public.user_preferences (user_id, default_account_id)
        VALUES (NEW.id, default_acc_id)
        ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user preferences exception: %', SQLERRM;
    END;

    -- Kembalikan NEW agar auth.users insert berhasil tanpa hambatan
    RETURN NEW;

EXCEPTION WHEN OTHERS THEN
    -- Fallback absolut: Jika ada error tak terduga, tetap kembalikan NEW
    RAISE WARNING 'handle_new_user fatal exception: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Set kepemilikan ke postgres (superuser) & berikan hak eksekusi
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated, service_role;

-- ============================================================
-- LANGKAH 3: Pasang Trigger ke auth.users
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- LANGKAH 4: Pastikan Kebijakan RLS (Row Level Security)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Service Role Bypass Policies (untuk service_role)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Service role all profiles') THEN
        CREATE POLICY "Service role all profiles" ON public.profiles TO service_role FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'accounts' AND policyname = 'Service role all accounts') THEN
        CREATE POLICY "Service role all accounts" ON public.accounts TO service_role FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Service role all categories') THEN
        CREATE POLICY "Service role all categories" ON public.categories TO service_role FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_preferences' AND policyname = 'Service role all preferences') THEN
        CREATE POLICY "Service role all preferences" ON public.user_preferences TO service_role FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ============================================================
-- LANGKAH 5: Grant Hak Akses Schema
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated, service_role;
GRANT SELECT ON public.categories TO anon;

-- ============================================================
-- LANGKAH 6: Backfill Aman bagi Pengguna yang Sudah Terdaftar
-- ============================================================
DO $$
DECLARE
    r RECORD;
    def_acc_id UUID;
    disp_name TEXT;
    u_email TEXT;
BEGIN
    FOR r IN 
        SELECT u.id, u.email, u.raw_user_meta_data 
        FROM auth.users u 
        LEFT JOIN public.profiles p ON u.id = p.id 
        WHERE p.id IS NULL
    LOOP
        BEGIN
            u_email := COALESCE(r.email, '');
            disp_name := COALESCE(
                r.raw_user_meta_data->>'full_name',
                r.raw_user_meta_data->>'name',
                r.raw_user_meta_data->>'first_name',
                NULLIF(split_part(u_email, '@', 1), ''),
                'Pengguna FINUSA'
            );

            -- Profile
            INSERT INTO public.profiles (id, email, first_name, avatar_url, role)
            VALUES (r.id, u_email, disp_name, COALESCE(r.raw_user_meta_data->>'avatar_url', r.raw_user_meta_data->>'picture', ''), 'Pemilik Akun')
            ON CONFLICT (id) DO NOTHING;

            -- Accounts
            IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE user_id = r.id) THEN
                INSERT INTO public.accounts (user_id, name, type, balance, color, is_default)
                VALUES 
                    (r.id, 'Cash / Tunai', 'cash', 0, '#E8A76F', true),
                    (r.id, 'Transfer Bank', 'bank', 0, '#4B7BFF', false),
                    (r.id, 'QRIS', 'e_wallet', 0, '#2A9D8F', false),
                    (r.id, 'E-Wallet', 'e_wallet', 0, '#10B981', false);
            END IF;

            SELECT id INTO def_acc_id FROM public.accounts WHERE user_id = r.id AND is_default = true LIMIT 1;

            -- Categories
            IF NOT EXISTS (SELECT 1 FROM public.categories WHERE user_id = r.id) THEN
                INSERT INTO public.categories (user_id, name, type, icon, color, budget_limit, is_default)
                VALUES
                    (r.id, 'Gaji Pokok', 'income', 'Wallet', '#10B981', 0, true),
                    (r.id, 'Honor', 'income', 'Briefcase', '#3B82F6', 0, true),
                    (r.id, 'Profit jualan', 'income', 'TrendingUp', '#06B6D4', 0, true),
                    (r.id, 'Makan', 'expense', 'Utensils', '#F59E0B', 0, true),
                    (r.id, 'Transportasi', 'expense', 'Car', '#0EA5E9', 0, true),
                    (r.id, 'Cicilan', 'expense', 'CreditCard', '#8B5CF6', 0, true),
                    (r.id, 'Kebutuhan', 'expense', 'Package', '#10B981', 0, true),
                    (r.id, 'Keinginan', 'expense', 'Sparkles', '#EC4899', 0, true);
            END IF;

            -- Preferences
            INSERT INTO public.user_preferences (user_id, default_account_id)
            VALUES (r.id, def_acc_id)
            ON CONFLICT (user_id) DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Backfill skip user % due to: %', r.id, SQLERRM;
        END;
    END LOOP;
END $$;
