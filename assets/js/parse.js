// CSV and submission parsing. Kept separate from the UI so it can be tested
// directly — see test/parse.test.mjs.
import { FX, COUNTRIES, LEVELS, ROLES, COMPANY_TYPES, countryByCode } from "./data.js";

// Minimal RFC-4180 CSV parser (handles quoted fields and embedded newlines).
export function parseCsv(text) {
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
// Bilingual titles keep the English keyword for exactly this reason.
export const HEADER_MATCHERS = [
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

export function mapHeaders(headerRow) {
  const map = {};
  headerRow.forEach((raw, i) => {
    const h = raw.toLowerCase().trim();
    for (const [field, test] of HEADER_MATCHERS) {
      if (map[field] === undefined && test(h)) { map[field] = i; break; }
    }
  });
  return map;
}

export const num = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

// Form options may be bilingual ("AED — درهم إماراتي"), so pull the ISO code
// out rather than comparing the whole string.
export function extractCurrency(value) {
  const m = String(value ?? "").toUpperCase().match(/\b(AED|SAR|QAR|KWD|BHD|OMR)\b/);
  return m ? m[1] : null;
}

// Loose containment match against a list of plain strings.
export function looseFind(value, list) {
  const v = String(value ?? "").trim().toLowerCase();
  if (!v) return null;
  return list.find(x => x.toLowerCase() === v)
      || list.find(x => v.includes(x.toLowerCase()) || x.toLowerCase().includes(v))
      || null;
}

// Match a free-text answer back to a known key. Exact first, then label, then
// containment either way — which is what lets a bilingual option resolve.
export function matchKey(value, list, keyProp, labelProp) {
  const v = String(value ?? "").trim().toLowerCase();
  if (!v) return null;
  const exact = list.find(x => String(x[keyProp]).toLowerCase() === v);
  if (exact) return exact[keyProp];
  const byLabel = list.find(x => String(x[labelProp]).toLowerCase() === v);
  if (byLabel) return byLabel[keyProp];
  const partial = list.find(x => String(x[labelProp]).toLowerCase().includes(v) || v.includes(String(x[labelProp]).toLowerCase()));
  return partial ? partial[keyProp] : null;
}

export function normalise(raw) {
  const roleKey    = matchKey(raw.role, ROLES, "key", "label");
  const levelKey   = matchKey(raw.level, LEVELS, "key", "label");
  const countryKey = matchKey(raw.country, COUNTRIES, "code", "name");
  if (!roleKey || !levelKey || !countryKey) return null;

  const currency = extractCurrency(raw.currency) || countryByCode[countryKey].currency;
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
    role: roleKey, level: levelKey, country: countryKey,
    city: String(raw.city || "").trim(),
    companyType: looseFind(raw.companyType, COMPANY_TYPES) || "",
    years: num(raw.years),
    workMode: String(raw.workMode || "").trim(),
    nationality: String(raw.nationality || "").trim(),
    usd,
    submitted: String(raw.submitted || "").trim(),
  };
}

// Turn a published-CSV payload into normalised records.
export function recordsFromCsv(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
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
