/**
 * Cloudflare Worker proxy for api-postcode.nl (needed on GitHub Pages because of CORS).
 *
 * Set POSTCODE_API_TOKEN as a Worker secret / env binding.
 */
export default {
  async fetch(request, env) {
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

    const token = env.POSTCODE_API_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ error: "POSTCODE_API_TOKEN ontbreekt" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const postcode = url.searchParams.get("postcode") || "";
    const number = url.searchParams.get("number") || "";
    const target = `https://json.api-postcode.nl/?postcode=${encodeURIComponent(postcode)}&number=${encodeURIComponent(number)}`;

    const upstream = await fetch(target, {
      headers: {
        token,
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
