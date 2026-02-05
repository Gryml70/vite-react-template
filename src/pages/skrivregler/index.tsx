import { useState, useEffect } from "react";

// SEO-regler som används av AI:n
const SEO_RULES = `# Grundregler SEO - Svenska webbtexter

## Meta-beskrivningar
- Max 156 tecken
- Innehåll: Locka läsaren att klicka
- Inkludera primärt nyckelord naturligt
- Skriv en unik beskrivning för varje sida

## Rubriker (H1-H6)
- **H1**: En per sida, innehåller primärt nyckelord
- **H2-H3**: Strukturera innehållet logiskt
- Använd nyckelord naturligt, undvik keyword stuffing
- Gör rubrikerna beskrivande och informativa

## Nyckelord
- Primärt nyckelord: 1-2% av totala ord
- Sekundära nyckelord: Naturligt inbäddade
- Använd synonymer och relaterade termer
- Nyckelord i första stycket

## Textstruktur
- Första stycket: Sammanfattning med primärt nyckelord
- Korta stycken (max 3-4 meningar)
- Använd punktlistor för läsbarhet
- Intern länkning till relaterat innehåll

## Teknisk SEO för texter
- URL-slug: Korta, beskrivande, med nyckelord
- Alt-text på bilder: Beskrivande med nyckelord
- Intern länkning: Ankartexten beskriver destination
- Extern länkning: Trovärdiga källor, rel="noopener"

## Språk och ton
- Skriv för människor först, sökmotorer sedan
- Använd aktivt språk
- Undvik passiva konstruktioner
- Var konkret och specifik

## Innehållslängd
- Minst 300 ord för vanliga sidor
- 800-2000 ord för blogginlägg och guider
- Kvalitet före kvantitet

## Call-to-Action (CTA)
- Tydlig CTA i slutet av texten
- Använd aktiva verb
- Gör det lätt att ta nästa steg`;

/** AI-assistent för att skapa SEO-optimerade texter enligt svenska skrivregler */
export default function Skrivregler() {
	const [inputText, setInputText] = useState("");
	const [resultText, setResultText] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		document.title = "Skrivregler - AI-assistent | Handla Hemsida";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute("content", "Skapa SEO-optimerade texter med AI-hjälp enligt svenska skrivregler");
		}
	}, []);

	const analyzeText = async () => {
		if (!inputText.trim()) {
			setError("Vänligen skriv eller klistra in text att analysera");
			return;
		}

		setLoading(true);
		setError(null);
		setResultText("");

		try {
			// Anropa Supabase Edge Function för Claude via OpenRouter
			const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://aoovgbubyetnymvtshud.supabase.co";
			const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
			const functionUrl = `${supabaseUrl}/functions/v1/openrouter-claude-sonnet`;

			const systemPrompt = `Du är en expert på SEO och svenska webbtexter. Följ dessa regler när du skapar innehåll:

${SEO_RULES}

Svara alltid på svenska. Skapa välskriven, SEO-optimerad text baserat på användarens önskemål.`;

			const response = await fetch(functionUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${anonKey}`,
					"apikey": anonKey,
				},
				body: JSON.stringify({
					systemPrompt,
					userContent: inputText,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || `HTTP ${response.status}: Kunde inte anropa AI-tjänsten`);
			}

			const data = await response.json();
			
			if (data.content) {
				setResultText(data.content);
			} else {
				throw new Error("Inget svar från AI-tjänsten");
			}
		} catch (err) {
			console.error("Error analyzing text:", err);
			setError(err instanceof Error ? err.message : "Ett okänt fel uppstod");
		} finally {
			setLoading(false);
		}
	};

	const clearAll = () => {
		setInputText("");
		setResultText("");
		setError(null);
	};

	return (
		<div style={styles.wrapper}>
			<div style={styles.container}>
				<h1 style={styles.title}>Skrivregler - AI-assistent</h1>
				<p style={styles.description}>
					Beskriv vad du vill ha för text så skapar vår AI-assistent SEO-optimerat innehåll enligt svenska skrivregler.
				</p>

			{/* Buttons */}
			<div style={styles.buttonGroup}>
				<button
					onClick={analyzeText}
					disabled={loading || !inputText.trim()}
					style={{
						...styles.button,
						...styles.primaryButton,
						...(loading || !inputText.trim() ? styles.buttonDisabled : {}),
					}}
				>
					{loading ? "Genererar..." : "Generera text"}
				</button>
				<button
					onClick={clearAll}
					disabled={loading}
					style={{
						...styles.button,
						...styles.secondaryButton,
						...(loading ? styles.buttonDisabled : {}),
					}}
				>
					Rensa allt
				</button>
			</div>

			{/* Error Message */}
			{error && (
				<div style={styles.error}>
					<strong>Fel:</strong> {error}
				</div>
			)}

			{/* Two Column Layout */}
			<div style={styles.twoColumns}>
				{/* Input Section */}
				<div style={styles.column}>
					<label htmlFor="input-text" style={styles.label}>
						Beskriv vad du vill ha
					</label>
					<textarea
						id="input-text"
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						style={styles.textarea}
						placeholder="T.ex: Skriv en rubrik och ingress för en sida om hemsidor för småföretag..."
						rows={20}
					/>
				</div>

				{/* Result Section */}
				<div style={styles.column}>
					<label htmlFor="result-text" style={styles.label}>
						Genererad text (enligt SEO-regler)
					</label>
					<div id="result-text" style={styles.resultBox}>
						{loading && <p style={styles.loadingText}>Genererar SEO-optimerad text...</p>}
						{!loading && !resultText && <p style={styles.placeholderText}>Den genererade texten visas här...</p>}
						{!loading && resultText && resultText.split('\n').map((line, index) => (
							<p key={index} style={styles.resultLine}>{line}</p>
						))}
					</div>
				</div>
			</div>
			</div>
		</div>
	);
}

const styles: Record<string, React.CSSProperties> = {
	wrapper: {
		width: "100%",
		display: "flex",
		justifyContent: "center",
		backgroundColor: "#f5f5f5",
		minHeight: "calc(100vh - 200px)",
	},
	container: {
		width: "1440px",
		maxWidth: "100%",
		padding: "40px 64px",
		boxSizing: "border-box",
	},
	title: {
		fontSize: "32px",
		marginBottom: "16px",
		color: "#1e293b",
	},
	description: {
		fontSize: "16px",
		color: "#64748b",
		marginBottom: "24px",
		lineHeight: 1.6,
	},
	buttonGroup: {
		display: "flex",
		gap: "12px",
		flexWrap: "wrap",
		marginBottom: "24px",
	},
	twoColumns: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: "24px",
		width: "100%",
	},
	column: {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	},
	label: {
		fontSize: "16px",
		fontWeight: "600",
		color: "#1e293b",
	},
	textarea: {
		width: "100%",
		padding: "16px",
		fontSize: "15px",
		lineHeight: 1.6,
		border: "1px solid #ddd",
		borderRadius: "8px",
		fontFamily: "system-ui, sans-serif",
		resize: "none",
		boxSizing: "border-box",
		minHeight: "500px",
	},
	button: {
		padding: "12px 24px",
		fontSize: "16px",
		fontWeight: "500",
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		transition: "all 0.2s",
	},
	primaryButton: {
		backgroundColor: "#0056b3",
		color: "white",
	},
	secondaryButton: {
		backgroundColor: "#64748b",
		color: "white",
	},
	buttonDisabled: {
		opacity: 0.5,
		cursor: "not-allowed",
	},
	error: {
		padding: "16px",
		backgroundColor: "#fee",
		border: "1px solid #fcc",
		borderRadius: "8px",
		color: "#c00",
	},
	resultBox: {
		padding: "20px",
		backgroundColor: "white",
		border: "1px solid #ddd",
		borderRadius: "8px",
		minHeight: "500px",
		maxHeight: "500px",
		overflowY: "auto",
	},
	resultLine: {
		margin: "8px 0",
		lineHeight: 1.6,
		color: "#1e293b",
	},
	loadingText: {
		color: "#64748b",
		fontStyle: "italic",
	},
	placeholderText: {
		color: "#94a3b8",
		fontStyle: "italic",
	},
};
