// Run with: node test/parse.test.mjs
import { recordsFromCsv, extractCurrency, looseFind, mapHeaders, parseCsv } from "../assets/js/parse.js";
import { COMPANY_TYPES } from "../assets/js/data.js";

let pass = 0, fail = 0;
const ok = (name, cond, detail = "") => {
  if (cond) { pass++; console.log("  ok    " + name); }
  else { fail++; console.log("  FAIL  " + name + (detail ? "  — " + detail : "")); }
};
const eq = (name, got, want) => ok(name, got === want, `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

console.log("\nCSV parsing");
{
  const rows = parseCsv('a,b\n"x, with comma",2\n"he said ""hi""",3\n');
  eq("splits rows", rows.length, 3);
  eq("quoted comma kept", rows[1][0], "x, with comma");
  eq("escaped quotes", rows[2][0], 'he said "hi"');
}

console.log("\nCurrency extraction from bilingual options");
eq("plain code", extractCurrency("AED"), "AED");
eq("bilingual", extractCurrency("AED — درهم إماراتي"), "AED");
eq("arabic first", extractCurrency("ريال سعودي — SAR"), "SAR");
eq("lowercase", extractCurrency("kwd"), "KWD");
eq("unknown", extractCurrency("EGP"), null);
eq("empty", extractCurrency(""), null);

console.log("\nCompany type matching");
eq("exact", looseFind("Startup", COMPANY_TYPES), "Startup");
eq("bilingual", looseFind("Global MNC — شركة عالمية متعددة الجنسيات", COMPANY_TYPES), "Global MNC");
eq("case insensitive", looseFind("startup", COMPANY_TYPES), "Startup");
eq("unknown", looseFind("Something else entirely", COMPANY_TYPES), null);

console.log("\nBilingual headers still map");
{
  const header = ["Timestamp","Role / المسمى الوظيفي","Level / المستوى","Country / الدولة","City / المدينة",
    "Company type / نوع الشركة","Years of experience / سنوات الخبرة","Currency / العملة",
    "Monthly base salary / الراتب الأساسي الشهري","Monthly allowances (housing, transport, other cash) / البدلات الشهرية",
    "Annual bonus (% of base) / المكافأة السنوية","Work mode (onsite / hybrid / remote) / نمط العمل",
    "Nationality group / المجموعة"];
  const m = mapHeaders(header);
  eq("role",        header[m.role],        "Role / المسمى الوظيفي");
  eq("level",       header[m.level],       "Level / المستوى");
  eq("country",     header[m.country],     "Country / الدولة");
  eq("companyType", header[m.companyType], "Company type / نوع الشركة");
  eq("currency",    header[m.currency],    "Currency / العملة");
  eq("base",        header[m.base],        "Monthly base salary / الراتب الأساسي الشهري");
  eq("bonus not confused with base", header[m.bonus], "Annual bonus (% of base) / المكافأة السنوية");
  eq("allowances",  header[m.allowances],  "Monthly allowances (housing, transport, other cash) / البدلات الشهرية");
}

console.log("\nEnd to end: a bilingual response row");
{
  const csv = [
    'Timestamp,Role / المسمى الوظيفي,Level / المستوى,Country / الدولة,City / المدينة,"Company type / نوع الشركة",Years of experience / سنوات الخبرة,Currency / العملة,Monthly base salary / الراتب الأساسي,"Monthly allowances (housing, transport, other cash) / البدلات",Annual bonus (% of base) / المكافأة,Work mode (onsite / hybrid / remote) / نمط العمل,Nationality group / المجموعة',
    '2026-10-22 09:00:00,DevOps / SRE / Platform — DevOps / SRE / المنصات,Mid — متوسط,UAE — الإمارات,Dubai,Global MNC — شركة عالمية متعددة الجنسيات,4,AED — درهم إماراتي,12000,3000,10,Hybrid,Arab (Levant / Egypt / North Africa)',
  ].join("\n");
  const recs = recordsFromCsv(csv);
  eq("one record parsed", recs.length, 1);
  const r = recs[0] || {};
  eq("role",     r.role, "devops");
  eq("level",    r.level, "mid");
  eq("country",  r.country, "AE");
  eq("company",  r.companyType, "Global MNC");
  eq("years",    r.years, 4);
  // 12000 base + 3000 allowances + (12000 * 10% / 12 months) 1200 = 16200 AED
  ok("usd total", Math.abs(r.usd - 16200 / 3.6725) < 0.01, "got " + r.usd);
}

console.log("\nEnglish rows keep working");
{
  const csv = [
    "Timestamp,Role,Level,Country,City,Company type,Years of experience,Currency,Monthly base salary,Monthly allowances,Annual bonus (% of base),Work mode,Nationality group",
    "2026-10-22,QA / Test Engineer,Senior,Saudi Arabia,Riyadh,Startup,7,SAR,18000,4000,0,Onsite,South Asian",
  ].join("\n");
  const recs = recordsFromCsv(csv);
  eq("parsed", recs.length, 1);
  eq("role", recs[0]?.role, "qa");
  eq("country", recs[0]?.country, "SA");
  eq("company", recs[0]?.companyType, "Startup");
}

console.log("\nJunk is rejected");
{
  const mk = (base) => ["Timestamp,Role,Level,Country,Currency,Monthly base salary,Monthly allowances",
    `2026-10-22,DevOps / SRE / Platform,Mid,UAE,AED,${base},0`].join("\n");
  eq("annual figure pasted as monthly", recordsFromCsv(mk(900000)).length, 0);
  eq("implausibly low", recordsFromCsv(mk(50)).length, 0);
  eq("plausible kept", recordsFromCsv(mk(15000)).length, 1);
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
