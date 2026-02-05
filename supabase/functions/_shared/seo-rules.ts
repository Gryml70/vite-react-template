/**
 * SEO-regler som delas mellan Edge Functions
 * 
 * OBS: För att uppdatera reglerna:
 * 1. Redigera denna fil manuellt
 * 2. Redeploya ALLA funktioner som använder den:
 *    - npx supabase functions deploy skrivregler-generate --project-ref aoovgbubyetnymvtshud --no-verify-jwt
 *    - npx supabase functions deploy skrivregler-validate --project-ref aoovgbubyetnymvtshud --no-verify-jwt
 */

export const DEFAULT_SEO_RULES = `# Grundregler SEO - Svenska webbtexter

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

## Nyckelord
- Primärt nyckelord: 1-2% av totala ord
- Sekundära nyckelord: Naturligt inbäddade
- Använd synonymer och relaterade termer
- Nyckelord i första stycket

## Textstruktur
- Första stycket: Sammanfattning med primärt nyckelord
- Korta stycken (max 3-4 meningar)
- Använd punktlistor för läsbarhet
- Intern länkning till relaterat innehåll

## Teknisk SEO för texter
- URL-slug: Korta, beskrivande, med nyckelord
- Alt-text på bilder: Beskrivande med nyckelord
- Intern länkning: Ankartexten beskriver destination
- Extern länkning: Trovärdiga källor, rel="noopener"

## Språk och ton
- Skriv för människor först, sökmotorer sedan
- Använd aktivt språk
- Undvik passiva konstruktioner
- Var konkret och specifik

## Innehållslängd
- Minst 300 ord för vanliga sidor
- 800-2000 ord för blogginlägg och guider
- Kvalitet före kvantitet

## Call-to-Action (CTA)
- Tydlig CTA i slutet av texten
- Använd aktiva verb
- Gör det lätt att ta nästa steg
`
