import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
	id: string;
	user_id: string;
	username: string;
	full_name?: string;
	avatar_url?: string;
	discovery_source?: string;
	operating_system?: 'mac' | 'windows' | 'linux';
	shell?: 'bash' | 'zsh';
	custom_profile_slug?: string;
	created_at: string;
	updated_at: string;
};
