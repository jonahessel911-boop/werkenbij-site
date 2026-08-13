/**
 * Cloudflare Worker proxy for api-postcode.nl (needed on GitHub Pages because of CORS).
 *
 * Deploy:
 *   1. Ga naar https://dash.cloudflare.com → Workers → Create
 *   2. Plak deze code
 *   3. Deploy en zet de worker-URL in js/main.js als POSTCODE_PROXY_URL
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const postcode = url.searchParams.get("postcode") || "";
    const number = url.searchParams.get("number") || "";
    const target = `https://json.api-postcode.nl/?postcode=${encodeURIComponent(postcode)}&number=${encodeURIComponent(number)}`;

    const upstream = await fetch(target, {
      headers: {
        token: "209313a0-694c-4441-9d90-b785ac3c6d08",
        Accept: "application/json",
      },
    });

    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  },
};
