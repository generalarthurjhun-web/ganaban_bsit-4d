import type { Product } from './types';

export const products: Product[] = [
  { id: 'coffee', name: 'Coffee', price: 45, icon: '☕', category: 'Warm & cozy', color: 'peach' },
  { id: 'burger', name: 'Burger', price: 80, icon: '🍔', category: 'Made to fill', color: 'yellow' },
  { id: 'fries', name: 'French Fries', price: 50, icon: '🍟', category: 'A little crunchy', color: 'pink' },
  { id: 'milktea', name: 'Milk Tea', price: 65, icon: '🧋', category: 'Cool & creamy', color: 'lavender' },
  { id: 'cookies', name: 'Cookies', price: 25, icon: '🍪', category: 'Sweet treat', color: 'mint' },
  { id: 'water', name: 'Bottled Water', price: 20, icon: '💧', category: 'Stay refreshed', color: 'blue' },
  { id: 'sandwich', name: 'Sandwich', price: 50, icon: '🥪', category: 'Freshly made', color: 'green' },
  { id: 'donut', name: 'Donut', price: 30, icon: '🍩', category: 'Little happy', color: 'rose' },
];
