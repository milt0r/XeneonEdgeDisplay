// HA Tiles — toggleable Home Assistant fixtures.
const INITIAL_HA = [
  { id: 'l1', kind: 'light', name: 'Living Rm', on: true,  value: '78%' },
  { id: 'l2', kind: 'light', name: 'Office',     on: false, value: '0%' },
  { id: 'l3', kind: 'light', name: 'Bedroom',    on: false, value: '0%' },
  { id: 't1', kind: 'climate', name: 'Thermostat', on: false, value: '68°F', state: 'HEAT · IDLE' },
  { id: 'd1', kind: 'lock', name: 'Front Door', on: false, value: 'LOCKED', state: 'SECURE · 14m' },
  { id: 'g1', kind: 'cover', name: 'Garage', on: true, value: 'OPEN', state: 'DOOR · 3m' },
];

const HaIcon = ({ kind, on }) => {
  const stroke = on ? 'var(--accent-hot)' : 'var(--accent)';
  const props = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'light':  return <svg {...props}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.5 1 2.3v1h6v-1c0-.8.3-1.7 1-2.3A7 7 0 0 0 12 2z"/></svg>;
    case 'climate':return <svg {...props}><path d="M12 3v9"/><circle cx="12" cy="17" r="4"/></svg>;
    case 'lock':   return <svg {...props}><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case 'cover':  return <svg {...props}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>;
    default:       return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
};

const HATilesWidget = ({ editing, onRemove }) => {
  const [items, setItems] = React.useState(INITIAL_HA);
  const toggle = (id) => setItems((p) => p.map((it) => it.id === id ? { ...it, on: !it.on } : it));
  return (
    <Widget title="Home Assistant" editing={editing} hasConfig={true} onRemove={onRemove}>
      <div className="ha-grid">
        {items.map((it) => (
          <div key={it.id} className={`ha-tile ${it.on ? 'on' : ''}`} onClick={() => toggle(it.id)}>
            <div className="ha-tile-top">
              <HaIcon kind={it.kind} on={it.on} />
              <span className="ha-tile-nm">{it.name}</span>
            </div>
            <div className="ha-tile-v" style={{ fontSize: it.value.length > 4 ? 18 : 24 }}>
              {it.value}
            </div>
            <div className="ha-tile-state">{it.state || (it.on ? 'ON' : 'OFF')}</div>
          </div>
        ))}
      </div>
    </Widget>
  );
};

window.HATilesWidget = HATilesWidget;
