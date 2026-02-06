import { useState, useEffect } from "react";
import { BILDER_CARD_TYPES } from "./CardTypes";
import PhotoroomCard from "./PhotoroomCard";
import ProductPhotoCard from "./ProductPhotoCard";

/** Bilder - AI-genererade bilder */
export default function Bilder() {
	return (
		<div style={styles.wrapper}>
			<div style={styles.container}>
				<h1 style={styles.title}>Bilder</h1>
				
			<div style={styles.scrollContainer}>
				{BILDER_CARD_TYPES.map((cardType) => {
					// Använd specialiserad komponent för Produkt Bild
					if (cardType.id === 'produkt-bild') {
						return <ProductPhotoCard key={cardType.id} cardType={cardType} />;
					}
					// Alla andra Photoroom-kort använder PhotoroomCard
					else if (cardType.isPhotoroom) {
						return <PhotoroomCard key={cardType.id} cardType={cardType} />;
					}
					// Fallback för eventuella icke-Photoroom kort
					else {
						return <CardComponent key={cardType.id} cardType={cardType} />;
					}
				})}
			</div>
			</div>
		</div>
	);
}

function CardComponent({ cardType }: { cardType: any }) {
	const [keyword, setKeyword] = useState("");
	const [systemPrompt, setSystemPrompt] = useState("");
	const [userPrompt, setUserPrompt] = useState("");
	const [codeInstructions, setCodeInstructions] = useState("");
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const savedKeyword = localStorage.getItem(`bilder_keyword_${cardType.id}`);
		const savedSystemPrompt = localStorage.getItem(`bilder_systemPrompt_${cardType.id}`);
		const savedCode = localStorage.getItem(`bilder_code_${cardType.id}`);
		
		if (savedKeyword) setKeyword(savedKeyword);
		if (savedSystemPrompt) setSystemPrompt(savedSystemPrompt);
		if (savedCode) setCodeInstructions(savedCode);
	}, [cardType]);

	const saveData = () => {
		localStorage.setItem(`bilder_keyword_${cardType.id}`, keyword);
		localStorage.setItem(`bilder_systemPrompt_${cardType.id}`, systemPrompt);
		alert(`${cardType.title} sparad`);
	};

	const saveCode = () => {
		localStorage.setItem(`bilder_code_${cardType.id}`, codeInstructions);
		alert("Kod sparad");
	};

	const countStats = (text: string) => {
		const chars = text.length;
		const words = text.trim() ? text.trim().split(/\s+/).length : 0;
		return { chars, words };
	};

	const sendPrompt = async () => {
		if (!systemPrompt.trim()) {
			setError("Skriv en system prompt");
			return;
		}

		if (!userPrompt.trim()) {
			setError("Skriv ett meddelande");
			return;
		}

		setLoading(true);
		setError(null);
		setResponse("");

		try {
			let fullSystemPrompt = systemPrompt.trim();
			if (keyword.trim()) {
				fullSystemPrompt = `${systemPrompt.trim()}\n\nVALT NYCKELORD: ${keyword.trim()}`;
			}

			const apiResponse = await fetch("/api/system-prompts/test", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					systemPrompt: fullSystemPrompt,
					userMessage: userPrompt.trim(),
				}),
			});

			const data = await apiResponse.json();
			if (!apiResponse.ok) throw new Error(data.error || "Kunde inte få svar");

			setResponse(data.response);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ett fel uppstod");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={styles.card}>
			<div style={styles.cardHeader}>
				<h2 style={styles.cardTitle}>{cardType.title}</h2>
			</div>

			<div style={styles.cardBody}>
				{error && (
					<div style={styles.error}>
						<strong>Fel:</strong> {error}
					</div>
				)}

				<div style={styles.formGroup}>
					<label style={styles.label}>Valt nyckelord</label>
					<input
						type="text"
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						style={styles.input}
						placeholder="T.ex: WordPress, SEO..."
					/>
				</div>

				<div style={styles.formGroup}>
					<label style={styles.label}>System Prompt</label>
					<textarea
						value={systemPrompt}
						onChange={(e) => setSystemPrompt(e.target.value)}
						style={styles.textarea}
						rows={12}
					/>
					<button
						onClick={saveData}
						disabled={!systemPrompt.trim()}
						style={{
							...styles.saveButton,
							...((!systemPrompt.trim()) ? styles.buttonDisabled : {})
						}}
					>
						Spara
					</button>
				</div>

				<div style={styles.formGroup}>
					<label style={styles.label}>Din fråga/prompt</label>
					<textarea
						value={userPrompt}
						onChange={(e) => setUserPrompt(e.target.value)}
						style={styles.textarea}
						rows={4}
					/>
				</div>

				<button
					onClick={sendPrompt}
					disabled={loading || !systemPrompt.trim() || !userPrompt.trim()}
					style={{
						...styles.button,
						...styles.primaryButton,
						...(loading || !systemPrompt.trim() || !userPrompt.trim() ? styles.buttonDisabled : {})
					}}
				>
					{loading ? "Väntar på svar..." : "Skicka"}
				</button>

				<div style={styles.formGroup}>
					<label style={styles.label}>Svar</label>
					<div style={styles.resultBox}>
						{loading && (
							<div style={styles.loadingIndicator}>
								<div style={styles.spinner}></div>
								<p style={styles.loadingText}>Väntar på svar...</p>
							</div>
						)}
						{!loading && !response && (
							<p style={styles.placeholderText}>Svaret visas här...</p>
						)}
						{!loading && response && (
							<div style={styles.resultContent}>
								{response.split('\n').map((line, index) => (
									<p key={index} style={styles.resultLine}>{line || '\u00A0'}</p>
								))}
							</div>
						)}
					</div>
					{!loading && response && (
						<p style={styles.stats}>
							{countStats(response).chars} bokstäver • {countStats(response).words} ord
						</p>
					)}
				</div>

				<div style={styles.formGroup}>
					<label style={styles.label}>Kod/Instruktioner</label>
					<textarea
						value={codeInstructions}
						onChange={(e) => setCodeInstructions(e.target.value)}
						style={styles.codeTextarea}
						rows={20}
					/>
					<button
						onClick={saveCode}
						disabled={!codeInstructions.trim()}
						style={{
							...styles.saveButton,
							...((!codeInstructions.trim()) ? styles.buttonDisabled : {})
						}}
					>
						Spara
					</button>
				</div>
			</div>

			<style>{`
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
}

const styles: Record<string, React.CSSProperties> = {
	wrapper: {
		width: "100%",
		backgroundColor: "#f5f5f5",
		minHeight: "calc(100vh - 200px)",
	},
	container: {
		padding: "40px 20px",
	},
	title: {
		fontSize: "32px",
		marginBottom: "32px",
		color: "#1e293b",
		paddingLeft: "44px",
	},
	scrollContainer: {
		display: "flex",
		gap: "24px",
		overflowX: "auto",
		paddingBottom: "40px",
		paddingLeft: "44px",
		paddingRight: "44px",
	},
	card: {
		minWidth: "600px",
		maxWidth: "600px",
		backgroundColor: "white",
		borderRadius: "12px",
		boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
		flexShrink: 0,
	},
	cardHeader: {
		padding: "20px 24px",
		backgroundColor: "#f8fafc",
		borderBottom: "1px solid #e2e8f0",
	},
	cardTitle: {
		fontSize: "20px",
		fontWeight: "600",
		color: "#1e293b",
		margin: 0,
	},
	cardBody: {
		padding: "24px",
		maxHeight: "calc(100vh - 250px)",
		overflowY: "auto",
	},
	formGroup: {
		marginBottom: "20px",
	},
	label: {
		display: "block",
		fontSize: "14px",
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: "8px",
	},
	input: {
		width: "100%",
		padding: "10px 12px",
		fontSize: "14px",
		border: "1px solid #ddd",
		borderRadius: "6px",
		boxSizing: "border-box",
	},
	textarea: {
		width: "100%",
		padding: "12px",
		fontSize: "14px",
		lineHeight: 1.6,
		border: "1px solid #ddd",
		borderRadius: "6px",
		fontFamily: "system-ui, sans-serif",
		resize: "vertical",
		boxSizing: "border-box",
	},
	codeTextarea: {
		width: "100%",
		padding: "12px",
		fontSize: "13px",
		lineHeight: 1.6,
		border: "1px solid #ddd",
		borderRadius: "6px",
		fontFamily: "Monaco, Consolas, 'Courier New', monospace",
		resize: "vertical",
		boxSizing: "border-box",
		backgroundColor: "#f8f9fa",
	},
	saveButton: {
		padding: "6px 16px",
		fontSize: "13px",
		fontWeight: "500",
		backgroundColor: "#059669",
		color: "white",
		border: "none",
		borderRadius: "6px",
		cursor: "pointer",
		marginTop: "8px",
	},
	button: {
		width: "100%",
		padding: "12px 24px",
		fontSize: "16px",
		fontWeight: "600",
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		transition: "all 0.2s",
		marginBottom: "20px",
	},
	primaryButton: {
		backgroundColor: "#0056b3",
		color: "white",
	},
	buttonDisabled: {
		opacity: 0.5,
		cursor: "not-allowed",
	},
	error: {
		padding: "12px",
		backgroundColor: "#fee",
		border: "1px solid #fcc",
		borderRadius: "6px",
		color: "#c00",
		marginBottom: "16px",
		fontSize: "14px",
	},
	resultBox: {
		padding: "20px",
		backgroundColor: "#f9fafb",
		border: "1px solid #ddd",
		borderRadius: "8px",
		minHeight: "200px",
		maxHeight: "400px",
		overflowY: "auto",
	},
	resultContent: {
		lineHeight: 1.6,
	},
	resultLine: {
		margin: "8px 0",
		color: "#1e293b",
	},
	loadingIndicator: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: "16px",
		padding: "40px",
	},
	spinner: {
		width: "40px",
		height: "40px",
		border: "4px solid #e0e0e0",
		borderTop: "4px solid #0056b3",
		borderRadius: "50%",
		animation: "spin 1s linear infinite",
	},
	loadingText: {
		color: "#64748b",
		fontStyle: "italic",
	},
	placeholderText: {
		color: "#94a3b8",
		fontStyle: "italic",
		textAlign: "center",
		padding: "40px 20px",
	},
	stats: {
		fontSize: "12px",
		color: "#64748b",
		marginTop: "8px",
		textAlign: "right",
		fontWeight: "500",
	},
};
