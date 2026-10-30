import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const STORAGE_KEY_PRODUCTS = 'shopeasy_pk_products';
const STORAGE_KEY_ORDERS = 'shopeasy_pk_orders';
const STORAGE_KEY_SUPABASE_URL = 'shopeasy_supabase_url';
const STORAGE_KEY_SUPABASE_KEY = 'shopeasy_supabase_key';

let supabaseClient: SupabaseClient | null = null;

export function getStoredSupabaseConfig(): { url: string; key: string } {
  const url = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const key = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY) || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  return { url, key };
}

export function saveSupabaseConfig(url: string, key: string) {
  if (url) localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
  else localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);

  if (key) localStorage.setItem(STORAGE_KEY_SUPABASE_KEY, key.trim());
  else localStorage.removeItem(STORAGE_KEY_SUPABASE_KEY);

  initSupabase();
}

export function initSupabase(): SupabaseClient | null {
  const { url, key } = getStoredSupabaseConfig();
  if (url && key && url.startsWith('http')) {
    try {
      supabaseClient = createClient(url, key);
      return supabaseClient;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      supabaseClient = null;
    }
  } else {
    supabaseClient = null;
  }
  return supabaseClient;
}

// Initialise on load
initSupabase();

export function getSupabaseClient(): SupabaseClient | null {
  return supabaseClient;
}

// --- Local Storage Seed Helpers ---
function getLocalProducts(): Product[] {
  const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

function saveLocalProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
}

function getLocalOrders(): Order[] {
  const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  // Sample initial order for demonstration in Hyderabad
  const initialOrders: Order[] = [
    {
      id: 'ORD-78291',
      customer_name: 'Muhammad Farooq',
      phone: '0312-3456789',
      address: 'House #42, Street 3, Block B',
      area: 'Qasimabad (Phase 1 & 2)',
      city: 'Hyderabad',
      items: [
        {
          id: 'prod-001',
          name: 'Aether Pods Pro Wireless Earbuds',
          price: 3499,
          quantity: 1,
          image: '/src/assets/images/product_earbuds_pro_1793379284683.jpg'
        }
      ],
      total: 3649,
      subtotal: 3499,
      delivery_fee: 150,
      payment_method: 'Cash on Delivery (COD)',
      status: 'Shipped',
      notes: 'Call 15 mins before delivery at Qasimabad gate',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'ORD-78292',
      customer_name: 'Zainab Solangi',
      phone: '0300-9876543',
      address: 'Flat 402, Al-Rahim Arcade, Near Boulevard Mall',
      area: 'Autobahn Road & Boulevard Mall Area',
      city: 'Hyderabad',
      items: [
        {
          id: 'prod-002',
          name: 'Velocity Apex Titanium Smartwatch',
          price: 6899,
          quantity: 1,
          image: '/src/assets/images/product_smartwatch_elite_1793379393786.jpg'
        }
      ],
      total: 6899,
      subtotal: 6899,
      delivery_fee: 0,
      payment_method: 'Cash on Delivery (COD)',
      status: 'Pending',
      notes: 'Please verify original box seal before payment',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(initialOrders));
  return initialOrders;
}

function saveLocalOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
}

// --- Data Operations (Hybrid Supabase + Robust Local Fallback) ---

export async function fetchProducts(): Promise<Product[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch (e) {
      console.warn('Supabase fetch products failed, using local storage:', e);
    }
  }
  return getLocalProducts();
}

export async function addProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: 'prod-' + Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString()
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('products')
        .insert([newProduct])
        .select()
        .single();
      if (!error && data) {
        // Also sync local
        const local = getLocalProducts();
        saveLocalProducts([data as Product, ...local]);
        return data as Product;
      }
    } catch (e) {
      console.warn('Supabase add product error:', e);
    }
  }

  // Local fallback
  const local = getLocalProducts();
  const updated = [newProduct, ...local];
  saveLocalProducts(updated);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        const local = getLocalProducts().map(p => (p.id === id ? { ...p, ...data } : p));
        saveLocalProducts(local);
        return data as Product;
      }
    } catch (e) {
      console.warn('Supabase update product error:', e);
    }
  }

  const local = getLocalProducts();
  let updatedProduct: Product | null = null;
  const updated = local.map(p => {
    if (p.id === id) {
      updatedProduct = { ...p, ...updates };
      return updatedProduct;
    }
    return p;
  });
  saveLocalProducts(updated);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('products').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  const local = getLocalProducts().filter(p => p.id !== id);
  saveLocalProducts(local);
  return true;
}

export async function fetchOrders(): Promise<Order[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Order[];
      }
    } catch (e) {
      console.warn('Supabase fetch orders error:', e);
    }
  }
  return getLocalOrders();
}

export async function createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
    created_at: new Date().toISOString()
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('orders')
        .insert([newOrder])
        .select()
        .single();
      if (!error && data) {
        const local = getLocalOrders();
        saveLocalOrders([data as Order, ...local]);
        return data as Order;
      }
    } catch (e) {
      console.warn('Supabase insert order error:', e);
    }
  }

  // Local fallback
  const local = getLocalOrders();
  const updated = [newOrder, ...local];
  saveLocalOrders(updated);
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('orders').update({ status }).eq('id', orderId);
    } catch (e) {
      console.warn('Supabase update order status error:', e);
    }
  }

  const local = getLocalOrders().map(o => (o.id === orderId ? { ...o, status } : o));
  saveLocalOrders(local);
  return true;
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('orders').delete().eq('id', orderId);
    } catch (e) {
      console.warn('Supabase delete order error:', e);
    }
  }

  const local = getLocalOrders().filter(o => o.id !== orderId);
  saveLocalOrders(local);
  return true;
}

// SQL Migration script generator for direct Supabase copy-paste
export const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- SHOPEASY PK - SUPABASE PRODUCTION DATABASE SCHEMA & RLS
-- Run this in your Supabase SQL Editor:
-- ============================================================

-- 1. Create Products Table
create table if not exists public.products (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  price numeric not null,
  original_price numeric,
  image text not null,
  category text not null,
  stock integer not null default 10,
  description text,
  rating numeric default 4.8,
  reviews_count integer default 1,
  is_featured boolean default false,
  sku text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Orders Table (Cash on Delivery / Hyderabad Sindh)
create table if not exists public.orders (
  id text primary key default ('ORD-' || floor(random() * (99999 - 10000 + 1) + 10000)::text),
  customer_name text not null,
  phone text not null,
  address text not null,
  area text default 'Qasimabad',
  city text default 'Hyderabad',
  items jsonb not null,
  total numeric not null,
  subtotal numeric not null,
  delivery_fee numeric default 0,
  payment_method text default 'Cash on Delivery (COD)',
  status text not null default 'Pending',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- 4. RLS Policies:
-- (a) Allow public/anon read access for products (storefront visitors)
create policy "Allow anon read products" 
on public.products for select 
using (true);

-- (b) Allow anon customers to place Cash on Delivery orders
create policy "Allow anon insert orders" 
on public.orders for insert 
with check (true);

-- (c) Only authenticated users (Store Admins) can view and manage orders
create policy "Allow auth read orders" 
on public.orders for select 
using (auth.role() = 'authenticated');

create policy "Allow auth update orders" 
on public.orders for update 
using (auth.role() = 'authenticated');

create policy "Allow auth delete orders" 
on public.orders for delete 
using (auth.role() = 'authenticated');

-- (d) Only authenticated users (Store Admins) can insert/update/delete products
create policy "Allow auth manage products" 
on public.products for all 
using (auth.role() = 'authenticated');
`;
