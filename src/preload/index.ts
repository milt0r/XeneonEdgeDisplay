import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from '../shared/ipc-contract';
import type { IpcApi, ProviderEventKind } from '../shared/ipc-contract';

const api: IpcApi = {
  getSettings: () => ipcRenderer.invoke(IPC.Settings.get),
  updateSettings: (patch) => ipcRenderer.invoke(IPC.Settings.update, patch),

  setSecret: (key, value) => ipcRenderer.invoke(IPC.Secrets.set, key, value),
  hasSecret: (key) => ipcRenderer.invoke(IPC.Secrets.has, key),
  clearSecret: (key) => ipcRenderer.invoke(IPC.Secrets.clear, key),

  getLayout: () => ipcRenderer.invoke(IPC.Layout.get),
  saveLayout: (items) => ipcRenderer.invoke(IPC.Layout.save, items),

  weather: {
    refresh: () => ipcRenderer.invoke(IPC.Weather.refresh),
    snapshot: () => ipcRenderer.invoke(IPC.Weather.snapshot)
  },
  sensors: {
    snapshot: () => ipcRenderer.invoke(IPC.Sensors.snapshot),
    setSource: (src) => ipcRenderer.invoke(IPC.Sensors.setSource, src)
  },
  ha: {
    listEntities: () => ipcRenderer.invoke(IPC.Ha.list),
    callService: (domain, service, data) => ipcRenderer.invoke(IPC.Ha.call, domain, service, data),
    test: (baseUrl, token) => ipcRenderer.invoke(IPC.Ha.test, baseUrl, token),
    cameraSnapshot: (entityId) => ipcRenderer.invoke(IPC.Ha.camera, entityId)
  },
  spotify: {
    snapshot: () => ipcRenderer.invoke(IPC.Spotify.snapshot),
    play: () => ipcRenderer.invoke(IPC.Spotify.play),
    pause: () => ipcRenderer.invoke(IPC.Spotify.pause),
    next: () => ipcRenderer.invoke(IPC.Spotify.next),
    previous: () => ipcRenderer.invoke(IPC.Spotify.previous),
    setVolume: (p) => ipcRenderer.invoke(IPC.Spotify.setVolume, p),
    transferTo: (id) => ipcRenderer.invoke(IPC.Spotify.transferTo, id),
    listDevices: () => ipcRenderer.invoke(IPC.Spotify.listDevices),
    beginAuth: () => ipcRenderer.invoke(IPC.Spotify.beginAuth),
    isAuthorized: () => ipcRenderer.invoke(IPC.Spotify.isAuthorized),
    logout: () => ipcRenderer.invoke(IPC.Spotify.logout)
  },
  window: {
    toggleFullscreen: () => ipcRenderer.invoke(IPC.Window.toggleFullscreen),
    quit: () => ipcRenderer.invoke(IPC.Window.quit)
  },
  stocks: {
    quotes: (symbols) => ipcRenderer.invoke(IPC.Stocks.quotes, symbols),
    news: (symbols) => ipcRenderer.invoke(IPC.Stocks.news, symbols)
  },
  sports: {
    games: (leagues) => ipcRenderer.invoke(IPC.Sports.games, leagues),
    teams: (league) => ipcRenderer.invoke(IPC.Sports.teams, league)
  },
  net: {
    speedtest: () => ipcRenderer.invoke(IPC.Net.speedtest),
    arp: () => ipcRenderer.invoke(IPC.Net.arp)
  },
  calendar: {
    fetchIcs: (url) => ipcRenderer.invoke(IPC.Calendar.fetchIcs, url)
  },
  scripts: {
    run: (cmd, timeoutMs) => ipcRenderer.invoke(IPC.Scripts.run, cmd, timeoutMs)
  },
  on(channel: ProviderEventKind, handler: (payload: any) => void) {
    const listener = (_e: unknown, msg: { kind: string; payload: unknown }) => {
      if (msg && msg.kind === channel) handler(msg.payload);
    };
    ipcRenderer.on(IPC.Events.provider, listener);
    return () => ipcRenderer.off(IPC.Events.provider, listener);
  }
};

contextBridge.exposeInMainWorld('api', api);
