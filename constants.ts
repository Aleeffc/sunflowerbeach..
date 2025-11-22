
import { Product, Category, User, SiteSettings } from './types';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lqczpzglmvxaqekkctih.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY3pwemdsbXZ4YXFla2tjdGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NzI4ODUsImV4cCI6MjA3OTM0ODg4NX0.rjEgTFlNz4M_TKpktVpi8cdesJ3Eaparub3VWMDJ5YM'
)
export const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Adim',
    password: '0906',
    role: 'admin',
    isApproved: true
  },
  {
    id: 'vendor-1',
    name: 'Maria Moda Praia',
    password: '123',
    role: 'vendor',
    isApproved: true
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroImage: 'https://images.unsplash.com/photo-1598312320868-b2262f54422f?q=80&w=2070&auto=format&fit=crop', // Farol da Barra
  heroTitle: 'Axé & Sol',
  heroSubtitle: 'A energia vibrante da Bahia em cada detalhe do seu verão.',
  bottomBannerImage: 'https://images.unsplash.com/photo-1565626424178-269d05cc7087?q=80&w=2574&auto=format&fit=crop', // Bahia Coast
  bottomBannerTitle: '"Onde o sol beija o mar"',
  bottomBannerSubtitle: 'Lifestyle Sunflower Beach'
};

// Images selected for a more "Tropical/Salvador" vibe
export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Biquíni Sunflower Gold',
    price: 289.90,
    category: Category.BIKINIS,
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1000&auto=format&fit=crop',
    description: 'Conjunto clássico com estampa exclusiva de girassóis e acabamento em ouro velho.',
    isNew: true,
    vendorId: 'admin-1',
    sizes: ['P', 'M', 'G'],
    colors: ['Amarelo Ouro', 'Preto'],
    material: 'Lycra Biodegradável UV50+'
  },
  {
    id: '2',
    name: 'Maiô Engana Mamãe Noir',
    price: 349.00,
    category: Category.ONE_PIECE,
    image: 'https://images.unsplash.com/photo-1574365576393-1c1efdf84161?q=80&w=1000&auto=format&fit=crop',
    description: 'Elegância e sofisticação em um design recortado que valoriza a silhueta.',
    vendorId: 'admin-1',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Branco'],
    material: 'Poliamida Premium'
  },
  {
    id: '3',
    name: 'Saída de Praia Linho',
    price: 420.00,
    category: Category.COVER_UPS,
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000&auto=format&fit=crop',
    description: 'Tecido leve e respirável, perfeito para o pôr do sol à beira-mar.',
    isNew: true,
    vendorId: 'vendor-1',
    sizes: ['Único'],
    colors: ['Off-White', 'Areia'],
    material: '100% Linho'
  },
  {
    id: '4',
    name: 'Biquíni Ocean Blue',
    price: 259.90,
    category: Category.BIKINIS,
    image: 'https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?q=80&w=1000&auto=format&fit=crop',
    description: 'O clássico cortininha em um tom de azul profundo inspirado no mar do Rio Vermelho.',
    vendorId: 'admin-1',
    sizes: ['PP', 'P', 'M'],
    colors: ['Azul Royal', 'Azul Marinho'],
    material: 'Lycra com textura'
  },
  {
    id: '5',
    name: 'Chapéu Palha Jeri',
    price: 189.00,
    category: Category.ACCESSORIES,
    image: 'https://images.unsplash.com/photo-1521335629791-ce4aec6c1d01?q=80&w=1000&auto=format&fit=crop',
    description: 'Proteção e estilo. Feito à mão por artesãos locais.',
    vendorId: 'vendor-1',
    sizes: ['Único (Ajustável)'],
    colors: ['Palha Natural'],
    material: 'Palha Carnaúba'
  },
  {
    id: '6',
    name: 'Maiô Decote Tropical',
    price: 319.90,
    category: Category.ONE_PIECE,
    image: 'https://images.unsplash.com/photo-1582639510494-c80b5de9f148?q=80&w=1000&auto=format&fit=crop',
    description: 'Estampa de folhagens vibrantes. Versátil para usar como body no Pelourinho.',
    vendorId: 'admin-1',
    sizes: ['M', 'G', 'GG'],
    colors: ['Verde Folha', 'Azul Turquesa'],
    material: 'Elastano e Poliéster Reciclado'
  },
  {
    id: '7',
    name: 'Canga Pareô Floral',
    price: 149.90,
    category: Category.COVER_UPS,
    image: 'https://images.unsplash.com/photo-1551855753-42243a606249?q=80&w=1000&auto=format&fit=crop',
    description: 'Estampa vibrante que combina com diversos biquínis da coleção.',
    vendorId: 'vendor-1',
    sizes: ['1,40m x 1,00m'],
    colors: ['Floral Laranja', 'Floral Rosa'],
    material: 'Viscose'
  },
  {
    id: '8',
    name: 'Bolsa de Praia Ratan',
    price: 299.00,
    category: Category.ACCESSORIES,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
    description: 'Espaçosa e resistente, cabe tudo o que você precisa para um dia de sol.',
    isNew: true,
    vendorId: 'admin-1',
    sizes: ['Grande'],
    colors: ['Natural'],
    material: 'Ratan e Couro Vegano'
  },
  {
    id: '9',
    name: 'Biquíni Hot Pants Rust',
    price: 299.90,
    category: Category.BIKINIS,
    image: 'https://images.unsplash.com/photo-1575425186775-b8de9a427e67?q=80&w=1000&auto=format&fit=crop',
    description: 'Cintura alta para maior conforto e estilo retrô chic em tons terrosos.',
    vendorId: 'admin-1',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Ferrugem', 'Terracota'],
    material: 'Lycra Premium'
  }
];
