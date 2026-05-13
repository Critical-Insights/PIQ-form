# Event Registration

A Vite + React form that lists upcoming sessions from Google Sheets, accepts registrations, and emails a confirmation with a calendar invite.

## Stack

- Frontend: Vite + React
- Serverless: Vercel functions (`/api/*`)
- Storage: Google Sheets (via `googleapis` with a service account)
- Email: Resend (`resend`)
- Calendar invite: `ics`

## Google Sheet structure

Create one spreadsheet with two tabs. Header rows must match exactly (case-insensitive, but order recommended for readability).

### Tab: `Sessions`

| id | datetime_iso         | host_timezone     | duration_minutes | meeting_url             | capacity | status |
| -- | -------------------- | ----------------- | ---------------- | ----------------------- | -------- | ------ |
| s1 | 2026-06-04T21:00:00Z | America/Vancouver | 60               | https://zoom.us/j/example | 20       | open   |

- `datetime_iso` is UTC (ISO 8601, `Z` suffix).
- `status` must be `open` for the row to be returned by `/api/sessions`. Past sessions are filtered out automatically.
- `meeting_url` and `capacity` are server-side only — never sent to the browser until after registration.

### Tab: `Registrations`

Header row (10 columns):

```
timestamp | full_name | title | organization | email | country | category | timezone | session_id | session_datetime_iso
```

`/api/register` appends rows here.

## Google service account setup

1. **Create a project** in the [Google Cloud Console](https://console.cloud.google.com/).
2. **Enable the Google Sheets API**: APIs & Services → Library → search "Google Sheets API" → Enable.
3. **Create a service account**: IAM & Admin → Service Accounts → Create Service Account. Give it any name; no roles needed.
4. **Create a JSON key** for the service account (Keys tab → Add Key → JSON). Download it.
5. **Share the Sheet** with the service account email (e.g. `name@project.iam.gserviceaccount.com`) as an **Editor**. The append-row call needs write access.
6. Pull these values out of the JSON key into env vars:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` → `client_email`
   - `GOOGLE_PRIVATE_KEY` → `private_key`. Replace real newlines with `\n` and wrap in double quotes.

## Resend setup

1. Sign up at [resend.com](https://resend.com).
2. **Verify a sending domain** under Domains. You'll need to add DNS records (SPF, DKIM). Sending from an unverified domain will hard-fail.
3. Create an **API key** under API Keys. Set as `RESEND_API_KEY`.
4. Set `FROM_EMAIL` to an address on your verified domain. Either bare (`noreply@yourdomain.com`) or display form (`Organization Name <noreply@yourdomain.com>`).
5. Set `REPLY_TO_EMAIL` to wherever attendee replies should land.

## Environment variables

Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

All required:

| Var | Purpose |
| --- | --- |
| `GOOGLE_SHEETS_ID` | Spreadsheet ID from the Sheet URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email |
| `GOOGLE_PRIVATE_KEY` | Service account private key (with `\n` newline escapes) |
| `RESEND_API_KEY` | Resend API key |
| `FROM_EMAIL` | Sender — must be on a Resend-verified domain |
| `REPLY_TO_EMAIL` | Address for attendee replies |
| `EVENT_NAME` | Used in email subject/body and .ics title |
| `SUPPORT_EMAIL` | Shown in the email footer |

## Local development

Two ways to run locally:

### Frontend only (no API)

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. `/api/*` calls will 404 — fine for working on the UI.

### Full stack with serverless functions

Install the Vercel CLI once, then:

```bash
npm install -g vercel
vercel dev
```

`vercel dev` reads `.env.local` and serves both the Vite frontend and the `/api/*` functions on a single port (usually 3000).

## Deploy to Vercel

1. Push the repo to GitHub.
2. In Vercel, **Import Project** and point it at the repo. Vercel auto-detects Vite.
3. Under **Project Settings → Environment Variables**, add every var from `.env.example` (for the Production environment at minimum; add Preview/Development too if you want PR previews to work end-to-end).
4. Deploy. The `/api/sessions` and `/api/register` functions are picked up automatically from the `api/` directory.

## API

### `GET /api/sessions`

Returns upcoming open sessions, sorted soonest first. The client never sees `meeting_url` or `capacity`.

```json
{
  "sessions": [
    {
      "id": "s1",
      "datetimeIso": "2026-06-04T21:00:00Z",
      "hostTimezone": "America/Vancouver",
      "durationMinutes": 60
    }
  ]
}
```

### `POST /api/register`

Request body:

```json
{
  "fullName": "...",
  "role": "...",
  "institution": "...",
  "email": "name@example.com",
  "country": "United States",
  "region": "California",
  "specialty": "Option A",
  "timezone": "America/Los_Angeles",
  "sessionId": "s1"
}
```

Responses:

- `200 { "success": true }` — registered, email sent.
- `400 { "error": "Missing required field: ..." }` — validation failure.
- `404 { "error": "Session not found" }` — `sessionId` is unknown.
- `409 { "error": "This session is full" }` — capacity reached or session no longer open.
- `500 { "error": "Registration failed. Please try again." }` — unexpected error.

## Notes

- **Race on capacity.** The capacity check reads the Registrations tab, counts rows for the session, then appends. Two simultaneous requests at the capacity boundary can both pass the check and both append, putting the session slightly over capacity. Fine at low concurrency; if you need stronger consistency, move off Sheets.
- **Server-side validation only.** Required fields, email format, session existence, capacity, and "session in the future" are all enforced server-side. Client validation is convenience, not authority.
