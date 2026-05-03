import React, { useEffect, useState } from 'react';
import type { WidgetPlugin } from '@shared/widget-plugin';

const Clock: React.FC = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="col fill center">
      <div className="clock-time">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div className="clock-date">
        {now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
};

export const ClockWidget: WidgetPlugin = {
  id: 'clock',
  title: 'Clock',
  description: 'Big touch-friendly clock',
  category: 'info',
  defaultSize: { w: 3, h: 2 },
  themeable: true,
  component: Clock
};
