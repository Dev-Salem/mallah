import 'https://deno.land/x/xhr@0.3.0/mod.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const SERPAPI_KEY = Deno.env.get('SERPAPI_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface PathDefinition {
  queries: string[];
  exclude: string[];
}

const pathConfig: Record<string, PathDefinition> = {
  frontend: {
    queries: ['Junior Frontend Developer', 'Frontend Intern', 'Web Developer Intern', 'React Graduate', 'Associate Frontend Engineer'],
    exclude: ['Lead', 'Manager', 'Senior', 'Principal', 'Solution Architect'],
  },
  fullstack: {
    queries: ['Junior Full Stack Developer', 'Full Stack Intern', 'Entry Level Software Engineer', 'Software Graduate', 'Associate Web Developer'],
    exclude: ['Business Analyst', 'Manager', 'Senior', 'Lead', 'Quality Assurance'],
  },
  cybersecurity: {
    queries: ['Junior Cyber Security', 'Security Intern', 'Junior SOC Analyst', 'Junior Pentester', 'Cyber Security Graduate', 'Information Security Associate'],
    exclude: ['Technician', 'Support', 'Manager', 'Senior', 'Lead', 'NOC'],
  },
  datascience: {
    queries: ['Junior Data Scientist', 'Data Science Intern', 'Junior Data Engineer', 'AI Intern', 'Data Science Graduate', 'Associate Data Analyst'],
    exclude: ['Business Analyst', 'Marketing', 'Sales', 'Manager', 'Senior', 'Lead', 'Administrative'],
  },
};

/**
 * Infer seniority from the job title.
 * Returns null for Senior/Lead roles (these get filtered out).
 */
function inferSeniority(title: string): 'Intern' | 'Junior' | 'Mid' | null {
  const lower = title.toLowerCase();
  
  // Strict Exclusion Check
  if (lower.includes('senior') || lower.includes('lead') || lower.includes('principal') || 
      lower.includes('staff') || lower.includes('manager') || lower.includes('head') ||
      lower.includes('architect') || lower.includes('sr.') || lower.includes('expert')) {
    return null; // Filter out
  }

  if (lower.includes('intern') || lower.includes('co-op') || lower.includes('trainee') || lower.includes('student')) return 'Intern';
  if (lower.includes('junior') || lower.includes('entry') || lower.includes('graduate') || 
      lower.includes('associate') || lower.includes('fresh') || lower.includes('jr.')) return 'Junior';
  
  return 'Mid';
}

function dedupKey(company: string, title: string): string {
  return `${company.toLowerCase().trim()}::${title.toLowerCase().trim()}`;
}

serve(async (_req) => {
  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Step 1: Expire old jobs
    await supabase
      .from('job_listings')
      .update({ status: 'expired' })
      .lt('expires_at', new Date().toISOString())
      .eq('status', 'published');

    // Step 2: Check for API key
    if (!SERPAPI_KEY) {
      console.warn('SERPAPI_KEY not set - skipping fetch');
      return new Response(
        JSON.stringify({ success: false, message: 'SERPAPI_KEY missing' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const summary: Record<string, number> = {};
    let totalAdded = 0;

    // Step 3: Fetch per path
    for (const [pathId, config] of Object.entries(pathConfig)) {
      try {
        // deno-lint-ignore no-explicit-any
        const allResults: any[] = [];

        // Run each query for this path
        for (const query of config.queries) {
          const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&location=Saudi+Arabia&api_key=${SERPAPI_KEY}`;
          const res = await fetch(url);
          const data = await res.json();

          if (data.jobs_results && Array.isArray(data.jobs_results)) {
            allResults.push(...data.jobs_results);
          }
        }

        // Dedup and Filter
        const seen = new Set<string>();
        // deno-lint-ignore no-explicit-any
        const filtered: any[] = [];

        for (const job of allResults) {
          const title = job.title || '';
          const key = dedupKey(job.company_name || '', title);
          if (seen.has(key)) continue;

          // 1. Path-based exclusion check
          const isExcluded = config.exclude.some(word => title.toLowerCase().includes(word.toLowerCase()));
          if (isExcluded) continue;

          // 2. Seniority inference (filters out Senior/Lead)
          const seniority = inferSeniority(title);
          if (seniority === null) continue;

          seen.add(key);
          
          // 3. Score for relevance (Junior/Intern priority)
          let relevanceScore = 0;
          const lowerTitle = title.toLowerCase();
          if (lowerTitle.includes('junior') || lowerTitle.includes('jr.')) relevanceScore += 60;
          if (lowerTitle.includes('intern') || lowerTitle.includes('co-op') || lowerTitle.includes('trainee')) relevanceScore += 60;
          if (lowerTitle.includes('graduate') || lowerTitle.includes('fresh')) relevanceScore += 50;
          if (lowerTitle.includes('entry')) relevanceScore += 40;
          if (lowerTitle.includes('associate')) relevanceScore += 30;

          filtered.push({ ...job, seniority, relevanceScore });
        }

        // Sort by relevance score (highest first) and take top 10
        const sorted = filtered
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 10);

        const listings = [];

        for (const job of sorted) {
          const locationStr: string = job.location || '';
          const isRemote = locationStr.toLowerCase().includes('remote');

          const employmentType: string | null =
            job.detected_extensions?.schedule_type || null;

          const applyUrl: string | null =
            (job.apply_options && job.apply_options.length > 0
              ? job.apply_options[0].link
              : null) || job.share_link || null;

          const sourceUrl: string | null = job.share_link || job.job_id || null;

          if (!sourceUrl) continue;

          const now = new Date();
          const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

          listings.push({
            path_id: pathId,
            title: job.title,
            company: job.company_name,
            location: locationStr,
            is_remote: isRemote,
            employment_type: employmentType,
            seniority: job.seniority,
            description: job.description || '',
            required_skills: [],
            preferred_skills: [],
            apply_url: applyUrl,
            source_url: sourceUrl,
            status: 'published',
            published_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
          });
        }

        if (listings.length > 0) {
          const { error } = await supabase
            .from('job_listings')
            .upsert(listings, { onConflict: 'source_url' });

          if (error) {
            console.error(`Error upserting jobs for ${pathId}:`, error);
          } else {
            totalAdded += listings.length;
          }
        }

        summary[pathId] = listings.length;
      } catch (pathError) {
        console.error(`Failed to fetch jobs for path ${pathId}:`, pathError);
        summary[pathId] = 0;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        paths_fetched: Object.keys(summary).length,
        total_added: totalAdded,
        per_path: summary,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
