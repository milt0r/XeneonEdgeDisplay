import { useEffect, useRef, useState } from 'react';

/** Observes an element's size and re-renders when it changes. */
export function useElementSize<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new ResizeObserver((entries) => {
      const e = entries[0];
      if (!e) return;
      const { width, height } = e.contentRect;
      setSize((prev) =>
        Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1
          ? prev
          : { width, height }
      );
    });
    obs.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => obs.disconnect();
  }, []);

  return { ref, ...size };
}
