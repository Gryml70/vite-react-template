/** Placeholders för sidmallar (MCP-vänlig). */
export interface PagePlaceholders {
	title: string;
	subtitle?: string;
	content: string;
	image?: string;
	cta_text?: string;
	cta_url?: string;
	logo?: string;
	nav_links?: { label: string; href: string }[];
	meta_title: string;
	meta_description: string;
}
