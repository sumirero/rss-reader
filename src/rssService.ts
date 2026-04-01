import type { FeedItem, Category } from './types';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export function categorizeFeed(url: string, title: string): Category {
  const lower = (url + title).toLowerCase();
  if (lower.includes('tech') || lower.includes('developer') || lower.includes('programming')) {
    return 'tech';
  }
  if (lower.includes('finance') || lower.includes('stock') || lower.includes('market') || lower.includes('crypto')) {
    return 'finance';
  }
  if (lower.includes('news') || lower.includes('bbc') || lower.includes('cnn') || lower.includes('reuters')) {
    return 'news';
  }
  return 'default';
}

function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    tech: '#4FC3F7',
    finance: '#FFD54F',
    news: '#81C784',
    default: '#90A4AE',
  };
  return colors[category];
}

function parseRSS(xml: string): FeedItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items: FeedItem[] = [];
  const entries = doc.querySelectorAll('item, entry');
  
  entries.forEach((entry) => {
    const title = entry.querySelector('title')?.textContent?.trim() || 'Untitled';
    const link = entry.querySelector('link')?.textContent?.trim() || 
                 entry.querySelector('link')?.getAttribute('href') || '';
    const description = entry.querySelector('description')?.textContent?.trim() || 
                      entry.querySelector('summary, content\\:encoded')?.textContent?.trim() || '';
    const pubDate = entry.querySelector('pubDate, published, updated')?.textContent?.trim() || '';
    
    items.push({ title, link, description, pubDate });
  });
  
  return items;
}

export async function fetchFeed(url: string): Promise<FeedItem[]> {
  try {
    const proxyUrl = CORS_PROXY + encodeURIComponent(url);
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Failed to fetch');
    const xml = await response.text();
    return parseRSS(xml);
  } catch (error) {
    console.error('Error fetching feed:', error);
    return [];
  }
}

export function getCategoryColorCode(category: Category): string {
  return getCategoryColor(category);
}