import ProductCart from "@/components/ProductCart";
import { productService } from "@/hooks/ProductService";

import { Product } from "@/types/types";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { useCart } from "../context/CartContext";

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
      console.log("Data API:", data);
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
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: "space-between",
        paddingHorizontal: 10,
      }}
      ListHeaderComponent={
        <View style={{ paddingHorizontal: 10, marginTop: 10, marginBottom: 5 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#4e342e",
              textAlign: "center",
            }}>
            Halo, Pecinta Kopi!
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#795548",
              marginBottom: 15,
              textAlign: "center",
            }}>
            Mau seduh kopi apa hari ini?
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10,
              color: "#333",
            }}>
            Daftar Produk :
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ flex: 1, margin: 5 }}>
          <ProductCart
            product={item}
            onAddToCart={() => handleAddToCart(item.id)}
          />
        </View>
      )}
      onRefresh={loadProducts}
      refreshing={loading}
    />
  );
}
