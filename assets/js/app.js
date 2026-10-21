import { CONFIG } from "./config.js";
import {
  FX, COUNTRIES, LEVELS, ROLES, COMPANY_TYPES,
  roleByKey, countryByCode, levelByKey, referenceFor,
} from "./data.js";
import { summarise, percentileRank, rankAgainstRange, verdictFor } from "./stats.js";
import { t, tf, tx, setLang, getLang, restoreLang, NUM_LOCALE } from "./i18n.js";
import { recordsFromCsv, normalise } from "./parse.js";

const $ = (id) => document.getElementById(id);
const ALL = "__all__";

const state = {
  submissions: [],
  display: "USD",
  showCommunity: true,
  showRef: true,
};

/* ---------------- translated taxonomy ---------------- */

const roleLabel    = (key)  => tx("role", key, roleByKey[key]?.label ?? key);
const levelLabel   = (key)  => tx("level", key, levelByKey[key]?.label ?? key);
const levelYrs     = (key)  => tx("levelYrs", key, levelByKey[key]?.yrs ?? "");
const countryName  = (code) => tx("country", code, countryByCode[code]?.name ?? code);
const companyLabel = (name) => tx("company", name, name);
const currencyName = (code) => tx("currency", code, FX[code]?.name ?? code);

/* ---------------- loading ---------------- */

async function loadSubmissions() {
  if (CONFIG.sheetCsvUrl) {
    try {
      const url = CONFIG.sheetCsvUrl + (CONFIG.sheetCsvUrl.includes("?") ? "&" : "?") +
                  "_=" + Math.floor(Date.now() / CONFIG.cacheTtlMs);
      const res = await fetch(url);
      if (res.ok) {
        const records = recordsFromCsv(await res.text());
        if (records.length) return records;
      }
    } catch (err) {
      console.warn("Sheet fetch failed, falling back to bundled data.", err);
    }
  }
  try {
    const res = await fetch("data/submissions.json");
    if (!res.ok) return [];
    const json = await res.json();
    return (json.submissions || []).map(normalise).filter(Boolean);
  } catch {
    return [];
  }
}

/* ---------------- formatting ---------------- */

function toDisplay(usd) {
  return state.display === "USD" ? usd : usd * FX[state.display].perUsd;
}

function fmt(usd, { compact = false } = {}) {
  const opts = compact
    ? { notation: "compact", maximumFractionDigits: 1 }
    : { maximumFractionDigits: 0 };
  return new Intl.NumberFormat(NUM_LOCALE, opts).format(toDisplay(usd)) + " " + state.display;
}

function fmtRange(aUsd, bUsd) {
  const nf = new Intl.NumberFormat(NUM_LOCALE, { notation: "compact", maximumFractionDigits: 1 });
  return nf.format(toDisplay(aUsd)) + " – " + nf.format(toDisplay(bUsd)) + " " + state.display;
}

/* ---------------- cohorts ---------------- */

function buildRows(filters) {
  const rows = [];
  const subs = state.submissions.filter(s =>
    (filters.country === ALL || s.country === filters.country) &&
    (filters.role    === ALL || s.role === filters.role) &&
    (filters.level   === ALL || s.level === filters.level) &&
    (filters.company === ALL || s.companyType === filters.company)
  );

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
      company: filters.company === ALL ? t("cell.allTypes") : companyLabel(filters.company),
      median: st.median, p25: st.p25, p75: st.p75, n: st.n,
    });
  }

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
    roleLabel(a.role).localeCompare(roleLabel(b.role)) ||
    levelOrder[a.level] - levelOrder[b.level] ||
    countryName(a.country).localeCompare(countryName(b.country))
  );
  return rows.filter(r =>
    (r.source === "community" && state.showCommunity) ||
    (r.source === "reference" && state.showRef)
  );
}

/* ---------------- rendering ---------------- */

function renderTiles(rows) {
  const communityRows = rows.filter(r => r.source === "community");
  const st = summarise(rows.map(r => r.median));
  const totalSubs = state.submissions.length;

  const tiles = [
    { label: t("tile.cohorts"), value: String(rows.length), sub: tf("tile.cohortsSubFmt", { n: communityRows.length }) },
    { label: t("tile.median"),  value: st ? fmt(st.median, { compact: true }) : "—", sub: t("tile.medianSub") },
    { label: t("tile.range"),   value: st ? fmtRange(st.min, st.max) : "—", sub: t("tile.rangeSub") },
    { label: t("tile.subs"),    value: String(totalSubs), sub: totalSubs ? t("tile.subsSub") : t("tile.subsNone") },
  ];
  $("tiles").innerHTML = tiles.map(x => `
    <div class="tile"><span>${x.label}</span><b>${x.value}</b><small>${x.sub}</small></div>`).join("");
}

function renderTable(rows) {
  $("emptyState").hidden = rows.length > 0;
  $("tbody").innerHTML = rows.map(r => `
    <tr>
      <td>${roleLabel(r.role)}</td>
      <td>${levelLabel(r.level)}</td>
      <td>${countryName(r.country)}</td>
      <td class="muted">${r.company}</td>
      <td class="num"><b>${fmt(r.median)}</b></td>
      <td class="num muted">${fmt(r.p25)} – ${fmt(r.p75)}</td>
      <td>${r.source === "community"
            ? `<span class="pill community">${t("pill.community")} · n=${r.n}</span>`
            : `<span class="pill ref">${t("pill.indicative")}</span>`}</td>
    </tr>`).join("");
}

function barChart(el, items, subEl, subText) {
  if (!items.length) {
    el.innerHTML = `<p class="small muted" style="margin:0">${t("charts.empty")}</p>`;
    if (subEl) subEl.textContent = "";
    return;
  }
  const max = Math.max(...items.map(i => i.value));
  el.innerHTML = items.map(i => {
    const pct = Math.max(1.5, (i.value / max) * 100);
    const tip = tf("chart.tip", { label: i.label, value: fmt(i.value) }) + " · " +
                (i.n ? tf("chart.tipN", { n: i.n }) : t("chart.tipRef"));
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
  barChart($("chartRole"), medianBy(rows, r => roleLabel(r.role)), $("chartRoleSub"), t("charts.roleSub"));
  barChart($("chartCountry"), medianBy(rows, r => countryName(r.country)), $("chartCountrySub"), t("charts.countrySub"));
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

/* ---------------- offer checker ---------------- */

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
    basis = tf("check.basisReal", { n: st.n });
  } else {
    const ref = referenceFor(role, level, country);
    if (!ref) { box.hidden = true; return; }
    pct = rankAgainstRange(usd, ref);
    range = ref;
    basis = tf("check.basisRef", { n: cohort.length, need: CONFIG.minCohortSize });
  }

  const v = verdictFor(pct);
  const prev = $("cVerdict").className.match(/v-\w+/);
  if (prev) $("cVerdict").classList.remove(prev[0]);
  $("cVerdict").classList.add("verdict", `v-${v.key}`);

  // English takes an ordinal suffix; Arabic does not.
  const ord = getLang() === "ar" ? ""
    : (pct % 10 === 1 && pct !== 11 ? "st" : pct % 10 === 2 && pct !== 12 ? "nd"
      : pct % 10 === 3 && pct !== 13 ? "rd" : "th");

  $("cPct").textContent = pct + ord;
  $("cLabel").textContent = t("verdict." + v.key);
  $("cExplain").innerHTML = tf("check.explain", {
    role: roleLabel(role), level: levelLabel(level), country: countryName(country),
    amount: new Intl.NumberFormat(NUM_LOCALE).format(amount), currency,
    pct: pct + ord,
  });

  const keep = state.display; state.display = currency;
  $("cP25").textContent = fmt(range.p25);
  $("cP50").textContent = fmt(range.median);
  $("cP75").textContent = fmt(range.p75);
  state.display = keep;

  $("cFill").style.width = pct + "%";
  $("cYou").style.insetInlineStart = `calc(${pct}% - 2px)`;
  $("cBasis").innerHTML = basis;
  box.hidden = false;
}

/* ---------------- setup ---------------- */

const option = (value, label) => `<option value="${value}">${label}</option>`;

function populateSelects() {
  // Remember selections so switching language does not reset the view.
  const keep = {};
  for (const id of ["cRole","cLevel","cCountry","cCurrency","fCountry","fRole","fLevel","fCompany","fDisplay"]) {
    const el = $(id);
    if (el && el.value) keep[id] = el.value;
  }

  const roleOpts    = ROLES.map(r => option(r.key, roleLabel(r.key))).join("");
  const levelOpts   = LEVELS.map(l => option(l.key, `${levelLabel(l.key)} (${levelYrs(l.key)})`)).join("");
  const countryOpts = COUNTRIES.map(c => option(c.code, countryName(c.code))).join("");
  const currOpts    = Object.keys(FX).map(c => option(c, `${c} — ${currencyName(c)}`)).join("");

  $("cRole").innerHTML = roleOpts;
  $("cLevel").innerHTML = levelOpts;
  $("cCountry").innerHTML = countryOpts;
  $("cCurrency").innerHTML = currOpts;

  $("fCountry").innerHTML = option(ALL, t("explore.allCountries")) + countryOpts;
  $("fRole").innerHTML    = option(ALL, t("explore.allRoles")) + roleOpts;
  $("fLevel").innerHTML   = option(ALL, t("explore.allLevels")) + levelOpts;
  $("fCompany").innerHTML = option(ALL, t("explore.allCompanies")) +
                            COMPANY_TYPES.map(c => option(c, companyLabel(c))).join("");
  $("fDisplay").innerHTML = option("USD", `USD — ${currencyName("USD")}`) + currOpts;

  const defaults = { cRole: "devops", cLevel: "mid", fLevel: "senior" };
  for (const [id, val] of Object.entries({ ...defaults, ...keep })) {
    const el = $(id);
    if (el) el.value = val;
  }
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  const btn = $("langToggle");
  btn.textContent = t("langLabel");
  btn.title = t("langTitle");
  document.title = getLang() === "ar"
    ? "GulfPay — رواتب التقنية الحقيقية في الخليج"
    : "GulfPay — real tech salaries in the GCC";
  applyConfigText();
}

function applyConfigText() {
  document.querySelectorAll(".minN").forEach(el => el.textContent = CONFIG.minCohortSize);
  const m2 = $("minN2");
  if (m2) m2.textContent = CONFIG.minSensitiveCohortSize;
  if (CONFIG.formUrl) $("noFormHint").hidden = true;
}

function switchLang(lang) {
  setLang(lang);
  applyTranslations();
  populateSelects();
  renderAll();
  runCheck();
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

  $("langToggle").addEventListener("click", () =>
    switchLang(getLang() === "ar" ? "en" : "ar"));

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
  }
  if (CONFIG.repoUrl) {
    $("repoLink").href = CONFIG.repoUrl;
    $("repoLink").target = "_blank";
    $("repoLink").rel = "noopener";
    $("repoWrap").hidden = false;
  }
  applyConfigText();
}

function restoreTheme() {
  try {
    const saved = localStorage.getItem("gulfpay-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  } catch {}
}

async function init() {
  restoreTheme();
  restoreLang();
  populateSelects();
  applyConfig();
  applyTranslations();
  wireEvents();

  state.submissions = await loadSubmissions();
  $("statCount").textContent = state.submissions.length;
  $("statUpdated").textContent = new Date().toLocaleDateString(
    getLang() === "ar" ? "ar-EG-u-nu-latn" : "en-GB", { day: "numeric", month: "short" });

  renderAll();
  runCheck();
}

init();
