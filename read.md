# 🔄 Migration Plan: AsyncStorage → Supabase (SUPER SIMPLE)

## G's Coffee Corner - Database Migration Tanpa Auth & Device ID

---

## 🎯 **TUJUAN MIGRASI**

### Kenapa Pindah ke Supabase?

- ✅ **Cloud Storage** - Data tersimpan di cloud
- ✅ **Real-time updates** - Perubahan langsung terlihat
- ✅ **Backup otomatis** - Data lebih aman
- ✅ **SUPER SIMPLE** - Tanpa auth, tanpa device tracking
- ⚠️ **Single Cart & Orders** - Semua user share data yang sama (cocok untuk POS/kasir)

---

## 📊 **KONSEP SEDERHANA**

```
Products (Master Data - Admin isi)
    ↓
Cart (Single Cart - Real-time for all)
    ↓
Orders (History - Shared for all)
```

**Cocok untuk:** Aplikasi kasir toko, POS system, atau demo project

---

## 🗄️ **DATABASE SCHEMA DESIGN - SUPABASE**

### **1. Table: `products`**

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'coffee', 'equipment'
  subcategory TEXT, -- 'arabica', 'robusta', 'decaf', 'drip-bag'
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
```

### **2. Table: `cart_items`**

```sql
-- Single cart shared by all
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id) -- Satu produk hanya satu row
);

CREATE INDEX idx_cart_product ON cart_items(product_id);
```

### **3. Table: `orders`**

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- Format: ORD-20260104-001
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL, -- 'cash', 'card', 'e-wallet'
  customer_name TEXT,
  customer_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
```

### **4. Table: `order_items`**

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

### **5. Enable Public Access**

```sql
-- Disable RLS - Public access tanpa auth
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON products TO anon, authenticated;
GRANT ALL ON cart_items TO anon, authenticated;
GRANT ALL ON orders TO anon, authenticated;
GRANT ALL ON order_items TO anon, authenticated;
```

---

## 🏗️ **ARSITEKTUR KODE**

### **File Structure:**

```
/lib
  /supabase.ts          # Supabase client setup
/services
  /productService.ts    # CRUD products
  /cartService.ts       # Manage cart (SINGLE)
  /orderService.ts      # Create & fetch orders
/hooks
  /useProducts.tsx      # Products hook
  /useCart.tsx          # Cart hook
  /useOrders.tsx        # Orders hook
/contexts
  /CartContext.tsx      # Global cart state
/types
  /database.ts          # TypeScript types
```

---

## 🔧 **IMPLEMENTASI STEP-BY-STEP**

### **FASE 1: Setup Supabase (20 menit)**

#### 1.1 Install Dependencies

```bash
npm install @supabase/supabase-js
npm install react-native-url-polyfill
```

#### 1.2 Setup Supabase Client (`/lib/supabase.ts`)

```typescript
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No auth
  },
});
```

---

### **FASE 2: Create Database (20 menit)**

#### 2.1 Jalankan SQL Schema

Copy-paste SQL di atas ke Supabase SQL Editor

#### 2.2 Seed Products Data

```sql
INSERT INTO products (name, category, subcategory, price, description, image_url, stock) VALUES
('Arabica Gayo', 'coffee', 'arabica', 85000, 'Kopi Arabica premium dari Gayo, Aceh', 'https://via.placeholder.com/300', 100),
('Robusta Lampung', 'coffee', 'robusta', 65000, 'Kopi Robusta dari Lampung', 'https://via.placeholder.com/300', 150),
('Decaf Colombia', 'coffee', 'decaf', 95000, 'Kopi tanpa kafein dari Colombia', 'https://via.placeholder.com/300', 80),
('Drip Bag Coffee', 'equipment', 'drip-bag', 15000, 'Drip bag sekali pakai', 'https://via.placeholder.com/300', 200),
('French Press 350ml', 'equipment', 'french-press', 250000, 'French press berkualitas tinggi', 'https://via.placeholder.com/300', 50),
('Cold Drip Maker', 'equipment', 'cold-drip', 450000, 'Cold drip coffee maker', 'https://via.placeholder.com/300', 30);
```

---

### **FASE 3: Product Service (30 menit)**

#### 3.1 Types (`/types/database.ts`)

```typescript
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

export type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  products: Product;
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
```

#### 3.2 Product Service (`/services/productService.ts`)

```typescript
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/database";

export const productService = {
  // Get all active products
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return data || [];
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return data || [];
  },

  // Get single product
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  },
};
```

---

### **FASE 4: Cart Service (40 menit)**

#### 4.1 Cart Service (`/services/cartService.ts`)

```typescript
import { supabase } from "@/lib/supabase";
import { CartItem } from "@/types/database";

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
```

#### 4.2 Cart Context (`/contexts/CartContext.tsx`)

```typescript
import React, { createContext, useContext, useState, useEffect } from "react";
import { cartService } from "@/services/cartService";
import { CartItem } from "@/types/database";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshCart();

    // Optional: Setup realtime subscription
    const subscription = supabase
      .channel("cart_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart_items" },
        () => refreshCart()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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

  const totalAmount = items.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

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
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
```

---

### **FASE 5: Order Service (40 menit)**

#### 5.1 Order Service (`/services/orderService.ts`)

```typescript
import { supabase } from "@/lib/supabase";
import { CartItem, Order } from "@/types/database";

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
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.products.id,
      product_name: item.products.name,
      product_price: item.products.price,
      quantity: item.quantity,
      subtotal: item.products.price * item.quantity,
    }));

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
```

---

### **FASE 6: UI Implementation (1-2 jam)**

#### 6.1 App Layout (`/app/_layout.tsx`)

```typescript
import { Stack } from "expo-router";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
      </Stack>
    </CartProvider>
  );
}
```

#### 6.2 Home Screen (`/app/(tabs)/index.tsx`)

```typescript
import { View, FlatList, ActivityIndicator, Alert, Text } from "react-native";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { productService } from "@/services/productService";
import { Product } from "@/types/database";
import ProductCard from "@/components/ProductCard";

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId, 1);
      Alert.alert("Berhasil", "Produk ditambahkan ke keranjang");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onAddToCart={() => handleAddToCart(item.id)}
        />
      )}
      onRefresh={loadProducts}
      refreshing={loading}
    />
  );
}
```

#### 6.3 Cart Screen (`/app/(tabs)/cart.tsx`)

```typescript
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useCart } from "@/contexts/CartContext";
import { router } from "expo-router";

export default function CartScreen() {
  const { items, totalAmount, loading, updateQuantity, removeItem } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Keranjang masih kosong");
      return;
    }
    router.push("/checkout");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.productName}>{item.products.name}</Text>
            <Text>Rp {item.products.price.toLocaleString("id-ID")}</Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
                style={styles.button}>
                <Text>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantity}>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
                style={styles.button}>
                <Text>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={styles.remove}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Keranjang masih kosong</Text>
        }
      />

      <View style={styles.footer}>
        <Text style={styles.total}>
          Total: Rp {totalAmount.toLocaleString("id-ID")}
        </Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  cartItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  productName: { fontSize: 16, fontWeight: "bold" },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  button: { padding: 8, backgroundColor: "#f0f0f0", borderRadius: 4 },
  quantity: { marginHorizontal: 16, fontSize: 16 },
  remove: { color: "red", marginTop: 8 },
  empty: { textAlign: "center", marginTop: 50, color: "#999" },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: "#eee" },
  total: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  checkoutButton: { backgroundColor: "#007AFF", padding: 16, borderRadius: 8 },
  checkoutText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
```

#### 6.4 Checkout Screen (`/app/checkout.tsx`)

```typescript
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useCart } from "@/contexts/CartContext";
import { orderService } from "@/services/orderService";
import { router } from "expo-router";

export default function CheckoutScreen() {
  const { items, totalAmount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const order = await orderService.createOrder(
        items,
        totalAmount,
        paymentMethod,
        customerName,
        customerPhone,
        notes
      );

      await clearCart();

      Alert.alert(
        "Berhasil!",
        `Pesanan ${order.order_number} berhasil dibuat`,
        [{ text: "OK", onPress: () => router.push("/(tabs)") }]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nama Customer (Opsional)"
        value={customerName}
        onChangeText={setCustomerName}
      />

      <TextInput
        style={styles.input}
        placeholder="No HP (Opsional)"
        value={customerPhone}
        onChangeText={setCustomerPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Catatan"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.total}>
        Total: Rp {totalAmount.toLocaleString("id-ID")}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Konfirmasi Pesanan"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  total: { fontSize: 20, fontWeight: "bold", marginVertical: 16 },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
```

#### 6.5 History Screen (`/app/(tabs)/history.tsx`)

```typescript
import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { orderService } from "@/services/orderService";
import { Order } from "@/types/database";

export default function HistoryScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderHistory();
      setOrders(data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.orderCard}>
          <Text style={styles.orderNumber}>{item.order_number}</Text>
          <Text>{new Date(item.created_at).toLocaleString("id-ID")}</Text>
          <Text style={styles.total}>
            Rp {item.total_amount.toLocaleString("id-ID")}
          </Text>
          {item.customer_name && <Text>Customer: {item.customer_name}</Text>}
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>Belum ada riwayat pesanan</Text>
      }
      onRefresh={loadOrders}
      refreshing={loading}
    />
  );
}

const styles = StyleSheet.create({
  orderCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  orderNumber: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  total: { fontSize: 18, fontWeight: "bold", marginTop: 8, color: "#007AFF" },
  empty: { textAlign: "center", marginTop: 50, color: "#999" },
});
```

---

## 🧪 **TESTING CHECKLIST**

### Basic Flow

- [ ] Load products
- [ ] Add to cart
- [ ] Update quantity
- [ ] Remove from cart
- [ ] Checkout order
- [ ] Clear cart after order
- [ ] View order history

### Edge Cases

- [ ] Empty cart checkout
- [ ] Network error handling
- [ ] Duplicate products in cart
- [ ] Out of stock products
- [ ] Invalid quantity (0 or negative)

---

## 🚀 **DEPLOYMENT STEPS**

1. **Create Supabase Project**
2. **Run SQL Schema**
3. **Disable RLS on all tables**
4. **Seed products data**
5. **Update env variables**
6. **Test thoroughly**
7. **Deploy!**

---

## 📝 **NOTES**

### Advantages (No Device ID):

- ✅ Super simple implementation
- ✅ No AsyncStorage dependency
- ✅ Perfect for POS/Kasir use case
- ✅ Real-time sync automatically
- ✅ Shared cart & history

### Limitations:

- ⚠️ Single cart (not multi-user)
- ⚠️ No user-specific data
- ⚠️ Anyone can see/modify cart
- ⚠️ Not suitable for e-commerce with personal accounts

### Perfect For:

- ✅ Coffee shop POS system
- ✅ Demo/prototype projects
- ✅ Single cashier application
- ✅ Learning/educational projects

---

## ⏱️ **ESTIMASI WAKTU**

| Fase           | Waktu    |
| -------------- | -------- |
| Setup Supabase | 20 menit |
