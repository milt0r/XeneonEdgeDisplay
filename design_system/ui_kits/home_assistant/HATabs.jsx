// HATabs — page selector across the top of the dashboard.
const HATabs = ({ pages, activeId, onSelect, onAdd }) => (
  <div className="ha-tabs-bar">
    {pages.map((p) => (
      <button key={p.id}
              className={`ha-tab ${activeId === p.id ? 'active' : ''}`}
              onClick={() => onSelect(p.id)}>
        {p.name}
        <span className="ha-tab-count">{p.tiles.length}</span>
      </button>
    ))}
    <button className="ha-tab ha-tab-add" onClick={onAdd} title="Add page">+ PAGE</button>
  </div>
);

window.HATabs = HATabs;
