import { router } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../context/CartContext";

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
            <Text>{item.products?.name ?? "Produk tidak tersedia"}</Text>

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
  checkoutButton: { backgroundColor: "#4e342e", padding: 16, borderRadius: 8 },
  checkoutText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
