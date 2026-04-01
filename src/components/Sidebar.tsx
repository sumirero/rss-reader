import type { Feed, Article } from '../types';

interface SidebarProps {
  feeds: Feed[];
  articles: Article[];
}

export function Sidebar({ feeds, articles }: SidebarProps) {
  const today = new Date().toDateString();
  const todayCount = articles.filter(a => {
    if (!a.pubDate) return false;
    return new Date(a.pubDate).toDateString() === today;
  }).length;

  return (
    <div className="w-64 bg-white border-l border-gray-100 h-full overflow-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-bold text-sm" style={{ color: '#1A1A1A' }}>Feeds</h2>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {feeds.map(feed => {
            const count = articles.filter(a => a.feedId === feed.id).length;
            return (
              <div key={feed.id} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: feed.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>
                    {feed.title}
                  </div>
                  <div className="text-xs" style={{ color: '#888' }}>
                    {count} articles
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="text-xs uppercase tracking-wide mb-2" style={{ color: '#888' }}>
          Today's Reading
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>{todayCount}</span>
          <span className="text-sm" style={{ color: '#888' }}>articles</span>
        </div>
      </div>
    </div>
  );
}
