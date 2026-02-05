import { useState, useEffect } from "react";

/** Skrivregler - Tre AI-assistenter för att skapa, testa och validera SEO-regler */
export default function Skrivregler() {
	// AI 1 - Skapa regler
	const [question, setQuestion] = useState("");
	const [ruleResponse, setRuleResponse] = useState("");
	const [loadingRule, setLoadingRule] = useState(false);
	const [selectedText, setSelectedText] = useState("");

	// AI 2 - Generera innehåll
	const [prompt, setPrompt] = useState("");
	const [generatedContent, setGeneratedContent] = useState("");
	const [loadingGenerate, setLoadingGenerate] = useState(false);

	// AI 3 - Validera innehåll
	const [validationResult, setValidationResult] = useState("");
	const [loadingValidate, setLoadingValidate] = useState(false);

	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		document.title = "Skrivregler - AI-assistent | Handla Hemsida";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute("content", "Skapa och testa SEO-regler med AI-hjälp");
		}
	}, []);

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://aoovgbubyetnymvtshud.supabase.co";
	const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	// AI 1: Fråga om regel
	const askForRule = async () => {
		if (!question.trim()) return;
		
		setLoadingRule(true);
		setError(null);
		setRuleResponse("");

		try {
			const response = await fetch(`${supabaseUrl}/functions/v1/skrivregler-create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${anonKey}`,
					"apikey": anonKey,
				},
				body: JSON.stringify({ question: question.trim() }),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "Kunde inte hämta regel");
			
			setRuleResponse(data.content);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ett fel uppstod");
		} finally {
			setLoadingRule(false);
		}
	};

	// Spara markerad text till md-fil
	const saveToMdFile = async () => {
		if (!selectedText.trim()) {
			setError("Markera text i svaret först");
			return;
		}

		try {
			const response = await fetch(`${supabaseUrl}/functions/v1/skrivregler-save`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${anonKey}`,
					"apikey": anonKey,
				},
				body: JSON.stringify({ text: selectedText.trim() }),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "Kunde inte spara");
			
			alert("✅ Text tillagd i grundregler-seo.md!");
			setSelectedText("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ett fel uppstod vid sparande");
		}
	};

	// AI 2: Generera innehåll enligt regler
	const generateContent = async () => {
		if (!prompt.trim()) return;
		
		setLoadingGenerate(true);
		setError(null);
		setGeneratedContent("");
		setValidationResult("");

		try {
			const response = await fetch(`${supabaseUrl}/functions/v1/skrivregler-generate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${anonKey}`,
					"apikey": anonKey,
				},
				body: JSON.stringify({ prompt: prompt.trim() }),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "Kunde inte generera innehåll");
			
			setGeneratedContent(data.content);
			
			// Automatisk validering
			validateContent(data.content);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ett fel uppstod");
		} finally {
			setLoadingGenerate(false);
		}
	};

	// AI 3: Validera innehåll
	const validateContent = async (content: string) => {
		if (!content.trim()) return;
		
		setLoadingValidate(true);

		try {
			const response = await fetch(`${supabaseUrl}/functions/v1/skrivregler-validate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${anonKey}`,
					"apikey": anonKey,
				},
				body: JSON.stringify({ content: content.trim() }),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "Kunde inte validera");
			
			setValidationResult(data.content);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ett fel uppstod vid validering");
		} finally {
			setLoadingValidate(false);
		}
	};

	// Hantera textmarkering
	const handleTextSelection = () => {
		const selection = window.getSelection();
		if (selection) {
			setSelectedText(selection.toString());
		}
	};

	return (
		<div style={styles.wrapper}>
			<div style={styles.container}>
				<h1 style={styles.title}>Skrivregler - AI-assistent</h1>
				<p style={styles.description}>
					Skapa SEO-regler med AI, testa innehållsgenerering, och validera resultat automatiskt.
				</p>

				{error && (
					<div style={styles.error}>
						<strong>Fel:</strong> {error}
					</div>
				)}

				{/* SEKTION 1: Skapa regler */}
				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>1. Skapa SEO-regler</h2>
					<p style={styles.sectionDesc}>Fråga AI om en regel, markera svaret, och spara till grundregler-seo.md</p>
					
					<div style={styles.twoColumns}>
						<div style={styles.column}>
							<label htmlFor="question" style={styles.label}>Din fråga</label>
							<textarea
								id="question"
								value={question}
								onChange={(e) => setQuestion(e.target.value)}
								style={styles.textarea}
								placeholder="T.ex: hur ser reglerna ut för korrekt seo för H1"
								rows={8}
							/>
							<button
								onClick={askForRule}
								disabled={loadingRule || !question.trim()}
								style={{
									...styles.button,
									...styles.primaryButton,
									...(loadingRule || !question.trim() ? styles.buttonDisabled : {}),
								}}
							>
								{loadingRule ? "Frågar AI..." : "Fråga AI"}
							</button>
						</div>

						<div style={styles.column}>
							<label htmlFor="rule-response" style={styles.label}>AI:s svar (markera text att spara)</label>
							<div
								id="rule-response"
								style={styles.resultBox}
								onMouseUp={handleTextSelection}
							>
								{loadingRule && <p style={styles.loadingText}>AI tänker...</p>}
								{!loadingRule && !ruleResponse && <p style={styles.placeholderText}>Svaret visas här...</p>}
								{!loadingRule && ruleResponse && ruleResponse.split('\n').map((line, index) => (
									<p key={index} style={styles.resultLine}>{line}</p>
								))}
							</div>
							{selectedText && (
								<div style={styles.selectedTextInfo}>
									Markerad text ({selectedText.length} tecken) - 
									<button onClick={saveToMdFile} style={styles.saveButton}>
										Lägg till i md-fil
									</button>
								</div>
							)}
						</div>
					</div>
				</section>

				{/* SEKTION 2: Generera innehåll */}
				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>2. Testa innehållsgenerering</h2>
					<p style={styles.sectionDesc}>Generera innehåll enligt reglerna du skapat ovan</p>
					
					<div style={styles.twoColumns}>
						<div style={styles.column}>
							<label htmlFor="prompt" style={styles.label}>Vad vill du generera?</label>
							<textarea
								id="prompt"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								style={styles.textarea}
								placeholder="T.ex: skriv en rubrik om wordpress"
								rows={8}
							/>
							<button
								onClick={generateContent}
								disabled={loadingGenerate || !prompt.trim()}
								style={{
									...styles.button,
									...styles.primaryButton,
									...(loadingGenerate || !prompt.trim() ? styles.buttonDisabled : {}),
								}}
							>
								{loadingGenerate ? "Genererar..." : "Generera innehåll"}
							</button>
						</div>

						<div style={styles.column}>
							<label htmlFor="generated-content" style={styles.label}>Genererat innehåll</label>
							<div id="generated-content" style={styles.resultBox}>
								{loadingGenerate && <p style={styles.loadingText}>AI genererar...</p>}
								{!loadingGenerate && !generatedContent && <p style={styles.placeholderText}>Genererat innehåll visas här...</p>}
								{!loadingGenerate && generatedContent && generatedContent.split('\n').map((line, index) => (
									<p key={index} style={styles.resultLine}>{line}</p>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* SEKTION 3: Validera innehåll */}
				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>3. Automatisk validering</h2>
					<p style={styles.sectionDesc}>AI kontrollerar om det genererade innehållet följer reglerna</p>
					
					<div style={styles.validationBox}>
						{loadingValidate && <p style={styles.loadingText}>Validerar...</p>}
						{!loadingValidate && !validationResult && <p style={styles.placeholderText}>Validering körs automatiskt när innehåll genereras...</p>}
						{!loadingValidate && validationResult && validationResult.split('\n').map((line, index) => (
							<p key={index} style={styles.resultLine}>{line}</p>
						))}
					</div>
				</section>
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
		marginBottom: "40px",
		lineHeight: 1.6,
	},
	section: {
		marginBottom: "48px",
		padding: "32px",
		backgroundColor: "white",
		borderRadius: "12px",
		boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
	},
	sectionTitle: {
		fontSize: "24px",
		marginBottom: "8px",
		color: "#1e293b",
	},
	sectionDesc: {
		fontSize: "14px",
		color: "#64748b",
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
	saveButton: {
		padding: "8px 16px",
		fontSize: "14px",
		backgroundColor: "#008060",
		color: "white",
		border: "none",
		borderRadius: "6px",
		cursor: "pointer",
		marginLeft: "8px",
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
		marginBottom: "24px",
	},
	resultBox: {
		padding: "20px",
		backgroundColor: "#f9fafb",
		border: "1px solid #ddd",
		borderRadius: "8px",
		minHeight: "300px",
		maxHeight: "400px",
		overflowY: "auto",
		userSelect: "text",
		cursor: "text",
	},
	validationBox: {
		padding: "20px",
		backgroundColor: "#f9fafb",
		border: "2px solid #ddd",
		borderRadius: "8px",
		minHeight: "200px",
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
	selectedTextInfo: {
		padding: "12px",
		backgroundColor: "#eff6ff",
		border: "1px solid #3b82f6",
		borderRadius: "6px",
		fontSize: "14px",
		color: "#1e40af",
	},
};
