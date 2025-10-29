import React from 'react';
import ProductCard from './ProductCard';

export default function ProductsGrid({ products = [], onAdd }) {
  if (!products || products.length === 0) return <div>No products available</div>;

  return (
    <div className="products-grid">
      {products.map(p => (
        <ProductCard key={p._id} product={p} onAdd={() => onAdd(p._id)} />
      ))}
    </div>
  );
}
