import React from 'react';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            {/* Removed brightness/invert filters to show the color image logo */}
            <div className="mb-4 [&_span]:text-stone-200"> 
              <Logo />
            </div>
            <p className="text-stone-400 text-sm text-center md:text-left leading-relaxed">
              Nascida do sol e inspirada pelo mar. Trazendo o espírito do verão eterno para o seu guarda-roupa com elegância e sofisticação.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-sunflower-500">Shop</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Biquínis</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Maiôs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Saídas de Praia</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Acessórios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New In</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-sunflower-500">Institucional</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nossas Lojas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustentabilidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-sunflower-500">Newsletter</h4>
            <p className="text-sm text-stone-400 mb-4">Receba novidades exclusivas e 10% OFF na primeira compra.</p>
            <div className="flex border-b border-stone-700 pb-2">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="bg-transparent w-full outline-none text-sm text-white placeholder-stone-600"
              />
              <button className="text-stone-400 hover:text-sunflower-500 uppercase text-xs font-bold">
                Assinar
              </button>
            </div>
            <div className="flex gap-4 mt-8">
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>&copy; 2025 Sunflower Beach. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Desenvolvido com Gemini API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};