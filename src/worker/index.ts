import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

// API-rutt
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// Fallback: för alla andra paths, låt assets hantera men sätt rätt Content-Type
app.get("*", async (c) => {
	// I dev-läge (när ASSETS inte finns), returnera inte något - Vite hanterar allt
	if (!c.env.ASSETS) {
		return c.notFound();
	}
	
	const url = new URL(c.req.url);
	const path = url.pathname;
	
	// Om path har filändelse (.js, .css, .svg, .png, etc.) - låt assets hantera utan inblandning
	if (path.match(/\.[a-z0-9]+$/i) && !path.endsWith(".html")) {
		return c.env.ASSETS.fetch(c.req.raw);
	}
	
	// För alla andra paths (/, /hem, /om-oss, etc.) - hämta från assets och sätt HTML Content-Type
	const response = await c.env.ASSETS.fetch(c.req.raw);
	
	// Klona response så vi kan sätta headers
	const newResponse = new Response(response.body, response);
	newResponse.headers.set("Content-Type", "text/html; charset=utf-8");
	
	return newResponse;
});

export default app;
