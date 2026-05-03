import React from 'react';
import type { WidgetPlugin } from '@shared/widget-plugin';

const QuickLaunch: React.FC = () => {
  return (
    <div className="ql-grid">
      <button className="btn" onClick={() => window.api.spotify.play()}>▶ Play</button>
      <button className="btn" onClick={() => window.api.spotify.pause()}>⏸ Pause</button>
      <button className="btn" onClick={() => window.api.spotify.next()}>⏭ Next</button>
      <button className="btn" onClick={() => window.api.spotify.setVolume(20)}>🔉 20%</button>
      <button className="btn" onClick={() => window.api.spotify.setVolume(60)}>🔊 60%</button>
      <button className="btn" onClick={() => window.api.window.toggleFullscreen()}>⛶ FS</button>
    </div>
  );
};

export const QuickLaunchWidget: WidgetPlugin = {
  id: 'quick-launch',
  title: 'Quick Launch',
  description: 'One-tap shortcuts',
  category: 'utility',
  defaultSize: { w: 4, h: 1 },
  themeable: true,
  component: QuickLaunch
};
