import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qkiohwsjotjpozoqbusv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFraW9od3Nqb3RqcG96b3FidXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MTM0MTQsImV4cCI6MjA2NzA4OTQxNH0.739GSSJgi7gIaOr3RS30_tDxFa5SgXP_zGmYQc4yK9A'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export default supabase