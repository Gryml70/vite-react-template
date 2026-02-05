/**
 * API-routes för Skrivregler (endast för dev-mode)
 * Hanterar lokal fil-läsning och AI-anrop
 */

import * as fs from "node:fs";
import * as path from "node:path";

const SEO_RULES_PATH = path.join(process.cwd(), "supabase/functions/skrivregler-ai/grundregler-seo.md");

// Läs API-nyckel från .env (Vite gör inte process.env tillgänglig i server-side kod)
function getOpenRouterKey(): string {
	// Försök läsa från .env-fil direkt
	try {
		const envPath = path.join(process.cwd(), ".env");
		const envContent = fs.readFileSync(envPath, "utf-8");
		const match = envContent.match(/VITE_OPENROUTER_API_KEY=(.+)/);
		if (match) return match[1].trim();
	} catch {}
	
	return process.env.VITE_OPENROUTER_API_KEY || "";
}

const CLAUDE_MODEL = "anthropic/claude-sonnet-4.5";

// Läs SEO-regler från fil
export function readSEORules(): string {
	try {
		return fs.readFileSync(SEO_RULES_PATH, "utf-8");
	} catch {
		return "# Grundregler SEO - Svenska webbtexter\n\n";
	}
}

// Spara text till SEO-regler
export function saveSEORules(textToAdd: string): { success: boolean; message: string; totalLength: number } {
	let existingContent = readSEORules();
	const updatedContent = existingContent.trim() + "\n\n" + textToAdd.trim() + "\n";
	fs.writeFileSync(SEO_RULES_PATH, updatedContent, "utf-8");
	
	return {
		success: true,
		message: "Text tillagd i grundregler-seo.md",
		totalLength: updatedContent.length
	};
}

// AI: Skapa regel
export async function createRule(question: string): Promise<string> {
	const apiKey = getOpenRouterKey();
	if (!apiKey) throw new Error("OpenRouter API-nyckel saknas i .env");
	
	const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: CLAUDE_MODEL,
			messages: [
				{
					role: "system",
					content: `Du är en expert på SEO och svenska webbtexter. Din uppgift är att hjälpa användaren skapa tydliga, välformulerade SEO-regler i markdown-format.
När användaren frågar om en regel (t.ex. "hur ser reglerna ut för korrekt seo för H1"), ska du:
1. Ge en tydlig, konkret regel i markdown-format
2. Använda markdown-syntax (rubriker, listor, fetstil)
3. Vara kortfattad men komplett
4. Fokusera på svenska webbtexter och SEO-best practices
5. Ge praktiska exempel när det är relevant
Svara ENDAST med markdown-formaterad regel, ingen extra förklaring.`
				},
				{ role: "user", content: question }
			]
		})
	});

	const data = await response.json();
	return data.choices?.[0]?.message?.content || "Kunde inte generera regel";
}

// AI: Generera innehåll
export async function generateContent(prompt: string): Promise<string> {
	const seoRules = readSEORules();
	const apiKey = getOpenRouterKey();
	if (!apiKey) throw new Error("OpenRouter API-nyckel saknas i .env");
	
	const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: CLAUDE_MODEL,
			messages: [
				{
					role: "system",
					content: `Du är en SEO-textgenerator. Du får regler från en fil som du MÅSTE följa.

REGLER FRÅN FILEN:
${seoRules}

KRITISKT VIKTIGA INSTRUKTIONER:
1. Använd **BARA** reglerna ovan - INGEN annan SEO-kunskap
2. Svara **EXAKT** på vad användaren ber om:
   - Om de ber om "en rubrik" eller "rubrik" → Svara med EN ENDA RAD (H1, max 70 tecken)
   - Om de ber om "meta-beskrivning" → Svara med EN MENING (max 156 tecken)
   - Om de ber om "text", "artikel" eller "innehåll" → Generera komplett text med H1, H2, brödtext
3. Lägg ALDRIG till mer än vad som efterfrågades
4. Om regler för det efterfrågade saknas i filen, svara: "Regler saknas för [typ]. Lägg till regler i md-filen först."

Svara ENDAST med det genererade innehållet, ingen förklaring.`
				},
				{ role: "user", content: prompt }
			]
		})
	});

	const data = await response.json();
	return data.choices?.[0]?.message?.content || "Kunde inte generera innehåll";
}

// AI: Validera innehåll
export async function validateContent(content: string): Promise<string> {
	const seoRules = readSEORules();
	const apiKey = getOpenRouterKey();
	if (!apiKey) throw new Error("OpenRouter API-nyckel saknas i .env");
	
	const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: CLAUDE_MODEL,
			messages: [
				{
					role: "system",
					content: `Du är en strikt SEO-granskare. Du validerar innehåll mot regler från en fil.

REGLER FRÅN FILEN (validera BARA mot dessa):
${seoRules}

KRITISKT VIKTIGT:
1. Validera **ENDAST** mot reglerna ovan - INGEN annan SEO-kunskap
2. Om innehållet är EN RUBRIK → Validera BARA rubrik-reglerna, klaga INTE på saknad brödtext/meta-beskrivning
3. Om innehållet är EN MENING → Validera BARA mot relevanta regler
4. Fråga ALDRIG efter innehåll som inte nämndes i reglerna
5. Vid FEL: Ge alltid **KONKRET FÖRSLAG** på korrigerad version

Svara i detta format:

**Status:** [Korrekt ✅ eller Fel ❌]

**Bedömning:**
[Kort sammanfattning]

**Detaljer:**
- [Lista vad som är rätt]
- [Lista vad som är fel]

**Förslag på förbättring:** (OM FEL)
[Skriv den EXAKTA korrigerade versionen här]`
				},
				{ role: "user", content: `Kontrollera detta innehåll mot reglerna:\n\n${content}` }
			]
		})
	});

	const data = await response.json();
	return data.choices?.[0]?.message?.content || "Kunde inte validera innehåll";
}

// AI: Fixa innehåll baserat på valideringsfeedback
export async function fixContent(originalContent: string, validationFeedback: string, originalPrompt: string): Promise<string> {
	const seoRules = readSEORules();
	const apiKey = getOpenRouterKey();
	if (!apiKey) throw new Error("OpenRouter API-nyckel saknas i .env");
	
	const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: CLAUDE_MODEL,
			messages: [
				{
					role: "system",
					content: `Du är en SEO-textfixare. Din uppgift är att korrigera innehåll som inte följer reglerna.

REGLER FRÅN FILEN (FÖLJ BARA DESSA):
${seoRules}

KRITISKT VIKTIGT:
1. Använd **BARA** reglerna ovan - INGEN annan SEO-kunskap
2. Behåll samma FORMAT som ursprungligt innehåll:
   - Om det var EN RUBRIK → Fixa till EN RUBRIK
   - Om det var EN MENING → Fixa till EN MENING
   - Om det var HEL TEXT → Fixa hel text
3. Fixa ALLA fel som valideringen pekar ut
4. Lägg INTE till mer innehåll än vad som fanns ursprungligen
5. Svara ENDAST med det fixade innehållet`
				},
				{ 
					role: "user", 
					content: `URSPRUNGLIG PROMPT: ${originalPrompt}

GENERERAT INNEHÅLL (som har fel):
${originalContent}

VALIDERINGSFEEDBACK (vad som är fel):
${validationFeedback}

Fixa innehållet så det blir perfekt enligt reglerna. Behåll samma format och längd.`
				}
			]
		})
	});

	const data = await response.json();
	return data.choices?.[0]?.message?.content || "Kunde inte fixa innehåll";
}
