import { Resend } from 'resend';
import { createEvent } from 'ics';
import { getSheetsClient, rowsToObjects, headerIndex } from './_sheets.js';
import { buildEmailHtml, buildEmailText } from './_email.js';

const REQUIRED_FIELDS = [
  'fullName', 'role', 'institution', 'email',
  'country', 'timezone', 'sessionId',
];

// Countries whose registrations must include a state/province.
const COUNTRIES_WITH_SUBDIVISIONS = new Set([
  'United States', 'Canada', 'United Kingdom', 'Australia', 'India',
]);

function isEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function parseEmailAddress(input) {
  if (!input) return { name: undefined, email: '' };
  const m = input.match(/^\s*(.*?)\s*<\s*([^>]+)\s*>\s*$/);
  if (m) return { name: m[1] || undefined, email: m[2] };
  return { name: undefined, email: input.trim() };
}

function toUtcArray(d) {
  return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes()];
}

function formatDateLong(date, tz) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: tz,
  }).format(date);
}

function formatTimeRange(start, end, tz) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: tz,
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  for (const f of REQUIRED_FIELDS) {
    const v = body[f];
    if (typeof v !== 'string' || !v.trim()) {
      res.status(400).json({ error: `Missing required field: ${f}` });
      return;
    }
  }
  if (!isEmail(body.email)) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }
  if (COUNTRIES_WITH_SUBDIVISIONS.has(body.country)) {
    if (typeof body.region !== 'string' || !body.region.trim()) {
      res.status(400).json({ error: 'Missing required field: region' });
      return;
    }
  }

  const {
    fullName, role, institution, email, country, region,
    specialty, timezone, sessionId,
  } = body;

  try {
    const sheets = getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    const sessionsRes = await sheets.spreadsheets.values.get({
      spreadsheetId, range: 'Sessions!A:G',
    });
    const sessionRows = rowsToObjects(sessionsRes.data.values, [
      'id', 'datetime_iso', 'host_timezone', 'duration_minutes',
      'meeting_url', 'capacity', 'status',
    ]);
    const session = sessionRows.find((r) => r.id === sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    if (String(session.status || '').trim().toLowerCase() !== 'open') {
      res.status(409).json({ error: 'This session is full' });
      return;
    }
    const startMs = Date.parse(session.datetime_iso);
    if (Number.isNaN(startMs) || startMs <= Date.now()) {
      res.status(409).json({ error: 'This session is no longer available' });
      return;
    }
    const capacity = Number(session.capacity) || 0;
    const durationMinutes = Number(session.duration_minutes) || 60;
    const meetingUrl = session.meeting_url || '';
    const hostTimezone = session.host_timezone || 'UTC';

    if (capacity > 0) {
      const regsRes = await sheets.spreadsheets.values.get({
        spreadsheetId, range: 'Registrations!A:K',
      });
      const regRows = regsRes.data.values || [];
      let count = 0;
      if (regRows.length > 1) {
        const sessIdx = headerIndex(regRows[0], 'session_id');
        if (sessIdx >= 0) {
          for (let i = 1; i < regRows.length; i++) {
            if (regRows[i][sessIdx] === sessionId) count++;
          }
        }
      }
      if (count >= capacity) {
        res.status(409).json({ error: 'This session is full' });
        return;
      }
    }

    const timestamp = new Date().toISOString();
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Registrations!A:K',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          timestamp,
          fullName,
          role,
          institution,
          email,
          country,
          region || '',
          specialty || '',
          timezone,
          sessionId,
          session.datetime_iso,
        ]],
      },
    });

    const eventName = process.env.EVENT_NAME || 'Event Registration';
    const fromEmail = process.env.FROM_EMAIL;
    const fromAddr = parseEmailAddress(fromEmail);
    const start = new Date(startMs);
    const end = new Date(startMs + durationMinutes * 60 * 1000);

    const { error: icsError, value: icsValue } = createEvent({
      start: toUtcArray(start),
      startInputType: 'utc',
      duration: { minutes: durationMinutes },
      title: eventName,
      description: `${eventName}. Join: ${meetingUrl}`,
      location: meetingUrl,
      url: meetingUrl,
      organizer: { name: fromAddr.name || eventName, email: fromAddr.email },
      attendees: [{ name: fullName, email, rsvp: true, partstat: 'ACCEPTED' }],
      uid: `${sessionId.trim()}-${email.trim()}`,
    });
    if (icsError) throw icsError;

    const firstName = fullName.split(' ')[0];
    const dateLong = formatDateLong(start, timezone);
    const localTimeRange = formatTimeRange(start, end, timezone);
    const supportEmail = process.env.SUPPORT_EMAIL || '';

    const html = buildEmailHtml({
      firstName, eventName, dateLong, localTimeRange,
      viewerTz: timezone, hostTimezone, meetingUrl, supportEmail,
    });
    const text = buildEmailText({
      firstName, eventName, dateLong, localTimeRange,
      viewerTz: timezone, hostTimezone, meetingUrl, supportEmail,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const sendResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      reply_to: process.env.REPLY_TO_EMAIL,
      subject: `You're registered: ${eventName}`,
      html,
      text,
      attachments: [{
        filename: 'Protocol-IQ-Session.ics',
        content: Buffer.from(icsValue).toString('base64'),
      }],
    });
    if (sendResult && sendResult.error) {
      console.error('Resend rejected the email', sendResult.error);
      throw new Error(`Resend error: ${sendResult.error.message || JSON.stringify(sendResult.error)}`);
    }
    console.log('Resend accepted email', sendResult && sendResult.data && sendResult.data.id);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('POST /api/register failed', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}
