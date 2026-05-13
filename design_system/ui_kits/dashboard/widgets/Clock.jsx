// Clock — big touch-friendly time + date.
const ClockWidget = ({ editing, configOpen, setConfigOpen, onRemove }) => {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <Widget
      title="Clock"
      editing={editing}
      configOpen={configOpen}
      hasConfig={false}
      onRemove={onRemove}
    >
      <div className="clock-stack">
        <div className="clock-time">
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>
        <div className="clock-date">
          {now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>
    </Widget>
  );
};

window.ClockWidget = ClockWidget;
