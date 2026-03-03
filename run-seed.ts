import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    console.log('Reading seed.sql...');
    const seedSql = fs.readFileSync('seed.sql', 'utf8');

    console.log(`Executing ${seedSql.length} bytes of SQL via RPC...`);

    const { data, error } = await supabase.rpc('exec_temp_sql', { q: seedSql });

    if (error) {
        console.error('Error executing seed SQL:');
        console.error(error);
    } else {
        console.log('Successfully seeded database!');
    }
}

run();
