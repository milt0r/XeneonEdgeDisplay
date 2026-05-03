import React, { useEffect, useState } from 'react';
import type { WidgetPlugin } from '@shared/widget-plugin';

interface Result {
  pingMs: number;
  downloadMbps: number;
  jitterMs: number;
  ok: boolean;
  error?: string;
  ts: number;
}

const Speedtest: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<Result[]>([]);

  const run = async () => {
    setRunning(true);
    const r = await window.api.net.speedtest();
    const stamped = { ...r, ts: Date.now() };
    setResult(stamped);
    setHistory((h) => [...h.slice(-9), stamped]);
    setRunning(false);
  };

  // Auto-run a quick latency-only check every 30s by re-fetching just the ping field
  useEffect(() => {
    if (!result) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const last = result;
  const pingClass = last && last.pingMs < 50 ? 'good' : last && last.pingMs < 150 ? 'warn' : 'hot';

  return (
    <div className="col fill" style={{ gap: 10 }}>
      <div className="row" style={{ gap: 12 }}>
        <div className="col fill">
          <div className="metric-label">DOWNLOAD</div>
          <div className="metric-value" style={{ fontSize: 38 }}>
            {last?.downloadMbps != null ? last.downloadMbps : '—'}<span className="sensor-unit">Mbps</span>
          </div>
        </div>
        <div className="col fill">
          <div className="metric-label">PING</div>
          <div className="metric-value" style={{ fontSize: 38, color: last?.ok ? `var(--${pingClass === 'good' ? 'good' : pingClass === 'warn' ? 'warn' : 'accent-hot'})` : 'var(--fg-muted)' }}>
            {last?.pingMs ?? '—'}<span className="sensor-unit">ms</span>
          </div>
          <div className="muted mono" style={{ fontSize: 11 }}>
            jitter {last?.jitterMs ?? '—'} ms
          </div>
        </div>
      </div>
      <button className="btn" onClick={run} disabled={running} style={{ alignSelf: 'center' }}>
        {running ? '⏳ TESTING…' : '▶ RUN SPEEDTEST'}
      </button>
      {last && !last.ok && (
        <div className="muted mono" style={{ fontSize: 11, color: 'var(--warn)' }}>
          {last.error ?? 'Test failed'}
        </div>
      )}
      <div className="row" style={{ gap: 4, alignItems: 'flex-end', height: 32 }}>
        {history.map((r, i) => {
          const h = Math.min(100, (r.downloadMbps / 200) * 100);
          return <div key={i} title={`${r.downloadMbps} Mbps · ${r.pingMs} ms`}
            style={{ flex: 1, height: `${h}%`, background: 'var(--accent)', opacity: 0.6, borderRadius: 2 }} />;
        })}
      </div>
      <div className="muted mono" style={{ fontSize: 10 }}>via Cloudflare speed.cloudflare.com</div>
    </div>
  );
};

export const SpeedtestWidget: WidgetPlugin = {
  id: 'speedtest',
  title: 'Speedtest',
  description: 'Download throughput, ping, jitter via Cloudflare',
  category: 'system',
  defaultSize: { w: 3, h: 2 },
  themeable: true,
  component: Speedtest
};
