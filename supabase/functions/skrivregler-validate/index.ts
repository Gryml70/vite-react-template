// Edge Function: AI som validerar innehåll mot SEO-reglerna

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CLAUDE_MODEL = 'anthropic/claude-sonnet-4.5'

// Läs SEO-regler från Supabase databas
async function loadSEORules(): Promise<string> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://aoovgbubyetnymvtshud.supabase.co'
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    const res = await fetch(`${supabaseUrl}/rest/v1/seo_rules?select=content&order=updated_at.desc&limit=1`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      }
    })
    
    const data = await res.json()
    if (data && data[0] && data[0].content) {
      return data[0].content
    }
    
    return '# Inga regler att validera mot'
  } catch (err) {
    console.error('Kunde inte läsa SEO-regler:', err)
    return '# Inga regler att validera mot'
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
    const contentToValidate = typeof body.content === 'string' ? body.content.trim() : ''
    
    if (!contentToValidate) {
      return new Response(
        JSON.stringify({ error: 'Skicka innehåll att validera i body.content' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Läs SEO-regler från fil
    const seoRules = await loadSEORules()

    const messages = [
      {
        role: 'system',
        content: `Du är en strikt SEO-granskare. Din uppgift är att kontrollera om ett innehåll följer dessa regler:

${seoRules}

Analysera innehållet och svara i detta format:

**Status:** [Korrekt ✅ eller Fel ❌]

**Bedömning:**
[Kort sammanfattning]

**Detaljer:**
- [Lista vad som är rätt]
- [Lista vad som är fel, om något]

Var konkret och specifik. Om något är fel, förklara exakt vad och hur det ska rättas.`
      },
      {
        role: 'user',
        content: `Kontrollera detta innehåll mot SEO-reglerna:\n\n${contentToValidate}`
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
        max_tokens: 4096,
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
