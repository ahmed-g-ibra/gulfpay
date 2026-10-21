# Where the indicative ranges come from

The figures in `assets/js/data.js` are estimates, not measurements. This file
records what they were benchmarked against and why, so anyone can check the
reasoning or correct it.

Real submissions replace these per cohort at 5 entries. Nothing here survives
contact with actual data.

## The methodological problem

Published GCC salary sources disagree by a factor of three, and the disagreement
is systematic rather than noise. They measure different populations.

| Source | What it measures | Dubai DevOps, AED/month |
|---|---|---|
| [GulfTalent](https://www.gulftalent.com/uae/salaries/software-developer) | Job-seeker registrations | 5,000–7,000 (developers) |
| [Indeed](https://ae.indeed.com/career/it-support/salaries/Dubai) | Job postings | 3,908 (IT support) |
| [Glassdoor](https://www.glassdoor.com/Salaries/dubai-devops-engineer-salary-SRCH_IL.0,5_IC2204498_KO6,21.htm) | Self-reported employees | 16,000 median |
| [Cooper Fitch](https://cooperfitch.ae/wp-content/uploads/2023/12/2024-UAE-Salary-Guide.pdf) | Recruiter placements | 23,000–30,000 |
| [Hays](https://www.zawya.com/en/press-release/research-studies/hays-middle-east-releases-hays-gcc-salary-guide-2026-369616) | Recruiter placements | 25,000–35,000 SAR (KSA) |

Recruiter guides skew high because recruiters place senior people at firms that
pay recruitment fees. Cooper Fitch's 2024 technology tables contain no
individual-contributor software engineer or helpdesk role at all; they start at
Consultant and run to Partner at 117,000+. Job-board averages skew low because
budget employers advertise and job seekers register.

## What this site benchmarks against

GulfPay collects self-reported salaries, so its estimates are benchmarked
against self-reported sources.

- **Junior through senior:** Glassdoor and Bayt. Dubai DevOps mid is published
  at 15,002 AED against Glassdoor's self-reported median of 16,000, and backend
  software engineer mid at 15,425 against Glassdoor's 13,000–16,000.
- **Manager and above:** the recruiter guides, scaled down. Senior hiring
  genuinely does run through recruiters, so their data is more representative at
  the top. These rows sit deliberately just under the published ranges.
- **The spread** (p25 x0.65, p75 x1.45) reproduces Glassdoor's observed
  percentiles: its Dubai DevOps band is 9,258–23,500 around a 16,000 median,
  which is x0.58 to x1.47.

## Corrections applied

| Change | Reason |
|---|---|
| IT Support anchored at 9,000 mid / 15,000 senior AED | First-hand report from someone working in the region. Bayt's UAE average of 7,379 supports it. |
| DevOps anchored at 15,000 AED mid, column scaled x0.60 | Same report. Glassdoor's 16,000 median confirms it. |
| Nine other roles scaled x0.70 | Two independent corrections both ran the same direction, and every column came from the same inflated benchmark. |
| Spread widened to x0.65 / x1.45 | GCC pay varies by employer type and nationality far more than a +/-20% band implies. |
| Manager x1.15, head x1.20 | The flat x0.70 overshot at the top. Manager rows had fallen 15–30% under every recruiter guide. |
| Saudi multiplier varies by level | Riyadh pays over Dubai at the senior end, at or below it lower down. |

## Known weaknesses

- Cooper Fitch's figures are from its **2024** guide, the most recent one whose
  tables could be read directly. The 2026 guide is behind a form.
- Glassdoor's pages label monthly figures as annual in places. The monthly
  reading is the one consistent with its own percentile data.
- No source was found for Kuwait, Bahrain or Oman specifically. Those country
  multipliers are inference, not data, and are the weakest numbers on the site.
- Nothing here is validated for Qatar beyond the UAE comparison.