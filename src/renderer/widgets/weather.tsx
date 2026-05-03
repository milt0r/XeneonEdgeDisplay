import React from 'react';
import type { WidgetPlugin } from '@shared/widget-plugin';
import { useApp } from '../store/app';
import { useElementSize } from '../components/useElementSize';

const ICONS: Record<number, string> = {
  0: '☀', 1: '🌤', 2: '⛅', 3: '☁', 45: '🌫', 48: '🌫',
  51: '🌦', 53: '🌦', 55: '🌧', 61: '🌧', 63: '🌧', 65: '🌧',
  71: '🌨', 73: '🌨', 75: '❄', 80: '🌧', 81: '🌧', 82: '⛈',
  95: '⛈', 96: '⛈', 99: '⛈'
};

const HOUR_ITEM_MIN_WIDTH = 56; // px
const COMPACT_BREAKPOINT = 280;
const TINY_BREAKPOINT = 200;

const Weather: React.FC = () => {
  const weather = useApp((s) => s.weather);
  const settings = useApp((s) => s.settings);
  const { ref, width, height } = useElementSize<HTMLDivElement>();

  const fmt = (c: number) =>
    settings?.weather.units === 'imperial'
      ? `${Math.round(c * 9 / 5 + 32)}°`
      : `${Math.round(c)}°`;

  if (!weather) {
    return (
      <div ref={ref} className="col fill center">
        <div className="muted mono">No weather data yet…</div>
      </div>
    );
  }

  const c = weather.current;
  const tiny = width > 0 && width < TINY_BREAKPOINT;
  const compact = width > 0 && width < COMPACT_BREAKPOINT;

  // Approx room above hourly strip
  const headerHeight = tiny ? 100 : compact ? 120 : 150;
  const showHourly = !tiny && height > headerHeight + 60;
  const hourlyAvail = Math.max(0, width - 16);
  const hourSlots = Math.max(0, Math.floor(hourlyAvail / HOUR_ITEM_MIN_WIDTH));
  const hours = showHourly ? weather.hourly.slice(0, hourSlots) : [];

  const iconSize = tiny ? 36 : compact ? 44 : 64;
  const tempSize = tiny ? 36 : compact ? 44 : 56;

  return (
    <div ref={ref} className="weather-widget">
      <div className="weather-top">
        <div style={{ fontSize: iconSize, lineHeight: 1 }}>{ICONS[c.conditionCode] ?? '·'}</div>
        <div className="weather-meta">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: tempSize, color: 'var(--accent)', lineHeight: 1 }}>
            {fmt(c.tempC)}
          </div>
          {!tiny && (
            <div className="muted mono" style={{ fontSize: 13 }}>
              {c.conditionText} · feels {fmt(c.feelsLikeC)}
            </div>
          )}
          {!compact && (
            <div className="muted mono" style={{ fontSize: 11 }}>
              {weather.location} · {c.humidity}% RH · {Math.round(c.windKph)} km/h
            </div>
          )}
        </div>
      </div>
      {hours.length > 0 && (
        <div className="hourly">
          {hours.map((h) => {
            const d = new Date(h.time);
            return (
              <div key={h.time} className="hourly-item">
                <span>{d.getHours().toString().padStart(2, '0')}</span>
                <span style={{ fontSize: 18 }}>{ICONS[h.conditionCode] ?? '·'}</span>
                <span className="t">{fmt(h.tempC)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const WeatherWidget: WidgetPlugin = {
  id: 'weather',
  title: 'Weather',
  description: 'Current conditions and adaptive hourly forecast',
  category: 'info',
  defaultSize: { w: 4, h: 2 },
  themeable: true,
  component: Weather
};
