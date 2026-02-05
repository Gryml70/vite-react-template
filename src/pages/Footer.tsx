import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer style={footerStyle}>
			<div style={footerInnerStyle}>
				<p style={pStyle}>© {new Date().getFullYear()} handla-hemsida.com</p>
				<Link to="/integritetspolicy" style={linkStyle}>
					Integritetspolicy
				</Link>
			</div>
		</footer>
	);
}

const footerStyle: React.CSSProperties = {
	fontFamily: "var(--font-family)",
	background: "var(--color-secondary)",
	color: "var(--color-bg)",
	padding: "var(--space-md) 0",
	marginTop: "auto",
	width: "100%",
	boxSizing: "border-box",
	display: "flex",
	justifyContent: "center",
};

const footerInnerStyle: React.CSSProperties = {
	maxWidth: "800px",
	width: "100%",
	margin: "0 auto",
	padding: "0 20px",
	boxSizing: "border-box",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	flexWrap: "wrap",
	gap: "var(--space-md)",
};

const pStyle: React.CSSProperties = { margin: 0 };

const linkStyle: React.CSSProperties = {
	color: "var(--color-bg)",
	textDecoration: "underline",
};
