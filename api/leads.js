import { trackMetaLeadSafe } from "../lib/meta-capi.js";

const WEBHOOK_URL = "https://platform.batterijconcept.nl/api/webhook/leads";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const upstream = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (upstream.ok) {
      trackMetaLeadSafe(
        {
          email: payload.email,
          phone: payload.telefoon || payload.phone,
          fbc: payload.fbc,
          fbp: payload.fbp,
          eventSourceUrl: payload.event_source_url || payload.eventSourceUrl,
          clientUserAgent: payload.client_user_agent || payload.userAgent,
          eventId: payload.event_id || payload.eventId,
          contentName: payload.utm_source || payload.bron || "website-lead",
        },
        req
      ).catch(() => {});
    }

    res.status(upstream.status).json(data);
  } catch {
    res.status(502).json({ error: "Lead-webhook tijdelijk niet bereikbaar." });
  }
}
