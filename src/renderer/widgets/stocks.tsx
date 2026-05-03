import React, { useEffect, useRef, useState } from 'react';
import type { WidgetPlugin, WidgetComponentProps } from '@shared/widget-plugin';
import type { StockHeadline, StockQuote } from '@shared/stocks';

interface Config {
  symbols: string[];
  showNews: boolean;
  newsSpeed: number; // px per second
  refreshSec: number;
}

const DEFAULTS: Config = {
  symbols: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', '^GSPC'],
  showNews: true,
  newsSpeed: 60,
  refreshSec: 60
};

function fmtPrice(n: number, currency: string): string {
  try {
    return new Intl.NumberFormat([], { style: 'currency', currency, maximumFractionDigits: n < 10 ? 4 : 2 }).format(n);
  } catch {
    return n.toFixed(2);
  }
}

function fmtChange(n: number, currency: string): string {
  const sign = n >= 0 ? '+' : '';
  try {
    return sign + new Intl.NumberFormat([], { style: 'currency', currency, signDisplay: 'never', maximumFractionDigits: 2 }).format(Math.abs(n));
  } catch {
    return sign + n.toFixed(2);
  }
}

function timeAgo(ts: number): string {
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 60) return `${Math.round(s)}s`;
  if (s < 3600) return `${Math.round(s / 60)}m`;
  if (s < 86400) return `${Math.round(s / 3600)}h`;
  return `${Math.round(s / 86400)}d`;
}

function StockCard({ q }: { q: StockQuote }) {
  const up = q.change >= 0;
  return (
    <div className={`stock-card ${up ? 'up' : 'down'}`}>
      <div className="stock-symbol">{q.symbol}</div>
      <div className="stock-price">{fmtPrice(q.price, q.currency)}</div>
      <div className="stock-change">
        <span>{fmtChange(q.change, q.currency)}</span>
        <span className="stock-pct">{up ? '▲' : '▼'} {Math.abs(q.changePct).toFixed(2)}%</span>
      </div>
    </div>
  );
}

const SymbolEditor: React.FC<{ symbols: string[]; onChange: (next: string[]) => void }> = ({ symbols, onChange }) => {
  const [input, setInput] = useState('');
  const add = () => {
    const s = input.trim().toUpperCase();
    if (!s || symbols.includes(s)) { setInput(''); return; }
    onChange([...symbols, s]);
    setInput('');
  };
  return (
    <div className="symbol-editor">
      <div className="symbol-chips">
        {symbols.map((s) => (
          <span key={s} className="symbol-chip">
            {s}
            <button onClick={() => onChange(symbols.filter((x) => x !== s))} aria-label={`Remove ${s}`}>✕</button>
          </span>
        ))}
      </div>
      <div className="symbol-input-row">
        <input
          className="ha-search"
          style={{ minHeight: 36, fontSize: 13, padding: '6px 10px' }}
          placeholder="Add symbol (e.g. AAPL, ^GSPC, BTC-USD)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
        />
        <button className="btn" onClick={add}>+ ADD</button>
      </div>
    </div>
  );
};

const Stocks: React.FC<WidgetComponentProps<Config>> = ({ config, updateConfig, configOpen }) => {
  const cfg = { ...DEFAULTS, ...(config as Partial<Config>) };
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [news, setNews] = useState<StockHeadline[]>([]);
  const [loading, setLoading] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  const refreshQuotes = async () => {
    if (cfg.symbols.length === 0) { setQuotes([]); return; }
    setLoading(true);
    const q = await window.api.stocks.quotes(cfg.symbols);
    // preserve user order
    const order = new Map(cfg.symbols.map((s, i) => [s.toUpperCase(), i]));
    q.sort((a, b) => (order.get(a.symbol) ?? 99) - (order.get(b.symbol) ?? 99));
    setQuotes(q);
    setLoading(false);
  };

  const refreshNews = async () => {
    if (cfg.symbols.length === 0) { setNews([]); return; }
    const n = await window.api.stocks.news(cfg.symbols);
    setNews(n);
  };

  useEffect(() => {
    refreshQuotes();
    refreshNews();
    const q = setInterval(refreshQuotes, Math.max(15, cfg.refreshSec) * 1000);
    const n = setInterval(refreshNews, 5 * 60 * 1000);
    return () => { clearInterval(q); clearInterval(n); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.symbols.join(','), cfg.refreshSec]);

  // Compute marquee duration from content width / speed
  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;
    const inner = el.querySelector<HTMLDivElement>('.ticker-inner');
    if (!inner) return;
    const width = inner.scrollWidth / 2; // we duplicate content to loop
    const dur = Math.max(20, width / Math.max(10, cfg.newsSpeed));
    inner.style.animationDuration = `${dur}s`;
  }, [news, cfg.newsSpeed]);

  return (
    <div className="stocks-widget">
      {configOpen && (
        <div className="widget-config no-drag">
          <SymbolEditor
            symbols={cfg.symbols}
            onChange={(next) => updateConfig({ symbols: next })}
          />
          <div className="cfg-grid" style={{ marginTop: 8 }}>
            <label className="cfg-toggle">
              <input
                type="checkbox"
                checked={cfg.showNews}
                onChange={(e) => updateConfig({ showNews: e.target.checked })}
              /> News ticker
            </label>
            <label className="cfg-toggle">
              Speed
              <input
                type="range"
                min={20} max={200} step={10}
                value={cfg.newsSpeed}
                onChange={(e) => updateConfig({ newsSpeed: Number(e.target.value) })}
                style={{ flex: 1 }}
              />
              <span className="mono" style={{ fontSize: 11 }}>{cfg.newsSpeed}px/s</span>
            </label>
            <label className="cfg-toggle">
              Refresh
              <input
                type="number"
                min={15} max={600}
                value={cfg.refreshSec}
                onChange={(e) => updateConfig({ refreshSec: Number(e.target.value) || 60 })}
                style={{ width: 70 }}
              />
              <span className="mono" style={{ fontSize: 11 }}>sec</span>
            </label>
          </div>
        </div>
      )}

      <div className="stocks-grid no-drag">
        {quotes.length === 0 && !loading && (
          <div className="muted mono" style={{ padding: 12 }}>
            {cfg.symbols.length === 0 ? 'Add symbols in EDIT mode.' : 'No data. Symbols may be invalid.'}
          </div>
        )}
        {quotes.map((q) => <StockCard key={q.symbol} q={q} />)}
      </div>

      {cfg.showNews && news.length > 0 && (
        <div className="stocks-ticker no-drag" ref={tickerRef}>
          <div className="ticker-inner">
            {[...news, ...news].map((h, i) => (
              <span key={`${h.link}-${i}`} className="ticker-item">
                <span className="ticker-symbol">{h.symbol}</span>
                <span className="ticker-title">{h.title}</span>
                <span className="ticker-time mono">{timeAgo(h.publishedAt)}</span>
                <span className="ticker-sep">·</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const StocksWidget: WidgetPlugin<Config> = {
  id: 'stocks',
  title: 'Stocks',
  description: 'Live quotes with green/red change and a TV-style scrolling news ticker',
  category: 'info',
  defaultSize: { w: 6, h: 2 },
  themeable: true,
  defaultConfig: DEFAULTS,
  component: Stocks
};
