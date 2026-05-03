import type { StockHeadline, StockQuote } from '../../shared/stocks';

const QUOTE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const NEWS_URL = 'https://feeds.finance.yahoo.com/rss/2.0/headline';
const UA = 'Mozilla/5.0 (XeneonEdge)';

export class StocksProvider {
  private quoteCache = new Map<string, { snap: StockQuote; ts: number }>();
  private newsCache = new Map<string, { items: StockHeadline[]; ts: number }>();

  async quotes(symbols: string[]): Promise<StockQuote[]> {
    const now = Date.now();
    const results: StockQuote[] = [];
    for (const raw of symbols) {
      const sym = raw.trim().toUpperCase();
      if (!sym) continue;
      const cached = this.quoteCache.get(sym);
      if (cached && now - cached.ts < 30_000) {
        results.push(cached.snap);
        continue;
      }
      try {
        const res = await fetch(`${QUOTE_URL}${encodeURIComponent(sym)}?interval=1d&range=2d`, {
          headers: { 'User-Agent': UA, Accept: 'application/json' },
          signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) {
          if (cached) results.push(cached.snap);
          continue;
        }
        const data: any = await res.json();
        const meta = data?.chart?.result?.[0]?.meta;
        if (!meta) {
          if (cached) results.push(cached.snap);
          continue;
        }
        const price = Number(meta.regularMarketPrice ?? 0);
        const prev = Number(meta.chartPreviousClose ?? meta.previousClose ?? price);
        const change = price - prev;
        const changePct = prev !== 0 ? (change / prev) * 100 : 0;
        const snap: StockQuote = {
          symbol: meta.symbol ?? sym,
          shortName: meta.symbol ?? sym, // chart API doesn't include long name
          currency: meta.currency ?? 'USD',
          price,
          previousClose: prev,
          change,
          changePct,
          marketState: meta.marketState ?? '',
          exchange: meta.exchangeName ?? meta.fullExchangeName ?? '',
          updatedAt: now
        };
        this.quoteCache.set(sym, { snap, ts: now });
        results.push(snap);
      } catch {
        if (cached) results.push(cached.snap);
      }
    }
    return results;
  }

  async news(symbols: string[]): Promise<StockHeadline[]> {
    const now = Date.now();
    const out: StockHeadline[] = [];
    for (const raw of symbols) {
      const sym = raw.trim().toUpperCase();
      if (!sym) continue;
      const cached = this.newsCache.get(sym);
      if (cached && now - cached.ts < 5 * 60_000) {
        out.push(...cached.items);
        continue;
      }
      try {
        const url = `${NEWS_URL}?s=${encodeURIComponent(sym)}&region=US&lang=en-US`;
        const res = await fetch(url, {
          headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, text/xml' },
          signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) {
          if (cached) out.push(...cached.items);
          continue;
        }
        const text = await res.text();
        const items = parseRss(text, sym);
        this.newsCache.set(sym, { items, ts: now });
        out.push(...items);
      } catch {
        if (cached) out.push(...cached.items);
      }
    }
    // Newest first, dedupe by link
    const seen = new Set<string>();
    return out
      .filter((h) => (seen.has(h.link) ? false : (seen.add(h.link), true)))
      .sort((a, b) => b.publishedAt - a.publishedAt)
      .slice(0, 60);
  }
}

function parseRss(xml: string, symbol: string): StockHeadline[] {
  const items: StockHeadline[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRe.exec(xml))) {
    const block = match[1];
    const title = decode(extract(block, 'title'));
    const link = extract(block, 'link');
    const pubDate = extract(block, 'pubDate');
    const ts = pubDate ? Date.parse(pubDate) : Date.now();
    if (title && link) items.push({ title, link, publishedAt: Number.isFinite(ts) ? ts : Date.now(), symbol });
  }
  return items;
}

function extract(block: string, tag: string): string {
  const re = new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`);
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}
