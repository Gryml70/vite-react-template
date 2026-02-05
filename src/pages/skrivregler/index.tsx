import { useState, useEffect } from "react";

/** AI-assistent för att kontrollera och förbättra texter enligt svenska skrivregler */
export default function Skrivregler() {
	const [inputText, setInputText] = useState("");
	const [resultText, setResultText] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		document.title = "Skrivregler - AI-assistent | Handla Hemsida";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute("content", "Kontrollera och förbättra dina texter med AI-hjälp enligt svenska skrivregler");
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

			const response = await fetch(functionUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${anonKey}`,
					"apikey": anonKey,
				},
				body: JSON.stringify({
					systemPrompt: `Du är en expert på svenska skrivregler och språkriktighet. Analysera texten användaren ger dig och:

1. Identifiera grammatiska fel
2. Hitta stavfel
3. Kontrollera interpunktion
4. Föreslå förbättringar av meningsbyggnad
5. Ge förslag på mer professionell eller tydligare formulering

Svara alltid på svenska. Strukturera ditt svar tydligt med rubriker för varje kategori. Om texten är bra som den är, bekräfta det och ge eventuella små förbättringsförslag.`,
					userContent: `Analysera följande text:\n\n${inputText}`,
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
					Klistra in eller skriv din text nedan så analyserar vår AI-assistent texten enligt svenska skrivregler
					och ger dig förbättringsförslag.
				</p>

				<div style={styles.content}>
					{/* Input Section */}
					<div style={styles.section}>
						<label htmlFor="input-text" style={styles.label}>
							Din text
						</label>
						<textarea
							id="input-text"
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							style={styles.textarea}
							placeholder="Skriv eller klistra in din text här..."
							rows={12}
						/>
					</div>

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
							{loading ? "Analyserar..." : "Analysera text"}
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

					{/* Result Section */}
					{resultText && (
						<div style={styles.section}>
							<label style={styles.label}>Analys och förbättringsförslag</label>
							<div style={styles.resultBox}>
								{resultText.split('\n').map((line, index) => (
									<p key={index} style={styles.resultLine}>{line}</p>
								))}
							</div>
						</div>
					)}
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
		marginBottom: "32px",
		lineHeight: 1.6,
	},
	content: {
		display: "flex",
		flexDirection: "column",
		gap: "24px",
	},
	section: {
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
		resize: "vertical",
		boxSizing: "border-box",
	},
	buttonGroup: {
		display: "flex",
		gap: "12px",
		flexWrap: "wrap",
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
		minHeight: "200px",
	},
	resultLine: {
		margin: "8px 0",
		lineHeight: 1.6,
		color: "#1e293b",
	},
};
