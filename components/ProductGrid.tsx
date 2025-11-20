
import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, onProductClick }) => {
  return (
    <section className="py-16 px-4 md:px-6 bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12">
          <span className="text-sunflower-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">Coleção 2025</span>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6 text-center">
            Nossos Favoritos
          </h2>
          <div className="w-16 h-0.5 bg-sunflower-500 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onProductClick={onProductClick} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
