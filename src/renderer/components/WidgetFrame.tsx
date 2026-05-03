import React from 'react';

export function WidgetFrame({
  title,
  editing,
  configOpen,
  hasConfig,
  onRemove,
  onToggleConfig,
  children
}: {
  title: string;
  editing: boolean;
  configOpen: boolean;
  hasConfig: boolean;
  onRemove: () => void;
  onToggleConfig: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`widget ${editing ? 'widget-editing' : ''}`}>
      <div className="widget-header">
        <span className="widget-title">{title}</span>
        <span className="widget-actions no-drag">
          {hasConfig && (
            <button
              className={`widget-gear ${configOpen ? 'on' : ''}`}
              onClick={onToggleConfig}
              aria-label="Configure"
              title="Configure"
            >
              ⚙
            </button>
          )}
          {editing && (
            <button className="widget-remove" onClick={onRemove} aria-label="Remove">
              ✕
            </button>
          )}
        </span>
      </div>
      <div className="widget-body no-drag">{children}</div>
    </div>
  );
}
