import React, { useState } from 'react';

export default function CheckoutModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Checkout</h3>
        <label>
          Name
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => onSubmit(name, email)}>Submit</button>
          <button onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
