-- ==============================================================================
-- FINUSA Receipt Scanner Database & Storage Schema Migration
-- ==============================================================================

-- 1. Create receipt_photos Table
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

-- Index for fast user lookups and quota aggregation
CREATE INDEX IF NOT EXISTS idx_receipt_photos_user_id ON public.receipt_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_receipt_photos_uploaded_at ON public.receipt_photos(uploaded_at DESC);

-- Enable RLS on receipt_photos
ALTER TABLE public.receipt_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for receipt_photos
CREATE POLICY "Users can view their own receipt photos"
    ON public.receipt_photos
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own receipt photos"
    ON public.receipt_photos
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receipt photos"
    ON public.receipt_photos
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own receipt photos"
    ON public.receipt_photos
    FOR DELETE
    USING (auth.uid() = user_id);

-- 2. Create or Update expenses / transactions Table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    merchant TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    receipt_photo_id UUID REFERENCES public.receipt_photos(id) ON DELETE SET NULL,
    source TEXT NOT NULL DEFAULT 'manual', -- 'receipt_scan', 'manual', 'import'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add columns to expenses if table already existed without them
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='receipt_photo_id') THEN
        ALTER TABLE public.expenses ADD COLUMN receipt_photo_id UUID REFERENCES public.receipt_photos(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='source') THEN
        ALTER TABLE public.expenses ADD COLUMN source TEXT NOT NULL DEFAULT 'manual';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='merchant') THEN
        ALTER TABLE public.expenses ADD COLUMN merchant TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='items') THEN
        ALTER TABLE public.expenses ADD COLUMN items JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- Enable RLS on expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for expenses
CREATE POLICY "Users can view their own expenses"
    ON public.expenses
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses"
    ON public.expenses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
    ON public.expenses
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
    ON public.expenses
    FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Storage Bucket Configuration for 'receipts'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'receipts',
    'receipts',
    true,
    5242880, -- 5MB limit per file
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

-- Storage RLS Policies
CREATE POLICY "Users can view receipts in storage"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload receipts to storage"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their receipts in storage"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their receipts in storage"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
