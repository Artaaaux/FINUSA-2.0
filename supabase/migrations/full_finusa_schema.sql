-- ==============================================================================
-- FINUSA (Finance Nusantara) - FULL DATABASE SCHEMA & RLS MIGRATION
-- Database: Supabase PostgreSQL
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES TABLE (Linked to auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
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
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ==============================================================================
-- 2. ACCOUNTS / WALLETS TABLE (Dompet, Rekening Bank, E-Wallet, Kas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'bank', -- 'cash', 'bank', 'e_wallet', 'credit_card', 'business'
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

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can insert own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can update own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can delete own accounts" ON public.accounts;

CREATE POLICY "Users can view own accounts" ON public.accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON public.accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON public.accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" ON public.accounts
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- 3. CATEGORIES TABLE (Pos Pemasukan & Pengeluaran)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for global system templates
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'income', 'expense'
    icon TEXT DEFAULT 'Layers',
    color TEXT DEFAULT '#4B7BFF',
    budget_limit NUMERIC DEFAULT 0,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own or default categories" ON public.categories;
DROP POLICY IF EXISTS "Users can insert own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON public.categories;

CREATE POLICY "Users can view own or default categories" ON public.categories
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own categories" ON public.categories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON public.categories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON public.categories
    FOR DELETE USING (auth.uid() = user_id AND is_default = false);

-- ==============================================================================
-- 4. RECEIPT PHOTOS TABLE (Arsip OCR Struk)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.receipt_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    resolution TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    extracted_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_receipt_photos_user ON public.receipt_photos(user_id);
ALTER TABLE public.receipt_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own receipt photos" ON public.receipt_photos;
DROP POLICY IF EXISTS "Users can insert own receipt photos" ON public.receipt_photos;
DROP POLICY IF EXISTS "Users can delete own receipt photos" ON public.receipt_photos;

CREATE POLICY "Users can view own receipt photos" ON public.receipt_photos
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own receipt photos" ON public.receipt_photos
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own receipt photos" ON public.receipt_photos
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- 5. TRANSACTIONS TABLE (Buku Kas & Riwayat Transaksi Finusa)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    receipt_photo_id UUID REFERENCES public.receipt_photos(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL, -- 'income', 'expense', 'transfer'
    description TEXT DEFAULT '',
    merchant TEXT DEFAULT '',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time TEXT DEFAULT '12:00',
    status TEXT NOT NULL DEFAULT 'completed', -- 'completed', 'pending'
    source TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'receipt_scan', 'recurring', 'import', 'sheets'
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb,
    is_reconciled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category_id);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;

CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON public.transactions
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- 6. RECURRING TRANSACTIONS (Transaksi Berulang)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.recurring_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    template_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL DEFAULT 'expense', -- 'income', 'expense', 'transfer'
    description TEXT DEFAULT '',
    frequency TEXT NOT NULL DEFAULT 'monthly', -- 'daily', 'weekly', 'monthly', 'yearly'
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    next_occurrence_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    auto_create BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_recurring_user ON public.recurring_transactions(user_id);
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own recurring" ON public.recurring_transactions;
CREATE POLICY "Users can manage own recurring" ON public.recurring_transactions
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 7. SAVINGS GOALS & AUTO-SAVE (Target Tabungan / Nabung)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    target_amount NUMERIC NOT NULL,
    current_amount NUMERIC NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'Umum',
    deadline DATE,
    icon TEXT DEFAULT 'Target',
    color TEXT DEFAULT '#4B7BFF',
    priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_savings_goals_user ON public.savings_goals(user_id);
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own savings goals" ON public.savings_goals;
DROP POLICY IF EXISTS "Users can view own savings goals" ON public.savings_goals;
DROP POLICY IF EXISTS "Users can insert own savings goals" ON public.savings_goals;
DROP POLICY IF EXISTS "Users can update own savings goals" ON public.savings_goals;
DROP POLICY IF EXISTS "Users can delete own savings goals" ON public.savings_goals;

CREATE POLICY "Users can view own savings goals" ON public.savings_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own savings goals" ON public.savings_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own savings goals" ON public.savings_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own savings goals" ON public.savings_goals FOR DELETE USING (auth.uid() = user_id);

-- Goal Transactions (Mutasi Setor/Tarik Tabungan)
CREATE TABLE IF NOT EXISTS public.goal_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.savings_goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL DEFAULT 'deposit', -- 'deposit', 'withdrawal'
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_goal_tx_goal ON public.goal_transactions(goal_id);
ALTER TABLE public.goal_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own goal transactions" ON public.goal_transactions;
DROP POLICY IF EXISTS "Users can view own goal transactions" ON public.goal_transactions;
DROP POLICY IF EXISTS "Users can insert own goal transactions" ON public.goal_transactions;
DROP POLICY IF EXISTS "Users can delete own goal transactions" ON public.goal_transactions;

CREATE POLICY "Users can view own goal transactions" ON public.goal_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goal transactions" ON public.goal_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own goal transactions" ON public.goal_transactions FOR DELETE USING (auth.uid() = user_id);

-- Auto-Save Rules (Jadwal Menabung Otomatis)
CREATE TABLE IF NOT EXISTS public.recurring_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.savings_goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'monthly', -- 'daily', 'weekly', 'monthly'
    next_run_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.recurring_transfers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own recurring transfers" ON public.recurring_transfers;
CREATE POLICY "Users can manage own recurring transfers" ON public.recurring_transfers FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 8. USER PREFERENCES & SETTINGS (Pengaturan Pengguna)
-- ==============================================================================
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

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 9. GOOGLE SHEETS INTEGRATION TABLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.google_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    access_token TEXT,
    refresh_token TEXT,
    token_expiry TIMESTAMPTZ,
    granted_scopes TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    auto_sync_enabled BOOLEAN NOT NULL DEFAULT true,
    quota_used_percent INT NOT NULL DEFAULT 0,
    connected_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.google_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own google accounts" ON public.google_accounts;
CREATE POLICY "Users can manage own google accounts" ON public.google_accounts
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.synced_sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    google_sheet_id TEXT NOT NULL,
    sheet_title TEXT NOT NULL,
    sheet_url TEXT NOT NULL,
    sheet_tab_name TEXT NOT NULL DEFAULT 'Sheet1',
    sync_frequency TEXT NOT NULL DEFAULT 'realtime', -- 'realtime', 'hourly', 'daily', 'weekly', 'monthly', 'manual'
    is_active BOOLEAN NOT NULL DEFAULT true,
    bidirectional BOOLEAN NOT NULL DEFAULT true,
    last_sync_at TIMESTAMPTZ,
    next_sync_at TIMESTAMPTZ,
    sync_status TEXT NOT NULL DEFAULT 'synced', -- 'synced', 'syncing', 'pending', 'error'
    last_error TEXT,
    row_count INT NOT NULL DEFAULT 0,
    template_id TEXT,
    template_category TEXT,
    filters JSONB DEFAULT '{"dateRange": "this_year", "categories": ["Semua"], "accounts": ["Semua Rekening"], "transactionStatus": "all"}'::jsonb,
    column_mappings JSONB DEFAULT '[]'::jsonb,
    shared_users JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.synced_sheets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own synced sheets" ON public.synced_sheets;
CREATE POLICY "Users can manage own synced sheets" ON public.synced_sheets
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.sheet_sync_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sheet_id UUID NOT NULL REFERENCES public.synced_sheets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sheet_title TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'success', -- 'success', 'partial', 'failed'
    rows_added INT NOT NULL DEFAULT 0,
    rows_updated INT NOT NULL DEFAULT 0,
    rows_deleted INT NOT NULL DEFAULT 0,
    duration_ms INT NOT NULL DEFAULT 0,
    triggered_by TEXT NOT NULL DEFAULT 'auto_cron', -- 'auto_cron', 'manual_user', 'webhook'
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.sheet_sync_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own sheet sync history" ON public.sheet_sync_history;
CREATE POLICY "Users can manage own sheet sync history" ON public.sheet_sync_history
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 10. STORAGE BUCKET FOR RECEIPTS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'receipts',
    'receipts',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

-- Storage Policies for receipts bucket
DROP POLICY IF EXISTS "Authenticated users can upload receipts" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own receipts" ON storage.objects;

CREATE POLICY "Authenticated users can upload receipts" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view receipts" ON storage.objects
    FOR SELECT USING (bucket_id = 'receipts');

CREATE POLICY "Users can delete own receipts" ON storage.objects
    FOR DELETE USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==============================================================================
-- 11. AUTOMATIC NEW USER ONBOARDING TRIGGER
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

-- Drop existing trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 12. IMMEDIATE BACKFILL FOR ALL EXISTING USERS IN auth.users
-- ==============================================================================
DO $$
DECLARE
    r RECORD;
    def_acc_id UUID;
BEGIN
    FOR r IN SELECT id, email, raw_user_meta_data FROM auth.users LOOP
        -- Profile
        INSERT INTO public.profiles (id, email, first_name, avatar_url, role)
        VALUES (
            r.id,
            r.email,
            COALESCE(r.raw_user_meta_data->>'full_name', r.raw_user_meta_data->>'name', r.raw_user_meta_data->>'first_name', split_part(r.email, '@', 1)),
            COALESCE(r.raw_user_meta_data->>'avatar_url', r.raw_user_meta_data->>'picture', ''),
            'Pemilik Akun'
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            first_name = CASE WHEN public.profiles.first_name IS NULL OR public.profiles.first_name = '' THEN EXCLUDED.first_name ELSE public.profiles.first_name END,
            avatar_url = CASE WHEN public.profiles.avatar_url IS NULL OR public.profiles.avatar_url = '' THEN EXCLUDED.avatar_url ELSE public.profiles.avatar_url END;

        -- Accounts (if user has 0 accounts)
        IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE user_id = r.id) THEN
            INSERT INTO public.accounts (user_id, name, type, balance, color, is_default)
            VALUES 
                (r.id, 'Cash / Tunai', 'cash', 0, '#E8A76F', true),
                (r.id, 'Transfer Bank', 'bank', 0, '#4B7BFF', false),
                (r.id, 'QRIS', 'e_wallet', 0, '#2A9D8F', false),
                (r.id, 'E-Wallet', 'e_wallet', 0, '#10B981', false);

            SELECT id INTO def_acc_id FROM public.accounts WHERE user_id = r.id AND is_default = true LIMIT 1;
        END IF;

        -- Categories (if user has 0 categories)
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
        VALUES (r.id, (SELECT id FROM public.accounts WHERE user_id = r.id AND is_default = true LIMIT 1))
        ON CONFLICT (user_id) DO NOTHING;
    END LOOP;
END $$;

-- ==============================================================================
-- 13. GRANT ROLES & PERMISSIONS (Crucial for Supabase Client Access)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, anon, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated, anon, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated, anon, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated, anon, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated, anon, service_role;
