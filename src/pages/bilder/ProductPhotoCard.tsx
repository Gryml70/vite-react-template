import { useState, useEffect } from "react";

interface ProductPhotoCardProps {
	cardType: {
		id: string;
		title: string;
		defaultCodeInstructions: string;
	};
}

export default function ProductPhotoCard({ cardType }: ProductPhotoCardProps) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [resultUrl, setResultUrl] = useState<string>("");
	const [codeInstructions, setCodeInstructions] = useState(cardType.defaultCodeInstructions);
	const [copyright, setCopyright] = useState("© 2026 Handla Hemsida");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const savedCode = localStorage.getItem(`bilder_code_${cardType.id}`);
		const savedCopyright = localStorage.getItem(`bilder_copyright_${cardType.id}`);
		
		if (savedCode) setCodeInstructions(savedCode);
		else setCodeInstructions(cardType.defaultCodeInstructions);
		
		if (savedCopyright) setCopyright(savedCopyright);
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
			formData.append('bg_color', '#ffffff');
			
		const response = await fetch('https://sdk.photoroom.com/v1/segment', {
			method: 'POST',
			headers: {
				'x-api-key': apiKey,
			},
			body: formData,
		});

		console.log('Response status:', response.status);
		console.log('Content-Type:', response.headers.get('content-type'));

		// Kolla om det är ett fel (JSON) eller en bild
		const contentType = response.headers.get('content-type') || '';
		
		if (contentType.includes('application/json')) {
			// Det är ett JSON-felmeddelande
			const errorData = await response.json();
			console.error('Photoroom JSON error:', errorData);
			throw new Error(`Photoroom: ${errorData.detail || JSON.stringify(errorData)}`);
		}

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Photoroom API-fel (${response.status}): ${errorText}`);
		}

		const blob = await response.blob();
			
			// Konvertera till WebP
			const webpBlob = await convertToWebP(blob);
			const url = URL.createObjectURL(webpBlob);
			setResultUrl(url);
		} catch (err) {
			console.error('Fel vid bildbearbetning:', err);
			setError(err instanceof Error ? err.message : "Ett fel uppstod");
		} finally {
			setLoading(false);
		}
	};

	const convertToWebP = async (blob: Blob): Promise<Blob> => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				
				const ctx = canvas.getContext('2d');
				if (!ctx) {
					reject(new Error('Kunde inte skapa canvas context'));
					return;
				}
				
				ctx.drawImage(img, 0, 0);
				
				canvas.toBlob((webpBlob) => {
					if (webpBlob) {
						resolve(webpBlob);
					} else {
						reject(new Error('Kunde inte konvertera till WebP'));
					}
				}, 'image/webp', 0.95);
			};
			img.onerror = () => reject(new Error('Kunde inte ladda bilden'));
			img.src = URL.createObjectURL(blob);
		});
	};

	const saveCode = () => {
		localStorage.setItem(`bilder_code_${cardType.id}`, codeInstructions);
		alert("Kod sparad");
	};

	const saveCopyright = () => {
		localStorage.setItem(`bilder_copyright_${cardType.id}`, copyright);
		alert("Copyright sparad");
	};

	const downloadResult = () => {
		if (!resultUrl) return;
		const a = document.createElement('a');
		a.href = resultUrl;
		const timestamp = new Date().toISOString().split('T')[0];
		a.download = `produktbild-${timestamp}-${copyright.replace(/[^a-z0-9]/gi, '-')}.webp`;
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
					<label style={styles.label}>Ladda upp produktbild</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleFileSelect}
						style={styles.fileInput}
					/>
				</div>

				<div style={styles.formGroup}>
					<label style={styles.label}>Copyright-text</label>
					<input
						type="text"
						value={copyright}
						onChange={(e) => setCopyright(e.target.value)}
						style={styles.input}
					/>
					<button onClick={saveCopyright} style={styles.saveButton}>
						Spara copyright
					</button>
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
					{loading ? "Bearbetar..." : "Bearbeta"}
				</button>

				{loading && (
					<div style={styles.processingInfo}>
						<div style={styles.spinner}></div>
						<p>Tar bort bakgrund och lägger till vit bakgrund...</p>
					</div>
				)}

				{resultUrl && (
					<div style={styles.formGroup}>
						<label style={styles.label}>✅ Klar produktbild</label>
						<div style={styles.imagePreview}>
							<img src={resultUrl} alt="Produktbild" style={styles.previewImage} />
						</div>
						<button onClick={downloadResult} style={{...styles.button, ...styles.downloadButton}}>
							📥 Ladda ner WebP
						</button>
					</div>
				)}

				<div style={styles.formGroup}>
					<label style={styles.label}>Kod/Instruktioner</label>
					<textarea
						value={codeInstructions}
						onChange={(e) => setCodeInstructions(e.target.value)}
						style={styles.codeTextarea}
						rows={15}
					/>
					<button onClick={saveCode} style={styles.saveButton}>
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
	input: {
		width: "100%",
		padding: "10px 12px",
		fontSize: "14px",
		border: "1px solid #ddd",
		borderRadius: "6px",
		boxSizing: "border-box",
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
	processingInfo: {
		textAlign: "center",
		padding: "20px",
		backgroundColor: "#f0f9ff",
		borderRadius: "8px",
		marginBottom: "20px",
	},
	spinner: {
		width: "40px",
		height: "40px",
		border: "4px solid #e0e0e0",
		borderTop: "4px solid #0056b3",
		borderRadius: "50%",
		animation: "spin 1s linear infinite",
		margin: "0 auto 12px",
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
