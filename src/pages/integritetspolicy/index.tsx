import PageShell from "../PageShell";

const placeholders = {
	title: "Integritetspolicy",
	subtitle: "Så hanterar vi dina uppgifter.",
	content: `
		<p>Vi tar ditt integritet på allvar. Denna webbplats sparar endast nödvändig information för att funktionen ska fungera.</p>
		<p>Vi använder inte cookies för spårning utan ditt samtycke. Vid frågor, kontakta oss.</p>
	`,
	meta_title: "Integritetspolicy | handla-hemsida.com",
	meta_description: "Läs vår integritetspolicy och hur vi hanterar personuppgifter.",
};

export default function Integritetspolicy() {
	return <PageShell {...placeholders} />;
}
