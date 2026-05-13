// TopBar — wordmark + theme pill + clock + EDIT/SETTINGS.
const TopBar = ({ themeId, themeName, editing, setEditing, settingsOpen, setSettingsOpen }) => {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="brand">XENEON//EDGE</span>
        <span className="theme-pill">{themeName}</span>
      </div>
      <div className="topbar-right">
        <span className="topbar-clock">
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </span>
        <button className={`btn ${editing ? 'active' : ''}`} onClick={() => setEditing(!editing)}>
          {editing ? 'DONE' : 'EDIT'}
        </button>
        <button className={`btn ${settingsOpen ? 'active' : ''}`} onClick={() => setSettingsOpen(!settingsOpen)}>
          SETTINGS
        </button>
      </div>
    </header>
  );
};

window.TopBar = TopBar;
