import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../pages/Layout";
import Hem from "../pages/hem/index.tsx";
import OmOss from "../pages/om-oss/index.tsx";
import Tjanster from "../pages/tjanster/index.tsx";
import Kontakt from "../pages/kontakt/index.tsx";
import Integritetspolicy from "../pages/integritetspolicy/index.tsx";
import NotFound from "../pages/404/index.tsx";
import PreviewMall from "../pages/preview-mall/index.tsx";
import Admin from "../pages/admin/index.tsx";
import Skrivregler from "../pages/skrivregler/index.tsx";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
			{/* Alla sidor med Layout (inkl Header) */}
			<Route path="/" element={<Layout />}>
				<Route index element={<Navigate to="/hem" replace />} />
				<Route path="hem" element={<Hem />} />
				<Route path="om-oss" element={<OmOss />} />
				<Route path="tjanster" element={<Tjanster />} />
				<Route path="kontakt" element={<Kontakt />} />
				<Route path="integritetspolicy" element={<Integritetspolicy />} />
				<Route path="skrivregler" element={<Skrivregler />} />
				<Route path="admin" element={<Admin />} />
				<Route path="preview-mall" element={<PreviewMall />} />
				<Route path="*" element={<NotFound />} />
			</Route>
			</Routes>
		</BrowserRouter>
	);
}
