import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const BRAND_PURPLE = '#331E6A';

export const FavoritesScreen = ({ navigation }: any) => {
  const favoriteServices = [
    {
      id: 'f1',
      name: 'Ramesh Sharma',
      trade: 'Master Plumber',
      rating: 4.9,
      reviews: 38,
      area: 'Lokanthali, Bhaktapur',
      rate: 'NPR 500',
      icon: 'wrench',
    },
    {
      id: 'f2',
      name: 'Bikash Tamang',
      trade: 'Bike & Car Mechanic',
      rating: 4.8,
      reviews: 52,
      area: 'Koteshwor, Kathmandu',
      rate: 'NPR 400',
      icon: 'car-wrench',
    },
    {
      id: 'f3',
      name: 'Sunita Maharjan',
      trade: 'Home Deep Cleaning',
      rating: 5.0,
      reviews: 29,
      area: 'Patan, Lalitpur',
      rate: 'NPR 1,000',
      icon: 'spray-bottle',
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subTitle}>Your saved top-rated service pros in Nepal</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {favoriteServices.map((fav) => (
          <View key={fav.id} style={styles.card}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name={fav.icon as any} size={24} color={BRAND_PURPLE} />
            </View>

            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{fav.name}</Text>
                <TouchableOpacity>
                  <Ionicons name="heart" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <Text style={styles.trade}>{fav.trade}</Text>
              <Text style={styles.area}>📍 {fav.area}</Text>

              <View style={styles.bottomRow}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {fav.rating} ({fav.reviews})</Text>
                </View>
                <Text style={styles.rate}>{fav.rate}</Text>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.exploreText}>Explore More Services</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  subTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#F1EDF8',
    shadowColor: '#331E6A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EDE8F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  trade: {
    fontSize: 12,
    color: BRAND_PURPLE,
    fontWeight: '700',
    marginTop: 2,
  },
  area: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  rate: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  exploreBtn: {
    marginTop: 12,
    backgroundColor: BRAND_PURPLE,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  exploreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

