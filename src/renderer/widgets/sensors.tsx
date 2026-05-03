import React, { useEffect, useRef } from 'react';
import type { WidgetPlugin, WidgetComponentProps } from '@shared/widget-plugin';
import { useApp } from '../store/app';
import { useElementSize } from '../components/useElementSize';

interface Config {
  showCpuTemp: boolean;
  showCpuLoad: boolean;
  showCpuPower: boolean;
  showGpuTemp: boolean;
  showGpuLoad: boolean;
  showGpuPower: boolean;
  showMem: boolean;
  showSparklines: boolean;
  showSourceFooter: boolean;
}

const DEFAULTS: Config = {
  showCpuTemp: true,
  showCpuLoad: true,
  showCpuPower: false,
  showGpuTemp: true,
  showGpuLoad: true,
  showGpuPower: false,
  showMem: false,
  showSparklines: true,
  showSourceFooter: true
};

function Sparkline({ data, max = 100, height = 32 }: { data: number[]; max?: number; height?: number }) {
  const w = 200;
  const h = height;
  if (!data.length) return <svg className="spark" style={{ height: h }} />;
  const step = w / Math.max(1, data.length - 1);
  const path = data
    .map((v, i) => {
      const x = i * step;
      const y = h - (Math.min(v, max) / max) * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg className="spark" style={{ height: h }} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
    </svg>
  );
}

function Gauge({
  value, max, label, suffix = '', size = 'normal'
}: { value: number | null; max: number; label: string; suffix?: string; size?: 'normal' | 'small' }) {
  const pct = value == null ? 0 : Math.min(100, (value / max) * 100);
  const cls = pct > 90 ? 'hot' : pct > 75 ? 'warn' : '';
  return (
    <div className="metric">
      <div className="metric-label" style={{ fontSize: size === 'small' ? 11 : 13 }}>{label}</div>
      <span className="metric-value" style={{ fontSize: size === 'small' ? 22 : 32 }}>
        {value == null ? '—' : Math.round(value)}{suffix}
      </span>
      <div className="gauge" style={{ height: size === 'small' ? 8 : 12 }}>
        <div className={`gauge-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const Sensors: React.FC<WidgetComponentProps<Config>> = ({ config, updateConfig, configOpen }) => {
  const sensors = useApp((s) => s.sensors);
  const cpuHistory = useRef<number[]>([]);
  const gpuHistory = useRef<number[]>([]);
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const cfg = { ...DEFAULTS, ...config };

  useEffect(() => {
    if (sensors?.cpuLoadPct != null) cpuHistory.current = [...cpuHistory.current.slice(-59), sensors.cpuLoadPct];
    if (sensors?.gpuLoadPct != null) gpuHistory.current = [...gpuHistory.current.slice(-59), sensors.gpuLoadPct];
  }, [sensors?.cpuLoadPct, sensors?.gpuLoadPct]);

  const tiny = width > 0 && (width < 220 || height < 160);
  const compact = !tiny && (width < 320 || height < 220);
  const stack = width > 0 && width < 280;
  const sizeProp: 'normal' | 'small' = compact ? 'small' : 'normal';

  const cpuVisible = cfg.showCpuTemp || cfg.showCpuLoad || cfg.showCpuPower;
  const gpuVisible = cfg.showGpuTemp || cfg.showGpuLoad || cfg.showGpuPower;

  const renderColumn = (kind: 'cpu' | 'gpu') => {
    const isCpu = kind === 'cpu';
    const data = isCpu
      ? { temp: sensors?.cpuTempC ?? null, load: sensors?.cpuLoadPct ?? null, power: sensors?.cpuPowerW ?? null, history: cpuHistory.current, label: 'CPU' }
      : { temp: sensors?.gpuTempC ?? null, load: sensors?.gpuLoadPct ?? null, power: sensors?.gpuPowerW ?? null, history: gpuHistory.current, label: 'GPU' };
    const showTemp = isCpu ? cfg.showCpuTemp : cfg.showGpuTemp;
    const showLoad = isCpu ? cfg.showCpuLoad : cfg.showGpuLoad;
    const showPower = isCpu ? cfg.showCpuPower : cfg.showGpuPower;

    return (
      <div className="col fill" style={{ gap: 8, minWidth: 0 }}>
        {showTemp && <Gauge value={data.temp} max={100} label={`${data.label} TEMP`} suffix="°C" size={sizeProp} />}
        {showLoad && !tiny && <Gauge value={data.load} max={100} label={`${data.label} LOAD`} suffix="%" size={sizeProp} />}
        {showPower && !tiny && <Gauge value={data.power} max={isCpu ? 200 : 400} label={`${data.label} PWR`} suffix="W" size={sizeProp} />}
        {cfg.showSparklines && !tiny && height > 240 && <Sparkline data={data.history} height={28} />}
      </div>
    );
  };

  return (
    <div ref={ref} className="col fill" style={{ gap: 10 }}>
      {configOpen && (
        <div className="widget-config no-drag">
          <details open style={{ width: '100%' }}>
            <summary className="mono muted" style={{ fontSize: 11, cursor: 'pointer' }}>METRICS</summary>
            <div className="cfg-grid">
              {([
                ['showCpuTemp', 'CPU temp'],
                ['showCpuLoad', 'CPU load'],
                ['showCpuPower', 'CPU power'],
                ['showGpuTemp', 'GPU temp'],
                ['showGpuLoad', 'GPU load'],
                ['showGpuPower', 'GPU power'],
                ['showMem', 'Memory'],
                ['showSparklines', 'Sparklines'],
                ['showSourceFooter', 'Source footer']
              ] as Array<[keyof Config, string]>).map(([key, label]) => (
                <label key={key} className="cfg-toggle">
                  <input
                    type="checkbox"
                    checked={cfg[key]}
                    onChange={(e) => updateConfig({ [key]: e.target.checked } as Partial<Config>)}
                  /> {label}
                </label>
              ))}
            </div>
          </details>
        </div>
      )}
      <div className={stack ? 'col' : 'row'} style={{ gap: 12, flex: 1, minHeight: 0 }}>
        {cpuVisible && renderColumn('cpu')}
        {gpuVisible && renderColumn('gpu')}
        {cfg.showMem && (
          <div className="col fill" style={{ gap: 8, minWidth: 0 }}>
            <Gauge value={sensors?.memUsedPct ?? null} max={100} label="MEM USED" suffix="%" size={sizeProp} />
          </div>
        )}
      </div>
      {cfg.showSourceFooter && height > 110 && (
        <div className="muted mono" style={{ fontSize: 10, flex: '0 0 auto' }}>
          SOURCE: {sensors?.source ?? '—'}{sensors?.source === 'mock' && ' (install LibreHardwareMonitor for real data)'}
        </div>
      )}
    </div>
  );
};

export const SensorsWidget: WidgetPlugin<Config> = {
  id: 'sensors',
  title: 'System Sensors',
  description: 'CPU/GPU temps and load with per-metric toggles',
  category: 'system',
  defaultSize: { w: 3, h: 2 },
  themeable: true,
  defaultConfig: DEFAULTS,
  component: Sensors
};
