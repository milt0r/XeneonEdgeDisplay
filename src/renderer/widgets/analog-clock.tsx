import React, { useEffect, useState } from 'react';
import type { WidgetPlugin, WidgetComponentProps } from '@shared/widget-plugin';
import { useElementSize } from '../components/useElementSize';

interface Config {
  showSeconds: boolean;
  showNumbers: boolean;
  showDate: boolean;
  twentyFourHour: boolean;
}

const AnalogClock: React.FC<WidgetComponentProps<Config>> = ({ config, updateConfig, configOpen }) => {
  const [now, setNow] = useState(() => new Date());
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const cfg = { showSeconds: true, showNumbers: true, showDate: true, twentyFourHour: false, ...(config as Partial<Config>) };

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), cfg.showSeconds ? 1000 : 30000);
    return () => clearInterval(id);
  }, [cfg.showSeconds]);

  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hourBase = cfg.twentyFourHour ? now.getHours() : now.getHours() % 12;
  const hours = hourBase + minutes / 60;

  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = (minutes / 60) * 360;
  const hourAngle = (hours / (cfg.twentyFourHour ? 24 : 12)) * 360;

  const usable = Math.min(width, cfg.showDate ? height - 28 : height) - 16;
  const r = Math.max(40, usable / 2);

  return (
    <div ref={ref} className="analog-clock-wrap">
      {configOpen && (
        <div className="widget-config no-drag">
          <label className="cfg-toggle">
            <input
              type="checkbox"
              checked={cfg.showSeconds}
              onChange={(e) => updateConfig({ showSeconds: e.target.checked })}
            /> Seconds hand
          </label>
          <label className="cfg-toggle">
            <input
              type="checkbox"
              checked={cfg.showNumbers}
              onChange={(e) => updateConfig({ showNumbers: e.target.checked })}
            /> Numbers
          </label>
          <label className="cfg-toggle">
            <input
              type="checkbox"
              checked={cfg.showDate}
              onChange={(e) => updateConfig({ showDate: e.target.checked })}
            /> Date
          </label>
          <label className="cfg-toggle">
            <input
              type="checkbox"
              checked={cfg.twentyFourHour}
              onChange={(e) => updateConfig({ twentyFourHour: e.target.checked })}
            /> 24h
          </label>
        </div>
      )}
      <div className="analog-clock-face" style={{ width: r * 2, height: r * 2 }}>
        <svg viewBox="-100 -100 200 200" width={r * 2} height={r * 2}>
          {/* outer ring */}
          <circle cx={0} cy={0} r={96} fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth={2} />
          {/* hour ticks */}
          {Array.from({ length: cfg.twentyFourHour ? 24 : 12 }).map((_, i) => {
            const a = (i / (cfg.twentyFourHour ? 24 : 12)) * Math.PI * 2 - Math.PI / 2;
            const x1 = Math.cos(a) * 86;
            const y1 = Math.sin(a) * 86;
            const x2 = Math.cos(a) * 96;
            const y2 = Math.sin(a) * 96;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent)" strokeWidth={2.5} />;
          })}
          {/* minute ticks */}
          {!cfg.twentyFourHour && Array.from({ length: 60 }).map((_, i) => {
            if (i % 5 === 0) return null;
            const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
            const x1 = Math.cos(a) * 92;
            const y1 = Math.sin(a) * 92;
            const x2 = Math.cos(a) * 96;
            const y2 = Math.sin(a) * 96;
            return <line key={`m${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--fg-muted)" strokeWidth={1} />;
          })}
          {/* numbers */}
          {cfg.showNumbers && Array.from({ length: cfg.twentyFourHour ? 24 : 12 }).map((_, i) => {
            const num = cfg.twentyFourHour ? i : (i === 0 ? 12 : i);
            const a = (i / (cfg.twentyFourHour ? 24 : 12)) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(a) * 74;
            const y = Math.sin(a) * 74 + 6;
            return (
              <text key={`n${i}`} x={x} y={y} textAnchor="middle" fill="var(--fg)"
                style={{ fontFamily: 'var(--font-display)', fontSize: cfg.twentyFourHour ? 10 : 14 }}>
                {num}
              </text>
            );
          })}
          {/* hour hand */}
          <g transform={`rotate(${hourAngle})`}>
            <line x1={0} y1={8} x2={0} y2={-50} stroke="var(--fg)" strokeWidth={6} strokeLinecap="round" />
          </g>
          {/* minute hand */}
          <g transform={`rotate(${minuteAngle})`}>
            <line x1={0} y1={10} x2={0} y2={-78} stroke="var(--accent)" strokeWidth={4} strokeLinecap="round" />
          </g>
          {/* second hand */}
          {cfg.showSeconds && (
            <g transform={`rotate(${secondAngle})`}>
              <line x1={0} y1={18} x2={0} y2={-86} stroke="var(--accent-hot)" strokeWidth={1.5} strokeLinecap="round" />
              <circle cx={0} cy={-86} r={3} fill="var(--accent-hot)" />
            </g>
          )}
          <circle cx={0} cy={0} r={4} fill="var(--accent)" />
        </svg>
      </div>
      {cfg.showDate && (
        <div className="analog-clock-date">
          {now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      )}
    </div>
  );
};

export const AnalogClockWidget: WidgetPlugin<Config> = {
  id: 'analog-clock',
  title: 'Analog Clock',
  description: 'Themable analog clock with optional date and 24h mode',
  category: 'info',
  defaultSize: { w: 3, h: 2 },
  themeable: true,
  defaultConfig: { showSeconds: true, showNumbers: true, showDate: true, twentyFourHour: false },
  component: AnalogClock
};
