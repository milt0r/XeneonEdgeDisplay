import React, { useEffect, useState } from 'react';
import type { WidgetPlugin, WidgetComponentProps } from '@shared/widget-plugin';

interface Event {
  uid: string;
  summary: string;
  start: number;
  end: number;
  location?: string;
  allDay: boolean;
}

interface Config {
  icsUrl: string;
  daysAhead: number;
}

const DEFAULTS: Config = { icsUrl: '', daysAhead: 3 };

function formatTime(ms: number, allDay: boolean): string {
  const d = new Date(ms);
  if (allDay) return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  return d.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function relTime(ms: number): string {
  const diff = (ms - Date.now()) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return `in ${Math.round(diff / 60)} min`;
  if (diff < 86400) return `in ${Math.round(diff / 3600)} h`;
  return `in ${Math.round(diff / 86400)} d`;
}

const Calendar: React.FC<WidgetComponentProps<Config>> = ({ config, updateConfig, configOpen }) => {
  const cfg = { ...DEFAULTS, ...(config as Partial<Config>) };
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cfg.icsUrl) return;
    const refresh = async () => {
      const res = await window.api.calendar.fetchIcs(cfg.icsUrl);
      if (res.ok) {
        setError(null);
        const now = Date.now();
        const horizon = now + cfg.daysAhead * 24 * 60 * 60 * 1000;
        setEvents((res.events ?? []).filter((e: any) => e.end >= now && e.start <= horizon).sort((a: any, b: any) => a.start - b.start));
      } else {
        setError(res.error ?? 'Failed to load');
      }
    };
    refresh();
    const id = setInterval(refresh, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [cfg.icsUrl, cfg.daysAhead]);

  const next = events.find((e) => e.start > Date.now());

  return (
    <div className="col fill" style={{ gap: 8, minHeight: 0 }}>
      {configOpen && (
        <div className="widget-config no-drag">
          <div className="field-row" style={{ width: '100%' }}>
            <label>ICS URL (Google Calendar / iCloud / Outlook secret address)</label>
            <input
              value={cfg.icsUrl}
              onChange={(e) => updateConfig({ icsUrl: e.target.value })}
              placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
            />
          </div>
          <label className="cfg-toggle">
            Days ahead
            <input type="number" min={1} max={30}
              value={cfg.daysAhead}
              onChange={(e) => updateConfig({ daysAhead: Math.max(1, Number(e.target.value) || 3) })}
              style={{ width: 60 }} />
          </label>
        </div>
      )}
      {!cfg.icsUrl && <div className="muted mono">Tap the gear and paste an ICS URL.</div>}
      {error && <div className="mono" style={{ color: 'var(--warn)', fontSize: 12 }}>{error}</div>}
      {next && (
        <div className="cal-next">
          <div className="metric-label">NEXT</div>
          <div className="cal-next-title">{next.summary}</div>
          <div className="muted mono" style={{ fontSize: 12 }}>
            {relTime(next.start)} · {formatTime(next.start, next.allDay)}
            {next.location && ` · ${next.location}`}
          </div>
        </div>
      )}
      <div className="cal-list no-drag">
        {events.length === 0 && cfg.icsUrl && !error && <div className="muted mono">No upcoming events</div>}
        {events.map((e) => (
          <div key={e.uid} className="cal-item">
            <div className="cal-time mono">{formatTime(e.start, e.allDay)}</div>
            <div className="cal-summary">{e.summary}</div>
            {e.location && <div className="cal-loc mono muted">{e.location}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CalendarWidget: WidgetPlugin<Config> = {
  id: 'calendar',
  title: 'Calendar',
  description: 'Upcoming events from any ICS / iCal URL',
  category: 'info',
  defaultSize: { w: 4, h: 2 },
  themeable: true,
  defaultConfig: DEFAULTS,
  component: Calendar
};
