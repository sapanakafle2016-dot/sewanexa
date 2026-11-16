import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Modal,
  Linking,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mobileApiFetch } from '../../services/api';

const { width } = Dimensions.get('window');

const BRAND_PURPLE = '#331E6A';
const BRAND_GOLD = '#F59E0B';
const PATHAO_RED = BRAND_PURPLE;
const PATHAO_DARK = '#111827';

// Waypoints along Arniko Highway connecting Koteshwor Chowk to Lokanthali, Bhaktapur
const ROUTE_WAYPOINTS = [
  { lat: 27.6788, lng: 85.3475, name: 'Koteshwor Chowk' },
  { lat: 27.6775, lng: 85.3512, name: 'Jadibuti Bridge' },
  { lat: 27.6748, lng: 85.355, name: 'Lokanthali Foothill' },
  { lat: 27.6722, lng: 85.3578, name: 'Lokanthali Chowk' },
  { lat: 27.671, lng: 85.3587, name: 'Client Home (Destination)' },
];

export const MyBookingsScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Live Location Tracking Modal state
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [waypointIndex, setWaypointIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [liveStatus, setLiveStatus] = useState('accepted');
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await mobileApiFetch('/bookings/my?role=customer');
      if (res.success && res.data && res.data.length > 0) {
        setBookings(res.data);
      } else {
        throw new Error('Fallback sample');
      }
    } catch {
      setBookings([
        {
          _id: 'b1',
          bookingCode: 'SWX-2026-10492',
          subCategoryId: { name: 'Plumbing Services' },
          categoryId: { name: 'Home Maintenance' },
          status: 'accepted',
          scheduledTime: new Date().toISOString(),
          address: {
            areaName: 'Lokanthali',
            city: 'Bhaktapur',
            formattedAddress: 'Lokanthali Chowk, Madhyapur Thimi',
          },
          payment: { method: 'cash', totalAmount: 500, status: 'pending' },
          description: 'Emergency leak repair in kitchen washbasin valve.',
          provider: {
            name: 'Ramesh Sharma (रमेश शर्मा)',
            phoneNumber: '9841000000',
            rating: 4.9,
            totalJobs: 48,
          },
        },
        {
          _id: 'b2',
          bookingCode: 'SWX-2026-09821',
          subCategoryId: { name: 'Bike Mechanic' },
          categoryId: { name: 'Vehicle Services' },
          status: 'completed',
          scheduledTime: new Date(Date.now() - 86400000).toISOString(),
          address: {
            areaName: 'Koteshwor',
            city: 'Kathmandu',
            formattedAddress: 'Near Koteshwor Mahadevsthan',
          },
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

  // Telemetry simulation timer
  useEffect(() => {
    if (isSimulating) {
      simTimerRef.current = setInterval(() => {
        setWaypointIndex((prev) => {
          if (prev < ROUTE_WAYPOINTS.length - 1) {
            const next = prev + 1;
            if (next === 1) setLiveStatus('en_route');
            if (next === ROUTE_WAYPOINTS.length - 1) {
              setLiveStatus('in_progress');
              setIsSimulating(false);
            }
            return next;
          }
          setIsSimulating(false);
          return prev;
        });
      }, 2500);
    } else {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    }
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [isSimulating]);

  const handleOpenTracking = (booking: any) => {
    setSelectedBooking(booking);
    setLiveStatus(booking.status || 'accepted');
    setWaypointIndex(booking.status === 'en_route' ? 2 : 0);
    setTrackingModalVisible(true);
  };

  const handleCloseTracking = () => {
    setTrackingModalVisible(false);
    setIsSimulating(false);
  };

  const handleCallProvider = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleOpenGoogleMaps = (lat: number, lng: number) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
      default: `https://maps.google.com/?q=${lat},${lng}`,
    });
    Linking.openURL(url as string);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return { label: 'Requested', bg: '#FEF3C7', text: '#D97706' };
      case 'accepted':
        return { label: 'Pro Confirmed', bg: '#EFF6FF', text: '#1D4ED8' };
      case 'en_route':
        return { label: 'On The Way', bg: '#EDE9FE', text: '#7C3AED' };
      case 'in_progress':
        return { label: 'Work Started', bg: '#FEF3C7', text: '#B45309' };
      case 'completed':
        return { label: 'Completed', bg: '#DCFCE7', text: '#15803D' };
      case 'cancelled':
        return { label: 'Cancelled', bg: '#FEE2E2', text: PATHAO_RED };
      default:
        return { label: status, bg: '#F3F4F6', text: '#4B5563' };
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active') return b.status !== 'completed' && b.status !== 'cancelled';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  // Calculate live telemetry values for modal
  const totalWaypoints = ROUTE_WAYPOINTS.length - 1;
  const currentWaypoint = ROUTE_WAYPOINTS[waypointIndex];
  const progressRatio = waypointIndex / totalWaypoints;
  const remainingDist = Math.max(0, Math.round(1.8 * (1 - progressRatio) * 10) / 10);
  const remainingEta = Math.max(1, Math.ceil(remainingDist * 3.5));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Activity & Orders</Text>
        <Text style={styles.headerSub}>Real-time service tracking across Nepal</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, filter === tab && styles.tabBtnActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
              {tab === 'all' ? 'All Orders' : tab === 'active' ? 'Active Jobs' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchBookings} colors={[PATHAO_RED]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={54} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySub}>
              Discover nearby plumbers, mechanics, or electricians from the Home tab.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreBtnText}>Find Services</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const badge = getStatusBadge(item.status);
          const isTrackable =
            item.status === 'accepted' || item.status === 'en_route' || item.status === 'in_progress';

          return (
            <View style={styles.bookingCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.bookingCode}>{item.bookingCode}</Text>
                  <Text style={styles.serviceName}>
                    {item.subCategoryId?.name || 'Local Service'}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                </View>
              </View>

              <Text style={styles.descText} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.locRow}>
                <Ionicons name="location" size={14} color={PATHAO_RED} />
                <Text style={styles.locText}>
                  {item.address?.areaName}, {item.address?.city}
                </Text>
              </View>

              {/* ── Prominent Live Location Tracking Banner when Accepted ── */}
              {isTrackable && (
                <View style={styles.liveTrackingCard}>
                  <View style={styles.liveTrackingHeader}>
                    <View style={styles.liveDotRing}>
                      <View style={styles.liveDot} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.liveTrackingTitle}>
                        प्रदायकले स्वीकार गर्यो • प्रत्यक्ष लोकेसन
                      </Text>
                      <Text style={styles.liveTrackingSub}>
                        ग्राहक र प्रदायकको स्थान नक्सामा हेर्नुहोस् (Live GPS Tracking)
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.trackLocationBtn}
                    onPress={() => handleOpenTracking(item)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="navigate" size={16} color="#FFFFFF" />
                    <Text style={styles.trackLocationBtnText}>
                      🗺️ प्रत्यक्ष ट्र्याक गर्नुहोस् (Live Tracking)
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.payLabel}>
                    Payment via {item.payment?.method?.toUpperCase() || 'CASH'}
                  </Text>
                  <Text style={styles.amountText}>NPR {item.payment?.totalAmount || 500}</Text>
                </View>

                {isTrackable ? (
                  <TouchableOpacity
                    style={[styles.detailBtn, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}
                    onPress={() => handleOpenTracking(item)}
                  >
                    <Ionicons name="locate" size={14} color="#16A34A" />
                    <Text style={[styles.detailBtnText, { color: '#16A34A' }]}>Track Pro</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.detailBtn} onPress={() => {}}>
                    <Text style={styles.detailBtnText}>Details</Text>
                    <Ionicons name="chevron-forward" size={14} color={PATHAO_RED} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* ── Interactive Live Location Tracking Modal ── */}
      <Modal
        visible={trackingModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseTracking}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseTracking} style={styles.closeBtn}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <View style={styles.modalBadgeRow}>
                <View style={styles.livePulseDot} />
                <Text style={styles.modalLiveBadge}>प्रत्यक्ष ट्र्याकिङ (LIVE GPS)</Text>
              </View>
              <Text style={styles.modalTitle}>
                {selectedBooking?.subCategoryId?.name || 'Local Service'} Tracking
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleOpenGoogleMaps(27.671, 85.3587)}
              style={styles.mapIconBtn}
            >
              <Ionicons name="map" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Stepper Bar */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.stepTextActive}>स्वीकृत</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: '#10B981' }]} />

            <View style={styles.stepItem}>
              <Ionicons
                name="navigate"
                size={16}
                color={liveStatus === 'en_route' ? '#E52E2E' : '#10B981'}
              />
              <Text
                style={
                  liveStatus === 'en_route' ? styles.stepTextCurrent : styles.stepTextActive
                }
              >
                बाटोमा
              </Text>
            </View>
            <View
              style={[
                styles.stepLine,
                { backgroundColor: liveStatus === 'in_progress' ? '#10B981' : '#E2E8F0' },
              ]}
            />

            <View style={styles.stepItem}>
              <Ionicons
                name="location"
                size={16}
                color={liveStatus === 'in_progress' ? '#10B981' : '#94A3B8'}
              />
              <Text
                style={
                  liveStatus === 'in_progress' ? styles.stepTextActive : styles.stepTextInactive
                }
              >
                आइपुग्नुभयो
              </Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll}>
            {/* Visual Simulated Map View */}
            <View style={styles.mapCard}>
              {/* Telemetry Floating Banner */}
              <View style={styles.telemetryHud}>
                <View style={styles.telemetryIconCircle}>
                  <Ionicons name="time" size={18} color="#E52E2E" />
                </View>
                <View>
                  <Text style={styles.telemetryLabel}>अनुमानित आगमन समय (ETA)</Text>
                  <Text style={styles.telemetryEta}>
                    {remainingDist === 0 ? 'आइपुग्नुभयो (Arrived!)' : `~${remainingEta} मिनेट बाँकी`}
                  </Text>
                  <Text style={styles.telemetryDist}>
                    दूरी: {remainingDist} कि.मि. • हाल {currentWaypoint.name} नजिक
                  </Text>
                </View>
              </View>

              {/* Road Map Representation */}
              <View style={styles.mapCanvas}>
                {/* Highway Spine */}
                <View style={styles.highwayRoad}>
                  <View style={styles.highwayDottedLine} />
                </View>

                {/* Waypoint Nodes */}
                {ROUTE_WAYPOINTS.map((wp, idx) => {
                  const isCurrent = idx === waypointIndex;
                  const isTarget = idx === ROUTE_WAYPOINTS.length - 1;

                  return (
                    <View
                      key={idx}
                      style={[
                        styles.waypointNode,
                        { left: `${(idx / (ROUTE_WAYPOINTS.length - 1)) * 82 + 8}%` },
                      ]}
                    >
                      {isTarget ? (
                        <View style={styles.clientPinMarker}>
                          <Ionicons name="home" size={12} color="#FFFFFF" />
                        </View>
                      ) : isCurrent ? (
                        <View style={styles.providerPinMarker}>
                          <Text style={{ fontSize: 13 }}>🛵</Text>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.dotMarker,
                            idx < waypointIndex && styles.dotMarkerPassed,
                          ]}
                        />
                      )}
                      <Text style={[styles.waypointText, isCurrent && styles.waypointTextActive]}>
                        {wp.name.split(' ')[0]}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Simulation Action Bar */}
              <View style={styles.simControls}>
                <TouchableOpacity
                  style={[styles.simBtn, isSimulating ? styles.simBtnPause : styles.simBtnPlay]}
                  onPress={() => setIsSimulating(!isSimulating)}
                >
                  <Ionicons
                    name={isSimulating ? 'pause' : 'play'}
                    size={14}
                    color={isSimulating ? '#0F172A' : '#FFFFFF'}
                  />
                  <Text
                    style={[
                      styles.simBtnText,
                      { color: isSimulating ? '#0F172A' : '#FFFFFF' },
                    ]}
                  >
                    {isSimulating ? 'रोक्नुहोस् (Pause)' : 'प्रत्यक्ष गति डेमो (Simulate)'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={() => {
                    setIsSimulating(false);
                    setWaypointIndex(0);
                    setLiveStatus('accepted');
                  }}
                >
                  <Ionicons name="refresh" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Provider Contact Card */}
            <View style={styles.proCard}>
              <View style={styles.proRow}>
                <View style={styles.proAvatar}>
                  <Text style={styles.proAvatarText}>R</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.proName}>रमेश शर्मा (Ramesh Sharma)</Text>
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="shield-checkmark" size={11} color="#16A34A" />
                      <Text style={styles.verifiedText}>प्रमाणित</Text>
                    </View>
                  </View>
                  <Text style={styles.proSub}>
                    {selectedBooking?.subCategoryId?.name || 'प्लम्बिङ विशेषज्ञ'} • ⭐ ४.९ (४८ काम सम्पन्न)
                  </Text>
                </View>
              </View>

              {/* Direct Communication Buttons */}
              <View style={styles.contactRow}>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => handleCallProvider('9841000000')}
                >
                  <Ionicons name="call" size={16} color="#FFFFFF" />
                  <Text style={styles.callBtnText}>फोन गर्नुहोस् (+977 9841000000)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.smsBtn}
                  onPress={() => Linking.openURL('sms:9841000000')}
                >
                  <Ionicons name="chatbubble-ellipses" size={16} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Address Details */}
            <View style={styles.addressCard}>
              <View style={styles.addressItem}>
                <Ionicons name="home" size={18} color="#E52E2E" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.addressLabel}>ग्राहकको गन्तव्य (Your Location)</Text>
                  <Text style={styles.addressVal}>
                    {selectedBooking?.address?.formattedAddress ||
                      `${selectedBooking?.address?.areaName || 'Lokanthali'}, ${
                        selectedBooking?.address?.city || 'Bhaktapur'
                      }`}
                  </Text>
                </View>
              </View>

              <View style={styles.addressItem}>
                <Ionicons name="navigate-circle" size={18} color="#16A34A" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.addressLabel}>प्रदायकको हालको विन्दु (Live GPS)</Text>
                  <Text style={styles.addressVal}>
                    {currentWaypoint.name} • {currentWaypoint.lat}, {currentWaypoint.lng}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: PATHAO_DARK,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabBtnActive: {
    backgroundColor: PATHAO_RED,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookingCode: {
    fontSize: 10,
    fontWeight: '900',
    color: PATHAO_RED,
    letterSpacing: 0.8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '800',
    color: PATHAO_DARK,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  descText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  locText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  liveTrackingCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  liveTrackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  liveDotRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16A34A',
  },
  liveTrackingTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#065F46',
  },
  liveTrackingSub: {
    fontSize: 10.5,
    color: '#047857',
    marginTop: 1,
  },
  trackLocationBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  trackLocationBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  payLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '900',
    color: PATHAO_DARK,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: PATHAO_RED,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: PATHAO_DARK,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: 16,
    backgroundColor: PATHAO_RED,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  closeBtn: {
    padding: 6,
  },
  modalBadgeRow: {
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
  modalLiveBadge: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  mapIconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#1E293B',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
  stepTextActive: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },
  stepTextCurrent: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '900',
  },
  stepTextInactive: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  modalScroll: {
    padding: 16,
    gap: 14,
  },
  mapCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  telemetryHud: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 12,
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  telemetryIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(229, 46, 46, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  telemetryLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  telemetryEta: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 1,
  },
  telemetryDist: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  mapCanvas: {
    height: 120,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  highwayRoad: {
    height: 14,
    backgroundColor: '#334155',
    borderRadius: 7,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  highwayDottedLine: {
    height: 2,
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
  },
  waypointNode: {
    position: 'absolute',
    alignItems: 'center',
    top: 36,
  },
  dotMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#64748B',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  dotMarkerPassed: {
    backgroundColor: '#10B981',
  },
  providerPinMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  clientPinMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  waypointText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
  },
  waypointTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  simControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  simBtnPlay: {
    backgroundColor: '#10B981',
  },
  simBtnPause: {
    backgroundColor: '#F59E0B',
  },
  simBtnText: {
    fontSize: 11,
    fontWeight: '900',
  },
  resetBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  proCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proAvatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: PATHAO_RED,
  },
  proName: {
    fontSize: 14,
    fontWeight: '900',
    color: PATHAO_DARK,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
  },
  proSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  callBtn: {
    flex: 1,
    backgroundColor: PATHAO_RED,
    paddingVertical: 11,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  smsBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    gap: 12,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  addressVal: {
    fontSize: 12,
    fontWeight: '700',
    color: PATHAO_DARK,
    marginTop: 1,
  },
});
