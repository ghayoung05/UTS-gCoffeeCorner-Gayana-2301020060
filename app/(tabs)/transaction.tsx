import { View, Text, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';

export default function TransactionScreen() {
  const { transactions } = useCart();

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#f6f2eb' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#4b2e05' }}>
        Riwayat Transaksi 📜
      </Text>

      {transactions.length === 0 ? (
        <Text style={{ color: '#5c4033' }}>Belum ada transaksi.</Text>
      ) : (
        transactions.map((t) => (
          <View
            key={t.id}
            style={{
              marginBottom: 20,
              padding: 14,
              backgroundColor: '#fffaf3',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#d4b996',
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 3,
            }}
          >
            <Text style={{ fontWeight: 'bold', color: '#4b2e05' }}>{t.date}</Text>
            {t.items.map((item, idx) => (
              <Text key={idx} style={{ color: '#5c4033' }}>
                • {item.name} - Rp {item.price.toLocaleString()}
              </Text>
            ))}
            <Text style={{ marginTop: 8, fontWeight: '600', color: '#3b2f2f' }}>
              Total: Rp {t.total.toLocaleString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
