import { useEffect } from "react";
import { Link } from "react-router-dom";

const placeholders = {
	title: "Sidan hittades inte",
	subtitle: "Fel 404",
	content: "<p>Den adress du sökte finns inte. Gå tillbaka till startsidan eller använd menyn ovan.</p>",
	meta_title: "Sidan hittades inte | handla-hemsida.com",
	meta_description: "Sidan du sökte kunde inte hittas.",
};

export default function NotFound() {
	useEffect(() => {
		document.title = placeholders.meta_title;
	}, []);
	return (
		<article style={articleStyle}>
			<h1 style={h1Style}>{placeholders.title}</h1>
			<p style={subtitleStyle}>{placeholders.subtitle}</p>
			<div style={contentStyle} dangerouslySetInnerHTML={{ __html: placeholders.content }} />
			<Link to="/hem" style={linkStyle}>
				Till startsidan
			</Link>
		</article>
	);
}

const articleStyle: React.CSSProperties = { fontFamily: "var(--font-family)" };
const h1Style: React.CSSProperties = {
	fontSize: "1.75rem",
	fontWeight: "var(--font-weight-bold)",
	color: "var(--color-text)",
};
const subtitleStyle: React.CSSProperties = { color: "var(--color-secondary)" };
const contentStyle: React.CSSProperties = { lineHeight: 1.6 };
const linkStyle: React.CSSProperties = {
	display: "inline-block",
	marginTop: "var(--space-md)",
	color: "var(--color-primary)",
	textDecoration: "underline",
};
