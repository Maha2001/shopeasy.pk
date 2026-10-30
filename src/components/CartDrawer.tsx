import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { CartItem } from '../types';
import { formatPKR } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const isFreeDelivery = subtotal >= 2500 || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : 150;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#11101d] border-l border-purple-950/80 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-purple-950/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">Your Shopping Bag</h2>
              <span className="text-xs text-zinc-400">({items.length} items)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hyderabad free shipping progress bar */}
          <div className="bg-[#17152b] px-4 py-2.5 border-b border-purple-950/60 text-xs">
            {subtotal >= 2500 ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Congratulations! You unlocked FREE Cash on Delivery in Hyderabad!
              </span>
            ) : (
              <span className="text-purple-300">
                Add <span className="font-bold text-white">{formatPKR(2500 - subtotal)}</span> more for FREE Cash on Delivery!
              </span>
            )}
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-purple-950/40 border border-purple-900/40 flex items-center justify-center text-purple-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Your bag is empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs mb-6">
                  Browse our high-grade wearables, audio devices, and fashion catalog to add products.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-xl bg-[#161426] border border-purple-950/60"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-lg bg-black/40 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/hero_tech_showcase_1793379283555.jpg';
                    }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-purple-400 font-bold tabular-nums">
                      {formatPKR(product.price)}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-purple-950/40">
                      <div className="flex items-center border border-purple-950 rounded bg-zinc-900">
                        <button
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-white text-xs"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-white text-xs"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-white tabular-nums">
                        {formatPKR(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-purple-950/80 bg-[#0d0c17] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium tabular-nums">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Hyderabad COD Delivery</span>
                  <span className="text-white font-medium tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400">FREE</span>
                    ) : (
                      formatPKR(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-purple-950/60">
                  <span>Total Amount</span>
                  <span className="text-purple-400 tabular-nums">{formatPKR(total)}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Proceed to Cash on Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-zinc-400">
                💵 Pay cash at doorstep in Hyderabad upon inspection
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
