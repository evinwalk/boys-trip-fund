function doPost(e) {
  try {
    // Handle both JSON body and form data
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch {
      payload = e.parameter;
    }

    const { date, member, amount, note, sheetId } = payload;

    if (!date || !member || !amount) {
      return buildResponse({ success: false, error: 'Missing fields' });
    }

    const ss = sheetId
      ? SpreadsheetApp.openById(sheetId)
      : SpreadsheetApp.getActiveSpreadsheet();

    let sheet = ss.getSheetByName('Payments');
    if (!sheet) {
      sheet = ss.insertSheet('Payments');
      sheet.appendRow(['Date', 'Member', 'Amount', 'Note']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }

    sheet.appendRow([date, member, parseFloat(amount), note || '']);
    return buildResponse({ success: true });

  } catch (err) {
    return buildResponse({ success: false, error: err.message });
  }
}

function doGet(e) {
  return buildResponse({ status: 'ok' });
}

function buildResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
