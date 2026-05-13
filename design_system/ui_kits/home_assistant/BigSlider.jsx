// Touch-first horizontal slider. Pointer-events; preview on drag, commit on release.
const BigSlider = ({ value, min, max, step = 1, onChange, onCommit, label, formatValue, color }) => {
  const trackRef = React.useRef(null);
  const [local, setLocal] = React.useState(value);
  const [dragging, setDragging] = React.useState(false);

  React.useEffect(() => { if (!dragging) setLocal(value); }, [value, dragging]);

  const valueFromX = (clientX) => {
    const el = trackRef.current;
    if (!el) return local;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + pct * (max - min);
    const stepped = Math.round(raw / step) * step;
    return Math.max(min, Math.min(max, stepped));
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    const v = valueFromX(e.clientX);
    setLocal(v); onChange?.(v);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const v = valueFromX(e.clientX);
    setLocal(v); onChange?.(v);
  };
  const onPointerUp = (e) => {
    if (!dragging) return;
    setDragging(false);
    const v = valueFromX(e.clientX);
    setLocal(v); onChange?.(v); onCommit?.(v);
  };

  const pct = ((local - min) / (max - min)) * 100;
  const bar = color || 'var(--accent)';

  return (
    <div className="big-slider">
      {label && (
        <div className="big-slider-row">
          <span className="big-slider-label">{label}</span>
          <span className="big-slider-value">{formatValue ? formatValue(local) : local}</span>
        </div>
      )}
      <div
        ref={trackRef}
        className="big-slider-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="big-slider-fill" style={{ width: `${pct}%`, background: bar }} />
        <div className="big-slider-thumb" style={{ left: `${pct}%`, background: color && !color.startsWith('linear') ? color : 'var(--accent)' }} />
      </div>
    </div>
  );
};

window.BigSlider = BigSlider;
