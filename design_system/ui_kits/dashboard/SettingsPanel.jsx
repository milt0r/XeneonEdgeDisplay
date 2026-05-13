// SettingsPanel — slide-in drawer with theme picker, weather settings, on-screen keyboard.

const THEMES = [
  { id: 'pipboy',    name: 'Pip-Boy',    desc: 'Vault-Tec approved CRT terminal aesthetic' },
  { id: 'dark',      name: 'Dark',       desc: 'Modern minimalist dark UI' },
  { id: 'synthwave', name: 'Synthwave',  desc: 'Neon grid, sunset gradients' },
  { id: 'nord',      name: 'Nord',       desc: 'Calm arctic palette' },
  { id: 'cyberpunk', name: 'Cyberpunk',  desc: 'Night City: hot yellow + cyan + magenta' },
];

const SettingsPanel = ({ themeId, setThemeId, onClose }) => {
  const [tab, setTab] = React.useState('theme');
  const [oskOpen, setOskOpen] = React.useState(false);
  const [latText, setLatText] = React.useState('42.3314');
  const [haUrl, setHaUrl] = React.useState('http://homeassistant.local:8123');
  const [activeField, setActiveField] = React.useState(null);

  const onKey = (k) => {
    const setter = activeField === 'lat' ? setLatText : activeField === 'ha' ? setHaUrl : null;
    if (!setter) return;
    if (k === 'BS') setter((s) => s.slice(0, -1));
    else setter((s) => s + k);
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <aside className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>SETTINGS</h2>
          <button className="iconbtn" onClick={onClose} aria-label="Close" title="Close">✕</button>
        </div>
        <div className="settings-shell">
          <nav className="settings-sidebar">
            {[
              ['theme',    'Theme'],
              ['widgets',  'Widgets'],
              ['weather',  'Weather'],
              ['ha',       'Home Asst'],
              ['spotify',  'Spotify']
            ].map(([k, label]) => (
              <button key={k}
                      className={`settings-tab ${tab === k ? 'active' : ''}`}
                      onClick={() => setTab(k)}>
                {label}
              </button>
            ))}
          </nav>
          <div className="settings-body">
            {tab === 'theme' && (
              <div className="settings-section">
                <h3>Active Theme</h3>
                <div className="theme-grid">
                  {THEMES.map((t) => (
                    <button key={t.id}
                            className={`theme-card ${themeId === t.id ? 'active' : ''}`}
                            onClick={() => setThemeId(t.id)}>
                      <div className="theme-card-name">{t.name}</div>
                      <div className="theme-card-desc">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'widgets' && (
              <div className="settings-section">
                <h3>Available widgets</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['Clock','Weather','System Sensors','Spotify','Home Assistant','Quick Launch','Sports','Markets','Calendar','Pomodoro','Hacker News','Discord','Air Quality'].map((w) => (
                    <div key={w} style={{
                      display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center',
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                      padding: '10px 12px', minHeight: 44
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{w}</span>
                      <button className="btn" style={{ padding: '6px 10px', minHeight: 32 }}>+ Add</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'weather' && (
              <div className="settings-section">
                <h3>Open-Meteo · No API Key</h3>
                <div className="field">
                  <label>Latitude</label>
                  <input value={latText}
                         onFocus={() => { setActiveField('lat'); setOskOpen(true); }}
                         onChange={(e) => setLatText(e.target.value)} />
                </div>
                <div className="field">
                  <label>Longitude</label>
                  <input defaultValue="-83.0458"
                         onFocus={() => { setActiveField('lng'); setOskOpen(true); }} />
                </div>
                <div className="field">
                  <label>Units</label>
                  <select defaultValue="imperial">
                    <option value="imperial">Imperial · °F · mph</option>
                    <option value="metric">Metric · °C · km/h</option>
                  </select>
                </div>
              </div>
            )}

            {tab === 'ha' && (
              <div className="settings-section">
                <h3>Home Assistant <span className="status-pill bad">DISCONNECTED</span></h3>
                <div className="field">
                  <label>Base URL</label>
                  <input value={haUrl}
                         onFocus={() => { setActiveField('ha'); setOskOpen(true); }}
                         onChange={(e) => setHaUrl(e.target.value)} />
                </div>
                <div className="field">
                  <label>Long-Lived Access Token</label>
                  <input type="password"
                         placeholder="eyJhb…"
                         onFocus={() => { setActiveField('token'); setOskOpen(true); }} />
                </div>
                <button className="btn active">SAVE &amp; TEST</button>
              </div>
            )}

            {tab === 'spotify' && (
              <div className="settings-section">
                <h3>Spotify <span className="status-pill ok">CONNECTED</span></h3>
                <div className="field">
                  <label>Client ID</label>
                  <input defaultValue="b8c4e2…" />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', marginTop: 8 }}>
                  Redirect: <span style={{ color: 'var(--accent)' }}>http://127.0.0.1:53145/callback</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn">Reconnect</button>
                  <button className="btn">Disconnect</button>
                </div>
              </div>
            )}
          </div>
        </div>
        {oskOpen && (
          <OnScreenKeyboard onKey={onKey} onClose={() => { setOskOpen(false); setActiveField(null); }} />
        )}
      </aside>
    </div>
  );
};

window.SettingsPanel = SettingsPanel;
