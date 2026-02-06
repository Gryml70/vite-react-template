// Korttyper för Copy - Text och Ton

export interface CardType {
	id: string;
	title: string;
	defaultSystemPrompt: string;
	defaultCodeInstructions: string;
}

export const COPY_CARD_TYPES: CardType[] = [
	{
		id: "ton-profil",
		title: "Ton-profil",
		defaultSystemPrompt: `Du är en expert på copywriting och tonalitet. Din uppgift är att skapa texter med exakt rätt ton baserat på vald stil.

När användaren väljer en ton (t.ex. "Professionell", "Vänlig", "Humoristisk"), ska du:
1. Förstå nyanserna i den valda tonen
2. Anpassa ordval, meningslängd och struktur efter tonen
3. Behålla tonen konsekvent genom hela texten
4. Undvika att blanda olika toner

VALD TON kommer att anges i prompten. Följ den tonen exakt.`,
		defaultCodeInstructions: `# TON-PROFIL

## Syfte:
Definiera och testa hur texten ska kännas när den läses.

## Användning:
1. Välj en ton från dropdown (t.ex. "Professionell", "Vänlig", "Humoristisk")
2. Skriv din fråga/prompt (t.ex. "Skriv en välkomsttext för vår hemsida")
3. AI skapar text med exakt den valda tonen
4. Spara tonen för framtida användning

## Ton-kategorier:

### PROFESSIONELLA STILAR
- Formell, auktoritativ, teknisk kommunikation
- Passar: B2B, juridik, finans, medicin

### PERSONLIGA STILAR
- Vänlig, empatisk, tillgänglig kommunikation
- Passar: Kundservice, coaching, community

### ENERGISKA STILAR
- Entusiastisk, inspirerande, brådskande kommunikation
- Passar: Kampanjer, events, motiverande innehåll

### KREATIVA STILAR
- Humoristisk, lekfull, storytelling
- Passar: Underhållning, lifestyle, kreativa branscher

### BALANSERADE STILAR
- Neutral, trygg, direkt kommunikation
- Passar: Informativt innehåll, nyheter, guider`
	},
	{
		id: "malgrupp",
		title: "Målgrupp",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "avsikt",
		title: "Avsikt",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "varumarkesrost",
		title: "Varumärkesröst",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "ordval",
		title: "Ordval",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "formell-niva",
		title: "Formell Nivå",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "emotionell-ton",
		title: "Emotionell Ton",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "call-to-action",
		title: "Call to Action",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	}
];
