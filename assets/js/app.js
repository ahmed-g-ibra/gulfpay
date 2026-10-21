import { CONFIG } from "./config.js";
import {
  FX, COUNTRIES, LEVELS, ROLES, COMPANY_TYPES,
  roleByKey, countryByCode, levelByKey, referenceFor,
} from "./data.js";
import { summarise, percentileRank, rankAgainstRange, verdictFor } from "./stats.js";

const $ = (id) => document.getElementById(id);
const ALL = "__all__";

const state = {
  submissions: [],
  display: "USD",
  showCommunity: true,
  showRef: true,
  lastUpdated: null,
};

/* ------------------------------------------------------------------ *
 * Loading
 * ------------------------------------------------------------------ */

// Minimal RFC-4180 CSV parser (handles quoted fields and embedded newlines).
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(cell => cell.trim() !== ""));
}

// Google Form headers are full question sentences, so match on keywords.
const HEADER_MATCHERS = [
  ["role",        h => h.includes("role") || h.includes("job title")],
  ["level",       h => h.includes("level") || h.includes("seniority")],
  ["country",     h => h.includes("country")],
  ["city",        h => h.includes("city")],
  ["companyType", h => h.includes("company type") || h.includes("employer type") || h.includes("type of company")],
  ["years",       h => h.includes("years")],
  ["currency",    h => h.includes("currency")],
  ["base",        h => h.includes("base")],
  ["allowances",  h => h.includes("allowance")],
  ["bonus",       h => h.includes("bonus")],
  ["workMode",    h => h.includes("remote") || h.includes("onsite") || h.includes("work mode")],
  ["nationality", h => h.includes("nationality") || h.includes("passport")],
  ["submitted",   h => h.includes("timestamp") || h.includes("date")],
];

function mapHeaders(headerRow) {
  const map = {};
  headerRow.forEach((raw, i) => {
    const h = raw.toLowerCase().trim();
    for (const [field, test] of HEADER_MATCHERS) {
      if (map[field] === undefined && test(h)) { map[field] = i; break; }
    }
  });
  return map;
}

const num = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

// Match a free-text answer back to a known key.
function matchKey(value, list, keyProp, labelProp) {
  const v = String(value ?? "").trim().toLowerCase();
  if (!v) return null;
  const exact = list.find(x => String(x[keyProp]).toLowerCase() === v);
  if (exact) return exact[keyProp];
  const byLabel = list.find(x => String(x[labelProp]).toLowerCase() === v);
  if (byLabel) return byLabel[keyProp];
  const partial = list.find(x => String(x[labelProp]).toLowerCase().includes(v) || v.includes(String(x[labelProp]).toLowerCase()));
  return partial ? partial[keyProp] : null;
}

function normalise(raw) {
  const roleKey    = matchKey(raw.role, ROLES, "key", "label");
  const levelKey   = matchKey(raw.level, LEVELS, "key", "label");
  const countryKey = matchKey(raw.country, COUNTRIES, "code", "name");
  if (!roleKey || !levelKey || !countryKey) return null;

  const currency = String(raw.currency || countryByCode[countryKey].currency).toUpperCase();
  const fx = FX[currency];
  if (!fx) return null;

  const base = num(raw.base);
  if (base <= 0) return null;
  const allowances = num(raw.allowances);
  const bonusPct = num(raw.bonus);
  const monthlyLocal = base + allowances + (base * 12 * (bonusPct / 100)) / 12;
  const usd = monthlyLocal / fx.perUsd;

  // Guard against typos (annual figures pasted into a monthly field, etc.).
  if (usd < 300 || usd > 80000) return null;

  return {
    role: roleKey,
    level: levelKey,
    country: countryKey,
    city: String(raw.city || "").trim(),
    companyType: COMPANY_TYPES.find(t => t.toLowerCase() === String(raw.companyType || "").trim().toLowerCase()) || "",
    years: num(raw.years),
    workMode: String(raw.workMode || "").trim(),
    nationality: String(raw.nationality || "").trim(),
    usd,
    submitted: String(raw.submitted || "").trim(),
  };
}

async function loadSubmissions() {
  // 1. Google Sheet, if configured.
  if (CONFIG.sheetCsvUrl) {
    try {
      const url = CONFIG.sheetCsvUrl + (CONFIG.sheetCsvUrl.includes("?") ? "&" : "?") +
                  "_=" + Math.floor(Date.now() / CONFIG.cacheTtlMs);
      const res = await fetch(url);
      if (res.ok) {
        const rows = parseCsv(await res.text());
        if (rows.length > 1) {
          const map = mapHeaders(rows[0]);
          const out = [];
          for (const r of rows.slice(1)) {
            const raw = {};
            for (const [field, idx] of Object.entries(map)) raw[field] = r[idx];
            const rec = normalise(raw);
            if (rec) out.push(rec);
          }
          return out;
        }
      }
    } catch (err) {
      console.warn("Sheet fetch failed, falling back to bundled data.", err);
    }
  }
  // 2. Bundled JSON.
  try {
    const res = await fetch("data/submissions.json");
    if (!res.ok) return [];
    const json = await res.json();
    return (json.submissions || []).map(normalise).filter(Boolean);
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ *
 * Formatting
 * ------------------------------------------------------------------ */

function toDisplay(usd) {
  if (state.display === "USD") return usd;
  return usd * FX[state.display].perUsd;
}

function fmt(usd, { compact = false } = {}) {
  const opts = compact
    ? { notation: "compact", maximumFractionDigits: 1 }
    : { maximumFractionDigits: 0 };
  return new Intl.NumberFormat("en-US", opts).format(toDisplay(usd)) + " " + state.display;
}

// A range shares one currency suffix, and both ends use the same notation.
function fmtRange(aUsd, bUsd) {
  const nf = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
  return nf.format(toDisplay(aUsd)) + " – " + nf.format(toDisplay(bUsd)) + " " + state.display;
}

/* ------------------------------------------------------------------ *
 * Cohorts — the unit shown in the table and charts
 * ------------------------------------------------------------------ */

function buildRows(filters) {
  const rows = [];
  const subs = state.submissions.filter(s =>
    (filters.country === ALL || s.country === filters.country) &&
    (filters.role    === ALL || s.role === filters.role) &&
    (filters.level   === ALL || s.level === filters.level) &&
    (filters.company === ALL || s.companyType === filters.company)
  );

  // Community cohorts: role x level x country, aggregated.
  const groups = new Map();
  for (const s of subs) {
    const key = `${s.role}|${s.level}|${s.country}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s.usd);
  }

  const covered = new Set();
  for (const [key, values] of groups) {
    if (values.length < CONFIG.minCohortSize) continue;
    const [role, level, country] = key.split("|");
    const st = summarise(values);
    covered.add(key);
    rows.push({
      source: "community", role, level, country,
      company: filters.company === ALL ? "All types" : filters.company,
      median: st.median, p25: st.p25, p75: st.p75, n: st.n,
    });
  }

  // Indicative rows fill the gaps — but only when no company filter is on,
  // since the reference data has no company-type dimension.
  if (filters.company === ALL) {
    const roles = filters.role === ALL ? ROLES.map(r => r.key) : [filters.role];
    const levels = filters.level === ALL ? LEVELS.map(l => l.key) : [filters.level];
    const countries = filters.country === ALL ? COUNTRIES.map(c => c.code) : [filters.country];
    for (const role of roles) for (const level of levels) for (const country of countries) {
      const key = `${role}|${level}|${country}`;
      if (covered.has(key)) continue;
      const ref = referenceFor(role, level, country);
      if (!ref) continue;
      rows.push({
        source: "reference", role, level, country, company: "—",
        median: ref.median, p25: ref.p25, p75: ref.p75,
        n: groups.get(key)?.length || 0,
      });
    }
  }

  const levelOrder = Object.fromEntries(LEVELS.map((l, i) => [l.key, i]));
  rows.sort((a, b) =>
    roleByKey[a.role].label.localeCompare(roleByKey[b.role].label) ||
    levelOrder[a.level] - levelOrder[b.level] ||
    a.country.localeCompare(b.country)
  );
  return rows.filter(r =>
    (r.source === "community" && state.showCommunity) ||
    (r.source === "reference" && state.showRef)
  );
}

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */

function renderTiles(rows) {
  const communityRows = rows.filter(r => r.source === "community");
  const medians = rows.map(r => r.median).sort((a, b) => a - b);
  const st = summarise(medians);
  const totalSubs = state.submissions.length;

  const tiles = [
    { label: "Cohorts shown", value: String(rows.length), sub: `${communityRows.length} from real data` },
    { label: "Median of shown", value: st ? fmt(st.median, { compact: true }) : "—", sub: "monthly total package" },
    { label: "Range", value: st ? fmtRange(st.min, st.max) : "—", sub: "lowest to highest cohort" },
    { label: "Submissions", value: String(totalSubs), sub: totalSubs ? "and counting" : "be the first" },
  ];
  $("tiles").innerHTML = tiles.map(t => `
    <div class="tile"><span>${t.label}</span><b>${t.value}</b><small>${t.sub}</small></div>`).join("");
}

function renderTable(rows) {
  const tbody = $("tbody");
  $("emptyState").hidden = rows.length > 0;
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${roleByKey[r.role].label}</td>
      <td>${levelByKey[r.level].label}</td>
      <td>${countryByCode[r.country].name}</td>
      <td class="muted">${r.company}</td>
      <td class="num"><b>${fmt(r.median)}</b></td>
      <td class="num muted">${fmt(r.p25)} – ${fmt(r.p75)}</td>
      <td>${r.source === "community"
            ? `<span class="pill community">community · n=${r.n}</span>`
            : `<span class="pill ref">indicative</span>`}</td>
    </tr>`).join("");
}

function barChart(el, items, subEl, subText) {
  if (!items.length) {
    el.innerHTML = `<p class="small muted" style="margin:0">Nothing to chart with these filters.</p>`;
    if (subEl) subEl.textContent = "";
    return;
  }
  const max = Math.max(...items.map(i => i.value));
  el.innerHTML = items.map(i => {
    const pct = Math.max(1.5, (i.value / max) * 100);
    const tip = `${i.label}: ${fmt(i.value)} median${i.n ? ` · ${i.n} submissions` : " · indicative"}`;
    return `
      <div class="row" title="${tip}" tabindex="0" aria-label="${tip}">
        <div class="rl">${i.label}</div>
        <div class="track"><div class="bar" style="width:${pct}%"></div></div>
        <div class="rv">${fmt(i.value, { compact: true })}</div>
      </div>`;
  }).join("");
  if (subEl) subEl.textContent = subText;
}

function medianBy(rows, keyFn) {
  const groups = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    if (!groups.has(k)) groups.set(k, { values: [], n: 0 });
    const g = groups.get(k);
    g.values.push(r.median);
    g.n += r.source === "community" ? r.n : 0;
  }
  return [...groups.entries()]
    .map(([label, g]) => ({ label, value: summarise(g.values).median, n: g.n }))
    .sort((a, b) => b.value - a.value);
}

function renderCharts(rows) {
  barChart($("chartRole"), medianBy(rows, r => roleByKey[r.role].label),
           $("chartRoleSub"), "Median across all shown levels and countries");
  barChart($("chartCountry"), medianBy(rows, r => countryByCode[r.country].name),
           $("chartCountrySub"), "Median across all shown roles and levels");
}

function renderAll() {
  const filters = {
    country: $("fCountry").value,
    role: $("fRole").value,
    level: $("fLevel").value,
    company: $("fCompany").value,
  };
  state.display = $("fDisplay").value;
  const rows = buildRows(filters);
  renderTiles(rows);
  renderTable(rows);
  renderCharts(rows);
}

/* ------------------------------------------------------------------ *
 * Offer checker
 * ------------------------------------------------------------------ */

function runCheck() {
  const role = $("cRole").value, level = $("cLevel").value, country = $("cCountry").value;
  const amount = parseFloat($("cAmount").value);
  const currency = $("cCurrency").value;
  const box = $("cResult");

  if (!(amount > 0)) { box.hidden = true; return; }
  const usd = amount / FX[currency].perUsd;

  const cohort = state.submissions
    .filter(s => s.role === role && s.level === level && s.country === country)
    .map(s => s.usd);

  let pct, range, basis;
  if (cohort.length >= CONFIG.minCohortSize) {
    const st = summarise(cohort);
    pct = percentileRank(cohort, usd);
    range = { p25: st.p25, median: st.median, p75: st.p75 };
    basis = `Based on ${st.n} real submissions for this role, level and country.`;
  } else {
    const ref = referenceFor(role, level, country);
    if (!ref) { box.hidden = true; return; }
    pct = rankAgainstRange(usd, ref);
    range = ref;
    basis = `Based on an <b>indicative range</b> — only ${cohort.length} real submission${cohort.length === 1 ? "" : "s"} so far for this cohort, and we need ${CONFIG.minCohortSize} before publishing a real median. Treat this as a rough steer, not a fact.`;
  }

  const v = verdictFor(pct);
  const prev = $("cVerdict").className.match(/v-\w+/);
  if (prev) $("cVerdict").classList.remove(prev[0]);
  $("cVerdict").classList.add("verdict", `v-${v.key}`);

  const ord = pct % 10 === 1 && pct !== 11 ? "st" : pct % 10 === 2 && pct !== 12 ? "nd" : pct % 10 === 3 && pct !== 13 ? "rd" : "th";
  $("cPct").textContent = pct + ord;
  $("cLabel").textContent = v.label;
  $("cExplain").innerHTML = `A ${roleByKey[role].label} at ${levelByKey[level].label} level in ${countryByCode[country].name} earning <b>${new Intl.NumberFormat("en-US").format(amount)} ${currency}</b>/month sits at about the <b>${pct}${ord} percentile</b>.`;

  const keep = state.display; state.display = currency;
  $("cP25").textContent = fmt(range.p25);
  $("cP50").textContent = fmt(range.median);
  $("cP75").textContent = fmt(range.p75);
  state.display = keep;

  $("cFill").style.width = pct + "%";
  $("cYou").style.left = `calc(${pct}% - 2px)`;
  $("cBasis").innerHTML = basis;
  box.hidden = false;
}

/* ------------------------------------------------------------------ *
 * Setup
 * ------------------------------------------------------------------ */

function option(value, label) { return `<option value="${value}">${label}</option>`; }

function populateSelects() {
  const roleOpts    = ROLES.map(r => option(r.key, r.label)).join("");
  const levelOpts   = LEVELS.map(l => option(l.key, `${l.label} (${l.yrs})`)).join("");
  const countryOpts = COUNTRIES.map(c => option(c.code, c.name)).join("");
  const currOpts    = Object.keys(FX).map(c => option(c, `${c} — ${FX[c].name}`)).join("");

  $("cRole").innerHTML = roleOpts;
  $("cLevel").innerHTML = levelOpts;
  $("cCountry").innerHTML = countryOpts;
  $("cCurrency").innerHTML = currOpts;
  $("cRole").value = "devops";
  $("cLevel").value = "mid";

  $("fCountry").innerHTML = option(ALL, "All countries") + countryOpts;
  $("fRole").innerHTML = option(ALL, "All roles") + roleOpts;
  $("fLevel").innerHTML = option(ALL, "All levels") + levelOpts;
  $("fCompany").innerHTML = option(ALL, "All company types") + COMPANY_TYPES.map(t => option(t, t)).join("");
  $("fDisplay").innerHTML = option("USD", "USD — US Dollar") + currOpts;
  $("fLevel").value = "senior";
}

function wireEvents() {
  ["fCountry", "fRole", "fLevel", "fCompany", "fDisplay"].forEach(id =>
    $(id).addEventListener("change", renderAll));
  ["cRole", "cLevel", "cCountry", "cCurrency"].forEach(id =>
    $(id).addEventListener("change", runCheck));
  $("cAmount").addEventListener("input", runCheck);

  const chip = (el, key) => el.addEventListener("click", () => {
    state[key] = !state[key];
    el.setAttribute("aria-pressed", String(state[key]));
    renderAll();
  });
  chip($("chipCommunity"), "showCommunity");
  chip($("chipRef"), "showRef");

  $("themeToggle").addEventListener("click", () => {
    const now = document.documentElement.getAttribute("data-theme");
    const dark = now ? now === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("gulfpay-theme", next); } catch {}
  });
}

function applyConfig() {
  if (CONFIG.formUrl) {
    ["ctaHeader", "ctaHero", "ctaFooter"].forEach(id => {
      const el = $(id);
      el.href = CONFIG.formUrl;
      el.target = "_blank";
      el.rel = "noopener";
      el.hidden = false;
    });
    $("noFormHint").hidden = true;
  }
  $("minN").textContent = CONFIG.minCohortSize;
  $("minN2").textContent = CONFIG.minSensitiveCohortSize;
  document.querySelectorAll(".minN").forEach(el => el.textContent = CONFIG.minCohortSize);

  if (CONFIG.repoUrl) {
    $("repoLink").href = CONFIG.repoUrl;
    $("repoLink").target = "_blank";
    $("repoLink").rel = "noopener";
    $("repoWrap").hidden = false;
  }
}

function restoreTheme() {
  try {
    const saved = localStorage.getItem("gulfpay-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  } catch {}
}

async function init() {
  restoreTheme();
  populateSelects();
  applyConfig();
  wireEvents();

  state.submissions = await loadSubmissions();
  $("statCount").textContent = state.submissions.length;
  $("statUpdated").textContent = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  $("seedNotice").hidden = false;

  renderAll();
  runCheck();
}

init();
