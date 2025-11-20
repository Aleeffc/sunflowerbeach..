
export enum Category {
  BIKINIS = 'Bikinis',
  ONE_PIECE = 'Maiôs',
  COVER_UPS = 'Saídas de Praia',
  ACCESSORIES = 'Acessórios'
}

export type UserRole = 'admin' | 'vendor' | 'client';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  password?: string; // Only for admin/vendor
  phone?: string; // Only for client
  isApproved?: boolean; // For vendors
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  isNew?: boolean;
  vendorId: string; // ID of the user who created the ad
  sizes?: string[];
  colors?: string[];
  material?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isProductRecommendation?: boolean;
  recommendedProductIds?: string[];
}

export interface SiteSettings {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  bottomBannerImage: string;
  bottomBannerTitle: string;
  bottomBannerSubtitle: string;
}
