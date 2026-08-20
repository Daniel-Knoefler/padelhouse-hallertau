import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mjwxppygqecrmwdeucpk.supabase.co";
const supabaseAnonKey = "sb_publishable_Jvnl0lGe59BlLs7IA1bmKw_AhVdbXUz";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
