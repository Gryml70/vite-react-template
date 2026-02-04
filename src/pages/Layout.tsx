import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
	return (
		<div style={layoutStyle}>
			<Header />
			<main style={mainStyle}>
				<div style={mainInnerStyle}>
					<Outlet />
				</div>
			</main>
			<Footer />
		</div>
	);
}

const mainInnerStyle: React.CSSProperties = {
	width: "1440px",
	maxWidth: "100%",
	padding: "var(--space-md) 0",
	boxSizing: "border-box",
};

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
	width: "100%",
	display: "flex",
	justifyContent: "center",
	background: "var(--color-bg)",
};
