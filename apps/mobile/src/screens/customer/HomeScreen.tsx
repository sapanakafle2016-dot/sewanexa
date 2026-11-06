import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { mobileApiFetch } from '../../services/api';

const CATEGORIES = [
  { id: '1', name: 'Home Maintenance', slug: 'home-maintenance', icon: 'construct', color: '#0284c7', count: '10 services' },
  { id: '2', name: 'Vehicle Services', slug: 'vehicle-services', icon: 'car', color: '#ea580c', count: '8 services' },
  { id: '3', name: 'Construction & Labour', slug: 'construction-and-labour', icon: 'hammer', color: '#dc2626', count: '8 services' },
  { id: '4', name: 'Personal & Lifestyle', slug: 'personal-and-lifestyle', icon: 'heart', color: '#9333ea', count: '7 services' },
  { id: '5', name: 'Technical & IT', slug: 'professional-and-technical', icon: 'laptop', color: '#2563eb', count: '8 services' },
  { id: '6', name: 'Other On-Demand', slug: 'other-services', icon: 'grid', color: '#059669', count: '7 services' },
];

export const HomeScreen = ({ navigation }: any) => {
  const { user, isProvider, switchMode } = useAuth();

  const [currentAddress, setCurrentAddress] = useState('Lokanthali, Bhaktapur');
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Request GPS location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const geocode = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
          if (geocode && geocode[0]) {
            const place = geocode[0];
            setCurrentAddress(`${place.subregion || place.district || 'Kathmandu'}, ${place.city || 'Nepal'}`);
          }
        }
      } catch (err) {
        // Fallback default
        setCurrentAddress('Lokanthali, Bhaktapur');
      }
    })();
  }, []);

  const fetchNearbyProviders = async () => {
    setLoading(true);
    try {
      // Lokanthali, Bhaktapur center coordinates: 85.3582, 27.6715
      const res = await mobileApiFetch(
        `/providers/nearby?longitude=85.3582&latitude=27.6715&radiusKm=${selectedRadius}&searchQuery=${searchQuery}`,
        { requiresAuth: false }
      );
      if (res.success && res.data) {
        setProviders(res.data);
      }
    } catch (err) {
      // Fallback sample data for offline / preview
      setProviders([
        {
          _id: '1',
          name: 'Ramesh Sharma',
          bio: '10+ years experienced certified plumber serving Kathmandu Valley.',
          skills: ['Plumbing', 'Sanitary', 'Water Tank'],
          distanceInKm: 0.9,
          baseRate: 500,
          ratings: { average: 4.9, count: 38 },
          isOnline: true,
          address: { areaName: 'Lokanthali', city: 'Bhaktapur' },
          avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400',
        },
        {
          _id: '2',
          name: 'Bikash Tamang',
          bio: 'Certified Bike & Car mechanic with on-demand roadside assistance.',
          skills: ['Bike Repair', 'Car Servicing', 'Battery Replacement'],
          distanceInKm: 1.4,
          baseRate: 400,
          ratings: { average: 4.8, count: 52 },
          isOnline: true,
          address: { areaName: 'Koteshwor', city: 'Kathmandu' },
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyProviders();
  }, [selectedRadius]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top App Header */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Ionicons name="build" size={18} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.appName}>SEWANEXA</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={12} color="#1e6fe8" />
              <Text style={styles.locationText} numberOfLines={1}>
                {currentAddress}
              </Text>
              <Text style={styles.gpsPill}>GPS</Text>
            </View>
          </View>
        </View>

        {isProvider ? (
          <TouchableOpacity
            style={styles.modeSwitchBtn}
            onPress={() => switchMode('provider')}
          >
            <Ionicons name="briefcase" size={16} color="#059669" />
            <Text style={styles.modeSwitchText}>Partner</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.partnerApplyBtn}
            onPress={() => navigation.navigate('ProviderRegister')}
          >
            <Ionicons name="shield-checkmark" size={14} color="#1e6fe8" />
            <Text style={styles.partnerApplyText}>Join</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchNearbyProviders} />
        }
      >
        {/* Search & Radius Filter Card */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search plumbers, mechanics, electricians..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={fetchNearbyProviders}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Radius Selector Pills */}
          <View style={styles.radiusContainer}>
            <Text style={styles.radiusLabel}>Radius:</Text>
            {[1, 2, 5, 10, 20].map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.radiusPill,
                  selectedRadius === r && styles.radiusPillActive,
                ]}
                onPress={() => setSelectedRadius(r)}
              >
                <Text
                  style={[
                    styles.radiusPillText,
                    selectedRadius === r && styles.radiusPillTextActive,
                  ]}
                >
                  {r} km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CategoriesList')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('CategoryDetail', { category: cat })}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: cat.color }]}>
                <Ionicons name={cat.icon as any} size={22} color="#ffffff" />
              </View>
              <Text style={styles.categoryName} numberOfLines={2}>
                {cat.name}
              </Text>
              <Text style={styles.categoryCount}>{cat.count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby Active Providers Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.liveHeaderRow}>
            <View style={styles.liveDot} />
            <Text style={styles.sectionTitle}>Verified Professionals Nearby</Text>
          </View>
          <Text style={styles.resultCount}>{providers.length} found</Text>
        </View>

        <View style={styles.providersList}>
          {providers.map((p) => (
            <View key={p._id} style={styles.providerCard}>
              <View style={styles.providerRow}>
                <Image
                  source={{
                    uri:
                      p.avatarUrl ||
                      'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400',
                  }}
                  style={styles.providerAvatar}
                />
                <View style={styles.providerInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.providerName}>{p.name}</Text>
                    <Ionicons name="checkmark-circle" size={16} color="#1e6fe8" />
                  </View>
                  <Text style={styles.providerBio} numberOfLines={1}>
                    {p.bio}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.ratingText}>
                      {p.ratings?.average || 5.0} ({p.ratings?.count || 12})
                    </Text>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Ionicons name="navigate-outline" size={12} color="#1e6fe8" />
                    <Text style={styles.distanceBadge}>{p.distanceInKm || 1.2} km away</Text>
                  </View>
                </View>
              </View>

              <View style={styles.providerFooter}>
                <View>
                  <Text style={styles.rateLabel}>Base Fee</Text>
                  <Text style={styles.rateValue}>NPR {p.baseRate || 500}</Text>
                </View>

                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={styles.outlineBtn}
                    onPress={() => navigation.navigate('ProviderDetail', { provider: p })}
                  >
                    <Text style={styles.outlineBtnText}>Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => navigation.navigate('BookService', { provider: p })}
                  >
                    <Text style={styles.bookBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Nepal Payment Gateways Assurance Card */}
        <View style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Supported Payments in Nepal</Text>
          <Text style={styles.paymentSub}>
            Transparent direct settlements with automated 10% platform commission management.
          </Text>
          <View style={styles.gatewayRow}>
            <View style={[styles.gatewayPill, { borderColor: '#60bb46' }]}>
              <Text style={[styles.gatewayText, { color: '#15803d' }]}>eSewa ePay</Text>
            </View>
            <View style={[styles.gatewayPill, { borderColor: '#5d2e8e' }]}>
              <Text style={[styles.gatewayText, { color: '#5d2e8e' }]}>Khalti v2</Text>
            </View>
            <View style={[styles.gatewayPill, { borderColor: '#cbd5e1' }]}>
              <Text style={styles.gatewayText}>Cash on Delivery</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1e6fe8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    maxWidth: 140,
  },
  gpsPill: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1e6fe8',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 2,
  },
  modeSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  modeSwitchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  partnerApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  partnerApplyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  radiusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  radiusLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  radiusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  radiusPillActive: {
    backgroundColor: '#1e6fe8',
    borderColor: '#1e6fe8',
  },
  radiusPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  radiusPillTextActive: {
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  liveHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e6fe8',
  },
  resultCount: {
    fontSize: 12,
    color: '#64748b',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    alignItems: 'center',
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 14,
    height: 28,
  },
  categoryCount: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 2,
  },
  providersList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  providerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  providerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  providerAvatar: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
  },
  providerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  providerBio: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  dotSeparator: {
    color: '#cbd5e1',
  },
  distanceBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e6fe8',
  },
  providerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  rateLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  outlineBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  outlineBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  bookBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#1e6fe8',
  },
  bookBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  paymentCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0f172a',
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  paymentSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 16,
  },
  gatewayRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  gatewayPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: '#1e293b',
  },
  gatewayText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f8fafc',
  },
});

