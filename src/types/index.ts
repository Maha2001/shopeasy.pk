export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  category: 'Tech & Gadgets' | 'Wearables' | 'Fashion' | 'Audio';
  stock: number;
  description: string;
  rating: number;
  reviews_count: number;
  is_featured?: boolean;
  sku: string;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  delivery_fee: number;
  payment_method: 'Cash on Delivery (COD)';
  status: OrderStatus;
  notes?: string;
  created_at: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
