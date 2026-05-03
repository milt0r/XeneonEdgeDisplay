import React, { useMemo, useState } from 'react';
import GridLayout from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import { useApp } from '../store/app';
import { PluginRegistry } from '../plugins/registry';
import { WidgetFrame } from '../components/WidgetFrame';

const COLS = 12;
const ROW_HEIGHT = 200;
const MARGIN: [number, number] = [10, 10];

export function Dashboard() {
  const layout = useApp((s) => s.layout);
  const editing = useApp((s) => s.editing);
  const saveLayout = useApp((s) => s.saveLayout);
  const updateConfig = useApp((s) => s.updateConfig);
  const removeWidget = useApp((s) => s.removeWidget);
  const [configOpen, setConfigOpen] = useState<Record<string, boolean>>({});

  const [width, setWidth] = React.useState(() => window.innerWidth);
  React.useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const gridLayout: Layout[] = useMemo(
    () => layout.map((it) => ({ i: it.i, x: it.x, y: it.y, w: it.w, h: it.h })),
    [layout]
  );

  const onLayoutChange = (next: Layout[]) => {
    if (!editing) return;
    const merged = layout.map((it) => {
      const n = next.find((n) => n.i === it.i);
      return n ? { ...it, x: n.x, y: n.y, w: n.w, h: n.h } : it;
    });
    saveLayout(merged);
  };

  return (
    <main className="dashboard">
      <GridLayout
        className="layout"
        layout={gridLayout}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        width={width}
        margin={MARGIN}
        compactType={null}
        preventCollision
        isDraggable={editing}
        isResizable={editing}
        draggableCancel=".no-drag"
        onLayoutChange={onLayoutChange}
      >
        {layout.map((it) => {
          const plugin = PluginRegistry.get(it.pluginId);
          const isOpen = !!configOpen[it.instanceId];
          const hasConfig = !!(plugin && (plugin.defaultConfig || plugin.settingsSchema));
          return (
            <div key={it.i} className="grid-cell">
              <WidgetFrame
                title={plugin?.title ?? it.pluginId}
                editing={editing}
                configOpen={isOpen}
                hasConfig={hasConfig}
                onRemove={() => removeWidget(it.instanceId)}
                onToggleConfig={() =>
                  setConfigOpen((s) => ({ ...s, [it.instanceId]: !s[it.instanceId] }))
                }
              >
                {plugin ? (
                  <plugin.component
                    instanceId={it.instanceId}
                    config={(it.config ?? plugin.defaultConfig ?? {}) as any}
                    updateConfig={(patch: Record<string, unknown>) => updateConfig(it.instanceId, patch)}
                    editing={editing}
                    configOpen={isOpen}
                  />
                ) : (
                  <div className="missing-plugin">Plugin "{it.pluginId}" not found</div>
                )}
              </WidgetFrame>
            </div>
          );
        })}
      </GridLayout>
    </main>
  );
}
