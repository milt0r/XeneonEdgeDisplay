// Quick Launch — one-tap shortcuts.
const QuickLaunchWidget = ({ editing, onRemove, onOpenSettings, onToggleFullscreen, onPing }) => (
  <Widget title="Quick Launch" editing={editing} hasConfig={false} onRemove={onRemove}>
    <div className="ql-grid">
      <button className="btn" onClick={onPing}>▶ Play</button>
      <button className="btn" onClick={onPing}>⏸ Pause</button>
      <button className="btn" onClick={onPing}>⏭ Next</button>
      <button className="btn" onClick={onPing}>🔉 20%</button>
      <button className="btn" onClick={onPing}>🔊 60%</button>
      <button className="btn" onClick={onToggleFullscreen}>⛶ FS</button>
      <button className="btn" onClick={onOpenSettings}>⚙ SETUP</button>
    </div>
  </Widget>
);

window.QuickLaunchWidget = QuickLaunchWidget;
