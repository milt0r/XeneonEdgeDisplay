import React, { useEffect, useState } from 'react';
import type { WidgetPlugin, WidgetComponentProps } from '@shared/widget-plugin';

interface Story {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  descendants?: number;
  time: number;
}

interface Config {
  feed: 'topstories' | 'beststories' | 'newstories';
  limit: number;
}

const DEFAULTS: Config = { feed: 'topstories', limit: 30 };

async function fetchStories(feed: string, limit: number): Promise<Story[]> {
  const ids: number[] = await (await fetch(`https://hacker-news.firebaseio.com/v0/${feed}.json`)).json();
  const subset = ids.slice(0, limit);
  const stories = await Promise.all(
    subset.map((id) => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json()))
  );
  return stories.filter(Boolean) as Story[];
}

function timeAgo(ts: number): string {
  const s = Math.max(0, Date.now() / 1000 - ts);
  if (s < 60) return `${Math.round(s)}s`;
  if (s < 3600) return `${Math.round(s / 60)}m`;
  if (s < 86400) return `${Math.round(s / 3600)}h`;
  return `${Math.round(s / 86400)}d`;
}

const HackerNews: React.FC<WidgetComponentProps<Config>> = ({ config, updateConfig, configOpen }) => {
  const cfg = { ...DEFAULTS, ...(config as Partial<Config>) };
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      setLoading(true);
      try {
        const s = await fetchStories(cfg.feed, cfg.limit);
        if (!cancelled) setStories(s);
      } catch {}
      if (!cancelled) setLoading(false);
    };
    refresh();
    const id = setInterval(refresh, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, [cfg.feed, cfg.limit]);

  const open = (s: Story) => {
    const url = s.url ?? `https://news.ycombinator.com/item?id=${s.id}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="col fill" style={{ gap: 6, minHeight: 0 }}>
      {configOpen && (
        <div className="widget-config no-drag">
          <label className="cfg-toggle">
            Feed
            <select value={cfg.feed} onChange={(e) => updateConfig({ feed: e.target.value as any })}>
              <option value="topstories">Top</option>
              <option value="beststories">Best</option>
              <option value="newstories">New</option>
            </select>
          </label>
          <label className="cfg-toggle">
            Count
            <input type="number" min={5} max={100}
              value={cfg.limit}
              onChange={(e) => updateConfig({ limit: Math.max(5, Math.min(100, Number(e.target.value) || 30)) })}
              style={{ width: 60 }}
            />
          </label>
        </div>
      )}
      <div className="news-list no-drag">
        {loading && stories.length === 0 && <div className="muted mono">Loading…</div>}
        {stories.map((s, i) => (
          <button key={s.id} className="news-item" onClick={() => open(s)}>
            <span className="news-rank mono">{String(i + 1).padStart(2, '0')}</span>
            <div className="news-text">
              <div className="news-title">{s.title}</div>
              <div className="news-meta mono">
                ▲ {s.score} · 💬 {s.descendants ?? 0} · {timeAgo(s.time)} · {s.by}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const HackerNewsWidget: WidgetPlugin<Config> = {
  id: 'hackernews',
  title: 'Hacker News',
  description: 'Top stories from news.ycombinator.com',
  category: 'info',
  defaultSize: { w: 4, h: 2 },
  themeable: true,
  defaultConfig: DEFAULTS,
  component: HackerNews
};
