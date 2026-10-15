import { createHash, randomUUID } from "node:crypto";

const GRAPH_VERSION = "v21.0";
const DEFAULT_PIXEL_ID = "1648367720142834";

export function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

/** NL-friendly: 06… → 316…, +31 6… → 316… */
export function normalizePhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `31${digits.slice(1)}`;
  return digits;
}

function pickClientIp(req) {
  const forwarded = req?.headers?.["x-forwarded-for"] || req?.headers?.["x-real-ip"] || "";
  const raw = Array.isArray(forwarded) ? forwarded[0] : String(forwarded);
  return raw.split(",")[0]?.trim() || "";
}

/**
 * Fire Meta Conversions API Lead. Never throws — failures are returned.
 */
export async function sendMetaLeadEvent(input = {}, req) {
  const token = input.accessToken || process.env.META_CAPI_ACCESS_TOKEN || "";
  const pixelId = input.pixelId || process.env.META_PIXEL_ID || DEFAULT_PIXEL_ID;

  if (!token) {
    return { ok: false, skipped: true, reason: "META_CAPI_ACCESS_TOKEN missing" };
  }

  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const userAgent =
    input.clientUserAgent ||
    input.userAgent ||
    req?.headers?.["user-agent"] ||
    "";
  const clientIp = input.clientIp || pickClientIp(req);
  const fbc = String(input.fbc || "").trim();
  const fbp = String(input.fbp || "").trim();
  const eventSourceUrl =
    String(input.eventSourceUrl || input.event_source_url || "").trim() ||
    "https://werkenbij.batterijconcept.nl/";

  const user_data = {};
  if (email) user_data.em = [sha256(email)];
  if (phone) user_data.ph = [sha256(phone)];
  if (fbc) user_data.fbc = fbc;
  if (fbp) user_data.fbp = fbp;
  if (clientIp) user_data.client_ip_address = clientIp;
  if (userAgent) user_data.client_user_agent = userAgent;

  const event = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: eventSourceUrl,
    event_id: String(input.eventId || randomUUID()),
    user_data,
  };

  if (input.contentName) {
    event.custom_data = {
      content_name: String(input.contentName),
      currency: "EUR",
      value: 0,
    };
  }

  const body = { data: [event] };
  if (input.testEventCode) body.test_event_code = String(input.testEventCode);

  try {
    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return {
      ok: res.ok,
      status: res.status,
      data,
      event_id: event.event_id,
      matching: {
        has_em: Boolean(email),
        has_ph: Boolean(phone),
        has_fbc: Boolean(fbc),
        has_fbp: Boolean(fbp),
      },
    };
  } catch (err) {
    return { ok: false, error: err?.message || "Meta CAPI request failed" };
  }
}

/**
 * Send Lead via CAPI and never throw. Always await this on serverless
 * (Vercel freezes the isolate after the HTTP response is sent).
 */
export async function trackMetaLeadSafe(input, req) {
  try {
    const result = await sendMetaLeadEvent(input, req);
    if (result.skipped) {
      console.warn("[meta-capi] skipped:", result.reason);
    } else if (!result.ok) {
      console.error(
        "[meta-capi] failed:",
        result.status || "",
        result.error || "",
        JSON.stringify(result.data || {})
      );
    } else {
      console.info(
        "[meta-capi] Lead ok",
        result.event_id,
        result.data?.events_received,
        result.matching || {}
      );
    }
    return result;
  } catch (err) {
    console.error("[meta-capi] error:", err?.message || err);
    return { ok: false, error: err?.message || "Meta CAPI failed" };
  }
}
