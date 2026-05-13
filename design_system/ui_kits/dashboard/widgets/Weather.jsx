// Weather — current + 6-hr strip. Static mock fixture.
const WEATHER_FIXTURE = {
  location: 'Detroit, MI',
  icon: '⛅',
  temp: 64,
  conditionText: 'Partly cloudy',
  feels: 61,
  humidity: 47,
  windKph: 12,
  hourly: [
    { h: '13', icon: '⛅', t: 65 },
    { h: '14', icon: '⛅', t: 66 },
    { h: '15', icon: '🌤', t: 67 },
    { h: '16', icon: '🌤', t: 66 },
    { h: '17', icon: '🌦', t: 63 },
    { h: '18', icon: '🌧', t: 60 },
  ]
};

const WeatherWidget = ({ editing, onRemove }) => (
  <Widget title="Weather" editing={editing} hasConfig={false} onRemove={onRemove}>
    <div className="weather-stack">
      <div className="weather-top">
        <div className="weather-icon">{WEATHER_FIXTURE.icon}</div>
        <div className="weather-meta">
          <div className="weather-temp">{WEATHER_FIXTURE.temp}°</div>
          <div className="weather-sub">
            {WEATHER_FIXTURE.conditionText} · feels {WEATHER_FIXTURE.feels}°
          </div>
          <div className="weather-sub">
            {WEATHER_FIXTURE.location} · {WEATHER_FIXTURE.humidity}% RH · {WEATHER_FIXTURE.windKph} km/h
          </div>
        </div>
      </div>
      <div className="hourly">
        {WEATHER_FIXTURE.hourly.map((h, i) => (
          <div key={i} className="hourly-item">
            <span>{h.h}</span>
            <span style={{ fontSize: 22, lineHeight: 1 }}>{h.icon}</span>
            <span className="t">{h.t}°</span>
          </div>
        ))}
      </div>
    </div>
  </Widget>
);

window.WeatherWidget = WeatherWidget;
