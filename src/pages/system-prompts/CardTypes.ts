// Korttyper och deras valideringsregler

export interface CardType {
	id: string;
	title: string;
	minChars?: number;
	maxChars?: number;
	minWords?: number;
	maxWords?: number;
	defaultSystemPrompt: string;
	defaultCodeInstructions: string;
}

export const CARD_TYPES: CardType[] = [
	{
		id: "huvudrubrik",
		title: "Huvudrubrik (H1)",
		minChars: 20,
		maxChars: 70,
		defaultSystemPrompt: `Du är en rubrikexpert.

KRAV:
- 20-70 tecken
- Inkludera nyckelordet TIDIGT
- Tydlig och lockande
- Ingen punkt

Leverera ENDAST rubriken, ingen förklaring.`,
		defaultCodeInstructions: `# HUVUDRUBRIK (H1) - 20-70 TECKEN

## Validering:
- Om 20-70 tecken → ✅ Klart
- Om fel → Justera automatiskt

## Tips:
- Nyckelord först
- Kort och kraftfull`
	},
	{
		id: "seo-artikel",
		title: "SEO Artikel",
		minWords: 350,
		defaultSystemPrompt: `Du är en SEO-skribent som skriver artiklar.

KRAV:
- Minst 350 ord
- H1 = Nyckelordet
- H2 underrubriker
- Max 4 meningar per stycke
- Max 12-15 ord per mening
- Minst en punktlista
- 3 radbrytningar mellan stycken

Leverera ENDAST artikeln, ingen förklaring.`,
		defaultCodeInstructions: `# SEO ARTIKEL - MINST 350 ORD

## Validering:
- Om ≥350 ord → ✅ Klart
- Om <350 ord → Utöka automatiskt

## Struktur:
- H1: Nyckelordet
- Max 4 meningar/stycke
- Max 12-15 ord/mening`
	},
	{
		id: "meta-rubrik",
		title: "Meta Rubrik (Title Tag)",
		minChars: 50,
		maxChars: 60,
		defaultSystemPrompt: `Du är en SEO-expert för title tags.

KRAV:
- 50-60 tecken
- Inkludera nyckelordet
- Locka till klick
- Ingen punkt

Leverera ENDAST title tag, ingen förklaring.`,
		defaultCodeInstructions: `# META RUBRIK (TITLE TAG) - 50-60 TECKEN

## Validering:
- Om 50-60 tecken → ✅ Klart
- Om fel → Justera automatiskt

## Tips:
- Nyckelord tidigt
- Unik för varje sida`
	},
	{
		id: "seo-meta-text",
		title: "SEO Meta Text",
		minChars: 140,
		maxChars: 156,
		defaultSystemPrompt: `Du är en SEO-expert som skriver meta-beskrivningar.

KRAV:
- Exakt 140-156 tecken inklusive mellanslag
- Inkludera nyckelordet naturligt
- Locka till klick med en tydlig fördel
- Ingen punkt i slutet

Leverera ENDAST texten, ingen förklaring.`,
		defaultCodeInstructions: `# SEO META TEXT - 140-156 TECKEN

## Validering:
- Om 140-156 tecken → ✅ Klart
- Om fel → Justera med filterord automatiskt

## Filterord:
verkligen, faktiskt, helt, väldigt, ju, väl, ganska, rätt, lite`
	},
	{
		id: "seo-artikel",
		title: "SEO Artikel",
		minWords: 350,
		defaultSystemPrompt: `Du är en SEO-skribent som skriver artiklar.

KRAV:
- Minst 350 ord
- H1 = Nyckelordet
- H2 underrubriker
- Max 4 meningar per stycke
- Max 12-15 ord per mening
- Minst en punktlista
- 3 radbrytningar mellan stycken

Leverera ENDAST artikeln, ingen förklaring.`,
		defaultCodeInstructions: `# SEO ARTIKEL - MINST 350 ORD

## Validering:
- Om ≥350 ord → ✅ Klart
- Om <350 ord → Utöka automatiskt

## Struktur:
- H1: Nyckelordet
- Max 4 meningar/stycke
- Max 12-15 ord/mening`
	},
	{
		id: "meta-rubrik",
		title: "Meta Rubrik (Title Tag)",
		minChars: 50,
		maxChars: 60,
		defaultSystemPrompt: `Du är en SEO-expert för title tags.

KRAV:
- 50-60 tecken
- Inkludera nyckelordet
- Locka till klick
- Ingen punkt

Leverera ENDAST title tag, ingen förklaring.`,
		defaultCodeInstructions: `# META RUBRIK (TITLE TAG) - 50-60 TECKEN

## Validering:
- Om 50-60 tecken → ✅ Klart
- Om fel → Justera automatiskt

## Tips:
- Nyckelord tidigt
- Unik för varje sida`
	},
	{
		id: "url",
		title: "URL (Slug)",
		minChars: 10,
		maxChars: 60,
		defaultSystemPrompt: `Du är en URL-expert.

KRAV:
- 10-60 tecken
- Endast små bokstäver
- Bindestreck mellan ord
- Inga specialtecken (åäö → aao)
- Inkludera nyckelordet
- Exempel: wordpress-hemsida-pris

Leverera ENDAST URL-slugen, ingen förklaring.`,
		defaultCodeInstructions: `# URL (SLUG) - 10-60 TECKEN

## Validering:
- Om 10-60 tecken → ✅ Klart
- Små bokstäver
- Bindestreck mellan ord

## Format:
nyckelord-beskrivning-extra`
	},
	{
		id: "enskild-produkt",
		title: "Enskild Produkt",
		minWords: 150,
		maxWords: 300,
		defaultSystemPrompt: `Du är en produktbeskrivningsexpert.

KRAV:
- 150-300 ord
- H1 = Produktnamn (inkl. nyckelord)
- Fördelar (punktlista)
- Kort och säljande
- Max 4 meningar per stycke
- Max 12-15 ord per mening

Leverera ENDAST produktbeskrivningen, ingen förklaring.`,
		defaultCodeInstructions: `# ENSKILD PRODUKT - 150-300 ORD

## Validering:
- Om 150-300 ord → ✅ Klart
- Om fel → Justera automatiskt

## Struktur:
- H1: Produktnamn
- Fördelar (punktlista)
- Säljande ton`
	},
	{
		id: "hub-sida",
		title: "Hub Sida",
		minWords: 500,
		maxWords: 800,
		defaultSystemPrompt: `Du är en innehållsstrateg för hub-sidor.

KRAV:
- 500-800 ord
- H1 = Nyckelordet
- Flera H2 underrubriker
- Länkar till undersidor (minst 5)
- Max 4 meningar per stycke
- Max 12-15 ord per mening
- Punktlista med fördelar

Leverera ENDAST hub-innehållet, ingen förklaring.`,
		defaultCodeInstructions: `# HUB SIDA - 500-800 ORD

## Validering:
- Om 500-800 ord → ✅ Klart
- Om fel → Justera automatiskt

## Struktur:
- H1: Huvudämne
- H2: Underämnen
- Länkar till undersidor`
	},
	{
		id: "nav-sida",
		title: "Nav Sida",
		minWords: 200,
		maxWords: 400,
		defaultSystemPrompt: `Du är en innehållsstrateg för navigeringssidor.

KRAV:
- 200-400 ord
- H1 = Nyckelordet
- H2 underrubriker för varje kategori
- Kort introduktion
- Max 4 meningar per stycke
- Max 12-15 ord per mening

Leverera ENDAST nav-innehållet, ingen förklaring.`,
		defaultCodeInstructions: `# NAV SIDA - 200-400 ORD

## Validering:
- Om 200-400 ord → ✅ Klart
- Om fel → Justera automatiskt

## Struktur:
- H1: Kategori
- H2: Underkategorier
- Kort och tydligt`
	},
	{
		id: "facebook",
		title: "Facebook",
		minChars: 40,
		maxChars: 63,
		defaultSystemPrompt: `Du är en Facebook-expert.

KRAV:
- 40-63 tecken (för optimal visning)
- Engagerande och personlig ton
- Inkludera nyckelordet
- Locka till klick

Leverera ENDAST texten, ingen förklaring.`,
		defaultCodeInstructions: `# FACEBOOK - 40-63 TECKEN

## Validering:
- Om 40-63 tecken → ✅ Klart
- Om fel → Justera automatiskt

## Tips:
- Personlig ton
- Frågor fungerar bra`
	},
	{
		id: "instagram",
		title: "Instagram",
		minChars: 125,
		maxChars: 150,
		defaultSystemPrompt: `Du är en Instagram-expert.

KRAV:
- 125-150 tecken (första raden)
- Engagerande och visuell ton
- Inkludera nyckelordet
- Emoji OK (men inte för många)

Leverera ENDAST texten, ingen förklaring.`,
		defaultCodeInstructions: `# INSTAGRAM - 125-150 TECKEN

## Validering:
- Om 125-150 tecken → ✅ Klart
- Om fel → Justera automatiskt

## Tips:
- Visuell ton
- Emoji sparsamhet`
	},
	{
		id: "google-my-business",
		title: "Google My Business",
		minChars: 250,
		maxChars: 750,
		defaultSystemPrompt: `Du är en Google My Business-expert.

KRAV:
- 250-750 tecken
- Inkludera nyckelordet
- Beskriv verksamheten tydligt
- Inkludera plats/område
- Professionell ton

Leverera ENDAST beskrivningen, ingen förklaring.`,
		defaultCodeInstructions: `# GOOGLE MY BUSINESS - 250-750 TECKEN

## Validering:
- Om 250-750 tecken → ✅ Klart
- Om fel → Justera automatiskt

## Tips:
- Nyckelord + plats
- Tydlig beskrivning`
	},
	{
		id: "linkedin",
		title: "LinkedIn",
		minChars: 100,
		maxChars: 120,
		defaultSystemPrompt: `Du är en LinkedIn-expert.

KRAV:
- 100-120 tecken (för optimal visning)
- Professionell ton
- Inkludera nyckelordet
- Värdeskapande budskap

Leverera ENDAST texten, ingen förklaring.`,
		defaultCodeInstructions: `# LINKEDIN - 100-120 TECKEN

## Validering:
- Om 100-120 tecken → ✅ Klart
- Om fel → Justera automatiskt

## Tips:
- Professionell ton
- B2B-fokus`
	},
	{
		id: "udragstext",
		title: "Udragstext",
		minChars: 120,
		maxChars: 160,
		defaultSystemPrompt: `Du är en expert på udragstexter.

KRAV:
- 120-160 tecken
- Sammanfatta sidans innehåll
- Inkludera nyckelordet
- Locka till att läsa mer
- Ingen punkt i slutet

Leverera ENDAST udragstexten, ingen förklaring.`,
		defaultCodeInstructions: `# UDRAGSTEXT - 120-160 TECKEN

## Validering:
- Om 120-160 tecken → ✅ Klart
- Om fel → Justera automatiskt

## Tips:
- Sammanfatta innehållet
- Locka till klick`
	},
	{
		id: "sida",
		title: "Sida",
		minWords: 300,
		maxWords: 600,
		defaultSystemPrompt: `Du är en webbskribent för statiska sidor.

KRAV:
- 300-600 ord
- H1 = Nyckelordet
- H2 underrubriker
- Max 4 meningar per stycke
- Max 12-15 ord per mening
- Tydlig struktur
- 3 radbrytningar mellan stycken

Leverera ENDAST sidinnehållet, ingen förklaring.`,
		defaultCodeInstructions: `# SIDA - 300-600 ORD

## Validering:
- Om 300-600 ord → ✅ Klart
- Om fel → Justera automatiskt

## Struktur:
- H1: Nyckelordet
- H2: Underrubriker
- Kort och tydligt`
	}
];
