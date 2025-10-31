import { Stack } from 'expo-router';
import { CartProvider } from './context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="index" options={{ title: 'Coffee Corner' }} />
        <Stack.Screen name="cart" options={{ title: 'Keranjang' }} />
        <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
        <Stack.Screen name="transaction" options={{ title: 'Transaksi' }} />
      </Stack>
    </CartProvider>
  );
}
