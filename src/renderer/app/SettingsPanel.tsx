import React, { useState } from 'react';
import { useApp } from '../store/app';
import { THEMES } from '../themes';
import { teamsForSport, SPORT_LABEL, type Sport } from '../themes/sports';
import { OnScreenKeyboard } from '../components/OnScreenKeyboard';
import { CommitSlider } from '../components/CommitSlider';
import { PluginRegistry } from '../plugins/registry';
import { findOpenSlot } from '../app/layout-utils';

type OskField =
  | { kind: 'lhmUrl' }
  | { kind: 'haUrl' }
  | { kind: 'haToken' }
  | { kind: 'spotifyClientId' };

export function SettingsPanel() {
  const settings = useApp((s) => s.settings)!;
  const setSettings = useApp((s) => s.setSettings);
  const setShowSettings = useApp((s) => s.setShowSettings);
  const addWidget = useApp((s) => s.addWidget);

  const [haUrl, setHaUrl] = useState(settings.homeAssistant.baseUrl || 'http://homeassistant.local:8123');
  const [haToken, setHaToken] = useState('');
  const [haStatus, setHaStatus] = useState<'idle' | 'ok' | 'bad'>('idle');
  const [haError, setHaError] = useState<string | null>(null);

  const [spotifyClientId, setSpotifyClientId] = useState(settings.spotify.clientId);
  const [spotifyAuthed, setSpotifyAuthed] = useState(false);
  React.useEffect(() => {
    window.api.spotify.isAuthorized().then(setSpotifyAuthed);
  }, []);

  const [oskField, setOskField] = useState<OskField | null>(null);
  const oskEnabled = !!settings?.ui?.onScreenKeyboard;

  const update = async (patch: any) => {
    const next = await window.api.updateSettings(patch);
    setSettings(next);
  };

  const setTheme = (id: string) => update({ themeId: id });

  const testHa = async () => {
    setHaStatus('idle');
    const res = await window.api.ha.test(haUrl, haToken);
    if (res.ok) {
      setHaStatus('ok');
      setHaError(null);
      await window.api.setSecret('haToken', haToken);
      await update({ homeAssistant: { baseUrl: haUrl, enabled: true } });
    } else {
      setHaStatus('bad');
      setHaError(res.error ?? 'Failed');
    }
  };

  const beginSpotify = async () => {
    if (spotifyClientId !== settings.spotify.clientId) {
      await update({ spotify: { ...settings.spotify, clientId: spotifyClientId, enabled: true } });
    }
    const res = await window.api.spotify.beginAuth();
    if (res.ok) setSpotifyAuthed(true);
  };

  const addPlugin = (pluginId: string) => {
    const plugin = PluginRegistry.get(pluginId);
    if (!plugin) return;
    const id = `${pluginId}-${Date.now()}`;
    const layout = useApp.getState().layout;
    const slot = findOpenSlot(layout, plugin.defaultSize.w, plugin.defaultSize.h, 12);
    addWidget({
      i: id,
      instanceId: id,
      pluginId,
      x: slot.x,
      y: slot.y,
      w: plugin.defaultSize.w,
      h: plugin.defaultSize.h
    });
    setShowSettings(false);
  };

  // Resolve current OSK value + setter from the active field
  const oskBinding = (() => {
    if (!oskEnabled || !oskField) return null;
    switch (oskField.kind) {
      case 'lhmUrl':
        return {
          value: settings.sensors.lhmUrl,
          onChange: (v: string) => update({ sensors: { ...settings.sensors, lhmUrl: v } }),
          passwordMode: false
        };
      case 'haUrl':
        return { value: haUrl, onChange: setHaUrl, passwordMode: false };
      case 'haToken':
        return { value: haToken, onChange: setHaToken, passwordMode: true };
      case 'spotifyClientId':
        return { value: spotifyClientId, onChange: setSpotifyClientId, passwordMode: false };
    }
  })();

  return (
    <div
      className="settings-overlay"
      onClick={(e) => e.target === e.currentTarget && setShowSettings(false)}
    >
      <div className="settings-panel">
        <div className="settings-header">
          <h2>SETTINGS</h2>
          <button className="btn" onClick={() => setShowSettings(false)}>
            CLOSE
          </button>
        </div>
        <div className="settings-body">
          <section className="settings-section">
            <h3>Interface</h3>
            <label className="toggle-row">
              <span>On-screen keyboard</span>
              <input
                type="checkbox"
                checked={oskEnabled}
                onChange={(e) => update({ ui: { ...settings.ui, onScreenKeyboard: e.target.checked } })}
              />
            </label>
            <div className="muted mono" style={{ fontSize: 11, marginBottom: 12 }}>
              When on, tapping a text field opens a touch keyboard at the bottom of the screen.
            </div>

            <div className="field-row">
              <label>UI scale ({Math.round((settings.ui?.fontScale ?? 1.0) * 100)}%)</label>
              <CommitSlider
                min={0.85} max={1.5} step={0.05}
                value={settings.ui?.fontScale ?? 1.0}
                onCommit={(v) => update({ ui: { ...settings.ui, fontScale: v } })}
              />
              <div className="btn-row" style={{ marginTop: 6 }}>
                {[0.9, 1.0, 1.1, 1.25, 1.5].map((v) => (
                  <button
                    key={v}
                    className={`chip ${Math.abs((settings.ui?.fontScale ?? 1) - v) < 0.01 ? 'active' : ''}`}
                    onClick={() => update({ ui: { ...settings.ui, fontScale: v } })}
                  >
                    {Math.round(v * 100)}%
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <label>Font family</label>
              <select
                value={settings.ui?.fontFamily ?? 'theme'}
                onChange={(e) => update({ ui: { ...settings.ui, fontFamily: e.target.value as any } })}
              >
                <option value="theme">Theme default</option>
                <option value="inter">Inter (clean sans)</option>
                <option value="system">System UI</option>
                <option value="rounded">Nunito (rounded sans)</option>
                <option value="serif">Serif</option>
                <option value="mono">JetBrains Mono</option>
              </select>
              <div className="muted mono" style={{ fontSize: 11 }}>
                Override the theme's fonts. Pip-Boy/Cyberpunk/Dragon are dramatic but harder to read — pick Inter or System for max readability.
              </div>
            </div>

            <div className="field-row">
              <label>Widget transparency ({Math.round((settings.ui?.widgetOpacity ?? 1.0) * 100)}%)</label>
              <CommitSlider
                min={0.4} max={1.0} step={0.05}
                value={settings.ui?.widgetOpacity ?? 1.0}
                onCommit={(v) => update({ ui: { ...settings.ui, widgetOpacity: v } })}
              />
              <div className="muted mono" style={{ fontSize: 11 }}>
                Lower values make widget panels see-through so the background shows.
              </div>
            </div>

            <div className="field-row">
              <label>Background for "{settings.themeId}" theme</label>
              <input
                placeholder="https://… or file:///… (blank = theme default)"
                value={settings.ui?.backgrounds?.[settings.themeId] ?? ''}
                onChange={(e) =>
                  update({
                    ui: {
                      ...settings.ui,
                      backgrounds: { ...(settings.ui?.backgrounds ?? {}), [settings.themeId]: e.target.value }
                    }
                  })
                }
              />
              <div className="btn-row" style={{ marginTop: 6 }}>
                <button
                  className="chip"
                  onClick={() =>
                    update({
                      ui: {
                        ...settings.ui,
                        backgrounds: { ...(settings.ui?.backgrounds ?? {}), [settings.themeId]: '' }
                      }
                    })
                  }
                >
                  Reset to theme default
                </button>
                <button
                  className="chip"
                  onClick={() =>
                    update({
                      ui: {
                        ...settings.ui,
                        backgrounds: { ...(settings.ui?.backgrounds ?? {}), [settings.themeId]: 'none' }
                      }
                    })
                  }
                >
                  No background
                </button>
                <a
                  className="chip"
                  href={`https://unsplash.com/s/photos/${encodeURIComponent(THEMES.find((t) => t.id === settings.themeId)?.name ?? settings.themeId)}`}
                  target="_blank"
                  rel="noopener"
                  style={{ textDecoration: 'none' }}
                >
                  🔍 Browse Unsplash
                </a>
              </div>
              <div className="muted mono" style={{ fontSize: 11, marginTop: 6 }}>
                Paste any image URL (https://, data:, or file:///C:/path/to/image.jpg).
                Tip: on Unsplash, right-click any photo → "Copy image address". Per-theme.
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h3>Theme</h3>
            <div className="theme-grid">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`theme-card ${settings.themeId === t.id ? 'active' : ''}`}
                  onClick={() => setTheme(t.id)}
                >
                  <div className="theme-card-name">{t.name}</div>
                  <div className="theme-card-desc">{t.description}</div>
                </button>
              ))}
            </div>
            {(['nhl','nfl','nba','mlb','f1','nascar'] as Sport[]).includes(settings.themeId as Sport) && (() => {
              const sport = settings.themeId as Sport;
              const teams = teamsForSport(sport);
              return (
                <div className="field-row" style={{ marginTop: 12 }}>
                  <label>{SPORT_LABEL[sport]} team</label>
                  <select
                    value={settings.ui?.sportTeams?.[sport] ?? teams[0]?.id ?? ''}
                    onChange={(e) =>
                      update({
                        ui: {
                          ...settings.ui,
                          sportTeams: { ...(settings.ui?.sportTeams ?? {}), [sport]: e.target.value }
                        }
                      })
                    }
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.abbr})</option>
                    ))}
                  </select>
                  <div className="muted mono" style={{ fontSize: 11 }}>
                    Colors and a team-tinted field background apply automatically.
                    Logos are loaded from public CDNs (NHL.com, ESPN, Wikimedia).
                  </div>
                </div>
              );
            })()}
          </section>

          <section className="settings-section">
            <h3>Weather</h3>
            <div className="row">
              <div className="field-row fill">
                <label>Latitude</label>
                <input
                  type="number"
                  value={settings.weather.latitude ?? ''}
                  onChange={(e) =>
                    update({
                      weather: {
                        ...settings.weather,
                        latitude: e.target.value === '' ? null : Number(e.target.value)
                      }
                    })
                  }
                />
              </div>
              <div className="field-row fill">
                <label>Longitude</label>
                <input
                  type="number"
                  value={settings.weather.longitude ?? ''}
                  onChange={(e) =>
                    update({
                      weather: {
                        ...settings.weather,
                        longitude: e.target.value === '' ? null : Number(e.target.value)
                      }
                    })
                  }
                />
              </div>
              <div className="field-row fill">
                <label>Units</label>
                <select
                  value={settings.weather.units}
                  onChange={(e) =>
                    update({
                      weather: { ...settings.weather, units: e.target.value as 'metric' | 'imperial' }
                    })
                  }
                >
                  <option value="metric">Metric (°C)</option>
                  <option value="imperial">Imperial (°F)</option>
                </select>
              </div>
            </div>
            <button className="btn" onClick={() => window.api.weather.refresh()}>
              Refresh now
            </button>
          </section>

          <section className="settings-section">
            <h3>Sensors</h3>
            <div className="field-row">
              <label>Source</label>
              <select
                value={settings.sensors.preferred}
                onChange={(e) =>
                  update({ sensors: { ...settings.sensors, preferred: e.target.value as any } })
                }
              >
                <option value="auto">Auto (SignalRGB → LHM → Mock)</option>
                <option value="signalrgb">SignalRGB</option>
                <option value="lhm">LibreHardwareMonitor</option>
                <option value="mock">Mock (demo)</option>
              </select>
            </div>
            <div className="field-row">
              <label>LibreHardwareMonitor URL</label>
              <input
                value={settings.sensors.lhmUrl}
                onFocus={() => setOskField({ kind: 'lhmUrl' })}
                onChange={(e) =>
                  update({ sensors: { ...settings.sensors, lhmUrl: e.target.value } })
                }
              />
            </div>
          </section>

          <section className="settings-section">
            <h3>
              Home Assistant
              {haStatus === 'ok' && <span className="status-pill ok">OK</span>}
              {haStatus === 'bad' && <span className="status-pill bad">{haError}</span>}
            </h3>
            <div className="field-row">
              <label>Base URL (e.g. http://homeassistant.local:8123)</label>
              <input
                value={haUrl}
                onFocus={() => setOskField({ kind: 'haUrl' })}
                onChange={(e) => setHaUrl(e.target.value)}
              />
            </div>
            <div className="field-row">
              <label>Long-lived access token</label>
              <input
                type="password"
                value={haToken}
                onFocus={() => setOskField({ kind: 'haToken' })}
                onChange={(e) => setHaToken(e.target.value)}
              />
            </div>
            <div className="btn-row">
              <button className="btn" onClick={testHa}>
                Save & Test
              </button>
            </div>
          </section>

          <section className="settings-section">
            <h3>
              Spotify
              {spotifyAuthed && <span className="status-pill ok">CONNECTED</span>}
            </h3>
            <div className="field-row">
              <label>Client ID (PKCE — no secret needed)</label>
              <input
                value={spotifyClientId}
                onFocus={() => setOskField({ kind: 'spotifyClientId' })}
                onChange={(e) => setSpotifyClientId(e.target.value)}
              />
            </div>
            <div className="muted mono" style={{ fontSize: 11, marginBottom: 8 }}>
              Add redirect URI: <code>http://127.0.0.1:53145/callback</code> in your Spotify app.
            </div>
            <div className="btn-row">
              <button className="btn" onClick={beginSpotify}>
                Connect
              </button>
              {spotifyAuthed && (
                <button
                  className="btn"
                  onClick={async () => {
                    await window.api.spotify.logout();
                    setSpotifyAuthed(false);
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </section>

          <section className="settings-section">
            <h3>Add widget</h3>
            <div className="ql-grid">
              {PluginRegistry.list().map((p) => (
                <button
                  key={p.id}
                  className="btn"
                  disabled={p.external}
                  title={p.external ? 'External plugin (mocked)' : p.description}
                  onClick={() => addPlugin(p.id)}
                >
                  + {p.title}
                  {p.external ? ' (stub)' : ''}
                </button>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h3>Window</h3>
            <div className="btn-row">
              <button className="btn" onClick={() => window.api.window.toggleFullscreen()}>
                Toggle Fullscreen
              </button>
              <button className="btn" onClick={() => window.api.window.quit()}>
                Quit
              </button>
            </div>
          </section>
        </div>

        {oskBinding && (
          <OnScreenKeyboard
            value={oskBinding.value}
            onChange={oskBinding.onChange}
            passwordMode={oskBinding.passwordMode}
            onClose={() => setOskField(null)}
          />
        )}
      </div>
    </div>
  );
}
