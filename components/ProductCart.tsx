import { Button, Image, Text, View } from 'react-native';
import { useCart } from '../app/context/CartContext';

export default function ProductCard({ product }: any) {
  const { addToCart } = useCart();

  return (
    <View style={{ marginBottom: 16, backgroundColor: '#fff', borderRadius: 10, padding: 12 }}>
      <Image source={product.image} style={{ width: '100%', height: 150, borderRadius: 10 }} />
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8 }}>{product.name}</Text>
      <Text style={{ marginBottom: 8 }}>Rp {product.price.toLocaleString()}</Text>
      <Button title="Tambah ke Keranjang" onPress={() => addToCart(product)} />
    </View>
  );
}
