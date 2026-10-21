// Translations. English is the source of truth; every key here must exist in both.
// Technical role names keep their English term where that is what people
// actually say in Gulf tech workplaces.

export const STRINGS = {
  en: {
    dir: "ltr",
    langLabel: "العربية",
    langTitle: "Switch to Arabic",

    "nav.add": "Add your salary",
    "hero.eyebrow": "UAE · Saudi · Qatar · Kuwait · Bahrain · Oman",
    "hero.title1": "What tech people",
    "hero.title2": "actually earn in the Gulf.",
    "hero.lead": "Salary in the GCC is decided in private and guessed at in public. GulfPay collects it anonymously and publishes the numbers — total package, not just base, so you can tell a real offer from a dressed-up one.",
    "hero.cta1": "Add your salary — anonymous, 60 seconds",
    "hero.cta2": "Check if your offer is fair",
    "hero.stat1": "community submissions",
    "hero.stat2": "roles tracked",
    "hero.stat3": "countries",
    "hero.stat4": "last updated",

    "notice.html": "<b>Read this first.</b> Cohorts with fewer than <span class=\"minN\">5</span> real submissions show an <b>indicative range</b>: an estimate benchmarked against published salary data, <b>not</b> verified submissions. Those rows are labelled <span class=\"pill ref\">indicative</span>. Real submissions are labelled <span class=\"pill community\">community</span> and replace the estimate as soon as a cohort has enough of them.",

    "check.h2": "Check your offer",
    "check.lead": "Enter the total monthly package you're being offered — base plus housing, transport and any other cash allowance. We'll show where it sits.",
    "check.role": "Role",
    "check.level": "Level",
    "check.country": "Country",
    "check.amount": "Monthly package",
    "check.currency": "Currency",
    "check.low": "bottom of market",
    "check.mid": "median",
    "check.high": "top of market",
    "check.p25": "25th percentile",
    "check.p50": "median",
    "check.p75": "75th percentile",

    "explore.h2": "Explore the data",
    "explore.lead": "Filter by country, role, level and company type. Every figure is a monthly total package, shown in the display currency you pick.",
    "explore.allCountries": "All countries",
    "explore.allRoles": "All roles",
    "explore.allLevels": "All levels",
    "explore.allCompanies": "All company types",
    "explore.company": "Company type",
    "explore.display": "Show amounts in",
    "explore.chipCommunity": "Community submissions",
    "explore.chipRef": "Indicative ranges",
    "explore.empty": "No rows match these filters.",

    "th.role": "Role",
    "th.level": "Level",
    "th.country": "Country",
    "th.company": "Company",
    "th.package": "Monthly package",
    "th.range": "Range",
    "th.source": "Source",
    "pill.indicative": "indicative",
    "pill.community": "community",
    "cell.allTypes": "All types",

    "tile.cohorts": "Cohorts shown",
    "tile.cohortsSub": "from real data",
    "tile.median": "Median",
    "tile.medianSub": "of the cohorts shown",
    "tile.range": "Range",
    "tile.rangeSub": "lowest to highest cohort",
    "tile.subs": "Submissions",
    "tile.subsSub": "and counting",
    "tile.subsNone": "be the first",

    "charts.h2": "Median package by role and country",
    "charts.lead": "Median monthly total package for the currently selected filters. Bars use whichever source each cohort qualifies for.",
    "charts.byRole": "By role",
    "charts.byCountry": "By country",
    "charts.roleSub": "Median across all shown levels and countries",
    "charts.countrySub": "Median across all shown roles and levels",
    "charts.note": "The charts read from the table above. Change a filter and they follow.",
    "charts.empty": "Nothing to chart with these filters.",

    "method.h2": "How this works",
    "method.s1": "Where the numbers come from",
    "method.s2": "What \"total package\" means",
    "method.s3": "Privacy",
    "method.s4": "Currency conversion",

    "contribute.h2": "The data is only as good as what people share",
    "contribute.lead": "One anonymous submission takes about a minute and makes the next person's negotiation less of a guess.",
    "contribute.hint": "The submission form is not configured yet.",

    "footer.1": "GulfPay",
    "footer.2": "— anonymous tech salary data for the GCC.",
    "footer.3": "Indicative ranges are estimates, not verified data. Nothing here is financial, legal or career advice.",
    "footer.method": "Methodology",
    "footer.source": "Source on GitHub",

    "method.b1": "<ul><li><b>Community submissions</b> are anonymous entries from the form. A cohort (role + level + country) needs at least <span class=\"minN\">5</span> of them before its real median is published. Below that, one person's salary would be identifiable.</li><li><b>Indicative ranges</b> are estimates, clearly labelled, and replaced per cohort as real data arrives. Do not quote them as fact.</li><li>Published GCC salary sources disagree by a factor of three, because they measure different populations. Recruiter guides describe senior placements at firms paying recruitment fees. Job boards describe budget employers.</li><li>This site collects self-reported salaries, so its estimates follow self-reported sources (Glassdoor, Bayt) up to senior level, and recruiter guides (Cooper Fitch, Hays) at manager level and above, where senior hiring does run through recruiters.</li><li>Every figure and its source is documented in the repository.</li></ul>",
    "method.b2": "<p style=\"margin:0 0 .6em\">Gulf offers split pay into base plus allowances, which makes headline numbers misleading. Everything here is the <b>monthly total cash package</b>:</p><ul><li>Base salary</li><li>Housing, transport and any other recurring cash allowance</li><li>Annual bonus, divided by 12</li></ul><p style=\"margin:.6em 0 0\">It excludes equity, relocation one-offs, school fees and medical cover — those vary too much to average honestly.</p>",
    "method.b3": "<ul><li>No names, no emails, no login. The form does not collect identity.</li><li>Company name is optional and never shown on a row — only company <i>type</i> is published.</li><li>Nationality is optional. It is only ever shown as an aggregate over at least <span id=\"minN2\">8</span> people, never on an individual row.</li><li>Submissions are moderated before publication to strip anything identifying.</li></ul>",
    "method.b4": "<p style=\"margin:0\">GCC currencies are pegged to the US dollar, so conversion uses fixed rates rather than a live feed: AED 3.6725, SAR 3.75, QAR 3.64, KWD 0.3065, BHD 0.376, OMR 0.3845 per USD.</p>",

    "check.explain": "{role}, {level} level, {country}. At <b>{amount} {currency}</b>/month that sits at about the <b>{pct}</b> percentile.",
    "check.basisReal": "Based on {n} real submissions for this role, level and country.",
    "check.basisRef": "Based on an <b>indicative range</b> — only {n} real submissions so far for this cohort, and we need {need} before publishing a real median. Treat this as a rough steer, not a fact.",
    "tile.cohortsSubFmt": "{n} from real data",
    "chart.tip": "{label}: {value} median",
    "chart.tipN": "{n} submissions",
    "chart.tipRef": "indicative",

    "explore.emptyCompany": "Indicative ranges carry no company type, so filtering by one shows real submissions only. There are none yet for this company type.",
    "hero.statNoData": "no data yet",
    "check.outOfRange": "That looks like a typo. Enter a monthly package, not an annual one.",
    "check.basisRefNone": "Based on an <b>indicative range</b>. No real submissions for this cohort yet, and we need {need} before publishing a real median. Treat this as a rough steer, not a fact.",
    "table.caption": "Median monthly total package by role, level and country",
    "skip.link": "Skip to content",

    "verdict.strong": "Well above market",
    "verdict.good": "Above market",
    "verdict.fair": "Around market",
    "verdict.low": "Below market",
    "verdict.verylow": "Well below market",
  },

  ar: {
    dir: "rtl",
    langLabel: "English",
    langTitle: "التبديل إلى الإنجليزية",

    "nav.add": "أضف راتبك",
    "hero.eyebrow": "الإمارات · السعودية · قطر · الكويت · البحرين · عُمان",
    "hero.title1": "كم يتقاضى العاملون في التقنية",
    "hero.title2": "فعليًا في الخليج.",
    "hero.lead": "تُحدَّد الرواتب في الخليج خلف الأبواب المغلقة ويُخمِّنها الجميع في العلن. يجمع GulfPay هذه الأرقام بشكل مجهول وينشرها — الحزمة الكاملة لا الراتب الأساسي وحده، حتى تميّز العرض الحقيقي من العرض المُجمَّل.",
    "hero.cta1": "أضف راتبك — بشكل مجهول، في دقيقة",
    "hero.cta2": "تحقّق إن كان عرضك عادلًا",
    "hero.stat1": "مشاركة من المجتمع",
    "hero.stat2": "مسمى وظيفي",
    "hero.stat3": "دول",
    "hero.stat4": "آخر تحديث",

    "notice.html": "<b>اقرأ هذا أولًا.</b> الفئات التي لديها أقل من <span class=\"minN\">5</span> مشاركات حقيقية تعرض <b>نطاقًا استرشاديًا</b>: تقدير مقيس على بيانات رواتب منشورة، وليس <b>مشاركات</b> موثّقة. تُوسم هذه الصفوف بـ <span class=\"pill ref\">استرشادي</span>، أما المشاركات الحقيقية فتُوسم بـ <span class=\"pill community\">مجتمع</span> وتحلّ محل التقدير فور توفّر عدد كافٍ منها.",

    "check.h2": "تحقّق من عرضك",
    "check.lead": "أدخل إجمالي الحزمة الشهرية المعروضة عليك — الراتب الأساسي مع بدل السكن والمواصلات وأي بدلات نقدية أخرى. سنوضّح أين يقع.",
    "check.role": "المسمى الوظيفي",
    "check.level": "المستوى",
    "check.country": "الدولة",
    "check.amount": "الحزمة الشهرية",
    "check.currency": "العملة",
    "check.low": "أدنى السوق",
    "check.mid": "الوسيط",
    "check.high": "أعلى السوق",
    "check.p25": "الشريحة الدنيا 25%",
    "check.p50": "الوسيط",
    "check.p75": "الشريحة العليا 75%",

    "explore.h2": "استكشف البيانات",
    "explore.lead": "صفِّ حسب الدولة والمسمى الوظيفي والمستوى ونوع الشركة. كل رقم هنا هو حزمة شهرية كاملة، معروضة بالعملة التي تختارها.",
    "explore.allCountries": "كل الدول",
    "explore.allRoles": "كل المسميات",
    "explore.allLevels": "كل المستويات",
    "explore.allCompanies": "كل أنواع الشركات",
    "explore.company": "نوع الشركة",
    "explore.display": "اعرض المبالغ بـ",
    "explore.chipCommunity": "مشاركات المجتمع",
    "explore.chipRef": "النطاقات الاسترشادية",
    "explore.empty": "لا توجد نتائج مطابقة لهذه الفلاتر.",

    "th.role": "المسمى الوظيفي",
    "th.level": "المستوى",
    "th.country": "الدولة",
    "th.company": "الشركة",
    "th.package": "الحزمة الشهرية",
    "th.range": "النطاق",
    "th.source": "المصدر",
    "pill.indicative": "استرشادي",
    "pill.community": "مجتمع",
    "cell.allTypes": "كل الأنواع",

    "tile.cohorts": "الفئات المعروضة",
    "tile.cohortsSub": "من بيانات حقيقية",
    "tile.median": "الوسيط",
    "tile.medianSub": "للفئات المعروضة",
    "tile.range": "النطاق",
    "tile.rangeSub": "من أدنى فئة إلى أعلاها",
    "tile.subs": "المشاركات",
    "tile.subsSub": "والعدد يتزايد",
    "tile.subsNone": "كن أول المشاركين",

    "charts.h2": "الوسيط حسب المسمى الوظيفي والدولة",
    "charts.lead": "وسيط الحزمة الشهرية الكاملة وفق الفلاتر المختارة. تعتمد الأعمدة على المصدر المتاح لكل فئة.",
    "charts.byRole": "حسب المسمى الوظيفي",
    "charts.byCountry": "حسب الدولة",
    "charts.roleSub": "الوسيط عبر كل المستويات والدول المعروضة",
    "charts.countrySub": "الوسيط عبر كل المسميات والمستويات المعروضة",
    "charts.note": "تقرأ الرسوم من الجدول أعلاه. غيّر أي فلتر وستتبعه.",
    "charts.empty": "لا توجد بيانات لعرضها بهذه الفلاتر.",

    "method.h2": "كيف يعمل هذا",
    "method.s1": "من أين تأتي الأرقام",
    "method.s2": "ما المقصود بـ «الحزمة الكاملة»",
    "method.s3": "الخصوصية",
    "method.s4": "تحويل العملات",

    "contribute.h2": "جودة البيانات من جودة ما يشاركه الناس",
    "contribute.lead": "مشاركة واحدة مجهولة تستغرق دقيقة، وتجعل مفاوضة الشخص التالي أقل تخمينًا.",
    "contribute.hint": "لم يُضبط نموذج المشاركة بعد.",

    "footer.1": "GulfPay",
    "footer.2": "— بيانات رواتب تقنية مجهولة المصدر لدول الخليج.",
    "footer.3": "النطاقات الاسترشادية تقديرات وليست بيانات موثّقة. لا شيء هنا يُعد استشارة مالية أو قانونية أو مهنية.",
    "footer.method": "المنهجية",
    "footer.source": "الكود على GitHub",

    "method.b1": "<ul><li><b>مشاركات المجتمع</b> إدخالات مجهولة من النموذج. تحتاج كل فئة (مسمى وظيفي + مستوى + دولة) إلى <span class=\"minN\">5</span> مشاركات على الأقل قبل نشر وسيطها الحقيقي. وما دون ذلك يصبح راتب شخص واحد قابلًا للتمييز.</li><li><b>النطاقات الاسترشادية</b> تقديرات موسومة بوضوح، وتحلّ محلها البيانات الحقيقية لكل فئة فور وصولها. لا تقتبسها كحقيقة.</li><li>تختلف مصادر الرواتب المنشورة في الخليج بمقدار ثلاثة أضعاف لأنها تقيس فئات مختلفة. أدلة شركات التوظيف تصف التعيينات العليا في شركات تدفع رسوم توظيف، ومواقع الوظائف تصف أصحاب العمل محدودي الميزانية.</li><li>يجمع هذا الموقع رواتب يصرّح بها أصحابها، لذا تتبع تقديراته مصادر التصريح الذاتي (Glassdoor وBayt) حتى المستوى المتقدّم، وأدلة التوظيف (Cooper Fitch وHays) من مستوى المدير فما فوق، حيث يمر التعيين فعلًا عبر شركات التوظيف.</li><li>كل رقم ومصدره موثّق في المستودع.</li></ul>",
    "method.b2": "<p style=\"margin:0 0 .6em\">تُقسِّم العروض الخليجية الراتب إلى أساسي وبدلات، ما يجعل الأرقام المعلنة مضلِّلة. كل ما هنا هو <b>الحزمة النقدية الشهرية الكاملة</b>:</p><ul><li>الراتب الأساسي</li><li>بدل السكن والمواصلات وأي بدل نقدي متكرر آخر</li><li>المكافأة السنوية مقسومة على 12</li></ul><p style=\"margin:.6em 0 0\">ولا تشمل الأسهم ولا مصاريف الانتقال لمرة واحدة ولا الرسوم الدراسية ولا التأمين الطبي — فهذه تتفاوت أكثر من أن يُحسب لها متوسط نزيه.</p>",
    "method.b3": "<ul><li>لا أسماء ولا بريد إلكتروني ولا تسجيل دخول. النموذج لا يجمع أي هوية.</li><li>اسم الشركة اختياري ولا يُعرض في أي صف — يُنشر <i>نوع</i> الشركة فقط.</li><li>الجنسية اختيارية، ولا تُعرض إلا كتجميع يضم <span id=\"minN2\">8</span> أشخاص على الأقل، ولا تظهر أبدًا في صف فردي.</li><li>تُراجَع المشاركات قبل النشر لإزالة أي شيء يكشف الهوية.</li></ul>",
    "method.b4": "<p style=\"margin:0\">عملات الخليج مربوطة بالدولار الأمريكي، لذا يستخدم التحويل أسعارًا ثابتة لا تغذية حيّة: 3.6725 درهم إماراتي، 3.75 ريال سعودي، 3.64 ريال قطري، 0.3065 دينار كويتي، 0.376 دينار بحريني، 0.3845 ريال عُماني لكل دولار.</p>",

    "check.explain": "{role}، مستوى {level}، {country}. براتب <b>{amount} {currency}</b> شهريًا يقع ذلك عند الشريحة <b>{pct}</b> تقريبًا.",
    "check.basisReal": "بناءً على {n} مشاركة حقيقية لهذا المسمى والمستوى والدولة.",
    "check.basisRef": "بناءً على <b>نطاق استرشادي</b> — لا توجد سوى {n} مشاركة حقيقية لهذه الفئة حتى الآن، ونحتاج {need} قبل نشر وسيط حقيقي. تعامل مع هذا كمؤشر تقريبي لا كحقيقة.",
    "tile.cohortsSubFmt": "{n} من بيانات حقيقية",
    "chart.tip": "{label}: {value} وسيط",
    "chart.tipN": "{n} مشاركة",
    "chart.tipRef": "استرشادي",

    "explore.emptyCompany": "النطاقات الاسترشادية لا تحمل نوع شركة، لذا يعرض هذا الفلتر المشاركات الحقيقية فقط. ولا توجد مشاركات بعد لهذا النوع.",
    "hero.statNoData": "لا بيانات بعد",
    "check.outOfRange": "يبدو هذا خطأً مطبعيًا. أدخل الحزمة الشهرية لا السنوية.",
    "check.basisRefNone": "بناءً على <b>نطاق استرشادي</b>. لا توجد مشاركات حقيقية لهذه الفئة بعد، ونحتاج {need} قبل نشر وسيط حقيقي. تعامل مع هذا كمؤشر تقريبي لا كحقيقة.",
    "table.caption": "وسيط الحزمة الشهرية الكاملة حسب المسمى الوظيفي والمستوى والدولة",
    "skip.link": "تخطَّ إلى المحتوى",

    "verdict.strong": "أعلى بكثير من السوق",
    "verdict.good": "أعلى من السوق",
    "verdict.fair": "في حدود السوق",
    "verdict.low": "أقل من السوق",
    "verdict.verylow": "أقل بكثير من السوق",
  },
};

// Taxonomy labels, keyed the same way as assets/js/data.js.
export const TAXONOMY = {
  ar: {
    role: {
      swe_be: "مهندس برمجيات — Backend",
      swe_fe: "مهندس برمجيات — Frontend",
      mobile: "مهندس تطبيقات الجوال",
      devops: "DevOps / SRE / المنصات",
      cloud: "مهندس حلول سحابية",
      data_eng: "مهندس بيانات",
      ds_ml: "عالم بيانات / تعلّم آلي",
      security: "مهندس أمن سيبراني",
      qa: "مهندس اختبار وجودة",
      pm: "مدير منتج",
      itsupport: "دعم فني / مسؤول أنظمة",
    },
    level: {
      junior: "مبتدئ", mid: "متوسط", senior: "متقدّم",
      lead: "قائد تقني", manager: "مدير", head: "رئيس قسم",
    },
    levelYrs: {
      junior: "0-2 سنة", mid: "3-5 سنوات", senior: "6-9 سنوات",
      lead: "10+ سنوات", manager: "قيادة فريق", head: "قيادة قسم",
    },
    country: {
      AE: "الإمارات", SA: "السعودية", QA: "قطر",
      KW: "الكويت", BH: "البحرين", OM: "عُمان",
    },
    company: {
      "Global MNC": "شركة عالمية متعددة الجنسيات",
      "Regional scale-up": "شركة إقليمية نامية",
      "Local enterprise": "شركة محلية كبيرة",
      "Startup": "شركة ناشئة",
      "Government / semi-gov": "حكومي / شبه حكومي",
      "Consultancy / outsourcing": "استشارات / إسناد خارجي",
    },
    currency: {
      USD: "دولار أمريكي", AED: "درهم إماراتي", SAR: "ريال سعودي",
      QAR: "ريال قطري", KWD: "دينار كويتي", BHD: "دينار بحريني", OMR: "ريال عُماني",
    },
  },
};

let current = "en";

export function getLang() { return current; }

export function setLang(lang, { updateUrl = true } = {}) {
  current = STRINGS[lang] ? lang : "en";
  const html = document.documentElement;
  html.setAttribute("lang", current);
  html.setAttribute("dir", STRINGS[current].dir);
  try { localStorage.setItem("gulfpay-lang", current); } catch {}

  // A crawler has no localStorage and sends no Arabic Accept-Language, so the
  // Arabic version needs a URL of its own to be reachable and indexable.
  if (updateUrl && window.history?.replaceState) {
    const url = new URL(window.location.href);
    if (current === "ar") url.searchParams.set("lang", "ar");
    else url.searchParams.delete("lang");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
}

export function restoreLang() {
  // URL wins, so a shared ?lang=ar link opens in Arabic whatever the visitor
  // last chose, and so Googlebot can crawl the Arabic version.
  let lang = null;
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (STRINGS[fromUrl]) lang = fromUrl;
  } catch {}
  if (!lang) { try { lang = localStorage.getItem("gulfpay-lang"); } catch {} }
  if (!STRINGS[lang]) lang = (navigator.language || "").startsWith("ar") ? "ar" : "en";
  setLang(lang);
  return current;
}

// Fill {placeholders} in a translated string.
export function tf(key, vars) {
  return String(t(key)).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
}

export function t(key) {
  return STRINGS[current][key] ?? STRINGS.en[key] ?? key;
}

// Translated taxonomy label, falling back to the English one in data.js.
export function tx(kind, key, fallback) {
  const table = TAXONOMY[current]?.[kind];
  return (table && table[key]) || fallback;
}

// Numbers stay in Latin digits in both languages: these are financial figures,
// and Gulf finance writes them this way even in Arabic copy.
export const NUM_LOCALE = "en-US";
