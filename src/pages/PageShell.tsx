import { useEffect } from "react";
import type { PagePlaceholders } from "./types";

interface PageShellProps extends PagePlaceholders {
	children?: React.ReactNode;
}

export default function PageShell({
	title,
	subtitle,
	content,
	image,
	cta_text,
	cta_url,
	meta_title,
	meta_description,
	children,
}: PageShellProps) {
	useEffect(() => {
		document.title = meta_title;
		const meta = document.querySelector('meta[name="description"]');
		if (meta) meta.setAttribute("content", meta_description);
		else {
			const el = document.createElement("meta");
			el.name = "description";
			el.content = meta_description;
			document.head.appendChild(el);
		}
	}, [meta_title, meta_description]);

	return (
		<article style={articleStyle}>
			<h1 style={h1Style}>{title}</h1>
			{subtitle && <p style={subtitleStyle}>{subtitle}</p>}
			{image && (
				<p style={imgWrapStyle}>
					<img src={image} alt="" loading="lazy" style={imgStyle} />
				</p>
			)}
			<div style={contentStyle} dangerouslySetInnerHTML={{ __html: content }} />
			{cta_text && cta_url && (
				<p>
					<a href={cta_url} style={ctaStyle}>
						{cta_text}
					</a>
				</p>
			)}
			{children}
		</article>
	);
}

const articleStyle: React.CSSProperties = { fontFamily: "var(--font-family)" };
const h1Style: React.CSSProperties = {
	fontSize: "1.75rem",
	fontWeight: "var(--font-weight-bold)",
	color: "var(--color-text)",
};
const subtitleStyle: React.CSSProperties = {
	color: "var(--color-secondary)",
	fontSize: "var(--font-size-base)",
};
const imgWrapStyle: React.CSSProperties = { margin: "var(--space-md) 0" };
const imgStyle: React.CSSProperties = { maxWidth: "100%", borderRadius: "var(--radius-md)" };
const contentStyle: React.CSSProperties = { lineHeight: 1.6 };
const ctaStyle: React.CSSProperties = {
	display: "inline-block",
	marginTop: "var(--space-md)",
	padding: "0.5rem 1rem",
	background: "var(--color-primary)",
	color: "var(--color-bg)",
	textDecoration: "none",
	borderRadius: "var(--radius-md)",
};
