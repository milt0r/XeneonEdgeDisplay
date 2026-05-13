// Widget — shared frame with header (title + gear + remove) and body slot.
const Widget = ({ title, editing, configOpen, hasConfig, onToggleConfig, onRemove, className, children }) => (
  <div className={`widget ${editing ? 'editing' : ''} ${className || ''}`}>
    <div className="widget-header">
      <span className="widget-title">{title}</span>
      <span className="widget-actions">
        {hasConfig && (
          <button
            className={`iconbtn ${configOpen ? 'on' : ''}`}
            onClick={onToggleConfig}
            aria-label="Configure"
            title="Configure"
          >⚙</button>
        )}
        {editing && (
          <button className="iconbtn" onClick={onRemove} aria-label="Remove" title="Remove">✕</button>
        )}
      </span>
    </div>
    <div className="widget-body">{children}</div>
  </div>
);

window.Widget = Widget;
