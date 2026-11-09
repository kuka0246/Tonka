export type OrderStatus = 'PREPARING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  barcode?: string;
  description?: string;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryLocation {
  lat: number;
  lng: number;
  addressText?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  location: DeliveryLocation | null;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'COD' | 'QR';
  paymentSlipUrl?: string; // Base64 data or image URL for bank slip
  status: OrderStatus;
  notes?: string;
}
