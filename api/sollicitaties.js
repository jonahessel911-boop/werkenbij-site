const SOLLICITATIES_WEBHOOK_URL = "https://platform.batterijconcept.nl/api/webhook/sollicitaties";
const LEADS_WEBHOOK_URL = "https://platform.batterijconcept.nl/api/webhook/leads";

function buildSollicitatiePayload(body) {
  const notitie =
    body.notitie ||
    [
      body.vacature ? `Vacature: ${body.vacature}` : "",
      body.woonplaats ? `Woonplaats: ${body.woonplaats}` : "",
      body.ervaring ? `Jaar ervaring in sales: ${body.ervaring}` : "",
      body.cv ? `CV: ${body.cv}` : "",
    ]
      .filter(Boolean)
      .join("\n");

  return {
    naam: body.naam,
    email: body.email,
    telefoon: body.telefoon,
    notitie,
    bron: body.bron || "werkenbij-formulier",
  };
}

function buildLeadsFallbackPayload(body) {
  const vacature = body.vacature || "Vacature";
  const notitie = buildSollicitatiePayload(body).notitie;

  return {
    naam: body.naam,
    email: body.email,
    telefoon: body.telefoon,
    woonplaats: body.woonplaats || "",
    utm_source: body.bron || "werkenbij-formulier",
    onderwerp: `Sollicitatie - ${vacature}`,
    omschrijving: notitie,
  };
}

async function forwardJson(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function readUpstreamResponse(upstream) {
  const text = await upstream.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const sollicitatiePayload = buildSollicitatiePayload(body);

    let upstream = await forwardJson(SOLLICITATIES_WEBHOOK_URL, sollicitatiePayload);
    if (upstream.status === 404) {
      upstream = await forwardJson(LEADS_WEBHOOK_URL, buildLeadsFallbackPayload(body));
    }

    const data = await readUpstreamResponse(upstream);
    if (!upstream.ok) {
      res.status(upstream.status).json({
        error: data.error || data.message || "Sollicitatie versturen mislukt.",
        ...data,
      });
      return;
    }

    res.status(upstream.status).json(data);
  } catch {
    res.status(502).json({ error: "Sollicitatie-webhook tijdelijk niet bereikbaar." });
  }
}
