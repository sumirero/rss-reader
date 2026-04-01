import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  style?: React.CSSProperties;
}

export function ArticleCard({ article, onClick, style }: ArticleCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-card shadow-card cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden"
      style={{ ...style, paddingLeft: '24px' }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card"
        style={{ backgroundColor: article.color }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: article.color }}
        >
          {article.source.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs" style={{ color: '#888' }}>{article.source}</span>
        {article.pubDate && (
          <>
            <span className="text-xs" style={{ color: '#CCC' }}>•</span>
            <span className="text-xs" style={{ color: '#888' }}>{article.pubDate}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A1A', lineHeight: 1.4 }}>
        {article.title}
      </h3>

      {/* Summary */}
      <p className="text-sm mb-0" style={{ color: '#555', lineHeight: 1.7 }}>
        {article.summary}
      </p>
    </div>
  );
}
