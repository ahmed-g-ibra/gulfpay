/**
 * Builds the GulfPay submission form and its linked response sheet.
 *
 * HOW TO RUN
 *   1. Sign in to Google with your PERSONAL account (not a work one).
 *   2. Go to https://script.google.com and start a new project.
 *   3. Replace everything in the editor with this file, then Save.
 *   4. Run > createGulfPayForm. Approve the permission prompt.
 *   5. View > Logs. Copy the two URLs it prints.
 *
 * Option lists are generated from assets/js/data.js. If you change the roles,
 * levels or countries there, regenerate this file or the site will drop
 * submissions it cannot match.
 */

var ROLES = ["Software Engineer (Backend)", "Software Engineer (Frontend)", "Mobile Engineer", "DevOps / SRE / Platform", "Cloud / Solutions Architect", "Data Engineer", "Data Scientist / ML Engineer", "Cybersecurity Engineer", "QA / Test Engineer", "Product Manager", "IT Support / Sysadmin"];
var LEVELS = ["Junior", "Mid", "Senior", "Lead / Staff", "Manager", "Head / Director"];
var COUNTRIES = ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"];
var COMPANY_TYPES = ["Global MNC", "Regional scale-up", "Local enterprise", "Startup", "Government / semi-gov", "Consultancy / outsourcing"];
var CURRENCIES = ["AED", "SAR", "QAR", "KWD", "BHD", "OMR"];
var WORK_MODES = ["Onsite", "Hybrid", "Remote"];
var NATIONALITY_GROUPS = ["GCC national", "Arab (Levant / Egypt / North Africa)", "South Asian", "Southeast Asian", "European / North American / ANZ", "African (Sub-Saharan)", "Other", "Prefer not to say"];

var DESCRIPTION = [
  'Anonymous. No name, no email, no login.',
  '',
  'Your figures are published only as an aggregate. A role + level + country',
  'group needs at least 5 submissions before any real number is shown for it,',
  'so your individual pay is never identifiable.',
  '',
  'Takes about a minute. See the results at https://ahmed-g-ibra.github.io/gulfpay/'
].join('\n');

function createGulfPayForm() {
  var form = FormApp.create('Add your salary \u2014 GulfPay');
  form.setDescription(DESCRIPTION);
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(true);

  // Only exists on Workspace domains; harmless to skip on a personal account.
  try { form.setRequireLogin(false); } catch (e) {}

  dropdown(form, 'Role', ROLES, true, '');
  dropdown(form, 'Level', LEVELS, true,
    'Pick by scope, not job title \u2014 titles are inflated inconsistently across the region.');
  dropdown(form, 'Country', COUNTRIES, true, '');
  text(form, 'City', false, 'Optional.');
  dropdown(form, 'Company type', COMPANY_TYPES, true, '');
  text(form, 'Years of experience', true, 'Total, not just at the current company.');
  dropdown(form, 'Currency', CURRENCIES, true, '');
  text(form, 'Monthly base salary', true,
    'Numbers only. Base alone \u2014 allowances go in the next question.');
  text(form, 'Monthly allowances (housing, transport, other cash)', true,
    'Numbers only. Enter 0 if your package has none.');
  text(form, 'Annual bonus (% of base)', false,
    'Optional. Numbers only \u2014 e.g. enter 10 for a 10% bonus.');
  dropdown(form, 'Work mode (onsite / hybrid / remote)', WORK_MODES, false, 'Optional.');
  dropdown(form, 'Nationality group', NATIONALITY_GROUPS, false,
    'Optional, and only ever reported as an aggregate over 8 or more people.');

  var sheet = SpreadsheetApp.create('GulfPay \u2014 responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Newer Forms require an explicit publish before they accept responses.
  try { form.setPublished(true); } catch (e) {}

  var shortUrl = form.getPublishedUrl();
  try { shortUrl = form.shortenFormUrl(form.getPublishedUrl()); } catch (e) {}

  Logger.log('=====================================================');
  Logger.log('FORM URL  -> ' + shortUrl);
  Logger.log('SHEET URL -> ' + sheet.getUrl());
  Logger.log('EDIT FORM -> ' + form.getEditUrl());
  Logger.log('=====================================================');
  Logger.log('Still to do by hand, in the sheet above:');
  Logger.log('  File > Share > Publish to web > the responses tab > CSV > Publish');
  Logger.log('Then send both the FORM URL and that CSV URL to Claude.');
}

function dropdown(form, title, values, required, help) {
  var item = form.addListItem().setTitle(title).setChoiceValues(values).setRequired(required);
  if (help) item.setHelpText(help);
  return item;
}

function text(form, title, required, help) {
  var item = form.addTextItem().setTitle(title).setRequired(required);
  if (help) item.setHelpText(help);
  return item;
}
