function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildEmailHtml({
  firstName, eventName, dateLong, localTimeRange, viewerTz,
  hostTimezone, meetingUrl, supportEmail,
}) {
  const safe = {
    firstName: escapeHtml(firstName),
    eventName: escapeHtml(eventName),
    dateLong: escapeHtml(dateLong),
    localTimeRange: escapeHtml(localTimeRange),
    viewerTz: escapeHtml(viewerTz),
    hostTimezone: escapeHtml(hostTimezone),
    meetingUrl: encodeURI(meetingUrl || ''),
    supportEmail: escapeHtml(supportEmail || ''),
  };
  const year = new Date().getFullYear();
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${safe.eventName}</title>
</head>
<body style="margin:0;padding:0;background:#f7f6f2;font-family:'Inter Tight',Arial,sans-serif;color:#0f1d33;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f6f2;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #dfe4ec;border-radius:8px;">
          <tr>
            <td style="padding:36px 40px 28px;">
              <h1 style="margin:0 0 14px;font-family:'Newsreader',Georgia,serif;font-size:28px;line-height:1.2;font-weight:500;color:#14315c;letter-spacing:-0.01em;">
                You're registered
              </h1>
              <p style="margin:0 0 22px;font-family:'Inter Tight',Arial,sans-serif;font-size:15px;line-height:1.6;color:#3a4a63;">
                Hi ${safe.firstName}, you're confirmed for ${safe.eventName}. Details below.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fbfaf6;border:1px solid #eef1f6;border-radius:6px;margin:0 0 24px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <div style="font-family:'Newsreader',Georgia,serif;font-size:18px;line-height:1.3;color:#0f1d33;font-weight:500;margin-bottom:4px;">
                      ${safe.dateLong}
                    </div>
                    <div style="font-family:'Inter Tight',Arial,sans-serif;font-size:14px;color:#0f1d33;margin-bottom:6px;">
                      ${safe.localTimeRange} <span style="color:#8794a8;">· ${safe.viewerTz}</span>
                    </div>
                    <div style="font-family:'Inter Tight',Arial,sans-serif;font-size:12px;color:#8794a8;">
                      Host time zone: ${safe.hostTimezone}
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;">
                <tr>
                  <td bgcolor="#1a3c6e" style="border-radius:6px;">
                    <a href="${safe.meetingUrl}" style="display:inline-block;padding:12px 24px;font-family:'Inter Tight',Arial,sans-serif;font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;border-radius:6px;">
                      Join the session
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-family:'Inter Tight',Arial,sans-serif;font-size:13px;line-height:1.5;color:#8794a8;">
                Add to calendar using the attached invite, or use the link above at the scheduled time.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 40px 28px;border-top:1px solid #eef1f6;">
              <p style="margin:0;font-family:'Inter Tight',Arial,sans-serif;font-size:12px;line-height:1.5;color:#8794a8;">
                Questions? <a href="mailto:${safe.supportEmail}" style="color:#5a6b82;text-decoration:none;">${safe.supportEmail}</a><br>
                © ${year} Organization Name
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildEmailText({
  firstName, eventName, dateLong, localTimeRange, viewerTz,
  hostTimezone, meetingUrl, supportEmail,
}) {
  return [
    `You're registered`,
    ``,
    `Hi ${firstName}, you're confirmed for ${eventName}.`,
    ``,
    `${dateLong}`,
    `${localTimeRange} · ${viewerTz}`,
    `Host time zone: ${hostTimezone}`,
    ``,
    `Join the session: ${meetingUrl}`,
    ``,
    `Add to calendar using the attached invite, or use the link above at the scheduled time.`,
    ``,
    `Questions? ${supportEmail}`,
  ].join('\n');
}
