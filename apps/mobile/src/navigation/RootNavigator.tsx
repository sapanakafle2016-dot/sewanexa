import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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

// Customer Tab Navigator
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
        tabBarIcon: ({ color, size }) => {
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

// Simple User Profile / Mode switch screen
const AccountScreen = () => {
  const { user, isProvider, switchMode, logout } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc', padding: 20 }}>
      <View
        style={{
          backgroundColor: '#ffffff',
          padding: 24,
          borderRadius: 20,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          marginTop: 40,
        }}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: '#1e6fe8',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 28, color: '#ffffff', fontWeight: '800' }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </Text>
        </View>

        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a' }}>
          {user?.name || 'SEWANEXA Customer'}
        </Text>
        <Text style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
          +977 {user?.phoneNumber}
        </Text>

        <View
          style={{
            marginTop: 16,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: isProvider ? '#ecfdf5' : '#eff6ff',
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: isProvider ? '#047857' : '#1d4ed8',
            }}
          >
            {isProvider ? 'Registered Service Partner' : 'Customer Account'}
          </Text>
        </View>
      </View>

      {isProvider && (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: 16,
            borderRadius: 16,
            marginTop: 16,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            gap: 12,
          }}
          onPress={() => switchMode('provider')}
        >
          <Ionicons name="briefcase" size={20} color="#059669" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}>
              Switch to Provider Mode
            </Text>
            <Text style={{ fontSize: 11, color: '#64748b' }}>
              Receive jobs & check commission wallet
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fef2f2',
          padding: 16,
          borderRadius: 16,
          marginTop: 'auto',
          borderWidth: 1,
          borderColor: '#fca5a5',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 20,
        }}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={18} color="#dc2626" />
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#dc2626' }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const RootNavigator = () => {
  const { user, activeMode } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : activeMode === 'provider' ? (
          <Stack.Screen name="ProviderDashboard" component={ProviderDashboardScreen} />
        ) : (
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

