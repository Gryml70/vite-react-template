import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

// API-rutt
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// SPA-fallback med rätt Content-Type
app.get("*", async (c) => {
	const url = new URL(c.req.url);
	const path = url.pathname;

	// Hoppa över Vite dev-routes (/@vite, /@react-refresh, /node_modules, /@fs, /__vite)
	if (path.startsWith("/@") || path.startsWith("/node_modules/") || path.startsWith("/__")) {
		// I dev finns dessa routes i Vite - returnera 404 så Vite hanterar dem
		return c.notFound();
	}

	// Om ASSETS inte finns (borde inte hända i prod, men säkerhetscheck), returnera 404
	if (!c.env?.ASSETS) {
		return c.notFound();
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
