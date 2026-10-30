import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, RefreshCw, MessageSquare } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  ctaText: string;
  categoryFilter?: string;
}

interface HeroSliderProps {
  onShopCategory: (category: string) => void;
  onExploreAll: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onShopCategory, onExploreAll }) => {
  const slides: Slide[] = [
    {
      id: 1,
      tag: 'New 2026 Collection',
      title: 'Next-Gen Acoustic Tech & Wearables',
      subtitle: 'Premium active noise-canceling headphones, titanium AMOLED smartwatches, and ultra-durable fast chargers delivered right to your doorstep.',
      badge: 'Hyderabad Same-Day COD Available',
      image: '/src/assets/images/hero_tech_showcase_1793379283555.jpg',
      ctaText: 'Explore Tech & Audio',
      categoryFilter: 'Audio'
    },
    {
      id: 2,
      tag: 'Streetwear & Lifestyle',
      title: 'Tactical Apparel & Minimalist Essentials',
      subtitle: 'Engineered ballistic nylon crossbodies, premium vegan leather sneakers, and RFID-secure wallets designed for urban daily carry.',
      badge: 'Limited Batch Inventory',
      image: '/src/assets/images/hero_fashion_showcase_1793379284663.jpg',
      ctaText: 'Shop Streetwear',
      categoryFilter: 'Fashion'
    },
    {
      id: 3,
      tag: 'Smart Fitness Series',
      title: 'Velocity Apex Titanium Smartwatch',
      subtitle: 'Ultra-bright 1.43" AMOLED display with real-time biometric sensors and Bluetooth HD Calling. Built for Pakistani athletes and executives.',
      badge: 'Bestseller in Hyderabad',
      image: '/src/assets/images/product_smartwatch_elite_1793379393786.jpg',
      ctaText: 'View Wearables',
      categoryFilter: 'Wearables'
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden bg-[#090810]">
      {/* Hero Showcase Slide */}
      <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Background image with measured black-purple gradient scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt={slide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b14] via-[#0b0b14]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b14] via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl">
            {/* Tagline */}
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-3 tracking-wide uppercase">
              <span>{slide.tag}</span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-400">{slide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 text-balance">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-300 mb-7 leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => slide.categoryFilter ? onShopCategory(slide.categoryFilter) : onExploreAll()}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-lg shadow-lg shadow-purple-900/40 transition-all transform active:scale-95 whitespace-nowrap"
              >
                {slide.ctaText}
              </button>
              <button
                onClick={onExploreAll}
                className="px-5 py-3 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 font-medium text-sm rounded-lg transition-colors whitespace-nowrap"
              >
                Browse All Products
              </button>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <button
          onClick={() => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-purple-900/80 border border-purple-500/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-purple-900/80 border border-purple-500/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === idx ? 'w-8 bg-purple-500' : 'w-2 bg-zinc-600/60 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Trust & Guarantees strip */}
      <div className="border-t border-b border-purple-950/50 bg-[#0d0c18] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center shrink-0 text-purple-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Cash on Delivery</div>
              <div className="text-zinc-400 text-[11px]">Pay upon delivery in Hyderabad</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center shrink-0 text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">100% Original Products</div>
              <div className="text-zinc-400 text-[11px]">Inspected & quality checked</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center shrink-0 text-purple-400">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">7 Days Easy Return</div>
              <div className="text-zinc-400 text-[11px]">Hassle-free exchange policy</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center shrink-0 text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">WhatsApp Support</div>
              <div className="text-zinc-400 text-[11px]">0317-3015221 Instant help</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
