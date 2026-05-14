import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../store/app';
import { THEMES } from '../themes';

export function TopBar() {
  const settings = useApp((s) => s.settings);
  const editing = useApp((s) => s.editing);
  const toggleEditing = useApp((s) => s.toggleEditing);
  const setShowSettings = useApp((s) => s.setShowSettings);
  const showSettings = useApp((s) => s.showSettings);
  const tabs = useApp((s) => s.tabs);
  const activeTabId = useApp((s) => s.activeTabId);
  const setActiveTab = useApp((s) => s.setActiveTab);
  const addTab = useApp((s) => s.addTab);
  const renameTab = useApp((s) => s.renameTab);
  const setTabColor = useApp((s) => s.setTabColor);
  const removeTab = useApp((s) => s.removeTab);
  const reorderTabs = useApp((s) => s.reorderTabs);

  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const theme = THEMES.find((t) => t.id === settings?.themeId);

  const [menu, setMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Long-press handling for touch -> context menu
  const longPressTimer = useRef<number | null>(null);
  const startLongPress = (id: string, x: number, y: number) => {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => {
      setMenu({ id, x, y });
    }, 500);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Close context menu on outside click
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menu]);

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const ids = tabs.map((t) => t.id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(from, 1);
    ids.splice(to, 0, draggedId);
    reorderTabs(ids);
    setDraggedId(null);
  };

  return (
    <header className="topbar">
      <div className="topbar-tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isRenaming = renamingId === tab.id;
          const accent = tab.color ?? 'var(--accent)';
          return (
            <div
              key={tab.id}
              className={`tab ${isActive ? 'active' : ''} ${draggedId === tab.id ? 'dragging' : ''}`}
              style={isActive ? { borderBottomColor: accent, color: accent } : undefined}
              draggable={!isRenaming}
              onDragStart={() => setDraggedId(tab.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(tab.id)}
              onDragEnd={() => setDraggedId(null)}
              onClick={() => !isRenaming && setActiveTab(tab.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setMenu({ id: tab.id, x: e.clientX, y: e.clientY });
              }}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                startLongPress(tab.id, touch.clientX, touch.clientY);
              }}
              onTouchEnd={cancelLongPress}
              onTouchMove={cancelLongPress}
            >
              {tab.color && <span className="tab-dot" style={{ background: tab.color }} />}
              {isRenaming ? (
                <input
                  className="tab-rename"
                  defaultValue={tab.name}
                  autoFocus
                  onBlur={(e) => { renameTab(tab.id, e.target.value || tab.name); setRenamingId(null); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                    if (e.key === 'Escape') setRenamingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="tab-name" onDoubleClick={(e) => { e.stopPropagation(); setRenamingId(tab.id); }}>
                  {tab.name}
                </span>
              )}
            </div>
          );
        })}
        <button
          className="tab-add"
          onClick={() => addTab()}
          title="New tab"
          aria-label="New tab"
        >
          +
        </button>
      </div>

      <div className="topbar-right">
        <span className="topbar-clock">
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="brand">XENEON//EDGE</span>
        <span className="theme-pill">{theme?.name ?? '—'}</span>
        <button className={`btn ${editing ? 'btn-active' : ''}`} onClick={toggleEditing}>
          {editing ? 'DONE' : 'EDIT'}
        </button>
        <button className={`btn ${showSettings ? 'btn-active' : ''}`} onClick={() => setShowSettings(!showSettings)}>
          SETTINGS
        </button>
      </div>

      {menu && (
        <TabContextMenu
          tab={tabs.find((t) => t.id === menu.id)!}
          x={menu.x}
          y={menu.y}
          canDelete={tabs.length > 1}
          onRename={() => { setRenamingId(menu.id); setMenu(null); }}
          onColor={(c) => { setTabColor(menu.id, c); setMenu(null); }}
          onDelete={() => { removeTab(menu.id); setMenu(null); }}
          onClose={() => setMenu(null)}
        />
      )}
    </header>
  );
}

const COLOR_PRESETS = [
  { name: 'Default', value: undefined },
  { name: 'Green',   value: '#7cff8a' },
  { name: 'Blue',    value: '#5aa9ff' },
  { name: 'Purple',  value: '#cba6f7' },
  { name: 'Pink',    value: '#ff71ce' },
  { name: 'Orange',  value: '#ff8c00' },
  { name: 'Red',     value: '#ef4444' },
  { name: 'Yellow',  value: '#ffd866' },
  { name: 'Cyan',    value: '#00d4ff' },
  { name: 'Gold',    value: '#e6b04a' }
];

function TabContextMenu({
  tab, x, y, canDelete, onRename, onColor, onDelete, onClose
}: {
  tab: { id: string; name: string; color?: string };
  x: number; y: number;
  canDelete: boolean;
  onRename: () => void;
  onColor: (c: string | undefined) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  // Clamp so the menu doesn't fall off the right edge
  const left = Math.min(x, window.innerWidth - 240);
  const top = Math.min(y, window.innerHeight - 280);
  return (
    <div
      className="tab-menu"
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="tab-menu-header mono muted">{tab.name}</div>
      <button className="tab-menu-item" onClick={onRename}>✎ Rename</button>
      <div className="tab-menu-section mono muted">COLOR</div>
      <div className="tab-menu-colors">
        {COLOR_PRESETS.map((p) => (
          <button
            key={p.name}
            className={`tab-menu-color ${(tab.color ?? null) === (p.value ?? null) ? 'active' : ''}`}
            style={p.value ? { background: p.value } : undefined}
            onClick={() => onColor(p.value)}
            title={p.name}
          >
            {!p.value && '×'}
          </button>
        ))}
      </div>
      {canDelete && (
        <>
          <div className="tab-menu-divider" />
          <button className="tab-menu-item danger" onClick={onDelete}>🗑 Delete tab</button>
        </>
      )}
      <div className="tab-menu-divider" />
      <button className="tab-menu-item" onClick={onClose}>Close menu</button>
    </div>
  );
}
