import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mobileApiFetch } from '../../services/api';

export const MyBookingsScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await mobileApiFetch('/bookings/my?role=customer');
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      // Mock sample bookings for offline testing
      setBookings([
        {
          _id: 'b1',
          bookingCode: 'SWX-2026-10492',
          subCategoryId: { name: 'Plumbing Services' },
          categoryId: { name: 'Home Maintenance' },
          status: 'accepted',
          scheduledTime: new Date().toISOString(),
          address: { areaName: 'Lokanthali', city: 'Bhaktapur' },
          payment: { method: 'cash', totalAmount: 500, status: 'pending' },
          description: 'Emergency leak repair in kitchen washbasin valve.',
        },
        {
          _id: 'b2',
          bookingCode: 'SWX-2026-09821',
          subCategoryId: { name: 'Bike Mechanic' },
          categoryId: { name: 'Vehicle Services' },
          status: 'completed',
          scheduledTime: new Date(Date.now() - 86400000).toISOString(),
          address: { areaName: 'Koteshwor', city: 'Kathmandu' },
          payment: { method: 'esewa', totalAmount: 400, status: 'completed' },
          description: 'Carburetor cleaning and spark plug check.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return { label: 'Requested', bg: '#fef3c7', text: '#d97706' };
      case 'accepted':
        return { label: 'Accepted', bg: '#e0f2fe', text: '#0284c7' };
      case 'en_route':
        return { label: 'En Route', bg: '#ede9fe', text: '#7c3aed' };
      case 'in_progress':
        return { label: 'In Progress', bg: '#fef3c7', text: '#b45309' };
      case 'completed':
        return { label: 'Completed', bg: '#dcfce7', text: '#15803d' };
      case 'cancelled':
        return { label: 'Cancelled', bg: '#fee2e2', text: '#b91c1c' };
      default:
        return { label: status, bg: '#f1f5f9', text: '#475569' };
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active') return b.status !== 'completed' && b.status !== 'cancelled';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.tabRow}>
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, filter === tab && styles.tabBtnActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
              {tab === 'all' ? 'All' : tab === 'active' ? 'Active Jobs' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchBookings} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No Bookings Found</Text>
            <Text style={styles.emptyText}>
              You haven't requested any services in this section yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const badge = getStatusBadge(item.status);
          return (
            <View style={styles.bookingCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.codeText}>{item.bookingCode}</Text>
                  <Text style={styles.serviceTitle}>
                    {item.subCategoryId?.name || 'Local Service'}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.statusText, { color: badge.text }]}>
                    {badge.label}
                  </Text>
                </View>
              </View>

              <Text style={styles.descText} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={14} color="#64748b" />
                  <Text style={styles.detailText}>
                    {item.address?.areaName}, {item.address?.city}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="cash-outline" size={14} color="#64748b" />
                  <Text style={styles.detailText}>
                    NPR {item.payment?.totalAmount} ({item.payment?.method?.toUpperCase()})
                  </Text>
                </View>
              </View>

              {item.status === 'completed' && (
                <TouchableOpacity
                  style={styles.reviewBtn}
                  onPress={() => navigation.navigate('ReviewBooking', { booking: item })}
                >
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text style={styles.reviewBtnText}>Rate & Review Service</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  tabBtnActive: {
    backgroundColor: '#1e6fe8',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  codeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e6fe8',
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  descText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 12,
    gap: 6,
  },
  reviewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
});

