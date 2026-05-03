import React, { useEffect, useState } from 'react';

export function BootScreen({ onDone, forceVisible = false }: { onDone: () => void; forceVisible?: boolean }) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const script = [
      'XENEON-EDGE BIOS v3.7.4',
      'Memory check: 32768 KB OK',
      'Initializing widget grid...',
      'Loading themes... [pipboy, dark, synthwave, nord]',
      'Connecting providers... weather, sensors, ha, spotify',
      'Touch interface: ENABLED',
      'Vault-Tec Industries (c)',
      ''
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLines((prev) => [...prev, script[i]]);
      i++;
      if (i >= script.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          onDone();
        }, 500);
      }
    }, 140);
    return () => clearInterval(interval);
  }, [onDone]);

  if (done && !forceVisible) return null;

  return (
    <div className="boot-screen">
      <pre className="boot-text">
        {lines.map((l, i) => (
          <div key={i}>&gt; {l}</div>
        ))}
        <span className="cursor">_</span>
      </pre>
    </div>
  );
}
