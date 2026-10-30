/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  fetchProducts,
  fetchOrders,
  addProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  deleteOrder,
} from './lib/supabase';
import { Product, CartItem, Order, OrderStatus } from './types';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { WishlistModal } from './components/WishlistModal';
import { SearchModal } from './components/SearchModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { formatPKR } from './lib/utils';
import { SlidersHorizontal, Sparkles, ArrowUpDown, RefreshCcw } from 'lucide-react';

export default function App() {
  // Core State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cart State (stored in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopeasy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (stored in localStorage)
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('shopeasy_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Route / View State: checks URL hash or query for /admin
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    return window.location.hash === '#/admin' || window.location.pathname === '/admin';
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Catalog Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Load Initial Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [prods, ords] = await Promise.all([fetchProducts(), fetchOrders()]);
        setProducts(prods);
        setOrders(ords);
      } catch (e) {
        console.error('Error fetching initial data:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save Cart & Wishlist to localStorage on change
  useEffect(() => {
    localStorage.setItem('shopeasy_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopeasy_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync hash with admin view
  const handleToggleAdmin = () => {
    const nextState = !isAdminView;
    setIsAdminView(nextState);
    if (nextState) {
      window.location.hash = '#/admin';
    } else {
      window.location.hash = '';
    }
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: Math.min(item.product.stock, newQty) } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // 1-Click Cash on Delivery Buy
  const handleQuickBuy = (product: Product, quantity: number = 1) => {
    // Put single product in checkout
    setCart([{ product, quantity }]);
    setIsCheckoutOpen(true);
    setSelectedProduct(null);
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Order Placement Handler
  const handleOrderCompleted = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setCompletedOrder(order);
  };

  // Admin Actions
  const handleAdminAddProduct = async (prodData: Omit<Product, 'id' | 'created_at'>) => {
    const created = await addProduct(prodData);
    setProducts((prev) => [created, ...prev]);
  };

  const handleAdminUpdateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await updateProduct(id, updates);
    if (updated) {
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
  };

  const handleAdminDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAdminUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const handleAdminDeleteOrder = async (orderId: string) => {
    await deleteOrder(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Price filter
    result = result.filter((p) => p.price <= maxPrice);

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Featured
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, maxPrice, sortBy]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.is_featured);
  }, [products]);

  const categories = ['All', 'Audio', 'Wearables', 'Fashion', 'Tech & Gadgets'];

  const cartTotalItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b14] text-zinc-100">
      {/* Navigation Header */}
      <Navbar
        cartCount={cartTotalItemsCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        isAdminOpen={isAdminView}
        onToggleAdmin={handleToggleAdmin}
        onNavigateHome={() => {
          setIsAdminView(false);
          window.location.hash = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateCatalog={() => {
          setIsAdminView(false);
          window.location.hash = '';
          const elem = document.getElementById('catalog');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isAdminView ? (
          <AdminPanel
            products={products}
            orders={orders}
            onAddProduct={handleAdminAddProduct}
            onUpdateProduct={handleAdminUpdateProduct}
            onDeleteProduct={handleAdminDeleteProduct}
            onUpdateOrderStatus={handleAdminUpdateOrderStatus}
            onDeleteOrder={handleAdminDeleteOrder}
            onExitAdmin={() => {
              setIsAdminView(false);
              window.location.hash = '';
            }}
          />
        ) : (
          <>
            {/* Hero Slider */}
            <HeroSlider
              onShopCategory={(cat) => {
                setSelectedCategory(cat);
                const elem = document.getElementById('catalog');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreAll={() => {
                setSelectedCategory('All');
                const elem = document.getElementById('catalog');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Featured Collection Section */}
            {featuredProducts.length > 0 && (
              <section id="featured" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Curated Drops</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Featured In Hyderabad
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      const elem = document.getElementById('catalog');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View All Catalog →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      isWishlisted={wishlist.some((w) => w.id === p.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={(prod) => handleAddToCart(prod, 1)}
                      onQuickBuy={(prod) => handleQuickBuy(prod, 1)}
                      onOpenDetails={(prod) => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Complete Product Catalog Section */}
            <section id="catalog" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-purple-950/60">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Shop Collection
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Authentic gear delivered via Cash on Delivery with parcel inspection guarantee.
                  </p>
                </div>

                {/* Filter and Control Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121120] border border-purple-950/80">
                  {/* Category Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                          selectedCategory.toLowerCase() === cat.toLowerCase()
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-white bg-zinc-900/60'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Price Slider & Sort */}
                  <div className="flex flex-wrap items-center gap-5 text-xs">
                    {/* Price Range Slider */}
                    <div className="flex items-center gap-3">
                      <SlidersHorizontal className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="text-zinc-400 whitespace-nowrap">
                        Max Price:{' '}
                        <strong className="text-white tabular-nums font-bold">
                          {formatPKR(maxPrice)}
                        </strong>
                      </span>
                      <input
                        type="range"
                        min={1500}
                        max={15000}
                        step={500}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-24 sm:w-32 accent-purple-600 cursor-pointer"
                      />
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-zinc-900 border border-purple-950 text-zinc-200 text-xs rounded-lg py-1.5 px-2.5 focus:outline-none focus:border-purple-600"
                      >
                        <option value="featured">Featured First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>

                    {/* Reset button if filtered */}
                    {(selectedCategory !== 'All' || maxPrice < 15000) && (
                      <button
                        onClick={() => {
                          setSelectedCategory('All');
                          setMaxPrice(15000);
                        }}
                        className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                      >
                        <RefreshCcw className="w-3 h-3" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 bg-[#121120] rounded-2xl border border-purple-950/80 p-8 space-y-3">
                    <p className="text-sm text-zinc-400">
                      No products found matching the chosen category or price range.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setMaxPrice(15000);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        isWishlisted={wishlist.some((w) => w.id === p.id)}
                        onToggleWishlist={handleToggleWishlist}
                        onAddToCart={(prod) => handleAddToCart(prod, 1)}
                        onQuickBuy={(prod) => handleQuickBuy(prod, 1)}
                        onOpenDetails={(prod) => setSelectedProduct(prod)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Product Details Zoom Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.some((w) => w.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
        onQuickBuy={(prod, qty) => handleQuickBuy(prod, qty)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Cash on Delivery Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Order Success & WhatsApp Dispatch Screen */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Footer */}
      <Footer
        onNavigateHome={() => {
          setIsAdminView(false);
          window.location.hash = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={(cat) => {
          setIsAdminView(false);
          setSelectedCategory(cat);
          const elem = document.getElementById('catalog');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}
