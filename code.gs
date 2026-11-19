/**
 * Kasuni & Shasanka — Wedding RSVP + Wishes (Google Apps Script Web App)
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1XnmI4od9wEsKaBby1DcuTMm3I9w23rQMbZyPmBhEraU/edit
 *
 * The "RSVP" and "Wishes" sheets are created automatically (with styled headers)
 * the first time anything is submitted — or run `setup()` once from the editor.
 *
 * Deploy: Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Then paste the "/exec" URL into GOOGLE_SCRIPT_URL in src/invitation.ts.
 */

const SPREADSHEET_ID = "1XnmI4od9wEsKaBby1DcuTMm3I9w23rQMbZyPmBhEraU";
const TIME_ZONE = "Asia/Colombo";

const SHEETS = {
  rsvp: {
    name: "RSVP",
    headers: ["Timestamp", "Name", "Attendance", "Guests", "Invited As"],
    widths: [170, 220, 120, 80, 220],
  },
  wish: {
    name: "Wishes",
    headers: ["Timestamp", "Name", "Message", "Invited As"],
    widths: [170, 220, 480, 220],
  },
};

const MAX_LENGTH = { name: 120, message: 2000 };

/* ------------------------------------------------------------------ */
/*  Entry points                                                       */
/* ------------------------------------------------------------------ */

function doPost(e) {
  return handleRequest_(e);
}

function doGet(e) {
  const params = parseParams_(e);
  if (!params.action) {
    return jsonResponse_({ ok: true, message: "Wedding RSVP API is running" });
  }
  return handleRequest_(e);
}

/** Run once manually from the Apps Script editor to create both sheets up front. */
function setup() {
  getSheet_(SHEETS.rsvp);
  getSheet_(SHEETS.wish);
}

/* ------------------------------------------------------------------ */
/*  Request handling                                                   */
/* ------------------------------------------------------------------ */

function handleRequest_(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const params = parseParams_(e);
    const action = String(params.action || "").trim().toLowerCase();

    if (!action) return jsonResponse_({ ok: false, message: "Missing action" });
    if (action === "rsvp") return jsonResponse_(saveRsvp_(params));
    if (action === "wish" || action === "wishes") return jsonResponse_(saveWish_(params));

    return jsonResponse_({ ok: false, message: "Invalid action" });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: error && error.message ? error.message : "Unexpected error",
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {}
  }
}

function saveRsvp_(params) {
  const name = clean_(params.name, MAX_LENGTH.name);
  if (!name) return { ok: false, message: "Name is required" };

  const guests = clean_(params.guests, 3) || "1";
  const attendance = guests === "0" ? "Not Attending" : "Attending";
  const invitedAs = clean_(params.invitedAs, MAX_LENGTH.name);

  const sheet = getSheet_(SHEETS.rsvp);
  sheet.appendRow([timestamp_(), name, attendance, guests === "0" ? 0 : Number(guests) || 1, invitedAs]);

  return { ok: true, message: "RSVP saved" };
}

function saveWish_(params) {
  const name = clean_(params.name, MAX_LENGTH.name);
  const message = clean_(params.message, MAX_LENGTH.message);
  if (!name || !message) return { ok: false, message: "Name and message are required" };

  const invitedAs = clean_(params.invitedAs, MAX_LENGTH.name);

  const sheet = getSheet_(SHEETS.wish);
  sheet.appendRow([timestamp_(), name, message, invitedAs]);

  return { ok: true, message: "Wish saved" };
}

/* ------------------------------------------------------------------ */
/*  Sheets                                                             */
/* ------------------------------------------------------------------ */

/** Returns the sheet, creating it and its header row if needed. */
function getSheet_(config) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(config.name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(config.name);
  }

  if (sheet.getLastRow() === 0) {
    writeHeader_(sheet, config);
  }

  return sheet;
}

function writeHeader_(sheet, config) {
  const header = sheet.getRange(1, 1, 1, config.headers.length);

  header
    .setValues([config.headers])
    .setFontWeight("bold")
    .setFontColor("#fffcf3")
    .setBackground("#8a6424")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 32);

  config.widths.forEach(function (width, i) {
    sheet.setColumnWidth(i + 1, width);
  });

  // Wrap long text (e.g. wish messages) and keep timestamps readable
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, config.headers.length).setWrap(true).setVerticalAlignment("top");
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function timestamp_() {
  return Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd HH:mm:ss");
}

/** Trim, limit length, and neutralise spreadsheet formula injection. */
function clean_(value, maxLength) {
  let text = String(value == null ? "" : value).trim().slice(0, maxLength);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function parseParams_(e) {
  const params = Object.assign({}, (e && e.parameter) || {});

  if (!(e && e.postData && e.postData.contents)) return params;

  const contents = String(e.postData.contents || "").trim();
  if (!contents) return params;

  if (contents.charAt(0) === "{") {
    try {
      return Object.assign(params, JSON.parse(contents));
    } catch (ignored) {
      return params;
    }
  }

  return Object.assign(params, parseFormEncoded_(contents));
}

function parseFormEncoded_(raw) {
  const result = {};
  const pairs = String(raw || "").split("&");

  for (let i = 0; i < pairs.length; i++) {
    if (!pairs[i]) continue;
    const parts = pairs[i].split("=");
    const key = decodeURIComponent((parts[0] || "").replace(/\+/g, " "));
    const value = decodeURIComponent((parts.slice(1).join("=") || "").replace(/\+/g, " "));
    if (key) result[key] = value;
  }

  return result;
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
