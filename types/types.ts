export type Product = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  price: number;
  description: string | null;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
};

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
};

export type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  products: CartProduct;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: string;
  order_number: string;
  total_amount: number;
  payment_method: string;
  customer_name: string | null;
  customer_phone: string | null;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
};
