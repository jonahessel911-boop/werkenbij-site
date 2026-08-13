const PRODUCTS = {
  "g3-t10": {
    name: "Alpha ESS Smile G3-T10",
    image: "/images/products/g3-t10.png",
    intro:
      "Krachtige 10 kW drie-fase hybride oplossing voor huishoudens met zonnepanelen en hoger verbruik. Ideaal om eigen opwek maximaal op te slaan.",
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
      "Compacte 5 kW single-phase hybride batterij voor de meeste Nederlandse woningen. Modulair uit te breiden wanneer je verbruik groeit.",
    sizes: [
      { model: "G3-S5 + 4,8 kWh", capacity: "4,8 kWh", usage: "Geschikt tot ca. 2.500 kWh/jaar", power: "5 kW" },
      { model: "G3-S5 + 9,6 kWh", capacity: "9,6 kWh", usage: "Geschikt tot ca. 4.000 kWh/jaar", power: "5 kW" },
      { model: "G3-S5 + 19,2 kWh", capacity: "19,2 kWh", usage: "Geschikt tot ca. 6.000 kWh/jaar", power: "5 kW" },
    ],
  },
  "g3-bat": {
    name: "Alpha ESS Smile G3 Batterijmodule",
    image: "/images/products/g3-bat.png",
    intro:
      "Losse batterijmodules om je bestaande Alpha ESS-systeem uit te breiden. Plug-and-play, IP65, geschikt voor binnen en buiten.",
    sizes: [
      { model: "BAT 4,8S", capacity: "4,8 kWh", usage: "Extra buffer voor avondverbruik", power: "Modulair" },
      { model: "BAT 9,6S", capacity: "9,6 kWh", usage: "Extra buffer voor warmtepomp / EV", power: "Modulair" },
    ],
  },
};

function formatPostcodeDisplay(value) {
  const raw = normalizePostcode(value);
  if (raw.length === 6) return `${raw.slice(0, 4)} ${raw.slice(4)}`;
  return raw;
}

function getUtmSource(fallback = "website") {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("utm_source") || fallback;
  } catch {
    return fallback;
  }
}

async function submitLead(payload) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Lead versturen mislukt.");
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

    await new Promise((r) => setTimeout(r, 450));
    setScanView("result");
    form.reset();
  } catch (err) {
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
}

function initProductModal() {
  const modal = qs("#product-modal");
  if (!modal) return;

  const img = qs("[data-modal-image]", modal);
  const title = qs("[data-modal-title]", modal);
  const intro = qs("[data-modal-intro]", modal);
  const tableBody = qs("[data-modal-sizes]", modal);
  const closeBtn = qs("[data-modal-close]", modal);

  function open(id) {
    const product = PRODUCTS[id];
    if (!product) return;
    img.src = product.image;
    img.alt = product.name;
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

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initForms();
  initProductModal();

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
