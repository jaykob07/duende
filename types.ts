export interface Product {
  id: string;
  name: string;
  reference: string;
  price: number;
  features: string;
  imageUrl: string;
  createdAt: number;
}

export type ViewState = 'gallery' | 'login' | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
