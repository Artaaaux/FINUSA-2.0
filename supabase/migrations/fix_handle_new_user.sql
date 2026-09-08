-- ==============================================================================
-- FIX: Supabase handle_new_user Trigger
-- Jalankan script SQL ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- Script ini mencegah error 500 "Database error saving new user" saat user mendaftar.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    default_acc_id UUID;
BEGIN
    -- 1. Create Profile safely
    BEGIN
        INSERT INTO public.profiles (id, email, first_name, avatar_url, role)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
            COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
            'Pemilik Akun'
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            first_name = CASE WHEN public.profiles.first_name IS NULL OR public.profiles.first_name = '' THEN EXCLUDED.first_name ELSE public.profiles.first_name END,
            avatar_url = CASE WHEN public.profiles.avatar_url IS NULL OR public.profiles.avatar_url = '' THEN EXCLUDED.avatar_url ELSE public.profiles.avatar_url END;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user profile insert warning: %', SQLERRM;
    END;

    -- 2. Create Default Accounts for User safely
    BEGIN
        INSERT INTO public.accounts (user_id, name, type, balance, color, is_default)
        VALUES 
            (NEW.id, 'Cash / Tunai', 'cash', 0, '#E8A76F', true),
            (NEW.id, 'Transfer Bank', 'bank', 0, '#4B7BFF', false),
            (NEW.id, 'QRIS', 'e_wallet', 0, '#2A9D8F', false),
            (NEW.id, 'E-Wallet', 'e_wallet', 0, '#10B981', false);

        SELECT id INTO default_acc_id FROM public.accounts WHERE user_id = NEW.id AND is_default = true LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user accounts insert warning: %', SQLERRM;
    END;

    -- 3. Create Default Categories for User safely
    BEGIN
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
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user categories insert warning: %', SQLERRM;
    END;

    -- 4. Create Default User Preferences safely
    BEGIN
        INSERT INTO public.user_preferences (user_id, default_account_id)
        VALUES (NEW.id, default_acc_id)
        ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user preferences insert warning: %', SQLERRM;
    END;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user global warning: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Pastikan Trigger aktif pada tabel auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
