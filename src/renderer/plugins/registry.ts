import type { WidgetPlugin } from '@shared/widget-plugin';
import { ClockWidget } from '../widgets/clock';
import { AnalogClockWidget } from '../widgets/analog-clock';
import { WeatherWidget } from '../widgets/weather';
import { SensorsWidget } from '../widgets/sensors';
import { SpotifyWidget } from '../widgets/spotify';
import { HaTilesWidget } from '../widgets/ha-tiles';
import { QuickLaunchWidget } from '../widgets/quick-launch';
import { StocksWidget } from '../widgets/stocks';
import { SportsWidget } from '../widgets/sports';
import { PomodoroWidget } from '../widgets/pomodoro';
import { TodoWidget } from '../widgets/todo';
import { AirQualityWidget } from '../widgets/air-quality';
import { HackerNewsWidget } from '../widgets/hackernews';
import { SpeedtestWidget } from '../widgets/speedtest';
import { CalendarWidget } from '../widgets/calendar';
import { ScriptRunnerWidget } from '../widgets/scripts';
import { NetworkMapWidget } from '../widgets/network-map';
import { StubVoiceWidget, StubCalendarWidget } from '../widgets/stubs';

export const BUILTIN_PLUGINS: WidgetPlugin<any>[] = [
  ClockWidget,
  AnalogClockWidget,
  WeatherWidget,
  SensorsWidget,
  SpotifyWidget,
  HaTilesWidget,
  QuickLaunchWidget,
  StocksWidget,
  SportsWidget,
  PomodoroWidget,
  TodoWidget,
  AirQualityWidget,
  HackerNewsWidget,
  SpeedtestWidget,
  CalendarWidget,
  ScriptRunnerWidget,
  NetworkMapWidget,
  StubVoiceWidget,
  StubCalendarWidget
];

class Registry {
  private map = new Map<string, WidgetPlugin<any>>();
  constructor(initial: WidgetPlugin<any>[] = []) {
    for (const p of initial) this.map.set(p.id, p);
  }
  register(p: WidgetPlugin<any>) { this.map.set(p.id, p); }
  get(id: string): WidgetPlugin<any> | undefined { return this.map.get(id); }
  list(): WidgetPlugin<any>[] { return Array.from(this.map.values()); }
  enabledList(): WidgetPlugin<any>[] { return this.list().filter((p) => !p.external); }
}

export const PluginRegistry = new Registry(BUILTIN_PLUGINS);

// Stub: future external plugin loader will call PluginRegistry.register()
// after dynamic-importing modules from a `plugins/` directory.
export async function loadExternalPlugins(): Promise<void> {
  // Intentionally empty — see plan.md "Plugin system (mocked)".
}
