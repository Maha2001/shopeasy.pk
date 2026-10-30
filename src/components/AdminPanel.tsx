import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  Database,
  Plus,
  Trash2,
  Edit2,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Search,
  ExternalLink,
  LogOut,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  Sparkles,
  UploadCloud,
  ChevronDown
} from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';
import { formatPKR } from '../lib/utils';
import {
  SUPABASE_SQL_SCHEMA,
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  getSupabaseClient
} from '../lib/supabase';
import { HYDERABAD_AREAS } from '../data/initialProducts';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onDeleteOrder,
  onExitAdmin,
}) => {
  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('shopeasy_admin_session') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'supabase'>('orders');

  // Order Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Product Filters & Modals
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New/Edit Product Form State
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(2999);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number>(4499);
  const [prodCategory, setProdCategory] = useState<'Tech & Gadgets' | 'Wearables' | 'Fashion' | 'Audio'>('Audio');
  const [prodStock, setProdStock] = useState<number>(20);
  const [prodImage, setProdImage] = useState('/src/assets/images/product_earbuds_pro_1793379284683.jpg');
  const [prodDescription, setProdDescription] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Supabase Configuration Form State
  const currentConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.key);
  const [supabaseSavedNotice, setSupabaseSavedNotice] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    // Accepts credentials or demo login
    if (
      (adminEmail.toLowerCase() === 'admin@shopeasypk.com' && adminPassword === 'admin123') ||
      (adminEmail.trim().length > 3 && adminPassword.length >= 6)
    ) {
      localStorage.setItem('shopeasy_admin_session', 'true');
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid credentials. You can use admin@shopeasypk.com / admin123');
    }
  };

  const handleDemoLogin = () => {
    setAdminEmail('admin@shopeasypk.com');
    setAdminPassword('admin123');
    localStorage.setItem('shopeasy_admin_session', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('shopeasy_admin_session');
    setIsAuthenticated(false);
  };

  // Open modal for editing
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdPrice(p.price);
    setProdOriginalPrice(p.original_price || p.price);
    setProdCategory(p.category);
    setProdStock(p.stock);
    setProdImage(p.image);
    setProdDescription(p.description);
    setProdFeatured(!!p.is_featured);
    setIsAddProductOpen(true);
  };

  // Open modal for creating
  const openCreateModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice(2999);
    setProdOriginalPrice(4499);
    setProdCategory('Audio');
    setProdStock(20);
    setProdImage('/src/assets/images/product_earbuds_pro_1793379284683.jpg');
    setProdDescription('High quality electronic gadget with official 1-year brand warranty.');
    setProdFeatured(false);
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    setIsSavingProduct(true);
    try {
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, {
          name: prodName.trim(),
          price: Number(prodPrice),
          original_price: Number(prodOriginalPrice),
          category: prodCategory,
          stock: Number(prodStock),
          image: prodImage.trim(),
          description: prodDescription.trim(),
          is_featured: prodFeatured,
        });
      } else {
        await onAddProduct({
          name: prodName.trim(),
          price: Number(prodPrice),
          original_price: Number(prodOriginalPrice),
          category: prodCategory,
          stock: Number(prodStock),
          image: prodImage.trim(),
          description: prodDescription.trim(),
          is_featured: prodFeatured,
          rating: 4.8,
          reviews_count: 1,
          sku: 'SEP-' + Math.floor(1000 + Math.random() * 9000),
        });
      }
      setIsAddProductOpen(false);
      setEditingProduct(null);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    setSupabaseSavedNotice(true);
    setTimeout(() => setSupabaseSavedNotice(false), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
    const query = orderSearchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      o.id.toLowerCase().includes(query) ||
      o.customer_name.toLowerCase().includes(query) ||
      o.phone.toLowerCase().includes(query) ||
      o.area.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // Filter products
  const filteredProducts = products.filter((p) => {
    const query = productSearchQuery.toLowerCase();
    return !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
  });

  // Calculate quick metrics
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const shippedCount = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  // ----------------------------------------------------
  // Unauthenticated View
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#131122] border border-purple-900/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 mx-auto flex items-center justify-center mb-3">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">ShopEasy PK Admin Portal</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Sign in to manage inventory, update Hyderabad orders, and configure Supabase RLS.
            </p>
          </div>

          {authError && (
            <div className="p-3 mb-4 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@shopeasypk.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-purple-950 text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-purple-950 text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-950 transition-all"
            >
              Sign In to Admin
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-purple-950/70 text-center space-y-3">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-purple-300 border border-purple-900/60 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Instant 1-Click Demo Login</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              ← Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Authenticated Dashboard
  // ----------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121120] border border-purple-950 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">ShopEasy PK Admin Hub</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-800/60 text-purple-300">
              {getSupabaseClient() ? 'Supabase Live' : 'Local Store'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Cash on Delivery order fulfillment & product inventory console
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onExitAdmin}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors"
          >
            Storefront
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-red-950/60 text-purple-300 hover:text-red-300 border border-purple-900/60 hover:border-red-900/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#141224] border border-purple-950/80">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
            {formatPKR(totalRevenue)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">COD received & pending</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141224] border border-purple-950/80">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Pending COD</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-amber-400 tabular-nums">
            {pendingCount}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Requires Hyderabad dispatch</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141224] border border-purple-950/80">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>In Transit (Shipped)</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-blue-400 tabular-nums">
            {shippedCount}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Courier out for delivery</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141224] border border-purple-950/80">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Delivered & Closed</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-400 tabular-nums">
            {deliveredCount}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Cash collected successfully</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#121120] border border-purple-950 max-w-fit">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'orders'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'products'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Products Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'supabase'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Supabase Backend & RLS</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: ORDERS MANAGEMENT */}
      {/* ==================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#141224] rounded-lg border border-purple-950">
              {['all', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    orderStatusFilter === st
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by name, phone, order ID..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-purple-950 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-2xl border border-purple-950/80 bg-[#12111f]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#17142b] border-b border-purple-950/80 text-zinc-400 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer & Phone</th>
                  <th className="py-3.5 px-4">Hyderabad Delivery Zone</th>
                  <th className="py-3.5 px-4">Ordered Items</th>
                  <th className="py-3.5 px-4">Total (COD)</th>
                  <th className="py-3.5 px-4">Status & Update</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950/50 text-zinc-300">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-zinc-500">
                      No orders found matching current criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-purple-300">{ord.id}</div>
                        <div className="text-[11px] text-zinc-500">
                          {new Date(ord.created_at).toLocaleDateString('en-PK', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{ord.customer_name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-zinc-400 font-mono text-[11px]">{ord.phone}</span>
                          <a
                            href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Chat on WhatsApp"
                            className="text-emerald-400 hover:text-emerald-300 p-0.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`tel:${ord.phone}`}
                            aria-label="Call customer"
                            className="text-blue-400 hover:text-blue-300 p-0.5"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-purple-300">{ord.area}</div>
                        <div className="text-zinc-400 text-[11px] truncate">{ord.address}</div>
                        {ord.notes && (
                          <div className="text-amber-300/80 text-[10px] italic mt-0.5 truncate">
                            Note: "{ord.notes}"
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="truncate text-zinc-300">
                              <span className="font-medium text-white">{item.quantity}x</span> {item.name}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white tabular-nums text-sm">
                          {formatPKR(ord.total)}
                        </div>
                        <div className="text-[10px] text-zinc-500">Cash on Delivery</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className={`py-1.5 px-3 rounded-lg text-xs font-semibold border focus:outline-none cursor-pointer appearance-none pr-7 ${
                              ord.status === 'Pending'
                                ? 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                                : ord.status === 'Shipped'
                                ? 'bg-blue-950/60 border-blue-700/60 text-blue-300'
                                : ord.status === 'Delivered'
                                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                            }`}
                          >
                            <option value="Pending" className="bg-zinc-900 text-white">Pending</option>
                            <option value="Shipped" className="bg-zinc-900 text-white">Shipped</option>
                            <option value="Delivered" className="bg-zinc-900 text-white">Delivered</option>
                            <option value="Cancelled" className="bg-zinc-900 text-white">Cancelled</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete order #${ord.id}?`)) {
                              onDeleteOrder(ord.id);
                            }
                          }}
                          className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {/* ==================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search catalog products..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-purple-950 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-600"
              />
            </div>

            <button
              onClick={openCreateModal}
              className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-[#141224] border border-purple-950/80 flex gap-4"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-20 h-20 rounded-lg object-cover bg-black/40 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/hero_tech_showcase_1793379283555.jpg';
                  }}
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                      <span className="text-purple-400 font-semibold">{p.category}</span>
                      <span className="tabular-nums">Stock: <strong className="text-white">{p.stock}</strong></span>
                    </div>
                    <h3 className="font-semibold text-white text-xs sm:text-sm truncate">
                      {p.name}
                    </h3>
                    <div className="text-sm font-bold text-white tabular-nums mt-1">
                      {formatPKR(p.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-purple-950/60 mt-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3 text-purple-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete product "${p.name}"?`)) {
                          onDeleteProduct(p.id);
                        }
                      }}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-red-950/80 text-zinc-400 hover:text-red-300 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: SUPABASE INTEGRATION & RLS */}
      {/* ==================================================== */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          {/* Supabase Connection Setup */}
          <div className="p-6 rounded-2xl bg-[#141224] border border-purple-950/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>Connect Your Supabase Project (Cloud Database)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Connect your live Supabase database or use the built-in resilient local storage store.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400">Current Status:</span>
                {getSupabaseClient() ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-semibold">
                    Connected to Supabase
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-semibold">
                    Offline / Local Storage Active
                  </span>
                )}
              </div>
            </div>

            {supabaseSavedNotice && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Supabase settings saved and client initialized!</span>
              </div>
            )}

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-purple-950 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Supabase Anon Public Key
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-purple-950 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Save & Connect Supabase
                </button>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-zinc-800"
                >
                  <span>Open Supabase Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </form>
          </div>

          {/* Complete SQL Schema & RLS Query */}
          <div className="p-6 rounded-2xl bg-[#141224] border border-purple-950/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Supabase Tables & RLS Migration Script
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Enforces exact user specifications: products & orders tables, anon read products, anon insert orders, only auth read orders.
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800/60 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SQL Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Schema</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-zinc-950 border border-purple-950/70 text-[11px] font-mono text-purple-200/90 overflow-x-auto max-h-80 leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ==================================================== */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#131122] border border-purple-900/80 rounded-2xl p-6 shadow-2xl my-6">
            <h3 className="text-base font-bold text-white mb-4">
              {editingProduct ? 'Edit Catalog Product' : 'Add New Product to ShopEasy PK'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Aether Ultra Wireless Earbuds"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-purple-950 text-xs text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Selling Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-purple-950 text-xs text-white focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Original Price (PKR strike-through)
                  </label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-purple-950 text-xs text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-purple-950 text-xs text-white focus:outline-none focus:border-purple-600"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Tech & Gadgets">Tech & Gadgets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Stock Inventory *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-purple-950 text-xs text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Product Image URL or Preset Path *
                </label>
                <input
                  type="text"
                  required
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="/src/assets/images/... or https://..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-purple-950 text-xs text-white focus:outline-none focus:border-purple-600"
                />

                {/* Quick image selector presets */}
                <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-zinc-400">
                  <span className="shrink-0">Sample Presets:</span>
                  <button
                    type="button"
                    onClick={() => setProdImage('/src/assets/images/product_earbuds_pro_1793379284683.jpg')}
                    className="px-2 py-0.5 rounded bg-zinc-800 hover:text-white shrink-0"
                  >
                    Earbuds
                  </button>
                  <button
                    type="button"
                    onClick={() => setProdImage('/src/assets/images/product_smartwatch_elite_1793379393786.jpg')}
                    className="px-2 py-0.5 rounded bg-zinc-800 hover:text-white shrink-0"
                  >
                    Smartwatch
                  </button>
                  <button
                    type="button"
                    onClick={() => setProdImage('/src/assets/images/product_leather_sneakers_1793379285731.jpg')}
                    className="px-2 py-0.5 rounded bg-zinc-800 hover:text-white shrink-0"
                  >
                    Sneakers
                  </button>
                  <button
                    type="button"
                    onClick={() => setProdImage('/src/assets/images/hero_tech_showcase_1793379283555.jpg')}
                    className="px-2 py-0.5 rounded bg-zinc-800 hover:text-white shrink-0"
                  >
                    Headphones
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Product specs, features, and warranty details..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-purple-950 text-xs text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={prodFeatured}
                  onChange={(e) => setProdFeatured(e.target.checked)}
                  className="rounded border-purple-900 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="featured-check" className="text-xs text-zinc-300">
                  Feature this product on homepage carousel & top spotlight
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-950">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold disabled:opacity-50"
                >
                  {isSavingProduct ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
