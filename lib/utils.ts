import type { CartItem } from './types';
export const calculateSubtotal = (item: CartItem) => item.product.price * item.quantity;
export const calculateTotal = (items: CartItem[]) => items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
export const peso = (amount: number) => `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export function generateTransactionNumber() {
  const now = new Date();
  const day = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TXN-${day}-${random}`;
}
