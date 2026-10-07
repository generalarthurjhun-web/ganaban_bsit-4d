export type Product = { id: string; name: string; price: number; icon: string; category: string; color: string };
export type CartItem = { product: Product; quantity: number };
export type PaymentMethod = 'Cash' | 'QR Payment' | 'Card';
export type Transaction = { id: string; date: string; items: CartItem[]; total: number; method: PaymentMethod; amountPaid: number; change: number };
