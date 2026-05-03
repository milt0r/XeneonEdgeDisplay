import React, { useEffect, useRef, useState } from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;       // continuous (preview)
  onCommit?: (v: number) => void;      // called on release
  label?: string;
  formatValue?: (v: number) => string;
  color?: string;
}

/**
 * Big touch-first horizontal slider. Uses pointer events; preview while
 * dragging, commits on pointerup.
 */
export function BigSlider({
  value, min, max, step = 1, onChange, onCommit, label, formatValue, color
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState(value);
  const [dragging, setDragging] = useState(false);

  useEffect(() => { if (!dragging) setLocal(value); }, [value, dragging]);

  const valueFromX = (clientX: number): number => {
    const el = trackRef.current;
    if (!el) return local;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + pct * (max - min);
    const stepped = Math.round(raw / step) * step;
    return Math.max(min, Math.min(max, stepped));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    const v = valueFromX(e.clientX);
    setLocal(v);
    onChange(v);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const v = valueFromX(e.clientX);
    setLocal(v);
    onChange(v);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    const v = valueFromX(e.clientX);
    setLocal(v);
    onChange(v);
    onCommit?.(v);
  };

  const pct = ((local - min) / (max - min)) * 100;
  const bar = color ?? 'var(--accent)';

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
        <div className="big-slider-thumb" style={{ left: `${pct}%`, background: bar }} />
      </div>
    </div>
  );
}
