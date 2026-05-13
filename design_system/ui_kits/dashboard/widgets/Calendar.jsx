// Calendar — agenda list with a "next up" hero row.
const AGENDA = [
  { time: 'TODAY · 13:30',          summary: 'Stand-up — Edge firmware sync' },
  { time: 'TODAY · 15:00',          summary: 'Customer demo · Building 2' },
  { time: 'TODAY · 17:30',          summary: 'Drive home' },
  { time: 'TOMORROW · 09:00',       summary: 'Sprint review' },
  { time: 'TOMORROW · 12:00',       summary: 'Lunch with H.' },
  { time: 'SAT · 19:00',            summary: 'Wings · Sabres @ LCA' }
];

const CalendarWidget = ({ editing, onRemove }) => (
  <Widget title="Calendar" editing={editing} hasConfig={false} onRemove={onRemove}>
    <div className="cal-stack">
      <div className="cal-next">
        <div className="cal-next-time">NEXT UP · 13:30 (in 24 min)</div>
        <div className="cal-next-title">Stand-up — Edge firmware sync</div>
      </div>
      <div className="cal-list">
        {AGENDA.slice(1).map((e, i) => (
          <div key={i} className="cal-item">
            <div className="cal-time">{e.time}</div>
            <div className="cal-summary">{e.summary}</div>
          </div>
        ))}
      </div>
    </div>
  </Widget>
);

window.CalendarWidget = CalendarWidget;
