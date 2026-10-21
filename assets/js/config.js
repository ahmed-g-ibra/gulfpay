// GulfPay configuration.
// Everything you need to operate the site lives in this one file.

export const CONFIG = {
  // Public URL of this repo. Leave empty to hide the footer source link.
  repoUrl: "",

  // Public URL of your Google Form (the "Send > link" URL).
  // Leave empty to hide the submit buttons until you have one.
  formUrl: "",

  // Google Sheet published as CSV:
  //   Sheet > File > Share > Publish to web > (responses tab) > Comma-separated values
  // Leave empty and the site runs purely on data/submissions.json in this repo.
  sheetCsvUrl: "",

  // Minimum submissions in a cohort before its real median is shown.
  // Below this we fall back to the indicative range and say so.
  // Protects against one person's salary being identifiable.
  minCohortSize: 5,

  // Minimum group size before a nationality-based aggregate is shown at all.
  minSensitiveCohortSize: 8,

  // Cache-bust the sheet fetch (ms). 10 min.
  cacheTtlMs: 10 * 60 * 1000,
};
