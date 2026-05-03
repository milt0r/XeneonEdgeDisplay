import React, { useEffect } from 'react';
import { useApp } from '../store/app';
import { ThemeProvider } from '../themes/ThemeProvider';
import { Dashboard } from './Dashboard';
import { TopBar } from './TopBar';
import { SettingsPanel } from './SettingsPanel';
import { BootScreen } from './BootScreen';

export function App() {
  const settings = useApp((s) => s.settings);
  const showSettings = useApp((s) => s.showSettings);
  const init = useApp((s) => s.init);
  const [booted, setBooted] = React.useState(false);

  useEffect(() => {
    init();
  }, [init]);

  if (!settings) {
    return (
      <ThemeProvider themeId="pipboy">
        <BootScreen onDone={() => setBooted(true)} forceVisible />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider themeId={settings.themeId}>
      {!booted && <BootScreen onDone={() => setBooted(true)} />}
      <div className="app-shell">
        <TopBar />
        <Dashboard />
        {showSettings && <SettingsPanel />}
      </div>
    </ThemeProvider>
  );
}
