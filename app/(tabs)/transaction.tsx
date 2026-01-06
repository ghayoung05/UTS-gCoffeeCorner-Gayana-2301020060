import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { orderService } from "@/hooks/OrderService";
import { Order } from "@/types/types";

export default function TransactionScreen() {
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <FlatList
      style={{ padding: 16, backgroundColor: "#f6f2eb" }}
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View
          style={{
            marginBottom: 16,
            padding: 14,
            backgroundColor: "#fffaf3",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#d4b996",
          }}>
          <Text style={{ fontWeight: "bold", color: "#4b2e05" }}>
            {item.order_number}
          </Text>

          <Text style={{ color: "#5c4033" }}>
            {new Date(item.created_at).toLocaleString("id-ID")}
          </Text>

          <Text style={{ marginTop: 8, fontWeight: "600" }}>
            Total: Rp {item.total_amount.toLocaleString("id-ID")}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Belum ada transaksi
        </Text>
      }
      onRefresh={loadOrders}
      refreshing={loading}
    />
  );
}
