import { useEffect } from "react";
import { Desktop16x9Header } from "../../templates/Desktop_16x9_header";

// Optimerade bild-URLer med WebP-format och komprimering
const HERO_IMAGE = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1440&h=810&fit=crop&fm=webp&q=80";
const ROW2_IMAGE = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=624&h=604&fit=crop&fm=webp&q=80";
const ROW3_IMAGE = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=624&h=604&fit=crop&fm=webp&q=80";

/** Förhandsvisning av Figma-mallen Desktop_16x9_header */
export default function PreviewMall() {
	useEffect(() => {
		document.title = "Förhandsvisning - Mall | Handla Hemsida";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute("content", "Förhandsvisning av Figma-mall Desktop_16x9_header för Handla Hemsida");
		}

		// Preload LCP-bild
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'image';
		link.href = HERO_IMAGE;
		link.fetchPriority = 'high';
		document.head.appendChild(link);

		return () => {
			document.head.removeChild(link);
		};
	}, []);

	return (
		<div style={{ 
			width: "100%", 
			display: "flex", 
			justifyContent: "center",
			alignItems: "flex-start",
			backgroundColor: "#ffffff"
		}}>
			<Desktop16x9Header
			image={HERO_IMAGE}
			title="Välkommen till Handla Hemsida"
			content="Vi skapar blixtsnabba, moderna hemsidor som konverterar besökare till kunder. Perfekt för svenska företag som vill synas online."
			cta_text="Kom igång nu"
			cta_url="/kontakt"
			subtitle="Varför välja oss?"
			heading="Professionella hemsidor på rekordtid"
			body="Med vår beprövade metod får du en färdig hemsida på bara några dagar. Vi hanterar allt tekniskt så du kan fokusera på ditt företag."
			row2_image={ROW2_IMAGE}
			row3_image={ROW3_IMAGE}
			cards_title="Våra tjänster"
			card1="Hemsidor"
			card2="E-handel"
			card3="SEO"
			/>
		</div>
	);
}
