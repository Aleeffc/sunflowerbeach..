
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { StylistChat } from './components/StylistChat';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { ProductModal } from './components/ProductModal';
import { PRODUCTS, INITIAL_USERS, DEFAULT_SITE_SETTINGS } from './constants';
import { Product, CartItem, Category, User, SiteSettings } from './types';

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  
  // App State
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | 'all'>('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  
  // Site Customization State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  // View State
  const [view, setView] = useState<'store' | 'dashboard'>('store');

  useEffect(() => {
    if (currentCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === currentCategory));
    }
  }, [currentCategory, products]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Product Modal Handlers
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Wait for animation
  };

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('store');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]);
    setView('store');
  };

  const handleVendorRequest = (name: string, pass: string) => {
    const newUser: User = {
      id: `vendor-${Date.now()}`,
      name,
      password: pass,
      role: 'vendor',
      isApproved: false
    };
    setAllUsers([...allUsers, newUser]);
  };

  // Dashboard Handlers
  const handleApproveVendor = (userId: string) => {
    setAllUsers(users => users.map(u => u.id === userId ? { ...u, isApproved: true } : u));
  };

  const handleDeleteUser = (userId: string) => {
    setAllUsers(users => users.filter(u => u.id !== userId));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [product, ...prev]);
  };

  // Render Logic
  if (!currentUser) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        users={allUsers} 
        onVendorRequest={handleVendorRequest} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
        onOpenCart={() => setCartOpen(true)}
        onCategorySelect={(cat) => { setCurrentCategory(cat); setView('store'); }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenDashboard={() => setView('dashboard')}
      />
      
      {view === 'dashboard' && (currentUser.role === 'admin' || currentUser.role === 'vendor') ? (
        <Dashboard 
          currentUser={currentUser}
          users={allUsers}
          products={products}
          siteSettings={siteSettings}
          onApproveVendor={handleApproveVendor}
          onDeleteUser={handleDeleteUser}
          onDeleteProduct={handleDeleteProduct}
          onAddProduct={handleAddProduct}
          onUpdateSettings={setSiteSettings}
        />
      ) : (
        <main className="flex-grow">
          <Hero 
            image={siteSettings.heroImage}
            title={siteSettings.heroTitle}
            subtitle={siteSettings.heroSubtitle}
          />
          
          <ProductGrid 
            products={filteredProducts} 
            onAddToCart={addToCart}
            onProductClick={handleProductClick}
          />
          
          {/* Banner Secondary - Customizable */}
          <div className="w-full h-96 bg-fixed bg-cover bg-center flex items-center justify-center relative"
               style={{ backgroundImage: `url("${siteSettings.bottomBannerImage}")` }}
          >
            <div className="absolute inset-0 bg-bahia-blue/30 mix-blend-multiply"></div>
            <div className="relative z-10 text-center px-4">
              <h3 className="font-serif text-4xl md:text-5xl text-white mb-4 drop-shadow-lg italic">
                {siteSettings.bottomBannerTitle}
              </h3>
              <p className="text-white uppercase tracking-widest text-sm font-medium drop-shadow">
                {siteSettings.bottomBannerSubtitle}
              </p>
            </div>
          </div>
        </main>
      )}

      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        items={cartItems}
        onRemove={removeFromCart}
      />

      <ProductModal 
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        product={selectedProduct}
        onAddToCart={addToCart}
      />

      <StylistChat />
      
      {view === 'store' && <Footer />}
    </div>
  );
};

export default App;
