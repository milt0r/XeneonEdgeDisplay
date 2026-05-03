/**
 * Sports themes. Pick a sport, then a team (or constructor / NASCAR team).
 * The active team's primary/secondary colors flow into the UI accents and
 * the background renders a sport-specific procedural "field" tinted in
 * those colors with the team's logo overlaid.
 *
 * Logos use stable public CDN URLs (NHL/ESPN/Wikipedia). Team color values
 * are the official primaries. None of the logos are bundled.
 */

export type Sport = 'nhl' | 'nfl' | 'nba' | 'mlb' | 'f1' | 'nascar';

export interface SportTeam {
  sport: Sport;
  id: string;
  /** Short label, often the city name + nickname. */
  name: string;
  abbr: string;
  /** Optional sublabel (e.g. driver name for F1/NASCAR teams). */
  subtitle?: string;
  primary: string;
  secondary: string;
  tertiary?: string;
  logo: string;
}

const NHL_TEAMS: SportTeam[] = [
  team('nhl', 'anaheim', 'Anaheim Ducks',          'ANA', '#FC4C02', '#B5985A', '#000000'),
  team('nhl', 'boston',  'Boston Bruins',          'BOS', '#000000', '#FFB81C'),
  team('nhl', 'buffalo', 'Buffalo Sabres',         'BUF', '#003087', '#FFB81C'),
  team('nhl', 'calgary', 'Calgary Flames',         'CGY', '#C8102E', '#F1BE48', '#000000'),
  team('nhl', 'carolina','Carolina Hurricanes',    'CAR', '#CC0000', '#000000'),
  team('nhl', 'chicago', 'Chicago Blackhawks',     'CHI', '#CF0A2C', '#000000', '#FFD100'),
  team('nhl', 'colorado','Colorado Avalanche',     'COL', '#6F263D', '#236192', '#A2AAAD'),
  team('nhl', 'columbus','Columbus Blue Jackets',  'CBJ', '#002654', '#CE1126', '#A4A9AD'),
  team('nhl', 'dallas',  'Dallas Stars',           'DAL', '#006847', '#8A8D8F', '#000000'),
  team('nhl', 'detroit', 'Detroit Red Wings',      'DET', '#CE1126', '#FFFFFF'),
  team('nhl', 'edmonton','Edmonton Oilers',        'EDM', '#041E42', '#FF4C00'),
  team('nhl', 'florida', 'Florida Panthers',       'FLA', '#041E42', '#C8102E', '#B9975B'),
  team('nhl', 'losangeles','Los Angeles Kings',    'LAK', '#111111', '#A2AAAD'),
  team('nhl', 'minnesota','Minnesota Wild',        'MIN', '#154734', '#A6192E', '#EAAA00'),
  team('nhl', 'montreal','Montreal Canadiens',     'MTL', '#AF1E2D', '#192168'),
  team('nhl', 'nashville','Nashville Predators',   'NSH', '#FFB81C', '#041E42'),
  team('nhl', 'newjersey','New Jersey Devils',     'NJD', '#CE1126', '#000000'),
  team('nhl', 'islanders','New York Islanders',    'NYI', '#00539B', '#F47D30'),
  team('nhl', 'rangers', 'New York Rangers',       'NYR', '#0038A8', '#CE1126'),
  team('nhl', 'ottawa',  'Ottawa Senators',        'OTT', '#C8102E', '#000000', '#C69214'),
  team('nhl', 'philadelphia','Philadelphia Flyers','PHI', '#F74902', '#000000'),
  team('nhl', 'pittsburgh','Pittsburgh Penguins',  'PIT', '#000000', '#FCB514'),
  team('nhl', 'sanjose', 'San Jose Sharks',        'SJS', '#006D75', '#000000', '#EA7200'),
  team('nhl', 'seattle', 'Seattle Kraken',         'SEA', '#001628', '#99D9D9', '#E9072B'),
  team('nhl', 'stlouis', 'St. Louis Blues',        'STL', '#002F87', '#FCB514'),
  team('nhl', 'tampabay','Tampa Bay Lightning',    'TBL', '#002868', '#FFFFFF'),
  team('nhl', 'toronto', 'Toronto Maple Leafs',    'TOR', '#00205B', '#FFFFFF'),
  team('nhl', 'utah',    'Utah Hockey Club',       'UTA', '#71AFE5', '#000000'),
  team('nhl', 'vancouver','Vancouver Canucks',     'VAN', '#00205B', '#00843D'),
  team('nhl', 'vegas',   'Vegas Golden Knights',   'VGK', '#333F42', '#B4975A', '#C8102E'),
  team('nhl', 'washington','Washington Capitals',  'WSH', '#C8102E', '#041E42'),
  team('nhl', 'winnipeg','Winnipeg Jets',          'WPG', '#041E42', '#004C97', '#A2AAAD')
].map((t) => ({ ...t, logo: `https://assets.nhle.com/logos/nhl/svg/${t.abbr}_light.svg` }));

const NFL_TEAMS: SportTeam[] = [
  team('nfl', 'ari', 'Arizona Cardinals',  'ARI', '#97233F', '#FFB612', '#000000'),
  team('nfl', 'atl', 'Atlanta Falcons',    'ATL', '#A71930', '#000000', '#A5ACAF'),
  team('nfl', 'bal', 'Baltimore Ravens',   'BAL', '#241773', '#9E7C0C', '#000000'),
  team('nfl', 'buf', 'Buffalo Bills',      'BUF', '#00338D', '#C60C30'),
  team('nfl', 'car', 'Carolina Panthers',  'CAR', '#0085CA', '#101820', '#BFC0BF'),
  team('nfl', 'chi', 'Chicago Bears',      'CHI', '#0B162A', '#C83803'),
  team('nfl', 'cin', 'Cincinnati Bengals', 'CIN', '#FB4F14', '#000000'),
  team('nfl', 'cle', 'Cleveland Browns',   'CLE', '#311D00', '#FF3C00'),
  team('nfl', 'dal', 'Dallas Cowboys',     'DAL', '#003594', '#869397', '#041E42'),
  team('nfl', 'den', 'Denver Broncos',     'DEN', '#FB4F14', '#002244'),
  team('nfl', 'det', 'Detroit Lions',      'DET', '#0076B6', '#B0B7BC', '#000000'),
  team('nfl', 'gb',  'Green Bay Packers',  'GB',  '#203731', '#FFB612'),
  team('nfl', 'hou', 'Houston Texans',     'HOU', '#03202F', '#A71930'),
  team('nfl', 'ind', 'Indianapolis Colts', 'IND', '#002C5F', '#A2AAAD'),
  team('nfl', 'jax', 'Jacksonville Jaguars','JAX','#101820', '#D7A22A', '#9F792C'),
  team('nfl', 'kc',  'Kansas City Chiefs', 'KC',  '#E31837', '#FFB81C'),
  team('nfl', 'lv',  'Las Vegas Raiders',  'LV',  '#000000', '#A5ACAF'),
  team('nfl', 'lac', 'Los Angeles Chargers','LAC','#0080C6', '#FFC20E', '#FFFFFF'),
  team('nfl', 'lar', 'Los Angeles Rams',   'LAR', '#003594', '#FFA300', '#FFFFFF'),
  team('nfl', 'mia', 'Miami Dolphins',     'MIA', '#008E97', '#FC4C02', '#005778'),
  team('nfl', 'min', 'Minnesota Vikings',  'MIN', '#4F2683', '#FFC62F'),
  team('nfl', 'ne',  'New England Patriots','NE', '#002244', '#C60C30', '#B0B7BC'),
  team('nfl', 'no',  'New Orleans Saints', 'NO',  '#D3BC8D', '#101820'),
  team('nfl', 'nyg', 'New York Giants',    'NYG', '#0B2265', '#A71930', '#A5ACAF'),
  team('nfl', 'nyj', 'New York Jets',      'NYJ', '#125740', '#000000'),
  team('nfl', 'phi', 'Philadelphia Eagles','PHI', '#004C54', '#A5ACAF', '#000000'),
  team('nfl', 'pit', 'Pittsburgh Steelers','PIT', '#101820', '#FFB612'),
  team('nfl', 'sf',  'San Francisco 49ers','SF',  '#AA0000', '#B3995D'),
  team('nfl', 'sea', 'Seattle Seahawks',   'SEA', '#002244', '#69BE28', '#A5ACAF'),
  team('nfl', 'tb',  'Tampa Bay Buccaneers','TB', '#D50A0A', '#34302B', '#FF7900'),
  team('nfl', 'ten', 'Tennessee Titans',   'TEN', '#0C2340', '#4B92DB', '#C8102E'),
  team('nfl', 'wsh', 'Washington Commanders','WSH','#5A1414', '#FFB612')
].map((t) => ({ ...t, logo: `https://a.espncdn.com/i/teamlogos/nfl/500/${t.abbr.toLowerCase()}.png` }));

const NBA_TEAMS: SportTeam[] = [
  team('nba', 'atl', 'Atlanta Hawks',       'ATL', '#E03A3E', '#C1D32F', '#000000'),
  team('nba', 'bos', 'Boston Celtics',      'BOS', '#007A33', '#BA9653'),
  team('nba', 'bkn', 'Brooklyn Nets',       'BKN', '#000000', '#FFFFFF'),
  team('nba', 'cha', 'Charlotte Hornets',   'CHA', '#1D1160', '#00788C', '#A1A1A4'),
  team('nba', 'chi', 'Chicago Bulls',       'CHI', '#CE1141', '#000000'),
  team('nba', 'cle', 'Cleveland Cavaliers', 'CLE', '#860038', '#041E42', '#FDBB30'),
  team('nba', 'dal', 'Dallas Mavericks',    'DAL', '#00538C', '#002B5E', '#B8C4CA'),
  team('nba', 'den', 'Denver Nuggets',      'DEN', '#0E2240', '#FEC524', '#8B2131'),
  team('nba', 'det', 'Detroit Pistons',     'DET', '#C8102E', '#1D42BA'),
  team('nba', 'gs',  'Golden State Warriors','GS', '#1D428A', '#FFC72C'),
  team('nba', 'hou', 'Houston Rockets',     'HOU', '#CE1141', '#000000', '#C4CED4'),
  team('nba', 'ind', 'Indiana Pacers',      'IND', '#002D62', '#FDBB30'),
  team('nba', 'lac', 'LA Clippers',         'LAC', '#C8102E', '#1D428A', '#BEC0C2'),
  team('nba', 'lal', 'Los Angeles Lakers',  'LAL', '#552583', '#FDB927'),
  team('nba', 'mem', 'Memphis Grizzlies',   'MEM', '#5D76A9', '#12173F', '#F5B112'),
  team('nba', 'mia', 'Miami Heat',          'MIA', '#98002E', '#F9A01B', '#000000'),
  team('nba', 'mil', 'Milwaukee Bucks',     'MIL', '#00471B', '#EEE1C6'),
  team('nba', 'min', 'Minnesota Timberwolves','MIN','#0C2340', '#236192', '#9EA2A2'),
  team('nba', 'no',  'New Orleans Pelicans','NO',  '#0C2340', '#C8102E', '#85714D'),
  team('nba', 'ny',  'New York Knicks',     'NYK', '#006BB6', '#F58426', '#BEC0C2'),
  team('nba', 'okc', 'Oklahoma City Thunder','OKC','#007AC1', '#EF3B24', '#002D62'),
  team('nba', 'orl', 'Orlando Magic',       'ORL', '#0077C0', '#000000', '#C4CED4'),
  team('nba', 'phi', 'Philadelphia 76ers',  'PHI', '#006BB6', '#ED174C', '#002B5C'),
  team('nba', 'phx', 'Phoenix Suns',        'PHX', '#1D1160', '#E56020', '#000000'),
  team('nba', 'por', 'Portland Trail Blazers','POR','#E03A3E','#000000'),
  team('nba', 'sac', 'Sacramento Kings',    'SAC', '#5A2D81', '#63727A', '#000000'),
  team('nba', 'sa',  'San Antonio Spurs',   'SAS', '#000000', '#C4CED4'),
  team('nba', 'tor', 'Toronto Raptors',     'TOR', '#CE1141', '#000000', '#A1A1A4'),
  team('nba', 'utah','Utah Jazz',           'UTA', '#002B5C', '#00471B', '#F9A01B'),
  team('nba', 'wsh', 'Washington Wizards',  'WAS', '#002B5C', '#E31837')
].map((t) => ({ ...t, logo: `https://a.espncdn.com/i/teamlogos/nba/500/${t.abbr.toLowerCase()}.png` }));

const MLB_TEAMS: SportTeam[] = [
  team('mlb', 'ari', 'Arizona Diamondbacks','ARI', '#A71930', '#E3D4AD', '#000000'),
  team('mlb', 'atl', 'Atlanta Braves',     'ATL', '#CE1141', '#13274F'),
  team('mlb', 'bal', 'Baltimore Orioles',  'BAL', '#DF4601', '#000000'),
  team('mlb', 'bos', 'Boston Red Sox',     'BOS', '#BD3039', '#0C2340'),
  team('mlb', 'chc', 'Chicago Cubs',       'CHC', '#0E3386', '#CC3433'),
  team('mlb', 'cws', 'Chicago White Sox',  'CWS', '#27251F', '#C4CED4'),
  team('mlb', 'cin', 'Cincinnati Reds',    'CIN', '#C6011F', '#000000'),
  team('mlb', 'cle', 'Cleveland Guardians','CLE', '#0F223E', '#E50022'),
  team('mlb', 'col', 'Colorado Rockies',   'COL', '#33006F', '#C4CED4', '#000000'),
  team('mlb', 'det', 'Detroit Tigers',     'DET', '#0C2340', '#FA4616'),
  team('mlb', 'hou', 'Houston Astros',     'HOU', '#002D62', '#EB6E1F'),
  team('mlb', 'kc',  'Kansas City Royals', 'KC',  '#004687', '#BD9B60'),
  team('mlb', 'laa', 'Los Angeles Angels', 'LAA', '#BA0021', '#003263', '#862633'),
  team('mlb', 'lad', 'Los Angeles Dodgers','LAD', '#005A9C', '#A5ACAF'),
  team('mlb', 'mia', 'Miami Marlins',      'MIA', '#00A3E0', '#EF3340', '#000000'),
  team('mlb', 'mil', 'Milwaukee Brewers',  'MIL', '#12284B', '#FFC52F'),
  team('mlb', 'min', 'Minnesota Twins',    'MIN', '#002B5C', '#D31145'),
  team('mlb', 'nym', 'New York Mets',      'NYM', '#002D72', '#FF5910'),
  team('mlb', 'nyy', 'New York Yankees',   'NYY', '#0C2340', '#C4CED3'),
  team('mlb', 'ath', 'Athletics',          'ATH', '#003831', '#EFB21E'),
  team('mlb', 'phi', 'Philadelphia Phillies','PHI','#E81828', '#002D72'),
  team('mlb', 'pit', 'Pittsburgh Pirates', 'PIT', '#27251F', '#FDB827'),
  team('mlb', 'sd',  'San Diego Padres',   'SD',  '#2F241D', '#FFC425'),
  team('mlb', 'sf',  'San Francisco Giants','SF', '#FD5A1E', '#27251F', '#AE8F6F'),
  team('mlb', 'sea', 'Seattle Mariners',   'SEA', '#0C2C56', '#005C5C', '#C4CED4'),
  team('mlb', 'stl', 'St. Louis Cardinals','STL', '#C41E3A', '#0C2340', '#FEDB00'),
  team('mlb', 'tb',  'Tampa Bay Rays',     'TB',  '#092C5C', '#8FBCE6', '#F5D130'),
  team('mlb', 'tex', 'Texas Rangers',      'TEX', '#003278', '#C0111F'),
  team('mlb', 'tor', 'Toronto Blue Jays',  'TOR', '#134A8E', '#1D2D5C', '#E8291C'),
  team('mlb', 'wsh', 'Washington Nationals','WSH','#AB0003', '#14225A')
].map((t) => ({ ...t, logo: `https://a.espncdn.com/i/teamlogos/mlb/500/${t.abbr.toLowerCase()}.png` }));

// F1 constructors. Logos via ESPN (their F1 endpoints use slug abbreviations).
const F1_TEAMS: SportTeam[] = [
  { sport: 'f1', id: 'mercedes',  name: 'Mercedes-AMG Petronas',     abbr: 'MER', primary: '#27F4D2', secondary: '#000000', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes_AMG_Petronas_F1_Logo.svg/512px-Mercedes_AMG_Petronas_F1_Logo.svg.png' },
  { sport: 'f1', id: 'redbull',   name: 'Oracle Red Bull Racing',    abbr: 'RBR', primary: '#3671C6', secondary: '#FF1801', tertiary: '#FFD700', logo: 'https://upload.wikimedia.org/wikipedia/de/thumb/c/c4/Red_Bull_Racing_logo.svg/512px-Red_Bull_Racing_logo.svg.png' },
  { sport: 'f1', id: 'ferrari',   name: 'Scuderia Ferrari',          abbr: 'FER', primary: '#E8002D', secondary: '#FFEB00', tertiary: '#000000', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Scuderia_Ferrari_Logo.svg/512px-Scuderia_Ferrari_Logo.svg.png' },
  { sport: 'f1', id: 'mclaren',   name: 'McLaren F1 Team',           abbr: 'MCL', primary: '#FF8000', secondary: '#47C7FC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/66/McLaren_Racing_logo.svg/512px-McLaren_Racing_logo.svg.png' },
  { sport: 'f1', id: 'astonmartin', name: 'Aston Martin Aramco F1',  abbr: 'AMR', primary: '#229971', secondary: '#FF87BC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Aston_Martin_Aramco_F1_Team_Logo.svg/512px-Aston_Martin_Aramco_F1_Team_Logo.svg.png' },
  { sport: 'f1', id: 'alpine',    name: 'Alpine F1 Team',            abbr: 'ALP', primary: '#0093CC', secondary: '#FF87BC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Alpine_F1_Team_Logo.svg/512px-Alpine_F1_Team_Logo.svg.png' },
  { sport: 'f1', id: 'williams',  name: 'Williams Racing',           abbr: 'WIL', primary: '#64C4FF', secondary: '#000080', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Williams_Racing_2020_logo.svg/512px-Williams_Racing_2020_logo.svg.png' },
  { sport: 'f1', id: 'rb',        name: 'Visa Cash App RB',          abbr: 'VCA', primary: '#6692FF', secondary: '#FFFFFF', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Visa_Cash_App_RB_Logo.svg/512px-Visa_Cash_App_RB_Logo.svg.png' },
  { sport: 'f1', id: 'sauber',    name: 'Stake F1 Team Kick Sauber', abbr: 'KCK', primary: '#52E252', secondary: '#000000', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/Kick_Sauber_F1_Team_logo.svg/512px-Kick_Sauber_F1_Team_logo.svg.png' },
  { sport: 'f1', id: 'haas',      name: 'MoneyGram Haas F1 Team',    abbr: 'HAA', primary: '#B6BABD', secondary: '#E10600', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Logo_Haas_F1.png/512px-Logo_Haas_F1.png' }
];

// NASCAR Cup teams. Logos via Wikipedia where available.
const NASCAR_TEAMS: SportTeam[] = [
  { sport: 'nascar', id: 'hendrick',     name: 'Hendrick Motorsports',         abbr: 'HMS', primary: '#0033A0', secondary: '#C8102E', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/68/Hendrick_Motorsports_logo.svg/512px-Hendrick_Motorsports_logo.svg.png' },
  { sport: 'nascar', id: 'jgr',          name: 'Joe Gibbs Racing',             abbr: 'JGR', primary: '#000000', secondary: '#F58025', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Joe_Gibbs_Racing_logo.svg/512px-Joe_Gibbs_Racing_logo.svg.png' },
  { sport: 'nascar', id: 'penske',       name: 'Team Penske',                  abbr: 'PEN', primary: '#FFD100', secondary: '#000000', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Team_Penske_logo.svg/512px-Team_Penske_logo.svg.png' },
  { sport: 'nascar', id: 'rfk',          name: 'RFK Racing',                   abbr: 'RFK', primary: '#003594', secondary: '#FFFFFF', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/RFK_Racing_logo.svg/512px-RFK_Racing_logo.svg.png' },
  { sport: 'nascar', id: 'sthr',         name: 'Stewart-Haas Racing',          abbr: 'SHR', primary: '#FF671F', secondary: '#000000', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/65/Stewart-Haas_Racing_logo.svg/512px-Stewart-Haas_Racing_logo.svg.png' },
  { sport: 'nascar', id: 'trackhouse',   name: 'Trackhouse Racing',            abbr: 'TRX', primary: '#000000', secondary: '#E51E25', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Trackhouse_Racing_Logo.png/512px-Trackhouse_Racing_Logo.png' },
  { sport: 'nascar', id: 'frontrow',     name: 'Front Row Motorsports',        abbr: 'FRM', primary: '#003DA5', secondary: '#FFFFFF', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Front_Row_Motorsports_Logo.svg/512px-Front_Row_Motorsports_Logo.svg.png' },
  { sport: 'nascar', id: '23xi',         name: '23XI Racing',                  abbr: '23X', primary: '#000000', secondary: '#A6192E', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/23XI_Racing_logo.svg/512px-23XI_Racing_logo.svg.png' },
  { sport: 'nascar', id: 'spire',        name: 'Spire Motorsports',            abbr: 'SPM', primary: '#003594', secondary: '#FFFFFF', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spire_Motorsports_Logo.svg/512px-Spire_Motorsports_Logo.svg.png' },
  { sport: 'nascar', id: 'kaulig',       name: 'Kaulig Racing',                abbr: 'KAU', primary: '#000000', secondary: '#F47B20', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Kaulig_Racing_Logo.png/512px-Kaulig_Racing_Logo.png' },
  { sport: 'nascar', id: 'rcr',          name: 'Richard Childress Racing',     abbr: 'RCR', primary: '#000000', secondary: '#A6192E', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Richard_Childress_Racing_logo.svg/512px-Richard_Childress_Racing_logo.svg.png' },
  { sport: 'nascar', id: 'wood',         name: 'Wood Brothers Racing',         abbr: 'WBR', primary: '#FF0000', secondary: '#FFFFFF', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/45/Wood_Brothers_Racing_logo.svg/512px-Wood_Brothers_Racing_logo.svg.png' },
  { sport: 'nascar', id: 'lkr',          name: 'Legacy Motor Club',            abbr: 'LMC', primary: '#000000', secondary: '#FFFFFF', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Legacy_Motor_Club_logo.svg/512px-Legacy_Motor_Club_logo.svg.png' },
  { sport: 'nascar', id: 'rwr',          name: 'Rick Ware Racing',             abbr: 'RWR', primary: '#000000', secondary: '#FFD700', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Rick_Ware_Racing_logo.svg/512px-Rick_Ware_Racing_logo.svg.png' }
];

const ALL_TEAMS: Record<Sport, SportTeam[]> = {
  nhl: NHL_TEAMS,
  nfl: NFL_TEAMS,
  nba: NBA_TEAMS,
  mlb: MLB_TEAMS,
  f1: F1_TEAMS,
  nascar: NASCAR_TEAMS
};

const DEFAULT_TEAM_ID: Record<Sport, string> = {
  nhl: 'detroit',
  nfl: 'det',
  nba: 'det',
  mlb: 'det',
  f1: 'redbull',
  nascar: 'hendrick'
};

export function teamsForSport(sport: Sport): SportTeam[] {
  return ALL_TEAMS[sport] ?? [];
}

export function getSportTeam(sport: Sport, id: string): SportTeam {
  const list = teamsForSport(sport);
  return list.find((t) => t.id === id) ?? list.find((t) => t.id === DEFAULT_TEAM_ID[sport])!;
}

export const SPORT_LABEL: Record<Sport, string> = {
  nhl: 'NHL', nfl: 'NFL', nba: 'NBA', mlb: 'MLB', f1: 'F1', nascar: 'NASCAR'
};

export const SPORTS_LIST: Sport[] = ['nhl', 'nfl', 'nba', 'mlb', 'f1', 'nascar'];

/* ---------- backgrounds ---------- */

/** Build a procedural sport "field" SVG, then layer the team logo on top. */
export function sportsBackground(team: SportTeam): string {
  const enc = (s: string) => encodeURIComponent(s);
  const svg = renderField(team);
  const field = `url("data:image/svg+xml;utf8,${enc(svg)}")`;
  const logo = team.logo ? `url("${team.logo}")` : '';
  if (logo) {
    return `${logo} center / 35% no-repeat, ${field} center / cover no-repeat, ${team.primary}`;
  }
  return `${field} center / cover no-repeat, ${team.primary}`;
}

function renderField(team: SportTeam): string {
  const goal = team.primary;
  const line = team.secondary;
  const accent = team.tertiary ?? team.secondary;
  switch (team.sport) {
    case 'nhl':
      return rink(goal, line, accent);
    case 'nfl':
      return gridiron(goal, line, accent);
    case 'nba':
      return court(goal, line, accent);
    case 'mlb':
      return diamond(goal, line, accent);
    case 'f1':
    case 'nascar':
      return racetrack(goal, line, accent);
    default:
      return rink(goal, line, accent);
  }
}

function vignette(goal: string, ice: string) {
  return `<defs><radialGradient id='vig' cx='50%' cy='50%' r='65%'>
    <stop offset='0%' stop-color='${ice}' stop-opacity='1'/>
    <stop offset='100%' stop-color='${goal}' stop-opacity='0.85'/>
  </radialGradient></defs><rect width='2560' height='720' fill='url(#vig)'/>`;
}

function rink(goal: string, line: string, accent: string): string {
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 720' preserveAspectRatio='xMidYMid slice'>
    ${vignette(goal, '#f0f6ff')}
    <rect x='1270' y='0' width='20' height='720' fill='${goal}' opacity='0.35'/>
    <rect x='720' y='0' width='14' height='720' fill='${line}' opacity='0.35'/>
    <rect x='1826' y='0' width='14' height='720' fill='${line}' opacity='0.35'/>
    <circle cx='1280' cy='360' r='130' fill='none' stroke='${goal}' stroke-width='4' opacity='0.45'/>
    <circle cx='1280' cy='360' r='14' fill='${goal}' opacity='0.5'/>
    <circle cx='420' cy='220' r='90' fill='none' stroke='${accent}' stroke-width='3' opacity='0.35'/>
    <circle cx='420' cy='500' r='90' fill='none' stroke='${accent}' stroke-width='3' opacity='0.35'/>
    <circle cx='2140' cy='220' r='90' fill='none' stroke='${accent}' stroke-width='3' opacity='0.35'/>
    <circle cx='2140' cy='500' r='90' fill='none' stroke='${accent}' stroke-width='3' opacity='0.35'/>
  </svg>`;
}

function gridiron(goal: string, line: string, _accent: string): string {
  // Yard lines every 200 px-ish, hash marks, end zones tinted in team primary
  const yardLines = Array.from({ length: 11 }).map((_, i) => {
    const x = 320 + i * 200;
    return `<line x1='${x}' y1='40' x2='${x}' y2='680' stroke='${line}' stroke-width='2' opacity='0.45'/>`;
  }).join('');
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 720' preserveAspectRatio='xMidYMid slice'>
    <rect width='2560' height='720' fill='#1a3a1a'/>
    <rect x='0' y='40' width='320' height='640' fill='${goal}' opacity='0.7'/>
    <rect x='2240' y='40' width='320' height='640' fill='${goal}' opacity='0.7'/>
    <rect x='320' y='40' width='1920' height='640' fill='#214c21'/>
    ${yardLines}
    <line x1='1280' y1='40' x2='1280' y2='680' stroke='${line}' stroke-width='4' opacity='0.6'/>
  </svg>`;
}

function court(goal: string, line: string, _accent: string): string {
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 720' preserveAspectRatio='xMidYMid slice'>
    ${vignette(goal, '#c89863')}
    <rect x='40' y='40' width='2480' height='640' fill='none' stroke='${line}' stroke-width='4' opacity='0.5'/>
    <line x1='1280' y1='40' x2='1280' y2='680' stroke='${line}' stroke-width='4' opacity='0.5'/>
    <circle cx='1280' cy='360' r='120' fill='none' stroke='${line}' stroke-width='4' opacity='0.55'/>
    <circle cx='1280' cy='360' r='30' fill='none' stroke='${line}' stroke-width='3' opacity='0.5'/>
    <path d='M 40 100 A 460 460 0 0 1 40 620' fill='none' stroke='${line}' stroke-width='4' opacity='0.45'/>
    <path d='M 2520 100 A 460 460 0 0 0 2520 620' fill='none' stroke='${line}' stroke-width='4' opacity='0.45'/>
  </svg>`;
}

function diamond(goal: string, line: string, accent: string): string {
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 720' preserveAspectRatio='xMidYMid slice'>
    ${vignette(goal, '#5a8b3a')}
    <path d='M 1280 720 L 700 360 L 1280 0 L 1860 360 Z' fill='${accent}' opacity='0.3'/>
    <path d='M 1280 540 L 1080 360 L 1280 180 L 1480 360 Z' fill='${line}' opacity='0.5' stroke='${line}' stroke-width='3'/>
    <circle cx='1280' cy='360' r='30' fill='${goal}' opacity='0.6'/>
    <circle cx='1080' cy='360' r='14' fill='#fff' opacity='0.7'/>
    <circle cx='1280' cy='180' r='14' fill='#fff' opacity='0.7'/>
    <circle cx='1480' cy='360' r='14' fill='#fff' opacity='0.7'/>
    <circle cx='1280' cy='540' r='14' fill='#fff' opacity='0.7'/>
  </svg>`;
}

function racetrack(goal: string, line: string, _accent: string): string {
  // Stylized oval/track with start-finish line and checker-flag chevrons
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 720' preserveAspectRatio='xMidYMid slice'>
    ${vignette(goal, '#0a0a0a')}
    <ellipse cx='1280' cy='360' rx='1100' ry='280' fill='none' stroke='${line}' stroke-width='40' opacity='0.55'/>
    <ellipse cx='1280' cy='360' rx='1100' ry='280' fill='none' stroke='${goal}' stroke-width='6' opacity='0.7' stroke-dasharray='30 30'/>
    <rect x='1270' y='60' width='20' height='80' fill='${line}' opacity='0.7'/>
    <g fill='${line}' opacity='0.5'>
      <rect x='1230' y='80' width='20' height='20'/>
      <rect x='1270' y='100' width='20' height='20'/>
      <rect x='1310' y='80' width='20' height='20'/>
    </g>
  </svg>`;
}

function team(sport: Sport, id: string, name: string, abbr: string, primary: string, secondary: string, tertiary?: string): SportTeam {
  return { sport, id, name, abbr, primary, secondary, tertiary, logo: '' };
}
