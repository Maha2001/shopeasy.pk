import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, ShoppingBag, MapPin, Phone, Truck } from 'lucide-react';
import { Order } from '../types';
import { formatPKR, generateWhatsAppLink } from '../lib/utils';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const whatsappUrl = generateWhatsAppLink({
    id: order.id,
    customer_name: order.customer_name,
    phone: order.phone,
    address: order.address,
    area: order.area,
    items: order.items,
    total: order.total,
  });

  const handleCopyReceipt = () => {
    const text = `ShopEasy PK Order Receipt\nOrder ID: ${order.id}\nCustomer: ${order.customer_name}\nPhone: ${order.phone}\nAddress: ${order.address}, ${order.area}, Hyderabad\nTotal: ${formatPKR(order.total)}\nStatus: Pending Cash on Delivery`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#12111f] border border-purple-800/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Success Header banner */}
        <div className="bg-gradient-to-b from-purple-900/50 to-transparent p-6 text-center border-b border-purple-950/60">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
            Order Placed Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-purple-200">
            Thank you for shopping with <strong className="text-white">ShopEasy PK</strong>
          </p>
          <div className="mt-3 inline-block px-3 py-1 bg-purple-950/80 border border-purple-800/60 rounded-full text-xs font-mono font-bold text-purple-300">
            Order #{order.id}
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5">
          {/* Hyderabad COD status box */}
          <div className="p-4 rounded-xl bg-[#161426] border border-purple-950 flex items-start gap-3">
            <Truck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-semibold text-white">Cash on Delivery - Hyderabad Dispatch</div>
              <div className="text-zinc-300">
                Our Hyderabad delivery partner will contact you at{' '}
                <span className="font-semibold text-white">{order.phone}</span> prior to delivery.
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800/80">
              <div className="text-zinc-500 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Delivery Address</span>
              </div>
              <div className="font-medium text-white">{order.customer_name}</div>
              <div className="text-zinc-300 line-clamp-2">{order.address}</div>
              <div className="text-purple-400 font-semibold mt-0.5">{order.area}, Hyderabad</div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800/80">
              <div className="text-zinc-500 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                <span>Payment & Contact</span>
              </div>
              <div className="font-medium text-white">{order.phone}</div>
              <div className="text-emerald-400 font-semibold">Cash on Delivery (COD)</div>
              <div className="text-white font-bold tabular-nums text-sm mt-0.5">
                Total: {formatPKR(order.total)}
              </div>
            </div>
          </div>

          {/* Items Summary list */}
          <div className="border border-purple-950/70 rounded-xl p-3 bg-zinc-950/60 max-h-36 overflow-y-auto space-y-2 text-xs">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-zinc-300">
                <div className="flex items-center gap-2 truncate">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 rounded object-cover bg-black/50 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/hero_tech_showcase_1793379283555.jpg';
                    }}
                  />
                  <span className="truncate">{item.name}</span>
                  <span className="text-zinc-500 text-[11px]">x{item.quantity}</span>
                </div>
                <span className="font-semibold text-white tabular-nums shrink-0">
                  {formatPKR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Primary Action Button: WhatsApp Dispatch Link */}
          <div className="space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Confirm Order on WhatsApp (+92 317 3015221)</span>
            </a>
            <p className="text-[11px] text-center text-zinc-400">
              Click to instantly dispatch your order details to ShopEasy PK official WhatsApp hotline for priority dispatch.
            </p>
          </div>

          {/* Secondary buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCopyReceipt}
              className="py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Receipt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Receipt</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-3 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 hover:text-white border border-purple-800/50 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
