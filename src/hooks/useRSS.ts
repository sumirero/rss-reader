import { useState, useEffect } from 'react';
import type { Feed, Article } from '../types';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

const CATEGORY_COLORS: Record<string, string> = {
  tech: '#4FC3F7',
  finance: '#FFD54F',
  news: '#81C784',
  default: '#90A4AE',
};

function detectCategory(url: string, title: string): 'tech' | 'finance' | 'news' | 'default' {
  const text = (url + ' ' + title).toLowerCase();
  if (text.includes('tech') || text.includes('dev') || text.includes('github') || text.includes('hacker')) return 'tech';
  if (text.includes('finance') || text.includes('market') || text.includes('stock') || text.includes('bloomberg')) return 'finance';
  if (text.includes('news') || text.includes('bbc') || text.includes('cnn') || text.includes('reuters')) return 'news';
  return 'default';
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

async function parseRSS(xml: string, feed: Feed): Promise<Article[]> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items = doc.querySelectorAll('item');

  const articles: Article[] = [];
  items.forEach((item) => {
    const title = item.querySelector('title')?.textContent || 'Untitled';
    const link = item.querySelector('link')?.textContent || '';
    const description = item.querySelector('description')?.textContent || item.querySelector('summary')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || item.querySelector('published')?.textContent || '';

    // Strip HTML tags from description
    const tmp = document.createElement('div');
    tmp.innerHTML = description;
    const summary = tmp.textContent || tmp.innerText || '';
    const truncated = summary.length > 200 ? summary.substring(0, 200) + '...' : summary;

    articles.push({
      id: generateId(),
      feedId: feed.id,
      title,
      summary: truncated,
      link,
      pubDate: pubDate ? new Date(pubDate).toLocaleDateString() : '',
      source: feed.title,
      color: feed.color,
    });
  });

  return articles;
}

export function useRSS() {
  const [feeds, setFeeds] = useState<Feed[]>([
    { id: '1', url: 'https://hnrss.org/frontpage', title: 'Hacker News', category: 'tech', color: CATEGORY_COLORS.tech },
    { id: '2', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', title: 'BBC Tech', category: 'tech', color: CATEGORY_COLORS.tech },
    { id: '3', url: 'https://rss.app/feeds/v1.1/tJQfS9X5qGJlI1z5.xml', title: 'TechCrunch', category: 'tech', color: CATEGORY_COLORS.tech },
  ]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async (feed: Feed) => {
    try {
      const response = await fetch(CORS_PROXY + encodeURIComponent(feed.url));
      const xml = await response.text();
      return await parseRSS(xml, feed);
    } catch (err) {
      console.error(`Failed to fetch ${feed.title}:`, err);
      return [];
    }
  };

  const fetchAllFeeds = async () => {
    setLoading(true);
    setError(null);
    try {
      const allArticles: Article[] = [];
      for (const feed of feeds) {
        const articles = await fetchFeed(feed);
        allArticles.push(...articles);
      }
      // Sort by date, newest first
      allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      setArticles(allArticles);
    } catch (err) {
      setError('Failed to fetch feeds');
    } finally {
      setLoading(false);
    }
  };

  const addFeed = async (url: string) => {
    const category = detectCategory(url, '');
    const feed: Feed = {
      id: generateId(),
      url,
      title: url,
      category,
      color: CATEGORY_COLORS[category],
    };
    setFeeds([...feeds, feed]);
    const newArticles = await fetchFeed(feed);
    setArticles(prev => [...newArticles, ...prev].sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    ));
  };

  useEffect(() => {
    fetchAllFeeds();
  }, []);

  return { feeds, articles, loading, error, addFeed, refetch: fetchAllFeeds };
}
