# Boys Trip Fund — Setup Guide

This app uses Google Sheets as its database. You only need to do this once.
The whole process takes about 15 minutes.

---

## Step 1 — Create the Google Sheet

1. Go to https://sheets.google.com and create a **new blank spreadsheet**.
2. Name it something like **Boys Trip Fund 2026**.
3. On the first sheet tab, name the tab **Payments** (right-click the tab → Rename).
4. Add this header row in row 1:
   ```
   A1: Date    B1: Member    C1: Amount    D1: Note
   ```
5. Copy the **Sheet ID** from the URL bar:
   ```
   https://docs.google.com/spreadsheets/d/THIS_IS_YOUR_SHEET_ID/edit
   ```
   Save it — you'll need it in Step 3.

---

## Step 2 — Get a Google Sheets API Key (for reading)

1. Go to https://console.cloud.google.com
2. Create a new project (or use an existing one).
3. In the left sidebar: **APIs & Services → Library**
4. Search for **Google Sheets API** and click **Enable**.
5. Go to **APIs & Services → Credentials**
6. Click **+ Create Credentials → API Key**.
7. Copy the key. (Optional but recommended: restrict it to Sheets API only.)

---

## Step 3 — Deploy the Apps Script (for writing)

The app writes new payment rows via a Google Apps Script web app.
This avoids exposing OAuth credentials in the frontend.

1. Go to https://script.google.com
2. Click **New Project**.
3. Delete the default `myFunction()` code.
4. Open the file **apps-script.gs** from this package and paste its entire contents.
5. Click the **Save** icon (or Ctrl+S). Name the project **Boys Trip Fund**.
6. Click **Deploy → New deployment**.
7. Click the gear icon next to **Type** and select **Web app**.
8. Set:
   - **Description**: Boys Trip Fund v1
   - **Execute as**: Me
   - **Who has access**: Anyone
9. Click **Deploy**. Authorize when prompted.
10. Copy the **Web app URL** — it looks like:
    ```
    https://script.google.com/macros/s/XXXXXXXX/exec
    ```

---

## Step 4 — Configure index.html

Open `index.html` and find the `CONFIG` object near the top of the `<script>` tag:

```javascript
const CONFIG = {
  sheetId:       '',   // ← paste your Sheet ID from Step 1
  apiKey:        '',   // ← paste your API Key from Step 2
  appsScriptUrl: '',   // ← paste your Web App URL from Step 3
  tripGoal:      1500, // ← set your total fund goal
  members:       ['Devaughn', 'Friend 1', 'Friend 2'], // ← real names
};
```

Fill in the four values and save. That's it.

---

## Step 5 — Deploy to Cloudflare Pages

1. Push `index.html` to a GitHub repo (just the one file is fine).
2. Go to https://pages.cloudflare.com
3. Connect your GitHub repo.
4. Build settings: leave blank (no framework, no build command).
5. Deploy. Cloudflare gives you a URL like `boys-trip-fund.pages.dev`.
6. Share that URL with your friends.

---

## How it works day-to-day

- **Reading** (balance, history): the app calls the Sheets API directly with your read-only API key. Anyone with the link can view.
- **Writing** (log a payment): the app POSTs to your Apps Script web app, which appends a row to the sheet on your behalf.
- **Auto-refresh**: the page refreshes data every 60 seconds automatically.

---

## Customizing

| Thing to change | Where |
|---|---|
| Trip goal amount | `CONFIG.tripGoal` in `index.html` |
| Member names | `CONFIG.members` array in `index.html` |
| Trip year in header | `CONFIG.tripYear` or auto-detected |
| Sheet/tab name | `CONFIG.sheetName` (default: `Payments`) |

---

## Troubleshooting

**"Offline" status in the header**
→ Check that your Sheet ID and API Key are correct and the Sheets API is enabled.

**Payments log but don't appear**
→ The Sheets API has a short cache. Wait 10–15 seconds and refresh.

**"Error saving" on submit**
→ Re-check your Apps Script URL. Re-deploy the script if needed (Deploy → Manage deployments → Edit → New version).

**CORS error in console**
→ This is normal on localhost. Deploy to Cloudflare Pages and test from there.
