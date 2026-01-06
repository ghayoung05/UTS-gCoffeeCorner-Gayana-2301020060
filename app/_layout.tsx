import Airbridge from "airbridge-react-native-sdk";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { CartProvider } from "./context/CartContext";

export default function RootLayout() {
  useEffect(() => {
    if (Airbridge && (Airbridge as any).init) {
      (Airbridge as any).init(
        "gcoffeecorner",
        "5801bd711b7b40f2a98376a152521633"
      );
    } else {
      console.log("Airbridge is not available");
    }
  }, []);
  return (
    <CartProvider>
      <Stack screenOptions={{ headerTitleAlign: "center", headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Coffee Corner" }} />
        <Stack.Screen name="cart" options={{ title: "Keranjang" }} />
        <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
        <Stack.Screen name="transaction" options={{ title: "Transaksi" }} />
      </Stack>
    </CartProvider>
  );
}
