import { useState, useEffect } from "react";

interface PhotoroomCardProps {
	cardType: {
		id: string;
		title: string;
		defaultCodeInstructions: string;
	};
}

export default function PhotoroomCard({ cardType }: PhotoroomCardProps) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [resultUrl, setResultUrl] = useState<string>("");
	const [codeInstructions, setCodeInstructions] = useState(cardType.defaultCodeInstructions);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const savedCode = localStorage.getItem(`bilder_code_${cardType.id}`);
		if (savedCode) setCodeInstructions(savedCode);
		else setCodeInstructions(cardType.defaultCodeInstructions);
	}, [cardType]);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			setPreviewUrl(URL.createObjectURL(file));
			setResultUrl("");
			setError(null);
		}
	};

	const processImage = async () => {
		if (!selectedFile) {
			setError("Välj en bild först");
			return;
		}

		setLoading(true);
		setError(null);
		setResultUrl("");

	try {
		const apiKey = import.meta.env.VITE_PHOTOROOM_API_KEY;
		
		if (!apiKey) {
			throw new Error("Photoroom API-nyckel saknas");
		}

		const formData = new FormData();
		formData.append('image_file', selectedFile);
		formData.append('format', 'png');

		const response = await fetch('https://sdk.photoroom.com/v1/segment', {
			method: 'POST',
			headers: {
				'x-api-key': apiKey,
			},
			body: formData,
		});

		// Kolla om det är ett fel (JSON) eller en bild
		const contentType = response.headers.get('content-type') || '';
		
		if (contentType.includes('application/json')) {
			const errorData = await response.json();
			throw new Error(`Photoroom: ${errorData.detail || JSON.stringify(errorData)}`);
		}

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Photoroom API-fel (${response.status}): ${errorText}`);
		}

		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		setResultUrl(url);
	} catch (err) {
		setError(err instanceof Error ? err.message : "Ett fel uppstod");
	} finally {
		setLoading(false);
	}
	};

	const saveCode = () => {
		localStorage.setItem(`bilder_code_${cardType.id}`, codeInstructions);
		alert("Kod sparad");
	};

	const downloadResult = () => {
		if (!resultUrl) return;
		const a = document.createElement('a');
		a.href = resultUrl;
		a.download = `photoroom-${Date.now()}.png`;
		a.click();
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
					<label style={styles.label}>Välj bild</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleFileSelect}
						style={styles.fileInput}
					/>
				</div>

				{previewUrl && (
					<div style={styles.formGroup}>
						<label style={styles.label}>Original</label>
						<div style={styles.imagePreview}>
							<img src={previewUrl} alt="Original" style={styles.previewImage} />
						</div>
					</div>
				)}

				<button
					onClick={processImage}
					disabled={loading || !selectedFile}
					style={{
						...styles.button,
						...styles.primaryButton,
						...(loading || !selectedFile ? styles.buttonDisabled : {})
					}}
				>
					{loading ? "Bearbetar..." : "Ta bort bakgrund"}
				</button>

				{resultUrl && (
					<div style={styles.formGroup}>
						<label style={styles.label}>Resultat</label>
						<div style={styles.imagePreview}>
							<img src={resultUrl} alt="Resultat" style={styles.previewImage} />
						</div>
						<button
							onClick={downloadResult}
							style={{...styles.button, ...styles.downloadButton}}
						>
							Ladda ner
						</button>
					</div>
				)}

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
	fileInput: {
		width: "100%",
		padding: "10px",
		fontSize: "14px",
		border: "1px solid #ddd",
		borderRadius: "6px",
		boxSizing: "border-box",
	},
	imagePreview: {
		width: "100%",
		backgroundColor: "#f9fafb",
		border: "1px solid #ddd",
		borderRadius: "8px",
		padding: "20px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "200px",
	},
	previewImage: {
		maxWidth: "100%",
		maxHeight: "400px",
		objectFit: "contain",
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
	downloadButton: {
		backgroundColor: "#059669",
		color: "white",
		marginTop: "8px",
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
};
