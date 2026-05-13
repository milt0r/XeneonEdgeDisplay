// HAToolbar — edit mode + add-entity + count.
const HAToolbar = ({ editing, setEditing, count, onAddEntity, haStatus }) => (
  <div className="ha-toolbar">
    <button className={`btn ${editing ? 'active' : ''}`} onClick={() => setEditing(!editing)}>
      {editing ? '✓ DONE' : '✎ EDIT'}
    </button>
    {editing && (
      <button className="btn primary" onClick={onAddEntity}>+ ADD ENTITY</button>
    )}
    <span className="grow"></span>
    <span className="ha-count">{count} ENTITIES</span>
    <span className={`status-pill ${haStatus === 'connected' ? 'ok' : 'bad'}`}>
      {haStatus === 'connected' ? 'CONNECTED' : 'OFFLINE'}
    </span>
  </div>
);

window.HAToolbar = HAToolbar;
