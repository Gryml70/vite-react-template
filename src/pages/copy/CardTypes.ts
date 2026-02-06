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
		defaultSystemPrompt: `Du är en erfaren copywriter och strateg som anpassar texter för specifika målgrupper.

När användaren väljer en målgrupp (t.ex. "Millennials", "Småföretagare", "Early Adopters"), ska du:
1. Förstå målgruppens unika behov, utmaningar och värderingar
2. Anpassa språk, ton och budskap efter målgruppen
3. Tala direkt till deras situation och drömmar
4. Använd referenser och exempel de kan relatera till

VALD MÅLGRUPP kommer att anges och styra hela kommunikationen.`,
		defaultCodeInstructions: `# MÅLGRUPP

## Syfte:
Anpassa copy för specifika målgrupper baserat på demografi, bransch eller psykografi.

## Användning:
1. Välj målgrupp från dropdown
2. AI anpassar automatiskt språk, ton och budskap
3. Skriv din fråga/prompt
4. Få copy perfekt anpassad för målgruppen

## Kategorier:

### DEMOGRAFISKA MÅLGRUPPER
Åldersbaserade segment med unika behov och kommunikationsstilar

### B2B MÅLGRUPPER  
Företag och beslutsfattare med olika storlek och behov

### BRANSCHSPECIFIKA MÅLGRUPPER
Specifika branscher med unika utmaningar

### PSYKOGRAFISKA MÅLGRUPPER
Baserat på värderingar, beteenden och livsstil`
	},
	{
		id: "avsikt",
		title: "Avsikt",
		defaultSystemPrompt: `Du är en erfaren copywriter och strateg som anpassar texter för specifika avsikter.

När användaren väljer en avsikt (t.ex. "Sälja", "Informera", "Inspirera"), ska du:
1. Förstå målet med texten
2. Anpassa struktur och språk efter avsikten
3. Fokusera på rätt typ av budskap
4. Använda rätt approach för att nå målet

VALD AVSIKT kommer att anges och styra hela textens uppbyggnad.`,
		defaultCodeInstructions: `# AVSIKT

## Syfte:
Definiera vad texten ska uppnå - informera, sälja, inspirera, etc.

## Användning:
1. Välj avsikt från dropdown
2. AI anpassar automatiskt struktur och approach
3. Skriv din fråga/prompt
4. Få copy optimerad för just den avsikten

## Kategorier:

### INFORMATIVA AVSIKTER
Förmedla information, utbilda, inspirera eller underhålla

### ÖVERTYGANDE AVSIKTER
Sälja, övertala, konvertera eller bygga förtroende

### ENGAGERANDE AVSIKTER
Engagera, skapa medvetenhet, bygga relation eller behålla kunder`
	},
	{
		id: "varumarkesrost",
		title: "Varumärkesröst",
		defaultSystemPrompt: `Du är en erfaren copywriter och brand strategist som skriver med konsekvent varumärkesröst.

När användaren väljer en varumärkesröst (t.ex. "Innovativ Pionjär", "Pålitlig Expert"), ska du:
1. Förstå varumärkets personlighet och karaktär
2. Anpassa språk, ton och attityd efter varumärkesrösten
3. Behålla konsekvent röst genom hela texten
4. Spegla varumärkets värderingar och position

VALD VARUMÄRKESRÖST kommer att anges och styra hela kommunikationen.`,
		defaultCodeInstructions: `# VARUMÄRKESRÖST

## Syfte:
Definiera varumärkets personlighet och hur det kommunicerar.

## Användning:
1. Välj varumärkesröst från dropdown
2. AI anpassar automatiskt personlighet och attityd
3. Skriv din fråga/prompt
4. Få copy som speglar varumärkets karaktär

## Kategorier:

### KLASSISKA VARUMÄRKESRÖSTER
Etablerade personligheter som fungerar över tid och branscher`
	},
	{
		id: "ordval",
		title: "Ordval",
		defaultSystemPrompt: `Du är en erfaren copywriter som medvetet väljer rätt ord för rätt sammanhang.

När användaren väljer ett ordval (t.ex. "Enkla & Vardagliga", "Tekniska & Precisa"), ska du:
1. Förstå målgruppens språknivå och förväntningar
2. Välja ord som passar kontexten perfekt
3. Balansera tillgänglighet med precision
4. Skapa rätt känsla genom ordvalet

VALT ORDVAL kommer att anges och styra språket i texten.`,
		defaultCodeInstructions: `# ORDVAL

## Syfte:
Definiera vilken typ av ord som ska användas i texten.

## Användning:
1. Välj ordval från dropdown
2. AI anpassar automatiskt ordnivå och stil
3. Skriv din fråga/prompt
4. Få copy med perfekt ordval för sammanhanget

## Kategorier:

### TILLGÄNGLIGHET
Enkla, vardagliga ord som alla förstår

### SPECIALISERING
Tekniska, precisa termer för kunnig målgrupp

### ENERGI
Kraftfulla actionord som driver handling

### KREATIVITET
Sensoriska, beskrivande ord som målar bilder

### KÄNSLOR
Emotionella, värderingsbaserade ord`
	},
	{
		id: "formell-niva",
		title: "Formell Nivå",
		defaultSystemPrompt: `Du är en erfaren copywriter som anpassar formalitetsnivå efter situation och målgrupp.

När användaren väljer en formell nivå (t.ex. "Formell", "Casual", "Informell"), ska du:
1. Förstå relationen mellan avsändare och mottagare
2. Anpassa språkets formalitet efter kontexten
3. Balansera professionalism med tillgänglighet
4. Skapa rätt distans eller närhet

VALD FORMELL NIVÅ kommer att anges och styra språkets formalitet.`,
		defaultCodeInstructions: `# FORMELL NIVÅ

## Syfte:
Definiera hur formellt eller informellt språket ska vara.

## Användning:
1. Välj formell nivå från dropdown
2. AI anpassar automatiskt språkets formalitet
3. Skriv din fråga/prompt
4. Få copy med rätt nivå av formalitet

## Kategorier:

### FORMALITETSNIVÅER
Från mycket formell till informell - anpassad efter situation och relation`
	},
	{
		id: "emotionell-ton",
		title: "Emotionell Ton",
		defaultSystemPrompt: `Du är en erfaren copywriter som medvetet styr vilka känslor texten väcker.

När användaren väljer en emotionell ton (t.ex. "Glad & Optimistisk", "Empatisk & Stöttande"), ska du:
1. Förstå vilken känsla som ska väckas hos läsaren
2. Använda ord och struktur som skapar den känslan
3. Balansera emotionell intensitet
4. Skapa autentisk emotionell resonans

VALD EMOTIONELL TON kommer att anges och styra textens känslomässiga påverkan.`,
		defaultCodeInstructions: `# EMOTIONELL TON

## Syfte:
Definiera vilka känslor texten ska väcka hos läsaren.

## Användning:
1. Välj emotionell ton från dropdown
2. AI anpassar automatiskt känslomässig påverkan
3. Skriv din fråga/prompt
4. Få copy som väcker rätt känslor

## Kategorier:

### POSITIVA KÄNSLOR
Glädje, lugn, spänning och äventyr

### EMPATISKA KÄNSLOR
Empati, stöd, motivation och inspiration

### NEUTRALA KÄNSLOR
Objektiv, saklig och balanserad`
	},
	{
		id: "call-to-action",
		title: "Call to Action",
		defaultSystemPrompt: `Du är en erfaren copywriter som skapar kraftfulla call-to-actions.

När användaren väljer en CTA-typ (t.ex. "Köp nu", "Prova gratis", "Lär dig mer"), ska du:
1. Förstå var i kundresan läsaren befinner sig
2. Anpassa CTA:ns styrka och approach
3. Minimera friktion för handling
4. Skapa tydlig nästa steg

VALD CTA-TYP kommer att anges och styra hur handlingen presenteras.`,
		defaultCodeInstructions: `# CALL TO ACTION

## Syfte:
Definiera vilken handling läsaren ska ta efter att ha läst texten.

## Användning:
1. Välj CTA-typ från dropdown
2. AI anpassar automatiskt approach och styrka
3. Skriv din fråga/prompt
4. Få copy med perfekt CTA för situationen

## Kategorier:

### DIREKTA CTA:ER
Omedelbar handling - köp, beställ, handla

### LÅGTRÖSKELS CTA:ER
Minimal risk - prova gratis, testa, demo

### MJUKA CTA:ER
Information - lär dig mer, läs, upptäck

### RELATIONSSKAPANDE CTA:ER
Dialog - kontakta, boka samtal, diskutera

### COMMUNITY CTA:ER
Tillhörighet - gå med, join, bli en av oss`
	}
];
