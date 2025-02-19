import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  const { user_id, avatar_url } = await req.json();
  
  try {
    // 1. Fetch image from Google
    const imageResponse = await fetch(avatar_url);
    if (!imageResponse.ok) throw new Error('Failed to fetch Google avatar');
    const imageData = new Uint8Array(await imageResponse.arrayBuffer());

    // 2. Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('profiles')
      .upload(`${user_id}/google.jpg`, imageData, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (storageError) throw storageError;

    // 3. Update user record with storage path
    const { error: dbError } = await supabase
      .from('users')
      .update({ 
        profile_image_path: `${user_id}/google.jpg` 
      })
      .eq('id', user_id);

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});