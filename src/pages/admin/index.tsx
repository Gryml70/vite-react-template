import { useState, useEffect } from "react";
import { supabase, type MallContent } from "../../lib/supabase";
import { Desktop16x9Header } from "../../templates/Desktop_16x9_header";

/** Admin-gränssnitt för att hantera mall-innehåll */
export default function Admin() {
	const [contents, setContents] = useState<MallContent[]>([]);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState<MallContent | null>(null);
	const [previewing, setPreviewing] = useState(false);
	const [form, setForm] = useState<Partial<MallContent>>({
		title: "",
		slug: "",
		published: false,
		hero_image: "",
		hero_title: "",
		hero_content: "",
		hero_cta_text: "",
		hero_cta_url: "",
		subtitle: "",
		heading: "",
		body: "",
		row2_image: "",
		row3_image: "",
		cards_title: "",
		card1: "",
		card2: "",
		card3: "",
	});

	useEffect(() => {
		document.title = "Admin - Mall-innehåll | Handla Hemsida";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute("content", "Administrera och hantera mall-innehåll för Handla Hemsida");
		}
	}, []);

	useEffect(() => {
		fetchContents();
	}, []);

	async function fetchContents() {
		setLoading(true);
		const { data, error } = await supabase
			.from("mall_content")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching contents:", error);
			alert(`Error: ${error.message}`);
		} else {
			setContents(data || []);
		}
		setLoading(false);
	}

	async function handleSave() {
		if (!form.title || !form.slug || !form.hero_image || !form.hero_title || !form.hero_content) {
			alert("Fyll i alla obligatoriska fält (title, slug, hero_image, hero_title, hero_content)");
			return;
		}

		const { error } = editing
			? await supabase.from("mall_content").update(form).eq("id", editing.id)
			: await supabase.from("mall_content").insert([form]);

		if (error) {
			console.error("Error saving content:", error);
			alert(`Error: ${error.message}`);
		} else {
			alert(editing ? "Innehåll uppdaterat!" : "Innehåll skapat!");
			setEditing(null);
			setForm({
				title: "",
				slug: "",
				published: false,
				hero_image: "",
				hero_title: "",
				hero_content: "",
			});
			fetchContents();
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Är du säker på att du vill radera detta innehåll?")) return;

		const { error } = await supabase.from("mall_content").delete().eq("id", id);

		if (error) {
			console.error("Error deleting content:", error);
			alert(`Error: ${error.message}`);
		} else {
			alert("Innehåll raderat!");
			fetchContents();
		}
	}

	function handleEdit(content: MallContent) {
		setEditing(content);
		setForm(content);
	}

	// Om förhandsvisning är aktiv, visa bara preview
	if (previewing) {
		return (
			<div style={styles.previewWrapper}>
				<div style={styles.previewControls}>
					<button onClick={() => setPreviewing(false)} style={styles.closePreviewButton}>
						← Tillbaka till Admin
					</button>
					<h2 style={styles.previewTitle}>Förhandsvisning</h2>
				</div>
				<div style={styles.previewContent}>
					<Desktop16x9Header
						image={form.hero_image || ""}
						title={form.hero_title || "Rubrik"}
						content={form.hero_content || "Innehåll"}
						cta_text={form.hero_cta_text}
						cta_url={form.hero_cta_url}
						subtitle={form.subtitle}
						heading={form.heading}
						body={form.body}
						row2_image={form.row2_image}
						row3_image={form.row3_image}
						cards_title={form.cards_title}
						card1={form.card1}
						card2={form.card2}
						card3={form.card3}
					/>
				</div>
			</div>
		);
	}

	return (
		<div style={styles.wrapper}>
			<div style={styles.container}>
				<h1 style={styles.title}>Admin - Mall-innehåll</h1>

			{/* Formulär */}
			<div style={styles.formSection}>
				<h2 style={styles.subtitle}>
					{editing ? "Redigera innehåll" : "Skapa nytt innehåll"}
				</h2>

				<div style={styles.formGrid}>
				{/* Meta */}
				<div style={styles.formGroup}>
					<label htmlFor="title" style={styles.label}>
						Titel <span style={{ color: "red" }}>*</span>
					</label>
					<input
						id="title"
						type="text"
						value={form.title || ""}
						onChange={(e) => setForm({ ...form, title: e.target.value })}
						style={styles.input}
						placeholder="T.ex. Välkommen till vår sajt"
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="slug" style={styles.label}>
						Slug (URL) <span style={{ color: "red" }}>*</span>
					</label>
					<input
						id="slug"
						type="text"
						value={form.slug || ""}
						onChange={(e) => setForm({ ...form, slug: e.target.value })}
						style={styles.input}
						placeholder="valkommen-till-var-sajt"
					/>
				</div>

					<div style={styles.formGroup}>
						<label style={styles.label}>
							<input
								type="checkbox"
								checked={form.published || false}
								onChange={(e) => setForm({ ...form, published: e.target.checked })}
							/>
							{" "}Publicerad
						</label>
					</div>

				{/* Hero Section */}
				<h3 style={styles.sectionTitle}>Hero-sektion</h3>

				<div style={styles.formGroup}>
					<label htmlFor="hero_image" style={styles.label}>
						Hero-bild URL <span style={{ color: "red" }}>*</span>
					</label>
					<input
						id="hero_image"
						type="text"
						value={form.hero_image || ""}
						onChange={(e) => setForm({ ...form, hero_image: e.target.value })}
						style={styles.input}
						placeholder="https://..."
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="hero_title" style={styles.label}>
						Hero-rubrik <span style={{ color: "red" }}>*</span>
					</label>
					<input
						id="hero_title"
						type="text"
						value={form.hero_title || ""}
						onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
						style={styles.input}
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="hero_content" style={styles.label}>
						Hero-innehåll <span style={{ color: "red" }}>*</span>
					</label>
					<textarea
						id="hero_content"
						value={form.hero_content || ""}
						onChange={(e) => setForm({ ...form, hero_content: e.target.value })}
						style={{ ...styles.input, minHeight: "100px" }}
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="hero_cta_text" style={styles.label}>CTA-knapptext</label>
					<input
						id="hero_cta_text"
						type="text"
						value={form.hero_cta_text || ""}
						onChange={(e) => setForm({ ...form, hero_cta_text: e.target.value })}
						style={styles.input}
						placeholder="Kom igång"
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="hero_cta_url" style={styles.label}>CTA-länk</label>
					<input
						id="hero_cta_url"
						type="text"
						value={form.hero_cta_url || ""}
						onChange={(e) => setForm({ ...form, hero_cta_url: e.target.value })}
						style={styles.input}
						placeholder="/kontakt"
					/>
				</div>

				{/* Row 2 & 3 */}
				<h3 style={styles.sectionTitle}>Row 2 & 3</h3>

				<div style={styles.formGroup}>
					<label htmlFor="subtitle" style={styles.label}>Underrubrik</label>
					<input
						id="subtitle"
						type="text"
						value={form.subtitle || ""}
						onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
						style={styles.input}
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="heading" style={styles.label}>Rubrik</label>
					<input
						id="heading"
						type="text"
						value={form.heading || ""}
						onChange={(e) => setForm({ ...form, heading: e.target.value })}
						style={styles.input}
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="body" style={styles.label}>Brödtext</label>
					<textarea
						id="body"
						value={form.body || ""}
						onChange={(e) => setForm({ ...form, body: e.target.value })}
						style={{ ...styles.input, minHeight: "100px" }}
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="row2_image" style={styles.label}>Row 2 Bild URL</label>
					<input
						id="row2_image"
						type="text"
						value={form.row2_image || ""}
						onChange={(e) => setForm({ ...form, row2_image: e.target.value })}
						style={styles.input}
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="row3_image" style={styles.label}>Row 3 Bild URL</label>
					<input
						id="row3_image"
						type="text"
						value={form.row3_image || ""}
						onChange={(e) => setForm({ ...form, row3_image: e.target.value })}
						style={styles.input}
					/>
				</div>

				{/* Kort-sektion */}
				<h3 style={styles.sectionTitle}>Kort-sektion</h3>

				<div style={styles.formGroup}>
					<label htmlFor="cards_title" style={styles.label}>Kort-rubrik</label>
					<input
						id="cards_title"
						type="text"
						value={form.cards_title || ""}
						onChange={(e) => setForm({ ...form, cards_title: e.target.value })}
						style={styles.input}
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="card1" style={styles.label}>Kort 1</label>
					<input
						id="card1"
						type="text"
						value={form.card1 || ""}
						onChange={(e) => setForm({ ...form, card1: e.target.value })}
						style={styles.input}
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="card2" style={styles.label}>Kort 2</label>
					<input
						id="card2"
						type="text"
						value={form.card2 || ""}
						onChange={(e) => setForm({ ...form, card2: e.target.value })}
						style={styles.input}
					/>
				</div>

				<div style={styles.formGroup}>
					<label htmlFor="card3" style={styles.label}>Kort 3</label>
					<input
						id="card3"
						type="text"
						value={form.card3 || ""}
						onChange={(e) => setForm({ ...form, card3: e.target.value })}
						style={styles.input}
					/>
				</div>
				</div>

				<div style={styles.buttonGroup}>
					<button onClick={handleSave} style={styles.saveButton}>
						{editing ? "Uppdatera" : "Skapa"}
					</button>
					<button onClick={() => setPreviewing(true)} style={styles.previewButton}>
						👁️ Förhandsgranska
					</button>
					{editing && (
						<button
							onClick={() => {
								setEditing(null);
								setForm({
									title: "",
									slug: "",
									published: false,
									hero_image: "",
									hero_title: "",
									hero_content: "",
								});
							}}
							style={styles.cancelButton}
						>
							Avbryt
						</button>
					)}
				</div>
			</div>

			{/* Lista */}
			<div style={styles.listSection}>
				<h2 style={styles.subtitle}>Befintligt innehåll</h2>

				{loading ? (
					<p>Laddar...</p>
				) : contents.length === 0 ? (
					<p>Inget innehåll ännu.</p>
				) : (
					<table style={styles.table}>
						<thead>
							<tr>
								<th style={styles.th}>Titel</th>
								<th style={styles.th}>Slug</th>
								<th style={styles.th}>Publicerad</th>
								<th style={styles.th}>Skapad</th>
								<th style={styles.th}>Åtgärder</th>
							</tr>
						</thead>
						<tbody>
							{contents.map((content) => (
								<tr key={content.id} style={styles.tr}>
									<td style={styles.td}>{content.title}</td>
									<td style={styles.td}>
										<a href={`/${content.slug}`} target="_blank" rel="noopener noreferrer">
											{content.slug}
										</a>
									</td>
									<td style={styles.td}>{content.published ? "Ja" : "Nej"}</td>
									<td style={styles.td}>
										{content.created_at
											? new Date(content.created_at).toLocaleDateString("sv-SE")
											: "-"}
									</td>
									<td style={styles.td}>
										<button onClick={() => handleEdit(content)} style={styles.editButton}>
											Redigera
										</button>
										<button
											onClick={() => handleDelete(content.id!)}
											style={styles.deleteButton}
										>
											Radera
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
		</div>
	);
}

const styles = {
	wrapper: {
		width: "100%",
		display: "flex",
		justifyContent: "center",
		backgroundColor: "#ffffff",
	},
	container: {
		width: "1440px",
		padding: "40px 64px",
		fontFamily: "system-ui, sans-serif",
	},
	title: {
		fontSize: "32px",
		marginBottom: "40px",
	},
	subtitle: {
		fontSize: "24px",
		marginBottom: "20px",
	},
	sectionTitle: {
		fontSize: "18px",
		marginTop: "20px",
		marginBottom: "10px",
		gridColumn: "1 / -1",
		borderBottom: "1px solid #ddd",
		paddingBottom: "10px",
	},
	formSection: {
		backgroundColor: "#f9f9f9",
		padding: "30px",
		borderRadius: "8px",
		marginBottom: "40px",
	},
	formGrid: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: "20px",
	},
	formGroup: {
		display: "flex",
		flexDirection: "column" as const,
	},
	label: {
		marginBottom: "8px",
		fontWeight: "500",
	},
	input: {
		padding: "10px",
		border: "1px solid #ddd",
		borderRadius: "4px",
		fontSize: "14px",
	},
	buttonGroup: {
		marginTop: "20px",
		display: "flex",
		gap: "10px",
	},
	saveButton: {
		padding: "12px 24px",
		backgroundColor: "#0056b3",
		color: "white",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer",
		fontSize: "16px",
	},
	previewButton: {
		padding: "12px 24px",
		backgroundColor: "#008060",
		color: "white",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer",
		fontSize: "16px",
	},
	cancelButton: {
		padding: "12px 24px",
		backgroundColor: "#636e72",
		color: "white",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer",
		fontSize: "16px",
	},
	previewWrapper: {
		width: "100%",
		minHeight: "100vh",
		backgroundColor: "#f5f5f5",
	},
	previewControls: {
		backgroundColor: "#2d3436",
		color: "white",
		padding: "20px 64px",
		display: "flex",
		alignItems: "center",
		gap: "20px",
	},
	closePreviewButton: {
		padding: "10px 20px",
		backgroundColor: "#636e72",
		color: "white",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer",
		fontSize: "14px",
	},
	previewTitle: {
		margin: 0,
		fontSize: "20px",
	},
	previewContent: {
		display: "flex",
		justifyContent: "center",
		backgroundColor: "#ffffff",
		minHeight: "calc(100vh - 80px)",
	},
	listSection: {
		marginTop: "40px",
	},
	table: {
		width: "100%",
		borderCollapse: "collapse" as const,
		backgroundColor: "white",
	},
	th: {
		textAlign: "left" as const,
		padding: "12px",
		borderBottom: "2px solid #ddd",
		backgroundColor: "#f9f9f9",
	},
	tr: {
		borderBottom: "1px solid #eee",
	},
	td: {
		padding: "12px",
	},
	editButton: {
		padding: "6px 12px",
		marginRight: "8px",
		backgroundColor: "#0056b3",
		color: "white",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer",
	},
	deleteButton: {
		padding: "6px 12px",
		backgroundColor: "#d63031",
		color: "white",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer",
	},
};
