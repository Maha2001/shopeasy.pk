import React from 'react';
import { Heart, ShoppingBag, Eye, Zap } from 'lucide-react';
import { Product } from '../types';
import { formatPKR } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickBuy,
  onOpenDetails,
}) => {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col bg-[#12111d] rounded-xl border border-purple-950/60 hover:border-purple-800/70 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-950/20">
      {/* Image Area - 65% of card visual weight */}
      <div className="relative aspect-[4/3] bg-[#0c0b14] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback for image resilience
            (e.target as HTMLImageElement).src = '/src/assets/images/hero_tech_showcase_1793379283555.jpg';
          }}
        />

        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors backdrop-blur-md ${
            isWishlisted
              ? 'bg-purple-600 text-white'
              : 'bg-black/50 text-zinc-300 hover:text-white hover:bg-black/70'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View trigger */}
        <button
          onClick={() => onOpenDetails(product)}
          aria-label="Quick view"
          className="absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-zinc-300 hover:text-white flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 backdrop-blur-md"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Discount Badge if any */}
        {discount > 0 && (
          <div className="absolute bottom-2.5 left-2.5 z-10 text-[11px] font-bold px-2 py-0.5 rounded bg-purple-600 text-white shadow-sm">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Stock metadata (unboxed, clean typography) */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span className="uppercase tracking-wider text-[11px] font-medium text-purple-400">
            {product.category}
          </span>
          <span className="text-[11px] tabular-nums">
            {isOutOfStock ? (
              <span className="text-red-400">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-amber-400 font-medium">Only {product.stock} left</span>
            ) : (
              <span className="text-emerald-400/90 font-medium">In Stock</span>
            )}
          </span>
        </div>

        {/* Product Name */}
        <button
          onClick={() => onOpenDetails(product)}
          className="text-left font-semibold text-sm sm:text-[15px] text-zinc-100 hover:text-purple-300 transition-colors line-clamp-2 leading-snug mb-2"
        >
          {product.name}
        </button>

        {/* Price & Rating */}
        <div className="mt-auto pt-2 flex items-baseline justify-between gap-2 border-t border-purple-950/40">
          <div>
            <div className="text-base sm:text-lg font-bold text-white tabular-nums tracking-tight">
              {formatPKR(product.price)}
            </div>
            {product.original_price && (
              <div className="text-xs text-zinc-500 line-through tabular-nums">
                {formatPKR(product.original_price)}
              </div>
            )}
          </div>

          <div className="text-right text-[11px] text-zinc-400">
            <span className="text-amber-400 font-semibold">★ {product.rating}</span>
            <span className="text-zinc-500 ml-1">({product.reviews_count})</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-950/70 hover:bg-purple-900 border border-purple-800/50 text-purple-200 hover:text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          <button
            onClick={() => onQuickBuy(product)}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy COD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
