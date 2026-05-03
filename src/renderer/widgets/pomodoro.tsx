import React, { useEffect, useRef, useState } from 'react';
import type { WidgetPlugin, WidgetComponentProps } from '@shared/widget-plugin';

interface Config {
  workMin: number;
  shortBreakMin: number;
  longBreakMin: number;
  cyclesBeforeLong: number;
  beep: boolean;
}

const DEFAULTS: Config = { workMin: 25, shortBreakMin: 5, longBreakMin: 15, cyclesBeforeLong: 4, beep: true };

type Phase = 'work' | 'short' | 'long';

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = 880;
    osc.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    osc.start(); osc.stop(ctx.currentTime + 0.7);
  } catch {}
}

const Pomodoro: React.FC<WidgetComponentProps<Config>> = ({ config, updateConfig, configOpen }) => {
  const cfg = { ...DEFAULTS, ...(config as Partial<Config>) };
  const [phase, setPhase] = useState<Phase>('work');
  const [secsLeft, setSecsLeft] = useState(cfg.workMin * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0); // work cycles done today
  const phaseRef = useRef(phase);
  const completedRef = useRef(completed);
  phaseRef.current = phase;
  completedRef.current = completed;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecsLeft((s) => {
        if (s > 1) return s - 1;
        // phase ended
        if (cfg.beep) beep();
        if (phaseRef.current === 'work') {
          const next = completedRef.current + 1;
          setCompleted(next);
          const isLong = next % cfg.cyclesBeforeLong === 0;
          setPhase(isLong ? 'long' : 'short');
          return (isLong ? cfg.longBreakMin : cfg.shortBreakMin) * 60;
        } else {
          setPhase('work');
          return cfg.workMin * 60;
        }
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, cfg.beep, cfg.cyclesBeforeLong, cfg.longBreakMin, cfg.shortBreakMin, cfg.workMin]);

  const reset = () => {
    setRunning(false);
    setPhase('work');
    setSecsLeft(cfg.workMin * 60);
  };

  const total = (phase === 'work' ? cfg.workMin : phase === 'long' ? cfg.longBreakMin : cfg.shortBreakMin) * 60;
  const pct = ((total - secsLeft) / total) * 100;
  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');
  const phaseLabel = phase === 'work' ? 'FOCUS' : phase === 'short' ? 'SHORT BREAK' : 'LONG BREAK';

  return (
    <div className="col fill" style={{ gap: 10 }}>
      {configOpen && (
        <div className="widget-config no-drag">
          <div className="cfg-grid">
            {([['workMin','Work min'],['shortBreakMin','Short break'],['longBreakMin','Long break'],['cyclesBeforeLong','Cycles → long']] as Array<[keyof Config, string]>).map(([k, label]) => (
              <label key={k} className="cfg-toggle">
                {label}
                <input type="number" min={1} max={120}
                  value={cfg[k] as number}
                  onChange={(e) => updateConfig({ [k]: Number(e.target.value) || 1 } as any)}
                  style={{ width: 60 }} />
              </label>
            ))}
            <label className="cfg-toggle">
              <input type="checkbox" checked={cfg.beep} onChange={(e) => updateConfig({ beep: e.target.checked })} /> Beep
            </label>
          </div>
        </div>
      )}
      <div className="metric-label" style={{ textAlign: 'center', color: phase === 'work' ? 'var(--accent)' : 'var(--good)' }}>
        {phaseLabel}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 84, color: 'var(--accent)', textAlign: 'center', lineHeight: 1 }}>
        {mm}:{ss}
      </div>
      <div className="gauge"><div className="gauge-fill" style={{ width: `${pct}%`, background: phase === 'work' ? 'var(--accent)' : 'var(--good)' }} /></div>
      <div className="transport center" style={{ gap: 8 }}>
        <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? '⏸ PAUSE' : '▶ START'}</button>
        <button className="btn" onClick={reset}>↺ RESET</button>
        <button className="btn" onClick={() => { setRunning(false); setSecsLeft(0); }}>⏭ SKIP</button>
      </div>
      <div className="muted mono" style={{ textAlign: 'center', fontSize: 11 }}>
        {completed} cycle{completed === 1 ? '' : 's'} done today
      </div>
    </div>
  );
};

export const PomodoroWidget: WidgetPlugin<Config> = {
  id: 'pomodoro',
  title: 'Pomodoro',
  description: 'Focus timer with configurable work/break cycles',
  category: 'utility',
  defaultSize: { w: 3, h: 2 },
  themeable: true,
  defaultConfig: DEFAULTS,
  component: Pomodoro
};
