import React, { useState } from 'react';

export default function CartView({ cart = { items: [] }, onRemove, onUpdateQty, onCheckout }) {
  const [editing, setEditing] = useState({}); // { [itemId]: newQty }

  if (!cart.items || cart.items.length === 0) return <div>Your cart is empty</div>;

  return (
    <div>
      {cart.items.map(item => {
        const curQty = editing[item._id] ?? item.qty;
        return (
          <div className="cart-item" key={item._id}>
            <div className="cart-left">
              <div className="cart-name">{item.name}</div>
              <div className="cart-price">${(item.price * item.qty).toFixed(2)}</div>
            </div>

            <div className="cart-controls">
              <input
                type="number"
                min="0"
                value={curQty}
                onChange={(e) => setEditing(prev => ({ ...prev, [item._id]: Number(e.target.value) }))}
                style={{ width: 60 }}
              />
              <button onClick={() => {
                const newQty = Number(editing[item._id] ?? item.qty);
                onUpdateQty(item, newQty);
                setEditing(prev => ({ ...prev, [item._id]: undefined }));
              }}>
                Update
              </button>
              <button onClick={() => onRemove(item._id)}>Remove</button>
            </div>
          </div>
        );
      })}

      <div className="cart-total">
        <strong>Total: </strong>${Number(cart.total || 0).toFixed(2)}
      </div>

      <button onClick={onCheckout}>Checkout</button>
    </div>
  );
}