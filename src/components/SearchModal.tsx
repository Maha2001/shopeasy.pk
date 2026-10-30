import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '../types';
import { formatPKR } from '../lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = products.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return false;
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#121120] border border-purple-900/80 rounded-2xl p-4 shadow-2xl">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-5 h-5 text-purple-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search audio, watches, fashion, chargers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-zinc-900 border border-purple-950 text-white text-sm focus:outline-none focus:border-purple-600"
          />
          <button
            onClick={onClose}
            className="absolute right-3 p-1 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-3 max-h-80 overflow-y-auto space-y-2">
          {query && results.length === 0 && (
            <div className="text-center py-8 text-xs text-zinc-500">
              No products found matching "{query}".
            </div>
          )}

          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onSelectProduct(p);
                onClose();
              }}
              className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-950/40 border border-transparent hover:border-purple-900/60 transition-colors"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-12 h-12 rounded-lg object-cover bg-black/40 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                <div className="text-[11px] text-zinc-400">{p.category}</div>
              </div>
              <div className="text-xs font-bold text-purple-300 tabular-nums shrink-0">
                {formatPKR(p.price)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
