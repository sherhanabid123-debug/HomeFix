import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rbgxirihickxjuzjozsi.supabase.co';
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiZ3hpcmloaWNreGp1empvenNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NzY3NzAsImV4cCI6MjEwMTM1Mjc3MH0.bMTR5UiXq0KtZwGhyJusAAPi_boK6JQx6__ejfMETx8').trim();

export const isSupabaseConfigured = Boolean(
  cleanUrl && 
  cleanUrl.startsWith('http') && 
  supabaseAnonKey && 
  supabaseAnonKey.length > 10
);

export const supabase = isSupabaseConfigured
  ? createClient(cleanUrl, supabaseAnonKey)
  : null;
