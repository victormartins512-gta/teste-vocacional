import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Enquanto o Supabase não estiver configurado (.env.local vazio), o cliente fica
// nulo. Isso é esperado durante o teste local com VITE_LOCAL_API_URL (ver src/lib/db.js).
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
