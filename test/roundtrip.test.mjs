// Takes the exact option strings the translation script will write into the
// Google Form, builds a response row from each, and checks the site parses it.
// Run with: node test/roundtrip.test.mjs
import fs from "node:fs";
import { recordsFromCsv } from "../assets/js/parse.js";
import { ROLES, LEVELS, COUNTRIES, COMPANY_TYPES } from "../assets/js/data.js";

const gs = fs.readFileSync(new URL("../docs/translate-form.gs", import.meta.url), "utf8");
const SPEC = JSON.parse(gs.match(/var SPEC = (\[[\s\S]*?\n\]);/)[1]);
const byMatch = Object.fromEntries(SPEC.map(s => [s.match, s]));

const header = SPEC.map(s => s.title);
header.unshift("Timestamp");

let pass = 0, fail = 0;
const ok = (n, c, d = "") => c ? (pass++, console.log("  ok    " + n))
                               : (fail++, console.log("  FAIL  " + n + (d ? "  — " + d : "")));

const q = (v) => `"${String(v).replace(/"/g, '""')}"`;

function rowFor(roleOpt, levelOpt, countryOpt, companyOpt, currencyOpt) {
  const cells = {
    "role": roleOpt, "level": levelOpt, "country": countryOpt, "city": "Dubai",
    "company type": companyOpt, "years": "5", "currency": currencyOpt,
    "base": "14000", "allowance": "4000", "bonus": "0",
    "work mode": byMatch["work mode"].options[1], "nationality": byMatch["nationality"].options[1],
  };
  return ["2026-10-22 10:00:00", ...SPEC.map(s => cells[s.match])].map(q).join(",");
}

console.log("\nEvery role option resolves");
for (let i = 0; i < byMatch.role.options.length; i++) {
  const csv = header.map(q).join(",") + "\n" +
    rowFor(byMatch.role.options[i], byMatch.level.options[1],
           byMatch.country.options[0], byMatch["company type"].options[0],
           byMatch.currency.options[0]);
  const recs = recordsFromCsv(csv);
  ok(ROLES[i].key.padEnd(10) + " <- " + byMatch.role.options[i].slice(0, 44),
     recs.length === 1 && recs[0].role === ROLES[i].key,
     recs.length ? "got role " + recs[0].role : "row rejected");
}

console.log("\nEvery level option resolves");
for (let i = 0; i < byMatch.level.options.length; i++) {
  const csv = header.map(q).join(",") + "\n" +
    rowFor(byMatch.role.options[3], byMatch.level.options[i],
           byMatch.country.options[0], byMatch["company type"].options[0],
           byMatch.currency.options[0]);
  const recs = recordsFromCsv(csv);
  ok(LEVELS[i].key.padEnd(8) + " <- " + byMatch.level.options[i],
     recs.length === 1 && recs[0].level === LEVELS[i].key,
     recs.length ? "got level " + recs[0].level : "row rejected");
}

console.log("\nEvery country option resolves");
for (let i = 0; i < byMatch.country.options.length; i++) {
  const csv = header.map(q).join(",") + "\n" +
    rowFor(byMatch.role.options[3], byMatch.level.options[1],
           byMatch.country.options[i], byMatch["company type"].options[0],
           byMatch.currency.options[i]);
  const recs = recordsFromCsv(csv);
  ok(COUNTRIES[i].code + " " + byMatch.country.options[i].padEnd(26) + " + " + byMatch.currency.options[i].slice(0, 20),
     recs.length === 1 && recs[0].country === COUNTRIES[i].code,
     recs.length ? "got " + recs[0].country : "row rejected");
}

console.log("\nEvery company-type option resolves");
for (let i = 0; i < byMatch["company type"].options.length; i++) {
  const csv = header.map(q).join(",") + "\n" +
    rowFor(byMatch.role.options[3], byMatch.level.options[1],
           byMatch.country.options[0], byMatch["company type"].options[i],
           byMatch.currency.options[0]);
  const recs = recordsFromCsv(csv);
  ok(COMPANY_TYPES[i].padEnd(26) + " <- bilingual",
     recs.length === 1 && recs[0].companyType === COMPANY_TYPES[i],
     recs.length ? "got " + JSON.stringify(recs[0].companyType) : "row rejected");
}

console.log("\nHeaders from the new titles still map to every field");
{
  const csv = header.map(q).join(",") + "\n" +
    rowFor(byMatch.role.options[3], byMatch.level.options[1],
           byMatch.country.options[0], byMatch["company type"].options[0],
           byMatch.currency.options[0]);
  const r = recordsFromCsv(csv)[0] || {};
  ok("city captured", r.city === "Dubai", JSON.stringify(r.city));
  ok("years captured", r.years === 5, String(r.years));
  // 14000 + 4000, no bonus
  ok("amount correct", Math.abs(r.usd - 18000 / 3.6725) < 0.01, String(r.usd));
  ok("work mode captured", !!r.workMode, JSON.stringify(r.workMode));
  ok("nationality captured", !!r.nationality, JSON.stringify(r.nationality));
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
