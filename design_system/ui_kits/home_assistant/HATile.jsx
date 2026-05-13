// HATile — generic tile that picks an inner variant based on entity domain.

const WEATHER_ICON = {
  sunny: '☀', clear: '☀', 'clear-night': '☾',
  partlycloudy: '⛅', cloudy: '☁',
  fog: '🌫', rainy: '🌧', pouring: '🌧',
  snowy: '❄', lightning: '⛈', 'lightning-rainy': '⛈',
  windy: '💨', hail: '🌨'
};

const FORMAT_PERSON_STATE = {
  home: 'HOME',
  not_home: 'AWAY',
  unknown: '—'
};

const HATile = ({ entity, size, editing, onClick, onCycleSize, onRemove }) => {
  const domain = entity.entityId.split('.')[0];
  const on = isOnState(entity.state);
  const name = entityFriendlyName(entity.entityId, entity.attributes);
  const icon = entityIcon(entity.entityId, entity.attributes, 18);

  const handleClick = (e) => {
    if (editing) return; // edit mode disables tile activation
    onClick(entity);
  };

  const EditBadges = () => editing ? (
    <>
      <span className="size-badge" onClick={(e) => { e.stopPropagation(); onCycleSize(); }}>{size.toUpperCase()}</span>
      <button className="remove-badge" onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
    </>
  ) : null;

  // Camera tile is full-bleed art.
  if (domain === 'camera') {
    return (
      <div className={`ha-tile camera size-${size}`} onClick={handleClick}>
        <div className="camera-art">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2">
            <path d="M3 7h4l2-2h6l2 2h4v12H3z"/><circle cx="12" cy="13" r="3.5"/>
          </svg>
        </div>
        <div className="camera-cap">
          <span><span className="camera-dot"></span>{name}</span>
          <span>1080P</span>
        </div>
        {editing && <>
          <span className="size-badge" onClick={(e) => { e.stopPropagation(); onCycleSize(); }}>{size.toUpperCase()}</span>
          <button className="remove-badge" onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
        </>}
      </div>
    );
  }

  // Sensor — big number with unit.
  if (domain === 'sensor') {
    const unit = entityUnit(entity.attributes);
    const value = entity.state;
    let display = value;
    const num = parseFloat(value);
    if (Number.isFinite(num)) display = num.toFixed(num >= 100 || Number.isInteger(num) ? 0 : 1);
    return (
      <div className={`ha-tile size-${size}`} onClick={handleClick}>
        <div className="ha-tile-top">
          <span className="ha-tile-icon">{icon}</span>
          <span className="ha-tile-nm">{name}</span>
        </div>
        <div className="ha-tile-v">{display}<span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', marginLeft: 4 }}>{unit}</span></div>
        {editing && <>
          <span className="size-badge" onClick={(e) => { e.stopPropagation(); onCycleSize(); }}>{size.toUpperCase()}</span>
          <button className="remove-badge" onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
        </>}
      </div>
    );
  }

  // Climate — shows current temp big, target + state small.
  if (domain === 'climate') {
    const attrs = entity.attributes;
    const cur = attrs.current_temperature;
    const tgt = attrs.temperature;
    const unit = attrs.unit_of_measurement || '°';
    return (
      <div className={`ha-tile size-${size}`} onClick={handleClick}>
        <div className="ha-tile-top">
          <span className="ha-tile-icon">{icon}</span>
          <span className="ha-tile-nm">{name}</span>
        </div>
        <div className="ha-tile-v">{cur ?? '—'}<span style={{ fontSize: 14, color: 'var(--fg-muted)', marginLeft: 4 }}>{unit}</span></div>
        <div className="ha-tile-sub">{entity.state}{tgt != null ? ` → ${tgt}${unit}` : ''}</div>
        {editing && <>
          <span className="size-badge" onClick={(e) => { e.stopPropagation(); onCycleSize(); }}>{size.toUpperCase()}</span>
          <button className="remove-badge" onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
        </>}
      </div>
    );
  }

  // Media player — show title + artist.
  if (domain === 'media_player') {
    const attrs = entity.attributes;
    const title = attrs.media_title || entity.state;
    const artist = attrs.media_artist;
    return (
      <div className={`ha-tile ${on ? 'on' : ''} size-${size}`} onClick={handleClick}>
        <div className="ha-tile-top">
          <span className="ha-tile-icon">{icon}</span>
          <span className="ha-tile-nm">{name}</span>
        </div>
        <div className="ha-tile-v" style={{ fontSize: 16, lineHeight: 1.15 }}>{title}</div>
        {artist && <div className="ha-tile-sub">{artist}</div>}
        {editing && <>
          <span className="size-badge" onClick={(e) => { e.stopPropagation(); onCycleSize(); }}>{size.toUpperCase()}</span>
          <button className="remove-badge" onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
        </>}
      </div>
    );
  }

  // Light — show brightness if on, OFF otherwise.
  if (domain === 'light') {
    const pct = on ? Math.round(((entity.attributes.brightness || 0) / 255) * 100) : 0;
    return (
      <div className={`ha-tile ${on ? 'on' : ''} size-${size}`} onClick={handleClick}>
        <div className="ha-tile-top">
          <span className="ha-tile-icon">{icon}</span>
          <span className="ha-tile-nm">{name}</span>
        </div>
        <div className="ha-tile-v">{on ? `${pct}%` : 'OFF'}</div>
        <div className="ha-tile-sub">{on ? `ON · ${pct}%` : '—'}</div>
        {editing && <>
          <span className="size-badge" onClick={(e) => { e.stopPropagation(); onCycleSize(); }}>{size.toUpperCase()}</span>
          <button className="remove-badge" onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
        </>}
      </div>
    );
  }

  // Weather — condition + temp + sub line. 1x1 compact; 2x2 shows forecast.
  if (domain === 'weather') {
    const attrs = entity.attributes;
    const wIcon = WEATHER_ICON[entity.state] || '·';
    const unit = attrs.temperature_unit || '°';
    const forecast = attrs.forecast || [];
    const isLarge = size === '2x2' || size === '3x2' || size === '3x1';
    return (
      <div className={`ha-tile size-${size}`} onClick={handleClick}>
        <div className="ha-tile-top">
          <span className="ha-tile-icon">{icon}</span>
          <span className="ha-tile-nm">{name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
          <span style={{ fontSize: isLarge ? 44 : 28, lineHeight: 1 }}>{wIcon}</span>
          <span className="ha-tile-v" style={{ fontSize: isLarge ? 36 : 24 }}>{attrs.temperature}{unit}</span>
        </div>
        <div className="ha-tile-sub" style={{ textTransform: 'uppercase' }}>{entity.state} · FEELS {attrs.apparent_temperature}{unit}</div>
        {isLarge && forecast.length > 0 && (
          <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'space-between' }}>
            {forecast.slice(0, 4).map((f) => (
              <div key={f.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)', letterSpacing: '0.12em' }}>{f.day}</span>
                <span style={{ fontSize: 20 }}>{WEATHER_ICON[f.condition] || '·'}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>{f.high}°</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)' }}>{f.low}°</span>
              </div>
            ))}
          </div>
        )}
        <EditBadges />
      </div>
    );
  }

  // Person / device_tracker — initials avatar, state, optional battery.
  if (domain === 'person' || domain === 'device_tracker') {
    const attrs = entity.attributes;
    const home = entity.state === 'home';
    const initials = attrs.initials || name.slice(0, 2).toUpperCase();
    const stateLabel = FORMAT_PERSON_STATE[entity.state] || (attrs.location ? attrs.location.toUpperCase() : entity.state.toUpperCase());
    return (
      <div className={`ha-tile ${home ? 'on' : ''} size-${size}`} onClick={handleClick}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '2px 0', flex: 1, justifyContent: 'center', minHeight: 0 }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: home ? 'var(--accent)' : 'var(--bg-panel)',
            color: home ? 'var(--bg)' : 'var(--accent)',
            border: '2px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 16
          }}>{initials}</div>
          <div className="ha-tile-nm" style={{ textAlign: 'center' }}>{name}</div>
          <div className="ha-tile-sub" style={{ color: home ? 'var(--accent-hot)' : 'var(--fg-muted)' }}>
            {stateLabel}{attrs.battery != null ? ` · ${attrs.battery}%` : ''}
          </div>
        </div>
        <EditBadges />
      </div>
    );
  }

  // Binary sensor (motion-class pulses when state=on)
  if (domain === 'binary_sensor') {
    const triggered = on;
    return (
      <div className={`ha-tile ${triggered ? 'on' : ''} size-${size}`} onClick={handleClick}>
        <div className="ha-tile-top">
          <span className="ha-tile-icon" style={triggered ? { animation: 'live-pulse 1.2s ease-in-out infinite' } : null}>{icon}</span>
          <span className="ha-tile-nm">{name}</span>
        </div>
        <div className="ha-tile-v" style={{ fontSize: 22 }}>
          {triggered ? 'DETECTED' : 'CLEAR'}
        </div>
        <div className="ha-tile-sub">{entity.attributes.last_triggered || '—'}</div>
        <EditBadges />
      </div>
    );
  }

  // Automation — toggle + last-triggered timestamp.
  if (domain === 'automation') {
    const enabled = on;
    return (
      <div className={`ha-tile ${enabled ? 'on' : ''} size-${size}`} onClick={handleClick}>
        <div className="ha-tile-top">
          <span className="ha-tile-icon">{icon}</span>
          <span className="ha-tile-nm">{name}</span>
        </div>
        <div className="ha-tile-v" style={{ fontSize: 16, lineHeight: 1.15 }}>{enabled ? 'ENABLED' : 'DISABLED'}</div>
        <div className="ha-tile-sub">LAST · {entity.attributes.last_triggered || '—'}</div>
        <EditBadges />
      </div>
    );
  }

  // Vacuum — status + battery level. Tap → opens detail with start/dock/spot.
  if (domain === 'vacuum') {
    const attrs = entity.attributes;
    const level = attrs.battery_level ?? 0;
    return (
      <div className={`ha-tile size-${size}`} onClick={handleClick}>
        <div className="ha-tile-top">
          <span className="ha-tile-icon">{icon}</span>
          <span className="ha-tile-nm">{name}</span>
        </div>
        <div className="ha-tile-v" style={{ fontSize: 18 }}>{(attrs.status || entity.state).toUpperCase()}</div>
        <div className="ha-tile-sub">BATTERY · {level}%</div>
        <div className="gauge" style={{ height: 6, marginTop: 4 }}>
          <div className="gauge-fill" style={{ width: `${level}%`, background: 'var(--accent)', height: '100%' }} />
        </div>
        <EditBadges />
      </div>
    );
  }

  // Update — version + install pending badge.
  if (domain === 'update') {
    const attrs = entity.attributes;
    const pending = on; // state='on' means update available
    return (
      <div className={`ha-tile ${pending ? 'on' : ''} size-${size}`} onClick={handleClick}>
        <div className="ha-tile-top">
          <span className="ha-tile-icon">{icon}</span>
          <span className="ha-tile-nm">{name}</span>
        </div>
        <div className="ha-tile-v" style={{ fontSize: 16, lineHeight: 1.15 }}>
          {pending ? `${attrs.installed_version} → ${attrs.latest_version}` : attrs.installed_version}
        </div>
        <div className="ha-tile-sub">{pending ? 'UPDATE AVAILABLE' : 'UP TO DATE'}</div>
        <EditBadges />
      </div>
    );
  }

  // Alarm control panel — armed state badge.
  if (domain === 'alarm_control_panel') {
    const state = entity.state;
    const armed = state.startsWith('armed');
    const label = state === 'armed_home' ? 'ARMED · HOME'
                : state === 'armed_away' ? 'ARMED · AWAY'
                : state === 'armed_night' ? 'ARMED · NIGHT'
                : state === 'disarmed' ? 'DISARMED'
                : state === 'pending' ? 'PENDING'
                : state === 'triggered' ? 'TRIGGERED'
                : state.toUpperCase();
    const danger = state === 'triggered';
    return (
      <div className={`ha-tile ${armed ? 'on' : ''} size-${size}`}
           style={danger ? { borderColor: '#ef4444', boxShadow: '0 0 16px rgba(239,68,68,0.4)' } : null}
           onClick={handleClick}>
        <div className="ha-tile-top">
          <span className="ha-tile-icon">{icon}</span>
          <span className="ha-tile-nm">{name}</span>
        </div>
        <div className="ha-tile-v" style={{ fontSize: 18, color: danger ? '#ff5050' : null }}>{label}</div>
        <div className="ha-tile-sub">{armed ? 'TAP TO DISARM' : 'TAP TO ARM'}</div>
        <EditBadges />
      </div>
    );
  }

  // Default — switch / lock / cover / scene / fan / etc — name + state.
  let valueLabel = entity.state.toUpperCase();
  if (domain === 'scene' || domain === 'script' || domain === 'automation') valueLabel = 'RUN';
  return (
    <div className={`ha-tile ${on ? 'on' : ''} size-${size}`} onClick={handleClick}>
      <div className="ha-tile-top">
        <span className="ha-tile-icon">{icon}</span>
        <span className="ha-tile-nm">{name}</span>
      </div>
      <div className="ha-tile-v" style={{ fontSize: valueLabel.length > 6 ? 18 : 24 }}>{valueLabel}</div>
      {entity.attributes.percentage != null && <div className="ha-tile-sub">SPEED {entity.attributes.percentage}%</div>}
      {editing && <>
        <span className="size-badge" onClick={(e) => { e.stopPropagation(); onCycleSize(); }}>{size.toUpperCase()}</span>
        <button className="remove-badge" onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
      </>}
    </div>
  );
};

window.HATile = HATile;
