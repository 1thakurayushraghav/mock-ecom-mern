import React from 'react';

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card">
      <div className="card-body">
        <h4>{product.name}</h4>
        <p>{product.desc || product.description || ''}</p>
        <div className="price">${Number(product.price).toFixed(2)}</div>
        <button onClick={onAdd}>Add to cart</button>
      </div>
    </div>
  );
}