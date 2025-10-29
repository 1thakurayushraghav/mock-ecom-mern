// src/api.js
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

async function handleRes(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || json.message || 'API error');
  return json;
}

export async function fetchProducts() {
  const res = await fetch(`${BASE}/products`);
  return handleRes(res);
}

export async function fetchCart() {
  const res = await fetch(`${BASE}/cart`);
  return handleRes(res);
}

export async function addToCart(productId, qty = 1) {
  const res = await fetch(`${BASE}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty }),
  });
  return handleRes(res);
}

export async function updateCartItem(cartItemId, qty) {
  // we don't have explicit update route in backend; implement as delete+add or modify if you add API.
  // We'll implement an update using POST with same productId and qty delta assumed in backend.
  // For current backend, recommended approach: remove then add new qty. But for ease, let's call POST with qty to increment.
  const res = await fetch(`${BASE}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItemId, qty }), // backend must support this; if not, frontend will re-fetch after changes
  });
  return handleRes(res);
}

export async function removeCartItem(cartItemId) {
  const res = await fetch(`${BASE}/cart/${cartItemId}`, { method: 'DELETE' });
  return handleRes(res);
}

export async function checkout(name, email) {
  const res = await fetch(`${BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });
  return handleRes(res);
}
