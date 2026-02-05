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
					content: `Du är en expert på SEO och svenska webbtexter. Följ STRIKT dessa regler när du skapar innehåll:\n\n${seoRules}\n\nSvara ENDAST med det genererade innehållet, ingen extra förklaring.`
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
					content: `Du är en strikt SEO-granskare. Din uppgift är att kontrollera om ett innehåll följer dessa regler:\n\n${seoRules}\n\nAnalysera innehållet och svara i detta format:\n\n**Status:** [Korrekt ✅ eller Fel ❌]\n\n**Bedömning:**\n[Kort sammanfattning]\n\n**Detaljer:**\n- [Lista vad som är rätt]\n- [Lista vad som är fel, om något]\n\nVar konkret och specifik. Om något är fel, förklara exakt vad och hur det ska rättas.`
				},
				{ role: "user", content: `Kontrollera detta innehåll mot SEO-reglerna:\n\n${content}` }
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
					content: `Du är en expert på SEO och svenska webbtexter. Din uppgift är att FIXA innehåll som inte följer SEO-reglerna.

STRIKTA REGLER att följa:
${seoRules}

Du får:
1. Det ursprungliga innehållet som genererades
2. Valideringsfeedback som pekar ut EXAKT vad som är fel
3. Den ursprungliga prompten

Din uppgift:
- Skriv OM innehållet så det följer ALLA regler perfekt
- Fixa ALLA fel som valideringen hittade
- Behåll samma syfte/tema som ursprungsprompt
- Svara ENDAST med det fixade innehållet, ingen extra text`
				},
				{ 
					role: "user", 
					content: `URSPRUNGLIG PROMPT: ${originalPrompt}

GENERERAT INNEHÅLL (som har fel):
${originalContent}

VALIDERINGSFEEDBACK (vad som är fel):
${validationFeedback}

Skriv om innehållet så det blir PERFEKT enligt reglerna. Fixa ALLA fel som listas i feedbacken.`
				}
			]
		})
	});

	const data = await response.json();
	return data.choices?.[0]?.message?.content || "Kunde inte fixa innehåll";
}
