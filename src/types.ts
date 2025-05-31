export interface Cake {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  featured: boolean;
  created_at: string;
}

export interface Enquiry {
  id: string;
  cake_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  created_at: string;
}