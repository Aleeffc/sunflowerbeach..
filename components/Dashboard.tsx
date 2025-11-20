
import React, { useState, useMemo, useEffect } from 'react';
import { User, Product, Category, SiteSettings } from '../types';
import { Trash2, CheckCircle, XCircle, Plus, Package, Users, TrendingUp, UserCheck, ArrowUpRight, ArrowDownRight, ShoppingCart, DollarSign, BarChart3, Image, Palette, Save } from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  users: User[];
  products: Product[];
  siteSettings?: SiteSettings;
  onApproveVendor: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateSettings?: (newSettings: SiteSettings) => void;
}

// Mock Data Helpers
const AVAILABLE_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'];
const MATERIAL_TYPES = ['Lycra', 'Poliamida', 'Algodão', 'Linho', 'Viscose', 'Crochê', 'Veludo', 'Poliéster', 'Outro'];

// Generate realistic mock transactions linked to vendors
const generateMockTransactions = (products: Product[]) => {
  const transactions = [];
  const statuses = ['Aprovado', 'Pendente', 'Aprovado', 'Cancelado', 'Aprovado'];
  
  // Create some history
  for (let i = 0; i < 20; i++) {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if (!randomProduct) continue;

    transactions.push({
      id: `TRX-${9000 + i}`,
      productId: randomProduct.id,
      productName: randomProduct.name,
      vendorId: randomProduct.vendorId,
      amount: randomProduct.price,
      date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString('pt-BR'),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  return transactions.sort((a, b) => b.id.localeCompare(a.id)); // Newest first
};

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  users,
  products,
  siteSettings,
  onApproveVendor,
  onDeleteUser,
  onDeleteProduct,
  onAddProduct,
  onUpdateSettings
}) => {
  const isAdmin = currentUser.role === 'admin';
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'reports' | 'settings'>('reports');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (siteSettings) {
      setSettingsForm(siteSettings);
    }
  }, [siteSettings]);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCat, setNewProdCat] = useState<Category>(Category.BIKINIS);
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  
  // Enhanced Inputs
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [newProdColors, setNewProdColors] = useState('');
  const [materialType, setMaterialType] = useState(MATERIAL_TYPES[0]);
  const [materialDetail, setMaterialDetail] = useState('');

  // Derived Data
  const myProducts = isAdmin ? products : products.filter(p => p.vendorId === currentUser.id);
  const pendingVendors = users.filter(u => u.role === 'vendor' && !u.isApproved);
  const allUsers = users.filter(u => u.id !== currentUser.id); 
  
  // Mock Transactions (Stable for the session)
  const allTransactions = useMemo(() => generateMockTransactions(products), [products]);
  
  // Filter Transactions by Role
  const myTransactions = isAdmin 
    ? allTransactions 
    : allTransactions.filter(t => t.vendorId === currentUser.id);

  // Stats Calculation
  const totalSalesValue = myTransactions
    .filter(t => t.status === 'Aprovado')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalItemsSold = myTransactions.filter(t => t.status === 'Aprovado').length;

  // Mock chart data
  const weeklyPerformance = [
    { day: 'Seg', sales: 2400 },
    { day: 'Ter', sales: 1800 },
    { day: 'Qua', sales: 3200 },
    { day: 'Qui', sales: 2900 },
    { day: 'Sex', sales: 4500 },
    { day: 'Sáb', sales: 5800 },
    { day: 'Dom', sales: 5100 },
  ];
  const maxSales = Math.max(...weeklyPerformance.map(d => d.sales));

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(prev => prev.filter(s => s !== size));
    } else {
      setSelectedSizes(prev => [...prev, size]);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const colorsList = newProdColors.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const finalMaterial = `${materialType} ${materialDetail ? `- ${materialDetail}` : ''}`;

    onAddProduct({
      name: newProdName,
      price: parseFloat(newProdPrice),
      category: newProdCat,
      image: newProdImage || 'https://images.unsplash.com/photo-1596454010008-767791992761?q=80&w=1000',
      description: newProdDesc,
      vendorId: currentUser.id,
      isNew: true,
      sizes: selectedSizes.length > 0 ? selectedSizes : ['Único'],
      colors: colorsList.length > 0 ? colorsList : [],
      material: finalMaterial
    });

    // Reset form
    setIsAddingProduct(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setNewProdImage('');
    setSelectedSizes([]);
    setNewProdColors('');
    setMaterialDetail('');
    setMaterialType(MATERIAL_TYPES[0]);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsForm && onUpdateSettings) {
      onUpdateSettings(settingsForm);
      alert('Visual da loja atualizado com sucesso!');
    }
  };

  // Vendor Performance Report Generator
  const vendorReport = users
    .filter(u => u.role === 'vendor' && u.isApproved)
    .map(vendor => {
      const vendorProducts = products.filter(p => p.vendorId === vendor.id);
      const vendorTrx = allTransactions.filter(t => t.vendorId === vendor.id && t.status === 'Aprovado');
      const revenue = vendorTrx.reduce((acc, t) => acc + t.amount, 0);
      
      return {
        id: vendor.id,
        name: vendor.name,
        activeAds: vendorProducts.length,
        salesCount: vendorTrx.length,
        revenue: revenue
      };
    });

  return (
    <div className="min-h-screen bg-stone-50 pt-24 px-4 pb-12">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-serif text-4xl text-stone-900">
              {isAdmin ? 'Painel Administrativo' : 'Painel do Vendedor'}
            </h1>
            <p className="text-stone-500 mt-2">Gestão da loja Sunflower Beach - {currentUser.name}</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-lg shadow-sm border border-stone-200 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'reports' ? 'bg-sunflower-500 text-stone-900' : 'text-stone-500 hover:bg-stone-100'}`}
            >
              Relatórios
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'products' ? 'bg-sunflower-500 text-stone-900' : 'text-stone-500 hover:bg-stone-100'}`}
            >
              Anúncios
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-sunflower-500 text-stone-900' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                  Usuários
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'bg-sunflower-500 text-stone-900' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                  Personalizar
                </button>
              </>
            )}
          </div>
        </div>

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={60}/></div>
                 <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarSign size={20}/></div>
                   <span className="text-stone-500 text-xs font-bold uppercase">Faturamento</span>
                 </div>
                 <p className="font-serif text-3xl text-stone-900 font-bold">R$ {totalSalesValue.toLocaleString('pt-BR')}</p>
                 <div className="flex items-center mt-2 text-green-600 text-xs font-bold">
                   <ArrowUpRight size={14} /> <span>12% vs mês anterior</span>
                 </div>
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><ShoppingCart size={60}/></div>
                 <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShoppingCart size={20}/></div>
                   <span className="text-stone-500 text-xs font-bold uppercase">Vendas Realizadas</span>
                 </div>
                 <p className="font-serif text-3xl text-stone-900 font-bold">{totalItemsSold} peças</p>
                 <div className="flex items-center mt-2 text-green-600 text-xs font-bold">
                   <ArrowUpRight size={14} /> <span>8% vs mês anterior</span>
                 </div>
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><Package size={60}/></div>
                 <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Package size={20}/></div>
                   <span className="text-stone-500 text-xs font-bold uppercase">Anúncios Ativos</span>
                 </div>
                 <p className="font-serif text-3xl text-stone-900 font-bold">{myProducts.length}</p>
                 <div className="flex items-center mt-2 text-stone-400 text-xs font-bold">
                   <span>Estável</span>
                 </div>
               </div>
               
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle size={60}/></div>
                 <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CheckCircle size={20}/></div>
                   <span className="text-stone-500 text-xs font-bold uppercase">Taxa de Aprovação</span>
                 </div>
                 <p className="font-serif text-3xl text-stone-900 font-bold">98%</p>
                 <div className="flex items-center mt-2 text-green-500 text-xs font-bold">
                   <ArrowUpRight size={14} /> <span>1.2% vs mês anterior</span>
                 </div>
               </div>
            </div>

            {/* ADMIN ONLY: VENDOR PERFORMANCE TABLE */}
            {isAdmin && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl text-stone-800 flex items-center gap-2">
                    <Users className="text-sunflower-600" size={20}/> Desempenho de Vendedores
                  </h3>
                  <button className="text-xs text-stone-500 hover:text-sunflower-600 underline">Exportar PDF</button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="p-3 text-xs font-bold uppercase tracking-wider text-stone-500">Vendedor</th>
                        <th className="p-3 text-xs font-bold uppercase tracking-wider text-stone-500 text-center">Anúncios Ativos</th>
                        <th className="p-3 text-xs font-bold uppercase tracking-wider text-stone-500 text-center">Vendas (Qtd)</th>
                        <th className="p-3 text-xs font-bold uppercase tracking-wider text-stone-500 text-right">Faturamento Total</th>
                        <th className="p-3 text-xs font-bold uppercase tracking-wider text-stone-500 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {vendorReport.map(v => (
                        <tr key={v.id} className="hover:bg-stone-50">
                          <td className="p-3 font-bold text-stone-800">{v.name}</td>
                          <td className="p-3 text-center text-stone-600">{v.activeAds}</td>
                          <td className="p-3 text-center text-stone-600">{v.salesCount}</td>
                          <td className="p-3 text-right font-bold text-green-600">R$ {v.revenue.toFixed(2)}</td>
                          <td className="p-3 text-right">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-[10px] font-bold uppercase">Ativo</span>
                          </td>
                        </tr>
                      ))}
                      {vendorReport.length === 0 && (
                         <tr>
                           <td colSpan={5} className="p-8 text-center text-stone-400">Nenhum vendedor ativo para exibir.</td>
                         </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h3 className="font-serif text-xl text-stone-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="text-sunflower-600" size={20}/> Vendas da Semana
                </h3>
                <div className="flex items-end justify-between h-64 gap-2">
                  {weeklyPerformance.map((data, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 group">
                       <div className="relative w-full flex justify-center">
                         <div 
                           className="w-full max-w-[40px] bg-sunflower-200 rounded-t-md group-hover:bg-sunflower-500 transition-all duration-300 relative"
                           style={{ height: `${(data.sales / maxSales) * 200}px` }}
                         >
                           <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                             R${data.sales}
                           </div>
                         </div>
                       </div>
                       <span className="text-xs text-stone-500 mt-3 font-medium">{data.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent List */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                 <h3 className="font-serif text-xl text-stone-800 mb-6">Transações Recentes</h3>
                 <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                   {myTransactions.length > 0 ? myTransactions.map((trx, idx) => {
                     // Find vendor name for admin view
                     const vendorName = isAdmin ? users.find(u => u.id === trx.vendorId)?.name : null;
                     
                     return (
                       <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
                          <div>
                            <p className="text-sm font-bold text-stone-800">{trx.productName}</p>
                            <p className="text-[10px] text-stone-500">{trx.id} • {trx.date}</p>
                            {isAdmin && <p className="text-[9px] text-sunflower-600 font-bold mt-0.5">Vend: {vendorName || 'Desconhecido'}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-stone-900">R$ {trx.amount.toFixed(2)}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trx.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {trx.status}
                            </span>
                          </div>
                       </div>
                     );
                   }) : (
                     <p className="text-center text-stone-400 py-8 text-sm">Nenhuma transação registrada.</p>
                   )}
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB (ADMIN ONLY) */}
        {activeTab === 'settings' && isAdmin && settingsForm && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="font-serif text-2xl text-stone-800 mb-6 flex items-center gap-2">
              <Palette className="text-sunflower-600" /> Personalização da Loja
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
               <p className="text-sm text-stone-500 mb-6">
                 Aqui você pode alterar as imagens principais e textos promocionais do site.
               </p>

               <form onSubmit={handleSaveSettings} className="space-y-8">
                 {/* Hero Section */}
                 <div className="space-y-4 p-4 bg-stone-50 rounded-lg border border-stone-100">
                    <h3 className="text-sm font-bold uppercase text-stone-700 flex items-center gap-2">
                      <Image size={16} /> Banner Principal (Topo)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-xs font-bold uppercase text-stone-400 mb-1 block">URL da Imagem de Fundo</label>
                        <input 
                          className="w-full p-3 border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-sunflower-400 outline-none"
                          value={settingsForm.heroImage}
                          onChange={(e) => setSettingsForm({...settingsForm, heroImage: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-stone-400 mb-1 block">Título Principal</label>
                        <input 
                          className="w-full p-3 border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-sunflower-400 outline-none"
                          value={settingsForm.heroTitle}
                          onChange={(e) => setSettingsForm({...settingsForm, heroTitle: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-stone-400 mb-1 block">Subtítulo</label>
                        <input 
                          className="w-full p-3 border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-sunflower-400 outline-none"
                          value={settingsForm.heroSubtitle}
                          onChange={(e) => setSettingsForm({...settingsForm, heroSubtitle: e.target.value})}
                        />
                      </div>
                    </div>
                    {/* Preview Mini */}
                    <div className="mt-2 h-24 w-full rounded-lg overflow-hidden relative">
                      <img src={settingsForm.heroImage} alt="Preview" className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-stone-900 font-bold text-xs bg-white/80 px-2 py-1 rounded">Preview do Fundo</span>
                      </div>
                    </div>
                 </div>

                 {/* Bottom Banner Section */}
                 <div className="space-y-4 p-4 bg-stone-50 rounded-lg border border-stone-100">
                    <h3 className="text-sm font-bold uppercase text-stone-700 flex items-center gap-2">
                      <Image size={16} /> Banner Promocional (Rodapé)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-xs font-bold uppercase text-stone-400 mb-1 block">URL da Imagem de Fundo</label>
                        <input 
                          className="w-full p-3 border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-sunflower-400 outline-none"
                          value={settingsForm.bottomBannerImage}
                          onChange={(e) => setSettingsForm({...settingsForm, bottomBannerImage: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-stone-400 mb-1 block">Frase de Destaque</label>
                        <input 
                          className="w-full p-3 border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-sunflower-400 outline-none"
                          value={settingsForm.bottomBannerTitle}
                          onChange={(e) => setSettingsForm({...settingsForm, bottomBannerTitle: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-stone-400 mb-1 block">Texto Menor</label>
                        <input 
                          className="w-full p-3 border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-sunflower-400 outline-none"
                          value={settingsForm.bottomBannerSubtitle}
                          onChange={(e) => setSettingsForm({...settingsForm, bottomBannerSubtitle: e.target.value})}
                        />
                      </div>
                    </div>
                    {/* Preview Mini */}
                    <div className="mt-2 h-24 w-full rounded-lg overflow-hidden relative">
                      <img src={settingsForm.bottomBannerImage} alt="Preview" className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-stone-900 font-bold text-xs bg-white/80 px-2 py-1 rounded">Preview do Fundo</span>
                      </div>
                    </div>
                 </div>
                 
                 <div className="flex justify-end">
                   <button type="submit" className="flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-sunflower-500 hover:text-stone-900 transition-all shadow-lg">
                     <Save size={18} /> Salvar Alterações
                   </button>
                 </div>
               </form>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-stone-800">Gerenciar Anúncios</h2>
              <button 
                onClick={() => setIsAddingProduct(true)}
                className="flex items-center gap-2 bg-sunflower-500 text-stone-900 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-sunflower-400 transition-colors shadow-md"
              >
                <Plus size={16} /> Novo Anúncio
              </button>
            </div>

            {isAddingProduct && (
              <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 border border-sunflower-200 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl font-serif">Adicionar Novo Produto</h3>
                  <button onClick={() => setIsAddingProduct(false)}><XCircle className="text-stone-400 hover:text-red-500 transition-colors" size={24}/></button>
                </div>
                <form onSubmit={handleAddProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-stone-500">Nome da Peça</label>
                    <input required placeholder="Ex: Biquíni Salvador" className="w-full p-3 border border-stone-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-sunflower-400 outline-none" value={newProdName} onChange={e => setNewProdName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-stone-500">Preço (R$)</label>
                    <input required placeholder="0.00" type="number" step="0.01" className="w-full p-3 border border-stone-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-sunflower-400 outline-none" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-stone-500">Categoria</label>
                    <select className="w-full p-3 border border-stone-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-sunflower-400 outline-none" value={newProdCat} onChange={e => setNewProdCat(e.target.value as Category)}>
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  
                  {/* DUAL MATERIAL INPUTS */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-stone-500">Tipo de Material</label>
                    <div className="flex gap-2">
                      <select 
                        className="w-1/2 p-3 border border-stone-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-sunflower-400 outline-none"
                        value={materialType}
                        onChange={e => setMaterialType(e.target.value)}
                      >
                        {MATERIAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <input 
                        placeholder="Detalhes (Ex: 90% Poliamida)" 
                        className="w-1/2 p-3 border border-stone-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-sunflower-400 outline-none" 
                        value={materialDetail} 
                        onChange={e => setMaterialDetail(e.target.value)} 
                      />
                    </div>
                  </div>

                   {/* INTERACTIVE SIZE SELECTOR */}
                   <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-stone-500">Tamanhos Disponíveis</label>
                    <div className="flex flex-wrap gap-2 p-2 bg-stone-50 rounded-lg border border-stone-200">
                      {AVAILABLE_SIZES.map(size => {
                        const isSelected = selectedSizes.includes(size);
                        return (
                          <button
                            type="button"
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`w-10 h-10 rounded-full text-xs font-bold transition-all flex items-center justify-center border-2 ${
                              isSelected 
                                ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-105' 
                                : 'bg-white text-stone-400 border-stone-200 hover:border-sunflower-400 hover:text-stone-600'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-stone-400 italic">Clique para marcar como disponível. Não selecionados aparecerão como esgotados.</p>
                  </div>

                   <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-stone-500">Cores Disponíveis</label>
                    <input placeholder="Ex: Azul, Vermelho, Estampado (Separar por vírgula)" className="w-full p-3 border border-stone-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-sunflower-400 outline-none" value={newProdColors} onChange={e => setNewProdColors(e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase text-stone-500">URL da Imagem</label>
                    <input placeholder="https://..." className="w-full p-3 border border-stone-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-sunflower-400 outline-none" value={newProdImage} onChange={e => setNewProdImage(e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase text-stone-500">Descrição Detalhada</label>
                    <textarea required placeholder="Detalhes do produto..." className="w-full p-3 border border-stone-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-sunflower-400 outline-none" rows={3} value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} />
                  </div>
                  <button type="submit" className="md:col-span-2 bg-stone-900 text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-sunflower-500 hover:text-stone-900 transition-all">Salvar Produto</button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-500">Produto</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-500">Categoria</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-500">Preço</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-500 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {myProducts.map(product => (
                    <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-200">
                           <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-medium text-stone-800 block">{product.name}</span>
                          <span className="text-[10px] text-stone-400">{product.material}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-stone-600">{product.category}</td>
                      <td className="p-4 text-sm font-bold text-stone-800">R$ {product.price.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          title="Excluir Anúncio"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {myProducts.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center">
                  <Package size={48} className="text-stone-300 mb-4"/>
                  <p className="text-stone-400">Nenhum anúncio encontrado.</p>
                  <button onClick={() => setIsAddingProduct(true)} className="mt-4 text-sunflower-600 font-bold text-sm hover:underline">Criar primeiro anúncio</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* USERS TAB (ADMIN ONLY) */}
        {activeTab === 'users' && isAdmin && (
          <div className="grid grid-cols-1 gap-12">
            
            {/* Pending Requests */}
            <div>
              <h2 className="font-serif text-2xl text-stone-800 mb-6 flex items-center gap-2">
                <UserCheck className="text-sunflower-600"/> Solicitações de Vendedores
              </h2>
              {pendingVendors.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingVendors.map(vendor => (
                      <div key={vendor.id} className="bg-white p-6 rounded-xl shadow-sm border border-sunflower-200 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-stone-900 text-lg">{vendor.name}</h3>
                          <p className="text-xs text-stone-500 uppercase tracking-wider">ID: {vendor.id}</p>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => onApproveVendor(vendor.id)}
                            className="p-3 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                            title="Aprovar"
                          >
                            <CheckCircle size={24} />
                          </button>
                          <button 
                            onClick={() => onDeleteUser(vendor.id)}
                            className="p-3 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                            title="Recusar"
                          >
                            <XCircle size={24} />
                          </button>
                        </div>
                      </div>
                    ))}
                 </div>
              ) : (
                <div className="text-stone-500 text-sm bg-white p-6 rounded-xl border border-dashed border-stone-300 flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Nenhuma solicitação pendente.
                </div>
              )}
            </div>

            {/* All Users List */}
            <div>
              <h2 className="font-serif text-2xl text-stone-800 mb-6">Gerenciar Usuários</h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-500">Nome</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-500">Cargo</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-500">Status</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-500 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {allUsers.map(u => (
                      <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-4 font-medium text-stone-800 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">
                            {u.name.charAt(0)}
                          </div>
                          {u.name}
                        </td>
                        <td className="p-4 text-sm text-stone-600 capitalize">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'vendor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {u.role === 'client' ? 'Cliente' : u.role === 'vendor' ? 'Vendedor' : 'Admin'}
                          </span>
                        </td>
                        <td className="p-4 text-sm">
                           {u.role === 'vendor' && !u.isApproved ? (
                             <span className="text-orange-600 font-bold text-xs flex items-center gap-1">
                               <span className="w-2 h-2 rounded-full bg-orange-500"></span> Pendente
                             </span>
                           ) : (
                             <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                               <span className="w-2 h-2 rounded-full bg-green-500"></span> Ativo
                             </span>
                           )}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => onDeleteUser(u.id)}
                            className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            title="Remover Usuário"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
