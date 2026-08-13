import { defineConfig, loadEnv } from "vite";
import { resolve } from "node:path";

function postcodeProxyPlugin(token) {
  const pages = new Set([
    "/producten",
    "/advies-aan-huis",
    "/over-ons",
    "/contact",
    "/vrienden-van-vrienden",
    "/service",
  ]);

  const handler = async (req, res, next) => {
    const url = new URL(req.url, "http://localhost");

    if (url.pathname.endsWith("/api/service-verzoeken") || url.pathname === "/api/service-verzoeken") {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        try {
          const upstream = await fetch("https://platform.batterijconcept.nl/api/webhook/service-verzoeken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body,
          });
          const text = await upstream.text();
          res.statusCode = upstream.status;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(text);
        } catch {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "Service-webhook tijdelijk niet bereikbaar." }));
        }
      });
      return;
    }

    if (url.pathname.endsWith("/api/leads") || url.pathname === "/api/leads") {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        try {
          const upstream = await fetch("https://platform.batterijconcept.nl/api/webhook/leads", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body,
          });
          const text = await upstream.text();
          res.statusCode = upstream.status;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(text);
        } catch {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "Lead-webhook tijdelijk niet bereikbaar." }));
        }
      });
      return;
    }

    if (url.pathname.endsWith("/api/postcode") || url.pathname === "/api/postcode") {
      if (!token) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "POSTCODE_API_TOKEN ontbreekt in .env.local" }));
        return;
      }

      const target = `https://json.api-postcode.nl/${url.search}`;
      try {
        const upstream = await fetch(target, {
          headers: { token, Accept: "application/json" },
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const token = env.POSTCODE_API_TOKEN || process.env.POSTCODE_API_TOKEN || "";

  return {
    base: "/",
    plugins: [postcodeProxyPlugin(token)],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          producten: resolve(__dirname, "producten.html"),
          advies: resolve(__dirname, "advies-aan-huis.html"),
          overOns: resolve(__dirname, "over-ons.html"),
          contact: resolve(__dirname, "contact.html"),
          vrienden: resolve(__dirname, "vrienden-van-vrienden.html"),
          service: resolve(__dirname, "service.html"),
        },
      },
    },
    server: {
      port: 5173,
      open: true,
    },
  };
});
