import React from 'react';
import { ShoppingBag, Heart, Search, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
  onNavigateHome: () => void;
  onNavigateCatalog: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  isAdminOpen,
  onToggleAdmin,
  onNavigateHome,
  onNavigateCatalog,
}) => {
  return (
    <>
      {/* Hyderabad Free Shipping announcement banner */}
      <div className="bg-gradient-to-r from-purple-950 via-[#181329] to-purple-950 border-b border-purple-900/40 py-1.5 px-4 text-center text-xs text-purple-200">
        <span className="font-semibold text-purple-300">Free Cash on Delivery in Hyderabad</span>
        {' '}on orders over Rs. 2,500 · Same-Day Dispatch 🚀
      </div>

      <header className="sticky top-0 z-40 bg-[#0d0c17]/90 backdrop-blur-md border-b border-purple-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single element, no descriptor tags) */}
          <button
            onClick={onNavigateHome}
            className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">ShopEasy</span>
            <span className="text-purple-400 font-extrabold text-xs px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-950/40">PK</span>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
            <button
              onClick={onNavigateHome}
              className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0"
            >
              Home
            </button>
            <button
              onClick={onNavigateCatalog}
              className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0"
            >
              Shop Catalog
            </button>
            <a
              href="#featured"
              className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0"
            >
              Featured
            </a>
            <a
              href="#cod-policy"
              className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0"
            >
              Hyderabad COD Policy
            </a>
          </nav>

          {/* Zone 3: Interactive controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              aria-label="Search products"
              className="p-2 text-zinc-300 hover:text-white hover:bg-purple-950/40 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              aria-label="Wishlist"
              className="relative p-2 text-zinc-300 hover:text-white hover:bg-purple-950/40 rounded-lg transition-colors"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              aria-label="Shopping Cart"
              className="relative flex items-center gap-2 px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/50 text-purple-200 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Bag</span>
              <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-[11px] font-bold">
                {cartCount}
              </span>
            </button>

            {/* Admin Portal Toggle */}
            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 border ${
                isAdminOpen
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30'
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-purple-800/70 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">{isAdminOpen ? 'Back to Store' : 'Admin Panel'}</span>
              <span className="sm:hidden">Admin</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
