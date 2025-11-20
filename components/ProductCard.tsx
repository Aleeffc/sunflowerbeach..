
import React from 'react';
import { Product } from '../types';
import { Plus, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onProductClick }) => {
  return (
    <div 
      className="group relative flex flex-col"
      onClick={() => onProductClick(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-4 cursor-pointer rounded-lg shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradient on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

        {product.isNew && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold text-stone-800 shadow-sm">
            New
          </span>
        )}
        
        {/* Quick Actions - Appear on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="flex-1 bg-white/95 text-stone-900 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-sunflower-500 transition-colors shadow-lg backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Adicionar
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onProductClick(product); }}
              className="w-10 bg-stone-900/90 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-lg backdrop-blur-sm"
              aria-label="Ver detalhes"
            >
              <Eye size={16} />
            </button>
        </div>
      </div>
      
      {/* Info */}
      <div className="flex flex-col items-start px-1">
        <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 truncate w-full">
          {product.category}
        </p>
        <h3 className="font-serif text-lg text-stone-800 group-hover:text-sunflower-700 transition-colors truncate w-full leading-tight mb-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between w-full">
           <span className="text-sm font-bold text-stone-900">
             R$ {product.price.toFixed(2).replace('.', ',')}
           </span>
           {product.sizes && (
             <span className="text-[10px] text-stone-400">
               {product.sizes.length} tamanhos
             </span>
           )}
        </div>
      </div>
    </div>
  );
};
