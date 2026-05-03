import React, { useEffect, useState } from 'react';
import type { WidgetPlugin } from '@shared/widget-plugin';
import { useApp } from '../store/app';

const Spotify: React.FC = () => {
  const playback = useApp((s) => s.spotify);
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    window.api.spotify.isAuthorized().then(setAuthed);
  }, []);

  if (!authed) {
    return (
      <div className="col center fill">
        <div className="muted mono" style={{ marginBottom: 8 }}>Not connected to Spotify</div>
        <div className="mono" style={{ fontSize: 11 }}>Open Settings → Spotify to connect</div>
      </div>
    );
  }

  if (!playback || !playback.track) {
    return (
      <div className="col center fill">
        <div className="muted mono">Nothing playing</div>
        <div className="transport" style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => window.api.spotify.play()}>▶</button>
        </div>
      </div>
    );
  }

  const t = playback.track;
  return (
    <div className="row fill" style={{ gap: 12, alignItems: 'center' }}>
      <div
        className="spotify-art"
        style={{ backgroundImage: t.artUrl ? `url(${t.artUrl})` : undefined }}
      />
      <div className="col fill" style={{ gap: 8, minWidth: 0 }}>
        <div className="spotify-track" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {t.name}
        </div>
        <div className="spotify-artist" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {t.artists.join(', ')} • {t.album}
        </div>
        <div className="transport">
          <button className="btn" onClick={() => window.api.spotify.previous()}>⏮</button>
          {playback.isPlaying ? (
            <button className="btn btn-active" onClick={() => window.api.spotify.pause()}>⏸</button>
          ) : (
            <button className="btn" onClick={() => window.api.spotify.play()}>▶</button>
          )}
          <button className="btn" onClick={() => window.api.spotify.next()}>⏭</button>
          <span className="muted mono" style={{ fontSize: 11, marginLeft: 8 }}>
            {playback.device ?? 'No device'} • {playback.volumePct}%
          </span>
        </div>
      </div>
    </div>
  );
};

export const SpotifyWidget: WidgetPlugin = {
  id: 'spotify',
  title: 'Spotify',
  description: 'Now playing + transport controls',
  category: 'media',
  defaultSize: { w: 4, h: 2 },
  themeable: true,
  component: Spotify
};
