import type { AppSettings, SensorSnapshot } from '../../shared/types';

/**
 * Sensors provider: tries SignalRGB first (best-effort, always fails today
 * since SignalRGB has no public temp HTTP API), then LibreHardwareMonitor's
 * built-in JSON endpoint at http://localhost:8085/data.json. Falls back to
 * a deterministic mock so widgets still render.
 */
export class SensorsProvider {
  private settings: AppSettings;
  private snapshot: SensorSnapshot | null = null;
  private timer: NodeJS.Timeout | null = null;
  private onUpdate: (s: SensorSnapshot) => void;
  private mockTick = 0;

  constructor(settings: AppSettings, onUpdate: (s: SensorSnapshot) => void) {
    this.settings = settings;
    this.onUpdate = onUpdate;
  }

  applySettings(s: AppSettings) {
    this.settings = s;
    this.restart();
  }

  setPreferred(p: AppSettings['sensors']['preferred']) {
    this.settings = { ...this.settings, sensors: { ...this.settings.sensors, preferred: p } };
    this.restart();
  }

  start() {
    this.tick();
    this.timer = setInterval(() => this.tick(), this.settings.sensors.pollMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private restart() {
    this.stop();
    this.start();
  }

  last(): SensorSnapshot | null {
    return this.snapshot;
  }

  private async tick() {
    const pref = this.settings.sensors.preferred;
    let snap: SensorSnapshot | null = null;

    if (pref === 'mock') {
      snap = this.mock();
    } else {
      if (pref === 'signalrgb' || pref === 'auto') {
        snap = await this.trySignalRgb();
      }
      if (!snap && (pref === 'lhm' || pref === 'auto')) {
        snap = await this.tryLhm();
      }
      if (!snap && pref === 'auto') {
        snap = this.mock();
      }
    }

    if (snap) {
      this.snapshot = snap;
      this.onUpdate(snap);
    }
  }

  private async trySignalRgb(): Promise<SensorSnapshot | null> {
    // SignalRGB does not currently expose a public local API for sensor
    // values. Probe a few well-known local ports as best-effort; fail fast.
    const candidates = ['http://127.0.0.1:16034/sensors', 'http://127.0.0.1:8787/sensors'];
    for (const url of candidates) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(400) });
        if (!res.ok) continue;
        const data: any = await res.json();
        return {
          source: 'signalrgb',
          updatedAt: Date.now(),
          cpuTempC: numOr(data.cpuTempC),
          cpuLoadPct: numOr(data.cpuLoadPct),
          cpuPowerW: numOr(data.cpuPowerW),
          gpuTempC: numOr(data.gpuTempC),
          gpuLoadPct: numOr(data.gpuLoadPct),
          gpuPowerW: numOr(data.gpuPowerW),
          memUsedPct: numOr(data.memUsedPct)
        };
      } catch {
        continue;
      }
    }
    return null;
  }

  private async tryLhm(): Promise<SensorSnapshot | null> {
    try {
      const res = await fetch(this.settings.sensors.lhmUrl, {
        signal: AbortSignal.timeout(800)
      });
      if (!res.ok) return null;
      const data: any = await res.json();
      const flat = flattenLhm(data);

      return {
        source: 'lhm',
        updatedAt: Date.now(),
        cpuTempC: pickFirst(flat, /CPU.*(Package|Core.*Average|Tdie|Tctl)/i, 'Temperature'),
        cpuLoadPct: pickFirst(flat, /CPU.*Total/i, 'Load'),
        cpuPowerW: pickFirst(flat, /CPU.*Package|CPU.*Power/i, 'Power'),
        gpuTempC: pickFirst(flat, /GPU.*Core|GPU/i, 'Temperature'),
        gpuLoadPct: pickFirst(flat, /GPU.*Core|GPU/i, 'Load'),
        gpuPowerW: pickFirst(flat, /GPU.*(Power|Total)/i, 'Power'),
        memUsedPct: pickFirst(flat, /Memory/i, 'Load')
      };
    } catch {
      return null;
    }
  }

  private mock(): SensorSnapshot {
    this.mockTick++;
    const wave = (period: number, base: number, amp: number) =>
      base + Math.sin(this.mockTick / period) * amp;
    return {
      source: 'mock',
      updatedAt: Date.now(),
      cpuTempC: Math.round(wave(7, 55, 8)),
      cpuLoadPct: Math.max(2, Math.round(wave(5, 30, 25))),
      cpuPowerW: Math.round(wave(11, 65, 15)),
      gpuTempC: Math.round(wave(9, 60, 7)),
      gpuLoadPct: Math.max(0, Math.round(wave(4, 40, 35))),
      gpuPowerW: Math.round(wave(13, 180, 60)),
      memUsedPct: Math.round(wave(17, 50, 10))
    };
  }
}

function numOr(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

interface FlatNode {
  path: string;
  value: number | null;
  type: string;
}

function flattenLhm(root: any): FlatNode[] {
  const out: FlatNode[] = [];
  const walk = (node: any, prefix: string) => {
    if (!node) return;
    const name = node.Text ?? node.text ?? '';
    const here = prefix ? `${prefix} / ${name}` : name;
    const valueRaw = node.Value ?? node.value;
    let value: number | null = null;
    if (typeof valueRaw === 'string') {
      const m = valueRaw.match(/-?[0-9]+(?:[.,][0-9]+)?/);
      if (m) value = parseFloat(m[0].replace(',', '.'));
    } else if (typeof valueRaw === 'number') {
      value = valueRaw;
    }
    const type = node.Type ?? node.SensorType ?? '';
    if (value != null) out.push({ path: here, value, type });
    const children = node.Children ?? node.children ?? [];
    for (const c of children) walk(c, here);
  };
  walk(root, '');
  return out;
}

function pickFirst(nodes: FlatNode[], pathRe: RegExp, type: string): number | null {
  const match = nodes.find((n) => pathRe.test(n.path) && n.type.toLowerCase().includes(type.toLowerCase()));
  return match ? match.value : null;
}
