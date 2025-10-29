// src/App.jsx
import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchCart, addToCart, removeCartItem, checkout } from '../api';
import ProductsGrid from './components/ProductsGrid';
import CartView from './components/CartView';
import CheckoutModal from './components/CheckoutModal';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  async function loadProducts() {
    try {
      const p = await fetchProducts();
      setProducts(p);
    } catch (err) {
      console.error('Products error', err);
    }
  }

  async function loadCart() {
    try {
      const c = await fetchCart();
      setCart(c);
    } catch (err) {
      console.error('Cart error', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(productId) {
    try {
      await addToCart(productId, 1);
      await loadCart();
    } catch (err) {
      alert(err.message || 'Add failed');
    }
  }

  // remove by cart item _id
  async function handleRemove(cartItemId) {
    try {
      await removeCartItem(cartItemId);
      await loadCart();
    } catch (err) {
      alert(err.message || 'Remove failed');
    }
  }

  // update qty: simple approach — remove and re-add with new qty
  async function handleUpdateQty(cartItem, newQty) {
    try {
      // remove existing item
      await removeCartItem(cartItem._id);
      if (newQty > 0) {
        // find product id from products list
        const prod = products.find(p => p._id === cartItem.productId || p.name === cartItem.name);
        const pid = prod?._id;
        if (!pid) {
          // if productId is not available on cartItem (backend returned minimal data), attempt to add by name lookup
          alert('Unable to find product ID to update quantity');
          await loadCart();
          return;
        }
        await addToCart(pid, newQty);
      }
      await loadCart();
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  }

  async function handleCheckout(name, email) {
    try {
      const res = await checkout(name, email);
      setReceipt(res.receipt || res);
      setShowCheckout(false);
      await loadCart();
    } catch (err) {
      alert(err.message || 'Checkout failed');
    }
  }

  return (
    <div className="container">
      <header>
        <h1>E-Com Cart</h1>
      </header>

      <main>
        <section>
          <h2>Products</h2>
          <ProductsGrid products={products} onAdd={handleAdd} />
        </section>

        <aside>
          <h2>Cart</h2>
          {loading ? <div>Loading cart…</div> :
            <CartView cart={cart} onRemove={handleRemove} onUpdateQty={handleUpdateQty} onCheckout={() => setShowCheckout(true)} />
          }
        </aside>

        {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} onSubmit={handleCheckout} />}
      </main>

      {receipt && (
        <section className="receipt">
          <h3>Receipt</h3>
          <div>Order ID: {receipt.id}</div>
          <div>Total: ${Number(receipt.total).toFixed(2)}</div>
          <div>Timestamp: {receipt.timestamp}</div>
          <button onClick={() => setReceipt(null)}>Close</button>
        </section>
      )}
    </div>
  );
}
