// Stocks ticker — scrolling marquee in a single-row widget.
const TICKER_ITEMS = [
  { sym: 'AAPL', px: '187.42', pct: '+1.20%', dir: 'up' },
  { sym: 'TSLA', px: '241.05', pct: '−2.35%', dir: 'dn' },
  { sym: 'NVDA', px: '912.31', pct: '+1.56%', dir: 'up' },
  { sym: 'MSFT', px: '411.84', pct: '+0.42%', dir: 'up' },
  { sym: 'GOOG', px: '173.50', pct: '−0.81%', dir: 'dn' },
  { sym: 'AMZN', px: '198.12', pct: '+0.97%', dir: 'up' },
  { sym: 'CRSR', px: '8.42',   pct: '+3.18%', dir: 'up' },
  { sym: 'BTC',  px: '67,212', pct: '+0.21%', dir: 'up' },
];

const StocksTickerWidget = ({ editing, onRemove }) => (
  <Widget title="Markets" editing={editing} hasConfig={false} onRemove={onRemove}>
    <div className="ticker-frame" style={{ border: 'none', height: '100%' }}>
      <div className="ticker-inner">
        {[0,1].map((dup) => TICKER_ITEMS.map((it, i) => (
          <React.Fragment key={`${dup}-${i}`}>
            <span className="ticker-item">
              <span className="ticker-pill">{it.sym}</span>
              <span>{it.px}</span>
              <span className={`ticker-${it.dir}`}>{it.pct}</span>
            </span>
            <span className="ticker-sep">·</span>
          </React.Fragment>
        )))}
      </div>
    </div>
  </Widget>
);

window.StocksTickerWidget = StocksTickerWidget;
