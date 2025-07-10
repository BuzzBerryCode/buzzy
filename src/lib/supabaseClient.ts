import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://unovwhgnwenxbyvpevcz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVub3Z3aGdud2VueGJ5dnBldmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzY1NDAsImV4cCI6MjA2NzcxMjU0MH0.UgHG08bBKdJDo0mJNX61z-ihd3WPScaxNX_zmNDIHSs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 