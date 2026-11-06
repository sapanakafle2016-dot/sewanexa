import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/customer/HomeScreen';
import { BookServiceScreen } from '../screens/customer/BookServiceScreen';
import { MyBookingsScreen } from '../screens/customer/MyBookingsScreen';
import { ProviderDashboardScreen } from '../screens/provider/ProviderDashboardScreen';
import { ProviderRegisterScreen } from '../screens/provider/ProviderRegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Account Screen ──────────────────────────────────────────────────────────
// MUST be defined before CustomerTabs to avoid ReferenceError
const AccountScreen = () => {
  const { user, isProvider, switchMode, logout } = useAuth();

  return (
    <View style={accountStyles.container}>
      {/* Profile Card */}
      <View style={accountStyles.card}>
        <View style={accountStyles.avatarCircle}>
          <Text style={accountStyles.avatarText}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={accountStyles.name}>{user?.name || 'SEWANEXA User'}</Text>
        <Text style={accountStyles.phone}>+977 {user?.phoneNumber}</Text>
        <View
          style={[
            accountStyles.roleBadge,
            { backgroundColor: isProvider ? '#ecfdf5' : '#eff6ff' },
          ]}
        >
          <Text
            style={[
              accountStyles.roleText,
              { color: isProvider ? '#047857' : '#1d4ed8' },
            ]}
          >
            {isProvider ? '✓ Registered Service Partner' : 'Customer Account'}
          </Text>
        </View>
      </View>

      {/* Switch to Provider Mode (only if registered provider) */}
      {isProvider && (
        <TouchableOpacity
          style={accountStyles.menuRow}
          onPress={() => switchMode('provider')}
        >
          <Ionicons name="briefcase-outline" size={20} color="#059669" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={accountStyles.menuTitle}>Switch to Provider Mode</Text>
            <Text style={accountStyles.menuSub}>Receive jobs & manage your wallet</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </TouchableOpacity>
      )}

      {/* Become a Partner (if not yet provider) */}
      {!isProvider && (
        <TouchableOpacity
          style={accountStyles.menuRow}
          onPress={() => {}}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color="#1e6fe8" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={accountStyles.menuTitle}>Become a Service Partner</Text>
            <Text style={accountStyles.menuSub}>Register as a professional on SEWANEXA</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={accountStyles.menuRow}
        onPress={() => {}}
      >
        <Ionicons name="help-circle-outline" size={20} color="#64748b" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={accountStyles.menuTitle}>Help & Support</Text>
          <Text style={accountStyles.menuSub}>Contact Sangalo Tech support team</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={accountStyles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={18} color="#dc2626" />
        <Text style={accountStyles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const accountStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    paddingTop: 60,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1e6fe8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, color: '#ffffff', fontWeight: '800' },
  name: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  phone: { fontSize: 13, color: '#64748b', marginTop: 2 },
  roleBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: { fontSize: 11, fontWeight: '700' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  menuTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  menuSub: { fontSize: 11, color: '#64748b', marginTop: 1 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 14,
    marginTop: 'auto',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fca5a5',
    gap: 8,
  },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#dc2626' },
});

// ─── Provider Detail Screen (simple in-nav screen) ───────────────────────────
const ProviderDetailScreen = ({ route, navigation }: any) => {
  const provider = route?.params?.provider;
  if (!provider) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <Ionicons name="alert-circle-outline" size={48} color="#94a3b8" />
        <Text style={{ color: '#64748b', marginTop: 12, fontSize: 15 }}>Provider not found.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ padding: 20 }}>
        {/* Avatar + Name */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: '#1e6fe8',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 32, color: '#fff', fontWeight: '800' }}>
              {provider.name ? provider.name[0] : 'P'}
            </Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#0f172a' }}>{provider.name}</Text>
          <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            {provider.address?.areaName}, {provider.address?.city}
          </Text>
          <View
            style={{
              marginTop: 8,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#eff6ff',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 10,
              gap: 4,
            }}
          >
            <Ionicons name="checkmark-circle" size={14} color="#1e6fe8" />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#1d4ed8' }}>Verified Professional</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 20,
          }}
        >
          {[
            { label: 'Rating', value: `${provider.ratings?.average || 5.0} ⭐` },
            { label: 'Reviews', value: `${provider.ratings?.count || 0}` },
            { label: 'Distance', value: `${provider.distanceInKm || 1} km` },
            { label: 'Base Fee', value: `NPR ${provider.baseRate || 500}` },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                borderRadius: 12,
                padding: 10,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#e2e8f0',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>{stat.value}</Text>
              <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Bio */}
        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 8 }}>About</Text>
          <Text style={{ fontSize: 13, color: '#475569', lineHeight: 20 }}>
            {provider.bio || 'Experienced professional ready to serve you.'}
          </Text>
        </View>

        {/* Skills */}
        {provider.skills && provider.skills.length > 0 && (
          <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 10 }}>Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {provider.skills.map((skill: string, i: number) => (
                <View key={i} style={{ backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#1d4ed8' }}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Book Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#1e6fe8',
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            marginTop: 8,
          }}
          onPress={() => navigation.navigate('BookService', { provider })}
        >
          <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ─── Category Detail Screen ───────────────────────────────────────────────────
const CategoryDetailScreen = ({ route, navigation }: any) => {
  const category = route?.params?.category;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ padding: 20 }}>
        <View
          style={{
            backgroundColor: category?.color || '#1e6fe8',
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Ionicons name={(category?.icon || 'grid') as any} size={40} color="#ffffff" />
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#ffffff', marginTop: 10 }}>
            {category?.name || 'Services'}
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
            {category?.count || 'Multiple'} available
          </Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 }}>
          Find {category?.name} Professionals Near You
        </Text>
        <Text style={{ fontSize: 13, color: '#64748b', lineHeight: 20, marginBottom: 20 }}>
          Browse verified and experienced professionals for all your {category?.name?.toLowerCase()} needs. 
          All providers are verified with identity documents.
        </Text>

        <TouchableOpacity
          style={{ backgroundColor: '#1e6fe8', paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>Search Nearby Professionals</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ─── Customer Tab Navigator ───────────────────────────────────────────────────
// AccountScreen is now defined above, so no ReferenceError
const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1e6fe8',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          borderTopColor: '#e2e8f0',
          backgroundColor: '#ffffff',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color }) => {
          let iconName: any = 'home';
          if (route.name === 'Explore') iconName = 'search';
          else if (route.name === 'MyBookings') iconName = 'calendar';
          else if (route.name === 'Account') iconName = 'person';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explore" component={HomeScreen} />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ title: 'Bookings' }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// ─── Root Navigator ───────────────────────────────────────────────────────────
export const RootNavigator = () => {
  const { user, activeMode, isLoading } = useAuth();

  // Show loading splash while restoring auth session
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e6fe8' }}>
        <Ionicons name="build" size={48} color="#ffffff" />
        <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '800', marginTop: 16, letterSpacing: 1 }}>
          SEWANEXA
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 6 }}>
          Your Local Services, Connected.
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // ── Unauthenticated ──
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : activeMode === 'provider' ? (
          // ── Provider Mode ──
          <Stack.Screen
            name="ProviderDashboard"
            component={ProviderDashboardScreen}
            options={{
              headerShown: true,
              title: 'Provider Dashboard',
              headerStyle: { backgroundColor: '#0f172a' },
              headerTintColor: '#ffffff',
            }}
          />
        ) : (
          // ── Customer Mode ──
          <>
            <Stack.Screen name="CustomerRoot" component={CustomerTabs} />
            <Stack.Screen
              name="BookService"
              component={BookServiceScreen}
              options={{
                headerShown: true,
                title: 'Book Service',
                headerTintColor: '#0f172a',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="ProviderDetail"
              component={ProviderDetailScreen}
              options={{
                headerShown: true,
                title: 'Provider Profile',
                headerTintColor: '#0f172a',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="CategoryDetail"
              component={CategoryDetailScreen}
              options={({ route }: any) => ({
                headerShown: true,
                title: route.params?.category?.name || 'Category',
                headerTintColor: '#0f172a',
                headerBackTitle: 'Back',
              })}
            />
            <Stack.Screen
              name="ProviderRegister"
              component={ProviderRegisterScreen}
              options={{
                headerShown: true,
                title: 'Become a Partner',
                headerTintColor: '#0f172a',
                headerBackTitle: 'Back',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
