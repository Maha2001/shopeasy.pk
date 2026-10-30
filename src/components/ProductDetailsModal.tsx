import React, { useState } from 'react';
import { X, ShoppingBag, Zap, Heart, MessageCircle, Truck, ShieldCheck, Check } from 'lucide-react';
import { Product } from '../types';
import { formatPKR, generateQuickWhatsAppInquiry } from '../lib/utils';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickBuy: (product: Product, quantity: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickBuy,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#12111e] border border-purple-900/60 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Gallery View */}
          <div className="relative bg-[#0a0a12] p-6 flex items-center justify-center min-h-[300px]">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full max-h-[360px] object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/src/assets/images/hero_tech_showcase_1793379283555.jpg';
              }}
            />
            {product.is_featured && (
              <span className="absolute top-4 left-4 text-[11px] font-bold px-2 py-0.5 rounded bg-purple-600 text-white">
                Featured Drop
              </span>
            )}
          </div>

          {/* Product Purchasing & Information */}
          <div className="p-6 md:p-8 flex flex-col">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="text-purple-400 font-semibold uppercase tracking-wider text-[11px]">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-medium text-xs">
                <span>★ {product.rating}</span>
                <span className="text-zinc-500">({product.reviews_count} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
              {product.name}
            </h2>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
                {formatPKR(product.price)}
              </span>
              {product.original_price && (
                <span className="text-sm text-zinc-500 line-through tabular-nums">
                  {formatPKR(product.original_price)}
                </span>
              )}
              {product.stock > 0 ? (
                <span className="ml-auto text-xs text-emerald-400 font-medium tabular-nums">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="ml-auto text-xs text-red-400 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-medium text-zinc-400">Quantity:</span>
              <div className="flex items-center border border-purple-950 rounded-lg bg-zinc-900/80">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-white tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Wishlist button */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`ml-auto p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs ${
                  isWishlisted
                    ? 'border-purple-600 bg-purple-950/40 text-purple-300'
                    : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-purple-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-purple-400' : ''}`} />
                <span>{isWishlisted ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white rounded-xl text-xs sm:text-sm font-semibold border border-purple-800/60 transition-all disabled:opacity-40"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onQuickBuy(product, quantity)}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 disabled:opacity-40"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Order COD</span>
              </button>
            </div>

            {/* Direct WhatsApp ask */}
            <a
              href={generateQuickWhatsAppInquiry(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#14231b] hover:bg-[#1a3025] text-emerald-300 border border-emerald-900/50 rounded-xl text-xs font-medium transition-colors mb-4"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Ask on WhatsApp (0317-3015221)</span>
            </a>

            {/* Hyderabad Delivery perks */}
            <div className="mt-auto pt-4 border-t border-purple-950/60 grid grid-cols-2 gap-3 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Hyderabad Same-Day / 24h COD</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Check Parcel Before Paying</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
