-- Tabell för att lagra SEO-regler (säkert på servern)
CREATE TABLE IF NOT EXISTS seo_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index för snabbare läsning
CREATE INDEX IF NOT EXISTS idx_seo_rules_updated ON seo_rules(updated_at DESC);

-- Trigger för att uppdatera updated_at
CREATE OR REPLACE FUNCTION update_seo_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER seo_rules_updated_at
  BEFORE UPDATE ON seo_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_rules_updated_at();

-- Sätt initial regel-innehåll
INSERT INTO seo_rules (content) VALUES ('# Grundregler SEO - Svenska webbtexter

## Meta-beskrivningar
- Max 156 tecken
- Innehåll: Locka läsaren att klicka
- Inkludera primärt nyckelord naturligt
- Skriv en unik beskrivning för varje sida

## Rubriker (H1-H6)
- **H1**: En per sida, innehåller primärt nyckelord
- **H2-H3**: Strukturera innehållet logiskt
- Använd nyckelord naturligt, undvik keyword stuffing
- Gör rubrikerna beskrivande och informativa
') ON CONFLICT DO NOTHING;
