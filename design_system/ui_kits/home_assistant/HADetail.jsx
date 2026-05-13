// HADetail — full-screen modal with per-domain controls.
// Mirrors source_repo/src/renderer/components/HaEntityDetail.tsx.

const HADetail = ({ entity, onClose, onUpdate }) => {
  const domain = entity.entityId.split('.')[0];
  const name = entityFriendlyName(entity.entityId, entity.attributes);

  return ReactDOM.createPortal(
    <div className="ha-detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ha-detail">
        <div className="ha-detail-header">
          <span className="ha-detail-icon">{entityIcon(entity.entityId, entity.attributes, 28)}</span>
          <div className="ha-detail-titles">
            <div className="ha-detail-name">{name}</div>
            <div className="ha-detail-id">{entity.entityId}</div>
          </div>
          <button className="btn" onClick={onClose}>CLOSE ✕</button>
        </div>
        <div className="ha-detail-body">
          {domain === 'light'         && <LightControls entity={entity} onUpdate={onUpdate} />}
          {domain === 'switch'        && <ToggleControls entity={entity} onUpdate={onUpdate} />}
          {domain === 'input_boolean' && <ToggleControls entity={entity} onUpdate={onUpdate} />}
          {domain === 'fan'           && <FanControls entity={entity} onUpdate={onUpdate} />}
          {domain === 'climate'       && <ClimateControls entity={entity} onUpdate={onUpdate} />}
          {domain === 'media_player'  && <MediaControls entity={entity} onUpdate={onUpdate} />}
          {domain === 'cover'         && <CoverControls entity={entity} onUpdate={onUpdate} />}
          {domain === 'lock'          && <LockControls entity={entity} onUpdate={onUpdate} />}
          {(domain === 'scene' || domain === 'script') && <RunControls entity={entity} />}
          {domain === 'automation'    && <AutomationControls entity={entity} onUpdate={onUpdate} />}
          {domain === 'camera'        && <CameraView entity={entity} />}
          {(domain === 'sensor' || domain === 'binary_sensor') && <SensorView entity={entity} />}
          {domain === 'weather'       && <WeatherView entity={entity} />}
          {(domain === 'person' || domain === 'device_tracker') && <PersonView entity={entity} />}
          {domain === 'vacuum'        && <VacuumControls entity={entity} onUpdate={onUpdate} />}
          {domain === 'update'        && <UpdateControls entity={entity} onUpdate={onUpdate} />}
          {domain === 'alarm_control_panel' && <AlarmControls entity={entity} onUpdate={onUpdate} />}
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ---------- helpers ---------- */
function BigToggle({ on, label, onClick }) {
  return (
    <button className={`big-toggle ${on ? 'on' : ''}`} onClick={onClick}>
      <span className="big-toggle-knob">{on ? 'ON' : 'OFF'}</span>
      <span className="big-toggle-label">{label}</span>
    </button>
  );
}

/* ---------- domain controls ---------- */

function ToggleControls({ entity, onUpdate }) {
  const on = isOnState(entity.state);
  return (
    <BigToggle
      on={on}
      label={on ? 'On — tap to disable' : 'Off — tap to enable'}
      onClick={() => onUpdate({ state: on ? 'off' : 'on' })}
    />
  );
}

function LightControls({ entity, onUpdate }) {
  const attrs = entity.attributes;
  const on = isOnState(entity.state);
  const supportsBrightness = attrs.supported_color_modes?.some((m) =>
    ['brightness','color_temp','hs','rgb','rgbw','rgbww','xy','white'].includes(m)
  );
  const supportsColorTemp = attrs.supported_color_modes?.includes('color_temp');
  const initialPct = Math.round(((attrs.brightness || 0) / 255) * 100);
  const [pct, setPct] = React.useState(initialPct);
  const [kelvin, setKelvin] = React.useState(attrs.color_temp_kelvin || 4000);
  const minK = attrs.min_color_temp_kelvin || 2200;
  const maxK = attrs.max_color_temp_kelvin || 6500;

  return (
    <>
      <BigToggle
        on={on}
        label={on ? 'On' : 'Off'}
        onClick={() => onUpdate({ state: on ? 'off' : 'on' })}
      />
      {supportsBrightness && (
        <BigSlider
          label="Brightness"
          min={0} max={100} value={pct}
          formatValue={(v) => `${v}%`}
          onChange={setPct}
          onCommit={(v) => onUpdate({
            state: v > 0 ? 'on' : 'off',
            attributes: { ...attrs, brightness: Math.round((v / 100) * 255) }
          })}
        />
      )}
      {supportsColorTemp && (
        <BigSlider
          label="Color temperature"
          min={minK} max={maxK} step={50} value={kelvin}
          formatValue={(v) => `${v}K`}
          color="linear-gradient(90deg, #ffb14a, #fff5e0, #c8e0ff)"
          onChange={setKelvin}
          onCommit={(v) => onUpdate({ attributes: { ...attrs, color_temp_kelvin: v } })}
        />
      )}
    </>
  );
}

function FanControls({ entity, onUpdate }) {
  const attrs = entity.attributes;
  const on = isOnState(entity.state);
  const [pct, setPct] = React.useState(attrs.percentage || 0);
  return (
    <>
      <BigToggle on={on} label={on ? 'On' : 'Off'} onClick={() => onUpdate({ state: on ? 'off' : 'on' })} />
      <BigSlider
        label="Speed"
        min={0} max={100} value={pct}
        formatValue={(v) => `${v}%`}
        onChange={setPct}
        onCommit={(v) => onUpdate({ attributes: { ...attrs, percentage: v } })}
      />
    </>
  );
}

function ClimateControls({ entity, onUpdate }) {
  const attrs = entity.attributes;
  const unit = attrs.unit_of_measurement || '°';
  const minT = attrs.min_temp ?? 60;
  const maxT = attrs.max_temp ?? 85;
  const step = attrs.target_temp_step ?? 1;
  const [target, setTarget] = React.useState(attrs.temperature ?? attrs.current_temperature ?? 70);
  const modes = attrs.hvac_modes || [];
  return (
    <>
      <div className="climate-readout">
        <div>
          <div className="metric-label">Current</div>
          <div className="metric-big">{attrs.current_temperature ?? '—'}<span className="metric-unit">{unit}</span></div>
        </div>
        <div>
          <div className="metric-label">Mode</div>
          <div className="metric-big" style={{ fontSize: 32, textTransform: 'capitalize' }}>{entity.state}</div>
        </div>
      </div>
      <BigSlider
        label="Target"
        min={minT} max={maxT} step={step} value={target}
        formatValue={(v) => `${v.toFixed(step < 1 ? 1 : 0)}${unit}`}
        onChange={setTarget}
        onCommit={(v) => onUpdate({ attributes: { ...attrs, temperature: v } })}
      />
      {modes.length > 0 && (
        <div>
          <div className="metric-label" style={{ marginBottom: 8 }}>HVAC mode</div>
          <div className="mode-row">
            {modes.map((m) => (
              <button key={m}
                      className={`chip ${entity.state === m ? 'active' : ''}`}
                      onClick={() => onUpdate({ state: m })}>
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function MediaControls({ entity, onUpdate }) {
  const attrs = entity.attributes;
  const isPlaying = entity.state === 'playing';
  const [vol, setVol] = React.useState(Math.round((attrs.volume_level || 0) * 100));
  const sources = attrs.source_list || [];
  return (
    <>
      <div>
        <div className="metric-label">Now playing</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)', marginTop: 4 }}>
          {attrs.media_title || entity.state}
        </div>
        {attrs.media_artist && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
            {attrs.media_artist}
          </div>
        )}
      </div>
      <div className="transport">
        <button className="tbtn">⏮</button>
        <button className={`tbtn ${isPlaying ? 'active' : ''}`}
                onClick={() => onUpdate({ state: isPlaying ? 'paused' : 'playing' })}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="tbtn">⏭</button>
        <button className="tbtn">⏹</button>
      </div>
      <BigSlider
        label="Volume"
        min={0} max={100} value={vol}
        formatValue={(v) => `${v}%`}
        onChange={setVol}
        onCommit={(v) => onUpdate({ attributes: { ...attrs, volume_level: v / 100 } })}
      />
      {sources.length > 0 && (
        <div>
          <div className="metric-label" style={{ marginBottom: 8 }}>Source</div>
          <div className="mode-row">
            {sources.map((s) => (
              <button key={s}
                      className={`chip ${attrs.source === s ? 'active' : ''}`}
                      onClick={() => onUpdate({ attributes: { ...attrs, source: s } })}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function CoverControls({ entity, onUpdate }) {
  const attrs = entity.attributes;
  const [pos, setPos] = React.useState(attrs.current_position ?? 50);
  return (
    <>
      <div className="transport">
        <button className="btn" onClick={() => onUpdate({ state: 'open',   attributes: { ...attrs, current_position: 100 } })}>OPEN</button>
        <button className="btn" onClick={() => {}}>STOP</button>
        <button className="btn" onClick={() => onUpdate({ state: 'closed', attributes: { ...attrs, current_position: 0   } })}>CLOSE</button>
      </div>
      <BigSlider
        label="Position"
        min={0} max={100} value={pos}
        formatValue={(v) => `${v}%`}
        onChange={setPos}
        onCommit={(v) => onUpdate({
          state: v > 0 ? 'open' : 'closed',
          attributes: { ...attrs, current_position: v }
        })}
      />
    </>
  );
}

function LockControls({ entity, onUpdate }) {
  const locked = entity.state === 'locked';
  return (
    <BigToggle
      on={!locked}
      label={locked ? 'Locked — tap to unlock' : 'Unlocked — tap to lock'}
      onClick={() => onUpdate({ state: locked ? 'unlocked' : 'locked' })}
    />
  );
}

function RunControls({ entity }) {
  const [pulsed, setPulsed] = React.useState(false);
  return (
    <button className={`big-toggle ${pulsed ? 'on' : ''}`}
            style={{ width: '100%', height: 120 }}
            onClick={() => { setPulsed(true); setTimeout(() => setPulsed(false), 600); }}>
      <span className="big-toggle-knob">ACTIVATE</span>
    </button>
  );
}

function CameraView({ entity }) {
  return (
    <>
      <div style={{
        width: '100%', minHeight: 320,
        background: 'linear-gradient(135deg, #0a3a55 0%, #14506b 60%, #0a1a22 100%)',
        borderRadius: 'var(--radius)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2">
          <path d="M3 7h4l2-2h6l2 2h4v12H3z"/><circle cx="12" cy="13" r="3.5"/>
        </svg>
        <div className="camera-cap">
          <span><span className="camera-dot"></span>{entityFriendlyName(entity.entityId, entity.attributes)}</span>
          <span>1080P · 2 s</span>
        </div>
      </div>
      <div className="transport">
        <button className="btn primary">REFRESH</button>
        <button className="btn">FULLSCREEN</button>
        <button className="btn">EVENTS</button>
      </div>
    </>
  );
}

function SensorView({ entity }) {
  const unit = entityUnit(entity.attributes);
  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div className="metric-label">{entity.attributes.device_class || 'value'}</div>
      <div className="metric-big" style={{ fontSize: 96, marginTop: 12 }}>
        {entity.state}<span className="metric-unit" style={{ fontSize: 22 }}>{unit}</span>
      </div>
    </div>
  );
}

const WEATHER_GLYPH = {
  sunny: '☀', clear: '☀', 'clear-night': '☾',
  partlycloudy: '⛅', cloudy: '☁', fog: '🌫',
  rainy: '🌧', pouring: '🌧', snowy: '❄',
  lightning: '⛈', 'lightning-rainy': '⛈', windy: '💨', hail: '🌨'
};

function WeatherView({ entity }) {
  const attrs = entity.attributes;
  const unit = attrs.temperature_unit || '°';
  const forecast = attrs.forecast || [];
  return (
    <>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ fontSize: 88, lineHeight: 1 }}>{WEATHER_GLYPH[entity.state] || '·'}</div>
        <div>
          <div className="metric-big">{attrs.temperature}<span className="metric-unit">{unit}</span></div>
          <div className="metric-label" style={{ textTransform: 'uppercase', marginTop: 6 }}>
            {entity.state} · feels {attrs.apparent_temperature}{unit}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
        <span>HUMIDITY · <span style={{ color: 'var(--accent)' }}>{attrs.humidity}%</span></span>
        <span>WIND · <span style={{ color: 'var(--accent)' }}>{attrs.wind_speed} mph</span></span>
      </div>
      <div>
        <div className="metric-label" style={{ marginBottom: 10 }}>5-Day Forecast</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${forecast.length}, 1fr)`, gap: 10 }}>
          {forecast.map((f) => (
            <div key={f.day} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: 12,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', letterSpacing: '0.12em' }}>{f.day}</span>
              <span style={{ fontSize: 28 }}>{WEATHER_GLYPH[f.condition] || '·'}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent)' }}>{f.high}°</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>{f.low}°</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PersonView({ entity }) {
  const attrs = entity.attributes;
  const home = entity.state === 'home';
  const initials = attrs.initials || entityFriendlyName(entity.entityId, attrs).slice(0, 2).toUpperCase();
  return (
    <>
      <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: home ? 'var(--accent)' : 'var(--bg-elevated)',
          color: home ? 'var(--bg)' : 'var(--accent)',
          border: '3px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 38,
          flex: '0 0 auto'
        }}>{initials}</div>
        <div>
          <div className="metric-big" style={{ fontSize: 32 }}>
            {home ? 'HOME' : (attrs.location ? attrs.location.toUpperCase() : 'AWAY')}
          </div>
          <div className="metric-label" style={{ marginTop: 4 }}>{attrs.source || 'unknown source'}</div>
          {attrs.battery != null && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="metric-label">BATTERY</span>
              <div className="big-slider-track" style={{ flex: 1, height: 8 }}>
                <div className="big-slider-fill" style={{ width: `${attrs.battery}%` }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent)' }}>{attrs.battery}%</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em' }}>
        MAP · {home ? 'HOME ZONE' : 'TRACKING DISABLED'}
      </div>
    </>
  );
}

function VacuumControls({ entity, onUpdate }) {
  const attrs = entity.attributes;
  const isCleaning = entity.state === 'cleaning';
  const isDocked = entity.state === 'docked';
  const SPEEDS = ['quiet', 'balanced', 'turbo', 'max'];
  return (
    <>
      <div className="climate-readout">
        <div>
          <div className="metric-label">Battery</div>
          <div className="metric-big">{attrs.battery_level}<span className="metric-unit">%</span></div>
        </div>
        <div>
          <div className="metric-label">Status</div>
          <div className="metric-big" style={{ fontSize: 32, textTransform: 'capitalize' }}>{attrs.status || entity.state}</div>
        </div>
      </div>
      <div className="big-slider-track" style={{ height: 10 }}>
        <div className="big-slider-fill" style={{ width: `${attrs.battery_level}%` }} />
      </div>
      <div className="transport" style={{ flexWrap: 'wrap' }}>
        <button className={`btn ${isCleaning ? 'active' : 'primary'}`}
                onClick={() => onUpdate({ state: isCleaning ? 'returning' : 'cleaning', attributes: { ...attrs, status: isCleaning ? 'Returning' : 'Cleaning' } })}>
          {isCleaning ? '⏸ PAUSE' : '▶ START'}
        </button>
        <button className="btn"
                onClick={() => onUpdate({ state: 'returning', attributes: { ...attrs, status: 'Returning to dock' } })}
                disabled={isDocked}>
          ⌂ DOCK
        </button>
        <button className="btn"
                onClick={() => onUpdate({ state: 'cleaning', attributes: { ...attrs, status: 'Spot clean' } })}>
          ◎ SPOT
        </button>
      </div>
      <div>
        <div className="metric-label" style={{ marginBottom: 8 }}>Fan speed</div>
        <div className="mode-row">
          {SPEEDS.map((s) => (
            <button key={s}
                    className={`chip ${attrs.fan_speed === s ? 'active' : ''}`}
                    onClick={() => onUpdate({ attributes: { ...attrs, fan_speed: s } })}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function UpdateControls({ entity, onUpdate }) {
  const attrs = entity.attributes;
  const pending = isOnState(entity.state);
  return (
    <>
      <div className="climate-readout">
        <div>
          <div className="metric-label">Installed</div>
          <div className="metric-big" style={{ fontSize: 32 }}>{attrs.installed_version}</div>
        </div>
        <div>
          <div className="metric-label">Latest</div>
          <div className="metric-big" style={{ fontSize: 32, color: pending ? 'var(--accent-hot)' : 'var(--accent)' }}>
            {attrs.latest_version}
          </div>
        </div>
      </div>
      {attrs.release_summary && (
        <div style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 14,
          fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg)'
        }}>
          <div className="metric-label" style={{ marginBottom: 6 }}>Release notes</div>
          {attrs.release_summary}
        </div>
      )}
      <div className="transport" style={{ flexWrap: 'wrap' }}>
        <button className="btn primary"
                disabled={!pending}
                onClick={() => onUpdate({ state: 'off', attributes: { ...attrs, installed_version: attrs.latest_version } })}>
          {pending ? 'INSTALL UPDATE' : 'UP TO DATE'}
        </button>
        <button className="btn">CHANGELOG</button>
        <button className="btn">SKIP THIS VERSION</button>
      </div>
    </>
  );
}

function AutomationControls({ entity, onUpdate }) {
  const enabled = isOnState(entity.state);
  const [pulsed, setPulsed] = React.useState(false);
  return (
    <>
      <BigToggle
        on={enabled}
        label={enabled ? 'Enabled' : 'Disabled'}
        onClick={() => onUpdate({ state: enabled ? 'off' : 'on' })}
      />
      <button className={`big-toggle ${pulsed ? 'on' : ''}`}
              style={{ width: '100%', height: 80 }}
              onClick={() => { setPulsed(true); setTimeout(() => setPulsed(false), 600); }}>
        <span className="big-toggle-knob">▶ TRIGGER NOW</span>
      </button>
      <div className="climate-readout">
        <div>
          <div className="metric-label">Last triggered</div>
          <div className="metric-big" style={{ fontSize: 24 }}>{entity.attributes.last_triggered || '—'}</div>
        </div>
        <div>
          <div className="metric-label">Mode</div>
          <div className="metric-big" style={{ fontSize: 24, textTransform: 'capitalize' }}>{entity.attributes.mode || 'single'}</div>
        </div>
      </div>
    </>
  );
}

function AlarmControls({ entity, onUpdate }) {
  const state = entity.state;
  const armed = state.startsWith('armed');
  const triggered = state === 'triggered';
  const stateLabel = state === 'armed_home' ? 'ARMED · HOME'
                  : state === 'armed_away' ? 'ARMED · AWAY'
                  : state === 'armed_night' ? 'ARMED · NIGHT'
                  : state === 'pending' ? 'PENDING'
                  : state === 'triggered' ? 'TRIGGERED'
                  : 'DISARMED';
  const KEYS = ['1','2','3','4','5','6','7','8','9','✕','0','✓'];
  const setMode = (s) => onUpdate({ state: s });
  return (
    <>
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div className="metric-label">{triggered ? 'INTRUSION DETECTED' : 'CURRENT STATE'}</div>
        <div className="metric-big" style={{
          fontSize: 36,
          color: triggered ? '#ff5050' : armed ? 'var(--accent-hot)' : 'var(--fg-muted)',
          marginTop: 8
        }}>{stateLabel}</div>
      </div>
      <div className="mode-row" style={{ justifyContent: 'center' }}>
        <button className={`chip ${state === 'armed_home' ? 'active' : ''}`} onClick={() => setMode('armed_home')}>Home</button>
        <button className={`chip ${state === 'armed_away' ? 'active' : ''}`} onClick={() => setMode('armed_away')}>Away</button>
        <button className={`chip ${state === 'armed_night' ? 'active' : ''}`} onClick={() => setMode('armed_night')}>Night</button>
        <button className={`chip ${state === 'disarmed' ? 'active' : ''}`} onClick={() => setMode('disarmed')}>Disarm</button>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
        maxWidth: 280, margin: '0 auto'
      }}>
        {KEYS.map((k) => (
          <button key={k} className="btn"
                  style={{ height: 56, fontSize: 18, padding: 0 }}>
            {k}
          </button>
        ))}
      </div>
      <div className="metric-label" style={{ textAlign: 'center', marginTop: 4 }}>
        Enter 4-digit code to confirm
      </div>
    </>
  );
}

window.HADetail = HADetail;
