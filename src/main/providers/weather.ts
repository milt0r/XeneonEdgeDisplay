import type { AppSettings, WeatherSnapshot } from '../../shared/types';

const WMO_TEXT: Record<number, string> = {
  0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Rain showers', 82: 'Violent rain', 95: 'Thunderstorm', 96: 'Thunder + hail', 99: 'Severe storm'
};

export class WeatherProvider {
  private settings: AppSettings;
  private snapshot: WeatherSnapshot | null = null;
  private timer: NodeJS.Timeout | null = null;
  private onUpdate: (s: WeatherSnapshot) => void;

  constructor(settings: AppSettings, onUpdate: (s: WeatherSnapshot) => void) {
    this.settings = settings;
    this.onUpdate = onUpdate;
  }

  applySettings(s: AppSettings) {
    this.settings = s;
    this.refresh().catch(() => {});
  }

  start() {
    this.refresh().catch(() => {});
    this.timer = setInterval(() => this.refresh().catch(() => {}), 10 * 60 * 1000);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  last(): WeatherSnapshot | null {
    return this.snapshot;
  }

  async refresh(): Promise<WeatherSnapshot | null> {
    try {
      let lat = this.settings.weather.latitude;
      let lon = this.settings.weather.longitude;
      let label = this.settings.weather.locationLabel;

      if (lat == null || lon == null) {
        const ip = await fetch('https://ipapi.co/json/').then((r) => r.json()).catch(() => null);
        if (ip && typeof ip.latitude === 'number') {
          lat = ip.latitude;
          lon = ip.longitude;
          label = `${ip.city ?? 'Auto'}, ${ip.region_code ?? ip.country_code ?? ''}`.trim();
        } else {
          return null;
        }
      }

      const url = new URL('https://api.open-meteo.com/v1/forecast');
      url.searchParams.set('latitude', String(lat));
      url.searchParams.set('longitude', String(lon));
      url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m');
      url.searchParams.set('hourly', 'temperature_2m,weather_code,precipitation');
      url.searchParams.set('forecast_days', '2');
      url.searchParams.set('timezone', 'auto');

      const res = await fetch(url.toString());
      if (!res.ok) return null;
      const data: any = await res.json();
      const cur = data.current;
      const code = cur.weather_code as number;

      const hourly = (data.hourly?.time ?? []).slice(0, 24).map((t: string, i: number) => ({
        time: t,
        tempC: data.hourly.temperature_2m[i],
        conditionCode: data.hourly.weather_code[i],
        precipMm: data.hourly.precipitation[i] ?? 0
      }));

      const snap: WeatherSnapshot = {
        location: label || 'Local',
        updatedAt: Date.now(),
        current: {
          tempC: cur.temperature_2m,
          feelsLikeC: cur.apparent_temperature,
          humidity: cur.relative_humidity_2m,
          windKph: cur.wind_speed_10m,
          conditionCode: code,
          conditionText: WMO_TEXT[code] ?? 'Unknown',
          isDay: cur.is_day === 1
        },
        hourly
      };

      this.snapshot = snap;
      this.onUpdate(snap);
      return snap;
    } catch (e) {
      return this.snapshot;
    }
  }
}
