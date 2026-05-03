import React, { useState } from 'react';
import type { WidgetPlugin, WidgetComponentProps } from '@shared/widget-plugin';

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

interface Config {
  items: TodoItem[];
  hideCompleted: boolean;
}

const DEFAULTS: Config = { items: [], hideCompleted: false };

const Todo: React.FC<WidgetComponentProps<Config>> = ({ config, updateConfig, configOpen }) => {
  const cfg = { ...DEFAULTS, ...(config as Partial<Config>) };
  const items = cfg.items ?? [];
  const [input, setInput] = useState('');

  const add = () => {
    const text = input.trim();
    if (!text) return;
    updateConfig({ items: [...items, { id: `t-${Date.now()}`, text, done: false }] });
    setInput('');
  };
  const toggle = (id: string) =>
    updateConfig({ items: items.map((it) => (it.id === id ? { ...it, done: !it.done } : it)) });
  const remove = (id: string) =>
    updateConfig({ items: items.filter((it) => it.id !== id) });
  const clearDone = () => updateConfig({ items: items.filter((it) => !it.done) });

  const visible = cfg.hideCompleted ? items.filter((it) => !it.done) : items;
  const doneCount = items.filter((it) => it.done).length;

  return (
    <div className="col fill" style={{ gap: 8, minHeight: 0 }}>
      {configOpen && (
        <div className="widget-config no-drag">
          <label className="cfg-toggle">
            <input type="checkbox" checked={cfg.hideCompleted}
              onChange={(e) => updateConfig({ hideCompleted: e.target.checked })} /> Hide completed
          </label>
          <button className="chip" onClick={clearDone}>Clear done ({doneCount})</button>
        </div>
      )}
      <div className="row" style={{ gap: 6 }}>
        <input
          className="ha-search"
          placeholder="New task…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
          style={{ flex: 1, minHeight: 40, fontSize: 14, padding: '6px 10px' }}
        />
        <button className="btn" onClick={add}>+</button>
      </div>
      <div className="todo-list no-drag" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {visible.length === 0 && <div className="muted mono" style={{ padding: 12 }}>No tasks</div>}
        {visible.map((it) => (
          <div key={it.id} className={`todo-item ${it.done ? 'done' : ''}`}>
            <button className="todo-check" onClick={() => toggle(it.id)} aria-label="Toggle">
              {it.done ? '✓' : ''}
            </button>
            <span className="todo-text">{it.text}</span>
            <button className="todo-x" onClick={() => remove(it.id)} aria-label="Delete">✕</button>
          </div>
        ))}
      </div>
      <div className="muted mono" style={{ fontSize: 11 }}>{items.length - doneCount} open · {doneCount} done</div>
    </div>
  );
};

export const TodoWidget: WidgetPlugin<Config> = {
  id: 'todo',
  title: 'Todo',
  description: 'Quick-capture task list',
  category: 'utility',
  defaultSize: { w: 3, h: 2 },
  themeable: true,
  defaultConfig: DEFAULTS,
  component: Todo
};
