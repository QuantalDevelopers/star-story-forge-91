
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Create a Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Retrieve the ElevenLabs API key from Supabase secrets
  const { data, error } = await supabase.functions.getSecret('ELEVENLABS_API_KEY')

  if (error) {
    return new Response(JSON.stringify({ error: 'Failed to retrieve API key' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }

  return new Response(JSON.stringify({ apiKey: data }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  })
})
