// HAApp — page shell.
const SIZE_CYCLE = ['1x1', '2x1', '3x1', '1x2', '2x2', '3x2'];
const nextSize = (s) => SIZE_CYCLE[(SIZE_CYCLE.indexOf(s) + 1) % SIZE_CYCLE.length];

const THEMES = [
  { id: 'pipboy',    label: 'Pip-Boy' },
  { id: 'dark',      label: 'Dark' },
  { id: 'apollo',    label: 'Apollo' },
  { id: 'cyberpunk', label: 'Cyber' },
  { id: 'nord',      label: 'Nord' }
];

const HAApp = () => {
  const [themeId, setThemeId] = React.useState('pipboy');
  const [entities, setEntities] = React.useState(window.HA_ENTITIES);
  const [pages, setPages]       = React.useState(window.HA_INITIAL_PAGES);
  const [activePageId, setActivePageId] = React.useState(pages[0].id);
  const [editing, setEditing]   = React.useState(false);
  const [openEntityId, setOpenEntityId] = React.useState(null);
  const [pickerOpen, setPickerOpen]     = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    THEMES.forEach((t) => root.classList.remove(`theme-${t.id}`));
    root.classList.add(`theme-${themeId}`);
  }, [themeId]);

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];
  const tilesOnPage = activePage.tiles;
  const addedSet = new Set(tilesOnPage.map((t) => t.entityId));

  const updateEntity = (entityId, patch) => {
    setEntities((all) => all.map((e) => e.entityId === entityId ? {
      ...e,
      state: patch.state ?? e.state,
      attributes: patch.attributes ? { ...patch.attributes } : e.attributes
    } : e));
  };

  const cycleTileSize = (tileIdx) => {
    setPages((all) => all.map((p) => p.id !== activePageId ? p : {
      ...p,
      tiles: p.tiles.map((t, i) => i === tileIdx ? { ...t, size: nextSize(t.size) } : t)
    }));
  };

  const removeTile = (tileIdx) => {
    setPages((all) => all.map((p) => p.id !== activePageId ? p : {
      ...p,
      tiles: p.tiles.filter((_, i) => i !== tileIdx)
    }));
  };

  const addEntity = (entity) => {
    setPages((all) => all.map((p) => p.id !== activePageId ? p : {
      ...p,
      tiles: addedSet.has(entity.entityId)
        ? p.tiles.filter((t) => t.entityId !== entity.entityId)
        : [...p.tiles, { entityId: entity.entityId, size: '1x1' }]
    }));
  };

  const openEntity = entities.find((e) => e.entityId === openEntityId);

  return (
    <>
      {!sessionStorage.getItem('ha-booted') && <BootScreen onDone={() => sessionStorage.setItem('ha-booted', '1')} />}
      <div className="stage">
        <header className="chrome">
          <div className="chrome-left">
            <h1>XENEON//EDGE · HOME ASSISTANT</h1>
            <span className="theme-pill">{THEMES.find((t) => t.id === themeId)?.label}</span>
          </div>
          <div className="chrome-right">
            <div className="theme-picker">
              {THEMES.map((t) => (
                <button key={t.id}
                        className={themeId === t.id ? 'active' : ''}
                        onClick={() => setThemeId(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>
        </header>

        <HATabs
          pages={pages}
          activeId={activePageId}
          onSelect={setActivePageId}
          onAdd={() => {}}
        />

        <HAToolbar
          editing={editing}
          setEditing={setEditing}
          count={tilesOnPage.length}
          onAddEntity={() => setPickerOpen(true)}
          haStatus="connected"
        />

        <main className="ha-grid">
          {tilesOnPage.map((tile, i) => {
            const entity = entities.find((e) => e.entityId === tile.entityId);
            if (!entity) return null;
            return (
              <HATile
                key={`${tile.entityId}-${i}`}
                entity={entity}
                size={tile.size}
                editing={editing}
                onClick={() => setOpenEntityId(entity.entityId)}
                onCycleSize={() => cycleTileSize(i)}
                onRemove={() => removeTile(i)}
              />
            );
          })}
          {tilesOnPage.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
              No tiles on this page. Tap <span style={{ color: 'var(--accent)' }}>+ ADD ENTITY</span> to start.
            </div>
          )}
        </main>
      </div>

      {openEntity && (
        <HADetail
          entity={openEntity}
          onClose={() => setOpenEntityId(null)}
          onUpdate={(patch) => updateEntity(openEntity.entityId, patch)}
        />
      )}

      {pickerOpen && (
        <HAPicker
          entities={entities}
          alreadyAdded={addedSet}
          onClose={() => setPickerOpen(false)}
          onAdd={addEntity}
        />
      )}
    </>
  );
};

// Small boot intro reused per session.
const BootScreen = ({ onDone }) => {
  const lines = [
    'XENEON-EDGE · HOME ASSISTANT BRIDGE',
    'Reading long-lived token: ✓',
    'WebSocket /api/websocket: HANDSHAKE OK',
    'Subscribing to state_changed events...',
    'Discovered 16 entities across 4 areas',
    'Touch interface: ENABLED'
  ];
  const [shown, setShown] = React.useState([]);
  React.useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setShown((p) => [...p, lines[i]]);
      i++;
      if (i >= lines.length) { clearInterval(t); setTimeout(onDone, 400); }
    }, 130);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="boot-screen">
      <pre className="boot-text">
        {shown.map((l, i) => <div key={i}>&gt; {l}</div>)}
        <span className="boot-cursor"></span>
      </pre>
    </div>
  );
};

window.HAApp = HAApp;
