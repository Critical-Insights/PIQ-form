export function viewerTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

const TZ_LABELS = {
  'America/Los_Angeles': { region: 'Pacific Time',      cities: ['Los Angeles', 'Vancouver', 'Seattle'] },
  'America/Vancouver':   { region: 'Pacific Time',      cities: ['Vancouver', 'Los Angeles', 'Seattle'] },
  'America/Denver':      { region: 'Mountain Time',     cities: ['Denver', 'Calgary', 'Salt Lake City'] },
  'America/Edmonton':    { region: 'Mountain Time',     cities: ['Edmonton', 'Calgary', 'Denver'] },
  'America/Phoenix':     { region: 'Arizona Time',      cities: ['Phoenix', 'Tucson'] },
  'America/Chicago':     { region: 'Central Time',      cities: ['Chicago', 'Dallas', 'Mexico City'] },
  'America/Winnipeg':    { region: 'Central Time',      cities: ['Winnipeg', 'Chicago', 'Dallas'] },
  'America/New_York':    { region: 'Eastern Time',      cities: ['New York', 'Toronto', 'Atlanta'] },
  'America/Toronto':     { region: 'Eastern Time',      cities: ['Toronto', 'New York', 'Montreal'] },
  'America/Halifax':     { region: 'Atlantic Time',     cities: ['Halifax', 'Saint John'] },
  'America/St_Johns':    { region: 'Newfoundland Time', cities: ["St. John's"] },
  'America/Anchorage':   { region: 'Alaska Time',       cities: ['Anchorage', 'Juneau'] },
  'Pacific/Honolulu':    { region: 'Hawaii Time',       cities: ['Honolulu'] },
};

function cityFromTz(tz) {
  const last = (tz || '').split('/').pop() || tz || '';
  return last.replace(/_/g, ' ');
}

function offsetForTz(tz, when = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'longOffset',
    }).formatToParts(when);
    const raw = (parts.find((p) => p.type === 'timeZoneName') || {}).value || 'GMT+00:00';
    const norm = raw.replace(/−/g, '-');
    if (norm === 'GMT' || norm === 'UTC') return 'GMT+00:00';
    const m = norm.match(/GMT([+-])(\d{1,2}):?(\d{0,2})/);
    if (m) {
      const sign = m[1];
      const h = m[2].padStart(2, '0');
      const min = (m[3] || '00').padStart(2, '0');
      return `GMT${sign}${h}:${min}`;
    }
    return norm;
  } catch {
    return 'GMT+00:00';
  }
}

export function formatTimezoneLabel(tz, when = new Date()) {
  if (!tz) return '';
  const offset = offsetForTz(tz, when);
  const entry = TZ_LABELS[tz];
  if (entry) {
    return `(${offset}) ${entry.region} — ${entry.cities.join(', ')}`;
  }
  return `(${offset}) ${cityFromTz(tz)}`;
}

export function formatSessionForDisplay(s, tz = viewerTimezone()) {
  const start = new Date(s.datetimeIso);
  const end = new Date(start.getTime() + (s.durationMinutes || 60) * 60 * 1000);
  const dateLong = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: tz,
  }).format(start);
  const timeFmt = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: tz,
  });
  return {
    ...s,
    dateLong,
    localTimeRange: `${timeFmt.format(start)} – ${timeFmt.format(end)}`,
  };
}
