import React, { createContext, useContext, useState } from 'react';

// Buat tipe item di cart
type Item = {
  id: number;
  name: string;
  price: number;
};

// Tipe untuk transaksi
type Transaction = {
  id: number;
  date: string;
  items: Item[];
  total: number;
};

// Buat tipe untuk konteks
type CartContextType = {
  cart: Item[];
  addToCart: (item: Item) => void;
  clearCart: () => void;
  checkout: () => void;
  transactions: Transaction[];
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Item[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addToCart = (item: Item) => {
    setCart([...cart, item]);
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = () => {
    if (cart.length === 0) return;
    const newTransaction: Transaction = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price, 0),
    };
    setTransactions([newTransaction, ...transactions]);
    clearCart();
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, clearCart, checkout, transactions }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
