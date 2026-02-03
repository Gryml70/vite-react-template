import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer style={footerStyle}>
			<p style={pStyle}>© {new Date().getFullYear()} handla-hemsida.com</p>
			<Link to="/integritetspolicy" style={linkStyle}>
				Integritetspolicy
			</Link>
		</footer>
	);
}

const footerStyle: React.CSSProperties = {
	fontFamily: "var(--font-family)",
	background: "var(--color-secondary)",
	color: "var(--color-bg)",
	padding: "var(--space-md)",
	marginTop: "auto",
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
