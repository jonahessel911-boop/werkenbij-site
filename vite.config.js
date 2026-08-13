import { defineConfig } from "vite";
import { resolve } from "node:path";

const POSTCODE_TOKEN = "209313a0-694c-4441-9d90-b785ac3c6d08";

function postcodeProxyPlugin() {
  const pages = new Set([
    "/producten",
    "/advies-aan-huis",
    "/over-ons",
    "/contact",
  ]);

  const handler = async (req, res, next) => {
    const url = new URL(req.url, "http://localhost");

    if (url.pathname.endsWith("/api/postcode") || url.pathname === "/api/postcode") {
      const target = `https://json.api-postcode.nl/${url.search}`;
      try {
        const upstream = await fetch(target, {
          headers: { token: POSTCODE_TOKEN, Accept: "application/json" },
        });
        const body = await upstream.text();
        res.statusCode = upstream.status;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.end(body);
      } catch {
        res.statusCode = 502;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "Postcode-service tijdelijk niet bereikbaar." }));
      }
      return;
    }

    // Clean URLs in local Vite: /producten → /producten.html
    const clean = url.pathname.replace(/\/$/, "") || "/";
    if (pages.has(clean)) {
      req.url = `${clean}.html${url.search}`;
    }

    return next();
  };

  return {
    name: "postcode-api-proxy",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [postcodeProxyPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        producten: resolve(__dirname, "producten.html"),
        advies: resolve(__dirname, "advies-aan-huis.html"),
        overOns: resolve(__dirname, "over-ons.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
