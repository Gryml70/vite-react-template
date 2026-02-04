-- Tabell för mall-innehåll (handla-hemsida.com)
-- Desktop_16x9_header mall från Figma

CREATE TABLE IF NOT EXISTS mall_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Meta
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    published BOOLEAN DEFAULT false,
    
    -- Hero Section
    hero_image TEXT NOT NULL,
    hero_title TEXT NOT NULL,
    hero_content TEXT NOT NULL,
    hero_cta_text TEXT,
    hero_cta_url TEXT,
    
    -- Row 2 & 3
    subtitle TEXT,
    heading TEXT,
    body TEXT,
    row2_image TEXT,
    row3_image TEXT,
    
    -- Kort-sektion
    cards_title TEXT,
    card1 TEXT,
    card2 TEXT,
    card3 TEXT
);

-- Index för snabb sökning
CREATE INDEX IF NOT EXISTS idx_mall_content_slug ON mall_content(slug);
CREATE INDEX IF NOT EXISTS idx_mall_content_published ON mall_content(published);

-- Auto-uppdatera updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mall_content_updated_at BEFORE UPDATE ON mall_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - tillåt alla operationer för nu (senare kan vi lägga till auth)
ALTER TABLE mall_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on mall_content" ON mall_content
    FOR ALL USING (true) WITH CHECK (true);

-- Kommentar
COMMENT ON TABLE mall_content IS 'Innehåll för Desktop_16x9_header mall (handla-hemsida.com)';
