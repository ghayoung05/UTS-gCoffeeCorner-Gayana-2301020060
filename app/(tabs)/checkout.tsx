import { orderService } from "@/hooks/OrderService";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../context/CartContext";

export default function CheckoutScreen() {
  const { items, totalAmount, clearCart } = useCart();
  const [paymentMethod] = useState("cash");
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
    backgroundColor: "#4e342e",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
