import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  try {
    const payload = await req.json();
    console.log('Received payload:', payload);
    const { userId, fileName, fileUrl, textContent } = payload;

    if (!userId || (!fileUrl && !textContent)) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or content' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // If we have text content passed from frontend (simpler for now), use it.
    // Otherwise, we would fetch from fileUrl and parse PDF.
    let textToParse = textContent;

    if (!textToParse && fileUrl) {
        // Fetch from storage if URL provided
        const res = await fetch(fileUrl);
        const blob = await res.blob();
        // Here we would use a PDF library. 
        // For efficiency, Mallah's frontend will pass the first 4kb of text if available,
        // or we use a fallback if we had a dedicated PDF parser ready.
        textToParse = "Text extraction from PDF at " + fileUrl; 
    }

    if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

    // Call OpenAI to extract skills and experience
    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: 'Extract skills and experience from the following CV text. Return JSON with extracted_skills (array of {skill_name, inferred_level}), experience_years (number), and previous_roles (array of strings).' },
                { role: 'user', content: textToParse }
            ],
            response_format: { type: 'json_object' }
        })
    });

    const aiData = await aiRes.json();
    const extractedData = JSON.parse(aiData.choices[0].message.content);

    const { data, error } = await supabase
      .from('cv_uploads')
      .upsert(
        {
          user_id: userId,
          file_name: fileName,
          extracted_skills: extractedData.extracted_skills,
          experience_years: extractedData.experience_years,
          previous_roles: extractedData.previous_roles,
          uploaded_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select('*')
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, cv: data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
