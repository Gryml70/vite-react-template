import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";

const app = new Hono<{ Bindings: Env }>();

// Lösenordsskydd - Basic Authentication
// Användarnamn: konto
// Lösenord: Guld2026!
app.use("*", basicAuth({
	username: "konto",
	password: "Guld2026!",
}));

// API-rutt
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// SPA-fallback med rätt Content-Type
app.get("*", async (c) => {
	const url = new URL(c.req.url);
	const path = url.pathname;

	// Om ASSETS inte finns (dev-läge utan ASSETS binding), hoppa över worker-logik
	if (!c.env?.ASSETS) {
		return c.notFound();
	}

	// Hoppa över Vite dev-routes (/@vite, /@react-refresh, /node_modules, /@fs, /__vite)
	// Låt ASSETS hantera dem direkt
	if (path.startsWith("/@") || path.startsWith("/node_modules/") || path.startsWith("/__")) {
		return c.env.ASSETS.fetch(c.req.raw);
	}

	// Assets med filändelse (.js, .css, .svg osv.) - låt assets hantera med default Content-Type
	if (path.match(/\.[a-z0-9]+$/i) && !path.endsWith(".html")) {
		return c.env.ASSETS.fetch(c.req.raw);
	}

	// HTML-paths (/, /hem, /om-oss osv.) - hämta från assets och sätt Content-Type: text/html
	const response = await c.env.ASSETS.fetch(c.req.raw);
	const newResponse = new Response(response.body, response);
	newResponse.headers.set("Content-Type", "text/html; charset=utf-8");
	
	return newResponse;
});

export default app;
