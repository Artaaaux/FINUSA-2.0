-- ==============================================================================
-- FINUSA - FIX DATABASE TRIGGER & BACKFILL PENGGUNA BARU
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- 
-- Skrip ini menyelesaikan:
-- 1. Error 500 "Database error saving new user" saat user mendaftar.
-- 2. Memastikan hak akses SECURITY DEFINER pada PostgreSQL.
-- 3. Mengisi otomatis (backfill) data profile, akun default, dan kategori
--    bagi user yang sudah terlanjur terdaftar di auth.users.
-- ==============================================================================

-- 1. FUNGSI TRIGGER UNTUK PENGGUNA BARU
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    default_acc_id UUID;
    user_display_name TEXT;
BEGIN
    -- Ambil display name yang bersih dari metadata atau email
    user_display_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'first_name',
        split_part(NEW.email, '@', 1)
    );

    -- 1. Simpan Profil Pengguna
    BEGIN
        INSERT INTO public.profiles (id, email, first_name, avatar_url, role)
        VALUES (
            NEW.id,
            NEW.email,
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
        RAISE WARNING 'handle_new_user profile insert warning: %', SQLERRM;
    END;

    -- 2. Buat Rekening / Dompet Default (Hanya jika belum ada)
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE user_id = NEW.id) THEN
            INSERT INTO public.accounts (user_id, name, type, balance, color, is_default)
            VALUES 
                (NEW.id, 'Cash / Tunai', 'cash', 0, '#E8A76F', true),
                (NEW.id, 'Transfer Bank', 'bank', 0, '#4B7BFF', false),
                (NEW.id, 'QRIS', 'e_wallet', 0, '#2A9D8F', false),
                (NEW.id, 'E-Wallet', 'e_wallet', 0, '#10B981', false);
        END IF;

        SELECT id INTO default_acc_id FROM public.accounts WHERE user_id = NEW.id AND is_default = true LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user accounts insert warning: %', SQLERRM;
    END;

    -- 3. Buat Kategori Pemasukan & Pengeluaran Default (Hanya jika belum ada)
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
        RAISE WARNING 'handle_new_user categories insert warning: %', SQLERRM;
    END;

    -- 4. Buat Pengaturan Preferensi Default Pengguna
    BEGIN
        INSERT INTO public.user_preferences (user_id, default_account_id)
        VALUES (NEW.id, default_acc_id)
        ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user preferences insert warning: %', SQLERRM;
    END;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Pencegahan fatal: Pastikan trigger selalu mengembalikan NEW agar akun auth.users berhasil tersimpan
    RAISE WARNING 'handle_new_user global fallback warning: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Atur kepemilikan dan hak eksekusi ke postgres/superuser
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated, service_role;

-- 2. AKTIFKAN TRIGGER PADA TABEL auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. BACKFILL UNTUK SELURUH USER YANG SUDAH TERDAFTAR DI auth.users
DO $$
DECLARE
    r RECORD;
    def_acc_id UUID;
    disp_name TEXT;
BEGIN
    FOR r IN SELECT id, email, raw_user_meta_data FROM auth.users LOOP
        disp_name := COALESCE(
            r.raw_user_meta_data->>'full_name',
            r.raw_user_meta_data->>'name',
            r.raw_user_meta_data->>'first_name',
            split_part(r.email, '@', 1)
        );

        -- Buat/Update Profil
        INSERT INTO public.profiles (id, email, first_name, avatar_url, role)
        VALUES (
            r.id,
            r.email,
            disp_name,
            COALESCE(r.raw_user_meta_data->>'avatar_url', r.raw_user_meta_data->>'picture', ''),
            'Pemilik Akun'
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            first_name = CASE 
                WHEN public.profiles.first_name IS NULL OR public.profiles.first_name = '' 
                THEN EXCLUDED.first_name 
                ELSE public.profiles.first_name 
            END;

        -- Buat Akun Default jika belum ada
        IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE user_id = r.id) THEN
            INSERT INTO public.accounts (user_id, name, type, balance, color, is_default)
            VALUES 
                (r.id, 'Cash / Tunai', 'cash', 0, '#E8A76F', true),
                (r.id, 'Transfer Bank', 'bank', 0, '#4B7BFF', false),
                (r.id, 'QRIS', 'e_wallet', 0, '#2A9D8F', false),
                (r.id, 'E-Wallet', 'e_wallet', 0, '#10B981', false);
        END IF;

        -- Dapatkan id akun default
        SELECT id INTO def_acc_id FROM public.accounts WHERE user_id = r.id AND is_default = true LIMIT 1;

        -- Buat Kategori Default jika belum ada
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

        -- Buat Preferensi jika belum ada
        INSERT INTO public.user_preferences (user_id, default_account_id)
        VALUES (r.id, def_acc_id)
        ON CONFLICT (user_id) DO NOTHING;
    END LOOP;
END $$;

-- 4. PASTIKAN GRANT AKSES SCHEMA DAN TABEL PUBLIC
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, anon, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated, anon, service_role;
