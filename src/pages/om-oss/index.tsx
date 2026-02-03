import PageShell from "../PageShell";

const placeholders = {
	title: "Om oss",
	subtitle: "Lite om vad vi gör.",
	content:
		"<p>Vi hjälper dig med webbplatser och digital närvaro. Här kan du läsa mer om våra tjänster och hur du kommer i kontakt med oss.</p>",
	meta_title: "Om oss | handla-hemsida.com",
	meta_description: "Läs om handla-hemsida.com och vad vi erbjuder.",
};

export default function OmOss() {
	return <PageShell {...placeholders} />;
}
