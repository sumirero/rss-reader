import { useState } from 'react';

interface FloatingBarProps {
  onAddFeed: (url: string) => void;
  onRefresh: () => void;
}

export function FloatingBar({ onAddFeed, onRefresh }: FloatingBarProps) {
  const [url, setUrl] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAddFeed(url.trim());
      setUrl('');
      setShowInput(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 bg-white rounded-full shadow-lg px-4 py-2 border border-gray-100"
      >
        {showInput ? (
          <>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Paste RSS feed URL..."
              className="w-64 px-3 py-2 text-sm outline-none rounded-full bg-gray-50"
              autoFocus
              onBlur={() => !url && setShowInput(false)}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#4FC3F7' }}
            >
              Add
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setShowInput(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">+</span>
              <span>Add Feed</span>
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              ↻
            </button>
          </>
        )}
      </form>
    </div>
  );
}
