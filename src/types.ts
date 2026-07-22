export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  video?: string;
  videoDuration?: number; // up to 30s
  category: string;
  sold: number;
  stock: number;
  discount?: number; // percentage, e.g. 35 for 35% off
  description: string;
  isFlashSale?: boolean;
  flashSaleProgress?: number; // 0 to 100 representing percentage sold in flash sale
  isMall?: boolean;
  isFavorite?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  location: string;
  specs: Record<string, string>;
  options?: string[]; // e.g., ["Đỏ", "Xanh", "Trắng"] or ["M", "L", "XL"]
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Lucide icon identifier
  color: string; // Tailwind background color class
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface Voucher {
  code: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  street: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: string;
  avatar?: string;
  address?: ShippingAddress;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Order {
  id: string;
  userId?: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: 'standard' | 'express' | 'saver';
  shippingFee: number;
  paymentMethod: 'cod' | 'bank_transfer';
  voucherCode?: string;
  discountAmount: number;
  totalAmount: number; // sum of product price * quantity
  finalAmount: number; // totalAmount + shippingFee - discountAmount
  status: 'pending' | 'shipping' | 'completed' | 'cancelled';
}

export interface Review {
  id: string;
  username: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  optionSelected?: string;
  likes: number;
  images?: string[];
}
