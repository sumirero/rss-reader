import type { Article } from '../types';

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
}

export function ArticleDetail({ article, onClose }: ArticleDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-6">
      <div
        className="bg-white rounded-card shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto relative"
        style={{ paddingLeft: '24px' }}
      >
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card"
          style={{ backgroundColor: article.color }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pt-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: article.color }}
          >
            {article.source.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-medium" style={{ color: article.color }}>{article.source}</span>
            {article.pubDate && (
              <span className="text-xs ml-2" style={{ color: '#888' }}>{article.pubDate}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 pr-12" style={{ color: '#1A1A1A', lineHeight: 1.3 }}>
          {article.title}
        </h2>

        {/* Summary/Content */}
        <div className="text-base mb-6" style={{ color: '#444', lineHeight: 1.8 }}>
          {article.summary}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: article.color }}
          >
            Read Full Article →
          </a>
        </div>
      </div>
    </div>
  );
}
