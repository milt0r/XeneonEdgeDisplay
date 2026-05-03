import React, { useState } from 'react';
import type { WidgetPlugin, WidgetComponentProps } from '@shared/widget-plugin';

interface Script {
  id: string;
  label: string;
  cmd: string;
}

interface Config {
  scripts: Script[];
}

const DEFAULTS: Config = {
  scripts: [
    { id: 'uptime', label: 'Uptime', cmd: '(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime' },
    { id: 'ipconfig', label: 'IP', cmd: 'ipconfig | Select-String "IPv4"' },
    { id: 'disk', label: 'Free disk', cmd: 'Get-PSDrive C | Select-Object Used,Free' }
  ]
};

const ScriptRunner: React.FC<WidgetComponentProps<Config>> = ({ config, updateConfig, configOpen }) => {
  const cfg = { ...DEFAULTS, ...(config as Partial<Config>) };
  const scripts = cfg.scripts ?? [];
  const [output, setOutput] = useState<{ id: string; text: string; err: boolean } | null>(null);
  const [running, setRunning] = useState<string | null>(null);

  const run = async (s: Script) => {
    setRunning(s.id);
    const r = await window.api.scripts.run(s.cmd);
    setOutput({
      id: s.id,
      text: r.stdout || r.stderr || '(no output)',
      err: !r.ok || r.exitCode !== 0
    });
    setRunning(null);
  };

  const updateScript = (i: number, patch: Partial<Script>) => {
    const next = scripts.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    updateConfig({ scripts: next });
  };
  const addScript = () => updateConfig({ scripts: [...scripts, { id: `s-${Date.now()}`, label: 'New', cmd: '' }] });
  const removeScript = (i: number) => updateConfig({ scripts: scripts.filter((_, idx) => idx !== i) });

  return (
    <div className="col fill" style={{ gap: 8, minHeight: 0 }}>
      {configOpen && (
        <div className="widget-config no-drag" style={{ flexDirection: 'column' }}>
          <div className="muted mono" style={{ fontSize: 11, color: 'var(--warn)' }}>
            ⚠ Scripts run with this app's privileges. Don't paste anything you wouldn't paste in your own terminal.
          </div>
          {scripts.map((s, i) => (
            <div key={s.id} className="row" style={{ gap: 4, width: '100%', alignItems: 'flex-start' }}>
              <input className="ha-search" style={{ minHeight: 32, fontSize: 12, padding: '4px 8px', maxWidth: 100 }}
                value={s.label} onChange={(e) => updateScript(i, { label: e.target.value })} />
              <textarea className="ha-search" rows={2} style={{ flex: 1, minHeight: 40, fontSize: 11, padding: '4px 8px' }}
                value={s.cmd} onChange={(e) => updateScript(i, { cmd: e.target.value })} placeholder="PowerShell command…" />
              <button className="btn" onClick={() => removeScript(i)}>✕</button>
            </div>
          ))}
          <button className="chip" onClick={addScript}>+ Add script</button>
        </div>
      )}
      <div className="ql-grid no-drag">
        {scripts.map((s) => (
          <button
            key={s.id}
            className={`btn ${running === s.id ? 'btn-active' : ''}`}
            disabled={running !== null}
            onClick={() => run(s)}
          >
            {running === s.id ? '⏳ ' : '▶ '}{s.label}
          </button>
        ))}
      </div>
      {output && (
        <pre className={`script-output mono ${output.err ? 'err' : ''}`}>{output.text}</pre>
      )}
    </div>
  );
};

export const ScriptRunnerWidget: WidgetPlugin<Config> = {
  id: 'scripts',
  title: 'Script Runner',
  description: 'One-tap PowerShell commands with captured output',
  category: 'utility',
  defaultSize: { w: 4, h: 2 },
  themeable: true,
  defaultConfig: DEFAULTS,
  component: ScriptRunner
};
