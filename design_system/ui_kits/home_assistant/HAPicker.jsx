// Full HA entity picker — modal with search + filter chips + grouped rows.
const FILTERS = [
  { id: 'all',      label: 'All',      match: /.*/ },
  { id: 'lights',   label: 'Lights',   match: /^light\./ },
  { id: 'switches', label: 'Switches', match: /^(switch|input_boolean|fan)\./ },
  { id: 'scenes',   label: 'Scenes',   match: /^(scene|script|automation)\./ },
  { id: 'sensors',  label: 'Sensors',  match: /^sensor\./ },
  { id: 'climate',  label: 'Climate',  match: /^climate\./ },
  { id: 'media',    label: 'Media',    match: /^media_player\./ },
  { id: 'cameras',  label: 'Cameras',  match: /^camera\./ },
  { id: 'covers',   label: 'Covers',   match: /^cover\./ },
  { id: 'locks',    label: 'Locks',    match: /^lock\./ },
];

const HAPicker = ({ entities, alreadyAdded, onClose, onAdd }) => {
  const [filter, setFilter] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef(null);
  React.useEffect(() => { inputRef.current?.focus(); }, []);

  const visible = React.useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter) || FILTERS[0];
    const q = query.toLowerCase().trim();
    return entities.filter((e) => {
      if (!f.match.test(e.entityId)) return false;
      if (!q) return true;
      return e.entityId.toLowerCase().includes(q)
          || entityFriendlyName(e.entityId, e.attributes).toLowerCase().includes(q);
    });
  }, [entities, filter, query]);

  const grouped = React.useMemo(() => {
    const m = new Map();
    visible.forEach((e) => {
      const k = e.area || 'Ungrouped';
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(e);
    });
    return Array.from(m.entries());
  }, [visible]);

  const counts = React.useMemo(() => {
    const out = {};
    FILTERS.forEach((f) => {
      out[f.id] = entities.filter((e) => f.match.test(e.entityId)).length;
    });
    return out;
  }, [entities]);

  return ReactDOM.createPortal(
    <div className="ha-detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ha-detail">
        <div className="ha-detail-header">
          <span className="ha-detail-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg>
          </span>
          <div className="ha-detail-titles">
            <div className="ha-detail-name">Add entities</div>
            <div className="ha-detail-id">{entities.length} discovered · HA REST</div>
          </div>
          <button className="btn" onClick={onClose}>DONE</button>
        </div>
        <div className="picker-shell">
          <div className="picker-search-row">
            <input
              ref={inputRef}
              className="picker-search"
              placeholder="Search by name or entity ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="picker-chips">
            {FILTERS.map((f) => (
              <button key={f.id}
                      className={`chip ${filter === f.id ? 'active' : ''}`}
                      onClick={() => setFilter(f.id)}>
                {f.label} <span style={{ fontSize: 9, opacity: 0.7, marginLeft: 4 }}>{counts[f.id]}</span>
              </button>
            ))}
          </div>
          <div className="picker-list">
            {grouped.length === 0 && (
              <div className="picker-empty">
                <div style={{ fontSize: 28 }}>—</div>
                <div>No entities match</div>
              </div>
            )}
            {grouped.map(([area, items]) => (
              <React.Fragment key={area}>
                <div className="area-header">{area} · {items.length}</div>
                {items.map((e) => {
                  const selected = alreadyAdded.has(e.entityId);
                  return (
                    <button key={e.entityId}
                            className={`picker-row ${selected ? 'selected' : ''}`}
                            onClick={() => onAdd(e)}>
                      <span className="picker-row-icon">{entityIcon(e.entityId, e.attributes, 22)}</span>
                      <div>
                        <div className="nm">{entityFriendlyName(e.entityId, e.attributes)}</div>
                        <div className="id">{e.entityId}</div>
                      </div>
                      <span className="state">{e.state}{e.attributes.unit_of_measurement || ''}</span>
                      <span className="picker-add">{selected ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="picker-footer">
            <span>{visible.length} of {entities.length} entities</span>
            <span>Tap to add / remove · Enter when done</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

window.HAPicker = HAPicker;
