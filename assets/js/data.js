// Static reference data: currencies, taxonomies, and indicative market ranges.
// The indicative ranges are ESTIMATES, not verified submissions. They exist so
// the site is useful on day one; every real submission moves a cohort off them.

// GCC currencies are pegged, so these rates are fixed, not fetched.
export const FX = {
  AED: { perUsd: 3.6725, name: "UAE Dirham" },
  SAR: { perUsd: 3.75,   name: "Saudi Riyal" },
  QAR: { perUsd: 3.64,   name: "Qatari Riyal" },
  KWD: { perUsd: 0.3065, name: "Kuwaiti Dinar" },
  BHD: { perUsd: 0.376,  name: "Bahraini Dinar" },
  OMR: { perUsd: 0.3845, name: "Omani Rial" },
};

export const COUNTRIES = [
  { code: "AE", name: "UAE",          currency: "AED", multiplier: 1.00, cities: ["Dubai", "Abu Dhabi", "Sharjah", "Other"] },
  { code: "SA", name: "Saudi Arabia", currency: "SAR",
    // Riyadh pays over Dubai at the senior end, at or just under it below that.
    multiplier: { junior: 0.95, mid: 1.00, senior: 1.10, lead: 1.15, manager: 1.15, head: 1.20 },
    cities: ["Riyadh", "Jeddah", "Khobar/Dammam", "NEOM", "Other"] },
  { code: "QA", name: "Qatar",        currency: "QAR", multiplier: 1.02, cities: ["Doha", "Other"] },
  { code: "KW", name: "Kuwait",       currency: "KWD", multiplier: 0.92, cities: ["Kuwait City", "Other"] },
  { code: "BH", name: "Bahrain",      currency: "BHD", multiplier: 0.78, cities: ["Manama", "Other"] },
  { code: "OM", name: "Oman",         currency: "OMR", multiplier: 0.75, cities: ["Muscat", "Other"] },
];

export const LEVELS = [
  { key: "junior",  label: "Junior",        yrs: "0-2 yrs"  },
  { key: "mid",     label: "Mid",           yrs: "3-5 yrs"  },
  { key: "senior",  label: "Senior",        yrs: "6-9 yrs"  },
  { key: "lead",    label: "Lead / Staff",  yrs: "10+ yrs"  },
  { key: "manager", label: "Manager",       yrs: "team lead" },
  { key: "head",    label: "Head / Director", yrs: "org lead" },
];

export const COMPANY_TYPES = [
  "Global MNC",
  "Regional scale-up",
  "Local enterprise",
  "Startup",
  "Government / semi-gov",
  "Consultancy / outsourcing",
];

export const WORK_MODES = ["Onsite", "Hybrid", "Remote"];

// Monthly TOTAL PACKAGE in USD (base + housing/transport allowances + bonus,
// averaged monthly), benchmarked to the UAE. Country multiplier applied on top.
// Built from public recruiter salary guides (2025-2026), then scaled down
// against first-hand reports from people working in the region: the published
// guides consistently ran high. IT Support and DevOps are anchored directly on
// reported Dubai figures; the other nine were scaled x0.70 to match.
// Treat as indicative only — real submissions replace these per cohort.
export const ROLES = [
  { key: "swe_be",   label: "Software Engineer (Backend)",  ref: { junior: 2450, mid: 4200, senior: 6300,  lead: 8750, manager: 9450, head: 13300 } },
  { key: "swe_fe",   label: "Software Engineer (Frontend)", ref: { junior: 2250, mid: 3850, senior: 5750,  lead: 8050, manager: 8950, head: 12600 } },
  { key: "mobile",   label: "Mobile Engineer",              ref: { junior: 2300, mid: 4050, senior: 6000,  lead: 8400, manager: 9100, head: 12600 } },
  { key: "devops",   label: "DevOps / SRE / Platform",      ref: { junior: 2300, mid: 4085, senior: 6000,  lead: 8100,  manager: 9000,  head: 11700 } },
  { key: "cloud",    label: "Cloud / Solutions Architect",  ref: { junior: 2800, mid: 5600, senior: 8050, lead: 10500, manager: 11550, head: 14700 } },
  { key: "data_eng", label: "Data Engineer",                ref: { junior: 2650, mid: 4550, senior: 6650,  lead: 8750, manager: 9800, head: 12950 } },
  { key: "ds_ml",    label: "Data Scientist / ML Engineer", ref: { junior: 2800, mid: 4900, senior: 7200, lead: 9450, manager: 10500, head: 13650 } },
  { key: "security", label: "Cybersecurity Engineer",       ref: { junior: 2650, mid: 4750, senior: 6850,  lead: 9100, manager: 10150, head: 13300 } },
  { key: "qa",       label: "QA / Test Engineer",           ref: { junior: 1900, mid: 3200, senior: 4750,  lead: 6300,  manager: 7550, head: 9800 } },
  { key: "pm",       label: "Product Manager",              ref: { junior: 2800, mid: 5100, senior: 7200, lead: 9450, manager: 11050, head: 14700 } },
  { key: "itsupport",label: "IT Support / Sysadmin",        ref: { junior: 1500, mid: 2450, senior: 4085, lead: 5200,  manager: 6500,  head: 9100 } },
];

// Spread around the indicative median.
// Deliberately wide. In the GCC the same role at the same company can differ by
// a factor of two depending on employer type and which passport you hold, so a
// narrow band would misreport most people as outliers.
export const REF_SPREAD = { p25: 0.65, p75: 1.45 };

export const NATIONALITY_GROUPS = [
  "GCC national",
  "Arab (Levant / Egypt / North Africa)",
  "South Asian",
  "Southeast Asian",
  "European / North American / ANZ",
  "African (Sub-Saharan)",
  "Other",
  "Prefer not to say",
];

export const roleByKey = Object.fromEntries(ROLES.map(r => [r.key, r]));
export const countryByCode = Object.fromEntries(COUNTRIES.map(c => [c.code, c]));
export const levelByKey = Object.fromEntries(LEVELS.map(l => [l.key, l]));

// Indicative monthly USD total package for a cohort.
export function referenceFor(roleKey, levelKey, countryCode) {
  const role = roleByKey[roleKey];
  const country = countryByCode[countryCode];
  if (!role || !country) return null;
  const base = role.ref[levelKey];
  if (!base) return null;
  const mult = typeof country.multiplier === "number"
    ? country.multiplier
    : (country.multiplier[levelKey] ?? 1);
  const median = Math.round(base * mult);
  return {
    median,
    p25: Math.round(median * REF_SPREAD.p25),
    p75: Math.round(median * REF_SPREAD.p75),
  };
}
