import React, { useEffect, useState } from 'react';

interface Props {
  value: number;
  min: number;
  max: number;
  step?: number;
  onCommit: (v: number) => void;
  onPreview?: (v: number) => void;
}

/**
 * HTML range input with debounced commit. The thumb tracks the user's
 * finger via local state; the parent (which may trigger expensive work
 * like setZoomFactor) only sees the final value when the drag ends.
 */
export function CommitSlider({ value, min, max, step = 1, onCommit, onPreview }: Props) {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  return (
    <input
      type="range"
      min={min} max={max} step={step}
      value={local}
      onChange={(e) => {
        const v = Number(e.target.value);
        setLocal(v);
        onPreview?.(v);
      }}
      onMouseUp={() => onCommit(local)}
      onTouchEnd={() => onCommit(local)}
      onPointerUp={() => onCommit(local)}
      onKeyUp={() => onCommit(local)}
      style={{ touchAction: 'none' }}
    />
  );
}
