// Edge Function: AI som hjälper skapa SEO-regler i markdown-format

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CLAUDE_MODEL = 'anthropic/claude-sonnet-4.5'

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
    const userQuestion = typeof body.question === 'string' ? body.question.trim() : ''
    
    if (!userQuestion) {
      return new Response(
        JSON.stringify({ error: 'Skicka en fråga i body.question' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const messages = [
      {
        role: 'system',
        content: `Du är en expert på SEO och svenska webbtexter. Din uppgift är att hjälpa användaren skapa tydliga, välformulerade SEO-regler i markdown-format.

När användaren frågar om en regel (t.ex. "hur ser reglerna ut för korrekt seo för H1"), ska du:
1. Ge en tydlig, konkret regel i markdown-format
2. Använda markdown-syntax (rubriker, listor, fetstil)
3. Vara kortfattad men komplett
4. Fokusera på svenska webbtexter och SEO-best practices
5. Ge praktiska exempel när det är relevant

Svara ENDAST med markdown-formaterad regel, ingen extra förklaring.`
      },
      {
        role: 'user',
        content: userQuestion
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
