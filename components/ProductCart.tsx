import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../app/context/CartContext";

export default function ProductCart({ product }: any) {
  const { addItem } = useCart();

  const handlePress = () => {
    addItem(product.id);
    Alert.alert(
      "Berhasil!",
      `${product.name} telah ditambahkan ke keranjang.`,
      [{ text: "OK" }]
    );
  };

  return (
    <View
      style={{
        marginBottom: 16,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}>
      <Image
        source={{ uri: product.image_url }}
        style={{ height: 120, borderRadius: 10 }}
        resizeMode="cover"
      />
      <Text
        numberOfLines={1}
        style={{
          fontSize: 17,
          fontWeight: "bold",
          marginTop: 8,
          color: "#4e342e",
        }}>
        {product.name}
      </Text>
      <Text style={{ marginBottom: 13, color: "#795548" }}>
        Rp {product.price.toLocaleString()}
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={{
          backgroundColor: "#6F4E37",
          paddingVertical: 8,
          borderRadius: 8,
          alignItems: "center",
        }}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
          Tambah ke Keranjang
        </Text>
      </TouchableOpacity>
    </View>
  );
}
