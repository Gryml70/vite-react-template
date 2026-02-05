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

    // Läs befintligt innehåll
    const mdFilePath = new URL('../skrivregler-ai/grundregler-seo.md', import.meta.url).pathname
    let existingContent = ''
    try {
      existingContent = await Deno.readTextFile(mdFilePath)
    } catch (err) {
      // Filen finns inte än, skapa med header
      existingContent = '# Grundregler SEO - Svenska webbtexter\n\n'
    }

    // Lägg till ny text med dubbla radbrytningar för separation
    const updatedContent = existingContent.trim() + '\n\n' + textToAdd.trim() + '\n'

    // Skriv tillbaka till fil
    await Deno.writeTextFile(mdFilePath, updatedContent)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Text tillagd i grundregler-seo.md',
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
