
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { RoadmapParser } from './features/roadmap/services/roadmap-parser';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY not found in .env. Falling back to ANON_KEY. Ensure RLS is DISABLED on target tables.");
    supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
}

if (!supabaseKey) {
    console.error("ERROR: No Supabase key found in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("Starting Seeding Script...");

    const roadmapsDir = path.join(process.cwd(), 'docs/mallah-roadmap-and-topic-viewer');
    const files = [
        'frontend-roadmap.md',
        'fullstack-roadmap.md',
        'cybersecurity-roadmap.md',
        'datascience-roadmap.md'
    ];

    for (const file of files) {
        console.log(`\n>>> Processing ${file}...`);
        const filePath = path.join(roadmapsDir, file);
        if (!fs.existsSync(filePath)) {
            console.error(`File ${file} not found!`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const { pathId, stages } = RoadmapParser.parseMarkdown(content);
        console.log(`Parsed Path: ${pathId}, Stages: ${stages.length}`);

        try {
            // Sequential Sync
            await RoadmapParser.syncToDatabase(pathId, stages, supabase);
            console.log(`Success: ${file}`);
        } catch (err: any) {
            console.error(`FAILED: ${file} -> ${err.message}`);
        }
    }

    console.log("\nSeeding Complete.");
}

seed().catch(err => {
    console.error("UNEXPECTED SEEDING ERROR:", err);
    process.exit(1);
});
