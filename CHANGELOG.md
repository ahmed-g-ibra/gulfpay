# Changelog

Notable changes, newest first. Versions follow [semantic versioning](https://semver.org).
Every version below is an annotated git tag, so any of them can be deployed or
inspected directly — see [Rolling back](#rolling-back).

The project stays on 0.x until it launches with real submission data. Today every
figure on the site is still an indicative estimate.

## [0.7.0] — 2026-10-22

Full QA pass. Eighteen findings, all fixed.

### Fixed — user flows
- Filtering by company type returned an empty table reading "No rows match
  these filters", which made a working filter look broken. Indicative ranges
  carry no company dimension, so the empty state now says so.
- "Last updated" showed today's date whether or not any data existed. It now
  reads the latest submission timestamp, or shows "no data yet".
- The offer checker accepted a country and currency that disagreed, answering a
  malformed question with a confident percentile. Changing country now sets the
  matching currency.
- The checker accepted any amount, including 99,999,999. It now applies the same
  300–80,000 USD bounds the submission parser uses, and says so.

### Fixed — SEO
- Arabic was invisible to search engines: it lived only in JavaScript applied at
  runtime, and crawlers got English. Arabic now has a URL (`?lang=ar`), which the
  sitemap and hreflang point at.
- hreflang claimed two language versions at one identical URL.
- The meta description, Open Graph and Twitter tags stayed English in Arabic.
  They now follow the language, as does the canonical.
- Added robots.txt and sitemap.xml, both previously 404.
- Added a 1200x630 social card. Shares rendered as bare text links before.

### Fixed — content
- The warning notice still described the old recruiter-guide methodology,
  contradicting the methodology section on the same page since 0.6.0.
- "Submissions open soon" survived four versions after the form went live.
- The methodology had grown into one 110-word paragraph; it is five bullets now.
- Grammar in the offer-checker sentence: "A DevOps / SRE / Platform at Mid level
  in UAE earning..." restructured to avoid the bare noun phrase and the missing
  article.
- "Median of shown", inconsistent capitalisation in the percentile band, and
  "switch the table to a different filter".
- A cohort with zero submissions read "only 0 real submissions so far".

### Fixed — accessibility
- Added a skip link, a table caption, and `scope="col"` on every header cell.
- `.sr-only` was defined in CSS and used nowhere; it now carries the caption.

## [0.6.0] — 2026-10-22

### Changed
- Manager rows raised x1.15 and head rows x1.20. The earlier flat x0.70 fixed
  the middle of each ladder and broke the top: manager figures had fallen 15–30%
  under every recruiter guide. Junior through senior are untouched.
- Methodology text now explains which source type each part of the table is
  benchmarked against, in both languages.

### Added
- [docs/SOURCES.md](docs/SOURCES.md) — provenance for every figure, the
  published sources checked against it, and the known weak spots.

### Verified against published sources
- Dubai DevOps mid publishes at 15,002 AED against Glassdoor's self-reported
  median of 16,000 (79 salaries).
- Backend software engineer mid publishes at 15,425 against Glassdoor's
  13,000–16,000 (1,097 salaries).
- The spread (p25 x0.65 / p75 x1.45) reproduces Glassdoor's observed band of
  9,258–23,500 around 16,000, which is x0.58 to x1.47.
- Published sources disagree by a factor of three. Recruiter guides measure
  senior placements; job boards measure budget employers. This site collects
  self-reported data and benchmarks accordingly.

## [0.5.0] — 2026-10-22

### Added
- Bilingual Google Form: `docs/translate-form.gs` rewrites the existing form in
  place, so the form link and published CSV survive unchanged.
- Test suite with 69 assertions, no framework: `test/parse.test.mjs` and
  `test/roundtrip.test.mjs`. The round-trip test reads option strings out of the
  Apps Script and asserts every one resolves through the real parser.
- `assets/js/parse.js` — parsing extracted from `app.js` so it runs without a DOM.

### Fixed
- Bilingual dropdown options broke two fields. Currency was compared as a whole
  string, so `"AED · درهم إماراتي"` matched nothing and every submission would have
  been silently rejected. Company type used exact equality and returned empty.
  Currency is now extracted by ISO code; company type matches loosely.

## [0.4.0] — 2026-10-21

### Added
- Arabic, with full RTL layout. `assets/js/i18n.js` holds both languages: UI
  strings plus translated role, level, country, company and currency names.
- Language persists in `localStorage` and defaults from `navigator.language`.

### Changed
- CSS converted to logical properties rather than duplicated into a mirrored
  stylesheet, so RTL is one set of rules to maintain instead of two.
- Figures stay Latin-digit and bidi-isolated in both languages.

## [0.3.0] — 2026-10-21

### Changed
- Indicative salary ranges corrected downward against first-hand regional
  reports. Published recruiter guides ran high across the board.
  - IT Support anchored at 9,000 AED mid / 15,000 senior.
  - DevOps anchored at 15,000 AED mid, whole column scaled x0.60.
  - The other nine roles scaled x0.70, which also restored a sane role
    ordering — DevOps had fallen below QA, which no market does.
- Percentile band widened from +/-20% to p25 x0.65 / p75 x1.45. GCC pay varies
  by employer type and nationality far more than a narrow band implies.
- Saudi multiplier now varies by level instead of a flat x1.05.
- Methodology text corrected to say the figures were adjusted against regional
  reports, not taken from salary guides alone.

## [0.2.0] — 2026-10-21

### Added
- Live submission pipeline: Google Form to a published CSV the site reads in
  the browser. No backend.
- `docs/create-form.gs` builds the form and response sheet in one run.
- `docs/form-spec.md`, generated from `data.js` so option lists cannot drift.

### Notes
- The form must live on a personal Google account. A Workspace account produces
  an org-restricted form that outside submitters cannot open.

## [0.1.0] — 2026-10-21

### Added
- First public deploy on GitHub Pages.
- Offer checker: percentile ranking against a cohort or indicative range.
- Explorer: filter by country, role, level, company type and display currency.
- Median-by-role and median-by-country charts driven by the same filters.
- Cohorts need 5 real submissions before a real median is published, so no
  individual's pay is identifiable.
- Dependency-free static site: no framework, no build step, no backend.

## Rolling back

Every version is an annotated tag. To see what changed between two:

```bash
git log --oneline v0.3.0..v0.4.0
git diff v0.3.0 v0.4.0
```

To put an older version back on the live site:

```bash
git revert --no-commit v0.4.0..HEAD && git commit -m 'Roll back to v0.4.0' && git push
```

That keeps history intact, which matters because the site is public — a force
push would rewrite commits other people may already have pulled.

To inspect an old version locally without touching `main`:

```bash
git switch --detach v0.3.0
python3 -m http.server 8080
git switch main
```

Only `main` deploys. Checking out a tag changes nothing on the live site.