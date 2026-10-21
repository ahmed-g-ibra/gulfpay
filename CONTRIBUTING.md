# Contributing

## Adding salary data

Use the form on the site. Don't open a pull request that adds rows to
`data/submissions.json` — unverifiable data is worse than no data, and the whole
value of this project is that the numbers are real.

## Code changes

1. Run it locally: `python3 -m http.server 8080`
2. Keep it dependency-free. No framework, no build step, no bundler.
3. Check both light and dark themes before opening a PR.

## Adding a role or country

Edit `assets/js/data.js`:

- A new role needs a `key`, a `label`, and a `ref` figure for every level
  (monthly USD total package, UAE benchmark).
- A new country needs a `code`, `name`, `currency`, `multiplier` and `cities`,
  plus a peg rate in `FX`.

Add the matching option to the Google Form at the same time, or submissions for
it will be dropped on load.

## Things that will get a PR closed

- Fabricated or scraped salary rows
- Anything that makes an individual identifiable
- Adding a tracker, analytics vendor, or ad network without discussion
