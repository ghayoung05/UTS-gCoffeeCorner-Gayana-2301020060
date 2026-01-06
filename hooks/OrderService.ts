import { supabase } from "@/lib/supabase";
import { CartItem, Order } from "@/types/types";

export const orderService = {
  // Generate order number
  generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 999) + 1;
    return `ORD-${dateStr}-${String(random).padStart(3, "0")}`;
  },

  // Create new order
  async createOrder(
    items: CartItem[],
    totalAmount: number,
    paymentMethod: string,
    customerName?: string,
    customerPhone?: string,
    notes?: string
  ): Promise<Order> {
    const orderNumber = this.generateOrderNumber();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map((item) => {
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products; // ⬅️ ambil product

      if (!product) {
        throw new Error("Product data missing in cart item");
      }

      return {
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    });
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Return complete order
    return this.getOrderById(order.id);
  },

  // Get order history
  async getOrderHistory(limit: number = 50): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Get single order
  async getOrderById(orderId: string): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `
      )
      .eq("id", orderId)
      .single();

    if (error) throw error;
    return data;
  },
};
