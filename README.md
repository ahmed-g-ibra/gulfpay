# GulfPay

Anonymous, crowdsourced tech salary data for the GCC — UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman.

Static site. No backend, no database, no build step. Data lives in a Google Sheet you control; the page reads it as CSV in the browser.

---

## Run it locally

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>. A server is required — the page uses ES modules, which browsers refuse to load over `file://`.

---

## The honest-data rule

This is the whole product. Break it and there is no reason for anyone to visit.

- **Never invent submissions.** `data/submissions.json` ships empty on purpose.
- **Indicative ranges** in `assets/js/data.js` are estimates compiled from public recruiter salary guides. They are labelled `indicative` everywhere they appear, and a cohort drops them the moment it has enough real data. They exist so the site isn't an empty table on day one — not to pass as fact.
- A cohort (role × level × country) needs **5 real submissions** before its real median is published. Below that, one person's pay would be identifiable.
- **Review the indicative numbers before you promote the site.** They are a starting estimate, not a cited dataset. If you can get a copy of a recruiter salary guide, adjust `ROLES[].ref` to match and say which guide in this README.

---

## Setup: the data pipeline (about 20 minutes, no code)

### 1. Create the Google Form

New Google Form, title "Add your salary — GulfPay". Turn **off** "Collect email addresses". Add these questions, in this order:

| # | Question | Type | Options |
|---|---|---|---|
| 1 | Role | Dropdown | The 11 labels from `ROLES` in `assets/js/data.js` |
| 2 | Level | Dropdown | Junior, Mid, Senior, Lead / Staff, Manager, Head / Director |
| 3 | Country | Dropdown | UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman |
| 4 | City | Short answer | optional |
| 5 | Company type | Dropdown | Global MNC, Regional scale-up, Local enterprise, Startup, Government / semi-gov, Consultancy / outsourcing |
| 6 | Years of experience | Short answer (number) | |
| 7 | Currency | Dropdown | AED, SAR, QAR, KWD, BHD, OMR |
| 8 | Monthly base salary | Short answer (number) | |
| 9 | Monthly allowances (housing, transport, other cash) | Short answer (number) | |
| 10 | Annual bonus (% of base) | Short answer (number) | optional |
| 11 | Work mode (onsite / hybrid / remote) | Dropdown | Onsite, Hybrid, Remote |
| 12 | Nationality group | Dropdown | the `NATIONALITY_GROUPS` list, optional |

The site matches columns by **keyword**, not exact text, so you can reword a question as long as the keyword survives — "base", "allowance", "bonus", "currency", "country", "role", "level", "years", "city", "company type", "nationality", "remote".

### 2. Publish the responses sheet

Responses → **Link to Sheets**. In that sheet: **File → Share → Publish to web → the responses tab → Comma-separated values (.csv) → Publish**. Copy the URL.

### 3. Fill in `assets/js/config.js`

```js
formUrl:     "https://forms.gle/xxxxxxxx",
sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/xxxx/pub?gid=0&single=true&output=csv",
```

Commit and push. The submit buttons appear and the site starts reading live data.

### 4. Moderate

The sheet is your moderation queue. Delete rows that are obviously fake, identifying, or mistyped. The site already drops anything converting to under \$300 or over \$80,000 a month, which catches most annual-figure typos.

---

## Deploy

Pushed to GitHub with Pages enabled on `main` / root. Any push republishes within a minute or so.

To use a custom domain: add a `CNAME` file containing the domain, then point a `CNAME` DNS record at `<username>.github.io`.

---

## Project layout

```
index.html              markup for every section
assets/css/styles.css   design tokens (light + dark), components
assets/js/config.js     ← the only file you need to edit to operate the site
assets/js/data.js       currencies, taxonomies, indicative ranges
assets/js/stats.js      percentiles, medians, ranking
assets/js/app.js        loading, filtering, rendering, the offer checker
data/submissions.json   fallback data when no sheet is configured (empty)
```

## Adjusting the indicative ranges

`ROLES[].ref` in `assets/js/data.js` holds a **monthly USD total package** per level, benchmarked to the UAE. Country differences come from `COUNTRIES[].multiplier`. Change one number and every view updates.

## Launch checklist

- [ ] Review and adjust the indicative ranges
- [ ] Create the form, publish the sheet, fill in `config.js`
- [ ] Seed with 20–30 real submissions from people you know before posting publicly
- [ ] Post on LinkedIn with one concrete finding, not a product announcement
- [ ] Add a `CNAME` if you buy a domain

## Licence

MIT — see `LICENSE`.
