# Form specification

Exact questions for the submission form, generated from `assets/js/data.js`.
Option lists must match the labels in that file or submissions are dropped on load.

**Order matters.** The site maps spreadsheet columns by keyword, so keep the
keyword in each title: role, level, country, city, company type, years,
currency, base, allowance, bonus, remote, nationality.

**Form settings:** collect email addresses OFF, sign-in NOT required,
limit to one response OFF. On a Google Workspace account these default to
org-only, which blocks every outside submitter — check them explicitly.

### 1. Role

- **Type:** Dropdown
- **Required:** yes

```
Software Engineer (Backend)
Software Engineer (Frontend)
Mobile Engineer
DevOps / SRE / Platform
Cloud / Solutions Architect
Data Engineer
Data Scientist / ML Engineer
Cybersecurity Engineer
QA / Test Engineer
Product Manager
IT Support / Sysadmin
```

### 2. Level

- **Type:** Dropdown
- **Required:** yes
- **Help text:** Pick by scope, not job title - titles are inflated inconsistently across the region.

```
Junior
Mid
Senior
Lead / Staff
Manager
Head / Director
```

### 3. Country

- **Type:** Dropdown
- **Required:** yes

```
UAE
Saudi Arabia
Qatar
Kuwait
Bahrain
Oman
```

### 4. City

- **Type:** Short answer
- **Required:** no
- **Help text:** Optional.

### 5. Company type

- **Type:** Dropdown
- **Required:** yes

```
Global MNC
Regional scale-up
Local enterprise
Startup
Government / semi-gov
Consultancy / outsourcing
```

### 6. Years of experience

- **Type:** Short answer
- **Required:** yes
- **Help text:** Total, not just at the current company.

### 7. Currency

- **Type:** Dropdown
- **Required:** yes

```
AED
SAR
QAR
KWD
BHD
OMR
```

### 8. Monthly base salary

- **Type:** Short answer
- **Required:** yes
- **Help text:** Numbers only. Base alone - allowances go in the next question.

### 9. Monthly allowances (housing, transport, other cash)

- **Type:** Short answer
- **Required:** yes
- **Help text:** Numbers only. Enter 0 if your package has none.

### 10. Annual bonus (% of base)

- **Type:** Short answer
- **Required:** no
- **Help text:** Optional. Numbers only - e.g. enter 10 for a 10% bonus.

### 11. Work mode (onsite / hybrid / remote)

- **Type:** Dropdown
- **Required:** no
- **Help text:** Optional.

```
Onsite
Hybrid
Remote
```

### 12. Nationality group

- **Type:** Dropdown
- **Required:** no
- **Help text:** Optional, and only ever reported as an aggregate over 8 or more people.

```
GCC national
Arab (Levant / Egypt / North Africa)
South Asian
Southeast Asian
European / North American / ANZ
African (Sub-Saharan)
Other
Prefer not to say
```

## Form description

```
Anonymous. No name, no email, no login.

Your figures are published only as an aggregate. A role + level + country group
needs at least 5 submissions before any real number is shown for it, so your
individual pay is never identifiable.

Takes about a minute. See the results at https://ahmed-g-ibra.github.io/gulfpay/
```
