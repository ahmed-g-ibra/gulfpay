/**
 * Makes the existing GulfPay form bilingual, IN PLACE.
 *
 * It edits the form you already have, so the form link and the published CSV
 * keep working and nothing in config.js needs to change.
 *
 * HOW TO RUN
 *   1. Sign in to Google with the account that owns the form.
 *   2. https://script.google.com > New project.
 *   3. Paste this file in, replacing everything. Save.
 *   4. Run > translateGulfPayForm. Approve the permission prompt.
 *   5. Check View > Logs, then open the form to confirm.
 *
 * NOTE ON EXISTING RESPONSES
 *   Changing dropdown options does not rewrite answers already submitted.
 *   Run this while the form is still empty, or expect old rows to carry the
 *   old English-only values. The site parses both, so nothing breaks either way.
 */

// The response spreadsheet. The script finds the form from it, so you do not
// need the form ID.
var SHEET_ID = '1yRoQXVtlyI7T4utG2kOhiNGP8YT7uXTnadJ0rS4aGII';

var FORM_TITLE = 'Add your salary · أضف راتبك — GulfPay';

var FORM_DESCRIPTION = [
  'Anonymous. No name, no email, no login.',
  '',
  'A role + level + country group needs at least 5 submissions before any real',
  'number is shown for it, so your individual pay is never identifiable.',
  '',
  'Results: https://ahmed-g-ibra.github.io/gulfpay/',
  '',
  '— — —',
  '',
  'مجهول تمامًا. لا اسم ولا بريد إلكتروني ولا تسجيل دخول.',
  '',
  'تحتاج كل فئة (مسمى وظيفي + مستوى + دولة) إلى 5 مشاركات على الأقل قبل عرض أي',
  'رقم حقيقي لها، لذا لا يمكن تمييز راتبك الفردي أبدًا.',
  '',
  'النتائج: https://ahmed-g-ibra.github.io/gulfpay/'
].join('\n');

// Each entry: the keyword that identifies the existing question, the new
// bilingual title, help text, and dropdown options (null = free text).
// IMPORTANT: every title keeps its English keyword. The site maps spreadsheet
// columns by that keyword, so removing it would silently drop submissions.
var SPEC = [
  {
    "match": "role",
    "title": "Role · المسمى الوظيفي",
    "help": "",
    "options": [
      "Software Engineer (Backend) · مهندس برمجيات (Backend)",
      "Software Engineer (Frontend) · مهندس برمجيات (Frontend)",
      "Mobile Engineer · مهندس تطبيقات الجوال",
      "DevOps / SRE / Platform · DevOps / SRE / المنصات",
      "Cloud / Solutions Architect · مهندس حلول سحابية",
      "Data Engineer · مهندس بيانات",
      "Data Scientist / ML Engineer · عالم بيانات / تعلّم آلي",
      "Cybersecurity Engineer · مهندس أمن سيبراني",
      "QA / Test Engineer · مهندس اختبار وجودة",
      "Product Manager · مدير منتج",
      "IT Support / Sysadmin · دعم فني / مسؤول أنظمة"
    ]
  },
  {
    "match": "level",
    "title": "Level · المستوى",
    "help": "Pick by scope, not job title. · اختر حسب نطاق المسؤولية لا حسب المسمى.",
    "options": [
      "Junior · مبتدئ",
      "Mid · متوسط",
      "Senior · متقدّم",
      "Lead / Staff · قائد تقني",
      "Manager · مدير",
      "Head / Director · رئيس قسم"
    ]
  },
  {
    "match": "country",
    "title": "Country · الدولة",
    "help": "",
    "options": [
      "UAE · الإمارات",
      "Saudi Arabia · السعودية",
      "Qatar · قطر",
      "Kuwait · الكويت",
      "Bahrain · البحرين",
      "Oman · عُمان"
    ]
  },
  {
    "match": "city",
    "title": "City · المدينة",
    "help": "Optional. · اختياري.",
    "options": null
  },
  {
    "match": "company type",
    "title": "Company type · نوع الشركة",
    "help": "",
    "options": [
      "Global MNC · شركة عالمية متعددة الجنسيات",
      "Regional scale-up · شركة إقليمية نامية",
      "Local enterprise · شركة محلية كبيرة",
      "Startup · شركة ناشئة",
      "Government / semi-gov · حكومي / شبه حكومي",
      "Consultancy / outsourcing · استشارات / إسناد خارجي"
    ]
  },
  {
    "match": "years",
    "title": "Years of experience · سنوات الخبرة",
    "help": "Total, not just at the current company. · الإجمالي وليس في الشركة الحالية فقط.",
    "options": null
  },
  {
    "match": "currency",
    "title": "Currency · العملة",
    "help": "",
    "options": [
      "AED · درهم إماراتي",
      "SAR · ريال سعودي",
      "QAR · ريال قطري",
      "KWD · دينار كويتي",
      "BHD · دينار بحريني",
      "OMR · ريال عُماني"
    ]
  },
  {
    "match": "base",
    "title": "Monthly base salary · الراتب الأساسي الشهري",
    "help": "Numbers only. Base alone. · أرقام فقط. الراتب الأساسي وحده.",
    "options": null
  },
  {
    "match": "allowance",
    "title": "Monthly allowances (housing, transport, other cash) · البدلات الشهرية (سكن، مواصلات، نقدية أخرى)",
    "help": "Numbers only. Enter 0 if none. · أرقام فقط. أدخل 0 إن لم توجد.",
    "options": null
  },
  {
    "match": "bonus",
    "title": "Annual bonus (% of base) · المكافأة السنوية (% من الأساسي)",
    "help": "Optional. Enter 10 for 10%. · اختياري. أدخل 10 لـ 10%.",
    "options": null
  },
  {
    "match": "work mode",
    "title": "Work mode (onsite / hybrid / remote) · نمط العمل",
    "help": "Optional. · اختياري.",
    "options": [
      "Onsite · من المقر",
      "Hybrid · هجين",
      "Remote · عن بُعد"
    ]
  },
  {
    "match": "nationality",
    "title": "Nationality group · المجموعة حسب الجنسية",
    "help": "Optional. Only ever shown as an aggregate over 8+ people. · اختياري. لا تُعرض إلا كتجميع يضم 8 أشخاص أو أكثر.",
    "options": [
      "GCC national · مواطن خليجي",
      "Arab (Levant / Egypt / North Africa) · عربي (الشام / مصر / شمال أفريقيا)",
      "South Asian · جنوب آسيوي",
      "Southeast Asian · جنوب شرق آسيوي",
      "European / North American / ANZ · أوروبي / أمريكي شمالي / أسترالي",
      "African (Sub-Saharan) · أفريقي (جنوب الصحراء)",
      "Other · أخرى",
      "Prefer not to say · أفضّل عدم الإفصاح"
    ]
  }
];

function translateGulfPayForm() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var url = ss.getFormUrl();
  if (!url) throw new Error('No form is linked to that spreadsheet. Check SHEET_ID.');

  var form;
  try {
    form = FormApp.openByUrl(url);
  } catch (e) {
    var m = url.match(/[-\w]{25,}/);
    if (!m) throw new Error('Could not work out the form ID from: ' + url);
    form = FormApp.openById(m[0]);
  }

  form.setTitle(FORM_TITLE);
  form.setDescription(FORM_DESCRIPTION);

  var items = form.getItems();
  var used = {};
  var updated = 0, skipped = [];

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var title = String(item.getTitle() || '').toLowerCase();
    var spec = null;

    // First unused spec whose keyword appears in this question's title.
    // Order matters: "base" is claimed by the salary question before the
    // bonus question ("% of base") can take it.
    for (var s = 0; s < SPEC.length; s++) {
      if (used[s]) continue;
      if (title.indexOf(SPEC[s].match) !== -1) { spec = SPEC[s]; used[s] = true; break; }
    }

    if (!spec) { skipped.push(item.getTitle()); continue; }

    item.setTitle(spec.title);
    if (spec.help) item.setHelpText(spec.help);

    if (spec.options) {
      if (item.getType() === FormApp.ItemType.LIST) {
        item.asListItem().setChoiceValues(spec.options);
      } else if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
        item.asMultipleChoiceItem().setChoiceValues(spec.options);
      } else {
        skipped.push(item.getTitle() + ' (not a choice question)');
        continue;
      }
    }
    updated++;
  }

  Logger.log('=====================================================');
  Logger.log('Updated ' + updated + ' of ' + items.length + ' questions.');
  if (skipped.length) Logger.log('Skipped: ' + skipped.join(' | '));
  for (var k = 0; k < SPEC.length; k++) {
    if (!used[k]) Logger.log('NOT MATCHED in the form: ' + SPEC[k].title);
  }
  Logger.log('Form:  ' + form.getPublishedUrl());
  Logger.log('Edit:  ' + form.getEditUrl());
  Logger.log('=====================================================');
  Logger.log('Nothing to change in config.js — same form, same CSV.');
}
