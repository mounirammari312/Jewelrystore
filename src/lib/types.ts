export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: 'admin' | 'supplier' | 'user';
  supplierStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  supplierProfile?: {
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    category: string;
    logoUrl: string;
    coverUrl: string;
    address: string;
    addressEn: string;
    contact: { phone: string; whatsapp: string; email: string };
    badge: 'gold' | 'blue' | 'none';
  };
}

export interface Supplier {
  id: string;
  userId: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  logoUrl: string;
  coverUrl: string;
  address: string;
  addressEn: string;
  contact: { phone: string; whatsapp: string; email: string };
  rating: number;
  reviewCount: number;
  views: number;
  productCount: number;
  badge: 'gold' | 'blue' | 'none';
  status: 'pending' | 'approved' | 'rejected';
  joinedDate: string;
  isVerified: boolean;
}

export interface Product {
  id: string;
  supplierId: string;
  supplierName: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  description: string;
  descriptionEn: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  unit: string;
  minOrder: number;
  createdAt: string;
}

export interface Message {
  id: string;
  fromUsername: string;
  fromDisplayName: string;
  toUsername: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface SupplierAd {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierUsername: string;
  title: string;
  description: string;
  placement: 'top' | 'featured' | 'highlighted';
  status: 'pending' | 'active' | 'rejected' | 'expired' | 'paused';
  budget: number;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate?: string;
  adminNote?: string;
  createdAt: string;
}

export interface AppState {
  users: UserProfile[];
  suppliers: Supplier[];
  products: Product[];
  messages: Message[];
  ads: SupplierAd[];
  // User actions
  addUser: (user: UserProfile) => void;
  updateUser: (id: string, data: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
  getUserByUsername: (username: string) => UserProfile | undefined;
  getUserById: (id: string) => UserProfile | undefined;
  // Supplier actions
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  getSupplierById: (id: string) => Supplier | undefined;
  // Product actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsBySupplier: (supplierId: string) => Product[];
  // Message actions
  addMessage: (message: Message) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  getMessagesByUsername: (username: string) => Message[];
  // Ad actions
  addAd: (ad: SupplierAd) => void;
  updateAd: (id: string, data: Partial<SupplierAd>) => void;
  deleteAd: (id: string) => void;
  getAdsBySupplier: (supplierId: string) => SupplierAd[];
}
