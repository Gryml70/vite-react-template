import PageShell from "../PageShell";

const placeholders = {
	title: "Kontakt",
	subtitle: "Hör av dig till oss.",
	content: "<p>Du når oss enklast via e-post eller via formuläret på denna sida. Vi återkommer så snart vi kan.</p>",
	cta_text: "Skicka e-post",
	cta_url: "mailto:info@handla-hemsida.com",
	meta_title: "Kontakt | handla-hemsida.com",
	meta_description: "Kontakta handla-hemsida.com. Hitta e-post och kontaktuppgifter.",
};

export default function Kontakt() {
	return <PageShell {...placeholders} />;
}
