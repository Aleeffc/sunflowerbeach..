import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, User, ShoppingBag } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { LoadingSunflower } from './LoadingSunflower';

export const StylistChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: 'Olá! Sou a Sunny, sua consultora de estilo da Sunflower Beach. 🌻 Está procurando o look perfeito para alguma ocasião especial?' 
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setLoading(true);

    // Update UI with user message
    const newHistory: ChatMessage[] = [...history, { role: 'user', text: userMsg }];
    setHistory(newHistory);

    // Call Gemini
    const response = await sendMessageToGemini(newHistory, userMsg);

    setHistory(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-stone-900 text-white p-4 rounded-full shadow-lg hover:bg-sunflower-500 hover:text-stone-900 transition-all duration-300 hover:scale-110 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Abrir Chat Stylist"
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[90vw] md:w-[380px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sunflower-300 to-sunflower-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center border-2 border-white/50">
              <Sparkles className="text-stone-800" size={20} />
            </div>
            <div>
              <h3 className="font-serif text-stone-900 font-bold">Sunny</h3>
              <p className="text-[10px] uppercase tracking-widest text-stone-800/70">Virtual Stylist</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-stone-800 hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
          {history.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-stone-800 text-white rounded-br-none' 
                    : 'bg-white text-stone-800 shadow-sm rounded-bl-none border border-stone-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-stone-100 flex gap-1 items-center">
                 <LoadingSunflower size="sm" text="" />
                 <span className="text-xs text-stone-400">Digitando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-stone-100">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Me ajude a escolher um look..."
              className="flex-1 bg-stone-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-sunflower-400 focus:outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-stone-800 text-white p-2 rounded-full hover:bg-sunflower-500 hover:text-stone-900 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[9px] text-center text-stone-400 mt-2">
            IA powered by Gemini. Sunny pode cometer erros.
          </p>
        </div>
      </div>
    </>
  );
};