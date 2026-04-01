import { useState } from 'react';
import { useRSS } from './hooks/useRSS';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { Sidebar } from './components/Sidebar';
import { FloatingBar } from './components/FloatingBar';
import type { Article } from './types';

function App() {
  const { feeds, articles, loading, error, addFeed, refetch } = useRSS();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Canvas-style layout with staggered cards
  const getCardStyle = (index: number): React.CSSProperties => {
    const baseX = 40 + (index % 3) * 20;
    const baseY = 40 + Math.floor(index / 3) * 30;
    const rotation = (index % 5) - 2; // -2 to 2 degrees

    return {
      width: '360px',
      padding: '20px',
      transform: `rotate(${rotation}deg)`,
      marginLeft: `${baseX}px`,
      marginTop: `${baseY}px`,
    };
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Main Canvas */}
      <div className="flex-1 overflow-auto pb-24">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#1A1A1A' }}>
              RSS Canvas
            </h1>
            <p className="text-sm" style={{ color: '#888' }}>
              {articles.length} articles from {feeds.length} feeds
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-lg" style={{ color: '#888' }}>
                Loading feeds...
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-20">
              <div className="text-lg text-red-500">
                {error}
              </div>
            </div>
          )}

          {/* Article Cards Grid */}
          {!loading && (
            <div className="flex flex-wrap -mx-4">
              {articles.map((article, index) => (
                <div key={article.id} className="inline-block">
                  <ArticleCard
                    article={article}
                    onClick={() => setSelectedArticle(article)}
                    style={getCardStyle(index)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && articles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-4xl mb-4">📰</div>
              <div className="text-lg mb-2" style={{ color: '#1A1A1A' }}>
                No articles yet
              </div>
              <div className="text-sm" style={{ color: '#888' }}>
                Add an RSS feed to get started
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar feeds={feeds} articles={articles} />

      {/* Floating Action Bar */}
      <FloatingBar onAddFeed={addFeed} onRefresh={refetch} />

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}

export default App;
