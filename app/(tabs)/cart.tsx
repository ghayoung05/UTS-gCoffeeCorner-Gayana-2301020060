import { Link } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const { cart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Keranjang Kamu
      </Text>

      {cart.length === 0 ? (
        <Text>Keranjang kosong 😿</Text>
      ) : (
        <>
          {cart.map((item) => (
            <Text key={item.id} style={{ marginBottom: 6 }}>
              {item.name} — Rp {item.price.toLocaleString()}
            </Text>
          ))}

          <Text style={{ marginVertical: 12, fontWeight: 'bold' }}>
            Total: Rp {total.toLocaleString()}
          </Text>

          <Link href="/(tabs)/checkout" asChild>
            <Button title="Lanjut ke Checkout" />
          </Link>

          <View style={{ marginTop: 8 }}>
            <Button title="Kosongkan Keranjang" color="red" onPress={clearCart} />
          </View>
        </>
      )}
    </View>
  );
}
