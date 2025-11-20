
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, User, LayoutDashboard, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { Category, User as UserType } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onCategorySelect: (category: Category | 'all') => void;
  currentUser: UserType | null;
  onLogout: () => void;
  onOpenDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  onOpenCart, 
  onCategorySelect, 
  currentUser,
  onLogout,
  onOpenDashboard
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'vendor';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Coleção', value: 'all' },
    { label: 'Biquínis', value: Category.BIKINIS },
    { label: 'Maiôs', value: Category.ONE_PIECE },
    { label: 'Saídas', value: Category.COVER_UPS },
    { label: 'Acessórios', value: Category.ACCESSORIES },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-stone-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Desktop Nav - Left */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.slice(0, 3).map((link) => (
            <button 
              key={link.label}
              onClick={() => onCategorySelect(link.value as any)}
              className="text-stone-600 hover:text-sunflower-800 uppercase tracking-widest text-xs font-medium transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Logo Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer" onClick={() => onCategorySelect('all')}>
           {scrolled ? (
             <span className="font-serif text-xl font-bold tracking-widest text-stone-800">SUNFLOWER BEACH</span>
           ) : (
             <Logo className="scale-75 md:scale-100 origin-center" />
           )}
        </div>

        {/* Desktop Nav - Right & Icons */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-8 mr-4">
            {navLinks.slice(3).map((link) => (
              <button 
                key={link.label}
                onClick={() => onCategorySelect(link.value as any)}
                className="text-stone-600 hover:text-sunflower-800 uppercase tracking-widest text-xs font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4 text-stone-800">
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:text-sunflower-600 transition-colors"
              >
                <User size={20} />
                <span className="text-xs font-medium uppercase hidden lg:block">
                  {currentUser?.name.split(' ')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-stone-100 flex flex-col z-50">
                  {isStaff && (
                    <button 
                      onClick={() => { onOpenDashboard(); setUserMenuOpen(false); }}
                      className="px-4 py-2 text-left text-sm text-stone-600 hover:bg-stone-50 hover:text-sunflower-600 flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} /> Painel
                    </button>
                  )}
                  <button 
                    onClick={() => { onLogout(); setUserMenuOpen(false); }}
                    className="px-4 py-2 text-left text-sm text-stone-600 hover:bg-stone-50 hover:text-red-500 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Sair
                  </button>
                </div>
              )}
            </div>

            <button className="hover:text-sunflower-600 transition-colors">
              <Search size={20} />
            </button>

            <button 
              className="relative hover:text-sunflower-600 transition-colors"
              onClick={onOpenCart}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-sunflower-500 text-stone-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden flex flex-col p-6 space-y-4 h-screen">
          <div className="pb-4 border-b border-stone-100 mb-2">
             <p className="text-xs font-bold text-stone-400 uppercase mb-2">Olá, {currentUser?.name}</p>
             {isStaff && (
               <button onClick={() => { onOpenDashboard(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-sunflower-600 font-bold text-sm mb-3">
                 <LayoutDashboard size={16} /> Ir para Painel
               </button>
             )}
             <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-stone-500 text-sm">
               <LogOut size={16} /> Sair
             </button>
          </div>

          {navLinks.map((link) => (
            <button 
              key={link.label}
              onClick={() => {
                onCategorySelect(link.value as any);
                setMobileMenuOpen(false);
              }}
              className="text-left text-stone-600 uppercase tracking-widest text-sm font-medium py-2 border-b border-stone-100"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
