export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = process.env.POSTCODE_API_TOKEN;
  if (!token) {
    res.status(500).json({ error: "POSTCODE_API_TOKEN ontbreekt in environment." });
    return;
  }

  const postcode = String(req.query.postcode || "").replace(/\s+/g, "").toUpperCase();
  const number = String(req.query.number || "").trim();

  if (!postcode || !number) {
    res.status(400).json({ error: "postcode en number zijn verplicht" });
    return;
  }

  try {
    const params = new URLSearchParams({ postcode, number });
    const upstream = await fetch(`https://json.api-postcode.nl/?${params}`, {
      headers: {
        token,
        Accept: "application/json",
      },
    });
    const data = await upstream.json();
    res.setHeader("Cache-Control", "no-store");
    res.status(upstream.status).json(data);
  } catch {
    res.status(502).json({ error: "Postcode-service tijdelijk niet bereikbaar." });
  }
}
