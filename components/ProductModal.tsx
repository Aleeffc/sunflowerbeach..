
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Heart, Share2, Ruler, Info } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [animate, setAnimate] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimate(true), 50);
      if (product?.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    } else {
      setAnimate(false);
      setShowSizeGuide(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div 
        className={`relative bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-500 transform ${animate ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white text-stone-800 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-1/2 h-64 md:h-[550px] relative bg-stone-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          {product.isNew && (
            <span className="absolute top-6 left-6 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-stone-800 shadow-sm">
              Lançamento
            </span>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto max-h-[60vh] md:max-h-[550px]">
          <div className="mb-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{product.category}</span>
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4 leading-tight">
            {product.name}
          </h2>
          
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-stone-100">
            <span className="text-2xl font-serif text-stone-900 font-bold">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-xs text-green-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Disponível em estoque
            </span>
          </div>

          <p className="text-stone-600 text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes && (
            <div className="mb-6 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800">Tamanho</span>
                <button 
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="flex items-center text-[10px] text-stone-500 underline hover:text-sunflower-600"
                >
                  <Ruler size={12} className="mr-1" /> Guia de medidas
                </button>
              </div>
              
              {/* Size Guide Popup */}
              {showSizeGuide && (
                <div className="absolute right-0 bottom-full mb-2 bg-white shadow-xl border border-stone-100 rounded-lg p-4 z-20 w-64 animate-fade-in-up">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold uppercase text-stone-800">Tabela de Medidas (cm)</h4>
                    <button onClick={() => setShowSizeGuide(false)} className="text-stone-400 hover:text-stone-600">
                      <X size={14}/>
                    </button>
                  </div>
                  <table className="w-full text-[10px] text-stone-600 text-center">
                    <thead className="bg-stone-50 text-stone-800 font-bold">
                      <tr>
                        <th className="py-1 rounded-tl-md">Tam</th>
                        <th className="py-1">Busto</th>
                        <th className="py-1">Cintura</th>
                        <th className="py-1 rounded-tr-md">Quadril</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr><td className="py-1 font-bold">P</td><td>80-84</td><td>60-64</td><td>88-92</td></tr>
                      <tr><td className="py-1 font-bold">M</td><td>85-89</td><td>65-69</td><td>93-97</td></tr>
                      <tr><td className="py-1 font-bold">G</td><td>90-94</td><td>70-74</td><td>98-102</td></tr>
                      <tr><td className="py-1 font-bold">GG</td><td>95-99</td><td>75-79</td><td>103-107</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                      selectedSize === size 
                        ? 'bg-stone-900 text-white border-stone-900' 
                        : 'bg-white text-stone-600 border-stone-200 hover:border-sunflower-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Material & Colors Info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {product.material && (
              <div className="bg-stone-50 p-3 rounded-lg">
                <span className="block text-[10px] uppercase text-stone-400 mb-1">Material</span>
                <span className="text-xs font-bold text-stone-700">{product.material}</span>
              </div>
            )}
            {product.colors && (
              <div className="bg-stone-50 p-3 rounded-lg">
                <span className="block text-[10px] uppercase text-stone-400 mb-1">Cores</span>
                <span className="text-xs font-bold text-stone-700">{product.colors.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-3">
            <button 
              onClick={() => { onAddToCart(product); onClose(); }}
              className="w-full bg-sunflower-500 text-stone-900 py-4 uppercase tracking-widest text-xs font-bold hover:bg-sunflower-400 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <ShoppingBag size={18} /> Adicionar à Sacola
            </button>
            
            <div className="flex gap-3">
              <button className="flex-1 border border-stone-200 py-3 text-stone-600 uppercase tracking-widest text-[10px] font-bold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 rounded-sm">
                <Heart size={16} /> Salvar
              </button>
              <button className="flex-1 border border-stone-200 py-3 text-stone-600 uppercase tracking-widest text-[10px] font-bold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 rounded-sm">
                <Share2 size={16} /> Compartilhar
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
