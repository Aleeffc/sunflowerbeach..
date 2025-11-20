import React from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove }) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    const phoneNumber = '5571991370781';
    
    let message = `*Olá! Gostaria de finalizar meu pedido na Sunflower Beach.*\n\n`;
    message += `*Itens do Pedido:*\n`;
    
    items.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Total: R$ ${total.toFixed(2)}*`;
    message += `\n\nAguardo instruções para pagamento e entrega! 🌻`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-stone-100 bg-sunflower-100/30">
          <h2 className="font-serif text-2xl text-stone-800">Sua Sacola</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400">
              <p>Sua sacola está vazia.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-stone-100 rounded-md">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-serif text-stone-800 leading-tight text-lg">{item.name}</h3>
                    <p className="text-xs text-stone-500 mt-1">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-stone-900">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-stone-500">Qtd: {item.quantity}</span>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-stone-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-stone-100 bg-stone-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-stone-600 uppercase text-sm tracking-wider">Total</span>
            <span className="font-serif text-2xl text-stone-900 font-bold">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <p className="text-[10px] text-stone-500 mb-4 text-center">
            Ao finalizar, você será redirecionado para o nosso WhatsApp.
          </p>
          <button 
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-green-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg"
            disabled={items.length === 0}
          >
            Finalizar no WhatsApp <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
};