/**
 * TaraNidhi register.
 * Sheet: https://docs.google.com/spreadsheets/d/1KJfpLdpg00f1XgoeZsLTJsGxw1R9UNptTKPzzMLpJis/edit
 *
 * Deploy: Extensions → Apps Script → paste this file → Deploy → New deployment
 * → Web app → Execute as Me → Who has access: Anyone → Deploy.
 * Copy the /exec URL into Nidhi → Apps Script URL.
 */
const SHEET_ID = "1KJfpLdpg00f1XgoeZsLTJsGxw1R9UNptTKPzzMLpJis";
const TOKEN = "tn-ledger-v1";

function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || "{}");
    if (body.token !== TOKEN) return out({ ok: false, error: "token" });
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["name", "email", "whatsapp", "city", "plan", "at"]);
    }
    sheet.appendRow([
      String(body.name || ""),
      String(body.email || ""),
      String(body.whatsapp || ""),
      String(body.city || ""),
      String(body.plan || ""),
      String(body.at || new Date().toISOString()),
    ]);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doGet() {
  return out({ ok: true, app: "TaraNidhi" });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
