/**
 * Google Apps Script Web App for ContactForm.astro (Ascend Professional
 * Institute). This is NOT deployed as part of the Astro build — it's a
 * reference copy of code you paste into a Google Sheet's Apps Script
 * editor. Google hosts and runs it; this site stays fully static.
 *
 * What it does: validates an incoming submission (mirroring the checks in
 * src/components/ContactForm.astro and public/contact-handler.php) and, if
 * valid, appends one row to a "Contact Submissions" tab in the bound
 * Sheet. Always returns HTTP 200 (Apps Script Web Apps can't set other
 * status codes from doPost) with a JSON body {ok, message} so the client
 * can tell success from a validation failure.
 *
 * Setup:
 *   1. Open (or create) the Google Sheet you want submissions tracked in.
 *   2. Extensions > Apps Script. Delete the placeholder code and paste
 *      this whole file in.
 *   3. Deploy > New deployment > type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. Authorize the script when prompted (it only needs access to this
 *      one Sheet).
 *   5. Copy the deployment's /exec URL into PUBLIC_FORM_ENDPOINT in .env.
 *   6. Any time you edit this script, use Deploy > Manage deployments >
 *      edit (pencil) > New version — the /exec URL stays the same, but
 *      edits don't reach the live deployment until you ship a new version.
 *
 * The sheet tab is created automatically (with a header row) on first
 * submission if it doesn't already exist.
 */

const SHEET_NAME = 'Contact Submissions';
const HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Reason for contacting'];

// Kept in sync with the client-side rules in ContactForm.astro.
const NAME_PATTERN = /^[A-Za-zÀ-ɏ' .-]{2,100}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;
const REASON_MIN_LENGTH = 10;
const REASON_MAX_LENGTH = 2000;

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};

    // Honeypot: real users never see or fill this field. A bot that does
    // gets a fake success response rather than a tell that the trap fired.
    if (params.company) {
      return respond(true, "Thanks! Your message has been sent — we'll be in touch shortly.");
    }

    const name = String(params.name || '').trim();
    const email = String(params.email || '').trim();
    const phone = String(params.phone || '').trim();
    const reason = String(params.reason || '').trim();

    const error = validate(name, email, phone, reason);
    if (error) {
      return respond(false, error);
    }

    appendSubmission([new Date(), name, email, phone, reason]);

    return respond(true, "Thanks! Your message has been sent — we'll be in touch shortly.");
  } catch (err) {
    return respond(false, 'Something went wrong. Please try again or email us directly.');
  }
}

function validate(name, email, phone, reason) {
  if (!name || !NAME_PATTERN.test(name)) {
    return 'Enter a valid name (letters only, 2–100 characters).';
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return 'Enter a valid email address.';
  }
  if (phone && !PHONE_PATTERN.test(phone)) {
    return 'Enter a valid phone number: digits only, optional leading + for country code (7–15 digits total).';
  }
  if (!reason || reason.length < REASON_MIN_LENGTH || reason.length > REASON_MAX_LENGTH) {
    return `Reason for contacting must be between ${REASON_MIN_LENGTH} and ${REASON_MAX_LENGTH} characters.`;
  }
  return null;
}

function appendSubmission(row) {
  getOrCreateSheet().appendRow(row);
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function respond(ok, message) {
  return ContentService.createTextOutput(JSON.stringify({ ok, message })).setMimeType(
    ContentService.MimeType.JSON
  );
}
