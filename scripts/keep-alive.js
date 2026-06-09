// Standalone script to keep Supabase project active without external dependencies (other than supabase-js)
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if they are not already set
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        console.log('Loading environment variables from .env.local...');
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach(line => {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                // Remove surrounding quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                } else if (value.startsWith("'") && value.endsWith("'")) {
                    value = value.substring(1, value.length - 1);
                }
                process.env[key] = value;
            }
        });
    }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY/SUPABASE_KEY is missing.');
    console.error('Please make sure these are set in your environment variables or in .env.local.');
    process.exit(1);
}

// Import @supabase/supabase-js
try {
    const { createClient } = require('@supabase/supabase-js');
    
    console.log(`[${new Date().toISOString()}] Attempting to ping Supabase at url: ${supabaseUrl}`);

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Run a lightweight query to keep the database connection warm and prevent pausing
    supabase
        .from('diagnoses')
        .select('id')
        .limit(1)
        .then(({ data, error }) => {
            if (error) {
                console.error(`[${new Date().toISOString()}] Supabase ping failed with error:`, error.message || error);
                process.exit(1);
            }
            console.log(`[${new Date().toISOString()}] Success: Supabase is active and responding.`);
            console.log('Response metadata:', { recordsFound: data?.length || 0 });
            process.exit(0);
        })
        .catch(err => {
            console.error(`[${new Date().toISOString()}] Promise rejection:`, err);
            process.exit(1);
        });

} catch (err) {
    console.error('Error: Could not import @supabase/supabase-js. Please run "npm install @supabase/supabase-js" first.');
    console.error(err);
    process.exit(1);
}
