export type League = 'nhl' | 'nfl' | 'nba' | 'mlb';

export interface SportsTeam {
  league: League;
  id: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  location: string;
  logo: string;
  color?: string;
  alternateColor?: string;
}

export interface SportsCompetitor {
  teamId: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  logo: string;
  homeAway: 'home' | 'away';
  score: number;
  record: string | null;
  winner: boolean;
}

export interface SportsGame {
  league: League;
  id: string;
  date: string;
  status: {
    state: 'pre' | 'in' | 'post';
    detail: string;
    shortDetail: string;
    clock?: string;
    period?: number;
  };
  home: SportsCompetitor;
  away: SportsCompetitor;
  venue?: string;
  broadcast?: string;
}
