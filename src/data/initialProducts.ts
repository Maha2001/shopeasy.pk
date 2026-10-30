import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Aether Pods Pro Wireless Earbuds',
    price: 3499,
    original_price: 5499,
    image: '/src/assets/images/product_earbuds_pro_1793379284683.jpg',
    category: 'Audio',
    stock: 24,
    description: 'Active Noise Canceling true wireless earbuds with magnetic rapid-charging case, deep bass acoustics, and 36-hour combined battery longevity. IPX5 sweat-resistant for workouts and daily Hyderabad commutes.',
    rating: 4.9,
    reviews_count: 86,
    is_featured: true,
    sku: 'AETH-POD-01',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod-002',
    name: 'Velocity Apex Titanium Smartwatch',
    price: 6899,
    original_price: 9999,
    image: '/src/assets/images/product_smartwatch_elite_1793379393786.jpg',
    category: 'Wearables',
    stock: 15,
    description: 'Ultra-crisp 1.43-inch AMOLED high-brightness display with always-on time, continuous SpO2 & heart rate biosensors, Bluetooth HD calling, and sleek brushed aerospace alloy bezel.',
    rating: 4.8,
    reviews_count: 112,
    is_featured: true,
    sku: 'VEL-APX-02',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'prod-003',
    name: 'Vanguard Stealth Low-Top Leather Sneakers',
    price: 4999,
    original_price: 7499,
    image: '/src/assets/images/product_leather_sneakers_1793379285731.jpg',
    category: 'Fashion',
    stock: 18,
    description: 'Handcrafted vegan matte black leather sneakers with subtle deep violet piping and vulcanized shock-absorbing rubber outsole. Designed for lightweight urban comfort and street styling.',
    rating: 4.7,
    reviews_count: 64,
    is_featured: true,
    sku: 'VANG-SNK-03',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: 'prod-004',
    name: 'CyberGrip Studio ANC Over-Ear Headphones',
    price: 8499,
    original_price: 12999,
    image: '/src/assets/images/hero_tech_showcase_1793379283555.jpg',
    category: 'Audio',
    stock: 9,
    description: 'Studio-reference acoustic soundstage with 40mm beryllium drivers, dual-mic ENC crystal-clear call quality, plush memory foam earcups, and up to 50 hours playtime.',
    rating: 4.9,
    reviews_count: 142,
    is_featured: true,
    sku: 'CYB-ANC-04',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'prod-005',
    name: 'Matter & Form Tactical Crossbody & Tech Kit',
    price: 2799,
    original_price: 3999,
    image: '/src/assets/images/hero_fashion_showcase_1793379284663.jpg',
    category: 'Fashion',
    stock: 30,
    description: 'Ballistic water-resistant nylon utility chest pouch and slim RFID-blocking magnetic leather wallet with anodized gunmetal hardware. The ultimate daily carry setup.',
    rating: 4.6,
    reviews_count: 53,
    is_featured: false,
    sku: 'MF-TACT-05',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    id: 'prod-006',
    name: 'Quantum 65W GaN Fast Charger & Braided Cable',
    price: 1999,
    original_price: 2899,
    image: '/src/assets/images/hero_tech_showcase_1793379283555.jpg',
    category: 'Tech & Gadgets',
    stock: 45,
    description: 'Gallium Nitride high-efficiency dual Type-C + USB-A wall charger capable of powering MacBooks, iPhones, and Android smartphones at top speed. Includes 2-meter armored braided cable.',
    rating: 4.9,
    reviews_count: 78,
    is_featured: false,
    sku: 'QTM-65W-06',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  }
];

export const HYDERABAD_AREAS = [
  'Qasimabad (Phase 1 & 2)',
  'Latifabad (Units 1 - 7)',
  'Latifabad (Units 8 - 12)',
  'Autobahn Road & Boulevard Mall Area',
  'Saddar Bazar & Cantonment',
  'Citizen Colony',
  'Wadhu Wah Road',
  'Hirabad & Tower Market',
  'Kohsar & Gul Centre',
  'GOR Colony & Thandi Sarak',
  'Hyderabad Railway Station / City Gate',
  'Other / Near Hyderabad Surroundings'
];
