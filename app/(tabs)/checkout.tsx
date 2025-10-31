import { View, Text, Button } from 'react-native';
import { useCart } from '../context/CartContext';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const { cart, checkout } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f6f2eb' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#4b2e05' }}>
        Checkout 🧾
      </Text>

      {cart.map((item) => (
        <Text key={item.id} style={{ color: '#5c4033' }}>
          {item.name} - Rp {item.price.toLocaleString()}
        </Text>
      ))}

      <Text style={{ marginVertical: 12, fontWeight: 'bold', color: '#3b2f2f' }}>
        Total: Rp {total.toLocaleString()}
      </Text>

      <Button
        title="Konfirmasi Pembelian"
        color="#8b5e34"
        onPress={() => {
          checkout();
          router.push('/transaction');
        }}
      />
    </View>
  );
}
