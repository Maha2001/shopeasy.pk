import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { formatPKR } from '../lib/utils';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#121120] border border-purple-900/80 rounded-2xl p-6 shadow-2xl my-6">
        <div className="flex items-center justify-between pb-4 border-b border-purple-950/80">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-400 fill-current" />
            <h2 className="text-base sm:text-lg font-bold text-white">Your Saved Wishlist</h2>
            <span className="text-xs text-zinc-400">({wishlist.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 max-h-[60vh] overflow-y-auto space-y-3">
          {wishlist.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Heart className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">No items in your wishlist yet.</p>
              <p className="text-[11px] text-zinc-500">Tap the heart icon on any product to save it for later.</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#171529] border border-purple-950"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover bg-black/40 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                    {item.name}
                  </h4>
                  <div className="text-xs text-purple-400 font-bold tabular-nums">
                    {formatPKR(item.price)}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      onRemoveFromWishlist(item);
                    }}
                    className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Move to Bag</span>
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(item)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
