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

	// AI 4 - Fixa innehåll (loop)
	const [loadingFix, setLoadingFix] = useState(false);
	const [fixAttempts, setFixAttempts] = useState(0);
	const MAX_FIX_ATTEMPTS = 3;

	const [error, setError] = useState<string | null>(null);

	// Export till WordPress
	const exportToWordPress = () => {
		if (!generatedContent) return;

		// Extrahera titel, meta-beskrivning, nyckelord och innehåll
		const lines = generatedContent.split('\n');
		const title = lines[0].replace(/^#\s*/, '').trim();
		
		// Hitta meta-beskrivning (söker efter "Meta-beskrivning:", "Metabeskrivning:" etc.)
		const metaLine = lines.find(line => 
			line.toLowerCase().includes('meta') && 
			(line.toLowerCase().includes('beskrivning') || line.toLowerCase().includes('description'))
		);
		const metaDescription = metaLine 
			? metaLine.replace(/.*?:\s*/i, '').trim().replace(/["""]/g, '') 
			: title.substring(0, 156);

		// Hitta nyckelord/nyckelordsfras
		const keywordLine = lines.find(line => 
			line.toLowerCase().includes('nyckelord') || 
			line.toLowerCase().includes('keyword') ||
			line.toLowerCase().includes('fokus')
		);
		const keyword = keywordLine 
			? keywordLine.replace(/.*?:\s*/i, '').trim().replace(/["""]/g, '') 
			: title.split(' ').slice(0, 3).join(' ');

		// Ta bort meta-info från innehållet (behåll bara riktigt innehåll)
		const contentLines = lines.filter(line => 
			!line.toLowerCase().includes('meta') && 
			!line.toLowerCase().includes('nyckelord') &&
			!line.toLowerCase().includes('keyword')
		);
		const content = contentLines.join('\n');

		const now = new Date().toISOString();

		const wxr = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:wp="http://wordpress.org/export/1.2/">

<channel>
	<title>Handla Hemsida Export</title>
	<link>https://handla-hemsida.com</link>
	<description>SEO-optimerat innehåll</description>
	<pubDate>${now}</pubDate>
	<language>sv-SE</language>
	<wp:wxr_version>1.2</wp:wxr_version>

	<item>
		<title>${title}</title>
		<pubDate>${now}</pubDate>
		<dc:creator><![CDATA[admin]]></dc:creator>
		<content:encoded><![CDATA[${content}]]></content:encoded>
		<excerpt:encoded><![CDATA[${metaDescription}]]></excerpt:encoded>
		<wp:post_date><![CDATA[${now}]]></wp:post_date>
		<wp:post_date_gmt><![CDATA[${now}]]></wp:post_date_gmt>
		<wp:post_type><![CDATA[post]]></wp:post_type>
		<wp:status><![CDATA[draft]]></wp:status>
		<wp:postmeta>
			<wp:meta_key><![CDATA[_yoast_wpseo_metadesc]]></wp:meta_key>
			<wp:meta_value><![CDATA[${metaDescription}]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key><![CDATA[_yoast_wpseo_focuskw]]></wp:meta_key>
			<wp:meta_value><![CDATA[${keyword}]]></wp:meta_value>
		</wp:postmeta>
	</item>

</channel>
</rss>`;

		// Ladda ner som fil
		const blob = new Blob([wxr], { type: 'application/xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'wordpress-export-' + Date.now() + '.xml';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		alert('✅ WordPress-fil exporterad! Importera i WordPress via Verktyg → Importera → WordPress');
	};

	useEffect(() => {
		document.title = "Skrivregler - AI-assistent | Handla Hemsida";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute("content", "Skapa och testa SEO-regler med AI-hjälp");
		}
	}, []);

	// Reset fix-räknare när innehåll blir korrekt
	useEffect(() => {
		if (validationResult && validationResult.includes("Korrekt ✅") && fixAttempts > 0) {
			setFixAttempts(0);
		}
	}, [validationResult, fixAttempts]);

	// Använder lokala API-routes istället för Supabase Edge Functions

	// AI 1: Fråga om regel
	const askForRule = async () => {
		if (!question.trim()) return;
		
		setLoadingRule(true);
		setError(null);
		setRuleResponse("");

		try {
			const response = await fetch("/api/ai/create-rule", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
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
			setError("Markera text i AI:s svar först");
			return;
		}

		// Bekräfta innan sparande för att undvika dubbletter
		const preview = selectedText.substring(0, 150);
		const confirmSave = confirm('Vill du lägga till denna text i grundregler-seo.md?\n\n' + preview + (selectedText.length > 150 ? '...' : '') + '\n\n(' + selectedText.length + ' tecken)');
		
		if (!confirmSave) {
			return;
		}

		try {
			const response = await fetch("/api/seo-rules/save", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: selectedText.trim() }),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "Kunde inte spara");
			
			// Tydlig success-feedback
			alert(`✅ SPARAT!\n\nText tillagd i grundregler-seo.md\nTotalt ${data.totalLength} tecken i filen\n\nÖppna filen i BBEdit för att se ändringen längst ner.`);
			setSelectedText("");
			setError(null);
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
			const response = await fetch("/api/ai/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
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
			const response = await fetch("/api/ai/validate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ content: content.trim() }),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "Kunde inte validera");
			
			setValidationResult(data.content);
			return data.content; // Returnera för loop-användning
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ett fel uppstod vid validering");
			return null;
		} finally {
			setLoadingValidate(false);
		}
	};

	// AI 4: Fixa innehåll (ett försök per knapptryck)
	const fixContentAutomatically = async () => {
		if (!generatedContent || !validationResult || !prompt) {
			setError("Inget innehåll att fixa");
			return;
		}

		// Kolla om redan korrekt
		if (validationResult.includes("Korrekt ✅")) {
			setError("✅ Innehållet är redan korrekt!");
			return;
		}

		// Kolla max försök
		if (fixAttempts >= MAX_FIX_ATTEMPTS) {
			setError(`Max ${MAX_FIX_ATTEMPTS} fix-försök nådda. Börja om med ny prompt eller tryck "Generera innehåll" igen.`);
			return;
		}

		setLoadingFix(true);
		setError(null);

		try {
			// Fixa innehållet
			const response = await fetch("/api/ai/fix", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ 
					originalContent: generatedContent,
					validationFeedback: validationResult,
					originalPrompt: prompt
				}),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "Kunde inte fixa innehåll");
			
			const fixedContent = data.content;
			
			// Uppdatera genererat innehåll OCH visa tydligt i UI
			setGeneratedContent(fixedContent);
			setFixAttempts(prev => prev + 1);
			
			// Vänta en kort stund så användaren ser den nya rubriken
			await new Promise(resolve => setTimeout(resolve, 800));
			
			// Validera automatiskt den fixade versionen
			await validateContent(fixedContent);
			
			// Om korrekt, reset räknare
			// (kontrolleras i nästa render när validationResult uppdaterats)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ett fel uppstod vid fixande");
		} finally {
			setLoadingFix(false);
		}
	};

	// Hantera textmarkering (BARA inuti AI:s svarfält)
	const handleTextSelection = (e: React.MouseEvent<HTMLDivElement>) => {
		const selection = window.getSelection();
		if (!selection || selection.toString().trim().length === 0) {
			setSelectedText("");
			return;
		}

		// Kontrollera att markeringen är INUTI detta element
		const container = e.currentTarget;
		const range = selection.getRangeAt(0);
		
		// Kolla om markeringen börjar och slutar inuti rätt container
		if (container.contains(range.startContainer) && container.contains(range.endContainer)) {
			setSelectedText(selection.toString().trim());
		} else {
			setSelectedText(""); // Markeringen är utanför svarfältet
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
							<label htmlFor="generated-content" style={styles.label}>
								Genererat innehåll
								{loadingFix && <span style={{ marginLeft: "12px", color: "#f59e0b", fontSize: "14px" }}>⚡ Uppdaterar...</span>}
							</label>
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
						{loadingFix && <p style={styles.loadingText}>🔧 Fixar innehåll... (Försök {fixAttempts + 1}/{MAX_FIX_ATTEMPTS})</p>}
						{!loadingValidate && !loadingFix && !validationResult && <p style={styles.placeholderText}>Validering körs automatiskt när innehåll genereras...</p>}
						{!loadingValidate && !loadingFix && validationResult && validationResult.split('\n').map((line, index) => (
							<p key={index} style={styles.resultLine}>{line}</p>
						))}
					</div>

					{/* Fixa automatiskt knapp */}
					{validationResult && !validationResult.includes("Korrekt ✅") && !loadingFix && (
						<div style={{ marginTop: "24px", textAlign: "center" }}>
							<button
								onClick={fixContentAutomatically}
								disabled={loadingFix || fixAttempts >= MAX_FIX_ATTEMPTS}
								style={{
									...styles.button,
									...styles.fixButton,
									...(loadingFix || fixAttempts >= MAX_FIX_ATTEMPTS ? styles.buttonDisabled : {}),
								}}
							>
								🔧 Fixa {fixAttempts > 0 ? `igen (${fixAttempts}/${MAX_FIX_ATTEMPTS})` : 'automatiskt'}
							</button>
							{fixAttempts > 0 && fixAttempts < MAX_FIX_ATTEMPTS && (
								<p style={{ color: "#64748b", marginTop: "12px", fontSize: "14px" }}>
									Försök {fixAttempts} av {MAX_FIX_ATTEMPTS}. Klicka igen för att fortsätta.
								</p>
							)}
							{fixAttempts >= MAX_FIX_ATTEMPTS && (
								<p style={{ color: "#dc2626", marginTop: "12px", fontSize: "14px" }}>
									Max {MAX_FIX_ATTEMPTS} försök nådda. Börja om med "Generera innehåll" eller ny prompt.
								</p>
							)}
						</div>
					)}

					{validationResult && validationResult.includes("Korrekt ✅") && (
						<div style={{ marginTop: "24px", textAlign: "center" }}>
							<p style={{ color: "#059669", fontSize: "18px", fontWeight: "bold" }}>
								✅ Innehållet är perfekt!
							</p>
							{fixAttempts > 0 && (
								<p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
									Fixat efter {fixAttempts} {fixAttempts === 1 ? 'försök' : 'försök'}
								</p>
							)}
						</div>
					)}

					{/* Export till WordPress knapp */}
					{generatedContent && validationResult && (
						<div style={{ marginTop: "32px", textAlign: "center" }}>
							<button
								onClick={exportToWordPress}
								style={{
									...styles.button,
									...styles.exportButton,
								}}
							>
								📤 Exportera till WordPress
							</button>
						</div>
					)}
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
	fixButton: {
		backgroundColor: "#ea580c",
		color: "white",
		fontSize: "18px",
		padding: "16px 32px",
		fontWeight: "600",
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
	exportButton: {
		backgroundColor: "#059669",
		color: "white",
	},
};
