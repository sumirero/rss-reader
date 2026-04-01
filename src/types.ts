export type Category = 'tech' | 'finance' | 'news' | 'default';

export interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  content?: string;
}

export interface Feed {
  id: string;
  url: string;
  name: string;
  category: Category;
  items: FeedItem[];
  lastFetched?: number;
}