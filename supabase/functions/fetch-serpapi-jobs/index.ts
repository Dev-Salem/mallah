import 'https://deno.land/x/xhr@0.3.0/mod.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const SERPAPI_KEY = Deno.env.get('SERPAPI_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// In Saudi context, searching in Arabic and English is better
const pathQueries = {
  frontend: 'Frontend Developer OR React Developer Riyadh OR Jeddah Saudi Arabia',
  fullstack: 'Full Stack Developer OR Node.js Developer Riyadh OR Jeddah Saudi Arabia',
  cybersecurity: 'Cybersecurity Analyst OR Penetration Tester Saudi Arabia',
  datascience: 'Data Scientist OR Data Analyst Saudi Arabia',
};

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Clear expired jobs
    await supabase.from('job_listings').update({ status: 'expired' }).lt('expires_at', new Date().toISOString());

    if (!SERPAPI_KEY) {
      console.warn("SERPAPI_KEY not set - skipping fetch");
      return new Response(JSON.stringify({ success: false, message: "SERPAPI_KEY missing" }), { headers: { 'Content-Type': 'application/json' } });
    }

    const allAdded = [];

    for (const [path, query] of Object.entries(pathQueries)) {
      const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&location=Saudi+Arabia&api_key=${SERPAPI_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.jobs_results) {
        const listings = data.jobs_results.map((job: any) => ({
          job_id: job.job_id || crypto.randomUUID(),
          title: job.title,
          company: job.company_name,
          location: job.location,
          description: job.description,
          apply_link: job.extensions?.find((e: string) => e.includes("Apply")) || job.job_id,
          source: 'serpapi',
          path_id: path,
          posted_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          status: 'active'
        }));

        const { data: inserted, error } = await supabase
          .from('job_listings')
          .upsert(listings, { onConflict: 'job_id' });
        
        if (!error) allAdded.push(...listings);
      }
    }

    return new Response(JSON.stringify({ success: true, count: allAdded.length }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
