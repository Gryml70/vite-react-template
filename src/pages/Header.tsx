import { Link } from "react-router-dom";

const nav_links = [
	{ label: "Hem", href: "/hem" },
	{ label: "Tjänster", href: "/tjanster" },
	{ label: "Om oss", href: "/om-oss" },
	{ label: "Kontakt", href: "/kontakt" },
	{ label: "Skrivregler", href: "/skrivregler" },
	{ label: "Admin", href: "/admin" },
	{ label: "Förhandsvisning", href: "/preview-mall" },
];

export default function Header() {
	return (
		<header style={headerStyle}>
			<div style={headerInnerStyle}>
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
			</div>
		</header>
	);
}

const headerStyle: React.CSSProperties = {
	fontFamily: "var(--font-family)",
	background: "var(--color-bg)",
	color: "var(--color-text)",
	padding: "var(--space-md) 0",
	borderBottom: "1px solid var(--color-secondary)",
	width: "100%",
	boxSizing: "border-box",
	display: "flex",
	justifyContent: "center",
};

const headerInnerStyle: React.CSSProperties = {
	width: "1440px",
	maxWidth: "100%",
	boxSizing: "border-box",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
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
