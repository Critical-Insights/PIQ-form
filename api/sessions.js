import { getSheetsClient, rowsToObjects } from './_sheets.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const sheets = getSheetsClient();
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Sessions!A:G',
    });

    const fields = ['id', 'datetime_iso', 'host_timezone', 'duration_minutes', 'status'];
    const rows = rowsToObjects(result.data.values, fields);

    const now = Date.now();
    const sessions = rows
      .filter((r) => r.id && r.datetime_iso)
      .filter((r) => String(r.status || '').trim().toLowerCase() === 'open')
      .filter((r) => {
        const t = Date.parse(r.datetime_iso);
        return !Number.isNaN(t) && t > now;
      })
      .sort((a, b) => Date.parse(a.datetime_iso) - Date.parse(b.datetime_iso))
      .map((r) => ({
        id: r.id,
        datetimeIso: r.datetime_iso,
        hostTimezone: r.host_timezone || 'UTC',
        durationMinutes: Number(r.duration_minutes) || 60,
      }));

    res.status(200).json({ sessions });
  } catch (err) {
    console.error('GET /api/sessions failed', err);
    res.status(500).json({ error: 'Failed to load sessions' });
  }
}
