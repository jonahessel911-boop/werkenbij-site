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
    return storeAttribution({
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
    });
  } catch {
    return getStoredAttribution();
  }
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
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...getLeadAttribution(),
      ...payload,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Lead versturen mislukt.");
  }
  return data;
}

async function submitSollicitatie(form, vacature) {
  const fd = new FormData(form);
  const cv = fd.get("cv");
  const cvNaam = cv instanceof File && cv.size > 0 ? cv.name : "";
  const rijbewijs = fd.get("rijbewijs") ? "Ja" : "Nee";

  const payload = {
    naam: String(fd.get("naam") || "").trim(),
    email: String(fd.get("email") || "").trim(),
    telefoon: String(fd.get("telefoon") || "").trim(),
    woonplaats: String(fd.get("woonplaats") || "").trim(),
    ervaring: String(fd.get("ervaring") || "").trim(),
    vacature,
    notitie: [
      `Vacature: ${vacature}`,
      `Woonplaats: ${String(fd.get("woonplaats") || "").trim()}`,
      `Jaar ervaring in sales: ${String(fd.get("ervaring") || "").trim()}`,
      `Rijbewijs: ${rijbewijs}`,
      cvNaam ? `CV: ${cvNaam}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    bron: "werkenbij-formulier",
    cv: cvNaam || undefined,
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

function initVacatureTabs() {
  const tabs = qsa("[data-vacature-tab]");
  const panels = qsa("[data-vacature-panel]");
  if (!tabs.length || !panels.length) return;

  function activate(name) {
    tabs.forEach((tab) => {
      const active = tab.dataset.vacatureTab === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((panel) => {
      const active = panel.dataset.vacaturePanel === name;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab.dataset.vacatureTab));
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

  const link = document.createElement("a");
  link.className = "whatsapp-fab";
  link.href = "https://wa.me/31858001645";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", "WhatsApp: 085 800 1645");
  link.innerHTML = `
    <svg viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
      <path d="M19.11 17.34c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.28-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.1-.18.05-.35-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.35-.25.28-.96.94-.96 2.28s.98 2.64 1.12 2.82c.14.18 1.93 2.95 4.68 4.14 1.74.75 2.36.82 3.21.69.5-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32z"/>
      <path d="M16.02 3C9.39 3 4 8.38 4 15c0 2.22.61 4.29 1.67 6.07L4 29l8.12-1.64A11.9 11.9 0 0 0 16.02 27C22.65 27 28 21.62 28 15S22.65 3 16.02 3zm0 21.82c-1.95 0-3.76-.56-5.3-1.53l-.38-.24-4.82.97 1.02-4.7-.25-.4A9.78 9.78 0 0 1 6.2 15c0-5.42 4.42-9.82 9.82-9.82s9.82 4.4 9.82 9.82-4.4 9.82-9.82 9.82z"/>
    </svg>
    <span>WhatsApp</span>
  `;
  document.body.appendChild(link);
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initForms();
  initVacatureTabs();
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
