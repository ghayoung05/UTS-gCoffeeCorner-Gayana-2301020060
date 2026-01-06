import { supabase } from "@/lib/supabase";
import { CartItem } from "@/types/types";

export const cartService = {
  // Get all cart items
  async getCart(): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        products (*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add to cart or update quantity
  async addToCart(productId: string, quantity: number = 1): Promise<void> {
    // Check if product already in cart
    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("product_id", productId)
      .maybeSingle();

    if (existing) {
      // Update quantity
      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity: existing.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase.from("cart_items").insert({
        product_id: productId,
        quantity,
      });

      if (error) throw error;
    }
  },

  // Update cart item quantity
  async updateQuantity(cartItemId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      return this.removeItem(cartItemId);
    }

    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cartItemId);

    if (error) throw error;
  },

  // Remove item from cart
  async removeItem(cartItemId: string): Promise<void> {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (error) throw error;
  },

  // Clear entire cart
  async clearCart(): Promise<void> {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

    if (error) throw error;
  },
};
