// Sports — mock live + post-game cards.
const GAMES = [
  {
    id: '1', league: 'NHL', status: 'live', period: '2ND · 14:22',
    venue: 'Little Caesars Arena',
    away: { abbr: 'BUF', name: 'Sabres',    record: '29-25-8', score: 1, color: '#002654' },
    home: { abbr: 'DET', name: 'Red Wings', record: '34-22-6', score: 3, color: '#ce1126', winner: true }
  },
  {
    id: '2', league: 'NBA', status: 'live', period: '4Q · 4:18',
    venue: 'Little Caesars Arena',
    away: { abbr: 'CLE', name: 'Cavaliers', record: '48-22', score: 102, color: '#860038' },
    home: { abbr: 'DET', name: 'Pistons',   record: '33-37', score: 98,  color: '#1d428a' }
  },
  {
    id: '3', league: 'MLB', status: 'post', period: 'F',
    venue: 'Comerica Park',
    away: { abbr: 'CWS', name: 'White Sox', record: '20-50', score: 1, color: '#27251f' },
    home: { abbr: 'DET', name: 'Tigers',    record: '42-28', score: 7, color: '#0c2c56', winner: true }
  },
  {
    id: '4', league: 'NFL', status: 'pre', period: 'SUN · 1:00 PM',
    venue: 'Ford Field',
    away: { abbr: 'GB',  name: 'Packers', record: '11-3', score: 0, color: '#203731' },
    home: { abbr: 'DET', name: 'Lions',   record: '13-1', score: 0, color: '#0076b6' }
  }
];

const SportsWidget = ({ editing, onRemove }) => (
  <Widget title="Sports" editing={editing} hasConfig={true} onRemove={onRemove}>
    <div className="sports-list">
      {GAMES.map((g) => {
        const aWin = g.away.winner, hWin = g.home.winner;
        return (
          <div key={g.id} className={`sports-card ${g.status === 'live' ? 'live' : ''}`}>
            <div className="sports-head">
              <span><span className="lg">{g.league}</span></span>
              {g.status === 'live'
                ? <span className="live-tag"><span className="live-dot"></span>LIVE · {g.period}</span>
                : <span>{g.period}</span>}
            </div>
            {[g.away, g.home].map((s, i) => {
              const winner = s.winner;
              const loser = (g.status === 'post' && !winner);
              return (
                <div key={i} className={`sports-row ${winner ? 'winner' : ''} ${loser ? 'loser' : ''}`}>
                  <span className="sports-logo" style={{ background: s.color }}>{s.abbr}</span>
                  <div>
                    <div className="sports-team-name">{s.name}</div>
                    <div className="sports-record">{s.record}</div>
                  </div>
                  <span className="sports-score">{s.score}</span>
                </div>
              );
            })}
            <div className="sports-meta">{g.venue}</div>
          </div>
        );
      })}
    </div>
  </Widget>
);

window.SportsWidget = SportsWidget;
