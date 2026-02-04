import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Typ för mall-innehåll */
export interface MallContent {
	id?: string;
	created_at?: string;
	updated_at?: string;
	title: string;
	slug: string;
	published: boolean;
	/** Hero */
	hero_image: string;
	hero_title: string;
	hero_content: string;
	hero_cta_text?: string;
	hero_cta_url?: string;
	/** Row 2 & 3 */
	subtitle?: string;
	heading?: string;
	body?: string;
	row2_image?: string;
	row3_image?: string;
	/** Kort-sektion */
	cards_title?: string;
	card1?: string;
	card2?: string;
	card3?: string;
}
