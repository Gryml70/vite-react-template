import PageShell from "../PageShell";

const placeholders = {
	title: "Välkommen till handla-hemsida.com",
	subtitle: "Din webbplats för enkel och tydlig information.",
	content: "<p>Här hittar du tjänster, information om oss och hur du når oss. Använd menyn ovan för att navigera.</p>",
	meta_title: "Hem | handla-hemsida.com",
	meta_description: "Välkommen till handla-hemsida.com. Hitta tjänster, om oss och kontaktuppgifter.",
};

export default function Hem() {
	return <PageShell {...placeholders} />;
}
