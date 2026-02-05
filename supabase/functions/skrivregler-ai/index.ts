// Supabase Edge Function – Skrivregler AI med Claude
// SEO-reglerna lagras säkert på servern och är inte synliga för klienten

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CLAUDE_MODEL = 'anthropic/claude-sonnet-4.5'

// Läs SEO-regler från fil (redigeras i supabase/functions/skrivregler-ai/grundregler-seo.md)
async function loadSEORules(): Promise<string> {
  try {
    const seoRulesPath = new URL('./grundregler-seo.md', import.meta.url).pathname
    return await Deno.readTextFile(seoRulesPath)
  } catch (err) {
    console.error('Kunde inte läsa SEO-regler:', err)
    return `# Grundregler SEO - Svenska webbtexter

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
- Gör det lätt att ta nästa steg`
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('OPENROUTER_API_KEY') || ''
    if (!apiKey.trim()) {
      return new Response(
        JSON.stringify({ error: 'OPENROUTER_API_KEY saknas' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json().catch(() => ({}))
    const userPrompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
    
    if (!userPrompt) {
      return new Response(
        JSON.stringify({ error: 'Skicka en prompt i body.prompt' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Läs SEO-regler från fil (säker på servern)
    const seoRules = await loadSEORules()

    // Bygg meddelanden med SEO-regler som system prompt
    const messages = [
      {
        role: 'system',
        content: `Du är en expert på SEO och svenska webbtexter. Följ dessa regler när du skapar innehåll:

${seoRules}

Svara alltid på svenska. Skapa välskriven, SEO-optimerad text baserat på användarens önskemål.`
      },
      {
        role: 'user',
        content: userPrompt
      }
    ]

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': req.headers.get('origin') || 'https://handla-hemsida.com',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        messages,
        max_tokens: 8192,
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: data.error?.message || data.error || res.statusText || 'OpenRouter fel',
        }),
        { status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const content = data.choices?.[0]?.message?.content
    if (content == null) {
      return new Response(
        JSON.stringify({ error: 'Inget svar från Claude' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ content: content.trim() }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Ett oväntat fel uppstod' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
