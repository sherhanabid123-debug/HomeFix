import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qncmemvbrnzmptqllulk.supabase.co';
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuY21lbXZicm56bXB0cWxsdWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3Nzk3MDEsImV4cCI6MjEwMTM1NTcwMX0.aaYIeCHWcVZa04IyMcL28SpugzZogx_DPe1olHjda68').trim();

export const isSupabaseConfigured = Boolean(
  cleanUrl && 
  cleanUrl.startsWith('http') && 
  supabaseAnonKey && 
  supabaseAnonKey.length > 10
);

export const supabase = isSupabaseConfigured
  ? createClient(cleanUrl, supabaseAnonKey)
  : null;
