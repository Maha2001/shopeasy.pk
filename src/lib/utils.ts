export function formatPKR(amount: number): string {
  return 'Rs. ' + amount.toLocaleString('en-PK');
}

export function generateWhatsAppLink(order: {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  area: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
}): string {
  const itemsText = order.items
    .map((item, idx) => `${idx + 1}. ${item.name} x${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}`)
    .join('\n');

  const message = `*New Order from ShopEasy PK* 🛍️\n\n` +
    `*Order ID:* ${order.id}\n` +
    `*Customer:* ${order.customer_name}\n` +
    `*Phone:* ${order.phone}\n` +
    `*Address:* ${order.address}, ${order.area}, Hyderabad, Sindh\n\n` +
    `*Ordered Items:*\n${itemsText}\n\n` +
    `*Total Bill (Cash on Delivery):* Rs. ${order.total.toLocaleString()}\n\n` +
    `Please confirm my order and share tracking/dispatch time. Thank you!`;

  return `https://wa.me/923173015221?text=${encodeURIComponent(message)}`;
}

export function generateQuickWhatsAppInquiry(productName: string): string {
  const message = `Hello ShopEasy PK! I am interested in buying *${productName}* on Cash on Delivery in Hyderabad. Is it in stock?`;
  return `https://wa.me/923173015221?text=${encodeURIComponent(message)}`;
}
