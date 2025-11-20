import React, { useState } from 'react';
import { Logo } from './Logo';
import { User } from '../types';
import { LoadingSunflower } from './LoadingSunflower';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onVendorRequest: (name: string, pass: string) => void;
  users: User[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onVendorRequest, users }) => {
  const [isClient, setIsClient] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffPass, setStaffPass] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const simulateLoading = (callback: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      callback();
    }, 1500); // 1.5s simulated loading
  };

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    simulateLoading(() => {
      onLogin({
        id: `client-${Date.now()}`,
        name: clientName,
        phone: clientPhone,
        role: 'client'
      });
    });
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    simulateLoading(() => {
      const user = users.find(u => u.name === staffName && u.password === staffPass);

      if (user) {
        if (user.role === 'vendor' && !user.isApproved) {
          setError('Sua conta de vendedor ainda está pendente de aprovação pelo Administrador.');
          return;
        }
        onLogin(user);
      } else {
        setError('Credenciais inválidas. Verifique nome e senha.');
      }
    });
  };

  const handleVendorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!staffName || !staffPass) {
      setError('Preencha nome e senha para solicitar cadastro.');
      return;
    }
    
    simulateLoading(() => {
      // Check if user exists
      if (users.some(u => u.name === staffName)) {
        setError('Nome de usuário já existe.');
        return;
      }

      onVendorRequest(staffName, staffPass);
      setSuccessMsg('Solicitação enviada com sucesso! Aguarde aprovação do Administrador.');
      setIsRegistering(false);
      setStaffName('');
      setStaffPass('');
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <LoadingSunflower text="Entrando na Bahia..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF9] p-4 relative overflow-hidden">
      {/* Background Abstract */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sunflower-300 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-ocean-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md z-10 border border-white/50 backdrop-blur-sm">
        <div className="mb-8 transform scale-125 origin-top">
          <Logo />
        </div>

        <div className="flex mb-8 bg-stone-100 p-1 rounded-full">
          <button
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${isClient ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
            onClick={() => { setIsClient(true); setError(''); setSuccessMsg(''); setIsRegistering(false); }}
          >
            Cliente
          </button>
          <button
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${!isClient ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
            onClick={() => { setIsClient(false); setError(''); setSuccessMsg(''); }}
          >
            Staff
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs text-center rounded-lg">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-600 text-xs text-center rounded-lg">
            {successMsg}
          </div>
        )}

        {isClient ? (
          <form onSubmit={handleClientLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Seu Nome</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunflower-400"
                placeholder="Maria Silva"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Telefone</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunflower-400"
                placeholder="(00) 00000-0000"
              />
            </div>
            <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-lg uppercase font-bold tracking-widest text-xs hover:bg-sunflower-500 hover:text-stone-900 transition-all duration-300 mt-4">
              Entrar no Paraíso
            </button>
          </form>
        ) : (
          <form onSubmit={isRegistering ? handleVendorRegister : handleStaffLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">
                {isRegistering ? 'Nome de Usuário Desejado' : 'Usuário'}
              </label>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunflower-400"
                placeholder="Nome"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Senha</label>
              <input
                type="password"
                value={staffPass}
                onChange={(e) => setStaffPass(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunflower-400"
                placeholder="••••••"
              />
            </div>
            <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-lg uppercase font-bold tracking-widest text-xs hover:bg-sunflower-500 hover:text-stone-900 transition-all duration-300 mt-4">
              {isRegistering ? 'Solicitar Cadastro' : 'Acessar Painel'}
            </button>
            
            <div className="text-center mt-4">
               <button 
                 type="button"
                 onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); }}
                 className="text-xs text-stone-500 hover:text-sunflower-600 underline underline-offset-4"
               >
                 {isRegistering ? 'Já tenho conta' : 'Quero ser vendedor'}
               </button>
            </div>
          </form>
        )}
      </div>
      <p className="mt-8 text-xs text-stone-400">© 2025 Sunflower Beach</p>
    </div>
  );
};