/**
 * Boys Trip Fund — Google Apps Script
 * 
 * Paste this entire file into your Apps Script project (script.google.com).
 * Deploy it as a Web App: Execute as "Me", Access "Anyone".
 * 
 * This handles POST requests from the web app to append payment rows
 * to your Google Sheet.
 */

const SHEET_NAME = 'Payments';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { date, member, amount, note, sheetId } = payload;

    if (!date || !member || !amount) {
      return jsonResponse({ success: false, error: 'Missing required fields' });
    }

    // Open the sheet (uses the sheetId from the payload, or falls back to the
    // sheet this script is bound to)
    const ss = sheetId
      ? SpreadsheetApp.openById(sheetId)
      : SpreadsheetApp.getActiveSpreadsheet();

    let sheet = ss.getSheetByName(SHEET_NAME);

    // Auto-create the sheet + header row if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Date', 'Member', 'Amount', 'Note']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }

    sheet.appendRow([date, member, parseFloat(amount), note || '']);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function doGet(e) {
  // Simple health-check endpoint
  return jsonResponse({ status: 'Boys Trip Fund Apps Script is running' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
