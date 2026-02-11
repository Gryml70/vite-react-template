/**
 * API för System Prompts (endast dev-mode)
 */
import fs from "node:fs";
import path from "node:path";

const SYSTEM_PROMPTS_DIR = path.join(process.cwd(), "system-prompts");

// Säkerställ att mappen finns
if (!fs.existsSync(SYSTEM_PROMPTS_DIR)) {
	fs.mkdirSync(SYSTEM_PROMPTS_DIR, { recursive: true });
}

/**
 * Lista alla sparade system prompts
 */
export function listSystemPrompts(): Array<{ name: string; content: string }> {
	try {
		const files = fs.readdirSync(SYSTEM_PROMPTS_DIR);
		return files
			.filter(f => f.endsWith(".txt"))
			.map(f => ({
				name: f.replace(".txt", ""),
				content: fs.readFileSync(path.join(SYSTEM_PROMPTS_DIR, f), "utf-8"),
			}));
	} catch (err) {
		console.error("Kunde inte läsa system prompts:", err);
		return [];
	}
}

/**
 * Spara en system prompt till fil
 */
export function saveSystemPrompt(name: string, content: string): { success: boolean; message: string } {
	try {
		const filePath = path.join(SYSTEM_PROMPTS_DIR, `${name}.txt`);
		fs.writeFileSync(filePath, content, "utf-8");
		return { success: true, message: `System prompt "${name}" sparad` };
	} catch (err: any) {
		return { success: false, message: err.message };
	}
}

/**
 * Testa en system prompt mot Claude AI via OpenRouter
 */
export async function testSystemPrompt(systemPrompt: string, userMessage: string): Promise<string> {
	// Läs API-nyckel från .env-filen direkt
	const fs = await import("node:fs");
	const path = await import("node:path");
	const envPath = path.join(process.cwd(), ".env");
	
	let apiKey = process.env.VITE_OPENROUTER_API_KEY;
	
	// Om inte tillgänglig via process.env, läs från .env-filen
	if (!apiKey && fs.existsSync(envPath)) {
		const envContent = fs.readFileSync(envPath, "utf-8");
		const match = envContent.match(/VITE_OPENROUTER_API_KEY=(.+)/);
		if (match) {
			apiKey = match[1].trim();
		}
	}
	
	if (!apiKey) {
		throw new Error("VITE_OPENROUTER_API_KEY saknas i .env");
	}

	const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "anthropic/claude-3.5-sonnet",
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userMessage }
			],
		}),
	});

	if (!response.ok) {
		const errorData = await response.json() as { error?: { message: string } };
		throw new Error(errorData.error?.message || "OpenRouter API-fel");
	}

	const data = await response.json() as {
		choices: Array<{
			message?: {
				content: string
			}
		}>
	};
	return data.choices[0]?.message?.content || "Inget svar från AI";
}
