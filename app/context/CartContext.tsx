import { cartService } from "@/hooks/CartService";
import { CartItem } from "@/types/types";
import React, { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  loading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    refreshCart();
  }, []);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setItems(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, quantity: number = 1) => {
    await cartService.addToCart(productId, quantity);
    await refreshCart();
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    await cartService.updateQuantity(cartItemId, quantity);
    await refreshCart();
  };

  const removeItem = async (cartItemId: string) => {
    await cartService.removeItem(cartItemId);
    await refreshCart();
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => {
    if (!item.products) return sum;
    return sum + item.products.price * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalAmount,
        itemCount,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
