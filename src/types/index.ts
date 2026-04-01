export interface Feed {
  id: string;
  url: string;
  title: string;
  category: 'tech' | 'finance' | 'news' | 'default';
  color: string;
}

export interface Article {
  id: string;
  feedId: string;
  title: string;
  summary: string;
  link: string;
  pubDate: string;
  source: string;
  color: string;
}
