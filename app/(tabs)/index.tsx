import { View, Text, Image, TouchableOpacity, ScrollView, Modal, Button } from 'react-native';
import { useCart } from '../context/CartContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Arabica Coffee Beans',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Robusta Coffee Beans',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1587731042511-cb3183ff5d6b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Decaf Coffee Beans',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1619634499049-1eac8a32bbf2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Drip Bag',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1578298018300-9e1e447d4b9a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Coffee Machine',
    price: 3500000,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Cold Drip Set',
    price: 1500000,
    image: 'https://images.unsplash.com/photo-1522992319-6b7b0b67e86e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    name: 'Coffee Filters',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  },
];

export default function HomeScreen() {
  const { addToCart } = useCart();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

  const openModal = (type: string) => {
    setModalType(type);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'contact':
        return (
          <>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#4b2e05' }}>Contact Us</Text>
            <Text style={{ color: '#5c4033' }}>📸 Instagram: @gscoffeecorner</Text>
            <Text style={{ color: '#5c4033' }}>📘 Facebook: G’s Coffee Corner</Text>
            <Text style={{ color: '#5c4033' }}>💬 WhatsApp: +62 812-3456-7890</Text>
          </>
        );
      case 'location':
        return (
          <>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#4b2e05' }}>Our Location</Text>
            <Text style={{ color: '#5c4033' }}>📍 Jl. Raya Uluwatu No. 88, Bali, Indonesia</Text>
          </>
        );
      case 'about':
        return (
          <>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#4b2e05' }}>About G’s Coffee Corner</Text>
            <Text style={{ color: '#5c4033' }}>
              G’s Coffee Corner menghadirkan pengalaman kopi hangat dan autentik,
              menggabungkan cita rasa biji kopi terbaik Nusantara dengan suasana santai yang estetik.
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f2eb' }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: '#d4b996',
          borderBottomWidth: 1,
          borderBottomColor: '#b08b5b',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#3b2f2f' }}>
          g’s Coffee Corner
        </Text>

        <View style={{ flexDirection: 'row', gap: 20 }}>
          <TouchableOpacity onPress={() => openModal('contact')}>
            <Text style={{ color: '#3b2f2f', fontWeight: '600' }}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openModal('location')}>
            <Text style={{ color: '#3b2f2f', fontWeight: '600' }}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openModal('about')}>
            <Text style={{ color: '#3b2f2f', fontWeight: '600' }}>About G</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        >
          <View
            style={{
              backgroundColor: '#fffaf3',
              padding: 22,
              borderRadius: 16,
              width: '80%',
              borderWidth: 1,
              borderColor: '#d4b996',
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 6,
            }}
          >
            {renderModalContent()}
            <View style={{ marginTop: 16 }}>
              <Button title="Close" color="#8b5e34" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* MAIN CONTENT */}
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#4b2e05' }}>
          Our Biji Kopi & Coffee Tools ☕
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {products.map((item) => (
            <View
              key={item.id}
              style={{
                width: '47%',
                backgroundColor: '#fffaf3',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#d4b996',
                marginBottom: 18,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{ width: '100%', height: 130, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
              <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: '600', color: '#3b2f2f', fontSize: 15 }}>
                  {item.name}
                </Text>
                <Text style={{ marginVertical: 6, color: '#5c4033' }}>
                  Rp {item.price.toLocaleString()}
                </Text>
                <Button title="Tambah ke Keranjang" color="#8b5e34" onPress={() => addToCart(item)} />
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 10 }}>
          <Button title="Lihat Keranjang" onPress={() => router.push('/cart')} color="#4b2e05" />
        </View>
      </ScrollView>
    </View>
  );
}

