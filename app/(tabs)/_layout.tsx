import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Keranjang',
        }}
      />
      <Tabs.Screen
        name="checkout"
        options={{
          title: 'Checkout',
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: 'Transaksi',
        }}
      />
    </Tabs>
  );
}
