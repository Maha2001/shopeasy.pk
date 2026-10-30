import React, { useState } from 'react';
import { X, Truck, ShieldCheck, MapPin, Phone, User, FileText, CheckCircle2 } from 'lucide-react';
import { CartItem, Order } from '../types';
import { HYDERABAD_AREAS } from '../data/initialProducts';
import { formatPKR } from '../lib/utils';
import { createOrder } from '../lib/supabase';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState(HYDERABAD_AREAS[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const deliveryFee = subtotal >= 2500 ? 0 : 150;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMessage('Please enter a valid Pakistani phone number (e.g. 03173015221 or 03001234567)');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please enter your Hyderabad delivery street address');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        customer_name: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        area: area,
        city: 'Hyderabad',
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
        })),
        total,
        subtotal,
        delivery_fee: deliveryFee,
        payment_method: 'Cash on Delivery (COD)' as const,
        status: 'Pending' as const,
        notes: notes.trim(),
      };

      const placedOrder = await createOrder(orderPayload);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9333ea', '#a855f7', '#c084fc', '#ffffff']
      });

      onOrderCompleted(placedOrder);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#12111f] border border-purple-900/70 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-purple-950/80 bg-[#161427] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Cash on Delivery Checkout</h2>
              <p className="text-[11px] text-zinc-400">Hyderabad Express Delivery (Sindh, Pakistan)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-200 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Customer details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  Full Name *
                </span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Asad Ali Khan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-purple-950 focus:border-purple-500 focus:outline-none text-white text-xs sm:text-sm placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  Phone Number (WhatsApp) *
                </span>
              </label>
              <input
                type="tel"
                required
                placeholder="03XX-XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-purple-950 focus:border-purple-500 focus:outline-none text-white text-xs sm:text-sm placeholder:text-zinc-600 transition-colors"
              />
            </div>
          </div>

          {/* Area & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  Hyderabad Delivery Area *
                </span>
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-purple-950 focus:border-purple-500 focus:outline-none text-white text-xs sm:text-sm transition-colors"
              >
                {HYDERABAD_AREAS.map((a) => (
                  <option key={a} value={a} className="bg-zinc-900 text-white">
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                City / Region
              </label>
              <input
                type="text"
                disabled
                value="Hyderabad, Sindh (Pakistan)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs sm:text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Complete Delivery Address (House/Shop #, Street, Landmark) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. House #14, Street 5, Near Citizen Club, Hyderabad"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-purple-950 focus:border-purple-500 focus:outline-none text-white text-xs sm:text-sm placeholder:text-zinc-600 transition-colors"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                Delivery Instructions (Optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Call before coming, or deliver after 4 PM"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-purple-950 focus:border-purple-500 focus:outline-none text-white text-xs sm:text-sm placeholder:text-zinc-600 transition-colors"
            />
          </div>

          {/* Order Summary & Pricing */}
          <div className="p-4 rounded-xl bg-[#161427] border border-purple-950/80 space-y-2 text-xs">
            <div className="font-semibold text-white mb-2 flex items-center justify-between">
              <span>Order Breakdown ({items.length} items)</span>
              <span className="text-zinc-400 font-normal">Cash on Delivery</span>
            </div>

            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 divide-y divide-purple-950/40">
              {items.map((i) => (
                <div key={i.product.id} className="pt-1.5 flex justify-between text-zinc-300">
                  <span className="truncate max-w-[280px]">
                    {i.product.name} <span className="text-zinc-500">x{i.quantity}</span>
                  </span>
                  <span className="tabular-nums font-medium text-white">
                    {formatPKR(i.product.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-purple-950/80 space-y-1 text-zinc-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-white tabular-nums">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Hyderabad Delivery Fee</span>
                <span className="text-white tabular-nums">
                  {deliveryFee === 0 ? <span className="text-emerald-400">FREE</span> : formatPKR(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-purple-950">
                <span>Total Payable at Doorstep</span>
                <span className="text-purple-400 tabular-nums">{formatPKR(total)}</span>
              </div>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-950/30 border border-purple-900/40 text-[11px] text-purple-200">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>Zero Advance Payment Required:</strong> Hand over cash to the courier only after receiving your package in Hyderabad.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Cash on Delivery Order ({formatPKR(total)})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
