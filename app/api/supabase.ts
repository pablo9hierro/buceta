import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hhteulbbuxreyvimcxny.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodGV1bGJidXhyZXl2aW1jeG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1MDI0MjEsImV4cCI6MjAzOTA3ODQyMX0.aoviU3XmZEhOKcUpXeWBFYja9v2RZVO2EMEcs_s3dHI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


export default supabase;