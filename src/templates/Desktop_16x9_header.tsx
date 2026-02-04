/**
 * Mall: Desktop_16x9_header
 * Källa: Figma Templates handla-hemsida (node 2002:2)
 * Skapad: 2026-02-04
 * 
 * VARNING: Denna fil är skapad av AD Ingela via Figma.
 * Du får ALDRIG ändra denna fil. Endast läsrättighet.
 */

import type { CSSProperties } from "react";

export interface Desktop16x9HeaderProps {
	/** Hero bakgrundsbild */
	image: string;
	/** Huvudrubrik (H1) */
	title: string;
	/** Brödtext under titel */
	content: string;
	/** CTA-knapptext (t.ex. "Sign up") */
	cta_text?: string;
	/** CTA-knapplänk */
	cta_url?: string;
	/** Row 2 & 3: Underrubrik */
	subtitle?: string;
	/** Row 2 & 3: Sekundär rubrik */
	heading?: string;
	/** Row 2 & 3: Brödtext */
	body?: string;
	/** Row 2: Bild (höger sida) */
	row2_image?: string;
	/** Row 3: Bild (vänster sida) */
	row3_image?: string;
	/** Kort-sektion rubrik */
	cards_title?: string;
	/** Kort 1-3 (placeholder grå boxar) */
	card1?: string;
	card2?: string;
	card3?: string;
}

export function Desktop16x9Header(props: Desktop16x9HeaderProps) {
	return (
		<div style={styles.container}>
			{/* Hero Section */}
			<section
				style={{
					...styles.hero,
					backgroundImage: `url(${props.image})`,
				}}
				aria-label="Hero"
			/>

			{/* H1 Copy Section */}
			<section style={styles.h1Section}>
				<div style={styles.h1Wrapper}>
					<h1 style={styles.title}>{props.title}</h1>
				</div>
				<div style={styles.contentWrapper}>
					<p style={styles.content}>{props.content}</p>
				</div>
				{props.cta_text && (
					<div style={styles.ctaWrapper}>
						<a href={props.cta_url || "#"} style={styles.ctaButton}>
							{props.cta_text}
						</a>
					</div>
				)}
			</section>

			{/* Row 2: Image Right */}
			<section style={styles.row}>
				{props.row2_image && (
					<img
						src={props.row2_image}
						alt=""
						style={styles.rowImage}
					/>
				)}
				<div style={styles.rowContent}>
					{props.subtitle && <p style={styles.subtitle}>{props.subtitle}</p>}
					{props.heading && <h2 style={styles.heading}>{props.heading}</h2>}
					{props.body && <p style={styles.body}>{props.body}</p>}
				</div>
			</section>

			{/* Row 3: Image Left */}
			<section style={styles.row}>
				<div style={styles.rowContent}>
					{props.subtitle && <p style={styles.subtitle}>{props.subtitle}</p>}
					{props.heading && <h2 style={styles.heading}>{props.heading}</h2>}
					{props.body && <p style={styles.body}>{props.body}</p>}
				</div>
				{props.row3_image && (
					<img
						src={props.row3_image}
						alt=""
						style={styles.rowImage}
					/>
				)}
			</section>

			{/* Cards Section */}
			{props.cards_title && (
				<section style={styles.cardsSection}>
					<div style={styles.cardsTitle}>
						<h2 style={styles.heading}>{props.cards_title}</h2>
					</div>
					<div style={styles.cards}>
						<div style={styles.card} aria-label="Card 1">
							{props.card1}
						</div>
						<div style={styles.card} aria-label="Card 2">
							{props.card2}
						</div>
						<div style={styles.card} aria-label="Card 3">
							{props.card3}
						</div>
					</div>
				</section>
			)}
		</div>
	);
}

/** Exakta styles från Figma (minimal, semantisk) */
const styles: Record<string, CSSProperties> = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "1440px",
		backgroundColor: "#ffffff",
	},
	hero: {
		width: "100%",
		height: "810px",
		maxHeight: "810px",
		backgroundSize: "contain",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		boxSizing: "border-box",
	},
	h1Section: {
		width: "100%",
		padding: "40px 64px",
		backgroundColor: "#ffffff",
		display: "flex",
		flexDirection: "column",
		gap: "10px",
	},
	h1Wrapper: {
		display: "flex",
		flexDirection: "column",
		gap: "10px",
	},
	title: {
		fontFamily: "'Noto Sans', sans-serif",
		fontWeight: 700,
		fontSize: "44px",
		lineHeight: "59.93px",
		color: "#000000",
		margin: 0,
	},
	contentWrapper: {
		display: "flex",
		flexDirection: "column",
		gap: "10px",
		width: "900px",
		marginTop: "10px",
	},
	content: {
		fontFamily: "'Noto Sans', sans-serif",
		fontWeight: 400,
		fontSize: "20px",
		lineHeight: "29px",
		letterSpacing: "-0.1px",
		color: "rgba(0, 0, 0, 0.9)",
		margin: 0,
	},
	ctaWrapper: {
		display: "flex",
		paddingLeft: "64px",
		paddingTop: "3px",
		gap: "8px",
		height: "63px",
	},
	ctaButton: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "23px 32px",
		backgroundColor: "#0984e3",
		color: "#ffffff",
		borderRadius: "999px",
		fontFamily: "'Montserrat', sans-serif",
		fontWeight: 700,
		fontSize: "14px",
		textDecoration: "none",
		boxShadow:
			"0px 5px 15px rgba(37, 44, 97, 0.15), 0px 2px 4px rgba(136, 144, 194, 0.2)",
	},
	row: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "20px 64px",
		gap: "64px",
	},
	rowImage: {
		width: "624px",
		height: "604px",
		objectFit: "cover",
		flex: "1",
	},
	rowContent: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		gap: "48px",
		width: "624px",
		height: "604px",
		flex: "1",
	},
	subtitle: {
		fontFamily: "'Noto Sans', sans-serif",
		fontWeight: 500,
		fontSize: "18px",
		lineHeight: "25.2px",
		letterSpacing: "-0.09px",
		color: "rgba(0, 0, 0, 0.9)",
		margin: 0,
	},
	heading: {
		fontFamily: "'Noto Sans', sans-serif",
		fontWeight: 700,
		fontSize: "34px",
		lineHeight: "40.8px",
		letterSpacing: "-0.68px",
		color: "#000000",
		margin: 0,
	},
	body: {
		fontFamily: "'Noto Sans', sans-serif",
		fontWeight: 400,
		fontSize: "20px",
		lineHeight: "29px",
		letterSpacing: "-0.1px",
		color: "rgba(0, 0, 0, 0.9)",
		margin: 0,
	},
	cardsSection: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	cardsTitle: {
		width: "100%",
		padding: "0 64px",
		textAlign: "left",
	},
	cards: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		gap: "30px",
		padding: "64px",
		width: "100%",
		opacity: 0.74,
	},
	card: {
		width: "417.33px",
		height: "576px",
		backgroundColor: "#f9f9f9",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "10px",
		flex: "1",
	},
};
