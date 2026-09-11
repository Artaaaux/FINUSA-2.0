-- ==============================================================================
-- FINUSA - QUICK & PERMANENT TRIGGER FIX
-- Jalankan 3 perintah ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. HAPUS TRIGGER BERMASALAH DARI auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. BUAT FUNGSI TRIGGER YANG SUPER RINGAN & KEBAL ERROR
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(COALESCE(NEW.email, ''), '@', 1),
            'Pengguna FINUSA'
        )
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Jangan pernah gagalkan pendaftaran user auth
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PASANG KEMBALI TRIGGER KE auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
