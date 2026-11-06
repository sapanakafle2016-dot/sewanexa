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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mobileApiFetch } from '../../services/api';

export const BookServiceScreen = ({ route, navigation }: any) => {
  const { provider } = route.params || {};

  const [address, setAddress] = useState('Lokanthali, Bhaktapur');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('Today at 4:00 PM');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'esewa' | 'khalti'>('cash');
  const [loading, setLoading] = useState(false);

  const estimatedAmount = provider?.baseRate || 500;

  const handleBooking = async () => {
    if (description.length < 10) {
      Alert.alert('Details Required', 'Please provide at least 10 characters describing the issue or service needed.');
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
          'Booking Confirmed!',
          `Your service request ${res.booking?.bookingCode || ''} has been sent to ${provider?.name || 'the professional'}. They will contact you shortly.`,
          [{ text: 'View Bookings', onPress: () => navigation.navigate('MyBookings') }]
        );
      }
    } catch (err: any) {
      Alert.alert('Booking Error', err.message || 'Unable to place booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Provider Summary Banner */}
      <View style={styles.providerBanner}>
        <View style={styles.providerAvatarPlaceholder}>
          <Ionicons name="person" size={24} color="#1e6fe8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.providerName}>{provider?.name || 'Selected Service Partner'}</Text>
          <Text style={styles.providerBio}>{provider?.bio || 'Certified Trade Professional'}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text style={styles.ratingText}>
              {provider?.ratings?.average || 4.9} • {provider?.distanceInKm || 1.2} km away
            </Text>
          </View>
        </View>
      </View>

      {/* Service Location Input */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Service Address</Text>
        <View style={styles.inputRow}>
          <Ionicons name="location" size={18} color="#1e6fe8" />
          <TextInput
            style={styles.textInput}
            value={address}
            onChangeText={setAddress}
            placeholder="House/Street, Area, City"
          />
        </View>
      </View>

      {/* Scheduled Time */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Preferred Time</Text>
        <View style={styles.inputRow}>
          <Ionicons name="time" size={18} color="#1e6fe8" />
          <TextInput
            style={styles.textInput}
            value={scheduledDate}
            onChangeText={setScheduledDate}
            placeholder="E.g., Today at 3:00 PM"
          />
        </View>
      </View>

      {/* Problem Description */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Describe Service or Problem</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          placeholder="E.g. Leaking pipe under kitchen sink, need urgent repair and replacement of valve."
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* Payment Method Selector */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Payment Method</Text>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod('cash')}
        >
          <View style={styles.radioCircle}>
            {paymentMethod === 'cash' && <View style={styles.radioInner} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentName}>Cash on Service (Recommended)</Text>
            <Text style={styles.paymentDesc}>Pay directly to provider after satisfactory service</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'esewa' && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod('esewa')}
        >
          <View style={styles.radioCircle}>
            {paymentMethod === 'esewa' && <View style={styles.radioInner} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.paymentName, { color: '#15803d' }]}>eSewa ePay</Text>
            <Text style={styles.paymentDesc}>Instant digital wallet transfer via eSewa v2</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'khalti' && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod('khalti')}
        >
          <View style={styles.radioCircle}>
            {paymentMethod === 'khalti' && <View style={styles.radioInner} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.paymentName, { color: '#5d2e8e' }]}>Khalti</Text>
            <Text style={styles.paymentDesc}>Fast digital payment via Khalti ePayment</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Pricing Breakdown */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Bill Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Estimated Base Service Charge</Text>
          <Text style={styles.summaryValue}>NPR {estimatedAmount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Platform Booking Fee</Text>
          <Text style={[styles.summaryValue, { color: '#16a34a' }]}>FREE</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.totalValue}>NPR {estimatedAmount}</Text>
        </View>
        <Text style={styles.commissionNotice}>
          * A 10% platform commission is settled transparently between SEWANEXA and the service partner.
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
        disabled={loading}
        onPress={handleBooking}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.confirmBtnText}>Confirm Service Request</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  providerBanner: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 12,
  },
  providerAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  providerBio: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    gap: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 13,
    color: '#0f172a',
  },
  textArea: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    fontSize: 13,
    color: '#0f172a',
    minHeight: 90,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
    gap: 12,
  },
  paymentOptionActive: {
    borderColor: '#1e6fe8',
    backgroundColor: '#eff6ff',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94a3b8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1e6fe8',
  },
  paymentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  paymentDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e6fe8',
  },
  commissionNotice: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 8,
    lineHeight: 14,
  },
  confirmBtn: {
    backgroundColor: '#1e6fe8',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#1e6fe8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});

