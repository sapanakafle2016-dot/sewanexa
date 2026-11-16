import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { mobileApiFetch } from '../../services/api';

const { width } = Dimensions.get('window');

// Official Sewanexa Brand Palette
const COLORS = {
  primary: '#331E6A', // Deep Royal Purple
  primaryDark: '#24154B',
  primaryLight: '#EDE8F7',
  gold: '#F59E0B',
  dark: '#0F172A',
  grayText: '#64748B',
  lightGray: '#F8FAFC',
  cardBg: '#FFFFFF',
  border: '#F1EDF8',
  green: '#10B981',
  amber: '#F59E0B',
};

// 6 Core Featured Categories matching the exact UI design mockup (initial / fallback state)
const MOCKUP_CATEGORIES = [
  {
    id: 'ride',
    name: 'Ride Nearby',
    query: 'Ride',
    iconName: 'car',
    categorySlug: 'vehicle-services',
  },
  {
    id: 'plumber',
    name: 'Plumber',
    query: 'Plumber',
    iconName: 'wrench',
    categorySlug: 'home-maintenance',
  },
  {
    id: 'car-mechanic',
    name: 'Car Mechanic',
    query: 'Mechanic',
    iconName: 'car-wrench',
    categorySlug: 'vehicle-services',
  },
  {
    id: 'painter',
    name: 'Painter',
    query: 'Painter',
    iconName: 'format-paint',
    categorySlug: 'construction-and-labour',
  },
  {
    id: 'cleaner',
    name: 'Cleaner',
    query: 'Cleaner',
    iconName: 'spray-bottle',
    categorySlug: 'home-maintenance',
  },
  {
    id: 'delivery',
    name: 'Delivery',
    query: 'Delivery',
    iconName: 'package-variant-closed',
    categorySlug: 'other-services',
  },
];

const ICON_MAP_MOBILE: Record<string, string> = {
  car: 'car',
  wrench: 'wrench',
  bike: 'motorbike',
  'hard-hat': 'hard-hat',
  paint: 'format-paint',
  paintbrush: 'format-paint',
  zap: 'lightning-bolt',
  fan: 'fan',
  sparkles: 'star-four-points',
  clean: 'spray-bottle',
  hammer: 'hammer',
  droplets: 'water',
  truck: 'truck',
  package: 'package-variant-closed',
  home: 'home',
  camera: 'cctv',
  scissors: 'content-cut',
  heart: 'heart',
  cpu: 'laptop',
  shield: 'shield-check',
  'car-wrench': 'car-wrench',
  'spray-bottle': 'spray-bottle',
  'format-paint': 'format-paint',
  delivery: 'package-variant-closed',
  more: 'dots-horizontal',
  'more-horizontal': 'dots-horizontal',
  users: 'account-group',
  user: 'account',
  flame: 'fire',
  box: 'package-variant-closed',
  layout: 'view-dashboard',
  smile: 'emoticon-happy-outline',
  gift: 'gift',
  book: 'book-open-page-variant',
  activity: 'heart-pulse',
  tag: 'tag',
  monitor: 'monitor',
  smartphone: 'cellphone',
  video: 'video',
  wifi: 'wifi',
  'help-circle': 'help-circle',
  code: 'code-tags',
  'trending-up': 'trending-up',
  flower: 'flower',
  shirt: 'tshirt-crew',
  briefcase: 'briefcase',
  navigation: 'navigation',
  default: 'wrench',
};

const getMobileIcon = (icon?: string, fallback: string = 'wrench') => {
  if (!icon || typeof icon !== 'string') return fallback;
  const key = icon.toLowerCase().trim();
  return ICON_MAP_MOBILE[key] || fallback;
};

// Complete pool of verified providers across core service categories
const SAMPLE_PROVIDERS = [
  {
    _id: '1',
    name: 'Ramesh Sharma',
    trade: 'Master Plumber',
    bio: '10+ yrs master plumber. Rapid leakage, sanitary & overhead water tank repair.',
    skills: ['Plumbing', 'Sanitary', 'Water Tank', 'Plumber', 'Pipe Fitting', 'Tap Repair'],
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
    trade: 'Car & Bike Mechanic',
    bio: 'Certified Bike & Car mechanic with on-demand breakdown assistance across Ring Road.',
    skills: ['Bike Repair', 'Car Servicing', 'Battery Jump', 'Mechanic', 'Puncture', 'Car Mechanic'],
    distanceInKm: 1.4,
    baseRate: 400,
    ratings: { average: 4.8, count: 52 },
    isOnline: true,
    address: { areaName: 'Koteshwor', city: 'Kathmandu' },
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    _id: '3',
    name: 'Sunita Maharjan',
    trade: 'Deep Cleaning Specialist',
    bio: 'Home & office deep cleaning expert with specialized sanitation equipment.',
    skills: ['Deep Cleaning', 'Water Tank', 'Sanitization', 'Cleaner', 'House Cleaning', 'Maid'],
    distanceInKm: 2.8,
    baseRate: 1000,
    ratings: { average: 5.0, count: 29 },
    isOnline: true,
    address: { areaName: 'Patan', city: 'Lalitpur' },
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  },
  {
    _id: '4',
    name: 'Hari Bahadur Shrestha',
    trade: 'Professional Painter',
    bio: 'Interior & exterior painting, texture wall designs, waterproof priming.',
    skills: ['Interior Paint', 'Weathercoat', 'Wall Texture', 'Painter', 'Painting', 'Wall Putty'],
    distanceInKm: 1.9,
    baseRate: 800,
    ratings: { average: 4.9, count: 41 },
    isOnline: true,
    address: { areaName: 'Baneshwor', city: 'Kathmandu' },
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  },
  {
    _id: '5',
    name: 'Pradeep Adhikari',
    trade: 'Certified Electrician',
    bio: 'Residential & commercial wiring, short circuit troubleshooting, switch & MCB setup.',
    skills: ['Electrician', 'Wiring', 'Electric', 'Short Circuit', 'Inverter', 'Fan Repair'],
    distanceInKm: 1.2,
    baseRate: 500,
    ratings: { average: 4.9, count: 46 },
    isOnline: true,
    address: { areaName: 'Maitidevi', city: 'Kathmandu' },
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
  },
  {
    _id: '6',
    name: 'Deepak Karki',
    trade: 'Rapid Ride & Driver',
    bio: 'Verified professional driver with clean taxi & private vehicle for emergency rides.',
    skills: ['Ride', 'Driver', 'Cab', 'Taxi', 'Vehicle', 'Ride Nearby', 'Car Rental'],
    distanceInKm: 0.7,
    baseRate: 300,
    ratings: { average: 4.8, count: 64 },
    isOnline: true,
    address: { areaName: 'Thamel', city: 'Kathmandu' },
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
  },
  {
    _id: '7',
    name: 'Suresh Gurung',
    trade: 'Express Parcel Delivery',
    bio: 'Fast citywide parcel & documents delivery across Kathmandu, Lalitpur & Bhaktapur.',
    skills: ['Delivery', 'Courier', 'Parcel', 'Package', 'Pickup', 'Express Delivery'],
    distanceInKm: 1.5,
    baseRate: 200,
    ratings: { average: 4.9, count: 33 },
    isOnline: true,
    address: { areaName: 'New Road', city: 'Kathmandu' },
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400',
  },
  {
    _id: '8',
    name: 'Santosh Thapa',
    trade: 'Master Carpenter',
    bio: 'Custom furniture repair, door lock installation, modular kitchen fittings & wood carving.',
    skills: ['Carpenter', 'Carpentry', 'Furniture', 'Wood Work', 'Door Lock'],
    distanceInKm: 2.1,
    baseRate: 600,
    ratings: { average: 4.7, count: 28 },
    isOnline: true,
    address: { areaName: 'Kalanki', city: 'Kathmandu' },
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
  {
    _id: '9',
    name: 'Anish Shrestha',
    trade: 'AC & Appliance Tech',
    bio: 'AC servicing & gas refill, refrigerator, washing machine, and microwave repair.',
    skills: ['AC Repair', 'Appliance', 'Refrigerator', 'Washing Machine', 'HVAC', 'Geyser'],
    distanceInKm: 2.5,
    baseRate: 750,
    ratings: { average: 4.8, count: 35 },
    isOnline: true,
    address: { areaName: 'Jhamsikhel', city: 'Lalitpur' },
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  },
];

const matchProviderWithQuery = (p: any, query: string): boolean => {
  if (!query || !query.trim()) return true;
  const lower = query.toLowerCase().trim();
  const stem = lower.replace(/(er|ers|ing|ian|ians|ist|ists)$/i, '');

  const check = (text?: string): boolean => {
    if (!text) return false;
    const t = text.toLowerCase();
    return t.includes(lower) || (stem.length >= 3 && t.includes(stem));
  };

  if (check(p.name)) return true;
  if (check(p.trade)) return true;
  if (check(p.bio)) return true;
  if (check(p.businessName)) return true;
  if (check(p.categorySlug)) return true;
  if (Array.isArray(p.skills) && p.skills.some((s: string) => check(s))) return true;

  return false;
};

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  // Dynamic Categories from API with Mockup fallback
  const [dynamicServices, setDynamicServices] = useState<any[]>(MOCKUP_CATEGORIES);
  const [showAllServices, setShowAllServices] = useState(false);

  // Active GPS Coordinates & Location
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: 27.6715,
    longitude: 85.3582,
  });
  const [currentAddress, setCurrentAddress] = useState('Kathmandu');
  const [exactArea, setExactArea] = useState('Lokanthali Chowk, Madhyapur Thimi, Bhaktapur');
  const [locating, setLocating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState<number>(5);

  // RULE: Don't show Near By Professional initially.
  // Only show after search AND user is logged in!
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilterLabel, setActiveFilterLabel] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Request & Detect Active GPS location
  const detectLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const lat = loc.coords.latitude;
        const lng = loc.coords.longitude;
        setUserCoords({ latitude: lat, longitude: lng });

        const geocode = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        if (geocode && geocode[0]) {
          const place = geocode[0];
          const primary = place.city || place.subregion || place.district || 'Kathmandu';
          const fullDetail = [place.name, place.street, place.subregion || place.district, place.city]
            .filter(Boolean)
            .join(', ');
          setCurrentAddress(primary);
          setExactArea(fullDetail || `${primary}, Nepal`);
        }
      }
    } catch {
      setCurrentAddress('Kathmandu');
      setExactArea('Lokanthali Chowk, Madhyapur Thimi, Bhaktapur');
    } finally {
      setLocating(false);
    }
  };

  const fetchDynamicCategories = async () => {
    try {
      const res = await mobileApiFetch('/categories', { requiresAuth: false });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const servicesList: any[] = [];

        res.data.forEach((cat: any, catIdx: number) => {
          if (!cat) return;
          const catIconName = getMobileIcon(cat.icon, 'wrench');

          if (Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
            cat.subcategories.forEach((sub: any, subIdx: number) => {
              if (!sub) return;
              const subName = typeof sub === 'string' ? sub : (sub.name || 'Service');
              const subIcon = typeof sub === 'object' && sub.icon ? sub.icon : cat.icon;
              servicesList.push({
                id: `sub-${catIdx}-${subIdx}-${sub._id || sub.slug || subIdx}`,
                name: subName,
                query: subName,
                iconName: getMobileIcon(subIcon, catIconName),
                categorySlug: cat.slug || 'service',
                price: typeof sub === 'object' ? sub.suggestedBasePrice : 500,
              });
            });
          } else {
            servicesList.push({
              id: `cat-${catIdx}-${cat._id || cat.slug || catIdx}`,
              name: cat.name || 'Category',
              query: cat.name || '',
              iconName: catIconName,
              categorySlug: cat.slug || 'service',
            });
          }
        });

        if (servicesList.length > 0) {
          setDynamicServices(servicesList);
        }
      }
    } catch (err) {
      // Retain standard mockup categories fallback
      console.warn('API /categories mobile fetch fallback:', err);
    }
  };

  useEffect(() => {
    detectLocation();
    fetchDynamicCategories();
  }, []);

  const openGoogleMapsApp = () => {
    const { latitude, longitude } = userCoords;
    const label = encodeURIComponent(exactArea || 'My Location');
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  const fetchNearbyProviders = async (queryTerm = searchQuery) => {
    setLoading(true);
    const trimmed = (queryTerm || '').trim();
    try {
      const res = await mobileApiFetch(
        `/providers/nearby?longitude=${userCoords.longitude}&latitude=${userCoords.latitude}&radiusKm=${selectedRadius}&searchQuery=${encodeURIComponent(trimmed)}`,
        { requiresAuth: false }
      );
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        // Enforce exact query match so only searched providers are shown
        const matched = trimmed
          ? res.data.filter((p: any) => matchProviderWithQuery(p, trimmed))
          : res.data;
        setProviders(matched);
      } else {
        throw new Error('Fallback to local');
      }
    } catch {
      // Local fallback with verified providers
      if (trimmed) {
        // STRICT: filter by search query. If 0 matches, show empty [] (never fallback to all!)
        const filtered = SAMPLE_PROVIDERS.filter((p) => matchProviderWithQuery(p, trimmed));
        setProviders(filtered);
      } else {
        setProviders(SAMPLE_PROVIDERS);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * CRITICAL ACTION HANDLER:
   * Rule: Check login first!
   * If NOT logged in: Prompt to login.
   * If logged in: Set hasSearched = true, fetch ONLY matching providers, and reveal "Provider Near By".
   */
  const handleTriggerSearch = (term?: string, label?: string) => {
    if (!user) {
      setShowLoginPrompt(true);
      Alert.alert(
        'लगइन आवश्यक (Login Required)',
        'नजिकैका सेवा प्रदायकहरू हेर्न र बुक गर्न कृपया लगइन गर्नुहोस्।',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Login Now',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
      return;
    }

    // User is logged in!
    setShowLoginPrompt(false);
    setHasSearched(true);
    const q = term !== undefined ? term : searchQuery;
    setSearchQuery(q);
    setActiveFilterLabel(label || (q ? `"${q}"` : 'All Verified Trades'));
    fetchNearbyProviders(q);

    // Scroll to results
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 460, animated: true });
    }, 200);
  };

  const handleClearSearch = () => {
    setHasSearched(false);
    setActiveFilterLabel(null);
    setSearchQuery('');
    setProviders([]);
    setIsSearching(false);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ─── 1. TOP STATUS BAR / HEADER ─── */}
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerRightActions}>
          {user ? (
            <TouchableOpacity
              style={styles.userProfilePill}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={styles.userAvatarCircle}>
                <Text style={styles.userAvatarLetter}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </Text>
              </View>
              <Text style={styles.userNameText} numberOfLines={1}>
                {user.name ? user.name.split(' ')[0] : 'User'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.headerLoginBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Ionicons name="person-circle-outline" size={16} color="#FFFFFF" />
              <Text style={styles.headerLoginText}>Login</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => alert('सूचना: सेवाहरू तपाईंको क्षेत्रमा उपलब्ध छन्।')}
          >
            <Ionicons name="notifications-outline" size={22} color="#0F172A" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              detectLocation();
              fetchDynamicCategories();
              if (hasSearched && user) fetchNearbyProviders();
            }}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* ─── 2. ACTIVE DETECTED LOCATION PILL (Tap to refresh GPS) ─── */}
        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={styles.locationPill}
            onPress={detectLocation}
            activeOpacity={0.8}
          >
            <View style={styles.locationPinIcon}>
              <Ionicons name="location-sharp" size={16} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.locationText} numberOfLines={1}>
                  {locating ? 'Detecting GPS...' : currentAddress}
                </Text>
                <View style={styles.gpsPulseDot} />
                <Text style={styles.gpsStatusText}>GPS Active</Text>
              </View>
              <Text style={styles.locationSubText} numberOfLines={1}>
                {exactArea}
              </Text>
            </View>
            <Ionicons name="sync" size={15} color={locating ? COLORS.primary : '#64748B'} />
          </TouchableOpacity>
        </View>

        {/* ─── 3. MAP RADAR CARD (Nearby Professionals & Services) ─── */}
        <TouchableOpacity
          style={styles.mapCard}
          activeOpacity={0.92}
          onPress={() => handleTriggerSearch('', 'Nearby Professionals')}
        >
          {/* Stylized Vector Map Background */}
          <View style={styles.mapCanvas}>
            <View style={[styles.mapPark, { top: 12, left: 16, width: 90, height: 50 }]} />
            <View style={[styles.mapPark, { bottom: 10, right: 24, width: 110, height: 60 }]} />

            <View style={styles.roadDiagonal1} />
            <View style={styles.roadDiagonal2} />
            <View style={styles.roadHorizontal} />
            <View style={styles.roadVertical} />

            <View style={[styles.streetLine, { top: 32, left: 0, right: 0 }]} />
            <View style={[styles.streetLine, { top: 96, left: 0, right: 0 }]} />
            <View style={[styles.streetLineVertical, { left: 80, top: 0, bottom: 0 }]} />
            <View style={[styles.streetLineVertical, { right: 80, top: 0, bottom: 0 }]} />

            {/* Central Radar User Beacon */}
            <View style={styles.radarCenter}>
              <View style={styles.radarWaveOuter} />
              <View style={styles.radarWaveInner} />
              <View style={styles.radarDot}>
                <View style={styles.radarDotCore} />
              </View>
            </View>
          </View>

          {/* Floating Action Pill over the Map */}
          <View style={styles.mapOverlayPill}>
            <Ionicons name="chevron-forward" size={15} color={COLORS.primary} />
            <Text style={styles.mapOverlayText}>Nearby Professionals & Services</Text>
            <Ionicons name="chevron-forward" size={15} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        {/* ─── 4. SERVICE CATEGORY GRID (3 columns x 2 rows, exact mockup) ─── */}
        <View style={styles.gridSection}>
          <View style={styles.categoryGrid}>
            {(showAllServices ? dynamicServices : dynamicServices.slice(0, 6)).map((cat, idx) => (
              <TouchableOpacity
                key={cat.id || `cat-${idx}`}
                style={styles.categoryCard}
                activeOpacity={0.75}
                onPress={() => handleTriggerSearch(cat.query, cat.name)}
              >
                <View style={styles.categoryIconWrap}>
                  <MaterialCommunityIcons
                    name={(cat.iconName || 'wrench') as any}
                    size={36}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.categoryLabel} numberOfLines={2}>
                  {typeof cat.name === 'string' ? cat.name : 'Service'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {dynamicServices.length > 6 && (
            <TouchableOpacity
              style={styles.toggleAllBtn}
              activeOpacity={0.8}
              onPress={() => setShowAllServices(!showAllServices)}
            >
              <Text style={styles.toggleAllBtnText}>
                {showAllServices
                  ? 'Show Top 6 (मुख्य ६ सेवा)'
                  : `View All Services (${dynamicServices.length} सेवाहरू)`}
              </Text>
              <Ionicons
                name={showAllServices ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* ─── 5. FULL WIDTH SEARCH BUTTON / SEARCH BAR ─── */}
        <View style={styles.searchSection}>
          {isSearching ? (
            <View style={styles.activeSearchBar}>
              <Ionicons name="search" size={20} color={COLORS.primary} />
              <TextInput
                style={styles.activeSearchInput}
                placeholder="Search Plumber, Mechanic, Cleaner..."
                placeholderTextColor="#94A3B8"
                autoFocus
                returnKeyType="search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => handleTriggerSearch(searchQuery, searchQuery ? `"${searchQuery}"` : 'All')}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={{ padding: 4 }}
                >
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.searchSubmitBtn}
                onPress={() => handleTriggerSearch(searchQuery, searchQuery ? `"${searchQuery}"` : 'All')}
              >
                <Text style={styles.searchSubmitBtnText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setIsSearching(false);
                }}
                style={{ padding: 4 }}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.searchButton}
              activeOpacity={0.88}
              onPress={() => {
                setIsSearching(true);
              }}
            >
              <Ionicons name="search" size={20} color="#FFFFFF" style={styles.searchBtnIcon} />
              <Text style={styles.searchBtnText}>Search Services</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ─── GUEST LOGIN REQUIRED NOTICE (Shown if guest tries to search) ─── */}
        {!user && showLoginPrompt && (
          <View style={styles.loginRequiredBanner}>
            <View style={styles.loginRequiredIcon}>
              <Ionicons name="lock-closed" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.loginRequiredTitle}>लगइन पछि मात्र प्रदायकहरू देखिनेछन्</Text>
              <Text style={styles.loginRequiredSub}>
                Please login with your mobile number to search and book nearby professionals.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.loginRequiredCta}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginRequiredCtaText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── 6. FEATURE TRUST BADGES ─── */}
        <View style={styles.trustBadgesRow}>
          <View style={styles.trustBadge}>
            <Ionicons name="flash" size={14} color={COLORS.primary} />
            <Text style={styles.trustBadgeText}>Fast & Easy</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustBadge}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.primary} />
            <Text style={styles.trustBadgeText}>Safe & Reliable</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustBadge}>
            <Ionicons name="location" size={14} color={COLORS.primary} />
            <Text style={styles.trustBadgeText}>Nearby Experts</Text>
          </View>
        </View>

        {/* ─── 7. PROVIDER NEAR BY (SHOWN ONLY AFTER SEARCH & LOGIN!) ─── */}
        {hasSearched && user ? (
          <View style={styles.nearbySection}>
            <View style={styles.nearbyHeaderRow}>
              <View style={styles.nearbyTitleGroup}>
                <View style={styles.livePulseDot} />
                <Text style={styles.nearbyTitle}>Provider Near By</Text>
                <View style={styles.activeCountBadge}>
                  <Text style={styles.activeCountText}>{providers.length} Found</Text>
                </View>
              </View>

              <TouchableOpacity onPress={handleClearSearch} style={styles.clearSearchBtn}>
                <Ionicons name="close-circle" size={16} color="#64748B" />
                <Text style={styles.clearSearchText}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Filter Pill */}
            {activeFilterLabel && (
              <View style={styles.activeFilterPill}>
                <Text style={styles.activeFilterText}>
                  Showing results for: <Text style={{ fontWeight: '900', color: COLORS.primary }}>{activeFilterLabel}</Text>
                </Text>
              </View>
            )}

            {/* Distance Filter Selector */}
            <View style={styles.radiusRow}>
              {[1, 2, 5, 10, 20].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.radiusPill,
                    selectedRadius === r && styles.radiusPillActive,
                  ]}
                  onPress={() => {
                    setSelectedRadius(r);
                    fetchNearbyProviders();
                  }}
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

            {/* Providers Cards */}
            <View style={styles.providersList}>
              {providers.length > 0 ? (
                providers.map((p) => (
                  <TouchableOpacity
                    key={p._id}
                    style={styles.providerCard}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('BookService', { provider: p })}
                  >
                    <View style={styles.providerTopRow}>
                      <View style={styles.avatarWrap}>
                        <Image
                          source={{
                            uri:
                              p.avatarUrl ||
                              'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400',
                          }}
                          style={styles.avatarImg}
                        />
                        <View style={styles.onlineBadge} />
                      </View>

                      <View style={styles.providerInfo}>
                        <View style={styles.providerNameRow}>
                          <Text style={styles.providerName}>{p.name}</Text>
                          <Ionicons name="checkmark-circle" size={15} color="#2563EB" />
                        </View>

                        <Text style={styles.providerTrade}>{p.trade || p.skills?.[0]}</Text>
                        <Text style={styles.providerArea}>
                          📍 {p.address?.areaName || 'Local'}, {p.address?.city || 'Valley'}
                        </Text>

                        <View style={styles.providerMeta}>
                          <View style={styles.ratingPill}>
                            <Ionicons name="star" size={12} color="#F59E0B" />
                            <Text style={styles.ratingNum}>
                              {p.ratings?.average || 4.9} ({p.ratings?.count || 24})
                            </Text>
                          </View>
                          <Text style={styles.distText}>• {p.distanceInKm || 1.1} km away</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.providerBottomRow}>
                      <View>
                        <Text style={styles.baseRateLabel}>Starting From</Text>
                        <Text style={styles.baseRateValue}>रु. {p.baseRate || 500}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.bookBtn}
                        onPress={() => navigation.navigate('BookService', { provider: p })}
                      >
                        <Text style={styles.bookBtnText}>Book Now</Text>
                        <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyResultsCard}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons name="search-outline" size={32} color={COLORS.primary} />
                  </View>
                  <Text style={styles.emptyResultsTitle}>कुनै प्रदायक फेला परेन</Text>
                  <Text style={styles.emptyResultsSub}>
                    {activeFilterLabel
                      ? `"${activeFilterLabel}" खोज्दा हाल कुनै प्रदायक फेला परेन। कृपया फरक सेवा खोज्नुहोस् वा दूरी बढाउनुहोस्।`
                      : 'यस दायरामा हाल कुनै प्रदायक उपलब्ध छैन।'}
                  </Text>

                  <View style={styles.emptyActionButtons}>
                    <TouchableOpacity
                      style={styles.emptyRadiusBtn}
                      onPress={() => {
                        setSelectedRadius(20);
                        fetchNearbyProviders(searchQuery);
                      }}
                    >
                      <Ionicons name="compass" size={15} color="#FFFFFF" />
                      <Text style={styles.emptyRadiusBtnText}>दूरी २० किमी बनाउनुहोस् (20km)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.emptyClearBtn}
                      onPress={handleClearSearch}
                    >
                      <Text style={styles.emptyClearBtnText}>खोजी रिसेट गर्नुहोस् (Reset)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        ) : null}

        {/* ─── 8. GOOGLE MAP LIVE LOCATION CARD (MAP ON DOWN) ─── */}
        <View style={styles.googleMapSection}>
          <View style={styles.mapSectionHeader}>
            <View style={styles.mapHeaderLeft}>
              <View style={styles.googlePinCircle}>
                <Ionicons name="map" size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.mapSectionTitle}>तपाईंको सक्रिय स्थान (Live Google Map)</Text>
                <Text style={styles.mapCoordsText}>
                  {userCoords.latitude.toFixed(4)}° N, {userCoords.longitude.toFixed(4)}° E
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.liveGpsBadge} onPress={detectLocation}>
              <View style={styles.pulseGreen} />
              <Text style={styles.liveGpsText}>Live GPS</Text>
            </TouchableOpacity>
          </View>

          {/* Full Interactive Google Map Display Canvas */}
          <View style={styles.googleMapCard}>
            {/* Realistic Google Maps Road & Park Canvas */}
            <View style={styles.gmapCanvas}>
              {/* Park & Forest Areas */}
              <View style={[styles.gmapPark, { top: 10, left: 10, width: 120, height: 70 }]} />
              <View style={[styles.gmapPark, { bottom: 12, right: 16, width: 130, height: 80 }]} />

              {/* Water River / Stream (Bagmati / Hanumante) */}
              <View style={styles.gmapRiver} />

              {/* Highways & Ring Road */}
              <View style={styles.gmapHighwayMain} />
              <View style={styles.gmapHighwayCross} />
              <View style={styles.gmapStreet1} />
              <View style={styles.gmapStreet2} />

              {/* Central User Location Pin */}
              <View style={styles.gmapUserPin}>
                <View style={styles.userPinRipple} />
                <View style={styles.userPinDot}>
                  <Ionicons name="person" size={12} color="#FFFFFF" />
                </View>
                {/* User Location Bubble Tooltip */}
                <View style={styles.userBubble}>
                  <Text style={styles.userBubbleText}>📍 तपाईं यहाँ हुनुहुन्छ (You are here)</Text>
                  <Text style={styles.userBubbleSub} numberOfLines={1}>{exactArea}</Text>
                </View>
              </View>

              {/* Nearby Simulated Live Service Providers on Map */}
              <View style={[styles.mapProMarker, { top: 35, left: '25%' }]}>
                <View style={styles.proMarkerBadge}>
                  <MaterialCommunityIcons name="wrench" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.proMarkerLabel}>Plumber (0.8km)</Text>
              </View>

              <View style={[styles.mapProMarker, { top: 60, right: '20%' }]}>
                <View style={[styles.proMarkerBadge, { backgroundColor: '#D97706' }]}>
                  <MaterialCommunityIcons name="car-wrench" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.proMarkerLabel}>Mechanic (1.2km)</Text>
              </View>

              <View style={[styles.mapProMarker, { bottom: 35, left: '32%' }]}>
                <View style={[styles.proMarkerBadge, { backgroundColor: '#059669' }]}>
                  <MaterialCommunityIcons name="spray-bottle" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.proMarkerLabel}>Cleaning (1.8km)</Text>
              </View>

              <View style={[styles.mapProMarker, { bottom: 25, right: '28%' }]}>
                <View style={[styles.proMarkerBadge, { backgroundColor: '#4F46E5' }]}>
                  <MaterialCommunityIcons name="format-paint" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.proMarkerLabel}>Painter (1.5km)</Text>
              </View>
            </View>

            {/* Map Action Bottom Bar */}
            <View style={styles.mapActionFooter}>
              <TouchableOpacity
                style={styles.openGoogleMapsBtn}
                activeOpacity={0.88}
                onPress={openGoogleMapsApp}
              >
                <Ionicons name="navigate-circle" size={18} color="#FFFFFF" />
                <Text style={styles.openGoogleMapsText}>गुगल म्यापमा खोल्नुहोस् (Open in Google Maps)</Text>
                <Ionicons name="open-outline" size={14} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.refreshLocBtn} onPress={detectLocation}>
                <Ionicons name="locate" size={16} color={COLORS.primary} />
                <Text style={styles.refreshLocText}>GPS पुनः जाँच्नुहोस्</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ─── 9. ESCROW & SECURE PAYMENTS BANNER ─── */}
        <View style={styles.escrowCard}>
          <View style={styles.escrowTitleRow}>
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
            <Text style={styles.escrowTitle}>१००% सुरक्षित भुक्तानी (eSewa & Khalti)</Text>
          </View>
          <Text style={styles.escrowDesc}>
            काम सन्तोषजनक पूरा भएपछि मात्र भुक्तानी। दर्ता नं. ३१०८९२ – साङ्गालो टेक प्रा.लि.
          </Text>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 24,
  },

  /* 1. Header */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 140,
    height: 38,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1EDF8',
    paddingLeft: 4,
    paddingRight: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  userAvatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarLetter: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  userNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    maxWidth: 70,
  },
  headerLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  headerLoginText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  /* 2. Location */
  locationContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  locationPinIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EDE8F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  locationSubText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  gpsPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  gpsStatusText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#059669',
  },

  /* 3. Map Radar Card */
  mapCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    height: 146,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
    shadowColor: '#331E6A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  mapCanvas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EEF3F5',
  },
  mapPark: {
    position: 'absolute',
    backgroundColor: '#D7ECD8',
    borderRadius: 16,
  },
  roadDiagonal1: {
    position: 'absolute',
    top: -30,
    left: 20,
    width: 14,
    height: 220,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '42deg' }],
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  roadDiagonal2: {
    position: 'absolute',
    top: -20,
    right: 30,
    width: 12,
    height: 220,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-35deg' }],
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  roadHorizontal: {
    position: 'absolute',
    top: 65,
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '52%',
    width: 12,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  streetLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  streetLineVertical: {
    position: 'absolute',
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },

  /* Radar Beacon */
  radarCenter: {
    position: 'absolute',
    top: 48,
    left: '50%',
    marginLeft: -24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarWaveOuter: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(51, 30, 106, 0.15)',
  },
  radarWaveInner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(51, 30, 106, 0.25)',
  },
  radarDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  radarDotCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
  },

  /* Overlay Pill */
  mapOverlayPill: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    gap: 6,
  },
  mapOverlayText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* 4. Service Categories Grid */
  gridSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: (width - 40 - 24) / 3,
    height: 108,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F1EDF8',
    paddingHorizontal: 6,
    paddingVertical: 10,
    shadowColor: '#331E6A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIconWrap: {
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E1B4B',
    textAlign: 'center',
  },
  toggleAllBtn: {
    marginTop: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1EDF8',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2D9F3',
  },
  toggleAllBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#331E6A',
  },

  /* 5. Search Services Bar */
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  searchBtnIcon: {
    marginRight: 2,
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  activeSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 14,
    gap: 10,
  },
  activeSearchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  searchSubmitBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  searchSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  /* Login Notice Banner */
  loginRequiredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: '#1E1B4B',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4338CA',
    gap: 12,
  },
  loginRequiredIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4338CA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginRequiredTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  loginRequiredSub: {
    fontSize: 11,
    color: '#C7D2FE',
    marginTop: 2,
    lineHeight: 15,
  },
  loginRequiredCta: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  loginRequiredCtaText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },

  /* 6. Feature Trust Strip */
  trustBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trustBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E2E8F0',
  },

  /* 7. Nearby Active Professionals */
  nearbySection: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 14,
  },
  nearbyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nearbyTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  nearbyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  activeCountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  clearSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  clearSearchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  activeFilterPill: {
    backgroundColor: '#EDE8F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 10,
  },
  activeFilterText: {
    fontSize: 11,
    color: '#4C1D95',
    fontWeight: '600',
  },
  radiusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  radiusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  radiusPillActive: {
    backgroundColor: COLORS.primary,
  },
  radiusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  radiusPillTextActive: {
    color: '#FFFFFF',
  },
  providersList: {
    gap: 12,
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F1EDF8',
    padding: 14,
    shadowColor: '#331E6A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  providerTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarImg: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  providerInfo: {
    flex: 1,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  providerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  providerTrade: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 1,
  },
  providerArea: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  providerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingNum: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  distText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  providerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  baseRateLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  baseRateValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  /* Empty Search Results Card */
  emptyResultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F1EDF8',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EDE8F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyResultsTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptyResultsSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  emptyActionButtons: {
    width: '100%',
    gap: 8,
  },
  emptyRadiusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  emptyRadiusBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyClearBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 14,
  },
  emptyClearBtnText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },

  /* 8. GOOGLE MAP LIVE LOCATION CARD (MAP ON DOWN) */
  googleMapSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  mapSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mapHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  googlePinCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EA4335', // Google Red
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA4335',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  mapSectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  mapCoordsText: {
    fontSize: 10.5,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 1,
  },
  liveGpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pulseGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  liveGpsText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  googleMapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  gmapCanvas: {
    height: 220,
    backgroundColor: '#F3F6F8',
    position: 'relative',
    overflow: 'hidden',
  },
  gmapPark: {
    position: 'absolute',
    backgroundColor: '#CEEAD6',
    borderRadius: 24,
  },
  gmapRiver: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '42%',
    width: 22,
    backgroundColor: '#C2E0FF',
    transform: [{ rotate: '18deg' }],
  },
  gmapHighwayMain: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: '#FDE293', // Google Highway Yellow
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8EAED',
  },
  gmapHighwayCross: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    left: '52%',
    width: 14,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E8EAED',
    transform: [{ rotate: '-25deg' }],
  },
  gmapStreet1: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#FFFFFF',
  },
  gmapStreet2: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#FFFFFF',
  },

  /* User Location Center Pin */
  gmapUserPin: {
    position: 'absolute',
    top: '44%',
    left: '50%',
    marginLeft: -16,
    marginTop: -16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPinRipple: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(51, 30, 106, 0.2)',
  },
  userPinDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userBubble: {
    position: 'absolute',
    top: -46,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    width: 190,
  },
  userBubbleText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  userBubbleSub: {
    color: '#94A3B8',
    fontSize: 8.5,
  },

  /* Nearby Provider Map Pins */
  mapProMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  proMarkerBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  proMarkerLabel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 6,
    fontSize: 8.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  /* Map Action Bottom Bar */
  mapActionFooter: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  openGoogleMapsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA4335', // Google Red
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#EA4335',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  openGoogleMapsText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  refreshLocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1EDF8',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  refreshLocText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },

  /* 9. Escrow Assurance */
  escrowCard: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  escrowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  escrowTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  escrowDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 15,
  },
});
