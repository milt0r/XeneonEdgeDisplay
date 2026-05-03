/**
 * Tiny ICS / VCALENDAR parser sufficient for VEVENT extraction.
 * Handles line continuations (RFC 5545 folded lines) and basic DATE / DATE-TIME.
 */
export interface CalEvent {
  uid: string;
  summary: string;
  start: number; // ms epoch
  end: number;
  location?: string;
  allDay: boolean;
}

export class CalendarProvider {
  async fetchIcs(url: string): Promise<{ ok: boolean; events?: CalEvent[]; error?: string }> {
    try {
      const u = url.replace(/^webcal:\/\//i, 'https://');
      const res = await fetch(u, {
        headers: { Accept: 'text/calendar, text/plain' },
        signal: AbortSignal.timeout(10_000)
      });
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
      const text = await res.text();
      const events = parseIcs(text);
      return { ok: true, events };
    } catch (e: any) {
      return { ok: false, error: String(e?.message ?? e) };
    }
  }
}

function parseIcs(raw: string): CalEvent[] {
  // Unfold lines: any line beginning with whitespace continues the previous.
  const unfolded = raw.replace(/\r?\n[ \t]/g, '');
  const lines = unfolded.split(/\r?\n/);
  const events: CalEvent[] = [];
  let cur: Partial<CalEvent> | null = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { cur = { allDay: false }; continue; }
    if (line === 'END:VEVENT') {
      if (cur && cur.uid && cur.summary != null && cur.start != null && cur.end != null) {
        events.push(cur as CalEvent);
      }
      cur = null;
      continue;
    }
    if (!cur) continue;
    const sep = line.indexOf(':');
    if (sep < 0) continue;
    const left = line.slice(0, sep);
    const value = line.slice(sep + 1);
    const [name, ...params] = left.split(';');
    const isDate = params.some((p) => /VALUE=DATE\b/i.test(p));
    if (name === 'UID') cur.uid = value;
    else if (name === 'SUMMARY') cur.summary = unescapeIcs(value);
    else if (name === 'LOCATION') cur.location = unescapeIcs(value);
    else if (name === 'DTSTART') { cur.start = parseDt(value, isDate); cur.allDay = isDate; }
    else if (name === 'DTEND') cur.end = parseDt(value, isDate);
  }
  return events.filter((e) => Number.isFinite(e.start) && Number.isFinite(e.end));
}

function parseDt(v: string, isDate: boolean): number {
  // Forms: 20251231, 20251231T180000Z, 20251231T180000 (floating local)
  if (isDate || /^\d{8}$/.test(v)) {
    const y = +v.slice(0, 4), m = +v.slice(4, 6) - 1, d = +v.slice(6, 8);
    return new Date(y, m, d).getTime();
  }
  const m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!m) return NaN;
  const y = +m[1], mo = +m[2] - 1, d = +m[3], h = +m[4], mi = +m[5], se = +m[6];
  return m[7] === 'Z'
    ? Date.UTC(y, mo, d, h, mi, se)
    : new Date(y, mo, d, h, mi, se).getTime();
}

function unescapeIcs(s: string): string {
  return s.replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}
