import type { League, SportsGame, SportsTeam } from '../../shared/sports';

const PATHS: Record<League, string> = {
  nhl: 'hockey/nhl',
  nfl: 'football/nfl',
  nba: 'basketball/nba',
  mlb: 'baseball/mlb'
};

const UA = 'Mozilla/5.0 (XeneonEdge)';

export class SportsProvider {
  private gameCache = new Map<League, { items: SportsGame[]; ts: number; hasLive: boolean }>();
  private teamCache = new Map<League, { items: SportsTeam[]; ts: number }>();

  async games(leagues: League[]): Promise<SportsGame[]> {
    const now = Date.now();
    const out: SportsGame[] = [];
    for (const league of leagues) {
      const cached = this.gameCache.get(league);
      const ttl = cached?.hasLive ? 15_000 : 90_000;
      if (cached && now - cached.ts < ttl) {
        out.push(...cached.items);
        continue;
      }
      try {
        const url = `https://site.api.espn.com/apis/site/v2/sports/${PATHS[league]}/scoreboard`;
        const res = await fetch(url, {
          headers: { 'User-Agent': UA, Accept: 'application/json' },
          signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) {
          if (cached) out.push(...cached.items);
          continue;
        }
        const data: any = await res.json();
        const games = parseScoreboard(league, data);
        const hasLive = games.some((g) => g.status.state === 'in');
        this.gameCache.set(league, { items: games, ts: now, hasLive });
        out.push(...games);
      } catch {
        if (cached) out.push(...cached.items);
      }
    }
    return out;
  }

  async teams(league: League): Promise<SportsTeam[]> {
    const now = Date.now();
    const cached = this.teamCache.get(league);
    if (cached && now - cached.ts < 24 * 60 * 60 * 1000) return cached.items;
    try {
      const url = `https://site.api.espn.com/apis/site/v2/sports/${PATHS[league]}/teams?limit=200`;
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json' },
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) return cached?.items ?? [];
      const data: any = await res.json();
      const items = parseTeams(league, data);
      this.teamCache.set(league, { items, ts: now });
      return items;
    } catch {
      return cached?.items ?? [];
    }
  }
}

function parseScoreboard(league: League, data: any): SportsGame[] {
  const events = data?.events ?? [];
  const out: SportsGame[] = [];
  for (const ev of events) {
    const comp = ev.competitions?.[0];
    if (!comp) continue;
    const competitors = comp.competitors ?? [];
    const home = pickCompetitor(competitors, 'home');
    const away = pickCompetitor(competitors, 'away');
    if (!home || !away) continue;
    const status = comp.status ?? ev.status ?? {};
    const stype = status.type ?? {};
    const stateRaw = String(stype.state ?? '').toLowerCase();
    const state: SportsGame['status']['state'] =
      stateRaw === 'in' ? 'in' : stateRaw === 'post' ? 'post' : 'pre';
    out.push({
      league,
      id: ev.id ?? comp.id,
      date: ev.date ?? comp.date ?? '',
      status: {
        state,
        detail: stype.detail ?? '',
        shortDetail: stype.shortDetail ?? '',
        clock: status.displayClock,
        period: status.period
      },
      home,
      away,
      venue: comp.venue?.fullName,
      broadcast: (comp.broadcasts?.[0]?.names ?? []).join(', ') || undefined
    });
  }
  return out;
}

function pickCompetitor(competitors: any[], side: 'home' | 'away') {
  const c = competitors.find((x) => x.homeAway === side);
  if (!c) return null;
  return {
    teamId: String(c.team?.id ?? c.id ?? ''),
    abbreviation: c.team?.abbreviation ?? '',
    displayName: c.team?.displayName ?? '',
    shortDisplayName: c.team?.shortDisplayName ?? c.team?.abbreviation ?? '',
    logo: c.team?.logo ?? c.team?.logos?.[0]?.href ?? '',
    homeAway: side,
    score: Number(c.score ?? 0),
    record: c.records?.[0]?.summary ?? null,
    winner: !!c.winner
  };
}

function parseTeams(league: League, data: any): SportsTeam[] {
  const groups = data?.sports?.[0]?.leagues?.[0]?.teams ?? [];
  return groups.map((g: any) => {
    const t = g.team ?? g;
    return {
      league,
      id: String(t.id),
      abbreviation: t.abbreviation ?? '',
      displayName: t.displayName ?? '',
      shortDisplayName: t.shortDisplayName ?? '',
      location: t.location ?? '',
      logo: t.logos?.[0]?.href ?? '',
      color: t.color,
      alternateColor: t.alternateColor
    } as SportsTeam;
  });
}
