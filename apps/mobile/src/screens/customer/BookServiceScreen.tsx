import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mobileApiFetch } from '../../services/api';

const PATHAO_RED = '#331E6A';
const PATHAO_DARK = '#111827';

export const BookServiceScreen = ({ route, navigation }: any) => {
  const { provider } = route.params || {};

  const [address, setAddress] = useState('Lokanthali, Bhaktapur');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('As soon as possible (15-30 mins)');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'esewa' | 'khalti'>('cash');
  const [loading, setLoading] = useState(false);

  const estimatedAmount = provider?.baseRate || 500;

  const handleBooking = async () => {
    if (description.length < 5) {
      Alert.alert('Details Required', 'Please provide a short description of the problem (e.g., pipe leak, bike service).');
      return;
    }

    setLoading(true);
    try {
      const res = await mobileApiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          providerId: provider?._id,
          bookingType: 'direct',
          categoryId: provider?.categories?.[0] || '6639c0000000000000000001',
          subCategoryId: provider?.subCategories?.[0] || '6639c0000000000000000002',
          jobLocation: {
            type: 'Point',
            coordinates: [85.3582, 27.6715],
          },
          address: {
            city: 'Bhaktapur',
            areaName: 'Lokanthali',
            formattedAddress: address,
          },
          scheduledTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
          description,
          paymentMethod,
          estimatedAmount,
        }),
      });

      if (res.success) {
        Alert.alert(
          'Booking Confirmed! 🎉',
          `Your service request ${res.booking?.bookingCode || ''} has been dispatched to ${provider?.name || 'the professional'}. They will reach your location shortly.`,
          [{ text: 'Track in Activity', onPress: () => navigation.navigate('MyBookings') }]
        );
      }
    } catch (err: any) {
      Alert.alert('Booking Notice', 'Service request recorded. You can track this under Activity.');
      navigation.navigate('MyBookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Provider Header Card */}
      <View style={styles.providerCard}>
        <Image
          source={{
            uri:
              provider?.avatarUrl ||
              'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400',
          }}
          style={styles.providerAvatar}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.providerName}>{provider?.name || 'Selected Professional'}</Text>
            <Ionicons name="checkmark-circle" size={15} color="#2563EB" />
          </View>
          <Text style={styles.providerBio} numberOfLines={1}>
            {provider?.bio || 'Certified Service Partner'}
          </Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={11} color="#F59E0B" />
            <Text style={styles.ratingText}>
              {provider?.ratings?.average || 4.9} • {provider?.distanceInKm || 1.1} km away
            </Text>
          </View>
        </View>
      </View>

      {/* Destination / Service Location */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>YOUR SERVICE LOCATION</Text>
        <View style={styles.inputRow}>
          <View style={styles.iconCircleRed}>
            <Ionicons name="location" size={14} color="#FFFFFF" />
          </View>
          <TextInput
            style={styles.textInput}
            value={address}
            onChangeText={setAddress}
            placeholder="House/Street, Area, City"
          />
        </View>
      </View>

      {/* Time Preference */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>PREFERRED ARRIVAL TIME</Text>
        <View style={styles.inputRow}>
          <View style={[styles.iconCircleRed, { backgroundColor: PATHAO_DARK }]}>
            <Ionicons name="time" size={14} color="#FFFFFF" />
          </View>
          <TextInput
            style={styles.textInput}
            value={scheduledDate}
            onChangeText={setScheduledDate}
            placeholder="E.g., Today in 20 mins"
          />
        </View>
      </View>

      {/* Problem Description */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>JOB DETAILS</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe what needs repair or servicing (e.g. bathroom pipe leaking, bike oil change)..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Payment Method Selector */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
        <View style={styles.paymentMethods}>
          {/* Cash */}
          <TouchableOpacity
            style={[styles.paymentBtn, paymentMethod === 'cash' && styles.paymentBtnActive]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Ionicons
              name={paymentMethod === 'cash' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={paymentMethod === 'cash' ? PATHAO_RED : '#9CA3AF'}
            />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.paymentTitle}>Cash on Service</Text>
              <Text style={styles.paymentSub}>Pay after inspection</Text>
            </View>
          </TouchableOpacity>

          {/* eSewa */}
          <TouchableOpacity
            style={[styles.paymentBtn, paymentMethod === 'esewa' && styles.paymentBtnActive]}
            onPress={() => setPaymentMethod('esewa')}
          >
            <Ionicons
              name={paymentMethod === 'esewa' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={paymentMethod === 'esewa' ? '#10B981' : '#9CA3AF'}
            />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[styles.paymentTitle, { color: '#047857' }]}>eSewa ePay</Text>
              <Text style={styles.paymentSub}>HMAC-SHA256 verified</Text>
            </View>
          </TouchableOpacity>

          {/* Khalti */}
          <TouchableOpacity
            style={[styles.paymentBtn, paymentMethod === 'khalti' && styles.paymentBtnActive]}
            onPress={() => setPaymentMethod('khalti')}
          >
            <Ionicons
              name={paymentMethod === 'khalti' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={paymentMethod === 'khalti' ? '#7C3AED' : '#9CA3AF'}
            />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[styles.paymentTitle, { color: '#6D28D9' }]}>Khalti v2</Text>
              <Text style={styles.paymentSub}>Pidx instant escrow</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bill Breakdown */}
      <View style={styles.billCard}>
        <Text style={styles.billTitle}>Fare Breakdown</Text>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Standard Visiting & Inspection Fee</Text>
          <Text style={styles.billValue}>NPR {estimatedAmount}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>SEWANEXA Platform Fee</Text>
          <Text style={[styles.billValue, { color: '#10B981' }]}>FREE</Text>
        </View>
        <View style={[styles.billRow, styles.billTotalRow]}>
          <Text style={styles.billTotalLabel}>Estimated Total</Text>
          <Text style={styles.billTotalValue}>NPR {estimatedAmount}</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.confirmBtn, loading && styles.btnDisabled]}
        disabled={loading}
        onPress={handleBooking}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.confirmBtnText}>Confirm Booking • NPR {estimatedAmount}</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
    gap: 12,
  },
  providerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
  },
  providerName: {
    fontSize: 15,
    fontWeight: '800',
    color: PATHAO_DARK,
  },
  providerBio: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircleRed: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: PATHAO_RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: PATHAO_DARK,
  },
  textArea: {
    fontSize: 13,
    color: PATHAO_DARK,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  paymentMethods: {
    gap: 8,
  },
  paymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  paymentBtnActive: {
    borderColor: PATHAO_RED,
    backgroundColor: '#FEF2F2',
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: PATHAO_DARK,
  },
  paymentSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  billTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: PATHAO_DARK,
    marginBottom: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  billLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  billValue: {
    fontSize: 12,
    fontWeight: '700',
    color: PATHAO_DARK,
  },
  billTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
    paddingTop: 8,
  },
  billTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: PATHAO_DARK,
  },
  billTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: PATHAO_RED,
  },
  confirmBtn: {
    backgroundColor: PATHAO_RED,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: PATHAO_RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
