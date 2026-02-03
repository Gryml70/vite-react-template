import { Link } from "react-router-dom";

const nav_links = [
	{ label: "Hem", href: "/hem" },
	{ label: "Tjänster", href: "/tjanster" },
	{ label: "Om oss", href: "/om-oss" },
	{ label: "Kontakt", href: "/kontakt" },
];

export default function Header() {
	return (
		<header style={headerStyle}>
			<Link to="/hem" style={logoStyle}>
				handla-hemsida.com
			</Link>
			<nav aria-label="Huvudnavigering">
				<ul style={navListStyle}>
					{nav_links.map(({ label, href }) => (
						<li key={href}>
							<Link to={href} style={linkStyle}>
								{label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
}

const headerStyle: React.CSSProperties = {
	fontFamily: "var(--font-family)",
	background: "var(--color-bg)",
	color: "var(--color-text)",
	padding: "var(--space-md)",
	borderBottom: "1px solid var(--color-secondary)",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	flexWrap: "wrap",
	gap: "var(--space-md)",
};

const logoStyle: React.CSSProperties = {
	fontWeight: "var(--font-weight-bold)",
	color: "var(--color-primary)",
	textDecoration: "none",
	fontSize: "var(--font-size-base)",
};

const navListStyle: React.CSSProperties = {
	listStyle: "none",
	margin: 0,
	padding: 0,
	display: "flex",
	gap: "var(--space-md)",
};

const linkStyle: React.CSSProperties = {
	color: "var(--color-text)",
	textDecoration: "none",
};
