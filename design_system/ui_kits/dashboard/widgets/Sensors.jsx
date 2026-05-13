// Sensors — CPU/GPU temp + load gauges with a fake live tick.
const SensorsWidget = ({ editing, onRemove }) => {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1500);
    return () => clearInterval(id);
  }, []);
  // deterministic-ish wobble around 0 — added to a base value
  const wave = (off, amp = 4) => Math.round(Math.sin((t + off) * 0.7) * amp);
  const clamp = (v) => Math.max(0, Math.min(99, v));
  const cpu = { temp: clamp(58 + wave(0, 4)), load: clamp(42 + wave(1, 12)) };
  const gpu = { temp: clamp(71 + wave(2, 3)), load: clamp(81 + wave(3, 9)) };

  const cls = (v) => v > 90 ? 'hot' : v > 75 ? 'warn' : '';

  return (
    <Widget title="System Sensors" editing={editing} hasConfig={true} onRemove={onRemove}>
      <div className="sensors-row">
        {[
          { label: 'CPU', temp: cpu.temp, load: cpu.load },
          { label: 'GPU', temp: gpu.temp, load: gpu.load },
        ].map((c) => (
          <div key={c.label} className="sensor-col">
            <div className="sensor-lbl">{c.label} TEMP</div>
            <div className="sensor-v">{c.temp}°<span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>C</span></div>
            <div className="gauge"><div className={`gauge-fill ${cls(c.temp)}`} style={{ width: `${c.temp}%` }} /></div>
            <div className="sensor-lbl" style={{ marginTop: 8 }}>{c.label} LOAD</div>
            <div className="sensor-v">{c.load}<span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>%</span></div>
            <div className="gauge"><div className={`gauge-fill ${cls(c.load)}`} style={{ width: `${c.load}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="sensor-foot">SOURCE: mock (install LibreHardwareMonitor for real data)</div>
    </Widget>
  );
};

window.SensorsWidget = SensorsWidget;
