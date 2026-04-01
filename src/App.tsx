import { useState, useEffect } from 'react';
import type { Feed, FeedItem, Category } from './types';
import { fetchFeed, categorizeFeed } from './rssService';

const DEFAULT_FEEDS = [
  { url: 'https://techcrunch.com/feed/', name: 'TechCrunch', category: 'tech' as Category },
  { url: 'https://www.reddit.com/r/technology/.rss', name: 'Reddit Tech', category: 'tech' as Category },
  { url: 'https://feeds.bloomberg.com/markets/news.rss', name: 'Bloomberg', category: 'finance' as Category },
];

const CATEGORY_COLORS: Record<Category, string> = {
  tech: '#4FC3F7',
  finance: '#FFD54F',
  news: '#81C784',
  default: '#90A4AE',
};

function truncateSummary(text: string, maxLength: number = 200): string {
  const stripped = text.replace(/<[^>]*>/g, '').trim();
  if (stripped.length <= maxLength) return stripped;
  return stripped.slice(0, maxLength).trim() + '...';
}

function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

interface DisplayItem extends FeedItem {
  feedId: string;
  feedName: string;
  category: Category;
}

function App() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [selectedItem, setSelectedItem] = useState<DisplayItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedName, setNewFeedName] = useState('');
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeeds = async () => {
      const loaded: Feed[] = [];
      for (const defaultFeed of DEFAULT_FEEDS) {
        const items = await fetchFeed(defaultFeed.url);
        loaded.push({
          id: crypto.randomUUID(),
          url: defaultFeed.url,
          name: defaultFeed.name,
          category: categorizeFeed(defaultFeed.url, defaultFeed.name),
          items,
          lastFetched: Date.now(),
        });
      }
      setFeeds(loaded);
      setLoading(false);
    };
    loadFeeds();
  }, []);

  const handleAddFeed = async () => {
    if (!newFeedUrl.trim()) return;
    const items = await fetchFeed(newFeedUrl);
    const category = categorizeFeed(newFeedUrl, newFeedName);
    setFeeds([
      ...feeds,
      {
        id: crypto.randomUUID(),
        url: newFeedUrl,
        name: newFeedName || newFeedUrl,
        category,
        items,
        lastFetched: Date.now(),
      },
    ]);
    setNewFeedUrl('');
    setNewFeedName('');
    setShowAddModal(false);
  };

  const todayItems: DisplayItem[] = feeds.flatMap((feed) =>
    feed.items.filter((item) => isToday(item.pubDate)).map((item) => ({ ...item, feedId: feed.id, feedName: feed.name, category: feed.category }))
  );

  const getDisplayItems = (): DisplayItem[] => {
    if (selectedFeedId) {
      const feed = feeds.find((f) => f.id === selectedFeedId);
      return feed ? feed.items.map((item) => ({ ...item, feedId: feed.id, feedName: feed.name, category: feed.category })) : [];
    }
    if (todayItems.length > 0) {
      return todayItems;
    }
    return feeds.flatMap((feed) => feed.items.map((item) => ({ ...item, feedId: feed.id, feedName: feed.name, category: feed.category })));
  };

  const displayItems = getDisplayItems();

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <aside className="w-64 bg-white shadow-lg p-4 flex flex-col">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">RSS Reader</h1>
        <button
          onClick={() => setSelectedFeedId(null)}
          className={`p-3 rounded-lg text-left mb-2 ${!selectedFeedId ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
        >
          All Feeds
          <span className="float-right bg-gray-200 px-2 py-0.5 rounded-full text-sm">
            {feeds.reduce((acc, f) => acc + f.items.length, 0)}
          </span>
        </button>
        <div className="flex-1 overflow-auto">
          <h2 className="text-sm font-medium text-gray-500 mb-3 mt-4">Feeds</h2>
          {feeds.map((feed) => (
            <button
              key={feed.id}
              onClick={() => setSelectedFeedId(feed.id)}
              className={`w-full p-3 rounded-lg text-left mb-2 flex items-center ${
                selectedFeedId === feed.id ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: CATEGORY_COLORS[feed.category] }}
              />
              <span className="truncate flex-1">{feed.name}</span>
              <span className="text-gray-400 text-sm">{feed.items.length}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">Today's count</p>
          <p className="text-2xl font-bold text-gray-800">{todayItems.length}</p>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {selectedFeedId
            ? feeds.find((f) => f.id === selectedFeedId)?.name || 'Feed'
            : todayItems.length > 0
            ? `Today's Updates (${todayItems.length})`
            : 'All Articles'}
        </h2>
        
        {loading ? (
          <p className="text-gray-500">Loading feeds...</p>
        ) : (
          <div className="grid gap-4">
            {displayItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: CATEGORY_COLORS[item.category as Category] }}
                />
                <div className="p-4 pl-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: CATEGORY_COLORS[item.category as Category] }}
                    >
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">{item.feedName}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{truncateSummary(item.description, 200)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[selectedItem.category as Category] }}
                >
                  {selectedItem.category}
                </span>
                <span className="text-sm text-gray-500">{selectedItem.feedName}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedItem.title}</h2>
              <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                {selectedItem.description || 'No description available.'}
              </p>
              <div className="flex gap-3">
                {selectedItem.link && (
                  <a
                    href={selectedItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Read Full Article
                  </a>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>Add Feed</span>
        </button>
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Feed</h3>
            <input
              type="url"
              placeholder="Feed URL (e.g., https://example.com/rss)"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Feed Name (optional)"
              value={newFeedName}
              onChange={(e) => setNewFeedName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddFeed}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Feed
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;