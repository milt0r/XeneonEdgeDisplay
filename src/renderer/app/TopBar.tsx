import React from 'react';
import { useApp } from '../store/app';
import { THEMES } from '../themes';

export function TopBar() {
  const settings = useApp((s) => s.settings);
  const editing = useApp((s) => s.editing);
  const toggleEditing = useApp((s) => s.toggleEditing);
  const setShowSettings = useApp((s) => s.setShowSettings);
  const showSettings = useApp((s) => s.showSettings);
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const theme = THEMES.find((t) => t.id === settings?.themeId);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="brand">XENEON//EDGE</span>
        <span className="theme-pill">{theme?.name ?? '—'}</span>
      </div>
      <div className="topbar-right">
        <span className="topbar-clock">
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <button className={`btn ${editing ? 'btn-active' : ''}`} onClick={toggleEditing}>
          {editing ? 'DONE' : 'EDIT'}
        </button>
        <button className={`btn ${showSettings ? 'btn-active' : ''}`} onClick={() => setShowSettings(!showSettings)}>
          SETTINGS
        </button>
      </div>
    </header>
  );
}
