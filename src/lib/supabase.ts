import { createClient } from "@supabase/supabase-js";

// Supabase configuration - hardcoded for production reliability
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://aoovgbubyetnymvtshud.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvb3ZnYnVieWV0bnltdnRzaHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MjQyMzIsImV4cCI6MjA4NDMwMDIzMn0.mUD_hKnSiXroTxYf6e22vBw37e4QaozJDsKxrFHl8qo";

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
