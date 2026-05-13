import { google } from 'googleapis';

export function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!email || !key) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY');
  }
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export function headerIndex(headerRow, name) {
  return headerRow.findIndex((h) => String(h || '').trim().toLowerCase() === name);
}

export function rowsToObjects(rows, fields) {
  if (!rows || rows.length < 2) return [];
  const header = rows[0];
  const idx = {};
  for (const f of fields) idx[f] = headerIndex(header, f);
  return rows.slice(1).map((r) => {
    const o = {};
    for (const f of fields) o[f] = idx[f] >= 0 ? r[idx[f]] : undefined;
    return o;
  });
}
