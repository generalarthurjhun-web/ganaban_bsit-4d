'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, CreditCard, Minus, Plus, QrCode, ReceiptText, RotateCw, ShoppingBag, Trash2 } from 'lucide-react';
import { products } from '@/lib/products';
import { calculateSubtotal, calculateTotal, generateTransactionNumber, peso } from '@/lib/utils';
import { advanceOrderNumber, loadOrderNumber } from '@/lib/orderNumber';
import type { CartItem, PaymentMethod, Transaction } from '@/lib/types';

type Screen = 'order' | 'summary' | 'payment' | 'cash' | 'qr' | 'card' | 'card-processing' | 'success' | 'receipt';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('order');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paidInput, setPaidInput] = useState('');
  const [error, setError] = useState('');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [toast, setToast] = useState('');
  const [orderNumber, setOrderNumber] = useState('001');
  const total = useMemo(() => calculateTotal(cart), [cart]);
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  useEffect(() => {
    setOrderNumber(loadOrderNumber());
  }, []);

  function feedback(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  }

  function addProduct(productId: string) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    setCart((current) => {
      const existing = current.find((item) => item.product.id === productId);
      if (existing) return current.map((item) => item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { product, quantity: 1 }];
    });
    feedback(`${product.name} added to your order`);
  }

  function changeQuantity(id: string, delta: number) {
    setCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  }

  function removeProduct(id: string) {
    const item = cart.find((entry) => entry.product.id === id);
    setCart((current) => current.filter((entry) => entry.product.id !== id));
    if (item) feedback(`${item.product.name} removed`);
  }

  function selectPayment(method: PaymentMethod) {
    setPaymentMethod(method);
    setError('');
    if (method === 'Cash') setScreen('cash');
    if (method === 'QR Payment') setScreen('qr');
    if (method === 'Card') setScreen('card');
  }

  function completePayment(method: PaymentMethod, amountPaid: number) {
    if (cart.length === 0) return;
    const paid = Math.round(amountPaid * 100) / 100;
    const change = Math.round((paid - total) * 100) / 100;
    const now = new Date();
    const next: Transaction = {
      id: generateTransactionNumber(),
      date: now.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: cart.map((item) => ({ ...item })), total, method, amountPaid: paid, change,
    };
    setPaymentMethod(method);
    setTransaction(next);
    setScreen('success');
    feedback('Payment successful. Thank you!');
  }

  function payCash() {
    if (paidInput.trim() === '') { setError('Please enter the amount paid.'); return; }
    const amount = Number(paidInput);
    if (!Number.isFinite(amount)) { setError('Please enter a valid amount.'); return; }
    if (amount < 0) { setError('Amount cannot be negative.'); return; }
    if (amount < total) { setError(`Insufficient payment. Please enter at least ${peso(total)}.`); return; }
    setError('');
    completePayment('Cash', amount);
  }

  function resetTransaction() {
    const nextOrder = advanceOrderNumber(orderNumber);
    setCart([]); setPaymentMethod(null); setPaidInput(''); setError(''); setTransaction(null); setToast('');
    setOrderNumber(nextOrder);
    setScreen('order');
  }

  function backToOrder() { setScreen('order'); }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">☕</span><span>campus café</span></div>
        <div className="order-badge">ORDER #{orderNumber}</div>
      </header>

      {screen === 'order' && <div className="main">
        <div className="hero"><p className="eyebrow">GOOD FOOD, GOOD STUDY DAYS</p><h1>What sounds good today?</h1><p className="hero-sub">Fresh picks for your campus break.</p></div>
        <div className="order-layout">
          <section>
            <div className="menu-heading"><h2>Today&apos;s favorites</h2><span>Tap a treat to add it</span></div>
            <div className="product-grid">{products.map((product) => <button className="product-card" key={product.id} onClick={() => addProduct(product.id)} aria-label={`Add ${product.name}, ${peso(product.price)}`}>
              <div className={`food-art ${product.color}`} aria-hidden="true">{product.icon}</div>
              <div className="product-info"><div><div className="product-name">{product.name}</div><div className="product-category">{product.category}</div></div><div className="product-price">{peso(product.price)}</div></div>
            </button>)}</div>
          </section>
          <aside className="cart-panel">
            <div className="cart-top"><h2>Your order <span style={{color:'#a19489'}}>({itemCount} items)</span></h2><p className="cart-caption">A little something for your day</p></div>
            <div className="cart-items">{cart.length === 0 ? <div className="cart-empty"><div className="empty-icon">🛍️</div><strong>Your bag is waiting</strong><span>Tap a favorite to get started</span></div> : cart.map((item) => <div className="cart-line" key={item.product.id}>
              <div className="mini-food">{item.product.icon}</div><div><div className="cart-line-name">{item.product.name}</div><div className="cart-line-price">{peso(item.product.price)} each</div><div className="qty-row"><button className="qty-button" aria-label={`Decrease ${item.product.name}`} onClick={() => changeQuantity(item.product.id, -1)}><Minus size={15}/></button><span className="qty-count">{item.quantity}</span><button className="qty-button" aria-label={`Increase ${item.product.name}`} onClick={() => changeQuantity(item.product.id, 1)}><Plus size={15}/></button><button className="remove-button" aria-label={`Remove ${item.product.name}`} onClick={() => removeProduct(item.product.id)}><Trash2 size={16}/></button></div></div><div className="cart-line-total">{peso(calculateSubtotal(item))}</div>
            </div>)}</div>
            <div className="cart-footer"><div className="total-row"><span>Total</span><strong className="total-amount">{peso(total)}</strong></div><button className="primary-button" disabled={!cart.length} onClick={() => setScreen('summary')}>Review order <ChevronRight size={20}/></button></div>
          </aside>
        </div>
      </div>}

      {screen === 'summary' && <div className="main"><section className="content-card wide"><div className="step-head"><button className="back-link" onClick={backToOrder}><ArrowLeft size={18}/> Back to menu</button><span className="eyebrow">STEP 1 OF 3</span></div><div className="summary-header"><div className="summary-icon"><ReceiptText size={30}/></div><p className="eyebrow">LOOKS DELICIOUS</p><h1 className="screen-title">Your order summary</h1><p className="hero-sub">Take a moment to check everything.</p></div>
        <div className="summary-items">{cart.map((item) => <div className="summary-row" key={item.product.id}><div><div className="summary-product">{item.product.icon} &nbsp;{item.product.name}</div><div className="summary-detail">{item.quantity} × {peso(item.product.price)}</div></div><div className="summary-detail">Unit price<br/><strong style={{color:'#342820'}}>{peso(item.product.price)}</strong></div><div className="summary-subtotal">{peso(calculateSubtotal(item))}</div></div>)}</div>
        <div className="summary-bottom"><span>Total to pay</span><strong>{peso(total)}</strong></div><div className="actions"><button className="secondary-button" onClick={backToOrder}><ArrowLeft size={18}/> Back to Order</button><button className="primary-button" onClick={() => setScreen('payment')}>Continue to Payment <ChevronRight size={19}/></button></div>
      </section></div>}

      {screen === 'payment' && <div className="main"><section className="content-card narrow"><div className="step-head"><button className="back-link" onClick={() => setScreen('summary')}><ArrowLeft size={18}/> Order summary</button><span className="eyebrow">STEP 2 OF 3</span></div><p className="eyebrow">HOW WOULD YOU LIKE TO PAY?</p><h1 className="screen-title">Choose payment</h1><p className="hero-sub">Select the option that works for you.</p><div className="pay-total"><span>YOUR TOTAL</span><strong>{peso(total)}</strong></div><div className="payment-options">
        <button className="payment-choice" onClick={() => selectPayment('Cash')}><span className="payment-icon"><ShoppingBag size={25}/></span><span><strong>Cash</strong><small>Pay at the counter</small></span></button>
        <button className="payment-choice" onClick={() => selectPayment('QR Payment')}><span className="payment-icon"><QrCode size={26}/></span><span><strong>QR Payment</strong><small>Scan to pay</small></span></button>
        <button className="payment-choice" onClick={() => selectPayment('Card')}><span className="payment-icon"><CreditCard size={26}/></span><span><strong>Card</strong><small>Tap, insert, or swipe</small></span></button>
      </div><button className="back-link" onClick={() => setScreen('summary')}><ArrowLeft size={17}/> Back to order summary</button></section></div>}

      {screen === 'cash' && <div className="main"><section className="content-card narrow"><div className="step-head"><button className="back-link" onClick={() => setScreen('payment')}><ArrowLeft size={18}/> Payment options</button><span className="eyebrow">CASH PAYMENT</span></div><p className="eyebrow">ALMOST THERE</p><h1 className="screen-title">Pay with cash</h1><div className="pay-total"><span>TOTAL TO PAY</span><strong>{peso(total)}</strong></div><label className="field-label" htmlFor="amount-paid">Amount paid</label><input id="amount-paid" className="amount-input" inputMode="decimal" type="number" min="0" step="0.01" placeholder="₱  Enter amount" value={paidInput} onChange={(event) => { setPaidInput(event.target.value); setError(''); }} onKeyDown={(event) => { if (event.key === 'Enter') payCash(); }}/><p className="hint">Enter the amount you&apos;re paying in pesos.</p>{error && <div className="error-message" role="alert">{error}</div>}<button className="primary-button" onClick={payCash}>Pay now <ChevronRight size={19}/></button></section></div>}

      {screen === 'qr' && <div className="main"><section className="content-card narrow"><div className="step-head"><button className="back-link" onClick={() => setScreen('payment')}><ArrowLeft size={18}/> Payment options</button><span className="eyebrow">QR PAYMENT</span></div><div className="summary-header"><p className="eyebrow">QUICK & EASY</p><h1 className="screen-title">Scan to pay</h1><div className="pay-total" style={{textAlign:'left'}}><span>AMOUNT</span><strong>{peso(total)}</strong></div><div className="qr-box" aria-label="Simulated QR code"><span className="qr-bottom"/></div><p className="payment-note">Scan the QR code using your supported payment application.<br/>This is a simulated payment.</p><button className="primary-button" onClick={() => completePayment('QR Payment', total)}><Check size={19}/> Confirm Payment</button></div></section></div>}

      {screen === 'card' && <div className="main"><section className="content-card narrow"><div className="step-head"><button className="back-link" onClick={() => setScreen('payment')}><ArrowLeft size={18}/> Payment options</button><span className="eyebrow">CARD PAYMENT</span></div><div className="summary-header"><div className="summary-icon"><CreditCard size={29}/></div><p className="eyebrow">SECURE & SIMPLE</p><h1 className="screen-title">Card payment</h1><div className="pay-total" style={{textAlign:'left'}}><span>AMOUNT</span><strong>{peso(total)}</strong></div><div className="processing"><CreditCard size={32}/></div><p className="payment-note">Please tap, insert, or swipe your card.<br/>This is a simulated payment.</p><button className="primary-button" onClick={() => { setError(''); setScreen('card-processing'); window.setTimeout(() => completePayment('Card', total), 1100); }}>Process Payment <ChevronRight size={19}/></button></div></section></div>}

      {screen === 'card-processing' && <div className="main"><section className="content-card narrow summary-header"><div className="processing"><RotateCw className="spin" size={32}/></div><p className="eyebrow">CARD PAYMENT</p><h1 className="screen-title">Processing payment...</h1><p className="hero-sub">Please wait a moment.</p></section></div>}

      {screen === 'success' && transaction && <div className="main"><section className="content-card narrow"><div className="success-mark"><Check size={43} strokeWidth={3}/></div><h1 className="success-title">Payment successful!</h1><p className="success-sub">All set. We&apos;re getting your order ready.</p><div className="transaction-box">TRANSACTION REFERENCE<strong>{transaction.id}</strong></div><div className="success-total"><small>TOTAL PAID</small><strong>{peso(transaction.total)}</strong></div><div className="payment-detail"><div className="detail-cell"><small>Payment method</small><strong>{transaction.method}</strong></div><div className="detail-cell"><small>Amount paid</small><strong>{peso(transaction.amountPaid)}</strong></div><div className="detail-cell"><small>Change</small><strong>{peso(transaction.change)}</strong></div><div className="detail-cell"><small>Items</small><strong>{transaction.items.reduce((sum, item) => sum + item.quantity, 0)} items</strong></div></div><button className="primary-button" onClick={() => setScreen('receipt')}>View Receipt <ReceiptText size={19}/></button></section></div>}

      {screen === 'receipt' && transaction && <div className="main"><section className="receipt-paper"><div className="receipt-header"><div className="brand-mark" style={{margin:'0 auto 12px'}}>☕</div><h2>CAMPUS CAFÉ</h2><p>DIGITAL RECEIPT</p></div><div className="receipt-meta"><span>Transaction<br/><strong style={{color:'#342820'}}>{transaction.id}</strong></span><span style={{textAlign:'right'}}>Date<br/><strong style={{color:'#342820'}}>{transaction.date}</strong></span></div><div>{transaction.items.map((item) => <div className="receipt-row" key={item.product.id}><div><span className="receipt-item-name">{item.product.name}</span><span className="receipt-item-detail">{item.quantity} × {peso(item.product.price)}</span></div><span className="receipt-price">{peso(calculateSubtotal(item))}</span></div>)}</div><div className="receipt-total"><span>TOTAL</span><strong>{peso(transaction.total)}</strong></div><div className="receipt-payment"><div><span>Payment Method</span><strong>{transaction.method.toUpperCase()}</strong></div><div><span>Amount Paid</span><strong>{peso(transaction.amountPaid)}</strong></div><div><span>Change</span><strong>{peso(transaction.change)}</strong></div><span className="receipt-status">PAYMENT SUCCESSFUL</span></div><div className="receipt-thanks">Thank you for stopping by!<br/>Have a lovely day on campus ♡</div></section><div className="receipt-actions"><button className="primary-button" onClick={resetTransaction}>Start New Order <RotateCw size={18}/></button><button className="secondary-button" onClick={() => setScreen('success')}><ArrowLeft size={17}/> Back to payment details</button></div></div>}

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
