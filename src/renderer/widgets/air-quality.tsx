import React, { useEffect, useRef, useState } from 'react';
import type { WidgetPlugin } from '@shared/widget-plugin';

interface Air {
  pm10: number | null;
  pm25: number | null;
  aqi: number | null;
  ozone: number | null;
  no2: number | null;
}

const AQI_LEVELS = [
  { max: 50, label: 'Good', color: '#22c55e' },
  { max: 100, label: 'Moderate', color: '#eab308' },
  { max: 150, label: 'Unhealthy SG', color: '#f97316' },
  { max: 200, label: 'Unhealthy', color: '#ef4444' },
  { max: 300, label: 'Very Unhealthy', color: '#a855f7' },
  { max: Infinity, label: 'Hazardous', color: '#7f1d1d' }
];

function aqiInfo(aqi: number | null) {
  if (aqi == null) return { label: '—', color: 'var(--fg-muted)' };
  return AQI_LEVELS.find((l) => aqi <= l.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1];
}

const AirQuality: React.FC = () => {
  const [air, setAir] = useState<Air | null>(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const radarRef = useRef<HTMLImageElement>(null);
  const [tile, setTile] = useState<string | null>(null);

  // Use the existing weather settings for location.
  useEffect(() => {
    (async () => {
      const settings = await window.api.getSettings();
      let lat = settings.weather.latitude;
      let lon = settings.weather.longitude;
      if (lat == null || lon == null) {
        try {
          const ip = await fetch('https://ipapi.co/json/').then((r) => r.json());
          lat = ip.latitude; lon = ip.longitude;
        } catch {}
      }
      if (lat != null && lon != null) setCoords({ lat, lon });
    })();
  }, []);

  useEffect(() => {
    if (!coords) return;
    const refresh = async () => {
      setLoading(true);
      try {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&current=us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide`;
        const data: any = await (await fetch(url)).json();
        const c = data.current ?? {};
        setAir({
          pm10: c.pm10 ?? null,
          pm25: c.pm2_5 ?? null,
          aqi: c.us_aqi ?? null,
          ozone: c.ozone ?? null,
          no2: c.nitrogen_dioxide ?? null
        });
      } catch {}
      setLoading(false);
    };
    refresh();
    const id = setInterval(refresh, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [coords]);

  // RainViewer radar — grab the latest available frame for our coords.
  useEffect(() => {
    if (!coords) return;
    const refresh = async () => {
      try {
        const idx: any = await (await fetch('https://api.rainviewer.com/public/weather-maps.json')).json();
        const frames = idx.radar?.past ?? [];
        const last = frames[frames.length - 1];
        if (!last) return;
        // 256-px tile; zoom 6 covers a wide region. lon/lat -> tile coords.
        const z = 6;
        const xt = Math.floor(((coords.lon + 180) / 360) * Math.pow(2, z));
        const lr = (coords.lat * Math.PI) / 180;
        const yt = Math.floor((1 - Math.log(Math.tan(lr) + 1 / Math.cos(lr)) / Math.PI) / 2 * Math.pow(2, z));
        const url = `${idx.host}${last.path}/512/${z}/${xt}/${yt}/2/1_1.png?ts=${last.time}`;
        setTile(url);
      } catch {}
    };
    refresh();
    const id = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [coords]);

  const info = aqiInfo(air?.aqi ?? null);

  return (
    <div className="row fill" style={{ gap: 12, minHeight: 0 }}>
      <div className="col" style={{ minWidth: 130, gap: 8 }}>
        <div className="metric-label">US AQI</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, color: info.color, lineHeight: 1 }}>
          {air?.aqi != null ? Math.round(air.aqi) : '—'}
        </div>
        <div className="mono" style={{ fontSize: 13, color: info.color, fontWeight: 700 }}>{info.label}</div>
        <div className="muted mono" style={{ fontSize: 11, marginTop: 6 }}>
          PM2.5  {air?.pm25 != null ? air.pm25.toFixed(1) : '—'} μg/m³<br/>
          PM10   {air?.pm10 != null ? air.pm10.toFixed(1) : '—'} μg/m³<br/>
          O₃     {air?.ozone != null ? Math.round(air.ozone) : '—'} μg/m³<br/>
          NO₂    {air?.no2 != null ? Math.round(air.no2) : '—'} μg/m³
        </div>
      </div>
      <div className="col fill" style={{ minWidth: 0 }}>
        <div className="metric-label">PRECIP RADAR</div>
        <div style={{ flex: 1, minHeight: 0, background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {tile ? (
            <img ref={radarRef} src={tile} alt="radar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span className="muted mono" style={{ fontSize: 11 }}>{loading ? 'Loading…' : 'No radar'}</span>
          )}
        </div>
        <div className="muted mono" style={{ fontSize: 10, marginTop: 4 }}>Open-Meteo · RainViewer</div>
      </div>
    </div>
  );
};

export const AirQualityWidget: WidgetPlugin = {
  id: 'air-quality',
  title: 'Air Quality + Radar',
  description: 'US AQI, PM2.5/PM10, ozone, plus a precipitation radar tile',
  category: 'info',
  defaultSize: { w: 4, h: 2 },
  themeable: true,
  component: AirQuality
};
