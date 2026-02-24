// Configuração do Supabase
// Configurado com as credenciais do seu projeto "Portfolio"

const SUPABASE_URL = 'https://yhcloiouxmcadtsruroo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2xvaW91eG1jYWR0c3J1cm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTMyNzgsImV4cCI6MjA4NzUyOTI3OH0.G7Flqryf8gFePQH-wG9m-zgzxnGVT4Tl7s6h5UV2QPw';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.supabaseClient = _supabase;
