import React, { useEffect, useMemo, useState } from 'react';
import type { WidgetPlugin, WidgetComponentProps } from '@shared/widget-plugin';
import type { League, SportsGame, SportsTeam } from '@shared/sports';

interface Config {
  /** Selected leagues to fetch from. */
  leagues: League[];
  /** Per-league favorite team IDs. */
  favorites: Record<League, string[]>;
  /** Show only favorites' games when true; show everything otherwise. */
  favoritesOnly: boolean;
}

const DEFAULTS: Config = {
  leagues: ['nhl', 'nfl', 'nba', 'mlb'],
  favorites: { nhl: [], nfl: [], nba: [], mlb: [] },
  favoritesOnly: true
};

const LEAGUE_LABEL: Record<League, string> = {
  nhl: 'NHL', nfl: 'NFL', nba: 'NBA', mlb: 'MLB'
};

function gameSortKey(g: SportsGame): number {
  if (g.status.state === 'in') return 0;
  if (g.status.state === 'pre') return 1;
  return 2;
}

function ScoreCard({ game }: { game: SportsGame }) {
  const live = game.status.state === 'in';
  const post = game.status.state === 'post';
  const homeWin = post && game.home.winner;
  const awayWin = post && game.away.winner;

  return (
    <div className={`sports-card ${live ? 'live' : ''} ${post ? 'post' : ''}`}>
      <div className="sports-card-head">
        <span className="sports-league">{LEAGUE_LABEL[game.league]}</span>
        <span className={`sports-status ${live ? 'live' : ''}`}>
          {live && <span className="live-dot" />}{game.status.shortDetail || game.status.detail}
        </span>
      </div>
      <div className="sports-row">
        <Side side={game.away} loser={post && !awayWin} winner={awayWin} />
        <span className="sports-score-sep">@</span>
      </div>
      <div className="sports-row">
        <Side side={game.home} loser={post && !homeWin} winner={homeWin} />
      </div>
      {(game.broadcast || game.venue) && (
        <div className="sports-meta mono">
          {game.broadcast && <span>{game.broadcast}</span>}
          {game.venue && <span> · {game.venue}</span>}
        </div>
      )}
    </div>
  );
}

function Side({ side, winner, loser }: { side: SportsGame['home']; winner?: boolean; loser?: boolean }) {
  return (
    <div className={`sports-side ${winner ? 'winner' : ''} ${loser ? 'loser' : ''}`}>
      {side.logo && <img src={side.logo} alt={side.abbreviation} className="sports-logo" />}
      <div className="sports-team">
        <div className="sports-team-name">{side.shortDisplayName || side.displayName}</div>
        {side.record && <div className="sports-record mono">{side.record}</div>}
      </div>
      <div className="sports-score">{side.score}</div>
    </div>
  );
}

const TeamPicker: React.FC<{
  league: League;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}> = ({ league, selectedIds, onChange }) => {
  const [teams, setTeams] = useState<SportsTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    window.api.sports.teams(league).then((t) => {
      setTeams(t.sort((a, b) => a.displayName.localeCompare(b.displayName)));
      setLoading(false);
    });
  }, [league]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return teams;
    return teams.filter((t) =>
      t.displayName.toLowerCase().includes(q) ||
      t.abbreviation.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q)
    );
  }, [teams, filter]);

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  return (
    <details className="team-picker" open>
      <summary className="mono" style={{ cursor: 'pointer' }}>
        {LEAGUE_LABEL[league]} <span className="muted">· {selectedIds.length} favorite{selectedIds.length === 1 ? '' : 's'}</span>
      </summary>
      <input
        className="ha-search"
        style={{ minHeight: 36, fontSize: 13, padding: '6px 10px', marginTop: 6 }}
        placeholder={`Filter ${LEAGUE_LABEL[league]} teams…`}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="team-grid">
        {loading && <div className="muted mono">Loading…</div>}
        {filtered.map((t) => {
          const sel = selectedIds.includes(t.id);
          return (
            <button
              key={t.id}
              className={`team-chip ${sel ? 'selected' : ''}`}
              onClick={() => toggle(t.id)}
            >
              {t.logo && <img src={t.logo} alt="" className="team-chip-logo" />}
              <span>{t.shortDisplayName || t.abbreviation}</span>
              {sel && <span className="team-chip-check">✓</span>}
            </button>
          );
        })}
      </div>
    </details>
  );
};

const Sports: React.FC<WidgetComponentProps<Config>> = ({ config, updateConfig, configOpen }) => {
  const cfg: Config = {
    ...DEFAULTS,
    ...(config as Partial<Config>),
    favorites: { ...DEFAULTS.favorites, ...((config as any)?.favorites ?? {}) }
  };

  const [games, setGames] = useState<SportsGame[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (cfg.leagues.length === 0) { setGames([]); return; }
    setLoading(true);
    const g = await window.api.sports.games(cfg.leagues);
    setGames(g);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 20_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.leagues.join(',')]);

  const visible = useMemo(() => {
    let g = games;
    if (cfg.favoritesOnly) {
      g = g.filter((x) => {
        const favs = cfg.favorites[x.league] ?? [];
        if (favs.length === 0) return false;
        return favs.includes(x.home.teamId) || favs.includes(x.away.teamId);
      });
    }
    return [...g].sort((a, b) => {
      const k = gameSortKey(a) - gameSortKey(b);
      if (k !== 0) return k;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [games, cfg.favoritesOnly, JSON.stringify(cfg.favorites)]);

  const totalFavs = (Object.values(cfg.favorites) as string[][]).reduce((s, a) => s + a.length, 0);

  return (
    <div className="sports-widget">
      {configOpen && (
        <div className="widget-config no-drag">
          <div className="cfg-grid">
            {(['nhl', 'nfl', 'nba', 'mlb'] as League[]).map((lg) => (
              <label key={lg} className="cfg-toggle">
                <input
                  type="checkbox"
                  checked={cfg.leagues.includes(lg)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...new Set([...cfg.leagues, lg])]
                      : cfg.leagues.filter((x) => x !== lg);
                    updateConfig({ leagues: next });
                  }}
                /> {LEAGUE_LABEL[lg]}
              </label>
            ))}
            <label className="cfg-toggle">
              <input
                type="checkbox"
                checked={cfg.favoritesOnly}
                onChange={(e) => updateConfig({ favoritesOnly: e.target.checked })}
              /> Favorites only
            </label>
          </div>
          {cfg.leagues.map((lg) => (
            <TeamPicker
              key={lg}
              league={lg}
              selectedIds={cfg.favorites[lg] ?? []}
              onChange={(ids) =>
                updateConfig({ favorites: { ...cfg.favorites, [lg]: ids } })
              }
            />
          ))}
        </div>
      )}

      <div className="sports-list no-drag">
        {visible.length === 0 && !loading && (
          <div className="muted mono" style={{ padding: 12 }}>
            {cfg.favoritesOnly && totalFavs === 0
              ? 'Tap the gear and pick your favorite teams.'
              : 'No games found right now.'}
          </div>
        )}
        {visible.map((g) => <ScoreCard key={`${g.league}-${g.id}`} game={g} />)}
      </div>
    </div>
  );
};

export const SportsWidget: WidgetPlugin<Config> = {
  id: 'sports',
  title: 'Sports Scores',
  description: 'NHL / NFL / NBA / MLB live scores for your favorite teams',
  category: 'info',
  defaultSize: { w: 4, h: 2 },
  themeable: true,
  defaultConfig: DEFAULTS,
  component: Sports
};
