import PageShell from "../PageShell";

const placeholders = {
	title: "Tjänster",
	subtitle: "Vad vi erbjuder.",
	content:
		"<p>Vi erbjuder webbutveckling, underhåll och rådgivning. Kontakta oss för att diskutera dina behov.</p>",
	meta_title: "Tjänster | handla-hemsida.com",
	meta_description: "Se våra tjänster inom webb och digital närvaro.",
};

export default function Tjanster() {
	return <PageShell {...placeholders} />;
}
