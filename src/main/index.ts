import { app, BrowserWindow, ipcMain, safeStorage } from 'electron';
import path from 'node:path';
import { IPC } from '../shared/ipc-contract';
import { DEFAULT_LAYOUT, DEFAULT_SETTINGS } from '../shared/defaults';
import type { AppSettings, WidgetLayoutItem } from '../shared/types';
import { SecretsStore } from './secrets';
import { SettingsStore } from './settings';
import { WeatherProvider } from './providers/weather';
import { SensorsProvider } from './providers/sensors';
import { HomeAssistantProvider } from './providers/home-assistant';
import { SpotifyProvider } from './providers/spotify';
import { StocksProvider } from './providers/stocks';
import { SportsProvider } from './providers/sports';
import { NetProvider } from './providers/net';
import { CalendarProvider } from './providers/calendar';
import { ScriptsProvider } from './providers/scripts';

const isDev = !!process.env.VITE_DEV_SERVER_URL;

let mainWindow: BrowserWindow | null = null;

const settingsStore = new SettingsStore(DEFAULT_SETTINGS, DEFAULT_LAYOUT);
let secrets: SecretsStore;
let weather: WeatherProvider;
let sensors: SensorsProvider;
let ha: HomeAssistantProvider;
let spotify: SpotifyProvider;
let stocks: StocksProvider;
let sports: SportsProvider;
let net: NetProvider;
let calendarProv: CalendarProvider;
let scriptsProv: ScriptsProvider;

function createWindow() {
  const win = new BrowserWindow({
    width: 2560,
    height: 720,
    fullscreen: !isDev,
    kiosk: !isDev,
    frame: isDev,
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.setMenuBarVisibility(false);

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  win.webContents.on('did-finish-load', () => {
    try {
      const scale = settingsStore.getSettings().ui?.fontScale ?? 1.0;
      win.webContents.setZoomFactor(Math.max(0.6, Math.min(2.0, scale)));
    } catch {}
  });

  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11') {
      win.setFullScreen(!win.isFullScreen());
      event.preventDefault();
    }
    if (input.control && input.shift && input.key.toLowerCase() === 'q') {
      app.quit();
    }
  });

  mainWindow = win;
  return win;
}

function broadcast(channel: string, payload: unknown) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(IPC.Events.provider, { kind: channel, payload });
  }
}

function registerIpc() {
  ipcMain.handle(IPC.Settings.get, () => settingsStore.getSettings());
  ipcMain.handle(IPC.Settings.update, (_e, patch: Partial<AppSettings>) => {
    const next = settingsStore.updateSettings(patch);
    weather.applySettings(next);
    sensors.applySettings(next);
    ha.applySettings(next);
    spotify.applySettings(next);
    if (mainWindow && !mainWindow.isDestroyed()) {
      const scale = Math.max(0.6, Math.min(2.0, next.ui?.fontScale ?? 1.0));
      try { mainWindow.webContents.setZoomFactor(scale); } catch {}
    }
    return next;
  });

  ipcMain.handle(IPC.Secrets.set, async (_e, key: string, value: string) => secrets.set(key, value));
  ipcMain.handle(IPC.Secrets.has, (_e, key: string) => secrets.has(key));
  ipcMain.handle(IPC.Secrets.clear, (_e, key: string) => secrets.clear(key));

  ipcMain.handle(IPC.Layout.get, () => settingsStore.getLayout());
  ipcMain.handle(IPC.Layout.save, (_e, items: WidgetLayoutItem[]) => settingsStore.saveLayout(items));

  ipcMain.handle(IPC.Weather.refresh, () => weather.refresh());
  ipcMain.handle(IPC.Weather.snapshot, () => weather.last());

  ipcMain.handle(IPC.Sensors.snapshot, () => sensors.last());
  ipcMain.handle(IPC.Sensors.setSource, (_e, src) => sensors.setPreferred(src));

  ipcMain.handle(IPC.Ha.list, () => ha.listEntities());
  ipcMain.handle(IPC.Ha.call, (_e, domain: string, service: string, data?: Record<string, unknown>) =>
    ha.callService(domain, service, data)
  );
  ipcMain.handle(IPC.Ha.test, (_e, baseUrl: string, token: string) => ha.test(baseUrl, token));
  ipcMain.handle(IPC.Ha.camera, (_e, entityId: string) => ha.cameraSnapshot(entityId));

  ipcMain.handle(IPC.Spotify.snapshot, () => spotify.last());
  ipcMain.handle(IPC.Spotify.play, () => spotify.play());
  ipcMain.handle(IPC.Spotify.pause, () => spotify.pause());
  ipcMain.handle(IPC.Spotify.next, () => spotify.next());
  ipcMain.handle(IPC.Spotify.previous, () => spotify.previous());
  ipcMain.handle(IPC.Spotify.setVolume, (_e, p: number) => spotify.setVolume(p));
  ipcMain.handle(IPC.Spotify.transferTo, (_e, id: string) => spotify.transferTo(id));
  ipcMain.handle(IPC.Spotify.listDevices, () => spotify.listDevices());
  ipcMain.handle(IPC.Spotify.beginAuth, () => spotify.beginAuth());
  ipcMain.handle(IPC.Spotify.isAuthorized, () => spotify.isAuthorized());
  ipcMain.handle(IPC.Spotify.logout, () => spotify.logout());

  ipcMain.handle(IPC.Window.toggleFullscreen, () => {
    if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen());
  });
  ipcMain.handle(IPC.Window.quit, () => app.quit());

  ipcMain.handle(IPC.Stocks.quotes, (_e, symbols: string[]) => stocks.quotes(symbols));
  ipcMain.handle(IPC.Stocks.news, (_e, symbols: string[]) => stocks.news(symbols));

  ipcMain.handle(IPC.Sports.games, (_e, leagues: any[]) => sports.games(leagues));
  ipcMain.handle(IPC.Sports.teams, (_e, league: any) => sports.teams(league));

  ipcMain.handle(IPC.Net.speedtest, () => net.speedtest());
  ipcMain.handle(IPC.Net.arp, () => net.arp());
  ipcMain.handle(IPC.Calendar.fetchIcs, (_e, url: string) => calendarProv.fetchIcs(url));
  ipcMain.handle(IPC.Scripts.run, (_e, cmd: string, t?: number) => scriptsProv.run(cmd, t));
}

app.whenReady().then(() => {
  secrets = new SecretsStore(safeStorage);
  const initial = settingsStore.getSettings();

  weather = new WeatherProvider(initial, (snap) => broadcast('weather', snap));
  sensors = new SensorsProvider(initial, (snap) => broadcast('sensors', snap));
  ha = new HomeAssistantProvider(initial, secrets, {
    onState: (s) => broadcast('ha:state', s),
    onBulk: (s) => broadcast('ha:bulk', s)
  });
  spotify = new SpotifyProvider(initial, secrets, (snap) => broadcast('spotify', snap));
  stocks = new StocksProvider();
  sports = new SportsProvider();
  net = new NetProvider();
  calendarProv = new CalendarProvider();
  scriptsProv = new ScriptsProvider();

  registerIpc();
  createWindow();

  weather.start();
  sensors.start();
  ha.start();
  spotify.start();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  weather?.stop();
  sensors?.stop();
  ha?.stop();
  spotify?.stop();
});
