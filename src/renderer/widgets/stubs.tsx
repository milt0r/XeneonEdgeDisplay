import React from 'react';
import type { WidgetPlugin } from '@shared/widget-plugin';

const Stub: React.FC<{ name: string }> = ({ name }) => (
  <div className="col center fill" style={{ gap: 8 }}>
    <div className="metric-label">EXTERNAL PLUGIN</div>
    <div style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{name}</div>
    <div className="muted mono" style={{ fontSize: 11, textAlign: 'center' }}>
      Mocked. Real plugin loading is wired via PluginRegistry.register() and a future plugins/ folder.
    </div>
  </div>
);

export const StubVoiceWidget: WidgetPlugin = {
  id: 'voice-control',
  title: 'Voice Control (stub)',
  description: 'External plugin example',
  category: 'plugin',
  defaultSize: { w: 3, h: 2 },
  themeable: true,
  external: true,
  component: () => <Stub name="VOICE CONTROL" />
};

export const StubCalendarWidget: WidgetPlugin = {
  id: 'calendar',
  title: 'Calendar (stub)',
  description: 'External plugin example',
  category: 'plugin',
  defaultSize: { w: 4, h: 2 },
  themeable: true,
  external: true,
  component: () => <Stub name="CALENDAR" />
};
