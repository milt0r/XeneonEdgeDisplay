// Spotify — fake now-playing with working pause/play toggle.
const TRACKS = [
  { name: 'Atomic Heart Bar', artist: 'Mick Gordon', album: 'Doom Eternal OST' },
  { name: 'Lightspeed', artist: 'Carpenter Brut', album: 'Trilogy' },
  { name: 'Test Shot Starfish', artist: 'Carpenter Brut', album: 'Leather Teeth' },
];

const SpotifyWidget = ({ editing, onRemove }) => {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [idx, setIdx] = React.useState(0);
  const [vol, setVol] = React.useState(60);
  const t = TRACKS[idx];
  return (
    <Widget title="Spotify" editing={editing} hasConfig={false} onRemove={onRemove}>
      <div className="spotify-row">
        <div className="spotify-art"></div>
        <div className="spotify-info">
          <div className="spotify-track">{t.name}</div>
          <div className="spotify-artist">{t.artist} • {t.album}</div>
          <div className="transport">
            <button className="btn" onClick={() => setIdx((i) => (i + TRACKS.length - 1) % TRACKS.length)}>⏮</button>
            {isPlaying ? (
              <button className="btn active" onClick={() => setIsPlaying(false)}>⏸</button>
            ) : (
              <button className="btn" onClick={() => setIsPlaying(true)}>▶</button>
            )}
            <button className="btn" onClick={() => setIdx((i) => (i + 1) % TRACKS.length)}>⏭</button>
            <span className="meta">Desktop · {vol}%</span>
          </div>
        </div>
      </div>
    </Widget>
  );
};

window.SpotifyWidget = SpotifyWidget;
