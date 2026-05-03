export interface NhlTeam {
  id: string;
  name: string;
  abbr: string;
  city: string;
  conference: 'East' | 'West';
  primary: string;
  secondary: string;
  tertiary?: string;
  fg: string; // text color on primary background
}

export const NHL_TEAMS: NhlTeam[] = [
  { id: 'anaheim', name: 'Ducks', city: 'Anaheim', abbr: 'ANA', conference: 'West', primary: '#FC4C02', secondary: '#B5985A', tertiary: '#000000', fg: '#ffffff' },
  { id: 'boston', name: 'Bruins', city: 'Boston', abbr: 'BOS', conference: 'East', primary: '#000000', secondary: '#FFB81C', fg: '#FFB81C' },
  { id: 'buffalo', name: 'Sabres', city: 'Buffalo', abbr: 'BUF', conference: 'East', primary: '#003087', secondary: '#FFB81C', fg: '#ffffff' },
  { id: 'calgary', name: 'Flames', city: 'Calgary', abbr: 'CGY', conference: 'West', primary: '#C8102E', secondary: '#F1BE48', tertiary: '#000000', fg: '#ffffff' },
  { id: 'carolina', name: 'Hurricanes', city: 'Carolina', abbr: 'CAR', conference: 'East', primary: '#CC0000', secondary: '#000000', tertiary: '#A2AAAD', fg: '#ffffff' },
  { id: 'chicago', name: 'Blackhawks', city: 'Chicago', abbr: 'CHI', conference: 'West', primary: '#CF0A2C', secondary: '#000000', tertiary: '#FFD100', fg: '#ffffff' },
  { id: 'colorado', name: 'Avalanche', city: 'Colorado', abbr: 'COL', conference: 'West', primary: '#6F263D', secondary: '#236192', tertiary: '#A2AAAD', fg: '#ffffff' },
  { id: 'columbus', name: 'Blue Jackets', city: 'Columbus', abbr: 'CBJ', conference: 'East', primary: '#002654', secondary: '#CE1126', tertiary: '#A4A9AD', fg: '#ffffff' },
  { id: 'dallas', name: 'Stars', city: 'Dallas', abbr: 'DAL', conference: 'West', primary: '#006847', secondary: '#8A8D8F', tertiary: '#000000', fg: '#ffffff' },
  { id: 'detroit', name: 'Red Wings', city: 'Detroit', abbr: 'DET', conference: 'East', primary: '#CE1126', secondary: '#FFFFFF', fg: '#ffffff' },
  { id: 'edmonton', name: 'Oilers', city: 'Edmonton', abbr: 'EDM', conference: 'West', primary: '#041E42', secondary: '#FF4C00', fg: '#FF4C00' },
  { id: 'florida', name: 'Panthers', city: 'Florida', abbr: 'FLA', conference: 'East', primary: '#041E42', secondary: '#C8102E', tertiary: '#B9975B', fg: '#ffffff' },
  { id: 'losangeles', name: 'Kings', city: 'Los Angeles', abbr: 'LAK', conference: 'West', primary: '#111111', secondary: '#A2AAAD', tertiary: '#FFFFFF', fg: '#ffffff' },
  { id: 'minnesota', name: 'Wild', city: 'Minnesota', abbr: 'MIN', conference: 'West', primary: '#154734', secondary: '#A6192E', tertiary: '#EAAA00', fg: '#ffffff' },
  { id: 'montreal', name: 'Canadiens', city: 'Montreal', abbr: 'MTL', conference: 'East', primary: '#AF1E2D', secondary: '#192168', tertiary: '#FFFFFF', fg: '#ffffff' },
  { id: 'nashville', name: 'Predators', city: 'Nashville', abbr: 'NSH', conference: 'West', primary: '#FFB81C', secondary: '#041E42', fg: '#041E42' },
  { id: 'newjersey', name: 'Devils', city: 'New Jersey', abbr: 'NJD', conference: 'East', primary: '#CE1126', secondary: '#000000', tertiary: '#FFFFFF', fg: '#ffffff' },
  { id: 'islanders', name: 'Islanders', city: 'New York', abbr: 'NYI', conference: 'East', primary: '#00539B', secondary: '#F47D30', tertiary: '#FFFFFF', fg: '#ffffff' },
  { id: 'rangers', name: 'Rangers', city: 'New York', abbr: 'NYR', conference: 'East', primary: '#0038A8', secondary: '#CE1126', tertiary: '#FFFFFF', fg: '#ffffff' },
  { id: 'ottawa', name: 'Senators', city: 'Ottawa', abbr: 'OTT', conference: 'East', primary: '#C8102E', secondary: '#000000', tertiary: '#C69214', fg: '#ffffff' },
  { id: 'philadelphia', name: 'Flyers', city: 'Philadelphia', abbr: 'PHI', conference: 'East', primary: '#F74902', secondary: '#000000', tertiary: '#FFFFFF', fg: '#ffffff' },
  { id: 'pittsburgh', name: 'Penguins', city: 'Pittsburgh', abbr: 'PIT', conference: 'East', primary: '#000000', secondary: '#FCB514', tertiary: '#FFFFFF', fg: '#FCB514' },
  { id: 'sanjose', name: 'Sharks', city: 'San Jose', abbr: 'SJS', conference: 'West', primary: '#006D75', secondary: '#000000', tertiary: '#EA7200', fg: '#ffffff' },
  { id: 'seattle', name: 'Kraken', city: 'Seattle', abbr: 'SEA', conference: 'West', primary: '#001628', secondary: '#99D9D9', tertiary: '#E9072B', fg: '#99D9D9' },
  { id: 'stlouis', name: 'Blues', city: 'St. Louis', abbr: 'STL', conference: 'West', primary: '#002F87', secondary: '#FCB514', tertiary: '#041E42', fg: '#ffffff' },
  { id: 'tampabay', name: 'Lightning', city: 'Tampa Bay', abbr: 'TBL', conference: 'East', primary: '#002868', secondary: '#FFFFFF', fg: '#ffffff' },
  { id: 'toronto', name: 'Maple Leafs', city: 'Toronto', abbr: 'TOR', conference: 'East', primary: '#00205B', secondary: '#FFFFFF', fg: '#ffffff' },
  { id: 'utah', name: 'Hockey Club', city: 'Utah', abbr: 'UTA', conference: 'West', primary: '#71AFE5', secondary: '#000000', tertiary: '#FFFFFF', fg: '#000000' },
  { id: 'vancouver', name: 'Canucks', city: 'Vancouver', abbr: 'VAN', conference: 'West', primary: '#00205B', secondary: '#00843D', tertiary: '#FFFFFF', fg: '#ffffff' },
  { id: 'vegas', name: 'Golden Knights', city: 'Vegas', abbr: 'VGK', conference: 'West', primary: '#333F42', secondary: '#B4975A', tertiary: '#C8102E', fg: '#B4975A' },
  { id: 'washington', name: 'Capitals', city: 'Washington', abbr: 'WSH', conference: 'East', primary: '#C8102E', secondary: '#041E42', tertiary: '#FFFFFF', fg: '#ffffff' },
  { id: 'winnipeg', name: 'Jets', city: 'Winnipeg', abbr: 'WPG', conference: 'West', primary: '#041E42', secondary: '#004C97', tertiary: '#A2AAAD', fg: '#ffffff' }
];

export function getNhlTeam(id: string): NhlTeam {
  return NHL_TEAMS.find((t) => t.id === id) ?? NHL_TEAMS.find((t) => t.id === 'detroit')!;
}

/**
 * Build a per-team background that combines a team-colored rink with the
 * official NHL logo SVG (hosted on NHL's CDN at assets.nhle.com).
 * The logo is layered on top of a procedural rink so the team colors
 * still shine through.
 */
export function nhlBackground(team: NhlTeam): string {
  const enc = (s: string) => encodeURIComponent(s);
  const ice = '#f0f6ff';
  const line = team.secondary;
  const goal = team.primary;
  const circle = team.tertiary ?? team.secondary;
  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 720' preserveAspectRatio='xMidYMid slice'>
  <defs>
    <radialGradient id='vig' cx='50%' cy='50%' r='65%'>
      <stop offset='0%' stop-color='${ice}' stop-opacity='1'/>
      <stop offset='100%' stop-color='${goal}' stop-opacity='0.85'/>
    </radialGradient>
  </defs>
  <rect width='2560' height='720' fill='url(#vig)'/>
  <!-- center red line -->
  <rect x='1270' y='0' width='20' height='720' fill='${goal}' opacity='0.35'/>
  <!-- two blue lines -->
  <rect x='720' y='0' width='14' height='720' fill='${line}' opacity='0.35'/>
  <rect x='1826' y='0' width='14' height='720' fill='${line}' opacity='0.35'/>
  <!-- center faceoff circle -->
  <circle cx='1280' cy='360' r='130' fill='none' stroke='${goal}' stroke-width='4' opacity='0.45'/>
  <circle cx='1280' cy='360' r='14' fill='${goal}' opacity='0.5'/>
  <!-- end faceoff circles -->
  <circle cx='420' cy='220' r='90' fill='none' stroke='${circle}' stroke-width='3' opacity='0.35'/>
  <circle cx='420' cy='500' r='90' fill='none' stroke='${circle}' stroke-width='3' opacity='0.35'/>
  <circle cx='2140' cy='220' r='90' fill='none' stroke='${circle}' stroke-width='3' opacity='0.35'/>
  <circle cx='2140' cy='500' r='90' fill='none' stroke='${circle}' stroke-width='3' opacity='0.35'/>
  <!-- goal creases -->
  <path d='M 60 280 L 130 280 A 80 80 0 0 1 130 440 L 60 440 Z' fill='${line}' opacity='0.18'/>
  <path d='M 2500 280 L 2430 280 A 80 80 0 0 0 2430 440 L 2500 440 Z' fill='${line}' opacity='0.18'/>
</svg>`.trim();
  const rink = `url("data:image/svg+xml;utf8,${enc(svg)}")`;
  // Official NHL CDN logo URL (light variant works on most rink palettes).
  const logo = `url("${nhlLogoUrl(team)}")`;
  // Layer order: logo (top, centered) over rink, with team primary as the
  // ultimate fallback color.
  return `${logo} center / 40% no-repeat, ${rink} center / cover no-repeat, ${team.primary}`;
}

export function nhlLogoUrl(team: NhlTeam): string {
  return `https://assets.nhle.com/logos/nhl/svg/${team.abbr}_light.svg`;
}
