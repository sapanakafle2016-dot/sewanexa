import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/customer/HomeScreen';
import { BookServiceScreen } from '../screens/customer/BookServiceScreen';
import { MyBookingsScreen } from '../screens/customer/MyBookingsScreen';
import { FavoritesScreen } from '../screens/customer/FavoritesScreen';
import { ProviderDashboardScreen } from '../screens/provider/ProviderDashboardScreen';
import { ProviderRegisterScreen } from '../screens/provider/ProviderRegisterScreen';

// Sewanexa Brand Theme
const BRAND_PURPLE = '#331E6A';
const BRAND_GOLD = '#F59E0B';
const PATHAO_RED = BRAND_PURPLE; // Unified primary color across mobile
const PATHAO_DARK = '#111827';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Pathao-Style Account Screen ─────────────────────────────────────────────
const AccountScreen = ({ navigation }: any) => {
  const { user, isProvider, switchMode, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'लगआउट (Log Out)',
      'के तपाईं Sewanexa बाट बाहिर निस्कन चाहनुहुन्छ?',
      [
        { text: 'रद्द गर्नुहोस् (Cancel)', style: 'cancel' },
        {
          text: 'लगआउट (Log Out)',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (err) {
              console.warn('Logout error:', err);
            }
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={accountStyles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Card / Guest Card */}
      {!user ? (
        <View style={accountStyles.guestCard}>
          <View style={accountStyles.guestIconCircle}>
            <Ionicons name="person-outline" size={32} color={BRAND_PURPLE} />
          </View>
          <Text style={accountStyles.guestTitle}>नमस्ते! (Welcome)</Text>
          <Text style={accountStyles.guestSubtitle}>
            नजिकैका दक्ष प्राविधिकहरू खोज्न, बुक गर्न र अर्डर ट्र्याक गर्न कृपया लगइन गर्नुहोस्।
          </Text>
          <TouchableOpacity
            style={accountStyles.loginBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
            <Text style={accountStyles.loginBtnText}>Login / Register (लगइन)</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={accountStyles.card}>
          <View style={accountStyles.avatarCircle}>
            <Text style={accountStyles.avatarText}>
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={accountStyles.name}>{user.name || 'SEWANEXA Customer'}</Text>
          <Text style={accountStyles.phone}>+977 {user.phoneNumber}</Text>
          <View
            style={[
              accountStyles.roleBadge,
              { backgroundColor: isProvider ? '#DCFCE7' : '#EDE8F7' },
            ]}
          >
            <Text
              style={[
                accountStyles.roleText,
                { color: isProvider ? '#16A34A' : BRAND_PURPLE },
              ]}
            >
              {isProvider ? '✓ Registered Service Partner' : 'Customer Account'}
            </Text>
          </View>
        </View>
      )}

      {/* Switch to Provider Mode */}
      {isProvider ? (
        <TouchableOpacity
          style={accountStyles.menuRow}
          onPress={() => switchMode('provider')}
        >
          <View style={[accountStyles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="briefcase" size={20} color="#16A34A" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={accountStyles.menuTitle}>Switch to Provider Mode</Text>
            <Text style={accountStyles.menuSub}>Receive jobs & check wallet balance</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={accountStyles.menuRow}
          onPress={() => (user ? navigation.navigate('ProviderRegister') : navigation.navigate('Login'))}
        >
          <View style={[accountStyles.iconCircle, { backgroundColor: '#EDE8F7' }]}>
            <Ionicons name="shield-checkmark" size={20} color={BRAND_PURPLE} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={accountStyles.menuTitle}>Become a Service Partner</Text>
            <Text style={accountStyles.menuSub}>Earn daily in your local neighborhood</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}

      {/* Quick Links */}
      <TouchableOpacity
        style={accountStyles.menuRow}
        onPress={() => (user ? navigation.navigate('MyBookings') : navigation.navigate('Login'))}
      >
        <View style={[accountStyles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
          <Ionicons name="receipt" size={20} color="#2563EB" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={accountStyles.menuTitle}>My Bookings & History</Text>
          <Text style={accountStyles.menuSub}>Track accepted jobs & payments</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={accountStyles.menuRow}
        onPress={() => {}}
      >
        <View style={[accountStyles.iconCircle, { backgroundColor: '#F3F4F6' }]}>
          <Ionicons name="help-buoy" size={20} color="#4B5563" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={accountStyles.menuTitle}>Support & Helpline</Text>
          <Text style={accountStyles.menuSub}>Sangalo Tech Pvt. Ltd., Lokanthali</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Logout (Only shown when user is logged in) */}
      {user ? (
        <TouchableOpacity style={accountStyles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={accountStyles.logoutText}>Log Out (लगआउट)</Text>
        </TouchableOpacity>
      ) : null}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const accountStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
    paddingTop: 50,
  },
  guestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE8F4',
    marginBottom: 16,
    shadowColor: '#331E6A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  guestIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1EDF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E1B4B',
  },
  guestSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND_PURPLE,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    gap: 8,
    width: '100%',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  loginBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: PATHAO_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, color: '#FFFFFF', fontWeight: '900' },
  name: { fontSize: 18, fontWeight: '900', color: PATHAO_DARK },
  phone: { fontSize: 13, color: '#6B7280', marginTop: 2, fontWeight: '500' },
  roleBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  roleText: { fontSize: 11, fontWeight: '800' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: { fontSize: 14, fontWeight: '800', color: PATHAO_DARK },
  menuSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    gap: 8,
  },
  logoutText: { fontSize: 14, fontWeight: '800', color: '#DC2626' },
});

// ─── Provider Detail Screen ───────────────────────────────────────────────────
const ProviderDetailScreen = ({ route, navigation }: any) => {
  const provider = route?.params?.provider;
  if (!provider) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
        <Text style={{ color: '#6B7280', marginTop: 12, fontSize: 15 }}>Provider profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <View style={{ padding: 16 }}>
        {/* Profile Card */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: 20,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 28,
              backgroundColor: PATHAO_DARK,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 32, color: '#FFFFFF', fontWeight: '900' }}>
              {provider.name ? provider.name[0] : 'P'}
            </Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '900', color: PATHAO_DARK }}>{provider.name}</Text>
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4, fontWeight: '500' }}>
            {provider.address?.areaName}, {provider.address?.city}
          </Text>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#EFF6FF',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 12,
              gap: 4,
            }}
          >
            <Ionicons name="checkmark-circle" size={14} color="#2563EB" />
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#1D4ED8' }}>Citizenship Verified Pro</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Rating', value: `${provider.ratings?.average || 4.9} ⭐` },
            { label: 'Completed', value: `${provider.ratings?.count || 24}+` },
            { label: 'Distance', value: `${provider.distanceInKm || 1.1} km` },
            { label: 'Base Fee', value: `NPR ${provider.baseRate || 500}` },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 10,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '900', color: PATHAO_DARK }}>{stat.value}</Text>
              <Text style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2, fontWeight: '600' }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* About */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 14 }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: PATHAO_DARK, marginBottom: 6 }}>About</Text>
          <Text style={{ fontSize: 13, color: '#4B5563', lineHeight: 19 }}>
            {provider.bio || 'Experienced trade professional ready for prompt local dispatch.'}
          </Text>
        </View>

        {/* Skills */}
        {provider.skills && provider.skills.length > 0 && (
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: PATHAO_DARK, marginBottom: 10 }}>Specialized Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {provider.skills.map((skill: string, i: number) => (
                <View key={i} style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#374151' }}>✓ {skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Pathao Red Action Button */}
        <TouchableOpacity
          style={{
            backgroundColor: PATHAO_RED,
            paddingVertical: 16,
            borderRadius: 20,
            alignItems: 'center',
            shadowColor: PATHAO_RED,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={() => navigation.navigate('BookService', { provider })}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '900' }}>Proceed to Book (NPR {provider.baseRate || 500})</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ─── Category Detail Screen ───────────────────────────────────────────────────
const CategoryDetailScreen = ({ route, navigation }: any) => {
  const category = route?.params?.category;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <View style={{ padding: 16 }}>
        <View
          style={{
            backgroundColor: PATHAO_DARK,
            borderRadius: 24,
            padding: 24,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: PATHAO_RED,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Ionicons name={(category?.icon || 'construct') as any} size={32} color="#FFFFFF" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '900', color: '#FFFFFF' }}>
            {category?.name || 'Category'}
          </Text>
          <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
            {category?.subTitle || 'Local Experts Nearby'}
          </Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '800', color: PATHAO_DARK, marginBottom: 8 }}>
          Available Professionals
        </Text>
        <Text style={{ fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 20 }}>
          Connecting you with active, verified workers in your immediate locality across Nepal.
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: PATHAO_RED,
            paddingVertical: 15,
            borderRadius: 20,
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '900' }}>Search Available Nearby</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ─── Sewanexa Modern 4-Tab Bottom Navigator ──────────────────────────────────
const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: BRAND_PURPLE,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          borderTopColor: '#F1F5F9',
          borderTopWidth: 1.5,
          backgroundColor: '#FFFFFF',
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: '#331E6A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: any = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Bookings') iconName = focused ? 'bookmark' : 'bookmark-outline';
          else if (route.name === 'Favorites') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen
        name="Bookings"
        component={MyBookingsScreen}
        options={{ title: 'Bookings' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <Tab.Screen
        name="Profile"
        component={AccountScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// ─── Root Navigator ───────────────────────────────────────────────────────────
export const RootNavigator = () => {
  const { user, activeMode, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BRAND_PURPLE }}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 24,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 180, height: 54 }}
            resizeMode="contain"
          />
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 16, fontWeight: '700' }}>
          एप एक, सेवा अनेक।
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {activeMode === 'provider' && user ? (
          <Stack.Screen
            name="ProviderDashboard"
            component={ProviderDashboardScreen}
            options={{
              headerShown: true,
              title: 'Provider Partner Hub',
              headerStyle: { backgroundColor: PATHAO_DARK },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: { fontWeight: '900' },
            }}
          />
        ) : (
          <Stack.Group>
            <Stack.Screen name="CustomerRoot" component={CustomerTabs} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="BookService"
              component={BookServiceScreen}
              options={{
                headerShown: true,
                title: 'Book Service',
                headerTintColor: PATHAO_DARK,
                headerTitleStyle: { fontWeight: '900' },
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="ProviderDetail"
              component={ProviderDetailScreen}
              options={{
                headerShown: true,
                title: 'Provider Profile',
                headerTintColor: PATHAO_DARK,
                headerTitleStyle: { fontWeight: '900' },
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="CategoryDetail"
              component={CategoryDetailScreen}
              options={({ route }: any) => ({
                headerShown: true,
                title: route.params?.category?.name || 'Category',
                headerTintColor: PATHAO_DARK,
                headerTitleStyle: { fontWeight: '900' },
                headerBackTitle: 'Back',
              })}
            />
            <Stack.Screen
              name="ProviderRegister"
              component={ProviderRegisterScreen}
              options={{
                headerShown: true,
                title: 'Become a Partner',
                headerTintColor: PATHAO_DARK,
                headerTitleStyle: { fontWeight: '900' },
                headerBackTitle: 'Back',
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
