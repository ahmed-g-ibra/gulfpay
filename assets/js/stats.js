// Small statistics helpers. Kept separate so they can be tested on their own.

export function quantile(sortedValues, q) {
  const n = sortedValues.length;
  if (n === 0) return null;
  if (n === 1) return sortedValues[0];
  const pos = (n - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sortedValues[lo];
  return sortedValues[lo] + (sortedValues[hi] - sortedValues[lo]) * (pos - lo);
}

export function summarise(values) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return null;
  return {
    n: sorted.length,
    p25: quantile(sorted, 0.25),
    median: quantile(sorted, 0.5),
    p75: quantile(sorted, 0.75),
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

// Where `value` falls among real observations, 0-100.
export function percentileRank(values, value) {
  if (!values.length) return null;
  const below = values.filter(v => v < value).length;
  const equal = values.filter(v => v === value).length;
  return Math.round(((below + equal / 2) / values.length) * 100);
}

// Approximate percentile against an indicative p25/median/p75 range.
// Piecewise-linear in log space, extrapolated to the tails and clamped.
export function rankAgainstRange(value, range) {
  if (!range || !(value > 0)) return null;
  const { p25, median, p75 } = range;
  const L = Math.log(value);
  const l25 = Math.log(p25), l50 = Math.log(median), l75 = Math.log(p75);

  let pct;
  if (L <= l25) {
    const slope = 25 / Math.max(l50 - l25, 1e-9);
    pct = 25 - (l25 - L) * slope;
  } else if (L <= l50) {
    pct = 25 + ((L - l25) / (l50 - l25)) * 25;
  } else if (L <= l75) {
    pct = 50 + ((L - l50) / (l75 - l50)) * 25;
  } else {
    const slope = 25 / Math.max(l75 - l50, 1e-9);
    pct = 75 + (L - l75) * slope;
  }
  return Math.round(Math.min(99, Math.max(1, pct)));
}

export function verdictFor(pct) {
  if (pct === null) return null;
  if (pct >= 80) return { key: "strong",  label: "Well above market" };
  if (pct >= 60) return { key: "good",    label: "Above market" };
  if (pct >= 40) return { key: "fair",    label: "Around market" };
  if (pct >= 20) return { key: "low",     label: "Below market" };
  return { key: "verylow", label: "Well below market" };
}
