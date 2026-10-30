import React from 'react';
import { MessageCircle, Phone, MapPin, Truck, ShieldCheck, RefreshCw, Mail } from 'lucide-react';

interface FooterProps {
  onNavigateHome: () => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateHome, onSelectCategory }) => {
  return (
    <footer className="bg-[#08070e] border-t border-purple-950/80 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <button
              onClick={onNavigateHome}
              className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5"
            >
              <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                ShopEasy
              </span>
              <span className="text-purple-400 font-extrabold text-xs px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-950/40">
                PK
              </span>
            </button>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Pakistan's premium direct-to-consumer store for audio, wearables, and tech gear. Featuring express Cash on Delivery in Hyderabad, Sindh.
            </p>
            <div className="pt-1 flex items-center gap-2 text-zinc-300 text-xs">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Hyderabad Hub, Sindh, Pakistan</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2">
              {['Audio', 'Wearables', 'Fashion', 'Tech & Gadgets'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className="hover:text-purple-300 transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Hyderabad COD Policy */}
          <div id="cod-policy">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Hyderabad Delivery & COD
            </h4>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Free delivery on orders over Rs. 2,500</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Check parcel before cash payment</span>
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>7 Days easy replacement guarantee</span>
              </li>
            </ul>
          </div>

          {/* WhatsApp & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-1">
              Customer Support
            </h4>
            <p className="text-zinc-400 text-xs">
              Direct assistance & order status helpline:
            </p>

            <a
              href="https://wa.me/923173015221"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1b3524] text-emerald-300 hover:text-white border border-emerald-800/60 font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: 0317-3015221</span>
            </a>

            <div className="flex items-center gap-2 text-zinc-400 text-xs pt-1">
              <Phone className="w-3.5 h-3.5 text-purple-400" />
              <span>+92 317 3015221 (Mon - Sat 10am - 9pm)</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-purple-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} ShopEasy PK. Built for Pakistan · All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Cash on Delivery</span>
            <span>·</span>
            <span>Supabase Cloud Integration</span>
            <span>·</span>
            <span>Hyderabad Sindh Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
