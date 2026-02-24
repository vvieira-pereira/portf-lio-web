// Configuração do Supabase
// Configurado com as credenciais do seu projeto "Portfolio"

const SUPABASE_URL = 'https://yhcloiouxmcadtsruroo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_aPFV2RUBNm_qPvpPigtJvg_2aOLvGh6';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.supabaseClient = _supabase;
