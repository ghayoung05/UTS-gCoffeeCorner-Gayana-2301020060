import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>G’s Coffee Corner</Text>
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
          <Text style={styles.navText}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
          <Text style={styles.navText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:gscoffeecorner@gmail.com')}>
          <Text style={styles.navText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#C39B77',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  logo: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  navText: {
    color: '#FFF8F0',
    marginHorizontal: 10,
    fontSize: 14,
  },
});
