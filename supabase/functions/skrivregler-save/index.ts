// Edge Function: Spara markerad text till grundregler-seo.md

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const textToAdd = typeof body.text === 'string' ? body.text.trim() : ''
    
    if (!textToAdd) {
      return new Response(
        JSON.stringify({ error: 'Skicka text att lägga till i body.text' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://aoovgbubyetnymvtshud.supabase.co'
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    // Hämta befintliga regler
    const getRes = await fetch(`${supabaseUrl}/rest/v1/seo_rules?select=id,content&order=updated_at.desc&limit=1`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      }
    })
    
    const existing = await getRes.json()
    let existingContent = '# Grundregler SEO - Svenska webbtexter\n\n'
    let existingId = null
    
    if (existing && existing[0]) {
      existingContent = existing[0].content
      existingId = existing[0].id
    }

    // Lägg till ny text
    const updatedContent = existingContent.trim() + '\n\n' + textToAdd.trim() + '\n'

    // Uppdatera eller skapa
    let saveRes
    if (existingId) {
      saveRes = await fetch(`${supabaseUrl}/rest/v1/seo_rules?id=eq.${existingId}`, {
        method: 'PATCH',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ content: updatedContent })
      })
    } else {
      saveRes = await fetch(`${supabaseUrl}/rest/v1/seo_rules`, {
        method: 'POST',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: updatedContent })
      })
    }

    if (!saveRes.ok) {
      throw new Error(`Kunde inte spara: ${saveRes.statusText}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Text tillagd i SEO-regler',
        totalLength: updatedContent.length 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Ett oväntat fel uppstod' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
