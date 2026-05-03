export interface StockQuote {
  symbol: string;
  shortName: string;
  currency: string;
  price: number;
  previousClose: number;
  change: number;
  changePct: number;
  marketState: string;
  exchange: string;
  updatedAt: number;
}

export interface StockHeadline {
  title: string;
  link: string;
  publishedAt: number;
  symbol: string;
}
