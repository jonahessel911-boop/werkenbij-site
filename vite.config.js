import { defineConfig, loadEnv } from "vite";
import { resolve } from "node:path";
import { trackMetaLeadSafe } from "./lib/meta-capi.js";

function postcodeProxyPlugin(token) {
  const pages = new Set([
    "/vacatures",
    "/over-ons",
    "/contact",
    "/sales-vacature",
    "/appointment-vacature",
  ]);

  const handler = async (req, res, next) => {
    const url = new URL(req.url, "http://localhost");

    if (url.pathname.endsWith("/api/sollicitaties") || url.pathname === "/api/sollicitaties") {
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
          const parsed = JSON.parse(body || "{}");
          const sollicitatiePayload = {
            naam: parsed.naam,
            email: parsed.email,
            telefoon: parsed.telefoon,
            functie: parsed.functie || parsed.vacature || "",
            notitie: parsed.notitie,
            bron: parsed.bron || "werkenbij-formulier",
          };

          let upstream = await fetch("https://platform.batterijconcept.nl/api/webhook/sollicitaties", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(sollicitatiePayload),
          });

          if (upstream.status === 404) {
            upstream = await fetch("https://platform.batterijconcept.nl/api/webhook/leads", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                naam: parsed.naam,
                email: parsed.email,
                telefoon: parsed.telefoon,
                woonplaats: parsed.woonplaats || "",
                utm_source: parsed.bron || "werkenbij-formulier",
                onderwerp: `Sollicitatie - ${parsed.vacature || "Vacature"}`,
                omschrijving: parsed.notitie,
              }),
            });
          }

          const text = await upstream.text();
          if (upstream.ok) {
            await trackMetaLeadSafe(
              {
                email: parsed.email,
                phone: parsed.telefoon,
                fbc: parsed.fbc,
                fbp: parsed.fbp,
                eventSourceUrl: parsed.event_source_url,
                clientUserAgent: parsed.client_user_agent || req.headers["user-agent"],
                eventId: parsed.event_id,
                contentName: parsed.vacature || parsed.bron || "sollicitatie",
              },
              req
            );
          }
          res.statusCode = upstream.status;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(text);
        } catch {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "Sollicitatie-webhook tijdelijk niet bereikbaar." }));
        }
      });
      return;
    }

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
          const parsed = JSON.parse(body || "{}");
          const upstream = await fetch("https://platform.batterijconcept.nl/api/webhook/leads", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body,
          });
          const text = await upstream.text();
          if (upstream.ok) {
            await trackMetaLeadSafe(
              {
                email: parsed.email,
                phone: parsed.telefoon || parsed.phone,
                fbc: parsed.fbc,
                fbp: parsed.fbp,
                eventSourceUrl: parsed.event_source_url,
                clientUserAgent: parsed.client_user_agent || req.headers["user-agent"],
                eventId: parsed.event_id,
                contentName: parsed.utm_source || parsed.bron || "website-lead",
              },
              req
            );
          }
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
  // loadEnv does not put vars on process.env; meta-capi reads process.env.
  for (const key of ["META_CAPI_ACCESS_TOKEN", "META_PIXEL_ID", "POSTCODE_API_TOKEN"]) {
    if (env[key]) process.env[key] = env[key];
  }
  const token = process.env.POSTCODE_API_TOKEN || "";

  return {
    base: "/",
    plugins: [postcodeProxyPlugin(token)],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          vacatures: resolve(__dirname, "vacatures.html"),
          overOns: resolve(__dirname, "over-ons.html"),
          contact: resolve(__dirname, "contact.html"),
          salesVacature: resolve(__dirname, "sales-vacature.html"),
          appointmentVacature: resolve(__dirname, "appointment-vacature.html"),
        },
      },
    },
    server: {
      port: 5173,
      open: true,
    },
  };
});
