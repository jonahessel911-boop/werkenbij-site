const PRODUCTS = {
  "g3-t10": {
    name: "Alpha ESS Smile G3-T10",
    image: "/images/products/g3-t10.png",
    intro:
      "Krachtige 10 kW drie-fase hybride oplossing. We zetten dit Alpha-systeem naast Huawei, Growatt en BYD — zodat jij weet of dit écht de beste match is voor jouw verbruik.",
    sizes: [
      { model: "G3-T10 + 9,6 kWh", capacity: "9,6 kWh", usage: "Geschikt tot ca. 3.500 kWh/jaar", power: "10 kW" },
      { model: "G3-T10 + 19,2 kWh", capacity: "19,2 kWh", usage: "Geschikt tot ca. 5.500 kWh/jaar", power: "10 kW" },
      { model: "G3-T10 + 28,8 kWh", capacity: "28,8 kWh", usage: "Geschikt tot ca. 7.500+ kWh/jaar", power: "10 kW" },
    ],
  },
  "g3-s5": {
    name: "Alpha ESS Smile G3-S5",
    image: "/images/products/g3-s5.png",
    intro:
      "Compacte 5 kW single-phase hybride batterij. Populair bij veel woningen — maar we vergelijken altijd of Growatt of Huawei in jouw geval slimmer is.",
    sizes: [
      { model: "G3-S5 + 4,8 kWh", capacity: "4,8 kWh", usage: "Geschikt tot ca. 2.500 kWh/jaar", power: "5 kW" },
      { model: "G3-S5 + 9,6 kWh", capacity: "9,6 kWh", usage: "Geschikt tot ca. 4.000 kWh/jaar", power: "5 kW" },
      { model: "G3-S5 + 19,2 kWh", capacity: "19,2 kWh", usage: "Geschikt tot ca. 6.000 kWh/jaar", power: "5 kW" },
    ],
  },
  "huawei-luna": {
    name: "Huawei LUNA2000",
    image: "/images/products/huawei-luna.png",
    intro:
      "Modulaire high-voltage batterij van Huawei. Sterk als je al Huawei-omvormers hebt, maar we kijken altijd of een ander merk scherper of beter past.",
    sizes: [
      { model: "LUNA2000 5 kWh", capacity: "5 kWh", usage: "Compacte buffer / starter", power: "Modulair" },
      { model: "LUNA2000 10–15 kWh", capacity: "10–15 kWh", usage: "Geschikt tot ca. 4.500 kWh/jaar", power: "Modulair" },
      { model: "LUNA2000 20–30 kWh", capacity: "20–30 kWh", usage: "Geschikt tot ca. 7.000+ kWh/jaar", power: "Modulair" },
    ],
  },
  "growatt-apx": {
    name: "Growatt APX HV",
    image: "/images/products/growatt-apx.png",
    intro:
      "Schaalbare high-voltage opslag van Growatt. Vaak interessant op prijs/prestatie — we zetten ‘m naast Alpha en BYD voordat we adviseren.",
    sizes: [
      { model: "APX 5 kWh", capacity: "5 kWh", usage: "Starter / avondbuffer", power: "HV" },
      { model: "APX 10–15 kWh", capacity: "10–15 kWh", usage: "Geschikt tot ca. 4.500 kWh/jaar", power: "HV" },
      { model: "APX 20+ kWh", capacity: "20+ kWh", usage: "Geschikt tot ca. 6.500+ kWh/jaar", power: "HV" },
    ],
  },
  "byd-box": {
    name: "BYD Battery-Box Premium",
    image: "/images/products/byd-box.png",
    intro:
      "Bewezen modulaire opslag van BYD. Breed inzetbaar — wij vergelijken HV/LV-varianten met andere merken op garantie, compatibiliteit en prijs.",
    sizes: [
      { model: "Battery-Box HVS", capacity: "5–10 kWh", usage: "Compacte high-voltage setup", power: "HV" },
      { model: "Battery-Box HVM", capacity: "11–22 kWh", usage: "Geschikt tot ca. 5.500 kWh/jaar", power: "HV" },
      { model: "Battery-Box Premium+", capacity: "22+ kWh", usage: "Geschikt tot ca. 7.000+ kWh/jaar", power: "HV / LV" },
    ],
  },
  "sigenergy": {
    name: "Sigenergy SigenStor",
    image: "/images/products/sigenergy.png",
    intro:
      "All-in-one energieopslag van Sigenergy. Interessant bij EV-laden en toekomstige uitbreiding — we wegen ‘m af tegen klassieke batterij+omvormer-combinaties.",
    sizes: [
      { model: "SigenStor compact", capacity: "5–10 kWh", usage: "Starter / kleinere woningen", power: "All-in-one" },
      { model: "SigenStor mid", capacity: "10–20 kWh", usage: "Geschikt tot ca. 5.500 kWh/jaar", power: "All-in-one" },
      { model: "SigenStor large", capacity: "20+ kWh", usage: "Geschikt tot ca. 7.000+ kWh/jaar", power: "All-in-one" },
    ],
  },
};

function formatPostcodeDisplay(value) {
  const raw = normalizePostcode(value);
  if (raw.length === 6) return `${raw.slice(0, 4)} ${raw.slice(4)}`;
  return raw;
}

const ATTRIBUTION_STORAGE_KEY = "bc_lead_attribution";
const META_PIXEL_ID = "1648367720142834";

function readUrlParam(params, ...keys) {
  for (const key of keys) {
    const value = params.get(key);
    if (value?.trim()) return value.trim();
  }
  return "";
}

function getStoredAttribution() {
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function storeAttribution(patch) {
  try {
    const current = getStoredAttribution();
    const next = { ...current };
    for (const [key, value] of Object.entries(patch)) {
      if (typeof value === "string" && value.trim()) next[key] = value.trim();
    }
    if (Object.keys(next).length > 0) {
      sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(next));
    }
    return next;
  } catch {
    return patch;
  }
}

function captureAttributionFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const fbclid = readUrlParam(params, "fbclid");
    const patch = {
      utm_source: readUrlParam(params, "utm_source"),
      utm_medium: readUrlParam(params, "utm_medium"),
      utm_campaign: readUrlParam(params, "utm_campaign"),
      utm_content: readUrlParam(params, "utm_content"),
      utm_term: readUrlParam(params, "utm_term"),
      campaign_name: readUrlParam(
        params,
        "campaign_name",
        "Campaign_name",
        "campaign"
      ),
      ad_name: readUrlParam(params, "ad_name", "Ad_name", "ad"),
      lander: readUrlParam(params, "lander", "Lander"),
      fbclid,
    };

    if (fbclid) {
      const existingFbc = getCookie("_fbc");
      const fbc =
        existingFbc && existingFbc.includes(fbclid)
          ? existingFbc
          : `fb.1.${Date.now()}.${fbclid}`;
      setCookie("_fbc", fbc, 90);
      patch.fbc = fbc;
    }

    return storeAttribution(patch);
  } catch {
    return getStoredAttribution();
  }
}

function getCookie(name) {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : "";
  } catch {
    return "";
  }
}

function cookieDomainSuffix() {
  try {
    const host = window.location.hostname;
    if (host === "batterijconcept.nl" || host.endsWith(".batterijconcept.nl")) {
      return "; domain=.batterijconcept.nl";
    }
  } catch {
    /* ignore */
  }
  return "";
}

function setCookie(name, value, days = 90) {
  try {
    const maxAge = Math.floor(days * 24 * 60 * 60);
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${cookieDomainSuffix()}`;
  } catch {
    /* ignore */
  }
}

function newEventId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `bc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Meta browser id — required for Ads Manager attribution when Pixel is present. */
function ensureFbp() {
  const existing = getCookie("_fbp");
  if (existing) return existing;
  const fbp = `fb.1.${Date.now()}.${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  setCookie("_fbp", fbp, 90);
  return fbp;
}

function initMetaPixel() {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") return;

  const f = window;
  const b = document;
  const e = "script";
  const v = "https://connect.facebook.net/en_US/fbevents.js";
  let n = f.fbq = function (...args) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const t = b.createElement(e);
  t.async = true;
  t.src = v;
  const s = b.getElementsByTagName(e)[0];
  s?.parentNode?.insertBefore(t, s);

  ensureFbp();
  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
}

/** Browser Lead with same eventID as CAPI (dedup). */
function trackBrowserLead(eventId, customData = {}) {
  initMetaPixel();
  if (typeof window.fbq !== "function" || !eventId) return;
  window.fbq("track", "Lead", customData, { eventID: String(eventId) });
}

/** Meta CAPI / Pixel matching: fbc (click id), fbp (browser id) */
function getMetaTracking() {
  initMetaPixel();
  captureAttributionFromUrl();
  const stored = getStoredAttribution();
  const fbc = getCookie("_fbc") || stored.fbc || "";
  const fbp = ensureFbp() || getCookie("_fbp") || stored.fbp || "";
  return {
    fbc: fbc || undefined,
    fbp: fbp || undefined,
    fbclid: stored.fbclid || undefined,
    event_source_url: window.location.href,
    client_user_agent: navigator.userAgent,
    event_id: newEventId(),
  };
}

function getLeadAttribution(defaultSource = "website") {
  const stored = captureAttributionFromUrl();
  const attribution = { ...stored };
  if (!attribution.utm_source) attribution.utm_source = defaultSource;
  return Object.fromEntries(
    Object.entries(attribution).filter(([, value]) => Boolean(value))
  );
}

function getUtmSource(fallback = "website") {
  return getLeadAttribution(fallback).utm_source || fallback;
}

async function submitLead(payload) {
  const meta = getMetaTracking();
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...getLeadAttribution(),
      ...meta,
      ...payload,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Lead versturen mislukt.");
  }
  trackBrowserLead(meta.event_id, {
    content_name: payload.utm_source || payload.bron || "website-lead",
    currency: "EUR",
    value: 0,
  });
  return data;
}

async function submitSollicitatie(form, vacature) {
  const fd = new FormData(form);
  const cv = fd.get("cv");
  const cvNaam = cv instanceof File && cv.size > 0 ? cv.name : "";
  const rijbewijs = fd.get("rijbewijs") ? "Ja" : "Nee";
  const meta = getMetaTracking();

  const payload = {
    naam: String(fd.get("naam") || "").trim(),
    email: String(fd.get("email") || "").trim(),
    telefoon: String(fd.get("telefoon") || "").trim(),
    woonplaats: String(fd.get("woonplaats") || "").trim(),
    ervaring: String(fd.get("ervaring") || "").trim(),
    functie: vacature,
    vacature,
    notitie: [
      `Functie: ${vacature}`,
      `Woonplaats: ${String(fd.get("woonplaats") || "").trim()}`,
      `Jaren ervaring: ${String(fd.get("ervaring") || "").trim()}`,
      `Rijbewijs: ${rijbewijs}`,
      cvNaam ? `CV: ${cvNaam}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    bron: "werkenbij-formulier",
    cv: cvNaam || undefined,
    ...meta,
  };

  const res = await fetch("/api/sollicitaties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Sollicitatie versturen mislukt.");
  }
  trackBrowserLead(meta.event_id, {
    content_name: vacature || "sollicitatie",
    currency: "EUR",
    value: 0,
  });
  return data;
}

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function normalizePostcode(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/\s+/g, "");
}

function buildHouseNumber(huisnr, toev) {
  const number = String(huisnr || "").trim();
  const addition = String(toev || "").trim();
  if (!addition) return number;
  // API accepteert o.a. 10A → 10-A en ranges zoals 16-18
  if (addition.startsWith("-")) return `${number}${addition}`;
  return `${number}${addition}`;
}

function formatAddressLine(address) {
  const street = address.street || "";
  const house = address.house_number || address.houseNumber || "";
  return `${street} ${house}`.trim();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initNav() {
  const toggle = qs(".menu-toggle");
  const links = qs(".nav-links");
  const advies = qs(".nav-item.advies");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", links.classList.contains("open"));
    });
  }

  if (advies) {
    const trigger = qs(".nav-trigger", advies);
    trigger?.addEventListener("click", (e) => {
      if (window.matchMedia("(max-width: 920px)").matches) {
        e.preventDefault();
        advies.classList.toggle("open");
      }
    });
  }

  document.addEventListener("click", (e) => {
    if (advies && !advies.contains(e.target)) advies.classList.remove("open");
  });
}

function showToast(message) {
  let toast = qs(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 3200);
}

function ensureScanModal() {
  let modal = qs("#scan-modal");
  if (modal) {
    // Upgrade older modal markup after deploys/HMR
    if (!qs(".scan-result-grid", modal)) {
      modal.remove();
      modal = null;
    } else {
      return modal;
    }
  }

  modal = document.createElement("div");
  modal.id = "scan-modal";
  modal.className = "modal scan-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="modal-panel scan-modal-panel">
      <button class="modal-close" type="button" data-scan-close aria-label="Sluiten">×</button>
      <div data-scan-view="loading" class="scan-view">
        <h2 data-scan-title>Situatie bekijken…</h2>
        <div class="scan-loader" aria-hidden="true"></div>
        <p class="scan-loading-text">Adresgegevens ophalen…</p>
      </div>
      <div data-scan-view="result" class="scan-view scan-view-result" hidden>
        <div class="scan-result-grid">
          <div class="scan-result-copy">
            <h2 data-scan-result-heading>Situatie bekijken</h2>
            <p class="scan-success-label">Goed nieuws!</p>
            <p class="scan-result-lead">Het lijkt erop dat:</p>
            <p class="scan-address" data-scan-address></p>
            <p class="scan-city" data-scan-city></p>
            <p class="scan-subsidy" data-scan-subsidy></p>
            <p class="scan-followup">Laat je gegevens achter — een adviseur neemt zo snel mogelijk contact met je op voor vrijblijvend advies.</p>
          </div>
          <div class="scan-result-form">
            <p class="scan-contact-intro">Jouw contactgegevens</p>
            <form class="scan-contact-form" data-scan-contact>
              <div class="field">
                <label for="scan-naam">Naam*</label>
                <input id="scan-naam" name="naam" placeholder="Voor- en achternaam" required autocomplete="name" />
              </div>
              <div class="field">
                <label for="scan-email">E-mail*</label>
                <input id="scan-email" name="email" type="email" placeholder="naam@email.nl" required autocomplete="email" />
              </div>
              <div class="field">
                <label for="scan-telefoon">Telefoon*</label>
                <input id="scan-telefoon" name="telefoon" type="tel" placeholder="06 12345678" required autocomplete="tel" />
              </div>
              <button class="btn btn-green" type="submit">Verstuur aanvraag</button>
            </form>
          </div>
        </div>
      </div>
      <div data-scan-view="done" class="scan-view" hidden>
        <p class="scan-success-label">Bedankt!</p>
        <p class="scan-done-text">We hebben je aanvraag ontvangen. Een adviseur neemt zo snel mogelijk contact met je op.</p>
        <button class="btn btn-green" type="button" data-scan-close>Sluiten</button>
      </div>
      <div data-scan-view="error" class="scan-view" hidden>
        <h2>Adres niet gevonden</h2>
        <p class="scan-error-text" data-scan-error></p>
        <button class="btn btn-green" type="button" data-scan-close>Sluiten</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeScanModal();
  });
  qsa("[data-scan-close]", modal).forEach((btn) => {
    btn.addEventListener("click", closeScanModal);
  });

  const contactForm = qs("[data-scan-contact]", modal);
  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = qs('button[type="submit"]', contactForm);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Versturen…";
    }

    try {
      const fd = new FormData(contactForm);
      const scan = modal._scanAddress || {};
      const address = scan.address || {};
      const huisnummer = String(scan.number || address.house_number || "").trim();
      const postcode = formatPostcodeDisplay(scan.postcode || address.postcode || address.zip_code || "");

      await submitLead({
        naam: String(fd.get("naam") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        telefoon: String(fd.get("telefoon") || "").trim(),
        postcode,
        huisnummer,
        adres: address.street || "",
        woonplaats: address.city || "",
        utm_source: getUtmSource("website"),
      });

      contactForm.reset();
      setScanView("done");
    } catch (err) {
      showToast(err.message || "Versturen mislukt. Probeer opnieuw.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Verstuur aanvraag";
      }
    }
  });

  return modal;
}

function setScanView(view) {
  const modal = ensureScanModal();
  qsa("[data-scan-view]", modal).forEach((el) => {
    el.hidden = el.getAttribute("data-scan-view") !== view;
  });
}

function openScanModal() {
  const modal = ensureScanModal();
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeScanModal() {
  const modal = qs("#scan-modal");
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

async function fetchAddress(postcode, number) {
  const params = new URLSearchParams({
    postcode: normalizePostcode(postcode),
    number: String(number).trim(),
  });

  const res = await fetch(`/api/postcode?${params}`);
  const data = await res.json().catch(() => ({}));

  if (res.ok && data.street) return data;
  throw new Error(data.error || "Kon adresgegevens niet ophalen.");
}

async function runScan(form) {
  const data = new FormData(form);
  const postcode = String(data.get("postcode") || "").trim();
  const huisnr = String(data.get("huisnr") || "").trim();
  const toev = String(data.get("toev") || "").trim();

  if (!postcode || !huisnr) {
    showToast("Vul postcode en huisnummer in.");
    return;
  }

  const number = buildHouseNumber(huisnr, toev);
  const previewLabel = `${normalizePostcode(postcode)} ${number}`;
  const modal = ensureScanModal();

  openScanModal();
  setScanView("loading");
  const title = qs("[data-scan-title]");
  if (title) title.textContent = `Situatie bekijken voor ${previewLabel}`;

  const loadingText = qs(".scan-loading-text", modal);
  if (loadingText) loadingText.textContent = "Adresgegevens ophalen en mogelijkheden checken…";

  const started = Date.now();
  const minLoadingMs = 5000;

  try {
    const address = await fetchAddress(postcode, number);
    const streetLine = formatAddressLine(address);
    const city = address.city || "";

    modal._scanAddress = { postcode: normalizePostcode(postcode), number, address };

    qs("[data-scan-address]").textContent = streetLine;
    qs("[data-scan-city]").textContent = city;
    qs("[data-scan-subsidy]").innerHTML = `${escapeHtml(city)} heeft momenteel <strong>2 gunstige overheidsregelingen</strong> die mogelijk voor jouw situatie toepasbaar zijn.`;

    const resultHeading = qs("[data-scan-result-heading]");
    if (resultHeading) resultHeading.textContent = `Situatie bekijken voor ${streetLine}`;
    if (title) title.textContent = `Situatie bekijken voor ${streetLine}`;

    const remaining = Math.max(0, minLoadingMs - (Date.now() - started));
    if (remaining > 0) {
      if (loadingText) loadingText.textContent = "Situatie analyseren…";
      await new Promise((r) => setTimeout(r, remaining));
    }

    setScanView("result");
    form.reset();
  } catch (err) {
    const remaining = Math.max(0, Math.min(1200, minLoadingMs - (Date.now() - started)));
    if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
    qs("[data-scan-error]").textContent =
      err.message || "Controleer postcode, huisnummer en eventuele toevoeging.";
    setScanView("error");
  }
}

function handleScanSubmit(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runScan(form);
  });
}

function initForms() {
  qsa("[data-scan-form]").forEach(handleScanSubmit);

  const adviesForm = qs("[data-advies-form]");
  adviesForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = qs('button[type="submit"]', adviesForm);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Versturen…";
    }

    try {
      const fd = new FormData(adviesForm);
      const postcode = formatPostcodeDisplay(fd.get("postcode"));
      const huisnummer = buildHouseNumber(fd.get("huisnr"), fd.get("toev"));

      let adres = "";
      let woonplaats = "";
      try {
        const address = await fetchAddress(postcode, huisnummer);
        adres = address.street || "";
        woonplaats = address.city || "";
      } catch {
        // optioneel
      }

      await submitLead({
        naam: String(fd.get("naam") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        telefoon: String(fd.get("telefoon") || "").trim(),
        postcode,
        huisnummer,
        adres,
        woonplaats,
        utm_source: getUtmSource("advies-aan-huis"),
      });

      showToast("Bedankt! Een adviseur plant zo snel mogelijk een gratis huisbezoek.");
      adviesForm.reset();
    } catch (err) {
      showToast(err.message || "Versturen mislukt. Probeer opnieuw.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Verstuur aanvraag";
      }
    }
  });

  const contactForm = qs("[data-contact-form]");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Bericht verzonden. We reageren op werkdagen binnen 1 werkdag.");
    contactForm.reset();
  });

  const serviceForm = qs("[data-service-form]");
  serviceForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = qs('button[type="submit"]', serviceForm);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Versturen…";
    }

    try {
      const fd = new FormData(serviceForm);
      const payload = {
        email: String(fd.get("email") || "").trim(),
        onderwerp: String(fd.get("onderwerp") || "").trim(),
        omschrijving: String(fd.get("omschrijving") || "").trim(),
      };

      const res = await fetch("/api/service-verzoeken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || "Serviceverzoek versturen mislukt.");
      }

      showToast("Serviceverzoek ontvangen. We nemen zo snel mogelijk contact op.");
      serviceForm.reset();
    } catch (err) {
      showToast(err.message || "Versturen mislukt. Probeer opnieuw.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Verstuur serviceverzoek";
      }
    }
  });

  const vriendenForm = qs("[data-vrienden-form]");
  vriendenForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = qs('button[type="submit"]', vriendenForm);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Versturen…";
    }

    try {
      const fd = new FormData(vriendenForm);
      const postcode = formatPostcodeDisplay(fd.get("postcode"));
      const huisnummer = String(fd.get("huisnr") || "").trim();
      const referrer = String(fd.get("referrer") || "").trim();

      let adres = "";
      let woonplaats = "";
      try {
        const address = await fetchAddress(postcode, huisnummer);
        adres = address.street || "";
        woonplaats = address.city || "";
      } catch {
        // Adreslookup is optioneel; lead gaat toch door
      }

      await submitLead({
        naam: String(fd.get("naam") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        telefoon: String(fd.get("telefoon") || "").trim(),
        postcode,
        huisnummer,
        adres,
        woonplaats,
        utm_source: "Referral",
        referrer,
      });

      showToast("Bedankt! Je €250-kortingsaanvraag is ontvangen. We nemen snel contact op.");
      vriendenForm.reset();
    } catch (err) {
      showToast(err.message || "Versturen mislukt. Probeer opnieuw.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Claim €250 korting";
      }
    }
  });

  qsa("[data-vacature-form]").forEach((vacatureForm) => {
    vacatureForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = qs('button[type="submit"]', vacatureForm);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Versturen…";
      }

      try {
        const vacature = String(vacatureForm.dataset.vacatureType || "Vacature").trim();
        await submitSollicitatie(vacatureForm, vacature);
        showToast("Sollicitatie verzonden. We nemen snel contact op.");
        vacatureForm.reset();
      } catch (err) {
        showToast(err.message || "Verzenden mislukt. Probeer opnieuw.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Verzenden";
        }
      }
    });
  });
}

const VACATURE_QUIZ_CONFIG = {
  sales: {
    functie: "ZZP sales verkoper",
    bron: "sales-vacature-quiz",
    qualifiedText:
      "Je komt waarschijnlijk in aanmerking om te starten met deze ZZP-functie.",
    fulltimeRejectText:
      "Bedankt voor je interesse. Voor deze rol zoeken we iemand die full-time wil groeien naar minimaal €10k per maand. Twijfel je toch? Mail gerust naar info@batterijconcept.nl.",
    buildNotitie(answers, { postcode, huisnummer, qualified }) {
      return [
        `Vraag: We verkopen thuisbatterijen. Ken je deze markt al?`,
        `Antwoord: ${answers.markt}`,
        ``,
        `Vraag: We zoeken mensen die full-time aan de slag willen, en minimaal €10k per maand willen verdienen. Ben jij dat?`,
        `Antwoord: ${answers.fulltime}`,
        ``,
        `Vraag: Hoe oud ben je?`,
        `Antwoord: ${answers.leeftijd}`,
        ``,
        `Vraag: Heb je al ervaring in de verduurzamingsmarkt?`,
        `Antwoord: ${answers.ervaring}`,
        ``,
        `Vraag: Heb je rijbewijs B?`,
        `Antwoord: ${answers.rijbewijs}`,
        ``,
        `Vraag: Heb je al een KvK?`,
        `Antwoord: ${answers.kvk}`,
        ``,
        `Postcode: ${postcode}`,
        `Huisnummer: ${huisnummer}`,
        ``,
        `Uitslag: ${qualified ? "In aanmerking" : "Geen match"}`,
      ].join("\n");
    },
  },
  appointment: {
    functie: "Appointment setter",
    bron: "appointment-vacature-quiz",
    qualifiedText:
      "Je komt waarschijnlijk in aanmerking om te starten als appointment setter.",
    fulltimeRejectText:
      "Bedankt voor je interesse. Voor deze rol zoeken we iemand die full-time op ons kantoor in Utrecht wil groeien naar minimaal €5k per maand. Twijfel je toch? Mail gerust naar info@batterijconcept.nl.",
    buildNotitie(answers, { postcode, huisnummer, qualified }) {
      return [
        `Vraag: Heb je al ervaring in de verduurzamingsmarkt?`,
        `Antwoord: ${answers.ervaring}`,
        ``,
        `Vraag: We zoeken mensen die full-time aan de slag willen op ons kantoor in Utrecht, en minimaal €5k per maand willen verdienen. Ben jij dat?`,
        `Antwoord: ${answers.fulltime}`,
        ``,
        `Vraag: Heb je al een KvK?`,
        `Antwoord: ${answers.kvk}`,
        ``,
        `Postcode: ${postcode}`,
        `Huisnummer: ${huisnummer}`,
        ``,
        `Uitslag: ${qualified ? "In aanmerking" : "Geen match"}`,
      ].join("\n");
    },
  },
};

function initSalesQuiz() {
  const root = qs("[data-sales-quiz]");
  if (!root) return;

  const quizType = root.dataset.quizType || "sales";
  const config = VACATURE_QUIZ_CONFIG[quizType] || VACATURE_QUIZ_CONFIG.sales;

  const answers = {
    markt: "",
    fulltime: "",
    leeftijd: "",
    ervaring: "",
    rijbewijs: "",
    kvk: "",
  };

  let step = 1;
  const progress = qs("[data-quiz-progress]", root);
  const form = qs("[data-quiz-form]", root);

  function updateProgress() {
    qsa("[data-dot]", root).forEach((dot) => {
      const n = Number(dot.dataset.dot);
      dot.classList.toggle("is-done", n < step);
      dot.classList.toggle("is-current", n === step);
    });
  }

  function showStep(next) {
    step = next;
    qsa("[data-quiz-step]", root).forEach((el) => {
      const id = el.dataset.quizStep;
      const active = String(id) === String(next);
      el.hidden = !active;
      el.classList.toggle("is-active", active);
    });
    if (progress) {
      progress.setAttribute(
        "aria-hidden",
        step === 1 && !root.classList.contains("is-fullscreen") ? "true" : "false"
      );
    }
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function enterFullscreen() {
    root.classList.add("is-fullscreen");
  }

  function showResult(qualified, reason = "fulltime") {
    const icon = qs("[data-result-icon]", root);
    const title = qs("[data-result-title]", root);
    const text = qs("[data-result-text]", root);
    const qualifiedBox = qs("[data-result-qualified]", root);
    const noActions = qs("[data-result-no]", root);

    if (icon) {
      icon.classList.toggle("is-no", !qualified);
      icon.textContent = qualified ? "✓" : "–";
    }
    if (title) {
      if (qualified) {
        title.textContent = "Gefeliciteerd!";
      } else if (reason === "kvk") {
        title.textContent = "Helaas";
      } else {
        title.textContent = "Op dit moment niet de beste match";
      }
    }
    if (text) {
      if (qualified) {
        text.textContent = config.qualifiedText;
      } else if (reason === "kvk") {
        text.textContent =
          "Helaas lijkt het alsof je niet geschikt bent, omdat u nog geen KvK hebt.";
      } else {
        text.textContent = config.fulltimeRejectText;
      }
    }
    if (qualifiedBox) qualifiedBox.hidden = !qualified;
    if (noActions) noActions.hidden = qualified || reason === "kvk";
    showStep("result");
  }

  function handleAnswer(stepId, value) {
    if (quizType === "appointment") {
      if (stepId === 1) {
        answers.ervaring = value;
        enterFullscreen();
        showStep(2);
        return;
      }
      if (stepId === 2) {
        answers.fulltime = value;
        showStep(3);
        return;
      }
      if (stepId === 3) {
        answers.kvk = value;
        if (value === "Nee") {
          showResult(false, "kvk");
          return;
        }
        showStep(4);
      }
      return;
    }

    if (stepId === 1) {
      answers.markt = value;
      enterFullscreen();
      showStep(2);
      return;
    }
    if (stepId === 2) {
      answers.fulltime = value;
      showStep(3);
      return;
    }
    if (stepId === 4) {
      answers.ervaring = value;
      showStep(5);
      return;
    }
    if (stepId === 5) {
      answers.rijbewijs = value;
      showStep(6);
      return;
    }
    if (stepId === 6) {
      answers.kvk = value;
      if (value === "Nee") {
        showResult(false, "kvk");
        return;
      }
      showStep(7);
    }
  }

  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-answer]");
    if (!btn || !root.contains(btn)) return;

    const activeStep = qs(".sales-quiz-step.is-active", root);
    const stepId = Number(activeStep?.dataset.quizStep);
    const value = btn.dataset.answer || "";
    handleAnswer(stepId, value);
  });

  const continueBtn = qs("[data-continue]", root);
  const ageInput = qs("#quiz-leeftijd", root);
  continueBtn?.addEventListener("click", () => {
    const age = String(ageInput?.value || "").trim();
    if (!age || Number(age) < 16 || Number(age) > 99) {
      ageInput?.focus();
      showToast("Vul een geldige leeftijd in.");
      return;
    }
    answers.leeftijd = age;
    showStep(4);
  });

  ageInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      continueBtn?.click();
    }
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const voornaam = String(fd.get("voornaam") || "").trim();
    const achternaam = String(fd.get("achternaam") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const telefoon = String(fd.get("telefoon") || "").trim();
    const postcode = formatPostcodeDisplay(fd.get("postcode"));
    const huisnummer = String(fd.get("huisnr") || "").trim();

    if (!voornaam || !achternaam || !email || !telefoon || !postcode || !huisnummer) {
      showToast("Vul alle velden in.");
      return;
    }

    const submitBtn = qs('button[type="submit"]', form);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Even geduld…";
    }

    const qualified = answers.fulltime === "Ja" && answers.kvk === "Ja";
    const naam = `${voornaam} ${achternaam}`.trim();
    const functie = config.functie;
    const notitie = config.buildNotitie(answers, { postcode, huisnummer, qualified });

    try {
      const meta = getMetaTracking();
      const res = await fetch("/api/sollicitaties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          naam,
          email,
          telefoon,
          postcode,
          huisnummer,
          functie,
          vacature: functie,
          notitie,
          bron: config.bron,
          ...meta,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || "Versturen mislukt.");
      }
      trackBrowserLead(meta.event_id, {
        content_name: functie,
        currency: "EUR",
        value: 0,
      });
      showResult(qualified);
    } catch (err) {
      showToast(err.message || "Versturen mislukt. Probeer opnieuw.");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Bekijk uitslag <span aria-hidden="true">→</span>';
      }
    }
  });

  updateProgress();
}

const PROVINCIES = [
  "Drenthe",
  "Flevoland",
  "Friesland",
  "Gelderland",
  "Groningen",
  "Limburg",
  "Noord-Brabant",
  "Noord-Holland",
  "Overijssel",
  "Utrecht",
  "Zeeland",
  "Zuid-Holland",
];

const VACATURE_CONTENT = {
  adviseur: {
    typeLabel: "Adviseur Nederland",
    tag: "Vacature",
    afdeling: "Sales & advies · buitendienst",
    uren: "Fulltime · ZZP",
    salaris: "Verdiensten tot €10.000 per maand",
    niveau: "Mbo+/Hbo · commercieel",
    contract: "ZZP-overeenkomst",
    deadline: "Solliciteer voor 31 december 2026",
    snipper:
      "Als Adviseur Nederland help je huiseigenaren verduurzamen met thuisbatterijen. Warme afspraken, een sterk product en hoge upside.",
    body: `
      <p>Bij Batterijconcept verkoop en adviseer je een sterk en duurzaam product in een markt die hard groeit. Je werkt in de buitendienst, spreekt dagelijks met huiseigenaren die serieus willen verduurzamen en helpt hen bij een keuze die echt impact maakt op hun energierekening en toekomst.</p>
      <p>Voor professionals met discipline en commerciële drive ligt er een aantrekkelijk verdienmodel klaar. Door de combinatie van kwalitatieve aanvragen, een goed product en een helder proces kun je met sterke prestaties doorgroeien naar inkomsten rond <strong>€10.000 per maand</strong>.</p>
      <ul class="checklist">
        <li>Buitendienst met veel vrijheid</li>
        <li>Commissiegedreven beloning met hoge upside</li>
        <li>Warme afspraken</li>
        <li>Product met echte vraag in de markt</li>
        <li>Direct impact op verduurzaming in Nederland</li>
      </ul>
    `,
    checkUrl: "/sales-vacature",
    checkLabel: "Check in 1 minuut of je in aanmerking komt →",
    ervaringLabel: "Jaar ervaring in sales*",
  },
  appointment: {
    typeLabel: "Appointment setter",
    tag: "Vacature",
    afdeling: "Sales support · kantoor Utrecht",
    uren: "Fulltime · ZZP",
    salaris: "Verdiensten tot €5.000 per maand",
    niveau: "Mbo+/Hbo · commercieel",
    contract: "ZZP-overeenkomst",
    deadline: "Solliciteer voor 31 december 2026",
    snipper:
      "Full-time op ons kantoor in Utrecht. Jij plant sterke afspraken voor onze adviseurs, met een verdienmodel tot €5.000 per maand.",
    body: `
      <p>Als appointment setter zorg jij dat onze adviseurs elke dag sterke afspraken in de agenda hebben. Je belt en plant vanuit ons kantoor in Utrecht met huiseigenaren die serieus willen verduurzamen. Je werkt full-time, met heldere targets en een sterk product waar je trots op kunt zijn.</p>
      <p>Voor gedreven professionals met commercieel instinct ligt er een aantrekkelijk verdienmodel klaar. Met focus, discipline en een goed proces kun je doorgroeien naar inkomsten rond <strong>€5.000 per maand</strong>.</p>
      <ul class="checklist">
        <li>Full-time op ons kantoor in Utrecht</li>
        <li>Verdienmodel tot €5.000 per maand</li>
        <li>Warme leads en een sterk product</li>
        <li>Direct impact op verduurzaming in Nederland</li>
      </ul>
    `,
    checkUrl: "/appointment-vacature",
    checkLabel: "Check in 1 minuut of je in aanmerking komt →",
    ervaringLabel: "Jaar ervaring in sales*",
  },
  monteur: {
    typeLabel: "Monteur",
    tag: "Vacature",
    afdeling: "Installatie · buitendienst",
    uren: "Fulltime · ZZP",
    salaris: "Vast bedrag per opdracht",
    niveau: "Mbo techniek / installatie",
    contract: "ZZP-overeenkomst",
    deadline: "Solliciteer voor 31 december 2026",
    snipper:
      "Jij maakt van advies een werkende installatie. ZZP met een vast bedrag per opdracht en moderne systemen.",
    body: `
      <p>Als monteur ben jij degene die van advies een werkende installatie maakt. Je zorgt dat thuisbatterij-systemen netjes, veilig en volgens planning worden geplaatst. Je werkt met moderne producten, duidelijke installatiestandaarden en klanten die bewust kiezen voor verduurzaming.</p>
      <p>In deze rol werk je als <strong>ZZP’er</strong> met een <strong>vast bedrag per opdracht</strong>, zodat je precies weet waar je aan toe bent. Wie verantwoordelijkheid pakt en constant levert, krijgt ruimte om door te groeien.</p>
      <ul class="checklist">
        <li>ZZP met vast bedrag per opdracht</li>
        <li>Werk aan toekomstbestendige energiesystemen</li>
        <li>Duidelijke planning en ondersteuning vanuit kantoor</li>
        <li>Veel doorgroeimogelijkheden in een snelgroeiend team</li>
      </ul>
    `,
    checkUrl: null,
    checkLabel: null,
    ervaringLabel: "Jaar ervaring als monteur*",
  },
};

function slugifyProvincie(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildVacatures() {
  const posted = "15 oktober 2026";
  const adviseurs = PROVINCIES.map((provincie) => {
    const content = VACATURE_CONTENT.adviseur;
    return {
      id: `adviseur-${slugifyProvincie(provincie)}`,
      type: "adviseur",
      titel: `Adviseur Nederland - ${provincie}`,
      provincie,
      locatie: provincie,
      posted,
      ...content,
    };
  });

  const appointment = {
    id: "appointment-utrecht",
    type: "appointment",
    titel: "Appointment setter - kantoor Utrecht",
    provincie: "Utrecht",
    locatie: "Utrecht (kantoor)",
    posted,
    ...VACATURE_CONTENT.appointment,
  };

  const monteurs = PROVINCIES.map((provincie) => {
    const content = VACATURE_CONTENT.monteur;
    return {
      id: `monteur-${slugifyProvincie(provincie)}`,
      type: "monteur",
      titel: `Monteur - ${provincie}`,
      provincie,
      locatie: provincie,
      posted,
      ...content,
    };
  });

  return [...adviseurs, appointment, ...monteurs];
}

const ALL_VACATURES = buildVacatures();

function vacatureCardHtml(job) {
  return `
    <article class="vacature-card">
      <div class="vacature-card-top">
        <span class="vacature-card-tag">${escapeHtml(job.tag)}</span>
        <span class="vacature-card-date">Plaatsingsdatum: ${escapeHtml(job.posted)}</span>
      </div>
      <h2 class="vacature-card-title">
        <a href="/vacatures?id=${encodeURIComponent(job.id)}">${escapeHtml(job.titel)}</a>
      </h2>
      <p class="vacature-card-afdeling">${escapeHtml(job.afdeling)}</p>
      <ul class="vacature-card-meta">
        <li><span class="vacature-meta-label">Locatie</span>${escapeHtml(job.locatie)}</li>
        <li><span class="vacature-meta-label">Uren</span>${escapeHtml(job.uren)}</li>
        <li><span class="vacature-meta-label">Beloning</span>${escapeHtml(job.salaris)}</li>
        <li><span class="vacature-meta-label">Niveau</span>${escapeHtml(job.niveau)}</li>
        <li><span class="vacature-meta-label">Deadline</span>${escapeHtml(job.deadline)}</li>
        <li><span class="vacature-meta-label">Contract</span>${escapeHtml(job.contract)}</li>
      </ul>
      <p class="vacature-card-snipper">${escapeHtml(job.snipper)}</p>
      <div class="vacature-card-footer">
        <a class="vacature-card-link" href="/vacatures?id=${encodeURIComponent(job.id)}">Bekijk vacature →</a>
      </div>
    </article>
  `;
}

function vacatureDetailHtml(job) {
  const formId = `apply-${job.id}`;
  const checkBlock = job.checkUrl
    ? `<p class="vacature-detail-check"><a class="btn btn-green" href="${escapeHtml(job.checkUrl)}">${escapeHtml(job.checkLabel)}</a></p>`
    : "";

  return `
    <div class="vacature-card-top">
      <span class="vacature-card-tag">${escapeHtml(job.tag)}</span>
      <span class="vacature-card-date">Plaatsingsdatum: ${escapeHtml(job.posted)}</span>
    </div>
    <h1 class="vacature-detail-title">${escapeHtml(job.titel)}</h1>
    <p class="vacature-card-afdeling">${escapeHtml(job.afdeling)}</p>
    <ul class="vacature-card-meta">
      <li><span class="vacature-meta-label">Locatie</span>${escapeHtml(job.locatie)}</li>
      <li><span class="vacature-meta-label">Uren</span>${escapeHtml(job.uren)}</li>
      <li><span class="vacature-meta-label">Beloning</span>${escapeHtml(job.salaris)}</li>
      <li><span class="vacature-meta-label">Niveau</span>${escapeHtml(job.niveau)}</li>
      <li><span class="vacature-meta-label">Deadline</span>${escapeHtml(job.deadline)}</li>
      <li><span class="vacature-meta-label">Contract</span>${escapeHtml(job.contract)}</li>
    </ul>
    <div class="vacature-detail-body">${job.body}</div>
    ${checkBlock}
    <div class="form-panel vacature-form-panel">
      <h2>Solliciteer in 1 minuut</h2>
      <form class="form-grid" data-vacature-form data-vacature-type="${escapeHtml(job.titel)}">
        <div class="field">
          <label for="${formId}-cv">CV upload (optioneel)</label>
          <input id="${formId}-cv" name="cv" type="file" />
        </div>
        <div class="form-row cols-2">
          <div class="field">
            <label for="${formId}-naam">Naam*</label>
            <input id="${formId}-naam" name="naam" required />
          </div>
          <div class="field">
            <label for="${formId}-woonplaats">Woonplaats*</label>
            <input id="${formId}-woonplaats" name="woonplaats" required />
          </div>
        </div>
        <div class="form-row cols-2">
          <div class="field">
            <label for="${formId}-ervaring">${escapeHtml(job.ervaringLabel)}</label>
            <input id="${formId}-ervaring" name="ervaring" type="number" min="0" placeholder="Bijv. 3" required />
          </div>
          <div class="field">
            <label for="${formId}-telefoon">Telefoon*</label>
            <input id="${formId}-telefoon" name="telefoon" type="tel" required />
          </div>
        </div>
        <div class="field">
          <label for="${formId}-email">Email*</label>
          <input id="${formId}-email" name="email" type="email" required />
        </div>
        <label class="field-checkbox">
          <input id="${formId}-rijbewijs" name="rijbewijs" type="checkbox" value="ja" />
          <span>Ik heb een rijbewijs</span>
        </label>
        <button class="btn btn-green btn-wide" type="submit">Verzenden</button>
      </form>
    </div>
  `;
}

function initVacatureBoard() {
  const resultsEl = qs("#vacature-results");
  if (!resultsEl) return;

  const listView = qs("#vacature-list-view");
  const listHero = qs("#vacature-list-hero");
  const detailView = qs("#vacature-detail-view");
  const detailEl = qs("#vacature-detail");
  const countEl = qs("#vacature-count");
  const roleNav = qs("#vacature-role-nav");
  const backLink = qs("#vacature-back");

  let activeType = new URLSearchParams(window.location.search).get("type") || "";

  function countsByType() {
    return {
      all: ALL_VACATURES.length,
      adviseur: ALL_VACATURES.filter((j) => j.type === "adviseur").length,
      appointment: ALL_VACATURES.filter((j) => j.type === "appointment").length,
      monteur: ALL_VACATURES.filter((j) => j.type === "monteur").length,
    };
  }

  function syncRoleNav() {
    const counts = countsByType();
    const allEl = qs("[data-count-all]");
    const adviseurEl = qs("[data-count-adviseur]");
    const appointmentEl = qs("[data-count-appointment]");
    const monteurEl = qs("[data-count-monteur]");
    if (allEl) allEl.textContent = String(counts.all);
    if (adviseurEl) adviseurEl.textContent = String(counts.adviseur);
    if (appointmentEl) appointmentEl.textContent = String(counts.appointment);
    if (monteurEl) monteurEl.textContent = String(counts.monteur);

    qsa("[data-role-filter]", roleNav).forEach((link) => {
      const filter = link.getAttribute("data-role-filter") || "";
      link.classList.toggle("is-active", filter === activeType);
    });
  }

  function filteredVacatures() {
    return ALL_VACATURES.filter((job) => !activeType || job.type === activeType).sort((a, b) =>
      a.titel.localeCompare(b.titel, "nl")
    );
  }

  function setUrl() {
    const next = new URLSearchParams();
    if (activeType) next.set("type", activeType);
    const qsString = next.toString();
    window.history.replaceState({}, "", qsString ? `/vacatures?${qsString}` : "/vacatures");
  }

  function showList() {
    if (listView) listView.hidden = false;
    if (listHero) listHero.hidden = false;
    if (detailView) detailView.hidden = true;
    document.title = "Vacatures | Werken bij Batterijconcept";
    syncRoleNav();

    const list = filteredVacatures();
    if (countEl) {
      countEl.textContent =
        list.length === 1 ? "1 vacature" : `${list.length} vacatures`;
    }
    resultsEl.innerHTML = list.length
      ? list.map(vacatureCardHtml).join("")
      : `<p class="vacature-empty">Geen vacatures gevonden.</p>`;
  }

  function bindDetailForm() {
    const detailForm = qs("[data-vacature-form]", detailEl);
    if (!detailForm || detailForm.dataset.bound === "1") return;
    detailForm.dataset.bound = "1";
    detailForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = qs('button[type="submit"]', detailForm);
      const original = submitBtn?.textContent;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Verzenden…";
      }
      try {
        const vacature = String(detailForm.dataset.vacatureType || "Vacature").trim();
        await submitSollicitatie(detailForm, vacature);
        detailForm.reset();
        alert("Bedankt! We hebben je sollicitatie ontvangen.");
      } catch (err) {
        alert(err.message || "Er ging iets mis. Probeer het opnieuw.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = original || "Verzenden";
        }
      }
    });
  }

  function showDetail(id) {
    const job = ALL_VACATURES.find((item) => item.id === id);
    if (!job || !detailEl) {
      showList();
      return;
    }
    if (listView) listView.hidden = true;
    if (listHero) listHero.hidden = true;
    if (detailView) detailView.hidden = false;
    detailEl.innerHTML = vacatureDetailHtml(job);
    document.title = `${job.titel} | Werken bij Batterijconcept`;
    bindDetailForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const params = new URLSearchParams(window.location.search);
  const detailId = params.get("id");
  if (detailId) {
    showDetail(detailId);
  } else {
    showList();
  }

  roleNav?.addEventListener("click", (e) => {
    const link = e.target.closest("[data-role-filter]");
    if (!link) return;
    e.preventDefault();
    activeType = link.getAttribute("data-role-filter") || "";
    setUrl();
    showList();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  backLink?.addEventListener("click", (e) => {
    e.preventDefault();
    setUrl();
    showList();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initProductModal() {
  const modal = qs("#product-modal");
  if (!modal) return;

  const mediaWrap = qs("[data-modal-media]", modal);
  const title = qs("[data-modal-title]", modal);
  const intro = qs("[data-modal-intro]", modal);
  const tableBody = qs("[data-modal-sizes]", modal);
  const closeBtn = qs("[data-modal-close]", modal);

  function open(id) {
    const product = PRODUCTS[id];
    if (!product) return;

    if (mediaWrap) {
      if (product.image) {
        mediaWrap.innerHTML = `<img src="${product.image}" alt="${product.name}" />`;
      } else {
        const visual = product.visual || "default";
        const brand = product.name.split(" ")[0];
        const rest = product.name.slice(brand.length).trim();
        mediaWrap.innerHTML = `
          <div class="product-visual product-visual--${visual} product-visual--modal" aria-hidden="true">
            <span class="product-visual-brand">${brand}</span>
            <span class="product-visual-name">${rest}</span>
          </div>`;
      }
    }

    title.textContent = product.name;
    intro.textContent = product.intro;
    tableBody.innerHTML = product.sizes
      .map(
        (s) => `
      <tr>
        <td>${s.model}</td>
        <td>${s.capacity}</td>
        <td>${s.power}</td>
        <td>${s.usage}</td>
      </tr>`
      )
      .join("");
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  qsa("[data-product]").forEach((btn) => {
    btn.addEventListener("click", () => open(btn.dataset.product));
  });

  closeBtn?.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}

function initWhatsAppButton() {
  if (qs(".whatsapp-fab")) return;
  if (document.body.classList.contains("sales-quiz-body")) return;

  const message = encodeURIComponent(
    "Hoi Batterijconcept, ik heb interesse in een vacature en wil graag mijn motivatie delen: "
  );
  const link = document.createElement("a");
  link.className = "whatsapp-fab";
  link.href = `https://wa.me/31858001645?text=${message}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", "WhatsApp Batterijconcept: 085 800 1645 — stuur je motivatie");
  link.innerHTML = `
    <svg viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
      <path d="M19.11 17.34c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.28-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.1-.18.05-.35-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.35-.25.28-.96.94-.96 2.28s.98 2.64 1.12 2.82c.14.18 1.93 2.95 4.68 4.14 1.74.75 2.36.82 3.21.69.5-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32z"/>
      <path d="M16.02 3C9.39 3 4 8.38 4 15c0 2.22.61 4.29 1.67 6.07L4 29l8.12-1.64A11.9 11.9 0 0 0 16.02 27C22.65 27 28 21.62 28 15S22.65 3 16.02 3zm0 21.82c-1.95 0-3.76-.56-5.3-1.53l-.38-.24-4.82.97 1.02-4.7-.25-.4A9.78 9.78 0 0 1 6.2 15c0-5.42 4.42-9.82 9.82-9.82s9.82 4.4 9.82 9.82-4.4 9.82-9.82 9.82z"/>
    </svg>
    <span>App je motivatie</span>
  `;
  document.body.appendChild(link);
}

document.addEventListener("DOMContentLoaded", () => {
  initMetaPixel();
  captureAttributionFromUrl();
  ensureFbp();
  initNav();
  initForms();
  initVacatureBoard();
  initSalesQuiz();
  initProductModal();
  initWhatsAppButton();

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeScanModal();
    const productModal = qs("#product-modal");
    if (productModal?.classList.contains("open")) {
      productModal.classList.remove("open");
      document.body.style.overflow = "";
    }
  });
});
