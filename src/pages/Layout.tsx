import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
	return (
		<div style={layoutStyle}>
			<Header />
			<main style={mainStyle}>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}

const layoutStyle: React.CSSProperties = {
	minHeight: "100vh",
	display: "flex",
	flexDirection: "column",
	fontFamily: "var(--font-family)",
	background: "var(--color-bg)",
	color: "var(--color-text)",
};

const mainStyle: React.CSSProperties = {
	flex: 1,
	padding: "var(--space-md)",
	maxWidth: "60rem",
	margin: "0 auto",
	width: "100%",
};
